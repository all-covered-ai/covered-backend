"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const supabase_1 = require("../config/supabase");
const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        if (!token) {
            res.status(401).json({ error: 'Access token required' });
            return;
        }
        // Verify token with Supabase
        const { data: { user }, error } = await supabase_1.supabase.auth.getUser(token);
        if (error || !user) {
            res.status(403).json({ error: 'Invalid or expired token' });
            return;
        }
        // Add user info to request
        req.user = user;
        next();
    }
    catch (error) {
        console.error('Token verification failed:', error);
        res.status(403).json({ error: 'Authentication failed' });
    }
};
exports.authenticateUser = authenticateUser;
//# sourceMappingURL=auth.js.map