-- Table: public.users

-- DROP TABLE IF EXISTS public.users;

-- Database: joblist

CREATE DATABASE joblist
    WITH 
    OWNER = YOUR_USERNAME
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_Indonesia.1252'
    LC_CTYPE = 'English_Indonesia.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- DROP DATABASE IF EXISTS joblist;

CREATE TABLE IF NOT EXISTS public.users
(
    username character varying COLLATE pg_catalog."default" NOT NULL,
    password character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (username, password)
)

TABLESPACE pg_default;