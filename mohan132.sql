--
-- PostgreSQL database cluster dump
--

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE cloud_admin;
ALTER ROLE cloud_admin WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS;
CREATE ROLE neon_superuser;
ALTER ROLE neon_superuser WITH NOSUPERUSER INHERIT CREATEROLE CREATEDB NOLOGIN REPLICATION BYPASSRLS;
CREATE ROLE neondb_owner;
ALTER ROLE neondb_owner WITH NOSUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:+3wg0iuZTRtPTATfzRf97g==$Rw22H1T4snE+3picT7NMWoT5B+UEXf5c5fu1UNN7Vp8=:BD4zh80Bk40sKJAOKF2FTVJJs9eQrGFZXawXYaa0a8o=';

--
-- User Configurations
--


--
-- Role memberships
--

GRANT neon_superuser TO neondb_owner WITH INHERIT TRUE GRANTED BY cloud_admin;
GRANT pg_create_subscription TO neon_superuser WITH INHERIT TRUE GRANTED BY cloud_admin;
GRANT pg_monitor TO neon_superuser WITH ADMIN OPTION, INHERIT TRUE GRANTED BY cloud_admin;
GRANT pg_read_all_data TO neon_superuser WITH INHERIT TRUE GRANTED BY cloud_admin;
GRANT pg_write_all_data TO neon_superuser WITH INHERIT TRUE GRANTED BY cloud_admin;






--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- PostgreSQL database dump complete
--

--
-- Database "leafyhealth" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: leafyhealth; Type: DATABASE; Schema: -; Owner: neondb_owner
--

CREATE DATABASE leafyhealth WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'C.UTF-8';


ALTER DATABASE leafyhealth OWNER TO neondb_owner;

\connect leafyhealth

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: neondb_owner
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO neondb_owner;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: neondb_owner
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ab_test_assignments; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.ab_test_assignments (
    id integer NOT NULL,
    test_id integer NOT NULL,
    user_id character varying(255),
    session_id character varying(255),
    variant character varying(100) NOT NULL,
    assigned_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    branch_id integer
);


ALTER TABLE public.ab_test_assignments OWNER TO neondb_owner;

--
-- Name: ab_test_assignments_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.ab_test_assignments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ab_test_assignments_id_seq OWNER TO neondb_owner;

--
-- Name: ab_test_assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.ab_test_assignments_id_seq OWNED BY public.ab_test_assignments.id;


