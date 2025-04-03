
const express = require('express');
const router = express.Router();
const pool = require('../utils/db');
const twilio = require('twilio');

// Get all calls
router.get('/', async (req, res) => {
  try {
    const [calls] = await pool.query(`
      SELECT c.*, a.name as agent_name 
      FROM calls c
      LEFT JOIN agents a ON c.agent_id = a.id
      ORDER BY c.created_at DESC
    `);
    
    const formattedCalls = calls.map(call => ({
      id: call.id,
      callSid: call.call_sid,
      from: call.from_number,
      to: call.to_number,
      status: call.status,
      direction: call.direction,
      duration: call.duration,
      recordingUrl: call.recording_url,
      agentId: call.agent_id,
      agentName: call.agent_name,
      notes: call.notes,
      createdAt: call.created_at
    }));
    
    res.json(formattedCalls);
  } catch (error) {
    console.error('Error fetching calls:', error);
    res.status(500).json({ error: 'Failed to fetch calls' });
  }
});

// Get call by ID
router.get('/:id', async (req, res) => {
  try {
    const [calls] = await pool.query(`
      SELECT c.*, a.name as agent_name 
      FROM calls c
      LEFT JOIN agents a ON c.agent_id = a.id
      WHERE c.id = ?
    `, [req.params.id]);
    
    if (calls.length === 0) {
      return res.status(404).json({ error: 'Call not found' });
    }
    
    const call = calls[0];
    const formattedCall = {
      id: call.id,
      callSid: call.call_sid,
      from: call.from_number,
      to: call.to_number,
      status: call.status,
      direction: call.direction,
      duration: call.duration,
      recordingUrl: call.recording_url,
      agentId: call.agent_id,
      agentName: call.agent_name,
      notes: call.notes,
      createdAt: call.created_at
    };
    
    res.json(formattedCall);
  } catch (error) {
    console.error('Error fetching call:', error);
    res.status(500).json({ error: 'Failed to fetch call' });
  }
});

// Initiate a new call
router.post('/', async (req, res) => {
  const { to, agentId } = req.body;
  
  if (!to || !agentId) {
    return res.status(400).json({ error: 'Phone number and agent ID are required' });
  }
  
  try {
    // Get agent info
    const [agents] = await pool.query('SELECT * FROM agents WHERE id = ?', [agentId]);
    
    if (agents.length === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    const agent = agents[0];
    
    // Check if agent is available
    if (agent.status !== 'available') {
      return res.status(400).json({ error: 'Agent is not available' });
    }
    
    // Initialize Twilio client
    const twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    
    // Make a call using Twilio
    const call = await twilioClient.calls.create({
      url: `${process.env.BASE_URL}/api/twilio/connect/${agentId}`,
      to: to,
      from: process.env.TWILIO_PHONE_NUMBER,
    });
    
    // Save call to database
    const [result] = await pool.query(
      'INSERT INTO calls (call_sid, from_number, to_number, status, direction, agent_id) VALUES (?, ?, ?, ?, ?, ?)',
      [call.sid, process.env.TWILIO_PHONE_NUMBER, to, 'initiated', 'outbound', agentId]
    );
    
    // Update agent status
    await pool.query('UPDATE agents SET status = ? WHERE id = ?', ['busy', agentId]);
    
    res.status(201).json({
      id: result.insertId,
      callSid: call.sid,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
      status: 'initiated',
      direction: 'outbound',
      agentId: agentId,
      agentName: agent.name,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error initiating call:', error);
    res.status(500).json({ error: 'Failed to initiate call' });
  }
});

// Update call notes
router.patch('/:id/notes', async (req, res) => {
  const { notes } = req.body;
  const callId = req.params.id;
  
  try {
    const [result] = await pool.query(
      'UPDATE calls SET notes = ? WHERE id = ?',
      [notes, callId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Call not found' });
    }
    
    res.json({ id: parseInt(callId), notes });
  } catch (error) {
    console.error('Error updating call notes:', error);
    res.status(500).json({ error: 'Failed to update call notes' });
  }
});

// Get call analytics
router.get('/analytics/summary', async (req, res) => {
  const { startDate, endDate } = req.query;
  
  let dateFilter = '';
  const params = [];
  
  if (startDate && endDate) {
    dateFilter = 'WHERE created_at BETWEEN ? AND ?';
    params.push(startDate, endDate);
  } else if (startDate) {
    dateFilter = 'WHERE created_at >= ?';
    params.push(startDate);
  } else if (endDate) {
    dateFilter = 'WHERE created_at <= ?';
    params.push(endDate);
  }
  
  try {
    // Get total calls
    const [totalResult] = await pool.query(
      `SELECT COUNT(*) as total FROM calls ${dateFilter}`,
      params
    );
    
    // Get calls by status
    const [statusResult] = await pool.query(
      `SELECT status, COUNT(*) as count FROM calls ${dateFilter} GROUP BY status`,
      params
    );
    
    // Get calls by direction
    const [directionResult] = await pool.query(
      `SELECT direction, COUNT(*) as count FROM calls ${dateFilter} GROUP BY direction`,
      params
    );
    
    // Get average call duration
    const [durationResult] = await pool.query(
      `SELECT AVG(duration) as avg_duration FROM calls ${dateFilter} WHERE duration > 0`,
      params
    );
    
    // Get calls per agent
    const [agentResult] = await pool.query(
      `SELECT a.id, a.name, COUNT(c.id) as call_count
       FROM agents a
       LEFT JOIN calls c ON a.id = c.agent_id ${dateFilter ? 'AND ' + dateFilter.substring(6) : ''}
       GROUP BY a.id, a.name
       ORDER BY call_count DESC`,
      params
    );
    
    res.json({
      totalCalls: totalResult[0].total,
      callsByStatus: statusResult,
      callsByDirection: directionResult,
      avgDuration: durationResult[0].avg_duration || 0,
      callsPerAgent: agentResult
    });
  } catch (error) {
    console.error('Error fetching call analytics:', error);
    res.status(500).json({ error: 'Failed to fetch call analytics' });
  }
});

module.exports = router;
