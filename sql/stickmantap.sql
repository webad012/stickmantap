--
-- PostgreSQL database dump
--

-- Dumped from database version 9.3.7
-- Dumped by pg_dump version 9.3.7
-- Started on 2015-06-05 06:54:31 CEST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- TOC entry 174 (class 3079 OID 11793)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 1998 (class 0 OID 0)
-- Dependencies: 174
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 171 (class 1259 OID 111441)
-- Name: conf_data; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE conf_data (
    id integer NOT NULL,
    name text NOT NULL,
    value text NOT NULL
);


ALTER TABLE public.conf_data OWNER TO postgres;

--
-- TOC entry 170 (class 1259 OID 111439)
-- Name: conf_data_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE conf_data_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.conf_data_id_seq OWNER TO postgres;

--
-- TOC entry 1999 (class 0 OID 0)
-- Dependencies: 170
-- Name: conf_data_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE conf_data_id_seq OWNED BY conf_data.id;


--
-- TOC entry 173 (class 1259 OID 111465)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE users (
    id integer NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    character_name text DEFAULT 'Player'::text NOT NULL,
    character_level integer DEFAULT 1 NOT NULL,
    character_coins integer DEFAULT 0 NOT NULL,
    max_game_level integer DEFAULT 1 NOT NULL,
    last_action bigint,
    api_url text NOT NULL,
    character_game_level integer DEFAULT 1 NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 172 (class 1259 OID 111463)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 2000 (class 0 OID 0)
-- Dependencies: 172
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- TOC entry 1873 (class 2604 OID 111444)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY conf_data ALTER COLUMN id SET DEFAULT nextval('conf_data_id_seq'::regclass);


--
-- TOC entry 1874 (class 2604 OID 111468)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- TOC entry 1881 (class 2606 OID 111449)
-- Name: conf_data_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY conf_data
    ADD CONSTRAINT conf_data_pkey PRIMARY KEY (id);


--
-- TOC entry 1883 (class 2606 OID 111477)
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 1997 (class 0 OID 0)
-- Dependencies: 5
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2015-06-05 06:54:31 CEST

--
-- PostgreSQL database dump complete
--