--
-- Name: ab_tests; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.ab_tests (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    variants jsonb NOT NULL,
    start_date timestamp without time zone,
    end_date timestamp without time zone,
    success_metric character varying(100),
    status character varying(20) DEFAULT 'draft'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.ab_tests OWNER TO neondb_owner;

--
-- Name: ab_tests_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.ab_tests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ab_tests_id_seq OWNER TO neondb_owner;

--
-- Name: ab_tests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.ab_tests_id_seq OWNED BY public.ab_tests.id;


--
-- Name: activity_logs; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.activity_logs (
    id integer NOT NULL,
    user_id character varying(255),
    action character varying(100) NOT NULL,
    entity_type character varying(50),
    entity_id character varying(100),
    description text,
    ip_address character varying(45),
    user_agent text,
    metadata jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.activity_logs OWNER TO neondb_owner;

--
-- Name: activity_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.activity_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.activity_logs_id_seq OWNER TO neondb_owner;

--
-- Name: activity_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.activity_logs_id_seq OWNED BY public.activity_logs.id;


--
-- Name: analytics_events; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.analytics_events (
    id integer NOT NULL,
    event_name character varying(100) NOT NULL,
    event_category character varying(50),
    event_data jsonb,
    user_id character varying(255),
    session_id character varying(255),
    ip_address character varying(45),
    user_agent text,
    referrer character varying(500),
    page_url character varying(500),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.analytics_events OWNER TO neondb_owner;

--
-- Data for Name: ab_test_assignments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.ab_test_assignments (id, test_id, user_id, session_id, variant, assigned_at, branch_id) FROM stdin;
\.


--
-- Data for Name: ab_tests; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.ab_tests (id, name, description, variants, start_date, end_date, success_metric, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: activity_logs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.activity_logs (id, user_id, action, entity_type, entity_id, description, ip_address, user_agent, metadata, created_at) FROM stdin;
\.


--
-- Data for Name: analytics_events; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.analytics_events (id, event_name, event_category, event_data, user_id, session_id, ip_address, user_agent, referrer, page_url, created_at) FROM stdin;
\.


--
-- Name: ab_test_assignments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.ab_test_assignments_id_seq', 1, false);


--
-- Name: ab_tests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.ab_tests_id_seq', 1, false);


--
-- Name: activity_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.activity_logs_id_seq', 1, false);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: neondb_owner
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

--
-- Database "neondb" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: neondb; Type: DATABASE; Schema: -; Owner: neondb_owner
--

CREATE DATABASE neondb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'C.UTF-8';


ALTER DATABASE neondb OWNER TO neondb_owner;

\connect neondb

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: neondb_owner
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO neondb_owner;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: neondb_owner
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ab_test_assignments; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.ab_test_assignments (
    id integer NOT NULL,
    test_id integer,
    user_id integer,
    variant character varying(50),
    assigned_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.ab_test_assignments OWNER TO neondb_owner;

--
-- Name: ab_test_assignments_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.ab_test_assignments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ab_test_assignments_id_seq OWNER TO neondb_owner;

--
-- Name: ab_test_assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.ab_test_assignments_id_seq OWNED BY public.ab_test_assignments.id;


--
-- Name: ab_tests; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.ab_tests (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    start_date date,
    end_date date,
    traffic_split numeric(3,2) DEFAULT 50.00,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.ab_tests OWNER TO neondb_owner;

--
-- Name: ab_tests_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.ab_tests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ab_tests_id_seq OWNER TO neondb_owner;

--
-- Name: ab_tests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.ab_tests_id_seq OWNED BY public.ab_tests.id;


--
-- Name: activity_logs; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.activity_logs (
    id integer NOT NULL,
    user_id integer,
    action character varying(255) NOT NULL,
    description text,
    ip_address inet,
    user_agent text,
    metadata jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.activity_logs OWNER TO neondb_owner;

--
-- Name: activity_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.activity_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.activity_logs_id_seq OWNER TO neondb_owner;

--
-- Name: activity_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.activity_logs_id_seq OWNED BY public.activity_logs.id;


--
-- Name: analytics_events; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.analytics_events (
    id integer NOT NULL,
    event_name character varying(255) NOT NULL,
    user_id integer,
    session_id character varying(255),
    properties jsonb,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.analytics_events OWNER TO neondb_owner;

--
-- Name: analytics_events_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.analytics_events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.analytics_events_id_seq OWNER TO neondb_owner;

--
-- Name: analytics_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.analytics_events_id_seq OWNED BY public.analytics_events.id;


--
-- Name: api_keys; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.api_keys (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    key character varying(255) NOT NULL,
    user_id integer,
    permissions jsonb,
    expires_at timestamp without time zone,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.api_keys OWNER TO neondb_owner;

--
-- Name: api_keys_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.api_keys_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.api_keys_id_seq OWNER TO neondb_owner;

--
-- Name: api_keys_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.api_keys_id_seq OWNED BY public.api_keys.id;


--
-- Name: api_request_logs; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.api_request_logs (
    id integer NOT NULL,
    api_key_id integer,
    endpoint character varying(255) NOT NULL,
    method character varying(10) NOT NULL,
    ip_address inet,
    response_status integer,
    response_time integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.api_request_logs OWNER TO neondb_owner;

--
-- Name: api_request_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.api_request_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.api_request_logs_id_seq OWNER TO neondb_owner;

--
-- Name: api_request_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.api_request_logs_id_seq OWNED BY public.api_request_logs.id;


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.audit_logs (
    id integer NOT NULL,
    user_id integer,
    action character varying(255) NOT NULL,
    table_name character varying(255),
    record_id integer,
    old_values jsonb,
    new_values jsonb,
    ip_address inet,
    user_agent text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.audit_logs OWNER TO neondb_owner;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.audit_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.audit_logs_id_seq OWNER TO neondb_owner;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
-- Name: backup_jobs; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.backup_jobs (
    id integer NOT NULL,
    schedule_id integer,
    status character varying(50) DEFAULT 'pending'::character varying,
    file_path character varying(255),
    file_size bigint,
    started_at timestamp without time zone,
    completed_at timestamp without time zone,
    error_message text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.backup_jobs OWNER TO neondb_owner;

--
-- Name: backup_jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.backup_jobs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.backup_jobs_id_seq OWNER TO neondb_owner;

--
-- Name: backup_jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.backup_jobs_id_seq OWNED BY public.backup_jobs.id;


--
-- Name: backup_logs; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.backup_logs (
    id integer NOT NULL,
    job_id integer,
    level character varying(50) NOT NULL,
    message text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.backup_logs OWNER TO neondb_owner;

--
-- Name: backup_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.backup_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.backup_logs_id_seq OWNER TO neondb_owner;

--
-- Name: backup_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.backup_logs_id_seq OWNED BY public.backup_logs.id;


--
-- Name: backup_schedules; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.backup_schedules (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    schedule_cron character varying(100) NOT NULL,
    backup_type character varying(50) NOT NULL,
    retention_days integer DEFAULT 30,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.backup_schedules OWNER TO neondb_owner;

--
-- Name: backup_schedules_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.backup_schedules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.backup_schedules_id_seq OWNER TO neondb_owner;

--
-- Name: backup_schedules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.backup_schedules_id_seq OWNED BY public.backup_schedules.id;


--
-- Name: branch_traditional_items; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.branch_traditional_items (
    id integer NOT NULL,
    branch_id integer,
    traditional_item_id integer,
    local_name character varying(255),
    local_name_telugu character varying(255),
    supplier_name character varying(255),
    supplier_phone character varying(20),
    ordinary_price numeric(10,2),
    medium_price numeric(10,2),
    best_price numeric(10,2),
    current_stock integer DEFAULT 0,
    min_stock_level integer DEFAULT 0,
    max_stock_level integer DEFAULT 0,
    last_restocked_at timestamp without time zone,
    is_available boolean DEFAULT true,
    quality_grade character varying(50),
    seasonal_availability boolean DEFAULT false,
    harvest_season character varying(100),
    storage_instructions text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    item_id integer,
    stock_quantity integer DEFAULT 1000
);


ALTER TABLE public.branch_traditional_items OWNER TO neondb_owner;

--
-- Name: branch_traditional_items_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.branch_traditional_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.branch_traditional_items_id_seq OWNER TO neondb_owner;

--
-- Name: branch_traditional_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.branch_traditional_items_id_seq OWNED BY public.branch_traditional_items.id;


--
-- Name: branches; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.branches (
    id integer NOT NULL,
    company_id integer,
    name character varying(255) NOT NULL,
    name_telugu character varying(255),
    code character varying(50),
    city character varying(100),
    state character varying(100),
    address text,
    phone character varying(20),
    email character varying(255),
    manager_name character varying(255),
    manager_phone character varying(20),
    latitude numeric(10,8),
    longitude numeric(11,8),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    country character varying(100) DEFAULT 'India'::character varying,
    postal_code character varying(20),
    operating_hours jsonb,
    delivery_radius numeric(8,2),
    settings jsonb
);


ALTER TABLE public.branches OWNER TO neondb_owner;

--
-- Name: branches_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.branches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.branches_id_seq OWNER TO neondb_owner;

--
-- Name: branches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.branches_id_seq OWNED BY public.branches.id;


--
-- Name: brands; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.brands (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    name_telugu character varying(255),
    description text,
    logo_url character varying(255),
    website character varying(255),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.brands OWNER TO neondb_owner;

--
-- Name: brands_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.brands_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.brands_id_seq OWNER TO neondb_owner;

--
-- Name: brands_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.brands_id_seq OWNED BY public.brands.id;


--
-- Name: campaign_recipients; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.campaign_recipients (
    id integer NOT NULL,
    campaign_id integer,
    customer_id integer,
    sent_at timestamp without time zone,
    opened_at timestamp without time zone,
    clicked_at timestamp without time zone,
    status character varying(50) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.campaign_recipients OWNER TO neondb_owner;

--
-- Name: campaign_recipients_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.campaign_recipients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.campaign_recipients_id_seq OWNER TO neondb_owner;

--
-- Name: campaign_recipients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.campaign_recipients_id_seq OWNED BY public.campaign_recipients.id;


--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.cart_items (
    id integer NOT NULL,
    cart_id integer,
    product_id integer,
    quantity integer NOT NULL,
    price numeric(10,2) NOT NULL,
    total_price numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    user_id integer,
    unit_price numeric(10,2),
    branch_id integer
);


ALTER TABLE public.cart_items OWNER TO neondb_owner;

--
-- Name: cart_items_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.cart_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cart_items_id_seq OWNER TO neondb_owner;

--
-- Name: cart_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.cart_items_id_seq OWNED BY public.cart_items.id;


--
-- Name: carts; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.carts (
    id integer NOT NULL,
    customer_id integer,
    branch_id integer,
    session_id character varying(255),
    total_amount numeric(10,2) DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    user_id integer,
    status character varying(20) DEFAULT 'active'::character varying
);


ALTER TABLE public.carts OWNER TO neondb_owner;

--
-- Name: carts_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.carts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.carts_id_seq OWNER TO neondb_owner;

--
-- Name: carts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.carts_id_seq OWNED BY public.carts.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    name_telugu character varying(255),
    description text,
    parent_id integer,
    slug character varying(255),
    image_url character varying(255),
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.categories OWNER TO neondb_owner;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO neondb_owner;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: cities; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.cities (
    id integer NOT NULL,
    state_id integer,
    name character varying(255) NOT NULL,
    pincode character varying(10),
    is_active boolean DEFAULT true
);


ALTER TABLE public.cities OWNER TO neondb_owner;

--
-- Name: cities_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.cities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cities_id_seq OWNER TO neondb_owner;

--
-- Name: cities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.cities_id_seq OWNED BY public.cities.id;


--
-- Name: cms_banners; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.cms_banners (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    image_url character varying(255),
    link_url character varying(255),
    "position" character varying(50),
    is_active boolean DEFAULT true,
    start_date date,
    end_date date,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.cms_banners OWNER TO neondb_owner;

--
-- Name: cms_banners_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.cms_banners_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cms_banners_id_seq OWNER TO neondb_owner;

--
-- Name: cms_banners_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.cms_banners_id_seq OWNED BY public.cms_banners.id;


--
-- Name: cms_pages; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.cms_pages (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    content text,
    meta_title character varying(255),
    meta_description text,
    is_published boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.cms_pages OWNER TO neondb_owner;

--
-- Name: cms_pages_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.cms_pages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cms_pages_id_seq OWNER TO neondb_owner;

--
-- Name: cms_pages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.cms_pages_id_seq OWNED BY public.cms_pages.id;


--
-- Name: communication_logs; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.communication_logs (
    id integer NOT NULL,
    template_id integer,
    recipient_email character varying(255),
    recipient_phone character varying(20),
    status character varying(50) DEFAULT 'pending'::character varying,
    sent_at timestamp without time zone,
    error_message text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.communication_logs OWNER TO neondb_owner;

--
-- Name: communication_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.communication_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.communication_logs_id_seq OWNER TO neondb_owner;

--
-- Name: communication_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.communication_logs_id_seq OWNED BY public.communication_logs.id;


--
-- Name: communication_templates; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.communication_templates (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    type character varying(50) NOT NULL,
    subject character varying(255),
    template_content text,
    variables jsonb,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.communication_templates OWNER TO neondb_owner;

--
-- Name: communication_templates_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.communication_templates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.communication_templates_id_seq OWNER TO neondb_owner;

--
-- Name: communication_templates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.communication_templates_id_seq OWNED BY public.communication_templates.id;


--
-- Name: companies; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.companies (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    name_telugu character varying(255),
    description text,
    address text,
    phone character varying(20),
    email character varying(255),
    website character varying(255),
    logo_url character varying(255),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    slug character varying(255)
);


ALTER TABLE public.companies OWNER TO neondb_owner;

--
-- Name: companies_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.companies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.companies_id_seq OWNER TO neondb_owner;

--
-- Name: companies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.companies_id_seq OWNED BY public.companies.id;


--
-- Name: content_versions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.content_versions (
    id integer NOT NULL,
    content_id integer NOT NULL,
    content_type character varying(50) NOT NULL,
    version_number integer NOT NULL,
    content_data jsonb,
    created_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.content_versions OWNER TO neondb_owner;

--
-- Name: content_versions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.content_versions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.content_versions_id_seq OWNER TO neondb_owner;

--
-- Name: content_versions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.content_versions_id_seq OWNED BY public.content_versions.id;


--
-- Name: countries; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.countries (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    code character varying(10),
    is_active boolean DEFAULT true
);


ALTER TABLE public.countries OWNER TO neondb_owner;

--
-- Name: countries_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.countries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.countries_id_seq OWNER TO neondb_owner;

--
-- Name: countries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.countries_id_seq OWNED BY public.countries.id;


--
-- Name: currencies; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.currencies (
    id integer NOT NULL,
    code character varying(10) NOT NULL,
    name character varying(255) NOT NULL,
    symbol character varying(10),
    is_active boolean DEFAULT true
);


ALTER TABLE public.currencies OWNER TO neondb_owner;

--
-- Name: currencies_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.currencies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.currencies_id_seq OWNER TO neondb_owner;

--
-- Name: currencies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.currencies_id_seq OWNED BY public.currencies.id;


--
-- Name: custom_template_dimensions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.custom_template_dimensions (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    description text,
    paper_size character varying(50) NOT NULL,
    paper_width numeric(6,2) NOT NULL,
    paper_height numeric(6,2) NOT NULL,
    label_width numeric(6,2) NOT NULL,
    label_height numeric(6,2) NOT NULL,
    horizontal_count integer NOT NULL,
    vertical_count integer NOT NULL,
    margin_top numeric(6,2) NOT NULL,
    margin_bottom numeric(6,2) NOT NULL,
    margin_left numeric(6,2) NOT NULL,
    margin_right numeric(6,2) NOT NULL,
    horizontal_gap numeric(6,2) NOT NULL,
    vertical_gap numeric(6,2) NOT NULL,
    corner_radius numeric(6,2) DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by integer,
    company_id integer,
    branch_id integer
);


ALTER TABLE public.custom_template_dimensions OWNER TO neondb_owner;

--
-- Name: custom_template_dimensions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.custom_template_dimensions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.custom_template_dimensions_id_seq OWNER TO neondb_owner;

--
-- Name: custom_template_dimensions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.custom_template_dimensions_id_seq OWNED BY public.custom_template_dimensions.id;


--
-- Name: custom_templates; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.custom_templates (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    description text,
    type character varying(50) DEFAULT 'custom'::character varying,
    media_id integer,
    template_json jsonb,
    is_active boolean DEFAULT true,
    usage_count integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by integer,
    company_id integer,
    branch_id integer,
    category character varying(50) DEFAULT 'custom'::character varying,
    template_data jsonb
);


ALTER TABLE public.custom_templates OWNER TO neondb_owner;

--
-- Name: custom_templates_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.custom_templates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.custom_templates_id_seq OWNER TO neondb_owner;

--
-- Name: custom_templates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.custom_templates_id_seq OWNED BY public.custom_templates.id;


--
-- Name: customer_addresses; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.customer_addresses (
    id integer NOT NULL,
    customer_id integer,
    type character varying(50),
    address_line1 character varying(255),
    address_line2 character varying(255),
    city character varying(100),
    state character varying(100),
    pincode character varying(10),
    landmark character varying(255),
    is_default boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.customer_addresses OWNER TO neondb_owner;

--
-- Name: customer_addresses_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.customer_addresses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.customer_addresses_id_seq OWNER TO neondb_owner;

--
-- Name: customer_addresses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.customer_addresses_id_seq OWNED BY public.customer_addresses.id;


--
-- Name: customer_subscriptions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.customer_subscriptions (
    id integer NOT NULL,
    customer_id integer,
    plan_id integer,
    start_date date,
    end_date date,
    status character varying(50) DEFAULT 'active'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.customer_subscriptions OWNER TO neondb_owner;

--
-- Name: customer_subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.customer_subscriptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.customer_subscriptions_id_seq OWNER TO neondb_owner;

--
-- Name: customer_subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.customer_subscriptions_id_seq OWNED BY public.customer_subscriptions.id;


--
-- Name: customers; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.customers (
    id integer NOT NULL,
    customer_code character varying(50),
    first_name character varying(255),
    last_name character varying(255),
    email character varying(255),
    phone character varying(20),
    alternate_phone character varying(20),
    date_of_birth date,
    gender character varying(10),
    branch_id integer,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    user_id character varying(255)
);


ALTER TABLE public.customers OWNER TO neondb_owner;

--
-- Name: customers_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.customers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.customers_id_seq OWNER TO neondb_owner;

--
-- Name: customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.customers_id_seq OWNED BY public.customers.id;


--
-- Name: deliveries; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.deliveries (
    id integer NOT NULL,
    order_id integer,
    delivery_person_id integer,
    delivery_address text,
    scheduled_date date,
    scheduled_time character varying(50),
    actual_delivery_time timestamp without time zone,
    status character varying(50) DEFAULT 'assigned'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.deliveries OWNER TO neondb_owner;

--
-- Name: deliveries_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.deliveries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.deliveries_id_seq OWNER TO neondb_owner;

--
-- Name: deliveries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.deliveries_id_seq OWNED BY public.deliveries.id;


--
-- Name: delivery_assignments; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.delivery_assignments (
    id integer NOT NULL,
    delivery_person_id integer,
    order_id integer,
    assigned_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(50) DEFAULT 'assigned'::character varying,
    estimated_delivery_time timestamp without time zone,
    actual_delivery_time timestamp without time zone,
    delivery_notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.delivery_assignments OWNER TO neondb_owner;

--
-- Name: delivery_assignments_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.delivery_assignments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.delivery_assignments_id_seq OWNER TO neondb_owner;

--
-- Name: delivery_assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.delivery_assignments_id_seq OWNED BY public.delivery_assignments.id;


--
-- Name: delivery_personnel; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.delivery_personnel (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    phone character varying(20),
    email character varying(255),
    branch_id integer,
    vehicle_type character varying(50),
    vehicle_number character varying(50),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.delivery_personnel OWNER TO neondb_owner;

--
-- Name: delivery_personnel_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.delivery_personnel_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.delivery_personnel_id_seq OWNER TO neondb_owner;

--
-- Name: delivery_personnel_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.delivery_personnel_id_seq OWNED BY public.delivery_personnel.id;


--
-- Name: delivery_zones; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.delivery_zones (
    id integer NOT NULL,
    branch_id integer,
    name character varying(255) NOT NULL,
    pincodes jsonb,
    delivery_charge numeric(10,2) DEFAULT 0,
    min_order_amount numeric(10,2) DEFAULT 0,
    delivery_time_slots jsonb,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.delivery_zones OWNER TO neondb_owner;

--
-- Name: delivery_zones_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.delivery_zones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.delivery_zones_id_seq OWNER TO neondb_owner;

--
-- Name: delivery_zones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.delivery_zones_id_seq OWNED BY public.delivery_zones.id;


--
-- Name: employee_attendance; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.employee_attendance (
    id integer NOT NULL,
    employee_id integer,
    date date NOT NULL,
    check_in_time timestamp without time zone,
    check_out_time timestamp without time zone,
    total_hours numeric(4,2),
    status character varying(50) DEFAULT 'present'::character varying,
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.employee_attendance OWNER TO neondb_owner;

--
-- Name: employee_attendance_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.employee_attendance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employee_attendance_id_seq OWNER TO neondb_owner;

--
-- Name: employee_attendance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.employee_attendance_id_seq OWNED BY public.employee_attendance.id;


--
-- Name: employees; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.employees (
    id integer NOT NULL,
    employee_id character varying(50) NOT NULL,
    user_id integer,
    first_name character varying(255) NOT NULL,
    last_name character varying(255),
    email character varying(255),
    phone character varying(20),
    department character varying(100),
    designation character varying(100),
    branch_id integer,
    manager_id integer,
    date_of_joining date,
    salary numeric(10,2),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.employees OWNER TO neondb_owner;

--
-- Name: employees_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.employees_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employees_id_seq OWNER TO neondb_owner;

--
-- Name: employees_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.employees_id_seq OWNED BY public.employees.id;


--
-- Name: expense_categories; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.expense_categories (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    is_active boolean DEFAULT true
);


ALTER TABLE public.expense_categories OWNER TO neondb_owner;

--
-- Name: expense_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.expense_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.expense_categories_id_seq OWNER TO neondb_owner;

--
-- Name: expense_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.expense_categories_id_seq OWNED BY public.expense_categories.id;


--
-- Name: expenses; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.expenses (
    id integer NOT NULL,
    category_id integer,
    branch_id integer,
    amount numeric(10,2) NOT NULL,
    description text,
    receipt_url character varying(255),
    expense_date date,
    created_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.expenses OWNER TO neondb_owner;

--
-- Name: expenses_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.expenses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.expenses_id_seq OWNER TO neondb_owner;

--
-- Name: expenses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.expenses_id_seq OWNED BY public.expenses.id;


--
-- Name: feature_flags; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.feature_flags (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    is_enabled boolean DEFAULT false,
    rollout_percentage numeric(5,2) DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.feature_flags OWNER TO neondb_owner;

--
-- Name: feature_flags_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.feature_flags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.feature_flags_id_seq OWNER TO neondb_owner;

--
-- Name: feature_flags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.feature_flags_id_seq OWNED BY public.feature_flags.id;


--
-- Name: gift_card_transactions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.gift_card_transactions (
    id integer NOT NULL,
    gift_card_id integer,
    transaction_type character varying(50) NOT NULL,
    amount numeric(10,2) NOT NULL,
    reference_id integer,
    reference_type character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.gift_card_transactions OWNER TO neondb_owner;

--
-- Name: gift_card_transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.gift_card_transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.gift_card_transactions_id_seq OWNER TO neondb_owner;

--
-- Name: gift_card_transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.gift_card_transactions_id_seq OWNED BY public.gift_card_transactions.id;


--
-- Name: gift_cards; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.gift_cards (
    id integer NOT NULL,
    card_number character varying(255) NOT NULL,
    amount numeric(10,2) NOT NULL,
    balance numeric(10,2) NOT NULL,
    customer_id integer,
    purchased_by integer,
    expires_at date,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.gift_cards OWNER TO neondb_owner;

--
-- Name: gift_cards_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.gift_cards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.gift_cards_id_seq OWNER TO neondb_owner;

--
-- Name: gift_cards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.gift_cards_id_seq OWNED BY public.gift_cards.id;


--
-- Name: health_check; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.health_check (
    id integer NOT NULL,
    service character varying(255) NOT NULL,
    status character varying(50) NOT NULL,
    last_check timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    message text
);


ALTER TABLE public.health_check OWNER TO neondb_owner;

--
-- Name: health_check_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.health_check_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.health_check_id_seq OWNER TO neondb_owner;

--
-- Name: health_check_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.health_check_id_seq OWNED BY public.health_check.id;


--
-- Name: health_checks; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.health_checks (
    id integer NOT NULL,
    service_name character varying(255) NOT NULL,
    status character varying(50) NOT NULL,
    response_time integer,
    message text,
    checked_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.health_checks OWNER TO neondb_owner;

--
-- Name: health_checks_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.health_checks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.health_checks_id_seq OWNER TO neondb_owner;

--
-- Name: health_checks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.health_checks_id_seq OWNED BY public.health_checks.id;


--
-- Name: image_management_images; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.image_management_images (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    filename text NOT NULL,
    original_name text NOT NULL,
    mime_type text NOT NULL,
    size integer NOT NULL,
    width integer,
    height integer,
    path text NOT NULL,
    entity_type text,
    entity_id integer,
    category text,
    description text,
    tags text,
    is_public boolean DEFAULT true,
    variants jsonb,
    uploaded_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.image_management_images OWNER TO neondb_owner;

--
-- Name: images; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.images (
    id integer NOT NULL,
    filename character varying(255) NOT NULL,
    original_name character varying(255) NOT NULL,
    file_path character varying(500) NOT NULL,
    file_size integer NOT NULL,
    mime_type character varying(100) NOT NULL,
    width integer,
    height integer,
    alt_text text,
    description text,
    category character varying(100),
    entity_type character varying(100),
    entity_id integer,
    branch_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    processed_data jsonb
);


ALTER TABLE public.images OWNER TO neondb_owner;

--
-- Name: images_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.images_id_seq OWNER TO neondb_owner;

--
-- Name: images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.images_id_seq OWNED BY public.images.id;


--
-- Name: inventory; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.inventory (
    id integer NOT NULL,
    product_id integer,
    branch_id integer,
    current_stock integer NOT NULL,
    reserved_stock integer DEFAULT 0,
    min_stock_level integer DEFAULT 0,
    max_stock_level integer DEFAULT 0,
    last_restocked_at timestamp without time zone,
    expiry_date date,
    batch_number character varying(255),
    supplier_id integer,
    cost_price numeric(10,2),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    reorder_point integer DEFAULT 10,
    minimum_stock integer DEFAULT 10,
    maximum_stock integer DEFAULT 1000
);


ALTER TABLE public.inventory OWNER TO neondb_owner;

--
-- Name: inventory_adjustments; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.inventory_adjustments (
    id integer NOT NULL,
    product_id integer,
    branch_id integer,
    adjustment_type character varying(50) NOT NULL,
    quantity_before integer NOT NULL,
    quantity_after integer NOT NULL,
    reason text,
    created_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.inventory_adjustments OWNER TO neondb_owner;

--
-- Name: inventory_adjustments_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.inventory_adjustments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inventory_adjustments_id_seq OWNER TO neondb_owner;

--
-- Name: inventory_adjustments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.inventory_adjustments_id_seq OWNED BY public.inventory_adjustments.id;


--
-- Name: inventory_alerts; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.inventory_alerts (
    id integer NOT NULL,
    product_id integer,
    branch_id integer,
    alert_type character varying(50) NOT NULL,
    message text,
    is_resolved boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.inventory_alerts OWNER TO neondb_owner;

--
-- Name: inventory_alerts_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.inventory_alerts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inventory_alerts_id_seq OWNER TO neondb_owner;

--
-- Name: inventory_alerts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.inventory_alerts_id_seq OWNED BY public.inventory_alerts.id;


--
-- Name: inventory_history; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.inventory_history (
    id integer NOT NULL,
    product_id integer,
    branch_id integer,
    adjustment_type character varying(50),
    quantity integer,
    reason text,
    performed_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.inventory_history OWNER TO neondb_owner;

--
-- Name: inventory_history_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.inventory_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inventory_history_id_seq OWNER TO neondb_owner;

--
-- Name: inventory_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.inventory_history_id_seq OWNED BY public.inventory_history.id;


--
-- Name: inventory_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.inventory_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inventory_id_seq OWNER TO neondb_owner;

--
-- Name: inventory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.inventory_id_seq OWNED BY public.inventory.id;


--
-- Name: inventory_transactions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.inventory_transactions (
    id integer NOT NULL,
    product_id integer,
    branch_id integer,
    transaction_type character varying(50) NOT NULL,
    quantity integer NOT NULL,
    unit_price numeric(10,2),
    total_amount numeric(10,2),
    reference_id integer,
    reference_type character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.inventory_transactions OWNER TO neondb_owner;

--
-- Name: inventory_transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.inventory_transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inventory_transactions_id_seq OWNER TO neondb_owner;

--
-- Name: inventory_transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.inventory_transactions_id_seq OWNED BY public.inventory_transactions.id;


--
-- Name: invoices; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.invoices (
    id integer NOT NULL,
    order_id integer,
    invoice_number character varying(255) NOT NULL,
    amount numeric(10,2) NOT NULL,
    tax_amount numeric(10,2),
    total_amount numeric(10,2) NOT NULL,
    status character varying(50) DEFAULT 'generated'::character varying,
    generated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.invoices OWNER TO neondb_owner;

--
-- Name: invoices_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.invoices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.invoices_id_seq OWNER TO neondb_owner;

--
-- Name: invoices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.invoices_id_seq OWNED BY public.invoices.id;


--
-- Name: label_designs; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.label_designs (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    template_id integer,
    product_id integer,
    design_data jsonb,
    generated_image_url character varying(255),
    created_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.label_designs OWNER TO neondb_owner;

--
-- Name: label_designs_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.label_designs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.label_designs_id_seq OWNER TO neondb_owner;

--
-- Name: label_designs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.label_designs_id_seq OWNED BY public.label_designs.id;


--
-- Name: label_media_types; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.label_media_types (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    width_mm numeric(10,2),
    height_mm numeric(10,2),
    type character varying(50),
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    avery_code character varying(50)
);


ALTER TABLE public.label_media_types OWNER TO neondb_owner;

--
-- Name: label_media_types_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.label_media_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.label_media_types_id_seq OWNER TO neondb_owner;

--
-- Name: label_media_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.label_media_types_id_seq OWNED BY public.label_media_types.id;


--
-- Name: label_templates; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.label_templates (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    template_data jsonb,
    media_type_id integer,
    category character varying(100),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.label_templates OWNER TO neondb_owner;

--
-- Name: label_templates_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.label_templates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.label_templates_id_seq OWNER TO neondb_owner;

--
-- Name: label_templates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.label_templates_id_seq OWNED BY public.label_templates.id;


--
-- Name: loyalty_points; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.loyalty_points (
    id integer NOT NULL,
    customer_id integer,
    points_earned integer DEFAULT 0,
    points_used integer DEFAULT 0,
    current_balance integer DEFAULT 0,
    transaction_type character varying(50),
    reference_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.loyalty_points OWNER TO neondb_owner;

--
-- Name: loyalty_points_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.loyalty_points_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.loyalty_points_id_seq OWNER TO neondb_owner;

--
-- Name: loyalty_points_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.loyalty_points_id_seq OWNED BY public.loyalty_points.id;


--
-- Name: loyalty_rewards; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.loyalty_rewards (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    points_required integer NOT NULL,
    reward_type character varying(50),
    reward_value numeric(10,2),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.loyalty_rewards OWNER TO neondb_owner;

--
-- Name: loyalty_rewards_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.loyalty_rewards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.loyalty_rewards_id_seq OWNER TO neondb_owner;

--
-- Name: loyalty_rewards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.loyalty_rewards_id_seq OWNED BY public.loyalty_rewards.id;


--
-- Name: loyalty_transactions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.loyalty_transactions (
    id integer NOT NULL,
    customer_id integer,
    transaction_type character varying(50) NOT NULL,
    points integer NOT NULL,
    reference_id integer,
    reference_type character varying(50),
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.loyalty_transactions OWNER TO neondb_owner;

--
-- Name: loyalty_transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.loyalty_transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.loyalty_transactions_id_seq OWNER TO neondb_owner;

--
-- Name: loyalty_transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.loyalty_transactions_id_seq OWNED BY public.loyalty_transactions.id;


--
-- Name: marketing_campaigns; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.marketing_campaigns (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    type character varying(50),
    start_date date,
    end_date date,
    budget numeric(10,2),
    status character varying(50) DEFAULT 'draft'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.marketing_campaigns OWNER TO neondb_owner;

--
-- Name: marketing_campaigns_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.marketing_campaigns_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.marketing_campaigns_id_seq OWNER TO neondb_owner;

--
-- Name: marketing_campaigns_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.marketing_campaigns_id_seq OWNED BY public.marketing_campaigns.id;


--
-- Name: notification_settings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.notification_settings (
    id integer NOT NULL,
    user_id integer,
    notification_type character varying(50) NOT NULL,
    is_enabled boolean DEFAULT true,
    delivery_method character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.notification_settings OWNER TO neondb_owner;

--
-- Name: notification_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.notification_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notification_settings_id_seq OWNER TO neondb_owner;

--
-- Name: notification_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.notification_settings_id_seq OWNED BY public.notification_settings.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    user_id integer,
    title character varying(255) NOT NULL,
    message text,
    type character varying(50),
    is_read boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.notifications OWNER TO neondb_owner;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO neondb_owner;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: nutrition_templates; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.nutrition_templates (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    fields jsonb,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.nutrition_templates OWNER TO neondb_owner;

--
-- Name: nutrition_templates_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.nutrition_templates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nutrition_templates_id_seq OWNER TO neondb_owner;

--
-- Name: nutrition_templates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.nutrition_templates_id_seq OWNED BY public.nutrition_templates.id;


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer,
    product_id integer,
    quantity integer NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    total_price numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.order_items OWNER TO neondb_owner;

--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_items_id_seq OWNER TO neondb_owner;

--
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    order_number character varying(255) NOT NULL,
    customer_id integer,
    branch_id integer,
    total_amount numeric(10,2) NOT NULL,
    tax_amount numeric(10,2) DEFAULT 0,
    discount_amount numeric(10,2) DEFAULT 0,
    final_amount numeric(10,2) NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying,
    payment_status character varying(50) DEFAULT 'pending'::character varying,
    delivery_address_id integer,
    delivery_date date,
    delivery_time_slot character varying(50),
    special_instructions text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.orders OWNER TO neondb_owner;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO neondb_owner;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.payments (
    id integer NOT NULL,
    order_id integer,
    payment_method character varying(50) NOT NULL,
    amount numeric(10,2) NOT NULL,
    currency character varying(10) DEFAULT 'INR'::character varying,
    status character varying(50) DEFAULT 'pending'::character varying,
    transaction_id character varying(255),
    gateway_response jsonb,
    processed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.payments OWNER TO neondb_owner;

--
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payments_id_seq OWNER TO neondb_owner;

--
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- Name: performance_metrics; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.performance_metrics (
    id integer NOT NULL,
    metric_name character varying(255) NOT NULL,
    metric_value numeric(10,2),
    unit character varying(50),
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    metadata jsonb
);


ALTER TABLE public.performance_metrics OWNER TO neondb_owner;

--
-- Name: performance_metrics_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.performance_metrics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.performance_metrics_id_seq OWNER TO neondb_owner;

--
-- Name: performance_metrics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.performance_metrics_id_seq OWNED BY public.performance_metrics.id;


--
-- Name: product_answers; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.product_answers (
    id integer NOT NULL,
    question_id integer,
    answer text NOT NULL,
    answered_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.product_answers OWNER TO neondb_owner;

--
-- Name: product_answers_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.product_answers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_answers_id_seq OWNER TO neondb_owner;

--
-- Name: product_answers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.product_answers_id_seq OWNED BY public.product_answers.id;


--
-- Name: product_attribute_values; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.product_attribute_values (
    id integer NOT NULL,
    product_id integer,
    attribute_id integer,
    value text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.product_attribute_values OWNER TO neondb_owner;

--
-- Name: product_attribute_values_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.product_attribute_values_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_attribute_values_id_seq OWNER TO neondb_owner;

--
-- Name: product_attribute_values_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.product_attribute_values_id_seq OWNED BY public.product_attribute_values.id;


--
-- Name: product_attributes; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.product_attributes (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    data_type character varying(50) NOT NULL,
    is_required boolean DEFAULT false,
    is_filterable boolean DEFAULT false,
    sort_order integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.product_attributes OWNER TO neondb_owner;

--
-- Name: product_attributes_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.product_attributes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_attributes_id_seq OWNER TO neondb_owner;

--
-- Name: product_attributes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.product_attributes_id_seq OWNED BY public.product_attributes.id;


--
-- Name: product_collection_items; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.product_collection_items (
    id integer NOT NULL,
    collection_id integer,
    product_id integer,
    sort_order integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.product_collection_items OWNER TO neondb_owner;

--
-- Name: product_collection_items_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.product_collection_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_collection_items_id_seq OWNER TO neondb_owner;

--
-- Name: product_collection_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.product_collection_items_id_seq OWNED BY public.product_collection_items.id;


--
-- Name: product_collections; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.product_collections (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    slug character varying(255),
    image_url character varying(255),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.product_collections OWNER TO neondb_owner;

--
-- Name: product_collections_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.product_collections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_collections_id_seq OWNER TO neondb_owner;

--
-- Name: product_collections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.product_collections_id_seq OWNED BY public.product_collections.id;


--
-- Name: product_labels; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.product_labels (
    id integer NOT NULL,
    product_id integer,
    label_design_id integer,
    barcode character varying(255),
    qr_code character varying(255),
    print_count integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.product_labels OWNER TO neondb_owner;

--
-- Name: product_labels_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.product_labels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_labels_id_seq OWNER TO neondb_owner;

--
-- Name: product_labels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.product_labels_id_seq OWNED BY public.product_labels.id;


--
-- Name: product_questions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.product_questions (
    id integer NOT NULL,
    product_id integer,
    customer_id integer,
    question text NOT NULL,
    is_answered boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.product_questions OWNER TO neondb_owner;

--
-- Name: product_questions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.product_questions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_questions_id_seq OWNER TO neondb_owner;

--
-- Name: product_questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.product_questions_id_seq OWNED BY public.product_questions.id;


--
-- Name: product_reviews; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.product_reviews (
    id integer NOT NULL,
    product_id integer,
    customer_id integer,
    rating integer,
    review_text text,
    is_verified boolean DEFAULT false,
    is_approved boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT product_reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.product_reviews OWNER TO neondb_owner;

--
-- Name: product_reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.product_reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_reviews_id_seq OWNER TO neondb_owner;

--
-- Name: product_reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.product_reviews_id_seq OWNED BY public.product_reviews.id;


--
-- Name: product_tax_mappings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.product_tax_mappings (
    id integer NOT NULL,
    product_id integer,
    tax_rate_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.product_tax_mappings OWNER TO neondb_owner;

--
-- Name: product_tax_mappings_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.product_tax_mappings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_tax_mappings_id_seq OWNER TO neondb_owner;

--
-- Name: product_tax_mappings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.product_tax_mappings_id_seq OWNED BY public.product_tax_mappings.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    name_telugu character varying(255),
    description text,
    category_id integer,
    brand_id integer,
    supplier_id integer,
    sku character varying(255),
    barcode character varying(255),
    qr_code character varying(255),
    price numeric(10,2),
    mrp numeric(10,2),
    cost_price numeric(10,2),
    weight numeric(10,2),
    weight_unit character varying(20),
    stock_quantity integer DEFAULT 0,
    min_stock_level integer DEFAULT 0,
    max_stock_level integer DEFAULT 0,
    is_organic boolean DEFAULT false,
    is_active boolean DEFAULT true,
    tax_rate numeric(5,2) DEFAULT 0,
    nutrition_facts jsonb,
    images jsonb,
    tags jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    selling_price numeric(10,2),
    status character varying(50) DEFAULT 'active'::character varying
);


ALTER TABLE public.products OWNER TO neondb_owner;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO neondb_owner;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: promotion_usage; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.promotion_usage (
    id integer NOT NULL,
    promotion_id integer,
    customer_id integer,
    order_id integer,
    discount_amount numeric(10,2),
    used_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.promotion_usage OWNER TO neondb_owner;

--
-- Name: promotion_usage_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.promotion_usage_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.promotion_usage_id_seq OWNER TO neondb_owner;

--
-- Name: promotion_usage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.promotion_usage_id_seq OWNED BY public.promotion_usage.id;


--
-- Name: promotions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.promotions (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    type character varying(50) NOT NULL,
    discount_type character varying(50),
    discount_value numeric(10,2),
    min_order_amount numeric(10,2),
    max_discount_amount numeric(10,2),
    start_date date,
    end_date date,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.promotions OWNER TO neondb_owner;

--
-- Name: promotions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.promotions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.promotions_id_seq OWNER TO neondb_owner;

--
-- Name: promotions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.promotions_id_seq OWNED BY public.promotions.id;


--
-- Name: purchase_order_items; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.purchase_order_items (
    id integer NOT NULL,
    po_id integer,
    product_id integer,
    quantity integer NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    total_price numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.purchase_order_items OWNER TO neondb_owner;

--
-- Name: purchase_order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.purchase_order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.purchase_order_items_id_seq OWNER TO neondb_owner;

--
-- Name: purchase_order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.purchase_order_items_id_seq OWNED BY public.purchase_order_items.id;


--
-- Name: purchase_orders; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.purchase_orders (
    id integer NOT NULL,
    po_number character varying(255) NOT NULL,
    supplier_id integer,
    branch_id integer,
    total_amount numeric(10,2),
    status character varying(50) DEFAULT 'pending'::character varying,
    order_date date,
    expected_delivery_date date,
    created_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.purchase_orders OWNER TO neondb_owner;

--
-- Name: purchase_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.purchase_orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.purchase_orders_id_seq OWNER TO neondb_owner;

--
-- Name: purchase_orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.purchase_orders_id_seq OWNED BY public.purchase_orders.id;


--
-- Name: queue_jobs; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.queue_jobs (
    id integer NOT NULL,
    queue_name character varying(255) NOT NULL,
    payload jsonb NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying,
    attempts integer DEFAULT 0,
    max_attempts integer DEFAULT 3,
    available_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.queue_jobs OWNER TO neondb_owner;

--
-- Name: queue_jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.queue_jobs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.queue_jobs_id_seq OWNER TO neondb_owner;

--
-- Name: queue_jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.queue_jobs_id_seq OWNED BY public.queue_jobs.id;


--
-- Name: rate_limits; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.rate_limits (
    id integer NOT NULL,
    key character varying(255) NOT NULL,
    requests integer DEFAULT 0,
    reset_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.rate_limits OWNER TO neondb_owner;

--
-- Name: rate_limits_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.rate_limits_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rate_limits_id_seq OWNER TO neondb_owner;

--
-- Name: rate_limits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.rate_limits_id_seq OWNED BY public.rate_limits.id;


--
-- Name: reports; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.reports (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    type character varying(50) NOT NULL,
    parameters jsonb,
    generated_by integer,
    file_path character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.reports OWNER TO neondb_owner;

--
-- Name: reports_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.reports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reports_id_seq OWNER TO neondb_owner;

--
-- Name: reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.reports_id_seq OWNED BY public.reports.id;


--
-- Name: restore_jobs; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.restore_jobs (
    id integer NOT NULL,
    file_path character varying(255) NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying,
    started_at timestamp without time zone,
    completed_at timestamp without time zone,
    error_message text,
    created_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.restore_jobs OWNER TO neondb_owner;

--
-- Name: restore_jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.restore_jobs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.restore_jobs_id_seq OWNER TO neondb_owner;

--
-- Name: restore_jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.restore_jobs_id_seq OWNED BY public.restore_jobs.id;


--
-- Name: return_items; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.return_items (
    id integer NOT NULL,
    return_id integer,
    order_item_id integer,
    quantity integer NOT NULL,
    reason text,
    condition character varying(50),
    refund_amount numeric(10,2),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.return_items OWNER TO neondb_owner;

--
-- Name: return_items_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.return_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.return_items_id_seq OWNER TO neondb_owner;

--
-- Name: return_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.return_items_id_seq OWNED BY public.return_items.id;


--
-- Name: returns; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.returns (
    id integer NOT NULL,
    order_id integer,
    customer_id integer,
    return_number character varying(255) NOT NULL,
    reason text,
    status character varying(50) DEFAULT 'requested'::character varying,
    refund_amount numeric(10,2),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.returns OWNER TO neondb_owner;

--
-- Name: returns_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.returns_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.returns_id_seq OWNER TO neondb_owner;

--
-- Name: returns_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.returns_id_seq OWNED BY public.returns.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    permissions jsonb,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.roles OWNER TO neondb_owner;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO neondb_owner;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: sales_reports; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.sales_reports (
    id integer NOT NULL,
    branch_id integer,
    report_date date,
    total_sales numeric(10,2),
    total_orders integer,
    avg_order_value numeric(10,2),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.sales_reports OWNER TO neondb_owner;

--
-- Name: sales_reports_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.sales_reports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sales_reports_id_seq OWNER TO neondb_owner;

--
-- Name: sales_reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.sales_reports_id_seq OWNED BY public.sales_reports.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.schema_migrations (
    id integer NOT NULL,
    version character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    execution_time_ms integer,
    checksum character varying(64),
    success boolean DEFAULT true,
    error_message text
);


ALTER TABLE public.schema_migrations OWNER TO neondb_owner;

--
-- Name: schema_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.schema_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.schema_migrations_id_seq OWNER TO neondb_owner;

--
-- Name: schema_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.schema_migrations_id_seq OWNED BY public.schema_migrations.id;


--
-- Name: search_queries; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.search_queries (
    id integer NOT NULL,
    query_text character varying(255) NOT NULL,
    results_count integer,
    user_id integer,
    session_id character varying(255),
    searched_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.search_queries OWNER TO neondb_owner;

--
-- Name: search_queries_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.search_queries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.search_queries_id_seq OWNER TO neondb_owner;

--
-- Name: search_queries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.search_queries_id_seq OWNED BY public.search_queries.id;


--
-- Name: seo_meta; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.seo_meta (
    id integer NOT NULL,
    page_type character varying(50) NOT NULL,
    page_id integer,
    meta_title character varying(255),
    meta_description text,
    meta_keywords text,
    og_title character varying(255),
    og_description text,
    og_image character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.seo_meta OWNER TO neondb_owner;

--
-- Name: seo_meta_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.seo_meta_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seo_meta_id_seq OWNER TO neondb_owner;

--
-- Name: seo_meta_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.seo_meta_id_seq OWNED BY public.seo_meta.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.sessions (
    id integer NOT NULL,
    session_id character varying(255) NOT NULL,
    user_id integer,
    ip_address inet,
    user_agent text,
    data jsonb,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.sessions OWNER TO neondb_owner;

--
-- Name: sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sessions_id_seq OWNER TO neondb_owner;

--
-- Name: sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.sessions_id_seq OWNED BY public.sessions.id;


--
-- Name: shipping_methods; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.shipping_methods (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    cost numeric(10,2) NOT NULL,
    delivery_time character varying(100),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.shipping_methods OWNER TO neondb_owner;

--
-- Name: shipping_methods_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.shipping_methods_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.shipping_methods_id_seq OWNER TO neondb_owner;

--
-- Name: shipping_methods_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.shipping_methods_id_seq OWNED BY public.shipping_methods.id;


--
-- Name: social_media_posts; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.social_media_posts (
    id integer NOT NULL,
    platform character varying(50) NOT NULL,
    content text,
    image_url character varying(255),
    scheduled_at timestamp without time zone,
    posted_at timestamp without time zone,
    status character varying(50) DEFAULT 'draft'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.social_media_posts OWNER TO neondb_owner;

--
-- Name: social_media_posts_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.social_media_posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.social_media_posts_id_seq OWNER TO neondb_owner;

--
-- Name: social_media_posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.social_media_posts_id_seq OWNED BY public.social_media_posts.id;


--
-- Name: states; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.states (
    id integer NOT NULL,
    country_id integer,
    name character varying(255) NOT NULL,
    code character varying(10),
    is_active boolean DEFAULT true
);


ALTER TABLE public.states OWNER TO neondb_owner;

--
-- Name: states_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.states_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.states_id_seq OWNER TO neondb_owner;

--
-- Name: states_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.states_id_seq OWNED BY public.states.id;


--
-- Name: stock_alerts; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.stock_alerts (
    id integer NOT NULL,
    product_id integer,
    branch_id integer,
    alert_type character varying(50) NOT NULL,
    current_stock integer,
    threshold_level integer,
    message text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.stock_alerts OWNER TO neondb_owner;

--
-- Name: stock_alerts_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.stock_alerts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stock_alerts_id_seq OWNER TO neondb_owner;

--
-- Name: stock_alerts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.stock_alerts_id_seq OWNED BY public.stock_alerts.id;


--
-- Name: stock_movements; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.stock_movements (
    id integer NOT NULL,
    product_id integer,
    branch_id integer,
    movement_type character varying(50) NOT NULL,
    quantity integer NOT NULL,
    reference_id integer,
    reference_type character varying(50),
    notes text,
    created_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.stock_movements OWNER TO neondb_owner;

--
-- Name: stock_movements_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.stock_movements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stock_movements_id_seq OWNER TO neondb_owner;

--
-- Name: stock_movements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.stock_movements_id_seq OWNED BY public.stock_movements.id;


--
-- Name: subscription_plans; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.subscription_plans (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    duration_days integer NOT NULL,
    features jsonb,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.subscription_plans OWNER TO neondb_owner;

--
-- Name: subscription_plans_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.subscription_plans_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.subscription_plans_id_seq OWNER TO neondb_owner;

--
-- Name: subscription_plans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.subscription_plans_id_seq OWNED BY public.subscription_plans.id;


--
-- Name: suppliers; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.suppliers (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    name_telugu character varying(255),
    contact_person character varying(255),
    email character varying(255),
    phone character varying(20),
    address text,
    city character varying(100),
    state character varying(100),
    pincode character varying(10),
    gstin character varying(15),
    organic_certified boolean DEFAULT false,
    certification_number character varying(255),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.suppliers OWNER TO neondb_owner;

--
-- Name: suppliers_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.suppliers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.suppliers_id_seq OWNER TO neondb_owner;

--
-- Name: suppliers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.suppliers_id_seq OWNED BY public.suppliers.id;


--
-- Name: support_ticket_messages; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.support_ticket_messages (
    id integer NOT NULL,
    ticket_id integer,
    sender_id integer,
    message text NOT NULL,
    attachment_url character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.support_ticket_messages OWNER TO neondb_owner;

--
-- Name: support_ticket_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.support_ticket_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.support_ticket_messages_id_seq OWNER TO neondb_owner;

--
-- Name: support_ticket_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.support_ticket_messages_id_seq OWNED BY public.support_ticket_messages.id;


--
-- Name: support_tickets; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.support_tickets (
    id integer NOT NULL,
    ticket_number character varying(255) NOT NULL,
    customer_id integer,
    subject character varying(255) NOT NULL,
    description text,
    priority character varying(50) DEFAULT 'medium'::character varying,
    status character varying(50) DEFAULT 'open'::character varying,
    assigned_to integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.support_tickets OWNER TO neondb_owner;

--
-- Name: support_tickets_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.support_tickets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.support_tickets_id_seq OWNER TO neondb_owner;

--
-- Name: support_tickets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.support_tickets_id_seq OWNED BY public.support_tickets.id;


--
-- Name: system_logs; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.system_logs (
    id integer NOT NULL,
    level character varying(50) NOT NULL,
    message text NOT NULL,
    context jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.system_logs OWNER TO neondb_owner;

--
-- Name: system_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.system_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.system_logs_id_seq OWNER TO neondb_owner;

--
-- Name: system_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.system_logs_id_seq OWNED BY public.system_logs.id;


--
-- Name: system_settings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.system_settings (
    id integer NOT NULL,
    key character varying(255) NOT NULL,
    value text,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.system_settings OWNER TO neondb_owner;

--
-- Name: system_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.system_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.system_settings_id_seq OWNER TO neondb_owner;

--
-- Name: system_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.system_settings_id_seq OWNED BY public.system_settings.id;


--
-- Name: tax_rates; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.tax_rates (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    rate numeric(5,2) NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tax_rates OWNER TO neondb_owner;

--
-- Name: tax_rates_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.tax_rates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tax_rates_id_seq OWNER TO neondb_owner;

--
-- Name: tax_rates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.tax_rates_id_seq OWNED BY public.tax_rates.id;


--
-- Name: traditional_categories; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.traditional_categories (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    name_telugu character varying(255),
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.traditional_categories OWNER TO neondb_owner;

--
-- Name: traditional_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.traditional_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.traditional_categories_id_seq OWNER TO neondb_owner;

--
-- Name: traditional_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.traditional_categories_id_seq OWNED BY public.traditional_categories.id;


--
-- Name: traditional_items; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.traditional_items (
    id integer NOT NULL,
    name_english character varying(255) NOT NULL,
    name_telugu character varying(255) NOT NULL,
    category character varying(255),
    unit character varying(50),
    ordinary_price numeric(10,2),
    medium_price numeric(10,2),
    best_price numeric(10,2),
    is_active boolean DEFAULT true,
    region character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.traditional_items OWNER TO neondb_owner;

--
-- Name: traditional_items_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.traditional_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.traditional_items_id_seq OWNER TO neondb_owner;

--
-- Name: traditional_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.traditional_items_id_seq OWNED BY public.traditional_items.id;


--
-- Name: traditional_order_items; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.traditional_order_items (
    id integer NOT NULL,
    order_id integer,
    traditional_item_id integer,
    quantity integer NOT NULL,
    quality_grade character varying(50),
    unit_price numeric(10,2) NOT NULL,
    total_price numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.traditional_order_items OWNER TO neondb_owner;

--
-- Name: traditional_order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.traditional_order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.traditional_order_items_id_seq OWNER TO neondb_owner;

--
-- Name: traditional_order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.traditional_order_items_id_seq OWNED BY public.traditional_order_items.id;


--
-- Name: traditional_orders; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.traditional_orders (
    id integer NOT NULL,
    order_number character varying(255) NOT NULL,
    customer_id integer,
    branch_id integer,
    total_amount numeric(10,2) NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying,
    payment_status character varying(50) DEFAULT 'pending'::character varying,
    delivery_address text,
    delivery_date date,
    special_instructions text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.traditional_orders OWNER TO neondb_owner;

--
-- Name: traditional_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.traditional_orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.traditional_orders_id_seq OWNER TO neondb_owner;

--
-- Name: traditional_orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.traditional_orders_id_seq OWNED BY public.traditional_orders.id;


--
-- Name: translations; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.translations (
    id integer NOT NULL,
    key character varying(255) NOT NULL,
    language character varying(10) NOT NULL,
    value text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.translations OWNER TO neondb_owner;

--
-- Name: translations_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.translations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.translations_id_seq OWNER TO neondb_owner;

--
-- Name: translations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.translations_id_seq OWNED BY public.translations.id;


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.user_roles (
    id integer NOT NULL,
    user_id integer,
    role_id integer,
    assigned_by integer,
    assigned_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_active boolean DEFAULT true
);


ALTER TABLE public.user_roles OWNER TO neondb_owner;

--
-- Name: user_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.user_roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_roles_id_seq OWNER TO neondb_owner;

--
-- Name: user_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.user_roles_id_seq OWNED BY public.user_roles.id;


--
-- Name: user_sessions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.user_sessions (
    id integer NOT NULL,
    user_id integer,
    session_token character varying(255) NOT NULL,
    ip_address inet,
    user_agent text,
    expires_at timestamp without time zone NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_sessions OWNER TO neondb_owner;

--
-- Name: user_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.user_sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_sessions_id_seq OWNER TO neondb_owner;

--
-- Name: user_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.user_sessions_id_seq OWNED BY public.user_sessions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    first_name character varying(255),
    last_name character varying(255),
    phone character varying(20),
    role character varying(50),
    branch_id integer,
    profile_image character varying(255),
    is_active boolean DEFAULT true,
    last_login timestamp without time zone,
    email_verified boolean DEFAULT false,
    phone_verified boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: vendors; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.vendors (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    contact_person character varying(255),
    email character varying(255),
    phone character varying(20),
    address text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.vendors OWNER TO neondb_owner;

--
-- Name: vendors_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.vendors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vendors_id_seq OWNER TO neondb_owner;

--
-- Name: vendors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.vendors_id_seq OWNED BY public.vendors.id;


--
-- Name: webhook_deliveries; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.webhook_deliveries (
    id integer NOT NULL,
    webhook_id integer,
    event_type character varying(100) NOT NULL,
    payload jsonb,
    response_status integer,
    response_body text,
    delivered_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.webhook_deliveries OWNER TO neondb_owner;

--
-- Name: webhook_deliveries_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.webhook_deliveries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.webhook_deliveries_id_seq OWNER TO neondb_owner;

--
-- Name: webhook_deliveries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.webhook_deliveries_id_seq OWNED BY public.webhook_deliveries.id;


--
-- Name: webhooks; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.webhooks (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    url character varying(255) NOT NULL,
    events jsonb,
    secret character varying(255),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.webhooks OWNER TO neondb_owner;

--
-- Name: webhooks_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.webhooks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.webhooks_id_seq OWNER TO neondb_owner;

--
-- Name: webhooks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.webhooks_id_seq OWNED BY public.webhooks.id;


--
-- Name: wishlist_items; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.wishlist_items (
    id integer NOT NULL,
    wishlist_id integer,
    product_id integer,
    added_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.wishlist_items OWNER TO neondb_owner;

--
-- Name: wishlist_items_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.wishlist_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.wishlist_items_id_seq OWNER TO neondb_owner;

--
-- Name: wishlist_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.wishlist_items_id_seq OWNED BY public.wishlist_items.id;


--
-- Name: wishlists; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.wishlists (
    id integer NOT NULL,
    customer_id integer,
    name character varying(255) DEFAULT 'My Wishlist'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.wishlists OWNER TO neondb_owner;

--
-- Name: wishlists_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.wishlists_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.wishlists_id_seq OWNER TO neondb_owner;

--
-- Name: wishlists_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.wishlists_id_seq OWNED BY public.wishlists.id;


--
-- Name: ab_test_assignments id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ab_test_assignments ALTER COLUMN id SET DEFAULT nextval('public.ab_test_assignments_id_seq'::regclass);


--
-- Name: ab_tests id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ab_tests ALTER COLUMN id SET DEFAULT nextval('public.ab_tests_id_seq'::regclass);


--
-- Name: activity_logs id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.activity_logs ALTER COLUMN id SET DEFAULT nextval('public.activity_logs_id_seq'::regclass);


--
-- Name: analytics_events id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.analytics_events ALTER COLUMN id SET DEFAULT nextval('public.analytics_events_id_seq'::regclass);


--
-- Name: api_keys id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.api_keys ALTER COLUMN id SET DEFAULT nextval('public.api_keys_id_seq'::regclass);


--
-- Name: api_request_logs id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.api_request_logs ALTER COLUMN id SET DEFAULT nextval('public.api_request_logs_id_seq'::regclass);


--
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- Name: backup_jobs id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.backup_jobs ALTER COLUMN id SET DEFAULT nextval('public.backup_jobs_id_seq'::regclass);


--
-- Name: backup_logs id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.backup_logs ALTER COLUMN id SET DEFAULT nextval('public.backup_logs_id_seq'::regclass);


--
-- Name: backup_schedules id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.backup_schedules ALTER COLUMN id SET DEFAULT nextval('public.backup_schedules_id_seq'::regclass);


--
-- Name: branch_traditional_items id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.branch_traditional_items ALTER COLUMN id SET DEFAULT nextval('public.branch_traditional_items_id_seq'::regclass);


--
-- Name: branches id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.branches ALTER COLUMN id SET DEFAULT nextval('public.branches_id_seq'::regclass);


--
-- Name: brands id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.brands ALTER COLUMN id SET DEFAULT nextval('public.brands_id_seq'::regclass);


--
-- Name: campaign_recipients id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.campaign_recipients ALTER COLUMN id SET DEFAULT nextval('public.campaign_recipients_id_seq'::regclass);


--
-- Name: cart_items id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.cart_items ALTER COLUMN id SET DEFAULT nextval('public.cart_items_id_seq'::regclass);


--
-- Name: carts id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.carts ALTER COLUMN id SET DEFAULT nextval('public.carts_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: cities id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.cities ALTER COLUMN id SET DEFAULT nextval('public.cities_id_seq'::regclass);


--
-- Name: cms_banners id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.cms_banners ALTER COLUMN id SET DEFAULT nextval('public.cms_banners_id_seq'::regclass);


--
-- Name: cms_pages id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.cms_pages ALTER COLUMN id SET DEFAULT nextval('public.cms_pages_id_seq'::regclass);


--
-- Name: communication_logs id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.communication_logs ALTER COLUMN id SET DEFAULT nextval('public.communication_logs_id_seq'::regclass);


--
-- Name: communication_templates id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.communication_templates ALTER COLUMN id SET DEFAULT nextval('public.communication_templates_id_seq'::regclass);


--
-- Name: companies id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.companies ALTER COLUMN id SET DEFAULT nextval('public.companies_id_seq'::regclass);


--
-- Name: content_versions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.content_versions ALTER COLUMN id SET DEFAULT nextval('public.content_versions_id_seq'::regclass);


--
-- Name: countries id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.countries ALTER COLUMN id SET DEFAULT nextval('public.countries_id_seq'::regclass);


--
-- Name: currencies id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.currencies ALTER COLUMN id SET DEFAULT nextval('public.currencies_id_seq'::regclass);


--
-- Name: custom_template_dimensions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.custom_template_dimensions ALTER COLUMN id SET DEFAULT nextval('public.custom_template_dimensions_id_seq'::regclass);


--
-- Name: custom_templates id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.custom_templates ALTER COLUMN id SET DEFAULT nextval('public.custom_templates_id_seq'::regclass);


--
-- Name: customer_addresses id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.customer_addresses ALTER COLUMN id SET DEFAULT nextval('public.customer_addresses_id_seq'::regclass);


--
-- Name: customer_subscriptions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.customer_subscriptions ALTER COLUMN id SET DEFAULT nextval('public.customer_subscriptions_id_seq'::regclass);


--
-- Name: customers id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.customers ALTER COLUMN id SET DEFAULT nextval('public.customers_id_seq'::regclass);


--
-- Name: deliveries id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.deliveries ALTER COLUMN id SET DEFAULT nextval('public.deliveries_id_seq'::regclass);


--
-- Name: delivery_assignments id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.delivery_assignments ALTER COLUMN id SET DEFAULT nextval('public.delivery_assignments_id_seq'::regclass);


--
-- Name: delivery_personnel id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.delivery_personnel ALTER COLUMN id SET DEFAULT nextval('public.delivery_personnel_id_seq'::regclass);


--
-- Name: delivery_zones id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.delivery_zones ALTER COLUMN id SET DEFAULT nextval('public.delivery_zones_id_seq'::regclass);


--
-- Name: employee_attendance id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.employee_attendance ALTER COLUMN id SET DEFAULT nextval('public.employee_attendance_id_seq'::regclass);


--
-- Name: employees id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.employees ALTER COLUMN id SET DEFAULT nextval('public.employees_id_seq'::regclass);


--
-- Name: expense_categories id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.expense_categories ALTER COLUMN id SET DEFAULT nextval('public.expense_categories_id_seq'::regclass);


--
-- Name: expenses id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.expenses ALTER COLUMN id SET DEFAULT nextval('public.expenses_id_seq'::regclass);


--
-- Name: feature_flags id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.feature_flags ALTER COLUMN id SET DEFAULT nextval('public.feature_flags_id_seq'::regclass);


--
-- Name: gift_card_transactions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.gift_card_transactions ALTER COLUMN id SET DEFAULT nextval('public.gift_card_transactions_id_seq'::regclass);


--
-- Name: gift_cards id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.gift_cards ALTER COLUMN id SET DEFAULT nextval('public.gift_cards_id_seq'::regclass);


--
-- Name: health_check id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.health_check ALTER COLUMN id SET DEFAULT nextval('public.health_check_id_seq'::regclass);


--
-- Name: health_checks id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.health_checks ALTER COLUMN id SET DEFAULT nextval('public.health_checks_id_seq'::regclass);


--
-- Name: images id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.images ALTER COLUMN id SET DEFAULT nextval('public.images_id_seq'::regclass);


--
-- Name: inventory id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory ALTER COLUMN id SET DEFAULT nextval('public.inventory_id_seq'::regclass);


--
-- Name: inventory_adjustments id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory_adjustments ALTER COLUMN id SET DEFAULT nextval('public.inventory_adjustments_id_seq'::regclass);


--
-- Name: inventory_alerts id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory_alerts ALTER COLUMN id SET DEFAULT nextval('public.inventory_alerts_id_seq'::regclass);


--
-- Name: inventory_history id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory_history ALTER COLUMN id SET DEFAULT nextval('public.inventory_history_id_seq'::regclass);


--
-- Name: inventory_transactions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory_transactions ALTER COLUMN id SET DEFAULT nextval('public.inventory_transactions_id_seq'::regclass);


--
-- Name: invoices id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.invoices ALTER COLUMN id SET DEFAULT nextval('public.invoices_id_seq'::regclass);


--
-- Name: label_designs id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.label_designs ALTER COLUMN id SET DEFAULT nextval('public.label_designs_id_seq'::regclass);


--
-- Name: label_media_types id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.label_media_types ALTER COLUMN id SET DEFAULT nextval('public.label_media_types_id_seq'::regclass);


--
-- Name: label_templates id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.label_templates ALTER COLUMN id SET DEFAULT nextval('public.label_templates_id_seq'::regclass);


--
-- Name: loyalty_points id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.loyalty_points ALTER COLUMN id SET DEFAULT nextval('public.loyalty_points_id_seq'::regclass);


--
-- Name: loyalty_rewards id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.loyalty_rewards ALTER COLUMN id SET DEFAULT nextval('public.loyalty_rewards_id_seq'::regclass);


--
-- Name: loyalty_transactions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.loyalty_transactions ALTER COLUMN id SET DEFAULT nextval('public.loyalty_transactions_id_seq'::regclass);


--
-- Name: marketing_campaigns id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.marketing_campaigns ALTER COLUMN id SET DEFAULT nextval('public.marketing_campaigns_id_seq'::regclass);


--
-- Name: notification_settings id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notification_settings ALTER COLUMN id SET DEFAULT nextval('public.notification_settings_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: nutrition_templates id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.nutrition_templates ALTER COLUMN id SET DEFAULT nextval('public.nutrition_templates_id_seq'::regclass);


--
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- Name: performance_metrics id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.performance_metrics ALTER COLUMN id SET DEFAULT nextval('public.performance_metrics_id_seq'::regclass);


--
-- Name: product_answers id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_answers ALTER COLUMN id SET DEFAULT nextval('public.product_answers_id_seq'::regclass);


--
-- Name: product_attribute_values id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_attribute_values ALTER COLUMN id SET DEFAULT nextval('public.product_attribute_values_id_seq'::regclass);


--
-- Name: product_attributes id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_attributes ALTER COLUMN id SET DEFAULT nextval('public.product_attributes_id_seq'::regclass);


--
-- Name: product_collection_items id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_collection_items ALTER COLUMN id SET DEFAULT nextval('public.product_collection_items_id_seq'::regclass);


--
-- Name: product_collections id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_collections ALTER COLUMN id SET DEFAULT nextval('public.product_collections_id_seq'::regclass);


--
-- Name: product_labels id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_labels ALTER COLUMN id SET DEFAULT nextval('public.product_labels_id_seq'::regclass);


--
-- Name: product_questions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_questions ALTER COLUMN id SET DEFAULT nextval('public.product_questions_id_seq'::regclass);


--
-- Name: product_reviews id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_reviews ALTER COLUMN id SET DEFAULT nextval('public.product_reviews_id_seq'::regclass);


--
-- Name: product_tax_mappings id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_tax_mappings ALTER COLUMN id SET DEFAULT nextval('public.product_tax_mappings_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: promotion_usage id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.promotion_usage ALTER COLUMN id SET DEFAULT nextval('public.promotion_usage_id_seq'::regclass);


--
-- Name: promotions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.promotions ALTER COLUMN id SET DEFAULT nextval('public.promotions_id_seq'::regclass);


--
-- Name: purchase_order_items id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.purchase_order_items ALTER COLUMN id SET DEFAULT nextval('public.purchase_order_items_id_seq'::regclass);


--
-- Name: purchase_orders id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.purchase_orders ALTER COLUMN id SET DEFAULT nextval('public.purchase_orders_id_seq'::regclass);


--
-- Name: queue_jobs id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.queue_jobs ALTER COLUMN id SET DEFAULT nextval('public.queue_jobs_id_seq'::regclass);


--
-- Name: rate_limits id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.rate_limits ALTER COLUMN id SET DEFAULT nextval('public.rate_limits_id_seq'::regclass);


--
-- Name: reports id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.reports ALTER COLUMN id SET DEFAULT nextval('public.reports_id_seq'::regclass);


--
-- Name: restore_jobs id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.restore_jobs ALTER COLUMN id SET DEFAULT nextval('public.restore_jobs_id_seq'::regclass);


--
-- Name: return_items id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.return_items ALTER COLUMN id SET DEFAULT nextval('public.return_items_id_seq'::regclass);


--
-- Name: returns id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.returns ALTER COLUMN id SET DEFAULT nextval('public.returns_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: sales_reports id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sales_reports ALTER COLUMN id SET DEFAULT nextval('public.sales_reports_id_seq'::regclass);


--
-- Name: schema_migrations id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.schema_migrations ALTER COLUMN id SET DEFAULT nextval('public.schema_migrations_id_seq'::regclass);


--
-- Name: search_queries id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.search_queries ALTER COLUMN id SET DEFAULT nextval('public.search_queries_id_seq'::regclass);


--
-- Name: seo_meta id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.seo_meta ALTER COLUMN id SET DEFAULT nextval('public.seo_meta_id_seq'::regclass);


--
-- Name: sessions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sessions ALTER COLUMN id SET DEFAULT nextval('public.sessions_id_seq'::regclass);


--
-- Name: shipping_methods id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.shipping_methods ALTER COLUMN id SET DEFAULT nextval('public.shipping_methods_id_seq'::regclass);


--
-- Name: social_media_posts id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.social_media_posts ALTER COLUMN id SET DEFAULT nextval('public.social_media_posts_id_seq'::regclass);


--
-- Name: states id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.states ALTER COLUMN id SET DEFAULT nextval('public.states_id_seq'::regclass);


--
-- Name: stock_alerts id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.stock_alerts ALTER COLUMN id SET DEFAULT nextval('public.stock_alerts_id_seq'::regclass);


--
-- Name: stock_movements id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.stock_movements ALTER COLUMN id SET DEFAULT nextval('public.stock_movements_id_seq'::regclass);


--
-- Name: subscription_plans id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.subscription_plans ALTER COLUMN id SET DEFAULT nextval('public.subscription_plans_id_seq'::regclass);


--
-- Name: suppliers id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.suppliers ALTER COLUMN id SET DEFAULT nextval('public.suppliers_id_seq'::regclass);


--
-- Name: support_ticket_messages id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.support_ticket_messages ALTER COLUMN id SET DEFAULT nextval('public.support_ticket_messages_id_seq'::regclass);


--
-- Name: support_tickets id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.support_tickets ALTER COLUMN id SET DEFAULT nextval('public.support_tickets_id_seq'::regclass);


--
-- Name: system_logs id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.system_logs ALTER COLUMN id SET DEFAULT nextval('public.system_logs_id_seq'::regclass);


--
-- Name: system_settings id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.system_settings ALTER COLUMN id SET DEFAULT nextval('public.system_settings_id_seq'::regclass);


--
-- Name: tax_rates id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tax_rates ALTER COLUMN id SET DEFAULT nextval('public.tax_rates_id_seq'::regclass);


--
-- Name: traditional_categories id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.traditional_categories ALTER COLUMN id SET DEFAULT nextval('public.traditional_categories_id_seq'::regclass);


--
-- Name: traditional_items id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.traditional_items ALTER COLUMN id SET DEFAULT nextval('public.traditional_items_id_seq'::regclass);


--
-- Name: traditional_order_items id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.traditional_order_items ALTER COLUMN id SET DEFAULT nextval('public.traditional_order_items_id_seq'::regclass);


--
-- Name: traditional_orders id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.traditional_orders ALTER COLUMN id SET DEFAULT nextval('public.traditional_orders_id_seq'::regclass);


--
-- Name: translations id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.translations ALTER COLUMN id SET DEFAULT nextval('public.translations_id_seq'::regclass);


--
-- Name: user_roles id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_roles ALTER COLUMN id SET DEFAULT nextval('public.user_roles_id_seq'::regclass);


--
-- Name: user_sessions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_sessions ALTER COLUMN id SET DEFAULT nextval('public.user_sessions_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: vendors id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.vendors ALTER COLUMN id SET DEFAULT nextval('public.vendors_id_seq'::regclass);


--
-- Name: webhook_deliveries id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.webhook_deliveries ALTER COLUMN id SET DEFAULT nextval('public.webhook_deliveries_id_seq'::regclass);


--
-- Name: webhooks id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.webhooks ALTER COLUMN id SET DEFAULT nextval('public.webhooks_id_seq'::regclass);


--
-- Name: wishlist_items id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.wishlist_items ALTER COLUMN id SET DEFAULT nextval('public.wishlist_items_id_seq'::regclass);


--
-- Name: wishlists id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.wishlists ALTER COLUMN id SET DEFAULT nextval('public.wishlists_id_seq'::regclass);


--
-- Data for Name: ab_test_assignments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.ab_test_assignments (id, test_id, user_id, variant, assigned_at) FROM stdin;
\.


--
-- Data for Name: ab_tests; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.ab_tests (id, name, description, start_date, end_date, traffic_split, is_active, created_at) FROM stdin;
\.


--
-- Data for Name: activity_logs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.activity_logs (id, user_id, action, description, ip_address, user_agent, metadata, created_at) FROM stdin;
\.


--
-- Data for Name: analytics_events; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.analytics_events (id, event_name, user_id, session_id, properties, "timestamp", created_at) FROM stdin;
\.


--
-- Data for Name: api_keys; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.api_keys (id, name, key, user_id, permissions, expires_at, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: api_request_logs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.api_request_logs (id, api_key_id, endpoint, method, ip_address, response_status, response_time, created_at) FROM stdin;
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.audit_logs (id, user_id, action, table_name, record_id, old_values, new_values, ip_address, user_agent, created_at) FROM stdin;
\.


--
-- Data for Name: backup_jobs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.backup_jobs (id, schedule_id, status, file_path, file_size, started_at, completed_at, error_message, created_at) FROM stdin;
\.


--
-- Data for Name: backup_logs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.backup_logs (id, job_id, level, message, created_at) FROM stdin;
\.


--
-- Data for Name: backup_schedules; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.backup_schedules (id, name, schedule_cron, backup_type, retention_days, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: branch_traditional_items; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.branch_traditional_items (id, branch_id, traditional_item_id, local_name, local_name_telugu, supplier_name, supplier_phone, ordinary_price, medium_price, best_price, current_stock, min_stock_level, max_stock_level, last_restocked_at, is_available, quality_grade, seasonal_availability, harvest_season, storage_instructions, created_at, updated_at, item_id, stock_quantity) FROM stdin;
\.


--
-- Data for Name: branches; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.branches (id, company_id, name, name_telugu, code, city, state, address, phone, email, manager_name, manager_phone, latitude, longitude, is_active, created_at, updated_at, country, postal_code, operating_hours, delivery_radius, settings) FROM stdin;
1	1	LeafyHealth Hyderabad Central	లీఫీ హెల్త్ హైదరాబాద్ సెంట్రల్	HYD001	Hyderabad	Telangana	Banjara Hills, Road No 12, Hyderabad	+91-9876543210	hyderabad@leafyhealth.com	రమేష్ కుమార్	+91-9876543215	\N	\N	t	2025-07-14 15:12:53.036997	2025-07-14 15:12:53.036997	India	\N	\N	\N	\N
2	1	LeafyHealth Secunderabad	లీఫీ హెల్త్ సికింద్రాబాద్	SEC001	Secunderabad	Telangana	Paradise Circle, Secunderabad	+91-9876543216	secunderabad@leafyhealth.com	ప్రియా శర్మ	+91-9876543217	\N	\N	t	2025-07-14 15:12:53.036997	2025-07-14 15:12:53.036997	India	\N	\N	\N	\N
3	2	LeafyHealth Vijayawada Main	లీఫీ హెల్త్ విజయవాడ మెయిన్	VJA001	Vijayawada	Andhra Pradesh	MG Road, Vijayawada	+91-9876543211	vijayawada@leafyhealth.com	సురేష్ రెడ్డి	+91-9876543218	\N	\N	t	2025-07-14 15:12:53.036997	2025-07-14 15:12:53.036997	India	\N	\N	\N	\N
4	3	LeafyHealth Visakhapatnam Beach	లీఫీ హెల్త్ విశాఖపట్నం బీచ్	VSK001	Visakhapatnam	Andhra Pradesh	Beach Road, Visakhapatnam	+91-9876543212	visakhapatnam@leafyhealth.com	అనిల్ వర్మ	+91-9876543219	\N	\N	t	2025-07-14 15:12:53.036997	2025-07-14 15:12:53.036997	India	\N	\N	\N	\N
5	4	LeafyHealth Warangal Central	లీఫీ హెల్త్ వరంగల్ సెంట్రల్	WGL001	Warangal	Telangana	Hanamkonda, Warangal	+91-9876543213	warangal@leafyhealth.com	గీత రాణి	+91-9876543220	\N	\N	t	2025-07-14 15:12:53.036997	2025-07-14 15:12:53.036997	India	\N	\N	\N	\N
6	5	LeafyHealth Tirupati Temple	లీఫీ హెల్త్ తిరుపతి టెంపుల్	TRP001	Tirupati	Andhra Pradesh	Tirumala Road, Tirupati	+91-9876543214	tirupati@leafyhealth.com	వేణుగోపాల్	+91-9876543221	\N	\N	t	2025-07-14 15:12:53.036997	2025-07-14 15:12:53.036997	India	\N	\N	\N	\N
\.


--
-- Data for Name: brands; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.brands (id, name, name_telugu, description, logo_url, website, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: campaign_recipients; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.campaign_recipients (id, campaign_id, customer_id, sent_at, opened_at, clicked_at, status, created_at) FROM stdin;
\.


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.cart_items (id, cart_id, product_id, quantity, price, total_price, created_at, updated_at, user_id, unit_price, branch_id) FROM stdin;
3	1	2	5	50.00	250.00	2025-07-15 04:33:03.77918	2025-07-15 04:33:03.77918	\N	50.00	\N
\.


--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.carts (id, customer_id, branch_id, session_id, total_amount, created_at, updated_at, user_id, status) FROM stdin;
1	1	\N	\N	0.00	2025-07-15 04:30:00.083331	2025-07-15 04:30:00.083331	\N	active
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.categories (id, name, name_telugu, description, parent_id, slug, image_url, sort_order, is_active, created_at, updated_at) FROM stdin;
1	Fruits	\N	Fresh organic fruits	\N	\N	\N	0	t	2025-07-15 04:31:03.576413	2025-07-15 04:31:03.576413
2	Vegetables	\N	Fresh organic vegetables	\N	\N	/images/categories/vegetables.jpg	0	t	2025-07-15 07:24:59.907338	2025-07-15 07:24:59.907338
3	Grains & Cereals	\N	Organic grains and cereals	\N	\N	/images/categories/grains.jpg	0	t	2025-07-15 07:24:59.907338	2025-07-15 07:24:59.907338
4	Pulses & Lentils	\N	Organic pulses and lentils	\N	\N	/images/categories/pulses.jpg	0	t	2025-07-15 07:24:59.907338	2025-07-15 07:24:59.907338
5	Spices & Condiments	\N	Organic spices and condiments	\N	\N	/images/categories/spices.jpg	0	t	2025-07-15 07:24:59.907338	2025-07-15 07:24:59.907338
6	Dairy & Milk Products	\N	Organic dairy products	\N	\N	/images/categories/dairy.jpg	0	t	2025-07-15 07:24:59.907338	2025-07-15 07:24:59.907338
7	Oils & Ghee	\N	Organic oils and ghee	\N	\N	/images/categories/oils.jpg	0	t	2025-07-15 07:24:59.907338	2025-07-15 07:24:59.907338
8	Dry Fruits & Nuts	\N	Organic dry fruits and nuts	\N	\N	/images/categories/dryfruits.jpg	0	t	2025-07-15 07:24:59.907338	2025-07-15 07:24:59.907338
\.


--
-- Data for Name: cities; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.cities (id, state_id, name, pincode, is_active) FROM stdin;
\.


--
-- Data for Name: cms_banners; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.cms_banners (id, title, image_url, link_url, "position", is_active, start_date, end_date, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: cms_pages; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.cms_pages (id, title, slug, content, meta_title, meta_description, is_published, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: communication_logs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.communication_logs (id, template_id, recipient_email, recipient_phone, status, sent_at, error_message, created_at) FROM stdin;
\.


--
-- Data for Name: communication_templates; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.communication_templates (id, name, type, subject, template_content, variables, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.companies (id, name, name_telugu, description, address, phone, email, website, logo_url, is_active, created_at, updated_at, slug) FROM stdin;
1	LeafyHealth Hyderabad	లీఫీ హెల్త్ హైదరాబాద్	\N	Banjara Hills, Road No 12, Hyderabad	+91-9876543210	hyderabad@leafyhealth.com	https://leafyhealth.com/hyderabad	\N	t	2025-07-14 15:12:41.788622	2025-07-14 15:12:41.788622	leafyhealth-hyderabad
2	LeafyHealth Vijayawada	లీఫీ హెల్త్ విజయవాడ	\N	MG Road, Vijayawada	+91-9876543211	vijayawada@leafyhealth.com	https://leafyhealth.com/vijayawada	\N	t	2025-07-14 15:12:41.788622	2025-07-14 15:12:41.788622	leafyhealth-vijayawada
3	LeafyHealth Visakhapatnam	లీఫీ హెల్త్ విశాఖపట్నం	\N	Beach Road, Visakhapatnam	+91-9876543212	visakhapatnam@leafyhealth.com	https://leafyhealth.com/visakhapatnam	\N	t	2025-07-14 15:12:41.788622	2025-07-14 15:12:41.788622	leafyhealth-visakhapatnam
4	LeafyHealth Warangal	లీఫీ హెల్త్ వరంగల్	\N	Hanamkonda, Warangal	+91-9876543213	warangal@leafyhealth.com	https://leafyhealth.com/warangal	\N	t	2025-07-14 15:12:41.788622	2025-07-14 15:12:41.788622	leafyhealth-warangal
5	LeafyHealth Tirupati	లీఫీ హెల్త్ తిరుపతి	\N	Tirumala Road, Tirupati	+91-9876543214	tirupati@leafyhealth.com	https://leafyhealth.com/tirupati	\N	t	2025-07-14 15:12:41.788622	2025-07-14 15:12:41.788622	leafyhealth-tirupati
\.


--
-- Data for Name: content_versions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.content_versions (id, content_id, content_type, version_number, content_data, created_by, created_at) FROM stdin;
\.


--
-- Data for Name: countries; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.countries (id, name, code, is_active) FROM stdin;
\.


--
-- Data for Name: currencies; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.currencies (id, code, name, symbol, is_active) FROM stdin;
\.


--
-- Data for Name: custom_template_dimensions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.custom_template_dimensions (id, name, description, paper_size, paper_width, paper_height, label_width, label_height, horizontal_count, vertical_count, margin_top, margin_bottom, margin_left, margin_right, horizontal_gap, vertical_gap, corner_radius, is_active, created_at, updated_at, created_by, company_id, branch_id) FROM stdin;
1	Premium Price Tag Template	Elegant price tag with organic styling	A4	210.00	297.00	50.00	30.00	4	10	10.00	10.00	10.00	10.00	5.00	3.00	2.00	f	2025-07-14 18:08:39.241684	2025-07-14 18:20:39.381373	1	1	1
5	Test Template Creation Fixed	Template created after SQL fix	A4	210.00	297.00	100.00	50.00	1	1	10.00	10.00	10.00	10.00	5.00	5.00	0.00	t	2025-07-14 18:28:22.024244	2025-07-14 18:28:22.024244	1	1	1
6	Gateway Template Creation Fixed	Template created via gateway after SQL fix	A4	210.00	297.00	120.00	60.00	1	1	10.00	10.00	10.00	10.00	5.00	5.00	0.00	t	2025-07-14 18:28:23.238058	2025-07-14 18:28:23.238058	1	1	1
2	Updated Template Name - Fixed	This template has been updated successfully via SQL	A4	210.00	297.00	150.00	75.00	2	2	10.00	10.00	10.00	10.00	5.00	5.00	0.00	t	2025-07-14 18:08:39.241684	2025-07-14 18:28:25.988585	1	1	1
3	Gateway Updated Template - Fixed	Updated successfully via gateway with SQL fix	A4	210.00	297.00	180.00	90.00	2	5	10.00	10.00	10.00	10.00	5.00	5.00	3.00	t	2025-07-14 18:08:39.241684	2025-07-14 18:28:27.205912	1	1	1
4	Holiday Sale Banner	Seasonal promotional template	A4	210.00	297.00	180.00	120.00	1	2	10.00	10.00	10.00	10.00	0.00	10.00	5.00	f	2025-07-14 18:08:39.241684	2025-07-14 18:28:58.801334	1	1	1
7	Final Test Template	End-to-end template management test	A4	210.00	297.00	100.00	50.00	1	1	10.00	10.00	10.00	10.00	5.00	5.00	0.00	t	2025-07-14 18:30:42.971274	2025-07-14 18:30:42.971274	1	1	1
8	test	sdfgs	A4	210.00	297.00	63.00	71.00	3	4	1.00	1.00	1.00	1.00	1.00	1.00	0.00	f	2025-07-15 03:35:57.824062	2025-07-15 03:36:49.409534	1	1	1
\.


--
-- Data for Name: custom_templates; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.custom_templates (id, name, description, type, media_id, template_json, is_active, usage_count, created_at, updated_at, created_by, company_id, branch_id, category, template_data) FROM stdin;
1	Test Template	Test template creation	custom	\N	{}	t	0	2025-07-14 17:24:58.312165	2025-07-14 17:24:58.312165	\N	\N	\N	test	{"paperSize": "A4", "labelWidth": 63.5, "labelHeight": 72, "verticalCount": 4, "horizontalCount": 3}
\.


--
-- Data for Name: customer_addresses; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.customer_addresses (id, customer_id, type, address_line1, address_line2, city, state, pincode, landmark, is_default, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: customer_subscriptions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.customer_subscriptions (id, customer_id, plan_id, start_date, end_date, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.customers (id, customer_code, first_name, last_name, email, phone, alternate_phone, date_of_birth, gender, branch_id, is_active, created_at, updated_at, user_id) FROM stdin;
1	\N	Test	User	test@example.com	9876543210	\N	\N	\N	1	t	2025-07-15 04:29:30.704806	2025-07-15 04:29:30.704806	customer-1751700072363
\.


--
-- Data for Name: deliveries; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.deliveries (id, order_id, delivery_person_id, delivery_address, scheduled_date, scheduled_time, actual_delivery_time, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: delivery_assignments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.delivery_assignments (id, delivery_person_id, order_id, assigned_at, status, estimated_delivery_time, actual_delivery_time, delivery_notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: delivery_personnel; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.delivery_personnel (id, name, phone, email, branch_id, vehicle_type, vehicle_number, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: delivery_zones; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.delivery_zones (id, branch_id, name, pincodes, delivery_charge, min_order_amount, delivery_time_slots, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: employee_attendance; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.employee_attendance (id, employee_id, date, check_in_time, check_out_time, total_hours, status, notes, created_at) FROM stdin;
\.


--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.employees (id, employee_id, user_id, first_name, last_name, email, phone, department, designation, branch_id, manager_id, date_of_joining, salary, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: expense_categories; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.expense_categories (id, name, description, is_active) FROM stdin;
\.


--
-- Data for Name: expenses; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.expenses (id, category_id, branch_id, amount, description, receipt_url, expense_date, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: feature_flags; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.feature_flags (id, name, description, is_enabled, rollout_percentage, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: gift_card_transactions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.gift_card_transactions (id, gift_card_id, transaction_type, amount, reference_id, reference_type, created_at) FROM stdin;
\.


--
-- Data for Name: gift_cards; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.gift_cards (id, card_number, amount, balance, customer_id, purchased_by, expires_at, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: health_check; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.health_check (id, service, status, last_check, message) FROM stdin;
\.


--
-- Data for Name: health_checks; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.health_checks (id, service_name, status, response_time, message, checked_at) FROM stdin;
\.


--
-- Data for Name: image_management_images; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.image_management_images (id, filename, original_name, mime_type, size, width, height, path, entity_type, entity_id, category, description, tags, is_public, variants, uploaded_at, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: images; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.images (id, filename, original_name, file_path, file_size, mime_type, width, height, alt_text, description, category, entity_type, entity_id, branch_id, created_at, updated_at, processed_data) FROM stdin;
1	test-image-1.jpg	organic-vegetables.jpg	/uploads/images/test-image-1.jpg	245760	image/jpeg	\N	\N	Fresh organic vegetables	High quality organic vegetables from local farm	products	product	\N	1	2025-07-15 16:57:13.982421	2025-07-15 16:57:13.982421	\N
2	test-image-2.png	healthy-fruits.png	/uploads/images/test-image-2.png	189440	image/png	\N	\N	Healthy fruits collection	Fresh seasonal fruits display	categories	category	\N	1	2025-07-15 16:57:13.982421	2025-07-15 16:57:13.982421	\N
3	test-image-3.jpg	leafy-greens.jpg	/uploads/images/test-image-3.jpg	298560	image/jpeg	\N	\N	Fresh leafy greens	Nutritious leafy green vegetables	products	product	\N	2	2025-07-15 16:57:13.982421	2025-07-15 16:57:13.982421	\N
\.


--
-- Data for Name: inventory; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.inventory (id, product_id, branch_id, current_stock, reserved_stock, min_stock_level, max_stock_level, last_restocked_at, expiry_date, batch_number, supplier_id, cost_price, created_at, updated_at, reorder_point, minimum_stock, maximum_stock) FROM stdin;
2	3	1	75	0	10	100	\N	\N	\N	\N	\N	2025-07-15 11:20:40.191911	2025-07-15 11:20:40.191911	15	10	100
3	4	1	20	0	10	100	\N	\N	\N	\N	\N	2025-07-15 11:20:40.191911	2025-07-15 11:20:40.191911	15	10	100
4	5	1	5	0	10	100	\N	\N	\N	\N	\N	2025-07-15 11:20:40.191911	2025-07-15 11:20:40.191911	15	10	100
6	7	1	75	0	10	100	\N	\N	\N	\N	\N	2025-07-15 11:20:40.191911	2025-07-15 11:20:40.191911	15	10	100
7	8	1	20	0	10	100	\N	\N	\N	\N	\N	2025-07-15 11:20:40.191911	2025-07-15 11:20:40.191911	15	10	100
8	9	1	5	0	10	100	\N	\N	\N	\N	\N	2025-07-15 11:20:40.191911	2025-07-15 11:20:40.191911	15	10	100
10	11	1	75	0	10	100	\N	\N	\N	\N	\N	2025-07-15 11:20:40.191911	2025-07-15 11:20:40.191911	15	10	100
11	12	1	20	0	10	100	\N	\N	\N	\N	\N	2025-07-15 11:20:40.191911	2025-07-15 11:20:40.191911	15	10	100
12	13	1	5	0	10	100	\N	\N	\N	\N	\N	2025-07-15 11:20:40.191911	2025-07-15 11:20:40.191911	15	10	100
14	15	1	75	0	10	100	\N	\N	\N	\N	\N	2025-07-15 11:20:40.191911	2025-07-15 11:20:40.191911	15	10	100
15	16	1	20	0	10	100	\N	\N	\N	\N	\N	2025-07-15 11:20:40.191911	2025-07-15 11:20:40.191911	15	10	100
16	17	1	5	0	10	100	\N	\N	\N	\N	\N	2025-07-15 11:20:40.191911	2025-07-15 11:20:40.191911	15	10	100
17	18	1	0	0	10	100	\N	\N	\N	\N	\N	2025-07-15 11:20:40.191911	2025-07-15 11:20:40.191911	15	10	100
18	19	1	75	0	10	100	\N	\N	\N	\N	\N	2025-07-15 11:20:40.191911	2025-07-15 11:20:40.191911	15	10	100
19	20	1	20	0	10	100	\N	\N	\N	\N	\N	2025-07-15 11:20:40.191911	2025-07-15 11:20:40.191911	15	10	100
20	21	1	5	0	10	100	\N	\N	\N	\N	\N	2025-07-15 11:20:40.191911	2025-07-15 11:20:40.191911	15	10	100
22	23	1	75	0	10	100	\N	\N	\N	\N	\N	2025-07-15 11:20:40.191911	2025-07-15 11:20:40.191911	15	10	100
21	22	1	20	0	10	100	\N	\N	\N	\N	\N	2025-07-15 11:20:40.191911	2025-07-15 14:43:15.917251	15	10	100
1	2	1	25	0	10	100	\N	\N	\N	\N	\N	2025-07-15 11:20:40.191911	2025-07-15 14:43:14.022581	15	10	100
13	14	1	30	0	10	100	\N	\N	\N	\N	\N	2025-07-15 11:20:40.191911	2025-07-15 14:43:14.969155	15	10	100
5	6	1	20	0	10	100	\N	\N	\N	\N	\N	2025-07-15 11:20:40.191911	2025-07-15 18:27:07.990832	15	10	100
9	10	1	1	0	10	100	\N	\N	\N	\N	\N	2025-07-15 11:20:40.191911	2025-07-15 18:27:27.191464	15	10	100
\.


--
-- Data for Name: inventory_adjustments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.inventory_adjustments (id, product_id, branch_id, adjustment_type, quantity_before, quantity_after, reason, created_by, created_at) FROM stdin;
\.


--
-- Data for Name: inventory_alerts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.inventory_alerts (id, product_id, branch_id, alert_type, message, is_resolved, created_at) FROM stdin;
\.


--
-- Data for Name: inventory_history; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.inventory_history (id, product_id, branch_id, adjustment_type, quantity, reason, performed_by, created_at) FROM stdin;
1	2	1	set	25	Restock from supplier	1	2025-07-15 14:43:14.09803
2	14	1	set	30	Restock from supplier	1	2025-07-15 14:43:15.030849
3	22	1	set	20	Restock from supplier	1	2025-07-15 14:43:15.978661
4	6	1	\N	20	Manual adjustment	3	2025-07-15 18:27:08.061374
5	10	1	\N	1	Manual adjustment	3	2025-07-15 18:27:27.251007
\.


--
-- Data for Name: inventory_transactions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.inventory_transactions (id, product_id, branch_id, transaction_type, quantity, unit_price, total_amount, reference_id, reference_type, created_at) FROM stdin;
\.


--
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.invoices (id, order_id, invoice_number, amount, tax_amount, total_amount, status, generated_at, created_at) FROM stdin;
\.


--
-- Data for Name: label_designs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.label_designs (id, name, template_id, product_id, design_data, generated_image_url, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: label_media_types; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.label_media_types (id, name, width_mm, height_mm, type, description, is_active, created_at, updated_at, avery_code) FROM stdin;
1	A4 Standard	210.00	297.00	sheet	A4 Standard sheet 210x297mm	t	2025-07-14 16:21:32.000714	2025-07-14 16:21:32.000714	A4
2	Round 25mm	25.00	25.00	roll	Round labels 25mm diameter	t	2025-07-14 16:21:32.000714	2025-07-14 16:21:32.000714	L7780
3	Rectangle 50x25mm	50.00	25.00	roll	Rectangle labels 50x25mm	t	2025-07-14 16:21:32.000714	2025-07-14 16:21:32.000714	L7789
4	Address Labels	99.00	38.00	sheet	Address labels 99x38mm	t	2025-07-14 16:21:32.000714	2025-07-14 16:21:32.000714	L7163
5	Shipping Labels	99.00	67.00	sheet	Shipping labels 99x67mm	t	2025-07-14 16:21:32.000714	2025-07-14 16:21:32.000714	L7165
6	Test Edit Media	80.00	40.00	sheet	Test media for edit functionality	t	2025-07-14 19:17:36.688562	2025-07-14 19:17:36.688562	TEST001
\.


--
-- Data for Name: label_templates; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.label_templates (id, name, description, template_data, media_type_id, category, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: loyalty_points; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.loyalty_points (id, customer_id, points_earned, points_used, current_balance, transaction_type, reference_id, created_at) FROM stdin;
\.


--
-- Data for Name: loyalty_rewards; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.loyalty_rewards (id, name, description, points_required, reward_type, reward_value, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: loyalty_transactions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.loyalty_transactions (id, customer_id, transaction_type, points, reference_id, reference_type, description, created_at) FROM stdin;
\.


--
-- Data for Name: marketing_campaigns; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.marketing_campaigns (id, name, description, type, start_date, end_date, budget, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: notification_settings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.notification_settings (id, user_id, notification_type, is_enabled, delivery_method, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.notifications (id, user_id, title, message, type, is_read, created_at) FROM stdin;
\.


--
-- Data for Name: nutrition_templates; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.nutrition_templates (id, name, fields, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.order_items (id, order_id, product_id, quantity, unit_price, total_price, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.orders (id, order_number, customer_id, branch_id, total_amount, tax_amount, discount_amount, final_amount, status, payment_status, delivery_address_id, delivery_date, delivery_time_slot, special_instructions, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.payments (id, order_id, payment_method, amount, currency, status, transaction_id, gateway_response, processed_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: performance_metrics; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.performance_metrics (id, metric_name, metric_value, unit, "timestamp", metadata) FROM stdin;
\.


--
-- Data for Name: product_answers; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.product_answers (id, question_id, answer, answered_by, created_at) FROM stdin;
\.


--
-- Data for Name: product_attribute_values; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.product_attribute_values (id, product_id, attribute_id, value, created_at) FROM stdin;
\.


--
-- Data for Name: product_attributes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.product_attributes (id, name, data_type, is_required, is_filterable, sort_order, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: product_collection_items; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.product_collection_items (id, collection_id, product_id, sort_order, created_at) FROM stdin;
\.


--
-- Data for Name: product_collections; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.product_collections (id, name, description, slug, image_url, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: product_labels; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.product_labels (id, product_id, label_design_id, barcode, qr_code, print_count, created_at) FROM stdin;
\.


--
-- Data for Name: product_questions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.product_questions (id, product_id, customer_id, question, is_answered, created_at) FROM stdin;
\.


--
-- Data for Name: product_reviews; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.product_reviews (id, product_id, customer_id, rating, review_text, is_verified, is_approved, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: product_tax_mappings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.product_tax_mappings (id, product_id, tax_rate_id, created_at) FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.products (id, name, name_telugu, description, category_id, brand_id, supplier_id, sku, barcode, qr_code, price, mrp, cost_price, weight, weight_unit, stock_quantity, min_stock_level, max_stock_level, is_organic, is_active, tax_rate, nutrition_facts, images, tags, created_at, updated_at, selling_price, status) FROM stdin;
2	Organic Banana	అరటి పండు	Fresh organic bananas from local farms	1	\N	\N	BAN001	\N	\N	45.00	\N	\N	\N	\N	100	0	0	t	t	0.00	\N	\N	\N	2025-07-15 04:31:05.782232	2025-07-15 04:31:05.782232	50.00	active
3	Organic Mango	సేంద్రీయ మామిడి	Fresh organic Alphonso mangoes from Andhra Pradesh	1	\N	\N	ORG-FR-001	\N	\N	250.00	300.00	200.00	1.00	kg	50	10	100	t	t	0.00	\N	["mango1.jpg"]	["organic", "seasonal", "local"]	2025-07-15 07:26:09.424008	2025-07-15 07:26:09.424008	\N	active
4	Organic Papaya	సేంద్రీయ బొప్పాయి	Sweet organic papaya from local farms	1	\N	\N	ORG-FR-002	\N	\N	80.00	100.00	60.00	1.00	kg	25	5	50	t	t	0.00	\N	["papaya1.jpg"]	["organic", "healthy"]	2025-07-15 07:26:09.424008	2025-07-15 07:26:09.424008	\N	active
5	Organic Pomegranate	సేంద్రీయ దానిమ్మ	Juicy organic pomegranates	1	\N	\N	ORG-FR-003	\N	\N	180.00	220.00	140.00	1.00	kg	20	8	40	t	t	0.00	\N	["pomegranate1.jpg"]	["organic", "antioxidant"]	2025-07-15 07:26:09.424008	2025-07-15 07:26:09.424008	\N	active
6	Organic Tomatoes	సేంద్రీయ టొమాటోలు	Fresh organic tomatoes from Telugu farms	2	\N	\N	ORG-VG-001	\N	\N	60.00	80.00	45.00	1.00	kg	80	20	100	t	t	0.00	\N	["tomatoes1.jpg"]	["organic", "fresh"]	2025-07-15 07:26:09.424008	2025-07-15 07:26:09.424008	\N	active
7	Organic Onions	సేంద్రీయ ఉల్లిపాయలు	Premium organic onions	2	\N	\N	ORG-VG-002	\N	\N	40.00	60.00	30.00	1.00	kg	120	30	150	t	t	0.00	\N	["onions1.jpg"]	["organic", "staple"]	2025-07-15 07:26:09.424008	2025-07-15 07:26:09.424008	\N	active
8	Organic Brinjal	సేంద్రీయ వంకాయ	Fresh organic brinjal (eggplant)	2	\N	\N	ORG-VG-003	\N	\N	70.00	90.00	55.00	1.00	kg	45	15	80	t	t	0.00	\N	["brinjal1.jpg"]	["organic", "local"]	2025-07-15 07:26:09.424008	2025-07-15 07:26:09.424008	\N	active
9	Organic Okra	సేంద్రీయ బెండకాయ	Fresh organic okra (ladies finger)	2	\N	\N	ORG-VG-004	\N	\N	90.00	120.00	70.00	1.00	kg	30	10	60	t	t	0.00	\N	["okra1.jpg"]	["organic", "vitamin-rich"]	2025-07-15 07:26:09.424008	2025-07-15 07:26:09.424008	\N	active
10	Organic Rice	సేంద్రీయ బియ్యం	Premium organic Basmati rice	3	\N	\N	ORG-GR-001	\N	\N	150.00	180.00	120.00	1.00	kg	150	50	200	t	t	0.00	\N	["rice1.jpg"]	["organic", "grain", "basmati"]	2025-07-15 07:26:09.424008	2025-07-15 07:26:09.424008	\N	active
11	Organic Wheat	సేంద్రీయ గోధుమ	Whole organic wheat flour	3	\N	\N	ORG-GR-002	\N	\N	80.00	100.00	65.00	1.00	kg	120	40	180	t	t	0.00	\N	["wheat1.jpg"]	["organic", "flour"]	2025-07-15 07:26:09.424008	2025-07-15 07:26:09.424008	\N	active
12	Organic Jowar	సేంద్రీయ జొన్న	Nutritious organic jowar (sorghum)	3	\N	\N	ORG-GR-003	\N	\N	120.00	150.00	95.00	1.00	kg	60	25	100	t	t	0.00	\N	["jowar1.jpg"]	["organic", "millet", "healthy"]	2025-07-15 07:26:09.424008	2025-07-15 07:26:09.424008	\N	active
13	Organic Toor Dal	సేంద్రీయ కందుల పప్పు	Premium organic toor dal	4	\N	\N	ORG-PL-001	\N	\N	140.00	170.00	110.00	1.00	kg	80	20	120	t	t	0.00	\N	["toor-dal1.jpg"]	["organic", "pulse", "protein"]	2025-07-15 07:26:37.671349	2025-07-15 07:26:37.671349	\N	active
14	Organic Chana Dal	సేంద్రీయ శనగ పప్పు	Fresh organic chana dal	4	\N	\N	ORG-PL-002	\N	\N	130.00	160.00	105.00	1.00	kg	70	18	100	t	t	0.00	\N	["chana-dal1.jpg"]	["organic", "pulse"]	2025-07-15 07:26:37.671349	2025-07-15 07:26:37.671349	\N	active
15	Organic Moong Dal	సేంద్రీయ పెసలు పప్పు	Organic green moong dal	4	\N	\N	ORG-PL-003	\N	\N	160.00	190.00	130.00	1.00	kg	55	15	90	t	t	0.00	\N	["moong-dal1.jpg"]	["organic", "pulse", "easy-digest"]	2025-07-15 07:26:37.671349	2025-07-15 07:26:37.671349	\N	active
16	Organic Masoor Dal	సేంద్రీయ మసూర్ పప్పు	Red organic masoor dal	4	\N	\N	ORG-PL-004	\N	\N	150.00	180.00	120.00	1.00	kg	65	16	95	t	t	0.00	\N	["masoor-dal1.jpg"]	["organic", "pulse", "iron-rich"]	2025-07-15 07:26:37.671349	2025-07-15 07:26:37.671349	\N	active
17	Organic Turmeric	సేంద్రీయ పసుపు	Pure organic turmeric powder	5	\N	\N	ORG-SP-001	\N	\N	80.00	100.00	60.00	250.00	grams	100	20	150	t	t	0.00	\N	["turmeric1.jpg"]	["organic", "spice", "medicinal"]	2025-07-15 07:26:37.671349	2025-07-15 07:26:37.671349	\N	active
18	Organic Red Chili	సేంద్రీయ ఎండు మిర్చి	Organic red chili powder	5	\N	\N	ORG-SP-002	\N	\N	120.00	150.00	95.00	250.00	grams	85	15	120	t	t	0.00	\N	["chili1.jpg"]	["organic", "spice", "hot"]	2025-07-15 07:26:37.671349	2025-07-15 07:26:37.671349	\N	active
19	Organic Coriander	సేంద్రీయ కొత్తిమీర	Fresh organic coriander seeds	5	\N	\N	ORG-SP-003	\N	\N	60.00	80.00	45.00	250.00	grams	90	18	130	t	t	0.00	\N	["coriander1.jpg"]	["organic", "spice", "aromatic"]	2025-07-15 07:26:37.671349	2025-07-15 07:26:37.671349	\N	active
20	Organic Cumin	సేంద్రీయ జీలకర్ర	Organic cumin seeds	5	\N	\N	ORG-SP-004	\N	\N	200.00	250.00	160.00	250.00	grams	45	12	80	t	t	0.00	\N	["cumin1.jpg"]	["organic", "spice", "digestive"]	2025-07-15 07:26:37.671349	2025-07-15 07:26:37.671349	\N	active
21	Organic Coconut Oil	సేంద్రీయ కొబ్బరి నూనే	Cold-pressed organic coconut oil	7	\N	\N	ORG-OIL-001	\N	\N	350.00	400.00	280.00	500.00	ml	60	15	100	t	t	0.00	\N	["coconut-oil1.jpg"]	["organic", "cold-pressed", "healthy"]	2025-07-15 07:26:37.671349	2025-07-15 07:26:37.671349	\N	active
22	Organic Groundnut Oil	సేంద్రీయ వేరుశనగ నూనే	Pure organic groundnut oil	7	\N	\N	ORG-OIL-002	\N	\N	280.00	320.00	225.00	500.00	ml	75	20	120	t	t	0.00	\N	["groundnut-oil1.jpg"]	["organic", "cooking", "traditional"]	2025-07-15 07:26:37.671349	2025-07-15 07:26:37.671349	\N	active
23	Organic Sesame Oil	సేంద్రీయ నువ్వుల నూనే	Cold-pressed organic sesame oil	7	\N	\N	ORG-OIL-003	\N	\N	420.00	480.00	340.00	500.00	ml	40	10	70	t	t	0.00	\N	["sesame-oil1.jpg"]	["organic", "cold-pressed", "medicinal"]	2025-07-15 07:26:37.671349	2025-07-15 07:26:37.671349	\N	active
\.


--
-- Data for Name: promotion_usage; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.promotion_usage (id, promotion_id, customer_id, order_id, discount_amount, used_at) FROM stdin;
\.


--
-- Data for Name: promotions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.promotions (id, name, description, type, discount_type, discount_value, min_order_amount, max_discount_amount, start_date, end_date, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: purchase_order_items; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.purchase_order_items (id, po_id, product_id, quantity, unit_price, total_price, created_at) FROM stdin;
\.


--
-- Data for Name: purchase_orders; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.purchase_orders (id, po_number, supplier_id, branch_id, total_amount, status, order_date, expected_delivery_date, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: queue_jobs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.queue_jobs (id, queue_name, payload, status, attempts, max_attempts, available_at, created_at) FROM stdin;
\.


--
-- Data for Name: rate_limits; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.rate_limits (id, key, requests, reset_at, created_at) FROM stdin;
\.


--
-- Data for Name: reports; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.reports (id, name, type, parameters, generated_by, file_path, created_at) FROM stdin;
\.


--
-- Data for Name: restore_jobs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.restore_jobs (id, file_path, status, started_at, completed_at, error_message, created_by, created_at) FROM stdin;
\.


--
-- Data for Name: return_items; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.return_items (id, return_id, order_item_id, quantity, reason, condition, refund_amount, created_at) FROM stdin;
\.


--
-- Data for Name: returns; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.returns (id, order_id, customer_id, return_number, reason, status, refund_amount, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.roles (id, name, description, permissions, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sales_reports; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.sales_reports (id, branch_id, report_date, total_sales, total_orders, avg_order_value, created_at) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.schema_migrations (id, version, name, executed_at, execution_time_ms, checksum, success, error_message) FROM stdin;
\.


--
-- Data for Name: search_queries; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.search_queries (id, query_text, results_count, user_id, session_id, searched_at) FROM stdin;
\.


--
-- Data for Name: seo_meta; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.seo_meta (id, page_type, page_id, meta_title, meta_description, meta_keywords, og_title, og_description, og_image, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.sessions (id, session_id, user_id, ip_address, user_agent, data, expires_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: shipping_methods; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.shipping_methods (id, name, cost, delivery_time, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: social_media_posts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.social_media_posts (id, platform, content, image_url, scheduled_at, posted_at, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: states; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.states (id, country_id, name, code, is_active) FROM stdin;
\.


--
-- Data for Name: stock_alerts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.stock_alerts (id, product_id, branch_id, alert_type, current_stock, threshold_level, message, is_active, created_at) FROM stdin;
\.


--
-- Data for Name: stock_movements; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.stock_movements (id, product_id, branch_id, movement_type, quantity, reference_id, reference_type, notes, created_by, created_at) FROM stdin;
\.


--
-- Data for Name: subscription_plans; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.subscription_plans (id, name, description, price, duration_days, features, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: suppliers; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.suppliers (id, name, name_telugu, contact_person, email, phone, address, city, state, pincode, gstin, organic_certified, certification_number, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: support_ticket_messages; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.support_ticket_messages (id, ticket_id, sender_id, message, attachment_url, created_at) FROM stdin;
\.


--
-- Data for Name: support_tickets; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.support_tickets (id, ticket_number, customer_id, subject, description, priority, status, assigned_to, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: system_logs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.system_logs (id, level, message, context, created_at) FROM stdin;
\.


--
-- Data for Name: system_settings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.system_settings (id, key, value, description, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: tax_rates; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.tax_rates (id, name, rate, is_active, created_at) FROM stdin;
\.


--
-- Data for Name: traditional_categories; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.traditional_categories (id, name, name_telugu, description, is_active, created_at, updated_at) FROM stdin;
1	Rice & Grains	బియ్యం & ధాన్యాలు	Traditional rice and grain products	t	2025-07-15 05:15:05.379524	2025-07-15 05:15:05.379524
2	Pulses	పప్పులు	Traditional pulses and lentils	t	2025-07-15 05:15:05.379524	2025-07-15 05:15:05.379524
3	Spices	మసాలాలు	Traditional spices and seasonings	t	2025-07-15 05:15:05.379524	2025-07-15 05:15:05.379524
\.


--
-- Data for Name: traditional_items; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.traditional_items (id, name_english, name_telugu, category, unit, ordinary_price, medium_price, best_price, is_active, region, created_at, updated_at) FROM stdin;
1	Organic Rice	సేంద్రీయ బియ్యం	Grains	kg	85.00	95.00	110.00	t	AP_TG	2025-07-14 15:13:19.562499	2025-07-14 15:13:19.562499
2	Traditional Jaggery	సంప్రదాయ బెల్లం	Sweeteners	kg	120.00	140.00	160.00	t	AP_TG	2025-07-14 15:13:19.562499	2025-07-14 15:13:19.562499
3	Village Ghee	గ్రామ నెయ్యి	Dairy	liter	450.00	500.00	550.00	t	AP_TG	2025-07-14 15:13:19.562499	2025-07-14 15:13:19.562499
4	Millets Mix	కొర్రలు మిశ్రమం	Grains	kg	95.00	110.00	125.00	t	AP_TG	2025-07-14 15:13:19.562499	2025-07-14 15:13:19.562499
5	Turmeric Powder	పసుపు పొడి	Spices	kg	180.00	200.00	220.00	t	AP_TG	2025-07-14 15:13:19.562499	2025-07-14 15:13:19.562499
6	Coconut Oil	కొబ్బరి నూనె	Oils	liter	200.00	220.00	250.00	t	AP_TG	2025-07-14 15:13:19.562499	2025-07-14 15:13:19.562499
7	Black Sesame Seeds	నల్ల నువ్వులు	Seeds	kg	150.00	170.00	190.00	t	AP_TG	2025-07-14 15:13:19.562499	2025-07-14 15:13:19.562499
8	Organic Honey	సేంద్రియ తేనె	Sweeteners	kg	320.00	360.00	400.00	t	AP_TG	2025-07-14 15:13:19.562499	2025-07-14 15:13:19.562499
9	Red Chili Powder	ఎర్ర మిర్చి పొడి	Spices	kg	160.00	180.00	200.00	t	AP_TG	2025-07-14 15:13:19.562499	2025-07-14 15:13:19.562499
10	Tamarind	చింతపండు	Condiments	kg	80.00	90.00	100.00	t	AP_TG	2025-07-14 15:13:19.562499	2025-07-14 15:13:19.562499
11	Finger Millet	రాగి	Grains	kg	110.00	125.00	140.00	t	AP_TG	2025-07-14 15:13:19.562499	2025-07-14 15:13:19.562499
12	Foxtail Millet	కొర్రలు	Grains	kg	120.00	135.00	150.00	t	AP_TG	2025-07-14 15:13:19.562499	2025-07-14 15:13:19.562499
13	Pearl Millet	సజ్జలు	Grains	kg	100.00	115.00	130.00	t	AP_TG	2025-07-14 15:13:19.562499	2025-07-14 15:13:19.562499
\.


--
-- Data for Name: traditional_order_items; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.traditional_order_items (id, order_id, traditional_item_id, quantity, quality_grade, unit_price, total_price, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: traditional_orders; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.traditional_orders (id, order_number, customer_id, branch_id, total_amount, status, payment_status, delivery_address, delivery_date, special_instructions, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: translations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.translations (id, key, language, value, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.user_roles (id, user_id, role_id, assigned_by, assigned_at, is_active) FROM stdin;
\.


--
-- Data for Name: user_sessions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.user_sessions (id, user_id, session_token, ip_address, user_agent, expires_at, is_active, created_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, username, email, password_hash, first_name, last_name, phone, role, branch_id, profile_image, is_active, last_login, email_verified, phone_verified, created_at, updated_at) FROM stdin;
4	branch.manager.hyd	hyd.manager@leafyhealth.com	$2b$10$EhGmCIu8jYNJqhKdNVvkuuF3YQjPJmKrMCtjGmKcmxb8qLTQqJPPK	రమేష్	కుమార్	+91-9876543215	branch_manager	1	\N	t	\N	f	f	2025-07-14 15:13:05.645922	2025-07-14 15:13:05.645922
5	branch.manager.vjw	vjw.manager@leafyhealth.com	$2b$10$EhGmCIu8jYNJqhKdNVvkuuF3YQjPJmKrMCtjGmKcmxb8qLTQqJPPK	సురేష్	రెడ్డి	+91-9876543218	branch_manager	3	\N	t	\N	f	f	2025-07-14 15:13:05.645922	2025-07-14 15:13:05.645922
6	staff.hyd.001	staff.hyd.001@leafyhealth.com	$2b$10$EhGmCIu8jYNJqhKdNVvkuuF3YQjPJmKrMCtjGmKcmxb8qLTQqJPPK	Staff	Member	+91-9876543230	staff	1	\N	t	\N	f	f	2025-07-14 15:13:05.645922	2025-07-14 15:13:05.645922
7	delivery.hyd.001	delivery.hyd.001@leafyhealth.com	$2b$10$EhGmCIu8jYNJqhKdNVvkuuF3YQjPJmKrMCtjGmKcmxb8qLTQqJPPK	Delivery	Person	+91-9876543240	delivery	1	\N	t	\N	f	f	2025-07-14 15:13:05.645922	2025-07-14 15:13:05.645922
3	ops.admin	ops.admin@leafyhealth.com	securepassword123	Operations	Admin	+91-9999999997	admin	1	\N	t	\N	f	f	2025-07-14 15:13:05.645922	2025-07-14 15:13:05.645922
1	global.admin	global.admin@leafyhealth.com	securepassword123	Global	Admin	+91-9999999999	super_admin	1	\N	t	\N	f	f	2025-07-14 15:13:05.645922	2025-07-14 15:13:05.645922
2	admin	admin@leafyhealth.com	securepassword123	Admin	User	+91-9999999998	admin	1	\N	t	\N	f	f	2025-07-14 15:13:05.645922	2025-07-14 15:13:05.645922
\.


--
-- Data for Name: vendors; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.vendors (id, name, contact_person, email, phone, address, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: webhook_deliveries; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.webhook_deliveries (id, webhook_id, event_type, payload, response_status, response_body, delivered_at, created_at) FROM stdin;
\.


--
-- Data for Name: webhooks; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.webhooks (id, name, url, events, secret, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: wishlist_items; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.wishlist_items (id, wishlist_id, product_id, added_at) FROM stdin;
\.


--
-- Data for Name: wishlists; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.wishlists (id, customer_id, name, created_at) FROM stdin;
\.


--
-- Name: ab_test_assignments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.ab_test_assignments_id_seq', 1, false);


--
-- Name: ab_tests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.ab_tests_id_seq', 1, false);


--
-- Name: activity_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.activity_logs_id_seq', 1, false);


--
-- Name: analytics_events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.analytics_events_id_seq', 1, false);


--
-- Name: api_keys_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.api_keys_id_seq', 1, false);


--
-- Name: api_request_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.api_request_logs_id_seq', 1, false);


--
-- Name: audit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.audit_logs_id_seq', 1, false);


--
-- Name: backup_jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.backup_jobs_id_seq', 1, false);


--
-- Name: backup_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.backup_logs_id_seq', 1, false);


--
-- Name: backup_schedules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.backup_schedules_id_seq', 1, false);


--
-- Name: branch_traditional_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.branch_traditional_items_id_seq', 1, false);


--
-- Name: branches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.branches_id_seq', 6, true);


--
-- Name: brands_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.brands_id_seq', 1, false);


--
-- Name: campaign_recipients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.campaign_recipients_id_seq', 1, false);


--
-- Name: cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.cart_items_id_seq', 3, true);


--
-- Name: carts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.carts_id_seq', 1, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.categories_id_seq', 8, true);


--
-- Name: cities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.cities_id_seq', 1, false);


--
-- Name: cms_banners_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.cms_banners_id_seq', 1, false);


--
-- Name: cms_pages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.cms_pages_id_seq', 1, false);


--
-- Name: communication_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.communication_logs_id_seq', 1, false);


--
-- Name: communication_templates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.communication_templates_id_seq', 1, false);


--
-- Name: companies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.companies_id_seq', 5, true);


--
-- Name: content_versions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.content_versions_id_seq', 1, false);


--
-- Name: countries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.countries_id_seq', 1, false);


--
-- Name: currencies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.currencies_id_seq', 1, false);


--
-- Name: custom_template_dimensions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.custom_template_dimensions_id_seq', 8, true);


--
-- Name: custom_templates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.custom_templates_id_seq', 1, true);


--
-- Name: customer_addresses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.customer_addresses_id_seq', 1, false);


--
-- Name: customer_subscriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.customer_subscriptions_id_seq', 1, false);


--
-- Name: customers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.customers_id_seq', 1, true);


--
-- Name: deliveries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.deliveries_id_seq', 1, false);


--
-- Name: delivery_assignments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.delivery_assignments_id_seq', 1, false);


--
-- Name: delivery_personnel_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.delivery_personnel_id_seq', 1, false);


--
-- Name: delivery_zones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.delivery_zones_id_seq', 1, false);


--
-- Name: employee_attendance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.employee_attendance_id_seq', 1, false);


--
-- Name: employees_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.employees_id_seq', 1, false);


--
-- Name: expense_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.expense_categories_id_seq', 1, false);


--
-- Name: expenses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.expenses_id_seq', 1, false);


--
-- Name: feature_flags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.feature_flags_id_seq', 1, false);


--
-- Name: gift_card_transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.gift_card_transactions_id_seq', 1, false);


--
-- Name: gift_cards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.gift_cards_id_seq', 1, false);


--
-- Name: health_check_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.health_check_id_seq', 1, false);


--
-- Name: health_checks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.health_checks_id_seq', 1, false);


--
-- Name: images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.images_id_seq', 3, true);


--
-- Name: inventory_adjustments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.inventory_adjustments_id_seq', 1, false);


--
-- Name: inventory_alerts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.inventory_alerts_id_seq', 1, false);


--
-- Name: inventory_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.inventory_history_id_seq', 5, true);


--
-- Name: inventory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.inventory_id_seq', 28, true);


--
-- Name: inventory_transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.inventory_transactions_id_seq', 1, false);


--
-- Name: invoices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.invoices_id_seq', 1, false);


--
-- Name: label_designs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.label_designs_id_seq', 1, false);


--
-- Name: label_media_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.label_media_types_id_seq', 6, true);


--
-- Name: label_templates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.label_templates_id_seq', 1, false);


--
-- Name: loyalty_points_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.loyalty_points_id_seq', 1, false);


--
-- Name: loyalty_rewards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.loyalty_rewards_id_seq', 1, false);


--
-- Name: loyalty_transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.loyalty_transactions_id_seq', 1, false);


--
-- Name: marketing_campaigns_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.marketing_campaigns_id_seq', 1, false);


--
-- Name: notification_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.notification_settings_id_seq', 1, false);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);


--
-- Name: nutrition_templates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.nutrition_templates_id_seq', 1, false);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.order_items_id_seq', 1, false);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.orders_id_seq', 1, false);


--
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.payments_id_seq', 1, false);


--
-- Name: performance_metrics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.performance_metrics_id_seq', 1, false);


--
-- Name: product_answers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.product_answers_id_seq', 1, false);


--
-- Name: product_attribute_values_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.product_attribute_values_id_seq', 1, false);


--
-- Name: product_attributes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.product_attributes_id_seq', 1, false);


--
-- Name: product_collection_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.product_collection_items_id_seq', 1, false);


--
-- Name: product_collections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.product_collections_id_seq', 1, false);


--
-- Name: product_labels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.product_labels_id_seq', 1, false);


--
-- Name: product_questions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.product_questions_id_seq', 1, false);


--
-- Name: product_reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.product_reviews_id_seq', 1, false);


--
-- Name: product_tax_mappings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.product_tax_mappings_id_seq', 1, false);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.products_id_seq', 23, true);


--
-- Name: promotion_usage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.promotion_usage_id_seq', 1, false);


--
-- Name: promotions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.promotions_id_seq', 1, false);


--
-- Name: purchase_order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.purchase_order_items_id_seq', 1, false);


--
-- Name: purchase_orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.purchase_orders_id_seq', 1, false);


--
-- Name: queue_jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.queue_jobs_id_seq', 1, false);


--
-- Name: rate_limits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.rate_limits_id_seq', 1, false);


--
-- Name: reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.reports_id_seq', 1, false);


--
-- Name: restore_jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.restore_jobs_id_seq', 1, false);


--
-- Name: return_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.return_items_id_seq', 1, false);


--
-- Name: returns_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.returns_id_seq', 1, false);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.roles_id_seq', 1, false);


--
-- Name: sales_reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.sales_reports_id_seq', 1, false);


--
-- Name: schema_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.schema_migrations_id_seq', 1, false);


--
-- Name: search_queries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.search_queries_id_seq', 1, false);


--
-- Name: seo_meta_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.seo_meta_id_seq', 1, false);


--
-- Name: sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.sessions_id_seq', 1, false);


--
-- Name: shipping_methods_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.shipping_methods_id_seq', 1, false);


--
-- Name: social_media_posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.social_media_posts_id_seq', 1, false);


--
-- Name: states_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.states_id_seq', 1, false);


--
-- Name: stock_alerts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.stock_alerts_id_seq', 1, false);


--
-- Name: stock_movements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.stock_movements_id_seq', 1, false);


--
-- Name: subscription_plans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.subscription_plans_id_seq', 1, false);


--
-- Name: suppliers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.suppliers_id_seq', 1, false);


--
-- Name: support_ticket_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.support_ticket_messages_id_seq', 1, false);


--
-- Name: support_tickets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.support_tickets_id_seq', 1, false);


--
-- Name: system_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.system_logs_id_seq', 1, false);


--
-- Name: system_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.system_settings_id_seq', 1, false);


--
-- Name: tax_rates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.tax_rates_id_seq', 1, false);


--
-- Name: traditional_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.traditional_categories_id_seq', 3, true);


--
-- Name: traditional_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.traditional_items_id_seq', 13, true);


--
-- Name: traditional_order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.traditional_order_items_id_seq', 1, false);


--
-- Name: traditional_orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.traditional_orders_id_seq', 1, false);


--
-- Name: translations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.translations_id_seq', 1, false);


--
-- Name: user_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.user_roles_id_seq', 1, false);


--
-- Name: user_sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.user_sessions_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.users_id_seq', 7, true);


--
-- Name: vendors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.vendors_id_seq', 1, false);


--
-- Name: webhook_deliveries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.webhook_deliveries_id_seq', 1, false);


--
-- Name: webhooks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.webhooks_id_seq', 1, false);


--
-- Name: wishlist_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.wishlist_items_id_seq', 1, false);


--
-- Name: wishlists_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.wishlists_id_seq', 1, false);


--
-- Name: ab_test_assignments ab_test_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ab_test_assignments
    ADD CONSTRAINT ab_test_assignments_pkey PRIMARY KEY (id);


--
-- Name: ab_tests ab_tests_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ab_tests
    ADD CONSTRAINT ab_tests_pkey PRIMARY KEY (id);


--
-- Name: activity_logs activity_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_pkey PRIMARY KEY (id);


--
-- Name: analytics_events analytics_events_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.analytics_events
    ADD CONSTRAINT analytics_events_pkey PRIMARY KEY (id);


--
-- Name: api_keys api_keys_key_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_key_key UNIQUE (key);


--
-- Name: api_keys api_keys_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_pkey PRIMARY KEY (id);


--
-- Name: api_request_logs api_request_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.api_request_logs
    ADD CONSTRAINT api_request_logs_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: backup_jobs backup_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.backup_jobs
    ADD CONSTRAINT backup_jobs_pkey PRIMARY KEY (id);


--
-- Name: backup_logs backup_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.backup_logs
    ADD CONSTRAINT backup_logs_pkey PRIMARY KEY (id);


--
-- Name: backup_schedules backup_schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.backup_schedules
    ADD CONSTRAINT backup_schedules_pkey PRIMARY KEY (id);


--
-- Name: branch_traditional_items branch_traditional_items_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.branch_traditional_items
    ADD CONSTRAINT branch_traditional_items_pkey PRIMARY KEY (id);


--
-- Name: branches branches_code_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.branches
    ADD CONSTRAINT branches_code_key UNIQUE (code);


--
-- Name: branches branches_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.branches
    ADD CONSTRAINT branches_pkey PRIMARY KEY (id);


--
-- Name: brands brands_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_pkey PRIMARY KEY (id);


--
-- Name: campaign_recipients campaign_recipients_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.campaign_recipients
    ADD CONSTRAINT campaign_recipients_pkey PRIMARY KEY (id);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: categories categories_slug_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_slug_key UNIQUE (slug);


--
-- Name: cities cities_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.cities
    ADD CONSTRAINT cities_pkey PRIMARY KEY (id);


--
-- Name: cms_banners cms_banners_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.cms_banners
    ADD CONSTRAINT cms_banners_pkey PRIMARY KEY (id);


--
-- Name: cms_pages cms_pages_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.cms_pages
    ADD CONSTRAINT cms_pages_pkey PRIMARY KEY (id);


--
-- Name: cms_pages cms_pages_slug_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.cms_pages
    ADD CONSTRAINT cms_pages_slug_key UNIQUE (slug);


--
-- Name: communication_logs communication_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.communication_logs
    ADD CONSTRAINT communication_logs_pkey PRIMARY KEY (id);


--
-- Name: communication_templates communication_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.communication_templates
    ADD CONSTRAINT communication_templates_pkey PRIMARY KEY (id);


--
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);


--
-- Name: content_versions content_versions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.content_versions
    ADD CONSTRAINT content_versions_pkey PRIMARY KEY (id);


--
-- Name: countries countries_code_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_code_key UNIQUE (code);


--
-- Name: countries countries_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_pkey PRIMARY KEY (id);


--
-- Name: currencies currencies_code_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.currencies
    ADD CONSTRAINT currencies_code_key UNIQUE (code);


--
-- Name: currencies currencies_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.currencies
    ADD CONSTRAINT currencies_pkey PRIMARY KEY (id);


--
-- Name: custom_template_dimensions custom_template_dimensions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.custom_template_dimensions
    ADD CONSTRAINT custom_template_dimensions_pkey PRIMARY KEY (id);


--
-- Name: custom_templates custom_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.custom_templates
    ADD CONSTRAINT custom_templates_pkey PRIMARY KEY (id);


--
-- Name: customer_addresses customer_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.customer_addresses
    ADD CONSTRAINT customer_addresses_pkey PRIMARY KEY (id);


--
-- Name: customer_subscriptions customer_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.customer_subscriptions
    ADD CONSTRAINT customer_subscriptions_pkey PRIMARY KEY (id);


--
-- Name: customers customers_customer_code_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_customer_code_key UNIQUE (customer_code);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- Name: deliveries deliveries_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.deliveries
    ADD CONSTRAINT deliveries_pkey PRIMARY KEY (id);


--
-- Name: delivery_assignments delivery_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.delivery_assignments
    ADD CONSTRAINT delivery_assignments_pkey PRIMARY KEY (id);


--
-- Name: delivery_personnel delivery_personnel_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.delivery_personnel
    ADD CONSTRAINT delivery_personnel_pkey PRIMARY KEY (id);


--
-- Name: delivery_zones delivery_zones_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.delivery_zones
    ADD CONSTRAINT delivery_zones_pkey PRIMARY KEY (id);


--
-- Name: employee_attendance employee_attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.employee_attendance
    ADD CONSTRAINT employee_attendance_pkey PRIMARY KEY (id);


--
-- Name: employees employees_employee_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_employee_id_key UNIQUE (employee_id);


--
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (id);


--
-- Name: expense_categories expense_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.expense_categories
    ADD CONSTRAINT expense_categories_pkey PRIMARY KEY (id);


--
-- Name: expenses expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_pkey PRIMARY KEY (id);


--
-- Name: feature_flags feature_flags_name_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.feature_flags
    ADD CONSTRAINT feature_flags_name_key UNIQUE (name);


--
-- Name: feature_flags feature_flags_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.feature_flags
    ADD CONSTRAINT feature_flags_pkey PRIMARY KEY (id);


--
-- Name: gift_card_transactions gift_card_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.gift_card_transactions
    ADD CONSTRAINT gift_card_transactions_pkey PRIMARY KEY (id);


--
-- Name: gift_cards gift_cards_card_number_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.gift_cards
    ADD CONSTRAINT gift_cards_card_number_key UNIQUE (card_number);


--
-- Name: gift_cards gift_cards_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.gift_cards
    ADD CONSTRAINT gift_cards_pkey PRIMARY KEY (id);


--
-- Name: health_check health_check_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.health_check
    ADD CONSTRAINT health_check_pkey PRIMARY KEY (id);


--
-- Name: health_checks health_checks_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.health_checks
    ADD CONSTRAINT health_checks_pkey PRIMARY KEY (id);


--
-- Name: image_management_images image_management_images_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.image_management_images
    ADD CONSTRAINT image_management_images_pkey PRIMARY KEY (id);


--
-- Name: images images_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_pkey PRIMARY KEY (id);


--
-- Name: inventory_adjustments inventory_adjustments_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory_adjustments
    ADD CONSTRAINT inventory_adjustments_pkey PRIMARY KEY (id);


--
-- Name: inventory_alerts inventory_alerts_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory_alerts
    ADD CONSTRAINT inventory_alerts_pkey PRIMARY KEY (id);


--
-- Name: inventory_history inventory_history_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory_history
    ADD CONSTRAINT inventory_history_pkey PRIMARY KEY (id);


--
-- Name: inventory inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_pkey PRIMARY KEY (id);


--
-- Name: inventory_transactions inventory_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory_transactions
    ADD CONSTRAINT inventory_transactions_pkey PRIMARY KEY (id);


--
-- Name: invoices invoices_invoice_number_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_invoice_number_key UNIQUE (invoice_number);


--
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


--
-- Name: label_designs label_designs_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.label_designs
    ADD CONSTRAINT label_designs_pkey PRIMARY KEY (id);


--
-- Name: label_media_types label_media_types_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.label_media_types
    ADD CONSTRAINT label_media_types_pkey PRIMARY KEY (id);


--
-- Name: label_templates label_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.label_templates
    ADD CONSTRAINT label_templates_pkey PRIMARY KEY (id);


--
-- Name: loyalty_points loyalty_points_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.loyalty_points
    ADD CONSTRAINT loyalty_points_pkey PRIMARY KEY (id);


--
-- Name: loyalty_rewards loyalty_rewards_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.loyalty_rewards
    ADD CONSTRAINT loyalty_rewards_pkey PRIMARY KEY (id);


--
-- Name: loyalty_transactions loyalty_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.loyalty_transactions
    ADD CONSTRAINT loyalty_transactions_pkey PRIMARY KEY (id);


--
-- Name: marketing_campaigns marketing_campaigns_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.marketing_campaigns
    ADD CONSTRAINT marketing_campaigns_pkey PRIMARY KEY (id);


--
-- Name: notification_settings notification_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notification_settings
    ADD CONSTRAINT notification_settings_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: nutrition_templates nutrition_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.nutrition_templates
    ADD CONSTRAINT nutrition_templates_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_order_number_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_order_number_key UNIQUE (order_number);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: performance_metrics performance_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.performance_metrics
    ADD CONSTRAINT performance_metrics_pkey PRIMARY KEY (id);


--
-- Name: product_answers product_answers_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_answers
    ADD CONSTRAINT product_answers_pkey PRIMARY KEY (id);


--
-- Name: product_attribute_values product_attribute_values_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_attribute_values
    ADD CONSTRAINT product_attribute_values_pkey PRIMARY KEY (id);


--
-- Name: product_attributes product_attributes_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_attributes
    ADD CONSTRAINT product_attributes_pkey PRIMARY KEY (id);


--
-- Name: product_collection_items product_collection_items_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_collection_items
    ADD CONSTRAINT product_collection_items_pkey PRIMARY KEY (id);


--
-- Name: product_collections product_collections_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_collections
    ADD CONSTRAINT product_collections_pkey PRIMARY KEY (id);


--
-- Name: product_collections product_collections_slug_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_collections
    ADD CONSTRAINT product_collections_slug_key UNIQUE (slug);


--
-- Name: product_labels product_labels_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_labels
    ADD CONSTRAINT product_labels_pkey PRIMARY KEY (id);


--
-- Name: product_questions product_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_questions
    ADD CONSTRAINT product_questions_pkey PRIMARY KEY (id);


--
-- Name: product_reviews product_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_reviews
    ADD CONSTRAINT product_reviews_pkey PRIMARY KEY (id);


--
-- Name: product_tax_mappings product_tax_mappings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_tax_mappings
    ADD CONSTRAINT product_tax_mappings_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: products products_sku_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_sku_key UNIQUE (sku);


--
-- Name: promotion_usage promotion_usage_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.promotion_usage
    ADD CONSTRAINT promotion_usage_pkey PRIMARY KEY (id);


--
-- Name: promotions promotions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_pkey PRIMARY KEY (id);


--
-- Name: purchase_order_items purchase_order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.purchase_order_items
    ADD CONSTRAINT purchase_order_items_pkey PRIMARY KEY (id);


--
-- Name: purchase_orders purchase_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_pkey PRIMARY KEY (id);


--
-- Name: purchase_orders purchase_orders_po_number_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_po_number_key UNIQUE (po_number);


--
-- Name: queue_jobs queue_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.queue_jobs
    ADD CONSTRAINT queue_jobs_pkey PRIMARY KEY (id);


--
-- Name: rate_limits rate_limits_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.rate_limits
    ADD CONSTRAINT rate_limits_pkey PRIMARY KEY (id);


--
-- Name: reports reports_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_pkey PRIMARY KEY (id);


--
-- Name: restore_jobs restore_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.restore_jobs
    ADD CONSTRAINT restore_jobs_pkey PRIMARY KEY (id);


--
-- Name: return_items return_items_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.return_items
    ADD CONSTRAINT return_items_pkey PRIMARY KEY (id);


--
-- Name: returns returns_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.returns
    ADD CONSTRAINT returns_pkey PRIMARY KEY (id);


--
-- Name: returns returns_return_number_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.returns
    ADD CONSTRAINT returns_return_number_key UNIQUE (return_number);


--
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: sales_reports sales_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sales_reports
    ADD CONSTRAINT sales_reports_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_version_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_version_key UNIQUE (version);


--
-- Name: search_queries search_queries_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.search_queries
    ADD CONSTRAINT search_queries_pkey PRIMARY KEY (id);


--
-- Name: seo_meta seo_meta_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.seo_meta
    ADD CONSTRAINT seo_meta_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_session_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_session_id_key UNIQUE (session_id);


--
-- Name: shipping_methods shipping_methods_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.shipping_methods
    ADD CONSTRAINT shipping_methods_pkey PRIMARY KEY (id);


--
-- Name: social_media_posts social_media_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.social_media_posts
    ADD CONSTRAINT social_media_posts_pkey PRIMARY KEY (id);


--
-- Name: states states_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.states
    ADD CONSTRAINT states_pkey PRIMARY KEY (id);


--
-- Name: stock_alerts stock_alerts_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.stock_alerts
    ADD CONSTRAINT stock_alerts_pkey PRIMARY KEY (id);


--
-- Name: stock_movements stock_movements_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT stock_movements_pkey PRIMARY KEY (id);


--
-- Name: subscription_plans subscription_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.subscription_plans
    ADD CONSTRAINT subscription_plans_pkey PRIMARY KEY (id);


--
-- Name: suppliers suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (id);


--
-- Name: support_ticket_messages support_ticket_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.support_ticket_messages
    ADD CONSTRAINT support_ticket_messages_pkey PRIMARY KEY (id);


--
-- Name: support_tickets support_tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_pkey PRIMARY KEY (id);


--
-- Name: support_tickets support_tickets_ticket_number_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_ticket_number_key UNIQUE (ticket_number);


--
-- Name: system_logs system_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.system_logs
    ADD CONSTRAINT system_logs_pkey PRIMARY KEY (id);


--
-- Name: system_settings system_settings_key_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.system_settings
    ADD CONSTRAINT system_settings_key_key UNIQUE (key);


--
-- Name: system_settings system_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.system_settings
    ADD CONSTRAINT system_settings_pkey PRIMARY KEY (id);


--
-- Name: tax_rates tax_rates_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tax_rates
    ADD CONSTRAINT tax_rates_pkey PRIMARY KEY (id);


--
-- Name: traditional_categories traditional_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.traditional_categories
    ADD CONSTRAINT traditional_categories_pkey PRIMARY KEY (id);


--
-- Name: traditional_items traditional_items_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.traditional_items
    ADD CONSTRAINT traditional_items_pkey PRIMARY KEY (id);


--
-- Name: traditional_order_items traditional_order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.traditional_order_items
    ADD CONSTRAINT traditional_order_items_pkey PRIMARY KEY (id);


--
-- Name: traditional_orders traditional_orders_order_number_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.traditional_orders
    ADD CONSTRAINT traditional_orders_order_number_key UNIQUE (order_number);


--
-- Name: traditional_orders traditional_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.traditional_orders
    ADD CONSTRAINT traditional_orders_pkey PRIMARY KEY (id);


--
-- Name: translations translations_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.translations
    ADD CONSTRAINT translations_pkey PRIMARY KEY (id);


--
-- Name: inventory unique_product_branch; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT unique_product_branch UNIQUE (product_id, branch_id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_sessions user_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_pkey PRIMARY KEY (id);


--
-- Name: user_sessions user_sessions_session_token_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_session_token_key UNIQUE (session_token);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: vendors vendors_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.vendors
    ADD CONSTRAINT vendors_pkey PRIMARY KEY (id);


--
-- Name: webhook_deliveries webhook_deliveries_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.webhook_deliveries
    ADD CONSTRAINT webhook_deliveries_pkey PRIMARY KEY (id);


--
-- Name: webhooks webhooks_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.webhooks
    ADD CONSTRAINT webhooks_pkey PRIMARY KEY (id);


--
-- Name: wishlist_items wishlist_items_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.wishlist_items
    ADD CONSTRAINT wishlist_items_pkey PRIMARY KEY (id);


--
-- Name: wishlists wishlists_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.wishlists
    ADD CONSTRAINT wishlists_pkey PRIMARY KEY (id);


--
-- Name: idx_migrations_executed; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_migrations_executed ON public.schema_migrations USING btree (executed_at);


--
-- Name: idx_migrations_version; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_migrations_version ON public.schema_migrations USING btree (version);


--
-- Name: ab_test_assignments ab_test_assignments_test_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ab_test_assignments
    ADD CONSTRAINT ab_test_assignments_test_id_fkey FOREIGN KEY (test_id) REFERENCES public.ab_tests(id);


--
-- Name: ab_test_assignments ab_test_assignments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ab_test_assignments
    ADD CONSTRAINT ab_test_assignments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: activity_logs activity_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: analytics_events analytics_events_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.analytics_events
    ADD CONSTRAINT analytics_events_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: api_keys api_keys_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: api_request_logs api_request_logs_api_key_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.api_request_logs
    ADD CONSTRAINT api_request_logs_api_key_id_fkey FOREIGN KEY (api_key_id) REFERENCES public.api_keys(id);


--
-- Name: audit_logs audit_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: backup_jobs backup_jobs_schedule_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.backup_jobs
    ADD CONSTRAINT backup_jobs_schedule_id_fkey FOREIGN KEY (schedule_id) REFERENCES public.backup_schedules(id);


--
-- Name: backup_logs backup_logs_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.backup_logs
    ADD CONSTRAINT backup_logs_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.backup_jobs(id);


--
-- Name: branch_traditional_items branch_traditional_items_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.branch_traditional_items
    ADD CONSTRAINT branch_traditional_items_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: branch_traditional_items branch_traditional_items_traditional_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.branch_traditional_items
    ADD CONSTRAINT branch_traditional_items_traditional_item_id_fkey FOREIGN KEY (traditional_item_id) REFERENCES public.traditional_items(id);


--
-- Name: branches branches_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.branches
    ADD CONSTRAINT branches_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);


--
-- Name: campaign_recipients campaign_recipients_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.campaign_recipients
    ADD CONSTRAINT campaign_recipients_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.marketing_campaigns(id);


--
-- Name: campaign_recipients campaign_recipients_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.campaign_recipients
    ADD CONSTRAINT campaign_recipients_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: cart_items cart_items_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.carts(id);


--
-- Name: cart_items cart_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: carts carts_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: carts carts_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: categories categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.categories(id);


--
-- Name: cities cities_state_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.cities
    ADD CONSTRAINT cities_state_id_fkey FOREIGN KEY (state_id) REFERENCES public.states(id);


--
-- Name: communication_logs communication_logs_template_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.communication_logs
    ADD CONSTRAINT communication_logs_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.communication_templates(id);


--
-- Name: content_versions content_versions_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.content_versions
    ADD CONSTRAINT content_versions_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: customer_addresses customer_addresses_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.customer_addresses
    ADD CONSTRAINT customer_addresses_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: customer_subscriptions customer_subscriptions_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.customer_subscriptions
    ADD CONSTRAINT customer_subscriptions_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: customer_subscriptions customer_subscriptions_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.customer_subscriptions
    ADD CONSTRAINT customer_subscriptions_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.subscription_plans(id);


--
-- Name: customers customers_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: deliveries deliveries_delivery_person_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.deliveries
    ADD CONSTRAINT deliveries_delivery_person_id_fkey FOREIGN KEY (delivery_person_id) REFERENCES public.delivery_personnel(id);


--
-- Name: deliveries deliveries_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.deliveries
    ADD CONSTRAINT deliveries_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: delivery_assignments delivery_assignments_delivery_person_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.delivery_assignments
    ADD CONSTRAINT delivery_assignments_delivery_person_id_fkey FOREIGN KEY (delivery_person_id) REFERENCES public.delivery_personnel(id);


--
-- Name: delivery_assignments delivery_assignments_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.delivery_assignments
    ADD CONSTRAINT delivery_assignments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: delivery_personnel delivery_personnel_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.delivery_personnel
    ADD CONSTRAINT delivery_personnel_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: delivery_zones delivery_zones_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.delivery_zones
    ADD CONSTRAINT delivery_zones_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: employee_attendance employee_attendance_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.employee_attendance
    ADD CONSTRAINT employee_attendance_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id);


--
-- Name: employees employees_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: employees employees_manager_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_manager_id_fkey FOREIGN KEY (manager_id) REFERENCES public.employees(id);


--
-- Name: employees employees_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: expenses expenses_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: expenses expenses_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.expense_categories(id);


--
-- Name: expenses expenses_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: gift_card_transactions gift_card_transactions_gift_card_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.gift_card_transactions
    ADD CONSTRAINT gift_card_transactions_gift_card_id_fkey FOREIGN KEY (gift_card_id) REFERENCES public.gift_cards(id);


--
-- Name: gift_cards gift_cards_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.gift_cards
    ADD CONSTRAINT gift_cards_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: gift_cards gift_cards_purchased_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.gift_cards
    ADD CONSTRAINT gift_cards_purchased_by_fkey FOREIGN KEY (purchased_by) REFERENCES public.customers(id);


--
-- Name: inventory_adjustments inventory_adjustments_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory_adjustments
    ADD CONSTRAINT inventory_adjustments_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: inventory_adjustments inventory_adjustments_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory_adjustments
    ADD CONSTRAINT inventory_adjustments_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: inventory_adjustments inventory_adjustments_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory_adjustments
    ADD CONSTRAINT inventory_adjustments_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: inventory_alerts inventory_alerts_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory_alerts
    ADD CONSTRAINT inventory_alerts_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: inventory_alerts inventory_alerts_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory_alerts
    ADD CONSTRAINT inventory_alerts_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: inventory inventory_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: inventory_history inventory_history_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory_history
    ADD CONSTRAINT inventory_history_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: inventory_history inventory_history_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory_history
    ADD CONSTRAINT inventory_history_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: inventory inventory_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: inventory inventory_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id);


--
-- Name: inventory_transactions inventory_transactions_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory_transactions
    ADD CONSTRAINT inventory_transactions_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: inventory_transactions inventory_transactions_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory_transactions
    ADD CONSTRAINT inventory_transactions_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: invoices invoices_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: label_designs label_designs_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.label_designs
    ADD CONSTRAINT label_designs_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: label_designs label_designs_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.label_designs
    ADD CONSTRAINT label_designs_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: label_designs label_designs_template_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.label_designs
    ADD CONSTRAINT label_designs_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.label_templates(id);


--
-- Name: label_templates label_templates_media_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.label_templates
    ADD CONSTRAINT label_templates_media_type_id_fkey FOREIGN KEY (media_type_id) REFERENCES public.label_media_types(id);


--
-- Name: loyalty_points loyalty_points_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.loyalty_points
    ADD CONSTRAINT loyalty_points_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: loyalty_transactions loyalty_transactions_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.loyalty_transactions
    ADD CONSTRAINT loyalty_transactions_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: notification_settings notification_settings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notification_settings
    ADD CONSTRAINT notification_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: orders orders_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: orders orders_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: orders orders_delivery_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_delivery_address_id_fkey FOREIGN KEY (delivery_address_id) REFERENCES public.customer_addresses(id);


--
-- Name: product_answers product_answers_answered_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_answers
    ADD CONSTRAINT product_answers_answered_by_fkey FOREIGN KEY (answered_by) REFERENCES public.users(id);


--
-- Name: product_answers product_answers_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_answers
    ADD CONSTRAINT product_answers_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.product_questions(id);


--
-- Name: product_attribute_values product_attribute_values_attribute_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_attribute_values
    ADD CONSTRAINT product_attribute_values_attribute_id_fkey FOREIGN KEY (attribute_id) REFERENCES public.product_attributes(id);


--
-- Name: product_attribute_values product_attribute_values_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_attribute_values
    ADD CONSTRAINT product_attribute_values_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: product_collection_items product_collection_items_collection_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_collection_items
    ADD CONSTRAINT product_collection_items_collection_id_fkey FOREIGN KEY (collection_id) REFERENCES public.product_collections(id);


--
-- Name: product_collection_items product_collection_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_collection_items
    ADD CONSTRAINT product_collection_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: product_labels product_labels_label_design_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_labels
    ADD CONSTRAINT product_labels_label_design_id_fkey FOREIGN KEY (label_design_id) REFERENCES public.label_designs(id);


--
-- Name: product_labels product_labels_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_labels
    ADD CONSTRAINT product_labels_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: product_questions product_questions_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_questions
    ADD CONSTRAINT product_questions_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: product_questions product_questions_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_questions
    ADD CONSTRAINT product_questions_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: product_reviews product_reviews_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_reviews
    ADD CONSTRAINT product_reviews_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: product_reviews product_reviews_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_reviews
    ADD CONSTRAINT product_reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: product_tax_mappings product_tax_mappings_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_tax_mappings
    ADD CONSTRAINT product_tax_mappings_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: product_tax_mappings product_tax_mappings_tax_rate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_tax_mappings
    ADD CONSTRAINT product_tax_mappings_tax_rate_id_fkey FOREIGN KEY (tax_rate_id) REFERENCES public.tax_rates(id);


--
-- Name: products products_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id);


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: products products_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id);


--
-- Name: promotion_usage promotion_usage_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.promotion_usage
    ADD CONSTRAINT promotion_usage_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: promotion_usage promotion_usage_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.promotion_usage
    ADD CONSTRAINT promotion_usage_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: promotion_usage promotion_usage_promotion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.promotion_usage
    ADD CONSTRAINT promotion_usage_promotion_id_fkey FOREIGN KEY (promotion_id) REFERENCES public.promotions(id);


--
-- Name: purchase_order_items purchase_order_items_po_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.purchase_order_items
    ADD CONSTRAINT purchase_order_items_po_id_fkey FOREIGN KEY (po_id) REFERENCES public.purchase_orders(id);


--
-- Name: purchase_order_items purchase_order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.purchase_order_items
    ADD CONSTRAINT purchase_order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: purchase_orders purchase_orders_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: purchase_orders purchase_orders_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: purchase_orders purchase_orders_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id);


--
-- Name: reports reports_generated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_generated_by_fkey FOREIGN KEY (generated_by) REFERENCES public.users(id);


--
-- Name: restore_jobs restore_jobs_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.restore_jobs
    ADD CONSTRAINT restore_jobs_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: return_items return_items_order_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.return_items
    ADD CONSTRAINT return_items_order_item_id_fkey FOREIGN KEY (order_item_id) REFERENCES public.order_items(id);


--
-- Name: return_items return_items_return_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.return_items
    ADD CONSTRAINT return_items_return_id_fkey FOREIGN KEY (return_id) REFERENCES public.returns(id);


--
-- Name: returns returns_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.returns
    ADD CONSTRAINT returns_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: returns returns_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.returns
    ADD CONSTRAINT returns_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: sales_reports sales_reports_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sales_reports
    ADD CONSTRAINT sales_reports_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: search_queries search_queries_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.search_queries
    ADD CONSTRAINT search_queries_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: states states_country_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.states
    ADD CONSTRAINT states_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.countries(id);


--
-- Name: stock_alerts stock_alerts_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.stock_alerts
    ADD CONSTRAINT stock_alerts_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: stock_alerts stock_alerts_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.stock_alerts
    ADD CONSTRAINT stock_alerts_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: stock_movements stock_movements_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT stock_movements_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: stock_movements stock_movements_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT stock_movements_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: stock_movements stock_movements_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT stock_movements_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: support_ticket_messages support_ticket_messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.support_ticket_messages
    ADD CONSTRAINT support_ticket_messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id);


--
-- Name: support_ticket_messages support_ticket_messages_ticket_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.support_ticket_messages
    ADD CONSTRAINT support_ticket_messages_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES public.support_tickets(id);


--
-- Name: support_tickets support_tickets_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.users(id);


--
-- Name: support_tickets support_tickets_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: traditional_order_items traditional_order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.traditional_order_items
    ADD CONSTRAINT traditional_order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.traditional_orders(id);


--
-- Name: traditional_order_items traditional_order_items_traditional_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.traditional_order_items
    ADD CONSTRAINT traditional_order_items_traditional_item_id_fkey FOREIGN KEY (traditional_item_id) REFERENCES public.traditional_items(id);


--
-- Name: traditional_orders traditional_orders_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.traditional_orders
    ADD CONSTRAINT traditional_orders_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: traditional_orders traditional_orders_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.traditional_orders
    ADD CONSTRAINT traditional_orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: user_roles user_roles_assigned_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_assigned_by_fkey FOREIGN KEY (assigned_by) REFERENCES public.users(id);


--
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: user_sessions user_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: users users_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: webhook_deliveries webhook_deliveries_webhook_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.webhook_deliveries
    ADD CONSTRAINT webhook_deliveries_webhook_id_fkey FOREIGN KEY (webhook_id) REFERENCES public.webhooks(id);


--
-- Name: wishlist_items wishlist_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.wishlist_items
    ADD CONSTRAINT wishlist_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: wishlist_items wishlist_items_wishlist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.wishlist_items
    ADD CONSTRAINT wishlist_items_wishlist_id_fkey FOREIGN KEY (wishlist_id) REFERENCES public.wishlists(id);


--
-- Name: wishlists wishlists_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.wishlists
    ADD CONSTRAINT wishlists_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: DATABASE neondb; Type: ACL; Schema: -; Owner: neondb_owner
--

GRANT ALL ON DATABASE neondb TO neon_superuser;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: neondb_owner
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: neon; Type: SCHEMA; Schema: -; Owner: cloud_admin
--

CREATE SCHEMA neon;


ALTER SCHEMA neon OWNER TO cloud_admin;

--
-- Name: neon_migration; Type: SCHEMA; Schema: -; Owner: cloud_admin
--

CREATE SCHEMA neon_migration;


ALTER SCHEMA neon_migration OWNER TO cloud_admin;

--
-- Name: neon; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS neon WITH SCHEMA neon;


--
-- Name: EXTENSION neon; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION neon IS 'cloud storage for PostgreSQL';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA public;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: drop_subscriptions_done; Type: TABLE; Schema: neon; Owner: cloud_admin
--

CREATE TABLE neon.drop_subscriptions_done (
    id integer NOT NULL,
    timeline_id text
);


ALTER TABLE neon.drop_subscriptions_done OWNER TO cloud_admin;

--
-- Name: drop_subscriptions_done_id_seq; Type: SEQUENCE; Schema: neon; Owner: cloud_admin
--

CREATE SEQUENCE neon.drop_subscriptions_done_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE neon.drop_subscriptions_done_id_seq OWNER TO cloud_admin;

--
-- Name: drop_subscriptions_done_id_seq; Type: SEQUENCE OWNED BY; Schema: neon; Owner: cloud_admin
--

ALTER SEQUENCE neon.drop_subscriptions_done_id_seq OWNED BY neon.drop_subscriptions_done.id;


--
-- Name: migration_id; Type: TABLE; Schema: neon_migration; Owner: cloud_admin
--

CREATE TABLE neon_migration.migration_id (
    key integer NOT NULL,
    id bigint DEFAULT 0 NOT NULL
);


ALTER TABLE neon_migration.migration_id OWNER TO cloud_admin;

--
-- Name: health_check; Type: TABLE; Schema: public; Owner: cloud_admin
--

CREATE TABLE public.health_check (
    id integer NOT NULL,
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.health_check OWNER TO cloud_admin;

--
-- Name: health_check_id_seq; Type: SEQUENCE; Schema: public; Owner: cloud_admin
--

CREATE SEQUENCE public.health_check_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.health_check_id_seq OWNER TO cloud_admin;

--
-- Name: health_check_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cloud_admin
--

ALTER SEQUENCE public.health_check_id_seq OWNED BY public.health_check.id;


--
-- Name: drop_subscriptions_done id; Type: DEFAULT; Schema: neon; Owner: cloud_admin
--

ALTER TABLE ONLY neon.drop_subscriptions_done ALTER COLUMN id SET DEFAULT nextval('neon.drop_subscriptions_done_id_seq'::regclass);


--
-- Name: health_check id; Type: DEFAULT; Schema: public; Owner: cloud_admin
--

ALTER TABLE ONLY public.health_check ALTER COLUMN id SET DEFAULT nextval('public.health_check_id_seq'::regclass);


--
-- Data for Name: drop_subscriptions_done; Type: TABLE DATA; Schema: neon; Owner: cloud_admin
--

COPY neon.drop_subscriptions_done (id, timeline_id) FROM stdin;
1	f0bcbac4187c027c1b0926bf9a60c6bf
\.


--
-- Data for Name: migration_id; Type: TABLE DATA; Schema: neon_migration; Owner: cloud_admin
--

COPY neon_migration.migration_id (key, id) FROM stdin;
0	11
\.


--
-- Data for Name: health_check; Type: TABLE DATA; Schema: public; Owner: cloud_admin
--

COPY public.health_check (id, updated_at) FROM stdin;
1	2025-07-12 16:35:49.515677+00
\.


--
-- Name: drop_subscriptions_done_id_seq; Type: SEQUENCE SET; Schema: neon; Owner: cloud_admin
--

SELECT pg_catalog.setval('neon.drop_subscriptions_done_id_seq', 1, false);


--
-- Name: health_check_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cloud_admin
--

SELECT pg_catalog.setval('public.health_check_id_seq', 1, false);


--
-- Name: drop_subscriptions_done drop_subscriptions_done_pkey; Type: CONSTRAINT; Schema: neon; Owner: cloud_admin
--

ALTER TABLE ONLY neon.drop_subscriptions_done
    ADD CONSTRAINT drop_subscriptions_done_pkey PRIMARY KEY (id);


--
-- Name: migration_id migration_id_pkey; Type: CONSTRAINT; Schema: neon_migration; Owner: cloud_admin
--

ALTER TABLE ONLY neon_migration.migration_id
    ADD CONSTRAINT migration_id_pkey PRIMARY KEY (key);


--
-- Name: health_check health_check_pkey; Type: CONSTRAINT; Schema: public; Owner: cloud_admin
--

ALTER TABLE ONLY public.health_check
    ADD CONSTRAINT health_check_pkey PRIMARY KEY (id);


--
-- Name: FUNCTION pg_export_snapshot(); Type: ACL; Schema: pg_catalog; Owner: cloud_admin
--

GRANT ALL ON FUNCTION pg_catalog.pg_export_snapshot() TO neon_superuser;


--
-- Name: FUNCTION pg_log_standby_snapshot(); Type: ACL; Schema: pg_catalog; Owner: cloud_admin
--

GRANT ALL ON FUNCTION pg_catalog.pg_log_standby_snapshot() TO neon_superuser;


--
-- Name: FUNCTION pg_show_replication_origin_status(OUT local_id oid, OUT external_id text, OUT remote_lsn pg_lsn, OUT local_lsn pg_lsn); Type: ACL; Schema: pg_catalog; Owner: cloud_admin
--

GRANT ALL ON FUNCTION pg_catalog.pg_show_replication_origin_status(OUT local_id oid, OUT external_id text, OUT remote_lsn pg_lsn, OUT local_lsn pg_lsn) TO neon_superuser;


--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database cluster dump complete
--

