-- CREATE DATABASE IF NOT EXISTS fyp_recruit;

CREATE TYPE user_type_enum AS ENUM ('seeker', 'employer');
CREATE TYPE job_style_enum AS ENUM ('Remote', 'In-person', 'Hybrid'); --Style is a single option
CREATE TYPE response_type_enum as ENUM('text','num','bool');
CREATE TYPE job_status_enum as ENUM('open','hidden','closed');

CREATE TABLE IF NOT EXISTS users(
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(319) UNIQUE NOT NULL,
    password VARCHAR(50) NOT NULL,
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
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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
    id SERIAL PRIMARY KEY,
    job_id BIGINT NOT NULL,
    question VARCHAR(200) NOT NULL,
    response_type response_type_enum,
    is_req BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

-- TO STORE ALL RESPONSES FROM SEEKERS TO JOB QUESTIONS 
-- CREATE TABLE IF NOT EXISTS question_responses (
--     id SERIAL PRIMARY KEY,
--     seeker_id BIGINT NOT NULL,  
--     question_id BIGINT NOT NULL, 
--     response TEXT NOT NULL,   
--     FOREIGN KEY (seeker_id) REFERENCES seeker(user_id) ON DELETE CASCADE,
--     FOREIGN KEY (question_id) REFERENCES job_questions(id) ON DELETE CASCADE
-- );


-- =======================================SKILLS=======================================================


-- SCREENING SKILLS FOR JOBS
CREATE TABLE IF NOT EXISTS job_skills (
    id SERIAL PRIMARY KEY,
    job_id BIGINT NOT NULL,
    name VARCHAR(50) NOT NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

-- LINKING TABLE FOR SEEKERS AND THEIR SKILLS
CREATE TABLE IF NOT EXISTS seeker_skills (
    id SERIAL PRIMARY KEY,
    seeker_id BIGINT NOT NULL,
    name VARCHAR(50) NOT NULL,
    FOREIGN KEY (seeker_id) REFERENCES seeker(user_id) ON DELETE CASCADE
);


-- =======================================BENEFITS=====================================================


-- DEFINING BENEFITS
CREATE TABLE IF NOT EXISTS benefits (
    id SERIAL PRIMARY KEY,
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

