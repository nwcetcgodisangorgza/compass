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
      
      // For development, we're doing a simple comparison
      // In production, you would compare with bcrypt.compare
      if (password !== user.password) {
        console.log('Invalid password for user:', username);
        return null;
      }
      
      // Update last login time
      await storage.updateUser(user.id, { lastLogin: new Date() });
      
      // Generate JWT token
      const token = generateToken(user);
      
      return { user, token };
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
      
      // In production, you would hash the password
      // userData.password = await bcrypt.hash(userData.password, 10);
      
      // Create the user
      const user = await storage.createUser(userData);
      
      // Generate JWT token
      const token = generateToken(user);
      
      return { user, token };
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