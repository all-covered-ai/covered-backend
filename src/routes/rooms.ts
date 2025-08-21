import { Router } from 'express';
import { supabase } from '../config/supabase';
import { authenticateUser } from '../middleware/auth';
import { RoomType } from '../types/database';
import '../types/express';

const router = Router();

// Get all rooms for a home
router.get('/', authenticateUser, async (req, res) => {
  try {
    const user = req.user!;
    const { home_id } = req.query;

    if (!home_id) {
      return res.status(400).json({ error: 'home_id is required' });
    }

    // Verify user owns the home
    const { data: home } = await supabase
      .from('homes')
      .select('id')
      .eq('id', home_id as string)
      .eq('user_id', user.id)
      .single();

    if (!home) {
      return res.status(404).json({ error: 'Home not found' });
    }

    const { data: rooms, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('home_id', home_id as string)
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      rooms: rooms || []
    });
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// Create new room
router.post('/', authenticateUser, async (req, res) => {
  try {
    const user = req.user!;
    const { home_id, name, room_type } = req.body;

    if (!home_id || !name || !room_type) {
      return res.status(400).json({ 
        error: 'home_id, name, and room_type are required' 
      });
    }

    // Verify user owns the home
    const { data: home } = await supabase
      .from('homes')
      .select('id')
      .eq('id', home_id)
      .eq('user_id', user.id)
      .single();

    if (!home) {
      return res.status(404).json({ error: 'Home not found' });
    }

    const { data: room, error } = await supabase
      .from('rooms')
      .insert({
        home_id,
        name: name.trim(),
        room_type: room_type as RoomType,
        is_completed: false
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json({
      success: true,
      room
    });
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ error: 'Failed to create room' });
  }
});

// Update room
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const user = req.user!;
    const { id } = req.params;
    const { name, room_type, is_completed } = req.body;

    // Verify user owns the room through home ownership
    const { data: room } = await supabase
      .from('rooms')
      .select(`
        id,
        homes!inner(user_id)
      `)
      .eq('id', id)
      .eq('homes.user_id', user.id)
      .single();

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const { data: updatedRoom, error } = await supabase
      .from('rooms')
      .update({
        ...(name && { name: name.trim() }),
        ...(room_type && { room_type: room_type as RoomType }),
        ...(typeof is_completed === 'boolean' && { is_completed }),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      room: updatedRoom
    });
  } catch (error) {
    console.error('Update room error:', error);
    res.status(500).json({ error: 'Failed to update room' });
  }
});

// Delete room
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const user = req.user!;
    const { id } = req.params;

    // Verify user owns the room through home ownership
    const { data: room } = await supabase
      .from('rooms')
      .select(`
        id,
        homes!inner(user_id)
      `)
      .eq('id', id)
      .eq('homes.user_id', user.id)
      .single();

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({ error: 'Failed to delete room' });
  }
});

export default router;