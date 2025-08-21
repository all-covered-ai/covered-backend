import { Router } from 'express';
import { supabase } from '../config/supabase';
import { authenticateUser } from '../middleware/auth';
import '../types/express';

const router = Router();

// Store push token for a user
router.post('/push-token', authenticateUser, async (req, res) => {
  try {
    const user = req.user!;
    const { pushToken } = req.body;

    if (!pushToken) {
      return res.status(400).json({ error: 'Push token is required' });
    }

    // Store/update the push token for the user
    const { error } = await supabase
      .from('user_push_tokens')
      .upsert(
        {
          user_id: user.id,
          push_token: pushToken,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id',
        }
      );

    if (error) {
      console.error('Error storing push token:', error);
      return res.status(500).json({ error: 'Failed to store push token' });
    }

    res.json({ 
      success: true, 
      message: 'Push token stored successfully' 
    });
  } catch (error) {
    console.error('Error in push token endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Send a push notification (for testing or admin use)
router.post('/send', authenticateUser, async (req, res) => {
  try {
    const { userId, title, body, data } = req.body;

    if (!userId || !title || !body) {
      return res.status(400).json({ 
        error: 'userId, title, and body are required' 
      });
    }

    // Get user's push token
    const { data: tokenData, error: tokenError } = await supabase
      .from('user_push_tokens')
      .select('push_token')
      .eq('user_id', userId)
      .single();

    if (tokenError || !tokenData?.push_token) {
      return res.status(404).json({ 
        error: 'Push token not found for user' 
      });
    }

    // Send notification using Expo's push API
    const message = {
      to: tokenData.push_token,
      title,
      body,
      data: data || {},
    };

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    const result = await response.json() as any;

    if (result.errors) {
      console.error('Expo push notification errors:', result.errors);
      return res.status(500).json({ 
        error: 'Failed to send notification',
        details: result.errors 
      });
    }

    res.json({ 
      success: true, 
      message: 'Notification sent successfully',
      result 
    });
  } catch (error) {
    console.error('Error sending push notification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;