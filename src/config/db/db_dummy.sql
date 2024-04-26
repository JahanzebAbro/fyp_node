-- USERS HAVE TO BE INPUTTED MANUALLY DUE TO ENCRYPTION
--     ('seeker1@gmail.com', 'Seeker1$', 'seeker'),
--     ('seeker2@gmail.com', 'Seeker2$', 'seeker'),
--     ('seeker3@gmail.com', 'Seeker3$', 'seeker'),
--     ('seeker4@gmail.com', 'Seeker4$', 'seeker'),
--     ('employer1@gmail.com', 'Employer1$', 'employer'),
--     ('employer2@gmail.com', 'Employer2$', 'employer'),
--     ('employer3@gmail.com', 'Employer3$', 'employer'),
--     ('employer4@gmail.com', 'Employer4$', 'employer');

-- FAKE DATA REFERED FROM CHAT GPT

INSERT INTO seekers (user_id, f_name, l_name, gender, d_o_b, bio, cv_file, profile_pic_file, address, postcode, ct_phone, ct_email, industry, work_status) VALUES 
    (1, 'John', 'Doe', 'Male', '1990-05-15', 'Experienced software developer with a strong background in computer science.','1713277542134-john_doe_cv.pdf', '1713280764728-john-doe-pic.jpg', '123 Main St', 'N1 1AA', '07123456789', 'johndoe@example.com', 'IT', TRUE),
    (2, 'Jane', 'Smith', 'Female', '1985-08-20', 'Marketing expert with over 10 years of experience in digital marketing.','1713277656325-jane_smith_cv.pdf', '1713286421442-jane-smith-pic.png', '456 Elm St', 'W1A 1AA', '07234567890', 'janesmith@example.com', 'ADV', TRUE),
    (3, 'Alice', 'Johnson', 'Female', '1992-11-30', 'Creative graphic designer with a passion for branding and design.','1713277705836-alice_johnson_cv.pdf', '1713286544917-alice-johnson-pic.jpg', '789 Oak St', 'EC1A 1BB', '07345678901', 'alicejohnson@example.com', 'ART', TRUE),
    (4, 'Bob', 'Brown', 'Male', '1988-02-10', 'Certified public accountant with expertise in financial analysis and auditing.','1713277745267-bob_brown_cv.pdf', '', '101 Pine St', 'SW1A 1AA', '07456789012', 'bobbrown@example.com', 'FIN', TRUE);


INSERT INTO employers (user_id, name, size, bio, website, profile_pic_file, address, postcode, ct_phone, ct_email, industry) VALUES 
    (5, 'Tech Solutions Ltd', 200, 'Leading provider of IT solutions and services worldwide.', 'http://www.techsolutions.com', '1713287695746-tech-solutions-pic.jpeg', '100 Tech Way', 'E1 1EE', '07567890123', 'contact@techsolutions.com', 'IT'),
    (6, 'Market Pros', 50, 'Innovative marketing agency that helps brands connect with their audience.', 'http://www.marketpros.com', '', '200 Market Ave', 'NW1 4AQ', '07678901234', 'info@marketpros.com', 'ADV'),
    (7, 'Design Hub Inc', 75, 'Creative agency specializing in web design, branding, and user experience.', 'http://www.designhub.com', '', '300 Design Ln', 'SE1 9SG', '07789012345', 'hello@designhub.com', 'ART'),
    (8, 'Finance Plus', 150, 'Trusted financial consulting firm with a track record of excellence.', 'http://www.financeplus.com', '', '400 Finance St', 'W1J 7NT', '07890123456', 'support@financeplus.com', 'FIN');


INSERT INTO benefits (name, is_custom) VALUES
    ('Health insurance', FALSE),
    ('Life insurance', FALSE),
    ('Dental insurance', FALSE),
    ('Retirement planning', FALSE),
    ('Sick pay', FALSE),
    ('Flexible working', FALSE),
    ('Holiday pay', FALSE),
    ('Disability insurance', FALSE),
    ('Miscarriage leave', FALSE),
    ('Pension', FALSE),
    ('Professional development', FALSE),
    ('Education assistance', FALSE),
    ('Mental health coverage', FALSE),
    ('Company cars', FALSE),
    ('Employee discounts', FALSE),
    ('Family leave', FALSE),
    ('Flexible Spending account', FALSE),
    ('Food and beverages', FALSE),
    ('Gym membership', FALSE),
    ('Remote work options', FALSE);


INSERT INTO job_types(name) VALUES
    ('Full-time'),
    ('Part-time'),
    ('Temporary'),
    ('Other');

    
