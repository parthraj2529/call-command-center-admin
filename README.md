
# Call Center Admin Panel

A comprehensive call center management system with Twilio integration, built with React, Node.js, and MySQL.

## Features

- **Dashboard**: Real-time statistics and visual reports of call center activity
- **Call Management**: Make calls, monitor agent status, and view call history
- **Agent Management**: Add, edit, and manage call center agents
- **Settings**: Configure database connections and Twilio integration

## Tech Stack

### Frontend
- React with TypeScript
- TailwindCSS for styling
- Recharts for data visualization
- React Query for API state management
- Context API for global state

### Backend
- Node.js with Express
- MySQL database
- Twilio API integration

## Getting Started

### Prerequisites

- Node.js (v14+)
- MySQL (v8+)
- Twilio account (for call features)

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd call-center-admin
```

2. **Set up the frontend**

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

3. **Set up the database**

```bash
# Import the database schema
mysql -u your_username -p < backend/database.sql
```

4. **Set up the backend**

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Update .env with your MySQL and Twilio credentials

# Start the backend server
npm run dev
```

## Backend Configuration

The backend requires the following environment variables in the `.env` file:

```
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=callcenter_db

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# For Twilio callbacks
BASE_URL=http://localhost:5000
```

## Twilio Setup

1. Create a Twilio account at https://www.twilio.com
2. Get your Account SID and Auth Token from the Twilio console
3. Purchase a phone number through Twilio
4. Update the `.env` file with your Twilio credentials
5. Configure your Twilio phone number's voice webhook to point to `http://your-server.com/api/twilio/voice`

## API Endpoints

### Agents
- `GET /api/agents` - Get all agents
- `GET /api/agents/:id` - Get agent by ID
- `POST /api/agents` - Create a new agent
- `PUT /api/agents/:id` - Update an agent
- `DELETE /api/agents/:id` - Delete an agent
- `PATCH /api/agents/:id/status` - Update agent status

### Calls
- `GET /api/calls` - Get all calls
- `GET /api/calls/:id` - Get call by ID
- `POST /api/calls` - Initiate a new call
- `PATCH /api/calls/:id/notes` - Update call notes
- `GET /api/calls/analytics/summary` - Get call analytics

### Settings
- `GET /api/settings/database` - Get database settings
- `PUT /api/settings/database` - Update database settings
- `GET /api/settings/twilio` - Get Twilio settings
- `PUT /api/settings/twilio` - Update Twilio settings

## License

This project is licensed under the MIT License - see the LICENSE file for details.
