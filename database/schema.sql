-- schema.sql

CREATE DATABASE IF NOT EXISTS smart_campus_db;
USE smart_campus_db;

-- Users table (supports both OAuth2 and manual authentication)
CREATE TABLE users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  google_id VARCHAR(255) UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500),
  role ENUM('USER', 'ADMIN', 'TECHNICIAN') NOT NULL DEFAULT 'USER',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Resources (Facilities & Assets)
CREATE TABLE resources (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type ENUM('LECTURE_HALL', 'LAB', 'MEETING_ROOM', 'PROJECTOR', 'CAMERA', 'OTHER') NOT NULL,
  capacity INT,
  location VARCHAR(255) NOT NULL,
  availability_start TIME,
  availability_end TIME,
  status ENUM('ACTIVE', 'OUT_OF_SERVICE') NOT NULL DEFAULT 'ACTIVE',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bookings
CREATE TABLE bookings (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  resource_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  purpose TEXT NOT NULL,
  expected_attendees INT,
  status ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
  admin_note TEXT,
  reviewed_by BIGINT,
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (resource_id) REFERENCES resources(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (reviewed_by) REFERENCES users(id)
);

-- Incident Tickets
CREATE TABLE tickets (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  resource_id BIGINT,
  reported_by BIGINT NOT NULL,
  assigned_to BIGINT,
  title VARCHAR(255) NOT NULL,
  category ENUM('ELECTRICAL', 'PLUMBING', 'IT_EQUIPMENT', 'FURNITURE', 'SAFETY', 'OTHER') NOT NULL,
  description TEXT NOT NULL,
  priority ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL DEFAULT 'MEDIUM',
  contact_details VARCHAR(255),
  status ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED') NOT NULL DEFAULT 'OPEN',
  resolution_notes TEXT,
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (resource_id) REFERENCES resources(id),
  FOREIGN KEY (reported_by) REFERENCES users(id),
  FOREIGN KEY (assigned_to) REFERENCES users(id)
);

-- Ticket Attachments
CREATE TABLE ticket_attachments (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  ticket_id BIGINT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_type VARCHAR(100),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
);

-- Comments
CREATE TABLE comments (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  ticket_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Notifications
CREATE TABLE notifications (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('BOOKING_APPROVED', 'BOOKING_REJECTED', 'BOOKING_CANCELLED', 'TICKET_STATUS_CHANGED', 'TICKET_COMMENT', 'TICKET_ASSIGNED') NOT NULL,
  reference_id BIGINT,
  reference_type ENUM('BOOKING', 'TICKET'),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_bookings_resource ON bookings(resource_id, booking_date);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
