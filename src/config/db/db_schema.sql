-- CREATE DATABASE IF NOT EXISTS fyp_recruit;

CREATE TYPE user_type_enum AS ENUM ('seeker', 'employer');

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
    d_o_b DATE NOT NULL,
    bio TEXT,
    country VARCHAR(100),
    postcode VARCHAR(20),
    ct_phone VARCHAR(20),
    ct_email VARCHAR(100),
    industry VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS employers (
    employer_id INTEGER PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    -- website VARCHAR(255),
    user_id INTEGER NOT NULL REFERENCES users(id),
    UNIQUE(user_id)
);

