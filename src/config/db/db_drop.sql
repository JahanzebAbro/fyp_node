


-- DROP TABLE IF EXISTS seeker_skills CASCADE;
DROP TABLE IF EXISTS responses CASCADE;
DROP TABLE IF EXISTS jobs_job_types CASCADE;
DROP TABLE IF EXISTS job_benefits CASCADE;
DROP TABLE IF EXISTS job_skills CASCADE;
DROP TABLE IF EXISTS job_questions CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS saved_jobs CASCADE;
DROP TABLE IF EXISTS seeker_views CASCADE;

DROP TABLE IF EXISTS seekers CASCADE;
DROP TABLE IF EXISTS employers CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

DROP TABLE IF EXISTS benefits CASCADE;
DROP TABLE IF EXISTS job_types CASCADE;

DROP TYPE IF EXISTS application_status_enum;
DROP TYPE IF EXISTS job_status_enum;
DROP TYPE IF EXISTS response_type_enum;
DROP TYPE IF EXISTS job_style_enum;
DROP TYPE IF EXISTS user_type_enum;

DROP INDEX IF EXISTS employer_search_idx;
DROP INDEX IF EXISTS job_search_idx;
DROP INDEX IF EXISTS skill_search_idx;
DROP INDEX IF EXISTS seeker_search_idx;