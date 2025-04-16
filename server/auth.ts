import { supabase } from './supabase';
import { storage } from './storage';
import { User } from '@shared/schema';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Secret for JWT signing
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-for-development-only';

// Generate JWT token
const generateToken = (user: User): string => {
  return jwt.sign(
    { 
      id: user.id,
      username: user.username,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Authentication methods
export const authService = {
  // Login with username and password
  async login(username: string, password: string): Promise<{ user: User; token: string } | null> {
    try {
      // Find the user
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        console.log('User not found:', username);
        return null;
      }
      
      // Verify password with bcrypt
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        console.log('Invalid password for user:', username);
        return null;
      }
      
      // Update last login time
      await storage.updateUser(user.id, { lastLogin: new Date() });
      
      // Generate JWT token
      const token = generateToken(user);
      
      // Remove sensitive information from user object
      const safeUser = { ...user };
      delete (safeUser as any).password;
      
      return { user: safeUser, token };
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  },
  
  // Register a new user
  async register(userData: any): Promise<{ user: User; token: string } | null> {
    try {
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        console.log('Username already exists:', userData.username);
        return null;
      }
      
      // Hash the password with bcrypt
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
      
      // Create the user
      const user = await storage.createUser(userData);
      
      // Generate JWT token
      const token = generateToken(user);
      
      // Remove sensitive information from user object
      const safeUser = { ...user };
      delete (safeUser as any).password;
      
      return { user: safeUser, token };
    } catch (error) {
      console.error('Registration error:', error);
      return null;
    }
  },
  
  // Verify JWT token
  verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      console.error('Token verification error:', error);
      return null;
    }
  }
};

// Auth middleware
export const authenticate = async (req: any, res: any, next: any) => {
  // Get token from header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  // Verify token
  const decoded = authService.verifyToken(token);
  
  if (!decoded) {
    return res.status(401).json({ message: 'Invalid token' });
  }
  
  // Add user to request
  req.user = decoded;
  next();
};

// Role-based authorization middleware
export const authorize = (roles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    
    next();
  };
};