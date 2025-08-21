import { Request } from 'express';
import type { User } from '@supabase/supabase-js';

// Extend Express Request interface to include authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user: User;
}