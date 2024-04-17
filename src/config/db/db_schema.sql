-- CREATE DATABASE IF NOT EXISTS fyp_recruit;

CREATE TYPE user_type_enum AS ENUM ('seeker', 'employer');
CREATE TYPE job_style_enum AS ENUM ('Remote', 'In-person', 'Hybrid'); --Style is a SINGLE choice option
CREATE TYPE response_type_enum as ENUM('text','num','bool');
CREATE TYPE job_status_enum as ENUM('open','hidden','closed');
CREATE TYPE application_status_enum AS ENUM('accepted','declined','reviewing','pending');

CREATE TABLE IF NOT EXISTS users(
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(319) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    user_type user_type_enum NOT NULL  
);


CREATE TABLE IF NOT EXISTS seekers (
    user_id BIGINT PRIMARY KEY,
    f_name VARCHAR(50) NOT NULL,
    l_name VARCHAR(50) NOT NULL,
    gender VARCHAR(10),
    d_o_b DATE NOT NULL,
    bio VARCHAR(800),
    cv_file TEXT,
    profile_pic_file TEXT, 
    address VARCHAR(150),
    postcode VARCHAR(20),
    ct_phone VARCHAR(20),
    ct_email VARCHAR(100),
    industry VARCHAR(50),
    work_status BOOLEAN,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS employers (
    user_id BIGINT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    size INT,
    bio VARCHAR(800),
    website TEXT,
    profile_pic_file TEXT, 
    address VARCHAR(150),
    postcode VARCHAR(20),
    ct_phone VARCHAR(20),
    ct_email VARCHAR(100),
    industry VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


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


CREATE TABLE IF NOT EXISTS applications (
    id BIGSERIAL PRIMARY KEY,
    seeker_id BIGINT NOT NULL,
    job_id BIGINT NOT NULL,
    status application_status_enum DEFAULT 'pending' NOT NULL,
    ct_email VARCHAR(100),
    cv_file TEXT DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (seeker_id) REFERENCES seekers(user_id) ON DELETE CASCADE
);

-- =======================================JOB TYPES========================================================


-- DEFINING TYPES AVAILABLE
CREATE TABLE IF NOT EXISTS job_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);


-- LINKING TABLE FOR JOBS AND JOB TYPES
CREATE TABLE IF NOT EXISTS jobs_job_types (
    job_id BIGINT NOT NULL,
    type_id INT NOT NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (type_id) REFERENCES job_types(id) ON DELETE RESTRICT,
    PRIMARY KEY (job_id, type_id)
);


-- =======================================QUESTIONS AND RESPONSES===========================================


-- SCREENING QUESTIONS FOR APPLICATIONS
CREATE TABLE IF NOT EXISTS job_questions (
    id BIGSERIAL PRIMARY KEY,
    job_id BIGINT NOT NULL,
    question VARCHAR(200) NOT NULL,
    response_type response_type_enum,
    is_req BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

-- TO STORE ALL RESPONSES FROM SEEKERS TO JOB QUESTIONS 
CREATE TABLE IF NOT EXISTS responses (
    id SERIAL PRIMARY KEY,
    application_id BIGINT NOT NULL,  
    question_id BIGINT NOT NULL, 
    response VARCHAR(1000) DEFAULT NULL,   
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES job_questions(id) ON DELETE CASCADE
);


-- =======================================SKILLS=======================================================


-- SCREENING SKILLS FOR JOBS
CREATE TABLE IF NOT EXISTS job_skills (
    id BIGSERIAL PRIMARY KEY,
    job_id BIGINT NOT NULL,
    name VARCHAR(50) NOT NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

-- -- LINKING TABLE FOR SEEKERS AND THEIR SKILLS
-- CREATE TABLE IF NOT EXISTS seeker_skills (
--     id BIGSERIAL PRIMARY KEY,
--     seeker_id BIGINT NOT NULL,
--     name VARCHAR(50) NOT NULL,
--     FOREIGN KEY (seeker_id) REFERENCES seeker(user_id) ON DELETE CASCADE
-- );


-- =======================================BENEFITS=====================================================


-- DEFINING BENEFITS
CREATE TABLE IF NOT EXISTS benefits (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    is_custom BOOLEAN NOT NULL DEFAULT FALSE
);

-- LINKING TABLE FOR JOB AND THEIR BENEFITS
CREATE TABLE IF NOT EXISTS job_benefits (
    job_id BIGINT NOT NULL,
    benefit_id INT NOT NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (benefit_id) REFERENCES benefits(id) ON DELETE RESTRICT,
    PRIMARY KEY (job_id, benefit_id)
);


-- =======================================SEEKER EXPERIENCE===================================================



-- DEFINING SEEKER WORK EXPERIENCE
-- CREATE TABLE IF NOT EXISTS work_exp (
--     id SERIAL PRIMARY KEY,
--     seeker_id BIGINT NOT NULL,
--     title VARCHAR(50) NOT NULL,
--     company VARCHAR(50) NOT NULL,
--     years INT,
--     FOREIGN KEY (seeker_id) REFERENCES seeker(user_id) ON DELETE CASCADE
-- );


-- -- DEFINING SEEKER EDUCATION
-- CREATE TABLE IF NOT EXISTS education (
--     id SERIAL PRIMARY KEY,
--     seeker_id BIGINT NOT NULL,
--     qualification VARCHAR(50) NOT NULL,
--     institution VARCHAR(50) NOT NULL,
--     FOREIGN KEY (seeker_id) REFERENCES seeker(user_id) ON DELETE CASCADE
-- );



-- =======================================FULL TEXT SEARCH===================================================

-- Creating search vector columns

-- For employers
ALTER TABLE employers
DROP COLUMN IF EXISTS search;
ALTER TABLE employers
ADD COLUMN search tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(name, '')), 'A')
) STORED;

-- For jobs
ALTER TABLE jobs
DROP COLUMN IF EXISTS search;
ALTER TABLE jobs
ADD COLUMN search tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B')
) STORED;

-- For job_skills
ALTER TABLE job_skills
DROP COLUMN IF EXISTS search;
ALTER TABLE job_skills
ADD COLUMN search tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(name, '')), 'B')
) STORED;


-- Indexing search vector columns
CREATE INDEX IF NOT EXISTS employer_search_idx ON employers USING GIN (search);

CREATE INDEX IF NOT EXISTS job_search_idx ON jobs USING GIN (search);

CREATE INDEX IF NOT EXISTS skill_search_idx ON job_skills USING GIN (search);

