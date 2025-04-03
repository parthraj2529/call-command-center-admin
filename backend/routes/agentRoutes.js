
const express = require('express');
const pool = require('../utils/db');

const router = express.Router();

// Get all agents
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM agents');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get agent by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM agents WHERE id = ?',
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching agent:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new agent
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, status } = req.body;
    
    if (!name || !phone) {
      return res.status(400).json({ message: 'Name and phone are required' });
    }
    
    const [result] = await pool.query(
      'INSERT INTO agents (name, phone, email, status) VALUES (?, ?, ?, ?)',
      [name, phone, email, status || 'offline']
    );
    
    res.status(201).json({
      id: result.insertId,
      name,
      phone,
      email,
      status: status || 'offline'
    });
  } catch (error) {
    console.error('Error creating agent:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update agent
router.put('/:id', async (req, res) => {
  try {
    const { name, phone, email, status } = req.body;
    const agentId = req.params.id;
    
    if (!name || !phone) {
      return res.status(400).json({ message: 'Name and phone are required' });
    }
    
    await pool.query(
      'UPDATE agents SET name = ?, phone = ?, email = ?, status = ? WHERE id = ?',
      [name, phone, email, status, agentId]
    );
    
    res.json({
      id: agentId,
      name,
      phone,
      email,
      status
    });
  } catch (error) {
    console.error('Error updating agent:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete agent
router.delete('/:id', async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM agents WHERE id = ?',
      [req.params.id]
    );
    
    res.json({ message: 'Agent deleted successfully' });
  } catch (error) {
    console.error('Error deleting agent:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
