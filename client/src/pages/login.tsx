import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast({
        title: "Validation Error",
        description: "Please enter both username and password",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await login(username, password);
      // Login is handled by the auth hook
    } catch (error) {
      toast({
        title: "Authentication Failed",
        description: "Invalid username or password",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // For demo purposes, auto-fill with demo credentials
  const fillDemoCredentials = () => {
    setUsername('admin');
    setPassword('password');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            A+
          </div>
          <h1 className="text-2xl font-bold text-neutral-800">ASSET-PLUS</h1>
          <p className="text-neutral-600">North West CET College Resource Management</p>
        </div>
        
        <Card className="shadow-md border-0">
          <CardHeader>
            <CardTitle className="text-xl">Login</CardTitle>
            <CardDescription>Enter your credentials to access the system</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username"
                    type="text" 
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password"
                    type="password" 
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                {isLoading ? 
                  <div className="flex items-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Logging in...
                  </div> 
                  : 'Login'
                }
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <a href="#forgot" className="text-sm text-neutral-500 hover:text-primary">Forgot password?</a>
            <Button variant="ghost" size="sm" onClick={fillDemoCredentials}>
              Demo Login
            </Button>
          </CardFooter>
        </Card>
        
        <p className="text-center text-sm text-neutral-500 mt-6">
          © 2023 North West CET College. All rights reserved.
        </p>
      </div>
    </div>
  );
}
