
-- Create the database
CREATE DATABASE IF NOT EXISTS callcenter_db;
USE callcenter_db;

-- Users table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(100),
  `email` VARCHAR(100),
  `role` ENUM('admin', 'manager', 'user') DEFAULT 'user',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert admin user (password is "password123")
INSERT INTO `users` (`username`, `password`, `name`, `email`, `role`) VALUES
('admin', '$2b$10$9t/uv7ZOUWc9wAEOj7fMTuMazWOx2tYZO6sXOLxvS7.XjlCiCBMDm', 'Admin User', 'admin@example.com', 'admin');

-- Agents table
CREATE TABLE IF NOT EXISTS `agents` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `phone` VARCHAR(20) NOT NULL,
  `status` ENUM('available', 'busy', 'offline', 'break') DEFAULT 'offline',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Agent skills (many-to-many relationship)
CREATE TABLE IF NOT EXISTS `agent_skills` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `agent_id` INT NOT NULL,
  `skill_name` VARCHAR(50) NOT NULL,
  FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `agent_skill_unique` (`agent_id`, `skill_name`)
);

-- Calls table
CREATE TABLE IF NOT EXISTS `calls` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `call_sid` VARCHAR(100) UNIQUE,
  `from_number` VARCHAR(20) NOT NULL,
  `to_number` VARCHAR(20) NOT NULL,
  `status` ENUM('queued', 'initiated', 'ringing', 'in-progress', 'completed', 'failed', 'busy', 'no-answer') NOT NULL,
  `direction` ENUM('inbound', 'outbound') NOT NULL,
  `duration` INT DEFAULT 0,
  `recording_url` VARCHAR(255),
  `agent_id` INT,
  `notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON DELETE SET NULL
);

-- Settings table
CREATE TABLE IF NOT EXISTS `settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category` VARCHAR(50) NOT NULL,
  `key` VARCHAR(100) NOT NULL,
  `value` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `category_key_unique` (`category`, `key`)
);

-- Insert sample data
-- Sample agents
INSERT INTO `agents` (`name`, `email`, `phone`, `status`) VALUES
('John Doe', 'john.doe@example.com', '+1234567890', 'available'),
('Jane Smith', 'jane.smith@example.com', '+1987654321', 'busy'),
('Robert Johnson', 'robert.j@example.com', '+1122334455', 'offline');

-- Sample agent skills
INSERT INTO `agent_skills` (`agent_id`, `skill_name`) VALUES
(1, 'sales'),
(1, 'support'),
(2, 'technical'),
(2, 'billing'),
(3, 'support'),
(3, 'onboarding');

-- Sample calls
INSERT INTO `calls` (`call_sid`, `from_number`, `to_number`, `status`, `direction`, `duration`, `agent_id`) VALUES
('CA123456789', '+1234567890', '+9876543210', 'completed', 'inbound', 120, 1),
('CA987654321', '+9876543210', '+1234567890', 'completed', 'outbound', 300, 2),
('CA567891234', '+5678912345', '+9876543210', 'failed', 'inbound', 0, NULL);

-- Sample settings
INSERT INTO `settings` (`category`, `key`, `value`) VALUES
('database', 'db_host', 'localhost'),
('database', 'db_port', '3306'),
('database', 'db_username', 'callcenter_user'),
('database', 'db_password', 'password'),
('database', 'db_name', 'callcenter_db'),
('twilio', 'account_sid', 'AC********************************'),
('twilio', 'auth_token', '********************************'),
('twilio', 'phone_number', '+15551234567'),
('twilio', 'callback_url', 'https://your-server.com/twilio/webhook'),
('twilio', 'enable_recording', '1'),
('twilio', 'enable_transcriptions', '0');
