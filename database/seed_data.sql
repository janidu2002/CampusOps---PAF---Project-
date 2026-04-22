-- SLIIT University Smart Campus - Seed Data
-- This file contains sample data for testing the Smart Campus Operations Hub

-- Insert Users (with hashed passwords for manual login)
-- Default passwords: admin123, tech123, student123
INSERT INTO users (google_id, email, password, name, avatar_url, role, is_active, created_at, updated_at) VALUES
('google_001', 'admin@slit.lk', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Dr. Kasun Perera', 'https://ui-avatars.com/api/?name=Kasun+Perera&background=0D8ABC&color=fff', 'ADMIN', true, NOW(), NOW()),
('google_002', 'technician1@slit.lk', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Nimal Fernando', 'https://ui-avatars.com/api/?name=Nimal+Fernando&background=28a745&color=fff', 'TECHNICIAN', true, NOW(), NOW()),
('google_003', 'technician2@slit.lk', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Kamal Jayasinghe', 'https://ui-avatars.com/api/?name=Kamal+Jayasinghe&background=28a745&color=fff', 'TECHNICIAN', true, NOW(), NOW()),
('google_004', 'student1@my.sliit.lk', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Amali Silva', 'https://ui-avatars.com/api/?name=Amali+Silva&background=6c757d&color=fff', 'USER', true, NOW(), NOW()),
('google_005', 'student2@my.sliit.lk', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Dinesh Rathnayake', 'https://ui-avatars.com/api/?name=Dinesh+Rathnayake&background=6c757d&color=fff', 'USER', true, NOW(), NOW()),
('google_006', 'lecturer1@slit.lk', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Prof. Anuradha Wijesinghe', 'https://ui-avatars.com/api/?name=Anuradha+Wijesinghe&background=17a2b8&color=fff', 'USER', true, NOW(), NOW()),
('google_007', 'staff1@slit.lk', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Sunimal Bandara', 'https://ui-avatars.com/api/?name=Sunimal+Bandara&background=6c757d&color=fff', 'USER', true, NOW(), NOW()),
('google_008', 'student3@my.sliit.lk', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Piyumi Samarasinghe', 'https://ui-avatars.com/api/?name=Piyumi+Samarasinghe&background=6c757d&color=fff', 'USER', true, NOW(), NOW()),
('google_009', 'student4@my.sliit.lk', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Tharindu Lakmal', 'https://ui-avatars.com/api/?name=Tharindu+Lakmal&background=6c757d&color=fff', 'USER', true, NOW(), NOW()),
('google_010', 'student5@my.sliit.lk', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Chamari Perera', 'https://ui-avatars.com/api/?name=Chamari+Perera&background=6c757d&color=fff', 'USER', true, NOW(), NOW());

-- Insert Resources
INSERT INTO resources (name, type, capacity, location, availability_start, availability_end, status, description, created_at, updated_at) VALUES
-- Lecture Halls
('Main Auditorium', 'LECTURE_HALL', 300, 'Building A - Ground Floor', '08:00', '20:00', 'ACTIVE', 'Main auditorium for large lectures and events', NOW(), NOW()),
('Lecture Hall 101', 'LECTURE_HALL', 120, 'Building B - 1st Floor', '08:00', '18:00', 'ACTIVE', 'Standard lecture hall with projector', NOW(), NOW()),
('Lecture Hall 102', 'LECTURE_HALL', 120, 'Building B - 1st Floor', '08:00', '18:00', 'ACTIVE', 'Standard lecture hall with projector', NOW(), NOW()),
('Lecture Hall 201', 'LECTURE_HALL', 80, 'Building C - 2nd Floor', '08:00', '18:00', 'ACTIVE', 'Medium-sized lecture hall', NOW(), NOW()),
('Lecture Hall 202', 'LECTURE_HALL', 80, 'Building C - 2nd Floor', '08:00', '18:00', 'ACTIVE', 'Medium-sized lecture hall', NOW(), NOW()),
-- Computer Labs
('Computer Lab 1', 'LAB', 40, 'Building D - 1st Floor', '08:00', '20:00', 'ACTIVE', 'Computer lab with 40 workstations', NOW(), NOW()),
('Computer Lab 2', 'LAB', 40, 'Building D - 1st Floor', '08:00', '20:00', 'ACTIVE', 'Computer lab with 40 workstations', NOW(), NOW()),
('Computer Lab 3', 'LAB', 30, 'Building D - 2nd Floor', '08:00', '20:00', 'ACTIVE', 'Computer lab with 30 workstations', NOW(), NOW()),
('Networking Lab', 'LAB', 25, 'Building D - 3rd Floor', '08:00', '18:00', 'ACTIVE', 'Specialized networking lab', NOW(), NOW()),
-- Meeting Rooms
('Meeting Room A', 'MEETING_ROOM', 15, 'Administration Block - 1st Floor', '09:00', '17:00', 'ACTIVE', 'Small meeting room for staff', NOW(), NOW()),
('Meeting Room B', 'MEETING_ROOM', 15, 'Administration Block - 1st Floor', '09:00', '17:00', 'ACTIVE', 'Small meeting room for staff', NOW(), NOW()),
('Conference Room', 'MEETING_ROOM', 30, 'Administration Block - 2nd Floor', '09:00', '17:00', 'ACTIVE', 'Large conference room with video conferencing', NOW(), NOW()),
-- Equipment
('Epson Projector 1', 'PROJECTOR', NULL, 'Building B - Equipment Room', '08:00', '18:00', 'ACTIVE', 'High-resolution projector for presentations', NOW(), NOW()),
('Epson Projector 2', 'PROJECTOR', NULL, 'Building B - Equipment Room', '08:00', '18:00', 'ACTIVE', 'High-resolution projector for presentations', NOW(), NOW()),
('Sony Camera 1', 'CAMERA', NULL, 'Media Center', '08:00', '18:00', 'ACTIVE', 'Professional video camera for recording', NOW(), NOW()),
('Sony Camera 2', 'CAMERA', NULL, 'Media Center', '08:00', '18:00', 'ACTIVE', 'Professional video camera for recording', NOW(), NOW()),
('Laptop Cart 1', 'OTHER', 20, 'Building D - Equipment Room', '08:00', '18:00', 'ACTIVE', 'Mobile cart with 20 laptops', NOW(), NOW()),
('Laptop Cart 2', 'OTHER', 20, 'Building D - Equipment Room', '08:00', '18:00', 'ACTIVE', 'Mobile cart with 20 laptops', NOW(), NOW());

-- Insert Bookings
INSERT INTO bookings (resource_id, user_id, booking_date, start_time, end_time, purpose, expected_attendees, status, admin_note, reviewed_by, reviewed_at, created_at, updated_at) VALUES
-- Approved bookings
(1, 6, DATE_ADD(CURDATE(), INTERVAL 7 DAY), '09:00', '11:00', 'Guest Lecture by Industry Expert', 250, 'APPROVED', 'Approved by admin', 1, NOW(), NOW(), NOW()),
(2, 6, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '10:00', '12:00', 'Software Engineering Lecture', 100, 'APPROVED', NULL, 1, NOW(), NOW(), NOW()),
(6, 4, DATE_ADD(CURDATE(), INTERVAL 5 DAY), '14:00', '16:00', 'Group Project Work', 35, 'APPROVED', NULL, 1, NOW(), NOW(), NOW()),
(10, 7, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '14:00', '15:00', 'Department Meeting', 12, 'APPROVED', NULL, 1, NOW(), NOW(), NOW()),
-- Pending bookings
(3, 5, DATE_ADD(CURDATE(), INTERVAL 10 DAY), '13:00', '15:00', 'Workshop on AI', 100, 'PENDING', NULL, NULL, NULL, NOW(), NOW()),
(7, 8, DATE_ADD(CURDATE(), INTERVAL 4 DAY), '09:00', '11:00', 'Lab Session for Database Course', 35, 'PENDING', NULL, NULL, NULL, NOW(), NOW()),
(11, 6, DATE_ADD(CURDATE(), INTERVAL 6 DAY), '10:00', '12:00', 'Faculty Meeting', 25, 'PENDING', NULL, NULL, NULL, NOW(), NOW()),
-- Cancelled bookings
(4, 9, DATE_SUB(CURDATE(), INTERVAL 5 DAY), '10:00', '12:00', 'Study Group Session', 60, 'CANCELLED', 'Cancelled by user', NULL, NULL, NOW(), NOW()),
-- Rejected bookings
(5, 10, DATE_ADD(CURDATE(), INTERVAL 8 DAY), '14:00', '16:00', 'Club Meeting', 70, 'REJECTED', 'Venue already booked for another event', 1, NOW(), NOW(), NOW());

-- Insert Tickets
INSERT INTO tickets (resource_id, reported_by, assigned_to, title, category, description, priority, contact_details, status, resolution_notes, rejection_reason, created_at, updated_at) VALUES
-- Open tickets
(6, 4, 2, 'Computer not booting in Lab 1', 'IT_EQUIPMENT', 'Computer at workstation 15 in Computer Lab 1 is not booting. Shows blue screen error.', 'MEDIUM', '0771234567', 'OPEN', NULL, NULL, NOW(), NOW()),
(1, 5, 2, 'Projector not working in Lecture Hall 101', 'IT_EQUIPMENT', 'The Epson Projector in Lecture Hall 101 is not displaying properly. Light is blinking red.', 'HIGH', '0772345678', 'OPEN', NULL, NULL, NOW(), NOW()),
(10, 7, 3, 'Air conditioning not working in Meeting Room A', 'ELECTRICAL', 'The AC unit in Meeting Room A is not cooling. Room is very warm.', 'MEDIUM', '0773456789', 'OPEN', NULL, NULL, NOW(), NOW()),
-- In Progress tickets
(7, 8, 2, 'Network connectivity issues in Computer Lab 2', 'IT_EQUIPMENT', 'Several computers in Computer Lab 2 are experiencing intermittent network disconnections.', 'HIGH', '0774567890', 'IN_PROGRESS', 'Technician is checking the network switch', NULL, NOW(), NOW()),
(2, 9, 3, 'Broken chair in Lecture Hall 102', 'FURNITURE', 'One of the chairs in Lecture Hall 102 has a broken leg and is unsafe to use.', 'LOW', '0775678901', 'IN_PROGRESS', 'Replacement chair ordered', NULL, NOW(), NOW()),
-- Resolved tickets
(8, 4, 2, 'Printer paper jam in Networking Lab', 'IT_EQUIPMENT', 'The printer in Networking Lab has a paper jam that cannot be cleared.', 'MEDIUM', '0776789012', 'RESOLVED', 'Paper jam cleared, printer tested and working', NULL, NOW(), NOW()),
(12, 5, 3, 'Light flickering in Computer Lab 3', 'ELECTRICAL', 'Fluorescent light at the back of Computer Lab 3 is flickering constantly.', 'LOW', '0777890123', 'RESOLVED', 'Tube replaced', NULL, NOW(), NOW()),
-- Closed tickets
(14, 6, 2, 'Laptop Cart 1 battery not charging', 'IT_EQUIPMENT', 'Some laptops in Laptop Cart 1 are not charging properly.', 'MEDIUM', '0778901234', 'CLOSED', 'Charging cables replaced, all laptops charging', NULL, NOW(), NOW()),
(3, 7, 3, 'Whiteboard marker shortage in Lecture Hall 201', 'OTHER', 'No whiteboard markers available in Lecture Hall 201.', 'LOW', '0779012345', 'CLOSED', 'New markers supplied', NULL, NOW(), NOW()),
-- Rejected tickets
(NULL, 8, NULL, 'Request for new equipment', 'OTHER', 'We need 10 additional computers for our project work.', 'MEDIUM', '0770123456', 'REJECTED', NULL, 'This request should go through the procurement process, not as a maintenance ticket', NOW(), NOW());

-- Insert Ticket Attachments
INSERT INTO ticket_attachments (ticket_id, file_name, file_path, file_type, uploaded_at) VALUES
(1, 'blue_screen_error.jpg', 'uploads/ticket_1/blue_screen_error.jpg', 'image/jpeg', NOW()),
(2, 'projector_error.jpg', 'uploads/ticket_2/projector_error.jpg', 'image/jpeg', NOW()),
(4, 'network_diagram.png', 'uploads/ticket_4/network_diagram.png', 'image/png', NOW()),
(4, 'error_log.txt', 'uploads/ticket_4/error_log.txt', 'text/plain', NOW());

-- Insert Comments
INSERT INTO comments (ticket_id, user_id, content, created_at, updated_at) VALUES
(1, 4, 'This issue started this morning during the lab session.', NOW(), NOW()),
(1, 2, 'I will check the computer tomorrow morning. Please keep it powered off until then.', NOW(), NOW()),
(2, 5, 'The projector was working fine yesterday afternoon.', NOW(), NOW()),
(2, 2, 'Checked the projector - the lamp needs to be replaced. Ordered a new one.', NOW(), NOW()),
(3, 7, 'This has been an issue for about a week now.', NOW(), NOW()),
(3, 3, 'Will send the maintenance team to check the AC unit.', NOW(), NOW()),
(4, 8, 'The issue is affecting about 5-6 computers randomly.', NOW(), NOW()),
(4, 2, 'Found a faulty port on the network switch. Replacing it now.', NOW(), NOW()),
(4, 8, 'Thanks for the quick response!', NOW(), NOW()),
(6, 4, 'Printer is working fine now. Thank you!', NOW(), NOW());

-- Insert Notifications
INSERT INTO notifications (user_id, title, message, type, reference_id, reference_type, is_read, created_at) VALUES
-- Booking notifications
(4, 'Booking Approved', 'Your booking for Computer Lab 1 has been approved.', 'BOOKING_APPROVED', 3, 'BOOKING', false, NOW()),
(5, 'Booking Rejected', 'Your booking for Lecture Hall 201 has been rejected. Reason: Venue already booked for another event.', 'BOOKING_REJECTED', 9, 'BOOKING', false, NOW()),
(9, 'Booking Cancelled', 'Your booking for Lecture Hall 202 has been cancelled.', 'BOOKING_CANCELLED', 8, 'BOOKING', true, NOW()),
-- Ticket notifications
(4, 'Ticket Status Changed', 'Your ticket "Computer not booting in Lab 1" status changed to OPEN.', 'TICKET_STATUS_CHANGED', 1, 'TICKET', false, NOW()),
(5, 'Ticket Assigned', 'Your ticket "Projector not working in Lecture Hall 101" has been assigned to Nimal Fernando.', 'TICKET_ASSIGNED', 2, 'TICKET', false, NOW()),
(8, 'New Comment on Ticket', 'A new comment has been added to your ticket "Network connectivity issues in Computer Lab 2".', 'TICKET_COMMENT', 4, 'TICKET', false, NOW()),
(4, 'Ticket Resolved', 'Your ticket "Printer paper jam in Networking Lab" has been resolved.', 'TICKET_STATUS_CHANGED', 6, 'TICKET', true, NOW()),
(5, 'Ticket Closed', 'Your ticket "Light flickering in Computer Lab 3" has been closed.', 'TICKET_STATUS_CHANGED', 7, 'TICKET', true, NOW()),
-- Admin notifications
(1, 'New Booking Request', 'A new booking request has been submitted for Lecture Hall 102.', 'BOOKING_APPROVED', 5, 'BOOKING', false, NOW()),
(1, 'New Ticket Created', 'A new ticket "Computer not booting in Lab 1" has been created.', 'TICKET_ASSIGNED', 1, 'TICKET', true, NOW()),
(2, 'New Ticket Assigned', 'You have been assigned to ticket "Computer not booting in Lab 1".', 'TICKET_ASSIGNED', 1, 'TICKET', false, NOW()),
(3, 'New Ticket Assigned', 'You have been assigned to ticket "Air conditioning not working in Meeting Room A".', 'TICKET_ASSIGNED', 3, 'TICKET', false, NOW());
