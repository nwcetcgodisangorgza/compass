import { useState, useEffect, createContext, useContext } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface User {
  id: number;
  username: string;
  name: string;
  role: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const TOKEN_KEY = 'asset_plus_token';

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

// Helper to get token from localStorage
const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Helper to set token in localStorage
const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Helper to remove token from localStorage
const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { data, isLoading: isUserLoading, refetch } = useQuery<User | null>({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      try {
        // Include token in auth header if it exists
        const token = getToken();
        if (!token) return null;
        
        const res = await fetch("/api/auth/me", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!res.ok) {
          if (res.status === 401) {
            // Token invalid/expired, remove it
            removeToken();
          }
          return null;
        }
        
        return await res.json();
      } catch (e) {
        console.error('Error fetching user profile:', e);
        return null;
      }
    },
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const res = await apiRequest("POST", "/api/auth/login", credentials);
      return await res.json() as AuthResponse;
    },
    onSuccess: (data) => {
      // Save the JWT token in localStorage
      setToken(data.token);
      setUser(data.user);
      // Refresh user data from server
      refetch();
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      // No need to call the server for logout with JWT
      // Just remove the token from localStorage
      removeToken();
    },
    onSuccess: () => {
      setUser(null);
    },
  });

  const login = async (username: string, password: string) => {
    await loginMutation.mutateAsync({ username, password });
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  // Use the actual user data from the API
  useEffect(() => {
    if (isUserLoading) {
      setIsLoading(true);
    } else {
      setUser(data || null);
      setIsLoading(false);
    }
  }, [data, isUserLoading]);

  // Check for token on initial load
  useEffect(() => {
    const token = getToken();
    if (token) {
      // This will trigger the query to fetch user data
      refetch();
    } else {
      setIsLoading(false);
    }
  }, [refetch]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
