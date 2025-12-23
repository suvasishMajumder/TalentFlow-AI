CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    dep_name VARCHAR(50) UNIQUE NOT NULL,
    dep_description TEXT,
    manager_id INT REFERENCES users(id),  -- manager must exist in users table
    email VARCHAR(60),
    status BOOLEAN DEFAULT TRUE,
    location TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO department (dep_name, dep_description, manager_id, email, status, location)
VALUES
('Operations', 'Handles day-to-day business operations', NULL, 'operations@company.com', TRUE, 'Head Office'),

('Sales & Marketing', 'Responsible for sales, branding, and marketing activities', NULL, 'sales_marketing@company.com', TRUE, 'Branch Office'),

('Technical', 'Manages IT infrastructure, development, and support', NULL, 'technical@company.com', TRUE, 'Tech Hub'),

('Administration', 'Oversees admin tasks, HR, and compliance', NULL, 'admin@company.com', TRUE, 'Head Office'),

('Maintenance', 'Responsible for facility and equipment maintenance', NULL, 'maintenance@company.com', TRUE, 'Main Facility');

CREATE TABLE leave_requests (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    start_date DATE,
    end_date DATE,
    reason TEXT,
    status BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE complaints (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    complaint_type TEXT,
    description TEXT,
    status BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO leave_requests (user_id, start_date, end_date, reason, status)
VALUES
(1, '2025-09-05', '2025-09-07', 'Family function', TRUE),
(3, '2025-09-15', '2025-09-16', 'Personal work', TRUE),
(4, '2025-09-20', '2025-09-25', 'Vacation trip', FALSE),
(5, '2025-09-28', '2025-09-29', 'Sick leave', TRUE),
(6, '2025-10-01', '2025-10-03', 'Festival holidays', TRUE),
(7, '2025-10-05', '2025-10-06', 'Urgent family matter', FALSE),
(8, '2025-10-08', '2025-10-10', 'Attending wedding', TRUE);


INSERT INTO complaints (user_id, complaint_type, description, status)
VALUES
(1, 'HR', 'Delay in salary processing for this month.', FALSE),
(3, 'Workplace', 'Air conditioning not working properly in the office.', FALSE),
(4, 'Management', 'Unfair workload distribution among team members.', TRUE),
(5, 'Facilities', 'Cafeteria hygiene is not being maintained properly.', FALSE),
(6, 'Technical', 'Unable to access VPN from home during work hours.', TRUE),
(7, 'Workplace', 'Noise disturbance from nearby construction site.', FALSE),
(8, 'HR', 'Incorrect leave balance reflected in system.', TRUE);


INSERT INTO reg_letters (user_id, last_working_day, notice_period, reason, status)
VALUES
(9, '2025-09-30', '30 days', 'Personal reasons', TRUE),
(4, '2025-10-15', '45 days', 'Better career opportunity', FALSE),
(6, '2025-09-20', '15 days', 'Relocation to another city', TRUE);





CREATE TABLE Notice (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(200),
    priority_level TEXT NOT NULL,
    target_department TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    viewcount INT DEFAULT 0
);




INSERT INTO Notice (title, description, priority_level, target_department, created_at, updated_at, viewcount)
VALUES 
('Quarterly Review Meeting', 'All departments must submit Q3 reports.', 'High', 'Executive', '2025-08-01 09:00:00', '2025-08-01 09:00:00', 12),

('Sales Target Update', 'New targets for Q4 have been released.', 'Medium', 'Sales', '2025-08-05 10:30:00', '2025-08-05 10:30:00', 8),

('Marketing Campaign Brief', 'Details of upcoming Diwali campaign.', 'Medium', 'Marketing', '2025-08-10 11:15:00', '2025-08-10 11:15:00', 5),

('Leave Policy Reminder', 'HR reminds everyone to update leave plans.', 'Low', 'HR', '2025-08-15 14:00:00', '2025-08-15 14:00:00', 20),

('Server Maintenance Alert', 'Scheduled downtime on Sept 5th, 2–4 AM.', 'High', 'IT', '2025-08-20 16:45:00', '2025-08-20 16:45:00', 18);





INSERT INTO profiles (
  user_id, education, hard_skill, degree, soft_skill, address, city,
  nationality, gender, status, mobile1, mobile2, type_of_hire, job_role, postal_code
) VALUES
(1, 'B.Sc. Computer Science', 'JavaScript, React, Node.js', 'BSc', 'Teamwork, Communication', '12 Oak St', 'Mumbai', 'India', 'female', true, '+91-900000001', NULL, 'Full-time', 'Frontend Developer', '400001'),
(6, 'M.Sc. Information Systems', 'Postgres, Prisma, SQL', 'MSc', 'Problem solving, Agile', '34 Pine Lane', 'Bengaluru', 'India', 'male', true, '+91-900000002', NULL, 'Full-time', 'Backend Engineer', '560001'),
(3, 'B.Tech IT', 'Python, Django, REST', 'BTech', 'Adaptability, Leadership', '78 Cedar Rd', 'Chennai', 'India', 'male', true, '+91-900000003', NULL, 'Full-time', 'API Engineer', '600001'),
(4, 'MBA (HR)', 'Excel, HRIS Tools', 'MBA', 'People management, Communication', '22 Maple Ave', 'Pune', 'India', 'female', true, '+91-900000004', NULL, 'Full-time', 'HR Manager', '411001'),
(5, 'B.Com', 'Accounting, QuickBooks', 'BCom', 'Attention to detail, Reliability', '50 Birch Way', 'Hyderabad', 'India', 'female', true, '+91-900000005', NULL, 'Part-time', 'Accounts Executive', '500001');



INSERT INTO public.notice
(id, title, description, priority_level, target_department, created_at, updated_at, viewcount)
VALUES
(1, 'Quarterly Review Meeting', 'All departments must submit Q3 reports.', 'High', 'Administration', '2025-08-01 09:00:00', '2025-08-01 09:00:00', 18);

INSERT INTO public.notice
(id, title, description, priority_level, target_department, created_at, updated_at, viewcount)
VALUES
(2, 'Sales Target Update', 'New targets for Q4 have been released.', 'Medium', 'Sales & Marketing', '2025-08-05 10:30:00', '2025-08-05 10:30:00', 8);

INSERT INTO public.notice
(id, title, description, priority_level, target_department, created_at, updated_at, viewcount)
VALUES
(3, 'Marketing Campaign Brief', 'Details of upcoming Diwali campaign.', 'Medium', 'Sales & Marketing', '2025-08-10 11:15:00', '2025-08-10 11:15:00', 5);

INSERT INTO public.notice
(id, title, description, priority_level, target_department, created_at, updated_at, viewcount)
VALUES
(4, 'Leave Policy Reminder', 'HR reminds everyone to update leave plans.', 'Low', 'All', '2025-08-15 14:00:00', '2025-08-15 14:00:00', 20);

INSERT INTO public.notice
(id, title, description, priority_level, target_department, created_at, updated_at, viewcount)
VALUES
(5, 'Server Maintenance Alert', 'Scheduled downtime on Sept 5th, 2-4 AM.', 'High', 'IT', '2025-08-20 16:45:00', '2025-08-20 16:45:00', 18);
