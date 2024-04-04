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

