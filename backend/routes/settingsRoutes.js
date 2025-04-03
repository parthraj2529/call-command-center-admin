
const express = require('express');
const pool = require('../utils/db');

const router = express.Router();

// Get all settings
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM settings');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update settings
router.put('/', async (req, res) => {
  try {
    const { name, value } = req.body;
    
    if (!name || value === undefined) {
      return res.status(400).json({ message: 'Name and value are required' });
    }
    
    await pool.query(
      'INSERT INTO settings (name, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?',
      [name, value, value]
    );
    
    res.json({ message: 'Setting updated successfully' });
  } catch (error) {
    console.error('Error updating setting:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
