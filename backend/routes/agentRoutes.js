
const express = require('express');
const router = express.Router();
const pool = require('../utils/db');

// Get all agents
router.get('/', async (req, res) => {
  try {
    const [agents] = await pool.query(`
      SELECT a.*, 
        (SELECT GROUP_CONCAT(skill_name) 
         FROM agent_skills AS s 
         WHERE s.agent_id = a.id) as skills
      FROM agents AS a
    `);
    
    // Format skills as arrays
    const formattedAgents = agents.map(agent => ({
      ...agent,
      skills: agent.skills ? agent.skills.split(',') : [],
      createdAt: agent.created_at
    }));
    
    res.json(formattedAgents);
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
});

// Get agent by ID
router.get('/:id', async (req, res) => {
  try {
    const [agents] = await pool.query(`
      SELECT a.*, 
        (SELECT GROUP_CONCAT(skill_name) 
         FROM agent_skills AS s 
         WHERE s.agent_id = a.id) as skills
      FROM agents AS a
      WHERE a.id = ?
    `, [req.params.id]);
    
    if (agents.length === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    const agent = agents[0];
    agent.skills = agent.skills ? agent.skills.split(',') : [];
    agent.createdAt = agent.created_at;
    
    res.json(agent);
  } catch (error) {
    console.error('Error fetching agent:', error);
    res.status(500).json({ error: 'Failed to fetch agent' });
  }
});

// Create a new agent
router.post('/', async (req, res) => {
  const { name, email, phone, status, skills } = req.body;
  
  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Name, email, and phone are required' });
  }
  
  try {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Insert agent
      const [result] = await connection.query(
        'INSERT INTO agents (name, email, phone, status) VALUES (?, ?, ?, ?)',
        [name, email, phone, status || 'offline']
      );
      
      const agentId = result.insertId;
      
      // Add skills if provided
      if (skills && skills.length > 0) {
        const skillValues = skills.map(skill => [agentId, skill]);
        await connection.query(
          'INSERT INTO agent_skills (agent_id, skill_name) VALUES ?',
          [skillValues]
        );
      }
      
      await connection.commit();
      
      res.status(201).json({
        id: agentId,
        name,
        email,
        phone,
        status: status || 'offline',
        skills: skills || [],
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error creating agent:', error);
    res.status(500).json({ error: 'Failed to create agent' });
  }
});

// Update an agent
router.put('/:id', async (req, res) => {
  const { name, email, phone, status, skills } = req.body;
  const agentId = req.params.id;
  
  try {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Update agent
      await connection.query(
        'UPDATE agents SET name = ?, email = ?, phone = ?, status = ? WHERE id = ?',
        [name, email, phone, status, agentId]
      );
      
      // Update skills
      if (skills) {
        // Delete existing skills
        await connection.query('DELETE FROM agent_skills WHERE agent_id = ?', [agentId]);
        
        // Add new skills
        if (skills.length > 0) {
          const skillValues = skills.map(skill => [agentId, skill]);
          await connection.query(
            'INSERT INTO agent_skills (agent_id, skill_name) VALUES ?',
            [skillValues]
          );
        }
      }
      
      await connection.commit();
      
      res.json({
        id: parseInt(agentId),
        name,
        email,
        phone,
        status,
        skills: skills || [],
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating agent:', error);
    res.status(500).json({ error: 'Failed to update agent' });
  }
});

// Delete an agent
router.delete('/:id', async (req, res) => {
  const agentId = req.params.id;
  
  try {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Delete skills
      await connection.query('DELETE FROM agent_skills WHERE agent_id = ?', [agentId]);
      
      // Delete agent
      const [result] = await connection.query('DELETE FROM agents WHERE id = ?', [agentId]);
      
      await connection.commit();
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Agent not found' });
      }
      
      res.json({ message: 'Agent deleted successfully' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error deleting agent:', error);
    res.status(500).json({ error: 'Failed to delete agent' });
  }
});

// Update agent status
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  const agentId = req.params.id;
  
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }
  
  try {
    const [result] = await pool.query(
      'UPDATE agents SET status = ? WHERE id = ?',
      [status, agentId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    res.json({ id: parseInt(agentId), status });
  } catch (error) {
    console.error('Error updating agent status:', error);
    res.status(500).json({ error: 'Failed to update agent status' });
  }
});

module.exports = router;