INSERT INTO jobs (user_id, status, title, openings, description, style, address, postcode, min_pay, max_pay, cv_req, deadline, start_date) VALUES
    -- Jobs for employer with user_id = 5 (Tech Solutions Ltd)
    (5, 'open', 'Senior IT Analyst', 2, 'Looking for a senior IT analyst with 5+ years of experience.', 'Remote', '100 Tech Way', 'E1 1EE', 5000, 7000, TRUE, '2024-12-31', '2024-06-01'),
    (5, 'open', 'Junior Developer', 3, 'Entry-level developer role, recent graduates welcome.', 'In-person', '100 Tech Way', 'E1 1EE', 3000, 4000, FALSE, '2024-11-30', '2024-07-01'),
    (5, 'open', 'System Administrator', 1, 'Experienced sysadmin with Linux and cloud expertise needed.', 'Hybrid', '100 Tech Way', 'E1 1EE', 4000, 5500, TRUE, '2024-10-31', '2024-08-01'),
    (5, 'open', 'Project Manager', 1, 'Seeking an IT project manager with agile methodology experience.', 'Remote', '100 Tech Way', 'E1 1EE', 6000, 8000, TRUE, '2024-09-30', '2024-09-01'),
    (5, 'open', 'Database Specialist', 1, 'Need a database specialist skilled in SQL and NoSQL databases.', 'In-person', '100 Tech Way', 'E1 1EE', 4500, 6500, FALSE, '2024-08-31', '2024-10-01'),

    -- Jobs for employer with user_id = 6 (Market Pros)
    (6, 'open', 'Digital Marketing Coordinator', 2, 'Seeking a coordinator to lead our digital marketing campaigns.', 'Remote', '200 Market Ave', 'NW1 4AQ', 3500, 5000, TRUE, '2024-07-31', '2024-06-15'),
    (6, 'open', 'SEO Specialist', 1, 'Looking for an SEO specialist to optimize our online presence.', 'Hybrid', '200 Market Ave', 'NW1 4AQ', 3000, 4500, FALSE, '2024-06-30', '2024-07-10'),
    (6, 'open', 'Content Writer', 3, 'Hiring content writers to create engaging content across platforms.', 'Remote', '200 Market Ave', 'NW1 4AQ', 2500, 3500, FALSE, '2024-05-31', '2024-08-01'),
    (6, 'open', 'Social Media Manager', 1, 'Need a creative social media manager to join our team.', 'In-person', '200 Market Ave', 'NW1 4AQ', 4000, 5500, TRUE, '2024-04-30', '2024-09-01'),
    (6, 'open', 'Marketing Analyst', 2, 'Data-driven marketing analyst required for market research.', 'Hybrid', '200 Market Ave', 'NW1 4AQ', 4500, 6000, TRUE, '2024-03-31', '2024-10-01'),

    -- Jobs for employer with user_id = 7 (Design Hub Inc)
    (7, 'open', 'Graphic Designer', 2, 'Innovative graphic designer needed to create compelling visuals.', 'Remote', '300 Design Ln', 'SE1 9SG', 3500, 5000, TRUE, '2024-02-28', '2024-06-20'),
    (7, 'open', 'UI/UX Designer', 2, 'User-focused designer to improve app and website interfaces.', 'In-person', '300 Design Ln', 'SE1 9SG', 4000, 6000, FALSE, '2024-01-31', '2024-07-15'),
    (7, 'open', 'Web Developer', 3, 'Seeking a front-end web developer with HTML, CSS, and JS expertise.', 'Hybrid', '300 Design Ln', 'SE1 9SG', 4500, 6500, TRUE, '2023-12-31', '2024-08-10'),
    (7, 'open', 'Creative Director', 1, 'Looking for a creative director to lead our design team.', 'Remote', '300 Design Ln', 'SE1 9SG', 7000, 9000, TRUE, '2023-11-30', '2024-09-05'),
    (7, 'open', 'Product Designer', 1, 'Product designer needed to conceptualize and design new products.', 'In-person', '300 Design Ln', 'SE1 9SG', 6000, 8000, FALSE, '2023-10-31', '2024-10-10'),

    -- Jobs for employer with user_id = 8 (Finance Plus)
    (8, 'open', 'Financial Advisor', 2, 'Experienced financial advisor for wealth management and planning.', 'Remote', '400 Finance St', 'W1J 7NT', 5000, 7000, TRUE, '2024-09-30', '2024-06-25'),
    (8, 'open', 'Accountant', 4, 'Accountant with a keen eye for detail and knowledge of tax law.', 'Hybrid', '400 Finance St', 'W1J 7NT', 4500, 6000, TRUE, '2024-08-31', '2024-07-20'),
    (8, 'open', 'Risk Analyst', 1, 'Seeking a risk analyst to evaluate financial risks and investment opportunities.', 'In-person', '400 Finance St', 'W1J 7NT', 5500, 7500, FALSE, '2024-07-31', '2024-08-15'),
    (8, 'open', 'Compliance Officer', 1, 'Compliance officer needed to oversee regulatory compliance.', 'Remote', '400 Finance St', 'W1J 7NT', 6000, 8500, TRUE, '2024-06-30', '2024-09-10'),
    (8, 'open', 'Investment Banker', 2, 'Dynamic investment banker to drive mergers, acquisitions, and capital raising.', 'Hybrid', '400 Finance St', 'W1J 7NT', 8000, 12000, TRUE, '2024-05-31', '2024-10-15');


