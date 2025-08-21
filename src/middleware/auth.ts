import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ error: 'Access token required' });
      return;
    }

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      res.status(403).json({ error: 'Invalid or expired token' });
      return;
    }
    
    // Add user info to request
    req.user = user;

    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(403).json({ error: 'Authentication failed' });
  }
};