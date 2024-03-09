-- CREATE DATABASE IF NOT EXISTS fyp_recruit;

CREATE TYPE user_type_enum AS ENUM ('seeker', 'employer');

CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    user_type user_type_enum NOT NULL
    -- created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP    
);

CREATE TABLE IF NOT EXISTS seekers (
    seeker_id INTEGER PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    -- phone_number VARCHAR(20),
    -- resume TEXT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS employers (
    employer_id INTEGER PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    -- website VARCHAR(255),
    user_id INTEGER NOT NULL REFERENCES users(id),
    UNIQUE(user_id)
);

