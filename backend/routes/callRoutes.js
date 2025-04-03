
const express = require('express');
const pool = require('../utils/db');
const twilio = require('twilio');

const router = express.Router();

// Get all calls
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM calls ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching calls:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get call by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM calls WHERE id = ?',
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Call not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching call:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Make a new call
router.post('/make-call', async (req, res) => {
  try {
    const { to, from, agentId } = req.body;
    
    if (!to || !from) {
      return res.status(400).json({ message: 'To and from numbers are required' });
    }
    
    // Create Twilio client
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    
    // Make the call
    const call = await client.calls.create({
      to,
      from,
      url: `${process.env.BASE_URL}/api/twilio/voice`,
      statusCallback: `${process.env.BASE_URL}/api/twilio/call-status`,
      statusCallbackMethod: 'POST',
    });
    
    // Save call to database
    const [result] = await pool.query(
      'INSERT INTO calls (call_sid, from_number, to_number, status, agent_id) VALUES (?, ?, ?, ?, ?)',
      [call.sid, from, to, call.status, agentId]
    );
    
    res.status(201).json({
      id: result.insertId,
      callSid: call.sid,
      from,
      to,
      status: call.status,
      agentId
    });
  } catch (error) {
    console.error('Error making call:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update agent status
router.put('/agent-status/:agentId', async (req, res) => {
  try {
    const { status } = req.body;
    const agentId = req.params.agentId;
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    await pool.query(
      'UPDATE agents SET status = ? WHERE id = ?',
      [status, agentId]
    );
    
    res.json({ message: 'Agent status updated successfully' });
  } catch (error) {
    console.error('Error updating agent status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