INSERT INTO jobs_job_types (job_id, type_id) VALUES
    (1, 1), (1, 2),
    (2, 1),
    (3, 1), (3, 2),
    (4, 2), (4, 4),
    (5, 1), (5, 2),
    (6, 1), (6, 2), (6, 3),
    (7, 1),
    (8, 2), (8, 3),
    (9, 1), (9, 3),
    (10, 1),
    (11, 1), (11, 4),
    (12, 1), (12, 2),
    (13, 2),
    (14, 1), (14, 3),
    (15, 1),
    (16, 1), (16, 2),
    (17, 1), (17, 3),
    (18, 1), (18, 4),
    (19, 2),
    (20, 1), (20, 2), (20, 4);


INSERT INTO job_questions (job_id, question, response_type, is_req) VALUES
    (1, 'How do you handle tight deadlines?', 'text', TRUE),
    (1, 'Are you legally eligible to work in the UK?', 'bool', TRUE),
    (2, 'Describe your experience with project management tools.', 'text', TRUE),
    (2, 'Rate your expertise in project scheduling from 1 to 10.', 'num', FALSE),
    (3, 'What is your approach to software development?', 'text', TRUE),
    (4, 'What is your experience with financial regulations?', 'text', TRUE),
    (4, 'Estimate the average budget you have managed.', 'num', TRUE),
    (4, 'Do you have any certifications in finance or accounting?', 'bool', FALSE),
    (5, 'Describe a complex technical issue you have solved.', 'text', TRUE),
    (6, 'What is your approach to content marketing?', 'text', TRUE),
    (6, 'How do you evaluate the ROI of a marketing campaign?', 'num', TRUE),
    (7, 'Which design software are you most proficient with?', 'text', TRUE),
    (7, 'Do you have experience in responsive web design?', 'bool', TRUE),
    (8, 'What are your strategies for effective team management?', 'text', TRUE),
    (8, 'How many team members have you managed in past projects?', 'num', TRUE),
    (9, 'Have you worked with CRM software?', 'bool', TRUE),
    (10, 'What methods do you use to prioritize customer support tickets?', 'text', TRUE),
    (11, 'Describe your process for conducting market analysis.', 'text', TRUE),
    (12, 'What challenges have you faced in logistics management?', 'text', TRUE),
    (13, 'How do you ensure food safety in your restaurant?', 'text', TRUE),
    (14, 'What techniques do you use to improve guest experiences?', 'text', TRUE),
    (15, 'Describe your experience with stage management.', 'text', TRUE),
    (16, 'What agricultural practices are you familiar with?', 'text', TRUE),
    (17, 'How do you handle construction project delays?', 'text', TRUE),
    (18, 'What is your experience in pharmaceutical sales?', 'text', TRUE),
    (19, 'How do you handle network failures?', 'text', TRUE),
    (20, 'What strategies do you use to engage a global audience?', 'text', TRUE),
    (20, 'How do you assess global market trends?', 'num', TRUE);


