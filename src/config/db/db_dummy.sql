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

    
INSERT INTO jobs (
    user_id, 
    status,
    title, 
    openings, 
    description, 
    style, 
    address, 
    min_pay, 
    max_pay, 
    cv_req, 
    deadline, 
    start_date
) VALUES (
    4,
    'open',
    'Mechanical Engineer',
    1,
    'Description',
    'Hybrid',
    'Morrisons',
    50000,
    70000,
    TRUE,
    '2023-12-31',
    '2023-09-01'
),
(
    4,
    'hidden',
    'Engineer',
    3,
    'Description',
    'Remote',
    'Canvey',
    50000,
    70000,
    FALSE,
    '2023-12-31',
    '2023-09-01'
);