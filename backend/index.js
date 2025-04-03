
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const twilio = require('twilio');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'callcenter_user',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'callcenter_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Test database connection
app.get('/api/health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    res.json({ status: 'Database connection successful' });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// API Routes
app.use('/api/agents', require('./routes/agentRoutes'));
app.use('/api/calls', require('./routes/callRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));

// Twilio webhook for incoming calls
app.post('/api/twilio/voice', (req, res) => {
  const twiml = new twilio.twiml.VoiceResponse();
  
  // Example: Direct call to an available agent or enqueue
  twiml.say('Thank you for calling our call center. Please wait while we connect you to an agent.');
  
  // In a real app, you would check for available agents and route accordingly
  twiml.dial({
    action: '/api/twilio/call-status',
    method: 'POST',
  }, process.env.AGENT_PHONE_NUMBER);
  
  res.type('text/xml');
  res.send(twiml.toString());
});

// Twilio webhook for call status updates
app.post('/api/twilio/call-status', async (req, res) => {
  const callSid = req.body.CallSid;
  const callStatus = req.body.CallStatus;
  
  try {
    // Update call status in database
    await pool.query(
      'UPDATE calls SET status = ? WHERE call_sid = ?',
      [callStatus, callSid]
    );
    
    const twiml = new twilio.twiml.VoiceResponse();
    res.type('text/xml');
    res.send(twiml.toString());
  } catch (error) {
    console.error('Error updating call status:', error);
    res.status(500).json({ error: 'Failed to update call status' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