INSERT INTO job_skills (job_id, name) VALUES
    (1, 'Time Management'),
    (1, 'Agile Methodologies'),
    (1, 'Problem-Solving'),
    (2, 'Financial Analysis'),
    (2, 'Budget Management'),
    (3, 'Software Development'),
    (3, 'Unit Testing'),
    (4, 'Communication'),
    (4, 'Critical Thinking'),
    (5, 'IT Infrastructure Knowledge'),
    (5, 'Network Security'),
    (6, 'Digital Marketing'),
    (6, 'SEO/SEM'),
    (6, 'Content Creation'),
    (7, 'Graphic Design'),
    (7, 'Adobe Creative Suite'),
    (8, 'User Experience Design'),
    (8, 'Wireframing'),
    (9, 'Project Management'),
    (9, 'Stakeholder Engagement'),
    (10, 'JavaScript'),
    (10, 'React.js'),
    (11, 'Crisis Management'),
    (11, 'Strategic Planning'),
    (12, 'Data Analysis'),
    (12, 'Cloud Management'),
    (13, 'Customer Service'),
    (13, 'Hospitality Management'),
    (14, 'Marketing Strategy'),
    (14, 'Data-Driven Decision Making'),
    (15, 'Fitness Training'),
    (15, 'Nutritional Planning'),
    (16, 'Client Relationship Management'),
    (17, 'Automation Tools'),
    (17, 'Team Leadership'),
    (18, 'Stress Management'),
    (18, 'Operational Efficiency'),
    (19, 'Renewable Energy Systems'),
    (19, 'Sustainability Practices'),
    (20, 'Software Development'),
    (20, 'Agile Methodologies'),
    (20, 'Continuous Integration');


