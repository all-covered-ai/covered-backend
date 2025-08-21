import { Router } from 'express';
import { supabase } from '../config/supabase';
import { authenticateUser } from '../middleware/auth';
import '../types/express';

const router = Router();

// Get all homes for authenticated user
router.get('/', authenticateUser, async (req, res) => {
  try {
    const user = req.user!;

    const { data: homes, error } = await supabase
      .from('homes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      homes: homes || []
    });
  } catch (error) {
    console.error('Get homes error:', error);
    res.status(500).json({ error: 'Failed to fetch homes' });
  }
});

// Create new home
router.post('/', authenticateUser, async (req, res) => {
  try {
    const user = req.user!;
    const { name, address } = req.body;

    if (!name || !address) {
      return res.status(400).json({ 
        error: 'Name and address are required' 
      });
    }

    const { data: home, error } = await supabase
      .from('homes')
      .insert({
        user_id: user.id,
        name: name.trim(),
        address: address.trim()
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json({
      success: true,
      home
    });
  } catch (error) {
    console.error('Create home error:', error);
    res.status(500).json({ error: 'Failed to create home' });
  }
});

// Update home
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const user = req.user!;
    const { id } = req.params;
    const { name, address } = req.body;

    const { data: home, error } = await supabase
      .from('homes')
      .update({
        ...(name && { name: name.trim() }),
        ...(address && { address: address.trim() }),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (!home) {
      return res.status(404).json({ error: 'Home not found' });
    }

    res.json({
      success: true,
      home
    });
  } catch (error) {
    console.error('Update home error:', error);
    res.status(500).json({ error: 'Failed to update home' });
  }
});

// Delete home
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const user = req.user!;
    const { id } = req.params;

    const { error } = await supabase
      .from('homes')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'Home deleted successfully'
    });
  } catch (error) {
    console.error('Delete home error:', error);
    res.status(500).json({ error: 'Failed to delete home' });
  }
});

// Get single home with rooms and items
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const user = req.user!;
    const { id } = req.params;

    const { data: home, error } = await supabase
      .from('homes')
      .select(`
        *,
        rooms (
          *,
          items (*)
        )
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      throw error;
    }

    if (!home) {
      return res.status(404).json({ error: 'Home not found' });
    }

    res.json({
      success: true,
      home
    });
  } catch (error) {
    console.error('Get home error:', error);
    res.status(500).json({ error: 'Failed to fetch home' });
  }
});

export default router;