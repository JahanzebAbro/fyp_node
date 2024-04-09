

DROP TABLE jobs CASCADE;
DROP TABLE benefits CASCADE;
DROP TABLE job_benefits;
DROP TABLE job_questions;
DROP TABLE job_skills;
DROP TABLE jobs_job_types;

CREATE TABLE IF NOT EXISTS jobs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    status job_status_enum NOT NULL,
    title VARCHAR(50) NOT NULL,
    openings INT NOT NULL,
    description VARCHAR(5000) NOT NULL,
    style job_style_enum NOT NULL,
    address VARCHAR(150),
    postcode VARCHAR(20),
    min_pay INT,
    max_pay INT,
    cv_req BOOLEAN,
    deadline DATE,
    start_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS benefits (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    is_custom BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE TABLE IF NOT EXISTS job_benefits (
    job_id BIGINT NOT NULL,
    benefit_id INT NOT NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (benefit_id) REFERENCES benefits(id) ON DELETE RESTRICT,
    PRIMARY KEY (job_id, benefit_id)
);
CREATE TABLE IF NOT EXISTS job_questions (
    id SERIAL PRIMARY KEY,
    job_id BIGINT NOT NULL,
    question VARCHAR(200) NOT NULL,
    response_type response_type_enum,
    is_req BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS job_skills (
    id SERIAL PRIMARY KEY,
    job_id BIGINT NOT NULL,
    name VARCHAR(50) NOT NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS jobs_job_types (
    job_id BIGINT NOT NULL,
    type_id INT NOT NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (type_id) REFERENCES job_types(id) ON DELETE RESTRICT,
    PRIMARY KEY (job_id, type_id)
);

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