INSERT INTO job_benefits (job_id, benefit_id) VALUES
    (1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
    (2, 6), (2, 7), (2, 8), (2, 9),
    (3, 10), (3, 11), (3, 12), (3, 13), (3, 14),
    (4, 15), (4, 16), (4, 17), (4, 18),
    (5, 19), (5, 20), (5, 1), (5, 2), (5, 3),
    (6, 4), (6, 5), (6, 6), (6, 7),
    (7, 8), (7, 9), (7, 10), (7, 11),
    (8, 12), (8, 13), (8, 14), (8, 15),
    (9, 16), (9, 17), (9, 18), (9, 19),
    (10, 20), (10, 1), (10, 2), (10, 3), (10, 4),
    (11, 5), (11, 6), (11, 7), (11, 8), (11, 9),
    (12, 10), (12, 11), (12, 12),
    (13, 13), (13, 14), (13, 15), (13, 16),
    (14, 17), (14, 18), (14, 19), (14, 20),
    (15, 1), (15, 2), (15, 3), (15, 4), (15, 5),
    (16, 6), (16, 7), (16, 8), (16, 9),
    (17, 10), (17, 11), (17, 12), (17, 13), (17, 14),
    (18, 15), (18, 16), (18, 17), (18, 18),
    (19, 19), (19, 20), (19, 1), (19, 2), (19, 3),
    (20, 4), (20, 5), (20, 6), (20, 7), (20, 8);



INSERT INTO applications (seeker_id, job_id, status, ct_email, cv_file, created_at) VALUES
    (1, 1, 'pending', 'johndoe@example.com', '1713277542134-john_doe_cv.pdf', '2023-10-01 08:30:00'),
    (1, 5, 'accepted', 'johndoe@example.com', '1713277542134-john_doe_cv.pdf', '2023-10-02 09:00:00'),
    (1, 10, 'pending', 'johndoe@example.com', '1713277542134-john_doe_cv.pdf', '2023-10-03 10:15:00'),
    (1, 15, 'declined', 'johndoe@example.com', '1713277542134-john_doe_cv.pdf', '2023-10-13 20:00:00'),
    (1, 14, 'pending', 'johndoe@example.com', '1713277542134-john_doe_cv.pdf', '2023-10-20 08:00:00'),
    (2, 2, 'pending', 'janesmith@example.com', '1713277656325-jane_smith_cv.pdf', '2023-10-04 11:00:00'),
    (2, 6, 'pending', 'janesmith@example.com', '1713277656325-jane_smith_cv.pdf', '2023-10-05 12:00:00'),
    (2, 11, 'accepted', 'janesmith@example.com', '1713277656325-jane_smith_cv.pdf', '2023-10-06 13:30:00'),
    (2, 16, 'accepted', 'janesmith@example.com', '1713277656325-jane_smith_cv.pdf', '2023-10-14 21:00:00'),
    (2, 19, 'pending', 'janesmith@example.com', '1713277656325-jane_smith_cv.pdf', '2023-10-21 09:00:00'),
    (3, 3, 'reviewing', 'alicejohnson@example.com', '1713277705836-alice_johnson_cv.pdf', '2023-10-07 14:30:00'),
    (3, 7, 'reviewing', 'alicejohnson@example.com', '1713277705836-alice_johnson_cv.pdf', '2023-10-08 15:00:00'),
    (3, 12, 'reviewing', 'alicejohnson@example.com', '1713277705836-alice_johnson_cv.pdf', '2023-10-09 16:00:00'),
    (3, 17, 'accepted', 'alicejohnson@example.com', '1713277705836-alice_johnson_cv.pdf', '2023-10-15 22:00:00'),
    (3, 20, 'pending', 'alicejohnson@example.com', '1713277705836-alice_johnson_cv.pdf', '2023-10-22 10:00:00'),
    (4, 4, 'declined', 'bobbrown@example.com', '1713277745267-bob_brown_cv.pdf', '2023-10-10 17:00:00'),
    (4, 8, 'pending', 'bobbrown@example.com', '1713277745267-bob_brown_cv.pdf', '2023-10-11 18:30:00'),
    (4, 9,  'pending', 'bobbrown@example.com', '1713277745267-bob_brown_cv.pdf', '2023-10-23 11:00:00'),
    (4, 13, 'pending', 'bobbrown@example.com', '1713277745267-bob_brown_cv.pdf', '2023-10-12 19:30:00'),
    (4, 18, 'pending', 'bobbrown@example.com', '1713277745267-bob_brown_cv.pdf', '2023-10-16 23:00:00');


INSERT INTO responses (application_id, question_id, response) VALUES
    -- Responses for application 1 to job 1
    (1, 1, 'I prioritize urgent tasks and set clear milestones.'),
    (1, 2, 'Yes'),

    -- Responses for application 2 to job 5
    (2, 9, 'I debugged a memory leak in an enterprise application.'),

    -- Responses for application 3 to job 10
    (3, 17, 'I systematically assess each ticket based on impact and urgency.'),

    -- Responses for application 4 to job 15
    (4, 15, 'I utilize a mix of digital tools and traditional methods for stage management.'),

    -- Responses for application 5 to job 14
    (5, 14, 'I focus on guest interaction and feedback to enhance service quality.'),

    -- Responses for application 6 to job 2
    (6, 3, 'I am proficient in using Atlassian JIRA and Microsoft Project.'),
    (6, 4, '9'),

    -- Responses for application 7 to job 6
    (7, 10, 'I use targeted content strategies to boost engagement and track KPIs.'),
    (7, 11, '350'),

    -- Responses for application 8 to job 11
    (8, 18, 'I use statistical tools and market trends to perform detailed market analysis.'),

    -- Responses for application 9 to job 16
    (9, 23, 'I am familiar with contemporary agricultural techniques including hydroponics.'),

    -- Responses for application 10 to job 19
    (10, 19, 'I implement failover systems and regular audits to prevent network failures.'),

    -- Responses for application 11 to job 3
    (11, 5, 'I use Agile methodologies to enhance software development processes.'),

    -- Responses for application 12 to job 7
    (12, 12, 'My proficiency lies in Adobe XD and Figma for UI/UX design.'),
    (12, 13, 'Yes'),

    -- Responses for application 13 to job 12
    (13, 19, 'Dealing with international shipping regulations has been challenging.'),

    -- Responses for application 14 to job 17
    (14, 24, 'I manage delays by maintaining flexible resource allocations and timelines.'),

    -- Responses for application 15 to job 20
    (15, 27, 'I use digital marketing and local insights to engage a global audience.'),
    (15, 28, '7'),

    -- Responses for application 16 to job 4
    (16, 6, 'I ensure compliance with financial regulations through continuous training.'),
    (16, 7, 'Approximately $1.2 million'),
    (16, 8, 'No'),

    -- Responses for application 17 to job 8
    (17, 14, 'My strategy includes weekly team meetings and transparent communication.'),
    (17, 15, '20'),

    -- Responses for application 18 to job 9
    (18, 16, 'Yes, I have extensive experience with Salesforce CRM.'),

    -- Responses for application 19 to job 13
    (19, 20, 'I ensure all food handlers are certified and adhere to health codes.'),

    -- Responses for application 20 to job 18
    (20, 25, 'I focus on relationship building and in-depth product knowledge.');


INSERT INTO seeker_views (seeker_id, view_date, view_count) VALUES
    (1, '2024-03-15', 3),
    (1, '2024-03-16', 5),
    (1, '2024-03-17', 20),
    (1, '2024-03-18', 9),
    (1, '2024-03-19', 11),
    (1, '2024-03-20', 12),
    (1, '2024-03-21', 14),
    (1, '2024-03-22', 4),
    (1, '2024-03-23', 5),
    (1, '2024-03-24', 15),
    (1, '2024-03-25', 7),
    (1, '2024-03-26', 4),
    (1, '2024-03-27', 8),
    (1, '2024-03-28', 3),
    (1, '2024-03-29', 10),
    (1, '2024-03-30', 12),
    (1, '2024-03-31', 23),
    (1, '2024-04-01', 13),
    (1, '2024-04-02', 17),
    (1, '2024-04-03', 11),
    (1, '2024-04-04', 12),
    (1, '2024-04-05', 20);

    
