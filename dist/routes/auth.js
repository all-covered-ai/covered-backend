"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabase_1 = require("../config/supabase");
const auth_1 = require("../middleware/auth");
require("../types/express"); // Import type augmentation
const router = (0, express_1.Router)();
// Verify token and sync user with database
router.post('/verify', auth_1.authenticateUser, async (req, res) => {
    try {
        const user = req.user;
        // Find or create user in database
        let { data: dbUser, error: findError } = await supabase_1.supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();
        if (findError && findError.code !== 'PGRST116') { // PGRST116 = not found
            throw findError;
        }
        if (!dbUser) {
            const { data: newUser, error: createError } = await supabase_1.supabase
                .from('users')
                .insert({
                id: user.id,
                email: user.email,
                name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
            })
                .select()
                .single();
            if (createError) {
                throw createError;
            }
            dbUser = newUser;
        }
        res.json({
            success: true,
            user: {
                id: dbUser.id,
                email: dbUser.email,
                name: dbUser.name,
            }
        });
    }
    catch (error) {
        console.error('Auth verification error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
});
// Get current user profile with homes/rooms/items
router.get('/profile', auth_1.authenticateUser, async (req, res) => {
    try {
        const user = req.user;
        const { data: dbUser, error } = await supabase_1.supabase
            .from('users')
            .select(`
        *,
        homes (
          *,
          rooms (
            *,
            items (*)
          )
        )
      `)
            .eq('id', user.id)
            .single();
        if (error) {
            console.error('Profile fetch error:', error);
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({
            success: true,
            user: dbUser
        });
    }
    catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map