
const express = require('express');
const router = express.Router();
const pool = require('../utils/db');

// Get database settings
router.get('/database', async (req, res) => {
  try {
    const [settings] = await pool.query('SELECT * FROM settings WHERE category = ?', ['database']);
    
    // Transform to key-value
    const dbSettings = {};
    settings.forEach(setting => {
      dbSettings[setting.key] = setting.value;
    });
    
    res.json({
      host: dbSettings.db_host || 'localhost',
      port: dbSettings.db_port || '3306',
      username: dbSettings.db_username || 'callcenter_user',
      database: dbSettings.db_name || 'callcenter_db',
      // Don't return actual password
      password: dbSettings.db_password ? '••••••••' : '',
    });
  } catch (error) {
    console.error('Error fetching database settings:', error);
    res.status(500).json({ error: 'Failed to fetch database settings' });
  }
});

// Update database settings
router.put('/database', async (req, res) => {
  const { host, port, username, password, database } = req.body;
  
  try {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Update settings one by one
      await connection.query(
        'INSERT INTO settings (category, `key`, value) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value)',
        ['database', 'db_host', host]
      );
      
      await connection.query(
        'INSERT INTO settings (category, `key`, value) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value)',
        ['database', 'db_port', port]
      );
      
      await connection.query(
        'INSERT INTO settings (category, `key`, value) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value)',
        ['database', 'db_username', username]
      );
      
      await connection.query(
        'INSERT INTO settings (category, `key`, value) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value)',
        ['database', 'db_name', database]
      );
      
      // Only update password if provided (not the masked value)
      if (password && password !== '••••••••') {
        await connection.query(
          'INSERT INTO settings (category, `key`, value) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value)',
          ['database', 'db_password', password]
        );
      }
      
      await connection.commit();
      
      res.json({
        message: 'Database settings updated successfully',
        settings: {
          host,
          port,
          username,
          database,
          password: '••••••••'
        }
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating database settings:', error);
    res.status(500).json({ error: 'Failed to update database settings' });
  }
});

// Get Twilio settings
router.get('/twilio', async (req, res) => {
  try {
    const [settings] = await pool.query('SELECT * FROM settings WHERE category = ?', ['twilio']);
    
    // Transform to key-value
    const twilioSettings = {};
    settings.forEach(setting => {
      twilioSettings[setting.key] = setting.value;
    });
    
    res.json({
      accountSid: twilioSettings.account_sid || '',
      // Don't return actual auth token
      authToken: twilioSettings.auth_token ? '••••••••••••••••••••••••••••••••' : '',
      phoneNumber: twilioSettings.phone_number || '',
      callbackUrl: twilioSettings.callback_url || '',
      enableRecording: twilioSettings.enable_recording === '1',
      enableTranscriptions: twilioSettings.enable_transcriptions === '1',
    });
  } catch (error) {
    console.error('Error fetching Twilio settings:', error);
    res.status(500).json({ error: 'Failed to fetch Twilio settings' });
  }
});

// Update Twilio settings
router.put('/twilio', async (req, res) => {
  const {
    accountSid,
    authToken,
    phoneNumber,
    callbackUrl,
    enableRecording,
    enableTranscriptions
  } = req.body;
  
  try {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Update settings one by one
      await connection.query(
        'INSERT INTO settings (category, `key`, value) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value)',
        ['twilio', 'account_sid', accountSid]
      );
      
      // Only update auth token if provided (not the masked value)
      if (authToken && authToken !== '••••••••••••••••••••••••••••••••') {
        await connection.query(
          'INSERT INTO settings (category, `key`, value) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value)',
          ['twilio', 'auth_token', authToken]
        );
      }
      
      await connection.query(
        'INSERT INTO settings (category, `key`, value) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value)',
        ['twilio', 'phone_number', phoneNumber]
      );
      
      await connection.query(
        'INSERT INTO settings (category, `key`, value) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value)',
        ['twilio', 'callback_url', callbackUrl]
      );
      
      await connection.query(
        'INSERT INTO settings (category, `key`, value) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value)',
        ['twilio', 'enable_recording', enableRecording ? '1' : '0']
      );
      
      await connection.query(
        'INSERT INTO settings (category, `key`, value) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value)',
        ['twilio', 'enable_transcriptions', enableTranscriptions ? '1' : '0']
      );
      
      await connection.commit();
      
      res.json({
        message: 'Twilio settings updated successfully',
        settings: {
          accountSid,
          authToken: '••••••••••••••••••••••••••••••••',
          phoneNumber,
          callbackUrl,
          enableRecording,
          enableTranscriptions
        }
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating Twilio settings:', error);
    res.status(500).json({ error: 'Failed to update Twilio settings' });
  }
});

module.exports = router;
