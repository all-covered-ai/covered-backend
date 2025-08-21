"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabase_1 = require("../config/supabase");
const auth_1 = require("../middleware/auth");
require("../types/express");
const router = (0, express_1.Router)();
// Get all items for a room
router.get('/', auth_1.authenticateUser, async (req, res) => {
    try {
        const user = req.user;
        const { room_id } = req.query;
        if (!room_id) {
            return res.status(400).json({ error: 'room_id is required' });
        }
        // Verify user owns the room through home ownership
        const { data: room } = await supabase_1.supabase
            .from('rooms')
            .select(`
        id,
        homes!inner(user_id)
      `)
            .eq('id', room_id)
            .eq('homes.user_id', user.id)
            .single();
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }
        const { data: items, error } = await supabase_1.supabase
            .from('items')
            .select('*')
            .eq('room_id', room_id)
            .order('created_at', { ascending: false });
        if (error) {
            throw error;
        }
        res.json({
            success: true,
            items: items || []
        });
    }
    catch (error) {
        console.error('Get items error:', error);
        res.status(500).json({ error: 'Failed to fetch items' });
    }
});
// Create new item
router.post('/', auth_1.authenticateUser, async (req, res) => {
    try {
        const user = req.user;
        const { room_id, name, category, brand, model, serial_number, purchase_date, purchase_price, estimated_value, condition, notes } = req.body;
        if (!room_id || !name || !category || !estimated_value || !condition) {
            return res.status(400).json({
                error: 'room_id, name, category, estimated_value, and condition are required'
            });
        }
        // Verify user owns the room through home ownership
        const { data: room } = await supabase_1.supabase
            .from('rooms')
            .select(`
        id,
        homes!inner(user_id)
      `)
            .eq('id', room_id)
            .eq('homes.user_id', user.id)
            .single();
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }
        const { data: item, error } = await supabase_1.supabase
            .from('items')
            .insert({
            room_id,
            name: name.trim(),
            category: category,
            brand: brand?.trim(),
            model: model?.trim(),
            serial_number: serial_number?.trim(),
            purchase_date,
            purchase_price: purchase_price ? parseFloat(purchase_price) : undefined,
            estimated_value: parseFloat(estimated_value),
            condition: condition,
            notes: notes?.trim()
        })
            .select()
            .single();
        if (error) {
            throw error;
        }
        res.status(201).json({
            success: true,
            item
        });
    }
    catch (error) {
        console.error('Create item error:', error);
        res.status(500).json({ error: 'Failed to create item' });
    }
});
// Update item
router.put('/:id', auth_1.authenticateUser, async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;
        const updateData = req.body;
        // Verify user owns the item through room/home ownership
        const { data: item } = await supabase_1.supabase
            .from('items')
            .select(`
        id,
        rooms!inner(
          id,
          homes!inner(user_id)
        )
      `)
            .eq('id', id)
            .eq('rooms.homes.user_id', user.id)
            .single();
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        // Build update object with only provided fields
        const updates = {
            updated_at: new Date().toISOString()
        };
        if (updateData.name)
            updates.name = updateData.name.trim();
        if (updateData.category)
            updates.category = updateData.category;
        if (updateData.brand)
            updates.brand = updateData.brand.trim();
        if (updateData.model)
            updates.model = updateData.model.trim();
        if (updateData.serial_number)
            updates.serial_number = updateData.serial_number.trim();
        if (updateData.purchase_date)
            updates.purchase_date = updateData.purchase_date;
        if (updateData.purchase_price !== undefined)
            updates.purchase_price = parseFloat(updateData.purchase_price);
        if (updateData.estimated_value !== undefined)
            updates.estimated_value = parseFloat(updateData.estimated_value);
        if (updateData.condition)
            updates.condition = updateData.condition;
        if (updateData.notes)
            updates.notes = updateData.notes.trim();
        const { data: updatedItem, error } = await supabase_1.supabase
            .from('items')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error) {
            throw error;
        }
        res.json({
            success: true,
            item: updatedItem
        });
    }
    catch (error) {
        console.error('Update item error:', error);
        res.status(500).json({ error: 'Failed to update item' });
    }
});
// Delete item
router.delete('/:id', auth_1.authenticateUser, async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;
        // Verify user owns the item through room/home ownership
        const { data: item } = await supabase_1.supabase
            .from('items')
            .select(`
        id,
        rooms!inner(
          id,
          homes!inner(user_id)
        )
      `)
            .eq('id', id)
            .eq('rooms.homes.user_id', user.id)
            .single();
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        const { error } = await supabase_1.supabase
            .from('items')
            .delete()
            .eq('id', id);
        if (error) {
            throw error;
        }
        res.json({
            success: true,
            message: 'Item deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete item error:', error);
        res.status(500).json({ error: 'Failed to delete item' });
    }
});
exports.default = router;
//# sourceMappingURL=items.js.map