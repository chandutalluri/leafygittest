--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.5

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


--
-- Name: get_nutrition_template(character varying); Type: FUNCTION; Schema: public; Owner: neondb_owner
--

CREATE FUNCTION public.get_nutrition_template(template_category character varying) RETURNS TABLE(category character varying, required_fields jsonb, optional_fields jsonb, indian_fssai_compliance boolean)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  SELECT nt.category, nt.required_fields, nt.optional_fields, nt.indian_fssai_compliance
  FROM nutrition_templates nt
  WHERE nt.category = template_category;
END;
$$;


ALTER FUNCTION public.get_nutrition_template(template_category character varying) OWNER TO neondb_owner;

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
    key_hash character varying(255) NOT NULL,
    permissions jsonb,
    rate_limit integer DEFAULT 1000,
    last_used_at timestamp without time zone,
    expires_at timestamp without time zone,
    is_active boolean DEFAULT true,
    created_by character varying(255),
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
    method character varying(10) NOT NULL,
    endpoint character varying(255) NOT NULL,
    user_id character varying(255),
    ip_address character varying(45),
    request_body text,
    response_status integer,
    response_time integer,
    error_message text,
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
    user_id character varying(255),
    action character varying(100) NOT NULL,
    resource_type character varying(100) NOT NULL,
    resource_id character varying(100),
    old_values jsonb,
    new_values jsonb,
    ip_address character varying(45),
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
    job_id character varying(100) NOT NULL,
    type character varying(50) NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying NOT NULL,
    file_name character varying(255),
    gcs_path character varying(500),
    file_size character varying(50),
    checksum character varying(64),
    started_at timestamp without time zone DEFAULT now(),
    completed_at timestamp without time zone,
    error text,
    metadata jsonb,
    created_by character varying(100) NOT NULL
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
    backup_type character varying(50) NOT NULL,
    file_name character varying(255),
    file_size bigint,
    status character varying(20) DEFAULT 'in_progress'::character varying,
    started_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    completed_at timestamp without time zone,
    error_message text
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
    name character varying(100) NOT NULL,
    cron_expression character varying(50) NOT NULL,
    backup_type character varying(50) NOT NULL,
    is_active boolean DEFAULT true,
    last_run timestamp without time zone,
    next_run timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
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
-- Name: branch_contexts; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.branch_contexts (
    id integer NOT NULL,
    entity_type character varying(50) NOT NULL,
    entity_id integer NOT NULL,
    branch_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.branch_contexts OWNER TO neondb_owner;

--
-- Name: branch_contexts_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.branch_contexts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.branch_contexts_id_seq OWNER TO neondb_owner;

--
-- Name: branch_contexts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.branch_contexts_id_seq OWNED BY public.branch_contexts.id;


--
-- Name: branch_traditional_items; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.branch_traditional_items (
    id integer NOT NULL,
    branch_id integer NOT NULL,
    item_id integer NOT NULL,
    ordinary_price numeric(10,2) NOT NULL,
    medium_price numeric(10,2) NOT NULL,
    best_price numeric(10,2) NOT NULL,
    is_available boolean DEFAULT true,
    stock_quantity integer DEFAULT 0,
    min_order_quantity integer DEFAULT 1,
    max_order_quantity integer DEFAULT 100,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    price_ordinary numeric(10,2),
    price_medium numeric(10,2),
    price_best numeric(10,2),
    stock_ordinary integer DEFAULT 1000,
    stock_medium integer DEFAULT 1000,
    stock_best integer DEFAULT 1000
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
    company_id integer NOT NULL,
    name character varying(255) NOT NULL,
    code character varying(50) NOT NULL,
    address text NOT NULL,
    city character varying(100) NOT NULL,
    state character varying(100) NOT NULL,
    country character varying(100) DEFAULT 'India'::character varying NOT NULL,
    postal_code character varying(20),
    latitude numeric(10,8),
    longitude numeric(11,8),
    phone character varying(20),
    email character varying(255),
    manager_name character varying(255),
    operating_hours jsonb,
    delivery_radius numeric(8,2),
    settings jsonb,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    working_hours jsonb DEFAULT '{"friday": "9:00-18:00", "monday": "9:00-18:00", "sunday": "closed", "tuesday": "9:00-18:00", "saturday": "9:00-14:00", "thursday": "9:00-18:00", "wednesday": "9:00-18:00"}'::jsonb,
    features jsonb DEFAULT '[]'::jsonb
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
    slug character varying(255) NOT NULL,
    description text,
    logo character varying(500),
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
-- Name: cache_entries; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.cache_entries (
    id integer NOT NULL,
    cache_key character varying(255) NOT NULL,
    cache_value text NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.cache_entries OWNER TO neondb_owner;

--
-- Name: cache_entries_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.cache_entries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cache_entries_id_seq OWNER TO neondb_owner;

--
-- Name: cache_entries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.cache_entries_id_seq OWNED BY public.cache_entries.id;


--
-- Name: campaign_recipients; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.campaign_recipients (
    id integer NOT NULL,
    campaign_id integer NOT NULL,
    customer_id integer NOT NULL,
    sent_at timestamp without time zone,
    opened_at timestamp without time zone,
    clicked_at timestamp without time zone,
    unsubscribed_at timestamp without time zone,
    status character varying(20) DEFAULT 'pending'::character varying,
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
    cart_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    total_price numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
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
    session_id character varying(255),
    branch_id integer,
    status character varying(20) DEFAULT 'active'::character varying,
    total_amount numeric(10,2) DEFAULT 0,
    item_count integer DEFAULT 0,
    expires_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
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
    slug character varying(100) NOT NULL,
    description text,
    description_telugu text,
    image character varying(500),
    icon character varying(100),
    parent_id integer,
    sort_order integer DEFAULT 0,
    seo_title character varying(255),
    seo_description text,
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
    state_id integer NOT NULL,
    name character varying(100) NOT NULL,
    latitude numeric(10,8),
    longitude numeric(11,8),
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
    description text,
    image_url character varying(500),
    link_url character varying(500),
    "position" character varying(50),
    sort_order integer DEFAULT 0,
    start_date timestamp without time zone,
    end_date timestamp without time zone,
    is_active boolean DEFAULT true,
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
    status character varying(20) DEFAULT 'draft'::character varying,
    template character varying(100),
    featured_image character varying(500),
    author_id character varying(255),
    published_at timestamp without time zone,
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
    recipient character varying(255) NOT NULL,
    type character varying(20) NOT NULL,
    template_id integer,
    subject character varying(255),
    content text,
    status character varying(20) DEFAULT 'sent'::character varying,
    provider_response jsonb,
    error_message text,
    sent_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
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
    content text NOT NULL,
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
    slug character varying(100) NOT NULL,
    description text,
    logo character varying(500),
    website character varying(255),
    email character varying(255),
    phone character varying(20),
    address text,
    city character varying(100),
    state character varying(100),
    country character varying(100) DEFAULT 'India'::character varying,
    postal_code character varying(20),
    tax_id character varying(100),
    registration_number character varying(100),
    fssai_license character varying(100),
    gst_number character varying(100),
    industry character varying(100) DEFAULT 'Organic Food'::character varying,
    founded_year integer,
    employee_count integer,
    annual_revenue numeric(15,2),
    settings jsonb,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
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
-- Name: compliance_checks; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.compliance_checks (
    id integer NOT NULL,
    check_type character varying(100) NOT NULL,
    entity_type character varying(50) NOT NULL,
    entity_id character varying(100) NOT NULL,
    status character varying(20) NOT NULL,
    findings jsonb,
    checked_by character varying(255),
    checked_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    next_check_due timestamp without time zone
);


ALTER TABLE public.compliance_checks OWNER TO neondb_owner;

--
-- Name: compliance_checks_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.compliance_checks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.compliance_checks_id_seq OWNER TO neondb_owner;

--
-- Name: compliance_checks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.compliance_checks_id_seq OWNED BY public.compliance_checks.id;


--
-- Name: content_versions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.content_versions (
    id integer NOT NULL,
    entity_type character varying(50) NOT NULL,
    entity_id character varying(100) NOT NULL,
    version_number integer NOT NULL,
    content_data jsonb NOT NULL,
    change_summary text,
    created_by character varying(255),
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
    code character varying(2) NOT NULL,
    name character varying(100) NOT NULL,
    currency_code character varying(3),
    phone_code character varying(10),
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
    code character varying(3) NOT NULL,
    name character varying(100) NOT NULL,
    symbol character varying(10) NOT NULL,
    exchange_rate numeric(12,6) DEFAULT 1.000000,
    is_default boolean DEFAULT false,
    is_active boolean DEFAULT true,
    last_updated timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
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
    template_name character varying(255) NOT NULL,
    width numeric(8,2) NOT NULL,
    height numeric(8,2) NOT NULL,
    unit character varying(10) DEFAULT 'mm'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
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
-- Name: customer_addresses; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.customer_addresses (
    id integer NOT NULL,
    customer_id integer NOT NULL,
    type character varying(20) DEFAULT 'home'::character varying NOT NULL,
    is_default boolean DEFAULT false,
    first_name character varying(100),
    last_name character varying(100),
    company character varying(100),
    address1 character varying(255) NOT NULL,
    address2 character varying(255),
    city character varying(100) NOT NULL,
    state character varying(100) NOT NULL,
    postal_code character varying(20) NOT NULL,
    country character varying(100) DEFAULT 'India'::character varying NOT NULL,
    phone character varying(20),
    latitude numeric(10,8),
    longitude numeric(11,8),
    instructions text,
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
    customer_id integer NOT NULL,
    plan_id integer NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    auto_renew boolean DEFAULT true,
    status character varying(20) DEFAULT 'active'::character varying,
    payment_method character varying(50),
    amount_paid numeric(10,2),
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
    user_id character varying(255),
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(20),
    date_of_birth date,
    gender character varying(10),
    loyalty_points integer DEFAULT 0,
    total_orders integer DEFAULT 0,
    total_spent numeric(12,2) DEFAULT 0,
    average_order_value numeric(10,2) DEFAULT 0,
    last_order_date timestamp without time zone,
    status character varying(20) DEFAULT 'active'::character varying,
    source character varying(50),
    tags jsonb,
    preferences jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    branch_id integer
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
-- Name: data_privacy_requests; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.data_privacy_requests (
    id integer NOT NULL,
    customer_id integer NOT NULL,
    request_type character varying(50) NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying,
    requested_data jsonb,
    processed_by character varying(255),
    processed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.data_privacy_requests OWNER TO neondb_owner;

--
-- Name: data_privacy_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.data_privacy_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.data_privacy_requests_id_seq OWNER TO neondb_owner;

--
-- Name: data_privacy_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.data_privacy_requests_id_seq OWNED BY public.data_privacy_requests.id;


--
-- Name: delivery_assignments; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.delivery_assignments (
    id integer NOT NULL,
    order_id integer NOT NULL,
    delivery_person_id character varying(255),
    assigned_at timestamp without time zone,
    picked_up_at timestamp without time zone,
    delivered_at timestamp without time zone,
    delivery_notes text,
    customer_signature character varying(500),
    delivery_photo character varying(500),
    status character varying(50) DEFAULT 'assigned'::character varying,
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
-- Name: delivery_schedules; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.delivery_schedules (
    id integer NOT NULL,
    branch_id integer NOT NULL,
    day_of_week integer NOT NULL,
    time_slots jsonb NOT NULL,
    max_orders_per_slot integer DEFAULT 50,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT delivery_schedules_day_of_week_check CHECK (((day_of_week >= 0) AND (day_of_week <= 6)))
);


ALTER TABLE public.delivery_schedules OWNER TO neondb_owner;

--
-- Name: delivery_schedules_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.delivery_schedules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.delivery_schedules_id_seq OWNER TO neondb_owner;

--
-- Name: delivery_schedules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.delivery_schedules_id_seq OWNED BY public.delivery_schedules.id;


--
-- Name: delivery_zones; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.delivery_zones (
    id integer NOT NULL,
    branch_id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    postal_codes jsonb,
    polygon_coordinates jsonb,
    delivery_fee numeric(8,2) DEFAULT 0,
    free_delivery_threshold numeric(10,2),
    estimated_delivery_time character varying(50),
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
    employee_id integer NOT NULL,
    attendance_date date NOT NULL,
    check_in_time timestamp without time zone,
    check_out_time timestamp without time zone,
    break_duration integer DEFAULT 0,
    total_hours numeric(4,2),
    status character varying(20) DEFAULT 'present'::character varying,
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
    user_id character varying(255),
    employee_id character varying(50) NOT NULL,
    branch_id integer,
    department character varying(100),
    designation character varying(100),
    salary numeric(10,2),
    date_of_joining date,
    date_of_leaving date,
    emergency_contact jsonb,
    documents jsonb,
    performance_metrics jsonb,
    status character varying(20) DEFAULT 'active'::character varying,
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
    parent_id integer,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
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
    expense_number character varying(100) NOT NULL,
    category_id integer,
    branch_id integer,
    description character varying(255) NOT NULL,
    amount numeric(12,2) NOT NULL,
    expense_date date NOT NULL,
    payment_method character varying(50),
    receipt_url character varying(500),
    vendor_name character varying(255),
    approved_by character varying(255),
    approved_at timestamp without time zone,
    status character varying(20) DEFAULT 'pending'::character varying,
    created_by character varying(255),
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
    name character varying(100) NOT NULL,
    description text,
    is_enabled boolean DEFAULT false,
    conditions jsonb,
    rollout_percentage integer DEFAULT 0,
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
    gift_card_id integer NOT NULL,
    order_id integer,
    transaction_type character varying(20) NOT NULL,
    amount numeric(10,2) NOT NULL,
    balance_after numeric(10,2) NOT NULL,
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
    code character varying(50) NOT NULL,
    amount numeric(10,2) NOT NULL,
    balance numeric(10,2) NOT NULL,
    status character varying(20) DEFAULT 'active'::character varying,
    expires_at date,
    purchased_by integer,
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
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.health_check OWNER TO neondb_owner;

--
-- Name: health_checks; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.health_checks (
    id integer NOT NULL,
    service_name character varying(100) NOT NULL,
    status character varying(20) NOT NULL,
    response_time integer,
    error_message text,
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
-- Name: image_uploads; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.image_uploads (
    id integer NOT NULL,
    original_name character varying(255) NOT NULL,
    filename character varying(255) NOT NULL,
    file_path character varying(500) NOT NULL,
    file_size integer NOT NULL,
    mime_type character varying(100) NOT NULL,
    dimensions jsonb,
    alt_text character varying(255),
    entity_type character varying(50),
    entity_id character varying(100),
    uploaded_by character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.image_uploads OWNER TO neondb_owner;

--
-- Name: image_uploads_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.image_uploads_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.image_uploads_id_seq OWNER TO neondb_owner;

--
-- Name: image_uploads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.image_uploads_id_seq OWNED BY public.image_uploads.id;


--
-- Name: integrations; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.integrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    type character varying(50) NOT NULL,
    provider character varying(100) NOT NULL,
    configuration jsonb NOT NULL,
    credentials jsonb,
    is_active boolean DEFAULT true,
    last_sync_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.integrations OWNER TO neondb_owner;

--
-- Name: integrations_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.integrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.integrations_id_seq OWNER TO neondb_owner;

--
-- Name: integrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.integrations_id_seq OWNED BY public.integrations.id;


--
-- Name: inventory; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.inventory (
    id integer NOT NULL,
    product_id integer NOT NULL,
    branch_id integer NOT NULL,
    quantity integer DEFAULT 0 NOT NULL,
    reserved_quantity integer DEFAULT 0,
    available_quantity integer DEFAULT 0,
    reorder_level integer DEFAULT 10,
    max_stock integer,
    location character varying(100),
    batch_number character varying(100),
    expiry_date date,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.inventory OWNER TO neondb_owner;

--
-- Name: inventory_adjustments; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.inventory_adjustments (
    id integer NOT NULL,
    product_id integer NOT NULL,
    branch_id integer,
    old_quantity integer NOT NULL,
    new_quantity integer NOT NULL,
    adjustment_reason character varying(100) NOT NULL,
    adjusted_by character varying(255),
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
    product_id integer NOT NULL,
    branch_id integer,
    transaction_type character varying(50) NOT NULL,
    quantity_change integer NOT NULL,
    new_quantity integer NOT NULL,
    reference_id character varying(100),
    reference_type character varying(50),
    notes text,
    created_by character varying(255),
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
-- Name: label_media_types; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.label_media_types (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    label_width_mm numeric(8,2) NOT NULL,
    label_height_mm numeric(8,2) NOT NULL,
    page_width_mm numeric(8,2) DEFAULT 210 NOT NULL,
    page_height_mm numeric(8,2) DEFAULT 297 NOT NULL,
    rows integer NOT NULL,
    columns integer NOT NULL,
    gap_x_mm numeric(8,2) DEFAULT 0,
    gap_y_mm numeric(8,2) DEFAULT 0,
    margin_top_mm numeric(8,2) DEFAULT 10,
    margin_bottom_mm numeric(8,2) DEFAULT 10,
    margin_left_mm numeric(8,2) DEFAULT 10,
    margin_right_mm numeric(8,2) DEFAULT 10,
    media_type character varying(50) DEFAULT 'sheet'::character varying,
    avery_code character varying(20),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now()
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
    template_data jsonb NOT NULL,
    thumbnail_url character varying(500),
    category character varying(100),
    is_public boolean DEFAULT false,
    created_by character varying(255),
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
-- Name: loyalty_rewards; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.loyalty_rewards (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    points_required integer NOT NULL,
    reward_type character varying(50) NOT NULL,
    reward_value numeric(10,2),
    applicable_products jsonb,
    applicable_categories jsonb,
    usage_limit integer,
    expiry_days integer,
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
    customer_id integer NOT NULL,
    transaction_type character varying(50) NOT NULL,
    points integer NOT NULL,
    order_id integer,
    description character varying(255),
    expires_at timestamp without time zone,
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
    type character varying(50) NOT NULL,
    channel character varying(50) NOT NULL,
    subject character varying(255),
    content text,
    target_audience jsonb,
    start_date timestamp without time zone,
    end_date timestamp without time zone,
    budget numeric(12,2),
    status character varying(20) DEFAULT 'draft'::character varying,
    created_by character varying(255),
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
-- Name: marketplace_listings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.marketplace_listings (
    id integer NOT NULL,
    product_id integer NOT NULL,
    marketplace character varying(50) NOT NULL,
    external_id character varying(255),
    status character varying(20) DEFAULT 'draft'::character varying,
    listing_data jsonb,
    sync_status character varying(20) DEFAULT 'pending'::character varying,
    last_synced_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.marketplace_listings OWNER TO neondb_owner;

--
-- Name: marketplace_listings_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.marketplace_listings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.marketplace_listings_id_seq OWNER TO neondb_owner;

--
-- Name: marketplace_listings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.marketplace_listings_id_seq OWNED BY public.marketplace_listings.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    user_id character varying(255),
    title character varying(255) NOT NULL,
    message text NOT NULL,
    type character varying(50) DEFAULT 'info'::character varying,
    channel character varying(50) DEFAULT 'in_app'::character varying,
    is_read boolean DEFAULT false,
    read_at timestamp without time zone,
    metadata jsonb,
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
    category character varying(50) NOT NULL,
    required_fields jsonb NOT NULL,
    optional_fields jsonb,
    indian_fssai_compliance boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
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
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    total_price numeric(10,2) NOT NULL,
    product_snapshot jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
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
    order_number character varying(100) NOT NULL,
    customer_id integer,
    branch_id integer,
    status character varying(50) DEFAULT 'pending'::character varying,
    payment_status character varying(50) DEFAULT 'pending'::character varying,
    shipping_status character varying(50) DEFAULT 'pending'::character varying,
    subtotal numeric(10,2) NOT NULL,
    tax_amount numeric(10,2) DEFAULT 0,
    shipping_amount numeric(10,2) DEFAULT 0,
    discount_amount numeric(10,2) DEFAULT 0,
    total_amount numeric(10,2) NOT NULL,
    currency character varying(3) DEFAULT 'INR'::character varying,
    billing_address jsonb,
    shipping_address jsonb,
    delivery_date date,
    delivery_time_slot character varying(50),
    order_notes text,
    internal_notes text,
    metadata jsonb,
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
    payment_gateway character varying(50),
    transaction_id character varying(255),
    amount numeric(10,2) NOT NULL,
    currency character varying(3) DEFAULT 'INR'::character varying,
    status character varying(50) DEFAULT 'pending'::character varying,
    gateway_response jsonb,
    failure_reason text,
    refund_amount numeric(10,2) DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    branch_id integer
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
    metric_name character varying(100) NOT NULL,
    metric_value numeric(12,4) NOT NULL,
    metric_unit character varying(20),
    branch_id integer,
    recorded_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
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
-- Name: price_history; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.price_history (
    id integer NOT NULL,
    product_id integer NOT NULL,
    old_price numeric(10,2),
    new_price numeric(10,2) NOT NULL,
    change_reason character varying(255),
    changed_by character varying(255),
    effective_from timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.price_history OWNER TO neondb_owner;

--
-- Name: price_history_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.price_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.price_history_id_seq OWNER TO neondb_owner;

--
-- Name: product_answers; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.product_answers (
    id integer NOT NULL,
    question_id integer NOT NULL,
    user_id character varying(255) NOT NULL,
    answer text NOT NULL,
    is_from_seller boolean DEFAULT false,
    helpful_count integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.product_answers OWNER TO neondb_owner;

--
-- Name: product_attribute_values; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.product_attribute_values (
    id integer NOT NULL,
    product_id integer NOT NULL,
    attribute_id integer NOT NULL,
    value text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.product_attribute_values OWNER TO neondb_owner;

--
-- Name: product_attributes; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.product_attributes (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    type character varying(50) NOT NULL,
    is_required boolean DEFAULT false,
    is_filterable boolean DEFAULT false,
    sort_order integer DEFAULT 0,
    options jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.product_attributes OWNER TO neondb_owner;

--
-- Name: product_collection_items; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.product_collection_items (
    id integer NOT NULL,
    collection_id integer NOT NULL,
    product_id integer NOT NULL,
    sort_order integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.product_collection_items OWNER TO neondb_owner;

--
-- Name: product_collections; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.product_collections (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    description text,
    image character varying(500),
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.product_collections OWNER TO neondb_owner;

--
-- Name: product_questions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.product_questions (
    id integer NOT NULL,
    product_id integer NOT NULL,
    customer_id integer NOT NULL,
    question text NOT NULL,
    is_answered boolean DEFAULT false,
    is_public boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.product_questions OWNER TO neondb_owner;

--
-- Name: product_reviews; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.product_reviews (
    id integer NOT NULL,
    product_id integer NOT NULL,
    customer_id integer NOT NULL,
    order_id integer,
    rating integer NOT NULL,
    title character varying(255),
    comment text,
    images jsonb,
    is_verified_purchase boolean DEFAULT false,
    is_approved boolean DEFAULT false,
    helpful_count integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT product_reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.product_reviews OWNER TO neondb_owner;

--
-- Name: products; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    name_telugu character varying(255),
    slug character varying(255),
    description text,
    description_telugu text,
    short_description text,
    sku character varying(100),
    barcode character varying(100),
    category_id integer,
    selling_price numeric(10,2) DEFAULT 0.00 NOT NULL,
    mrp numeric(10,2) DEFAULT 0.00,
    cost_price numeric(10,2),
    unit character varying(50),
    weight numeric(8,3),
    dimensions text,
    image_url character varying(255),
    images text,
    tags text,
    attributes jsonb,
    nutritional_info text,
    organic_certification text,
    is_featured boolean DEFAULT false,
    is_digital boolean DEFAULT false,
    status character varying(20) DEFAULT 'active'::character varying,
    seo_title character varying(255),
    seo_description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    brand_id integer,
    branch_id integer,
    has_nutrition_facts boolean DEFAULT false,
    nutrition_category character varying(50),
    nutrition_data jsonb,
    nutrition_source character varying(100),
    nutrition_updated_at timestamp without time zone
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
    promotion_id integer NOT NULL,
    customer_id integer NOT NULL,
    order_id integer NOT NULL,
    discount_amount numeric(10,2) NOT NULL,
    used_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.promotion_usage OWNER TO neondb_owner;

--
-- Name: promotions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.promotions (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    code character varying(50),
    type character varying(50) NOT NULL,
    value numeric(10,2) NOT NULL,
    minimum_order_amount numeric(10,2),
    maximum_discount numeric(10,2),
    usage_limit integer,
    used_count integer DEFAULT 0,
    per_customer_limit integer,
    applicable_categories jsonb,
    applicable_products jsonb,
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.promotions OWNER TO neondb_owner;

--
-- Name: purchase_order_items; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.purchase_order_items (
    id integer NOT NULL,
    purchase_order_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    unit_cost numeric(10,2) NOT NULL,
    total_cost numeric(12,2) NOT NULL,
    received_quantity integer DEFAULT 0,
    status character varying(50) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.purchase_order_items OWNER TO neondb_owner;

--
-- Name: purchase_orders; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.purchase_orders (
    id integer NOT NULL,
    po_number character varying(100) NOT NULL,
    supplier_id integer NOT NULL,
    branch_id integer NOT NULL,
    status character varying(50) DEFAULT 'draft'::character varying,
    order_date date NOT NULL,
    expected_delivery_date date,
    actual_delivery_date date,
    subtotal numeric(12,2) NOT NULL,
    tax_amount numeric(12,2) DEFAULT 0,
    total_amount numeric(12,2) NOT NULL,
    currency character varying(3) DEFAULT 'INR'::character varying,
    terms_conditions text,
    notes text,
    created_by character varying(255),
    approved_by character varying(255),
    approved_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.purchase_orders OWNER TO neondb_owner;

--
-- Name: queue_jobs; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.queue_jobs (
    id integer NOT NULL,
    queue_name character varying(100) NOT NULL,
    job_type character varying(100) NOT NULL,
    payload jsonb NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying,
    attempts integer DEFAULT 0,
    max_attempts integer DEFAULT 3,
    scheduled_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    started_at timestamp without time zone,
    completed_at timestamp without time zone,
    failed_at timestamp without time zone,
    error_message text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.queue_jobs OWNER TO neondb_owner;

--
-- Name: rate_limits; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.rate_limits (
    id integer NOT NULL,
    identifier character varying(255) NOT NULL,
    endpoint character varying(255) NOT NULL,
    requests_count integer DEFAULT 1,
    window_start timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.rate_limits OWNER TO neondb_owner;

--
-- Name: restore_jobs; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.restore_jobs (
    id integer NOT NULL,
    job_id character varying(100) NOT NULL,
    backup_job_id character varying(100) NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying NOT NULL,
    target_database character varying(100),
    restore_point timestamp without time zone,
    started_at timestamp without time zone DEFAULT now(),
    completed_at timestamp without time zone,
    error text,
    metadata jsonb,
    created_by character varying(100) NOT NULL
);


ALTER TABLE public.restore_jobs OWNER TO neondb_owner;

--
-- Name: return_items; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.return_items (
    id integer NOT NULL,
    return_id integer NOT NULL,
    order_item_id integer NOT NULL,
    quantity integer NOT NULL,
    condition character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.return_items OWNER TO neondb_owner;

--
-- Name: returns; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.returns (
    id integer NOT NULL,
    return_number character varying(100) NOT NULL,
    order_id integer NOT NULL,
    customer_id integer NOT NULL,
    reason character varying(255) NOT NULL,
    description text,
    status character varying(20) DEFAULT 'requested'::character varying,
    refund_amount numeric(10,2),
    approved_by character varying(255),
    approved_at timestamp without time zone,
    processed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.returns OWNER TO neondb_owner;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    description text,
    permissions jsonb,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.roles OWNER TO neondb_owner;

--
-- Name: sales_reports; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.sales_reports (
    id integer NOT NULL,
    report_date date NOT NULL,
    branch_id integer,
    total_orders integer DEFAULT 0,
    total_revenue numeric(12,2) DEFAULT 0,
    total_items_sold integer DEFAULT 0,
    average_order_value numeric(10,2) DEFAULT 0,
    new_customers integer DEFAULT 0,
    returning_customers integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.sales_reports OWNER TO neondb_owner;

--
-- Name: scheduled_tasks; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.scheduled_tasks (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    cron_expression character varying(100) NOT NULL,
    command character varying(500) NOT NULL,
    is_active boolean DEFAULT true,
    last_run_at timestamp without time zone,
    next_run_at timestamp without time zone,
    success_count integer DEFAULT 0,
    failure_count integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.scheduled_tasks OWNER TO neondb_owner;

--
-- Name: search_queries; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.search_queries (
    id integer NOT NULL,
    query character varying(255) NOT NULL,
    customer_id integer,
    results_count integer DEFAULT 0,
    selected_product_id integer,
    ip_address character varying(45),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.search_queries OWNER TO neondb_owner;

--
-- Name: seo_meta; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.seo_meta (
    id integer NOT NULL,
    entity_type character varying(50) NOT NULL,
    entity_id character varying(100) NOT NULL,
    meta_title character varying(255),
    meta_description text,
    meta_keywords character varying(500),
    og_title character varying(255),
    og_description text,
    og_image character varying(500),
    canonical_url character varying(500),
    robots_meta character varying(100),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.seo_meta OWNER TO neondb_owner;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.sessions (
    sid character varying(255) NOT NULL,
    sess jsonb NOT NULL,
    expire timestamp without time zone NOT NULL
);


ALTER TABLE public.sessions OWNER TO neondb_owner;

--
-- Name: shipping_methods; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.shipping_methods (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    cost numeric(8,2) NOT NULL,
    estimated_delivery_days integer,
    weight_limit numeric(8,2),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.shipping_methods OWNER TO neondb_owner;

--
-- Name: social_media_posts; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.social_media_posts (
    id integer NOT NULL,
    platform character varying(50) NOT NULL,
    post_id character varying(255),
    content text NOT NULL,
    media_urls jsonb,
    scheduled_at timestamp without time zone,
    published_at timestamp without time zone,
    engagement_metrics jsonb,
    status character varying(20) DEFAULT 'draft'::character varying,
    created_by character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.social_media_posts OWNER TO neondb_owner;

--
-- Name: states; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.states (
    id integer NOT NULL,
    country_id integer NOT NULL,
    code character varying(10) NOT NULL,
    name character varying(100) NOT NULL,
    is_active boolean DEFAULT true
);


ALTER TABLE public.states OWNER TO neondb_owner;

--
-- Name: stock_alerts; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.stock_alerts (
    id integer NOT NULL,
    product_id integer NOT NULL,
    branch_id integer NOT NULL,
    alert_type character varying(50) NOT NULL,
    threshold_value integer,
    current_value integer,
    is_resolved boolean DEFAULT false,
    resolved_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.stock_alerts OWNER TO neondb_owner;

--
-- Name: subscription_plans; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.subscription_plans (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    type character varying(50) NOT NULL,
    duration_days integer NOT NULL,
    price numeric(10,2) NOT NULL,
    features jsonb,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.subscription_plans OWNER TO neondb_owner;

--
-- Name: suppliers; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.suppliers (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    code character varying(50) NOT NULL,
    contact_person character varying(255),
    email character varying(255),
    phone character varying(20),
    address text,
    city character varying(100),
    state character varying(100),
    country character varying(100) DEFAULT 'India'::character varying,
    postal_code character varying(20),
    gst_number character varying(100),
    payment_terms character varying(100),
    credit_limit numeric(12,2),
    rating numeric(3,2),
    status character varying(20) DEFAULT 'active'::character varying,
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.suppliers OWNER TO neondb_owner;

--
-- Name: support_ticket_messages; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.support_ticket_messages (
    id integer NOT NULL,
    ticket_id integer NOT NULL,
    sender_id character varying(255),
    message text NOT NULL,
    attachments jsonb,
    is_internal boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.support_ticket_messages OWNER TO neondb_owner;

--
-- Name: support_tickets; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.support_tickets (
    id integer NOT NULL,
    ticket_number character varying(100) NOT NULL,
    customer_id integer,
    subject character varying(255) NOT NULL,
    description text NOT NULL,
    priority character varying(20) DEFAULT 'medium'::character varying,
    status character varying(20) DEFAULT 'open'::character varying,
    category character varying(50),
    assigned_to character varying(255),
    assigned_at timestamp without time zone,
    resolved_at timestamp without time zone,
    resolution_notes text,
    satisfaction_rating integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.support_tickets OWNER TO neondb_owner;

--
-- Name: system_logs; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.system_logs (
    id integer NOT NULL,
    level character varying(20) NOT NULL,
    message text NOT NULL,
    context jsonb,
    service character varying(100),
    trace_id character varying(100),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.system_logs OWNER TO neondb_owner;

--
-- Name: system_settings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.system_settings (
    id integer NOT NULL,
    key character varying(255) NOT NULL,
    value text,
    type character varying(50) DEFAULT 'string'::character varying,
    description text,
    is_public boolean DEFAULT false,
    updated_by character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.system_settings OWNER TO neondb_owner;

--
-- Name: tax_rates; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.tax_rates (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    rate numeric(5,2) NOT NULL,
    type character varying(50) NOT NULL,
    applicable_categories jsonb,
    effective_from date NOT NULL,
    effective_to date,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tax_rates OWNER TO neondb_owner;

--
-- Name: traditional_items; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.traditional_items (
    id integer NOT NULL,
    name_english character varying(255) NOT NULL,
    name_telugu character varying(255) NOT NULL,
    category character varying(100) NOT NULL,
    unit character varying(50) NOT NULL,
    ordinary_price numeric(10,2) NOT NULL,
    medium_price numeric(10,2) NOT NULL,
    best_price numeric(10,2) NOT NULL,
    is_active boolean DEFAULT true,
    region character varying(100) DEFAULT 'AP_TG'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.traditional_items OWNER TO neondb_owner;

--
-- Name: traditional_items_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.traditional_items_id_seq
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
    item_id integer,
    quantity numeric(10,2) NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    total_price numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.traditional_order_items OWNER TO neondb_owner;

--
-- Name: traditional_orders; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.traditional_orders (
    id integer NOT NULL,
    customer_id character varying(255),
    order_type character varying(50) DEFAULT 'traditional'::character varying,
    quality_tier character varying(20) NOT NULL,
    total_amount numeric(10,2) NOT NULL,
    selected_vendor_id integer,
    delivery_address text NOT NULL,
    order_status character varying(50) DEFAULT 'pending'::character varying,
    order_date timestamp without time zone DEFAULT now(),
    delivery_date timestamp without time zone,
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    branch_id integer,
    CONSTRAINT traditional_orders_quality_tier_check CHECK (((quality_tier)::text = ANY (ARRAY[('ordinary'::character varying)::text, ('medium'::character varying)::text, ('best'::character varying)::text])))
);


ALTER TABLE public.traditional_orders OWNER TO neondb_owner;

--
-- Name: translations; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.translations (
    id integer NOT NULL,
    language_code character varying(10) NOT NULL,
    namespace character varying(100) NOT NULL,
    key character varying(255) NOT NULL,
    value text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.translations OWNER TO neondb_owner;

--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.user_roles (
    id integer NOT NULL,
    user_id character varying(255) NOT NULL,
    role_id integer NOT NULL,
    assigned_by character varying(255),
    assigned_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    expires_at timestamp without time zone,
    is_active boolean DEFAULT true
);


ALTER TABLE public.user_roles OWNER TO neondb_owner;

--
-- Name: user_sessions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.user_sessions (
    id integer NOT NULL,
    user_id character varying(255) NOT NULL,
    branch_id integer,
    session_token text NOT NULL,
    refresh_token text NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    ip_address character varying(45),
    user_agent text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_sessions OWNER TO neondb_owner;

--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id character varying(255) NOT NULL,
    email character varying(255),
    first_name character varying(100),
    last_name character varying(100),
    profile_image_url character varying(500),
    name character varying(255),
    role character varying(50) DEFAULT 'user'::character varying,
    status character varying(20) DEFAULT 'active'::character varying,
    assigned_app character varying(50),
    department character varying(100),
    phone character varying(20),
    is_active boolean DEFAULT true,
    email_verified boolean DEFAULT false,
    last_login timestamp without time zone,
    preferred_branch_id integer,
    current_branch_id integer,
    last_known_latitude numeric(10,8),
    last_known_longitude numeric(11,8),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    metadata jsonb,
    password_hash character varying(255)
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: vendors; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.vendors (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    vendor_type character varying(100),
    contact_person character varying(255),
    phone character varying(20),
    email character varying(255),
    address text,
    gst_number character varying(50),
    pan_number character varying(20),
    bank_details jsonb,
    payment_terms character varying(100),
    credit_limit numeric(12,2),
    current_balance numeric(12,2) DEFAULT 0,
    is_active boolean DEFAULT true,
    rating numeric(3,2),
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    branch_id integer
);


ALTER TABLE public.vendors OWNER TO neondb_owner;

--
-- Name: webhook_deliveries; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.webhook_deliveries (
    id integer NOT NULL,
    webhook_id integer NOT NULL,
    event_type character varying(100) NOT NULL,
    payload jsonb NOT NULL,
    response_status integer,
    response_body text,
    delivered_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    retry_count integer DEFAULT 0
);


ALTER TABLE public.webhook_deliveries OWNER TO neondb_owner;

--
-- Name: webhooks; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.webhooks (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    url character varying(500) NOT NULL,
    events jsonb NOT NULL,
    secret character varying(255),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.webhooks OWNER TO neondb_owner;

--
-- Name: wishlist_items; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.wishlist_items (
    id integer NOT NULL,
    wishlist_id integer NOT NULL,
    product_id integer NOT NULL,
    added_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.wishlist_items OWNER TO neondb_owner;

--
-- Name: wishlists; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.wishlists (
    id integer NOT NULL,
    customer_id integer NOT NULL,
    name character varying(255) DEFAULT 'My Wishlist'::character varying,
    is_public boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.wishlists OWNER TO neondb_owner;

--
-- Name: label_media_types id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.label_media_types ALTER COLUMN id SET DEFAULT nextval('public.label_media_types_id_seq'::regclass);


--
-- Name: label_templates id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.label_templates ALTER COLUMN id SET DEFAULT nextval('public.label_templates_id_seq'::regclass);


--
-- Name: nutrition_templates id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.nutrition_templates ALTER COLUMN id SET DEFAULT nextval('public.nutrition_templates_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: traditional_items id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.traditional_items ALTER COLUMN id SET DEFAULT nextval('public.traditional_items_id_seq'::regclass);


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
-- Data for Name: api_keys; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.api_keys (id, name, key_hash, permissions, rate_limit, last_used_at, expires_at, is_active, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: api_request_logs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.api_request_logs (id, method, endpoint, user_id, ip_address, request_body, response_status, response_time, error_message, created_at) FROM stdin;
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.audit_logs (id, user_id, action, resource_type, resource_id, old_values, new_values, ip_address, user_agent, created_at) FROM stdin;
\.


--
-- Data for Name: backup_jobs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.backup_jobs (id, job_id, type, status, file_name, gcs_path, file_size, checksum, started_at, completed_at, error, metadata, created_by) FROM stdin;
\.


--
-- Data for Name: backup_logs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.backup_logs (id, backup_type, file_name, file_size, status, started_at, completed_at, error_message) FROM stdin;
\.


--
-- Data for Name: backup_schedules; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.backup_schedules (id, name, cron_expression, backup_type, is_active, last_run, next_run, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: branch_contexts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.branch_contexts (id, entity_type, entity_id, branch_id, created_at) FROM stdin;
\.


--
-- Data for Name: branch_traditional_items; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.branch_traditional_items (id, branch_id, item_id, ordinary_price, medium_price, best_price, is_available, stock_quantity, min_order_quantity, max_order_quantity, created_at, updated_at, price_ordinary, price_medium, price_best, stock_ordinary, stock_medium, stock_best) FROM stdin;
\.


--
-- Data for Name: branches; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.branches (id, company_id, name, code, address, city, state, country, postal_code, latitude, longitude, phone, email, manager_name, operating_hours, delivery_radius, settings, is_active, created_at, updated_at, working_hours, features) FROM stdin;
1	1	SVOF Hyderabad Main	HYD001	Plot No. 45, HITEC City, Madhapur	Hyderabad	Telangana	India	500081	17.44850000	78.39080000	+91-8885551234	\N	Rajesh Kumar	\N	25.00	{"services": {"traditional_orders": true}}	t	2025-06-27 17:03:57.116373	2025-06-27 17:03:57.116373	{"friday": "9:00-18:00", "monday": "9:00-18:00", "sunday": "closed", "tuesday": "9:00-18:00", "saturday": "9:00-14:00", "thursday": "9:00-18:00", "wednesday": "9:00-18:00"}	[]
2	1	SVOF Gachibowli	HYD002	Road No. 36, Jubilee Hills	Hyderabad	Telangana	India	500033	17.40650000	78.46910000	+91-8885551235	\N	Priya Sharma	\N	20.00	{"services": {"traditional_orders": true}}	t	2025-06-27 17:03:57.116373	2025-06-27 17:03:57.116373	{"friday": "9:00-18:00", "monday": "9:00-18:00", "sunday": "closed", "tuesday": "9:00-18:00", "saturday": "9:00-14:00", "thursday": "9:00-18:00", "wednesday": "9:00-18:00"}	[]
5	1	SVOF Kondapur	HYD003	Kondapur Main Road, Near Metro Station	Hyderabad	Telangana	India	500084	17.46470000	78.36170000	+91-8885551236	\N	Suresh Reddy	\N	22.00	{"services": {"traditional_orders": true}}	t	2025-06-27 17:03:57.116373	2025-06-27 17:03:57.116373	{"friday": "9:00-18:00", "monday": "9:00-18:00", "sunday": "closed", "tuesday": "9:00-18:00", "saturday": "9:00-14:00", "thursday": "9:00-18:00", "wednesday": "9:00-18:00"}	[]
4	3	PEO Vijayawada Market	VJA001	Agricultural Market Yard, Ring Road	Vijayawada	Andhra Pradesh	India	520001	16.50620000	80.64800000	+91-8661234567	\N	Lakshmi Devi	\N	35.00	{"services": {"traditional_orders": false}}	t	2025-06-27 17:03:57.116373	2025-06-27 17:03:57.116373	{"friday": "9:00-18:00", "monday": "9:00-18:00", "sunday": "closed", "tuesday": "9:00-18:00", "saturday": "9:00-14:00", "thursday": "9:00-18:00", "wednesday": "9:00-18:00"}	[]
3	1	SVOF Visakhapatnam Central	VZG001	Main Road, Opposite Bus Stand	Visakhapatnam	Andhra Pradesh	India	530001	17.68680000	83.21850000	+91-8912345678	\N	Venkata Rao	\N	30.00	{"services": {"traditional_orders": true}}	t	2025-06-27 17:03:57.116373	2025-06-27 17:03:57.116373	{"friday": "9:00-18:00", "monday": "9:00-18:00", "sunday": "closed", "tuesday": "9:00-18:00", "saturday": "9:00-14:00", "thursday": "9:00-18:00", "wednesday": "9:00-18:00"}	[]
\.


--
-- Data for Name: brands; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.brands (id, name, slug, description, logo, website, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: cache_entries; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.cache_entries (id, cache_key, cache_value, expires_at, created_at) FROM stdin;
\.


--
-- Data for Name: campaign_recipients; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.campaign_recipients (id, campaign_id, customer_id, sent_at, opened_at, clicked_at, unsubscribed_at, status, created_at) FROM stdin;
\.


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.cart_items (id, cart_id, product_id, quantity, unit_price, total_price, created_at, updated_at, branch_id) FROM stdin;
\.


--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.carts (id, customer_id, session_id, branch_id, status, total_amount, item_count, expires_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.categories (id, name, name_telugu, slug, description, description_telugu, image, icon, parent_id, sort_order, seo_title, seo_description, is_active, created_at, updated_at) FROM stdin;
1	Vegetables	కూరగాయలు	vegetables	Fresh organic vegetables	తాజా సేంద్రీయ కూరగాయలు	\N	\N	\N	0	\N	\N	t	2025-06-27 17:03:57.116373	2025-06-27 17:03:57.116373
2	Fruits	పండ్లు	fruits	Seasonal organic fruits	కాలానుగుణ సేంద్రీయ పండ్లు	\N	\N	\N	0	\N	\N	t	2025-06-27 17:03:57.116373	2025-06-27 17:03:57.116373
3	Grains & Cereals	ధాన్యాలు & తృణధాన్యాలు	grains-cereals	Organic grains and cereals	సేంద్రీయ ధాన్యాలు మరియు తృణధాన్యాలు	\N	\N	\N	0	\N	\N	t	2025-06-27 17:03:57.116373	2025-06-27 17:03:57.116373
4	Pulses & Lentils	పప్పులు & పెసలు	pulses-lentils	Traditional organic pulses	సంప్రదాయ సేంద్రీయ పప్పులు	\N	\N	\N	0	\N	\N	t	2025-06-27 17:03:57.116373	2025-06-27 17:03:57.116373
5	Spices & Condiments	మసాలా దినుసులు & రుచికారకాలు	spices-condiments	Authentic Andhra spices	అసలైన ఆంధ్ర మసాలాలు	\N	\N	\N	0	\N	\N	t	2025-06-27 17:03:57.116373	2025-06-27 17:03:57.116373
6	Dairy Products	పాల ఉత్పత్తులు	dairy-products	Fresh organic dairy	తాజా సేంద్రీయ పాల ఉత్పత్తులు	\N	\N	\N	0	\N	\N	t	2025-06-27 17:03:57.116373	2025-06-27 17:03:57.116373
7	Oil & Ghee	నూనె & నెయ్యి	oil-ghee	Cold-pressed oils and pure ghee	చల్లని నొక్కిన నూనెలు మరియు స్వచ్ఛమైన నెయ్యి	\N	\N	\N	0	\N	\N	t	2025-06-27 17:03:57.116373	2025-06-27 17:03:57.116373
8	Snacks & Sweets	స్నాక్స్ & మిఠాయిలు	snacks-sweets	Traditional Andhra snacks and sweets	సంప్రదాయ ఆంధ్ర స్నాక్స్ మరియు మిఠాయిలు	\N	\N	\N	0	\N	\N	t	2025-06-27 17:03:57.116373	2025-06-27 17:03:57.116373
9	Beverages	పానీయాలు	beverages	Natural and organic beverages	సహజ మరియు సేంద్రీయ పానీయాలు	\N	\N	\N	0	\N	\N	t	2025-06-27 17:03:57.116373	2025-06-27 17:03:57.116373
10	Health & Wellness	ఆరోగ్యం & క్షేమం	health-wellness	Organic health and wellness products	సేంద్రీయ ఆరోగ్య మరియు క్షేమ ఉత్పత్తులు	\N	\N	\N	0	\N	\N	t	2025-06-27 17:03:57.116373	2025-06-27 17:03:57.116373
\.


--
-- Data for Name: cities; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.cities (id, state_id, name, latitude, longitude, is_active) FROM stdin;
\.


--
-- Data for Name: cms_banners; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.cms_banners (id, title, description, image_url, link_url, "position", sort_order, start_date, end_date, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: cms_pages; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.cms_pages (id, title, slug, content, meta_title, meta_description, status, template, featured_image, author_id, published_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: communication_logs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.communication_logs (id, recipient, type, template_id, subject, content, status, provider_response, error_message, sent_at) FROM stdin;
\.


--
-- Data for Name: communication_templates; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.communication_templates (id, name, type, subject, content, variables, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.companies (id, name, slug, description, logo, website, email, phone, address, city, state, country, postal_code, tax_id, registration_number, fssai_license, gst_number, industry, founded_year, employee_count, annual_revenue, settings, is_active, created_at, updated_at) FROM stdin;
1	Sri Venkateswara Organic Foods	svof	Premium organic food retailer specializing in authentic Andhra Pradesh organic produce	\N	\N	info@svorganicfoods.com	+91-8885551234	Plot No. 45, HITEC City	Hyderabad	Telangana	India	500081	\N	\N	12345678901234	36AABCS1234F1Z5	Organic Food Retail	\N	\N	\N	\N	t	2025-06-27 17:03:32.255636	2025-06-27 17:03:32.255636
2	Green Valley Naturals	gvn	Sustainable organic farming and retail chain across Andhra Pradesh	\N	\N	contact@greenvalley.com	+91-8912345678	Main Road, Opposite Bus Stand	Visakhapatnam	Andhra Pradesh	India	530001	\N	\N	12345678901235	37AABCS1234F1Z6	Organic Food Retail	\N	\N	\N	\N	t	2025-06-27 17:03:32.255636	2025-06-27 17:03:32.255636
3	Pure Earth Organics	peo	Certified organic vegetables and grains from local farmers	\N	\N	hello@pureearthorganics.com	+91-8661234567	Agricultural Market Yard	Vijayawada	Andhra Pradesh	India	520001	\N	\N	12345678901236	37AABCS1234F1Z7	Organic Food Retail	\N	\N	\N	\N	t	2025-06-27 17:03:32.255636	2025-06-27 17:03:32.255636
\.


--
-- Data for Name: compliance_checks; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.compliance_checks (id, check_type, entity_type, entity_id, status, findings, checked_by, checked_at, next_check_due) FROM stdin;
\.


--
-- Data for Name: content_versions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.content_versions (id, entity_type, entity_id, version_number, content_data, change_summary, created_by, created_at) FROM stdin;
\.


--
-- Data for Name: countries; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.countries (id, code, name, currency_code, phone_code, is_active) FROM stdin;
\.


--
-- Data for Name: currencies; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.currencies (id, code, name, symbol, exchange_rate, is_default, is_active, last_updated, created_at) FROM stdin;
\.


--
-- Data for Name: custom_template_dimensions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.custom_template_dimensions (id, template_name, width, height, unit, created_at) FROM stdin;
\.


--
-- Data for Name: customer_addresses; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.customer_addresses (id, customer_id, type, is_default, first_name, last_name, company, address1, address2, city, state, postal_code, country, phone, latitude, longitude, instructions, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: customer_subscriptions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.customer_subscriptions (id, customer_id, plan_id, start_date, end_date, auto_renew, status, payment_method, amount_paid, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.customers (id, user_id, first_name, last_name, email, phone, date_of_birth, gender, loyalty_points, total_orders, total_spent, average_order_value, last_order_date, status, source, tags, preferences, created_at, updated_at, branch_id) FROM stdin;
1	\N	Rajesh	Kumar	rajesh.kumar@gmail.com	+91-9876543210	\N	\N	150	12	8500.00	0.00	\N	active	\N	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346	1
2	\N	Priya	Sharma	priya.sharma@gmail.com	+91-9876543211	\N	\N	89	8	5200.00	0.00	\N	active	\N	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346	1
3	\N	Venkata	Rao	venkata.rao@gmail.com	+91-9876543212	\N	\N	245	18	12800.00	0.00	\N	active	\N	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346	1
4	\N	Lakshmi	Devi	lakshmi.devi@gmail.com	+91-9876543213	\N	\N	67	5	3400.00	0.00	\N	active	\N	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346	1
5	\N	Suresh	Reddy	suresh.reddy@gmail.com	+91-9876543214	\N	\N	312	25	18900.00	0.00	\N	active	\N	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346	1
6	\N	Anitha	Kumari	anitha.kumari@gmail.com	+91-9876543215	\N	\N	198	14	11200.00	0.00	\N	active	\N	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346	1
7	\N	Ramesh	Babu	ramesh.babu@gmail.com	+91-9876543216	\N	\N	76	6	4800.00	0.00	\N	active	\N	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346	1
8	\N	Sita	Mahalakshmi	sita.mahalakshmi@gmail.com	+91-9876543217	\N	\N	456	32	24500.00	0.00	\N	active	\N	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346	1
9	customer-1751700072363	Test	Customer	customer@leafyhealth.com	9876543210	\N	\N	0	0	0.00	0.00	\N	active	\N	\N	\N	2025-07-05 07:59:02.994862	2025-07-05 07:59:02.994862	1
\.


--
-- Data for Name: data_privacy_requests; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.data_privacy_requests (id, customer_id, request_type, status, requested_data, processed_by, processed_at, created_at) FROM stdin;
\.


--
-- Data for Name: delivery_assignments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.delivery_assignments (id, order_id, delivery_person_id, assigned_at, picked_up_at, delivered_at, delivery_notes, customer_signature, delivery_photo, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: delivery_schedules; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.delivery_schedules (id, branch_id, day_of_week, time_slots, max_orders_per_slot, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: delivery_zones; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.delivery_zones (id, branch_id, name, description, postal_codes, polygon_coordinates, delivery_fee, free_delivery_threshold, estimated_delivery_time, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: employee_attendance; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.employee_attendance (id, employee_id, attendance_date, check_in_time, check_out_time, break_duration, total_hours, status, notes, created_at) FROM stdin;
\.


--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.employees (id, user_id, employee_id, branch_id, department, designation, salary, date_of_joining, date_of_leaving, emergency_contact, documents, performance_metrics, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: expense_categories; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.expense_categories (id, name, description, parent_id, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: expenses; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.expenses (id, expense_number, category_id, branch_id, description, amount, expense_date, payment_method, receipt_url, vendor_name, approved_by, approved_at, status, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: feature_flags; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.feature_flags (id, name, description, is_enabled, conditions, rollout_percentage, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: gift_card_transactions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.gift_card_transactions (id, gift_card_id, order_id, transaction_type, amount, balance_after, created_at) FROM stdin;
\.


--
-- Data for Name: gift_cards; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.gift_cards (id, code, amount, balance, status, expires_at, purchased_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: health_check; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.health_check (id, updated_at) FROM stdin;
\.


--
-- Data for Name: health_checks; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.health_checks (id, service_name, status, response_time, error_message, checked_at) FROM stdin;
\.


--
-- Data for Name: image_uploads; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.image_uploads (id, original_name, filename, file_path, file_size, mime_type, dimensions, alt_text, entity_type, entity_id, uploaded_by, created_at) FROM stdin;
\.


--
-- Data for Name: integrations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.integrations (id, name, type, provider, configuration, credentials, is_active, last_sync_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: inventory; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.inventory (id, product_id, branch_id, quantity, reserved_quantity, available_quantity, reorder_level, max_stock, location, batch_number, expiry_date, updated_at, created_at) FROM stdin;
1	1	1	36	0	36	15	\N	Section-B-02	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
2	2	1	27	0	27	15	\N	Section-C-03	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
3	3	1	48	0	48	15	\N	Section-D-04	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
4	4	1	39	0	39	15	\N	Section-E-05	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
5	5	1	30	0	30	15	\N	Section-F-06	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
6	6	1	51	0	51	10	\N	Section-G-07	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
7	7	1	42	0	42	10	\N	Section-H-08	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
8	8	1	33	0	33	10	\N	Section-I-09	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
9	9	1	54	0	54	8	\N	Section-J-10	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
10	10	1	45	0	45	8	\N	Section-K-11	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
11	11	1	36	0	36	8	\N	Section-L-12	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
12	12	1	57	0	57	8	\N	Section-M-13	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
13	13	1	48	0	48	8	\N	Section-N-14	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
14	14	1	39	0	39	8	\N	Section-O-15	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
15	15	1	60	0	60	5	\N	Section-P-16	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
16	16	1	36	0	36	5	\N	Section-Q-17	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
17	17	1	42	0	42	5	\N	Section-R-18	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
18	18	1	63	0	63	5	\N	Section-S-19	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
19	19	1	39	0	39	5	\N	Section-T-20	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
20	20	1	45	0	45	5	\N	Section-U-21	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
21	1	2	36	0	36	15	\N	Section-B-02	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
22	2	2	27	0	27	15	\N	Section-C-03	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
23	3	2	48	0	48	15	\N	Section-D-04	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
24	4	2	39	0	39	15	\N	Section-E-05	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
25	5	2	30	0	30	15	\N	Section-F-06	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
26	6	2	51	0	51	10	\N	Section-G-07	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
27	7	2	42	0	42	10	\N	Section-H-08	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
28	8	2	33	0	33	10	\N	Section-I-09	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
29	9	2	54	0	54	8	\N	Section-J-10	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
30	10	2	45	0	45	8	\N	Section-K-11	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
31	11	2	36	0	36	8	\N	Section-L-12	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
32	12	2	57	0	57	8	\N	Section-M-13	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
33	13	2	48	0	48	8	\N	Section-N-14	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
34	14	2	39	0	39	8	\N	Section-O-15	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
35	15	2	60	0	60	5	\N	Section-P-16	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
36	16	2	36	0	36	5	\N	Section-Q-17	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
37	17	2	42	0	42	5	\N	Section-R-18	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
38	18	2	63	0	63	5	\N	Section-S-19	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
39	19	2	39	0	39	5	\N	Section-T-20	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
40	20	2	45	0	45	5	\N	Section-U-21	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
41	1	3	36	0	36	15	\N	Section-B-02	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
42	2	3	27	0	27	15	\N	Section-C-03	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
43	3	3	48	0	48	15	\N	Section-D-04	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
44	4	3	39	0	39	15	\N	Section-E-05	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
45	5	3	30	0	30	15	\N	Section-F-06	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
46	6	3	51	0	51	10	\N	Section-G-07	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
47	7	3	42	0	42	10	\N	Section-H-08	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
48	8	3	33	0	33	10	\N	Section-I-09	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
49	9	3	54	0	54	8	\N	Section-J-10	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
50	10	3	45	0	45	8	\N	Section-K-11	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
51	11	3	36	0	36	8	\N	Section-L-12	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
52	12	3	57	0	57	8	\N	Section-M-13	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
53	13	3	48	0	48	8	\N	Section-N-14	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
54	14	3	39	0	39	8	\N	Section-O-15	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
55	15	3	60	0	60	5	\N	Section-P-16	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
56	16	3	36	0	36	5	\N	Section-Q-17	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
57	17	3	42	0	42	5	\N	Section-R-18	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
58	18	3	63	0	63	5	\N	Section-S-19	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
59	19	3	39	0	39	5	\N	Section-T-20	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
60	20	3	45	0	45	5	\N	Section-U-21	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
61	1	4	36	0	36	15	\N	Section-B-02	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
62	2	4	27	0	27	15	\N	Section-C-03	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
63	3	4	48	0	48	15	\N	Section-D-04	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
64	4	4	39	0	39	15	\N	Section-E-05	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
65	5	4	30	0	30	15	\N	Section-F-06	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
66	6	4	51	0	51	10	\N	Section-G-07	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
67	7	4	42	0	42	10	\N	Section-H-08	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
68	8	4	33	0	33	10	\N	Section-I-09	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
69	9	4	54	0	54	8	\N	Section-J-10	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
70	10	4	45	0	45	8	\N	Section-K-11	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
71	11	4	36	0	36	8	\N	Section-L-12	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
72	12	4	57	0	57	8	\N	Section-M-13	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
73	13	4	48	0	48	8	\N	Section-N-14	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
74	14	4	39	0	39	8	\N	Section-O-15	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
75	15	4	60	0	60	5	\N	Section-P-16	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
76	16	4	36	0	36	5	\N	Section-Q-17	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
77	17	4	42	0	42	5	\N	Section-R-18	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
78	18	4	63	0	63	5	\N	Section-S-19	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
79	19	4	39	0	39	5	\N	Section-T-20	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
80	20	4	45	0	45	5	\N	Section-U-21	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
81	1	5	36	0	36	15	\N	Section-B-02	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
82	2	5	27	0	27	15	\N	Section-C-03	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
83	3	5	48	0	48	15	\N	Section-D-04	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
84	4	5	39	0	39	15	\N	Section-E-05	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
85	5	5	30	0	30	15	\N	Section-F-06	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
86	6	5	51	0	51	10	\N	Section-G-07	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
87	7	5	42	0	42	10	\N	Section-H-08	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
88	8	5	33	0	33	10	\N	Section-I-09	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
89	9	5	54	0	54	8	\N	Section-J-10	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
90	10	5	45	0	45	8	\N	Section-K-11	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
91	11	5	36	0	36	8	\N	Section-L-12	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
92	12	5	57	0	57	8	\N	Section-M-13	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
93	13	5	48	0	48	8	\N	Section-N-14	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
94	14	5	39	0	39	8	\N	Section-O-15	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
95	15	5	60	0	60	5	\N	Section-P-16	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
96	16	5	36	0	36	5	\N	Section-Q-17	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
97	17	5	42	0	42	5	\N	Section-R-18	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
98	18	5	63	0	63	5	\N	Section-S-19	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
99	19	5	39	0	39	5	\N	Section-T-20	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
100	20	5	45	0	45	5	\N	Section-U-21	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
\.


--
-- Data for Name: inventory_adjustments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.inventory_adjustments (id, product_id, branch_id, old_quantity, new_quantity, adjustment_reason, adjusted_by, created_at) FROM stdin;
\.


--
-- Data for Name: inventory_transactions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.inventory_transactions (id, product_id, branch_id, transaction_type, quantity_change, new_quantity, reference_id, reference_type, notes, created_by, created_at) FROM stdin;
\.


--
-- Data for Name: label_media_types; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.label_media_types (id, name, description, label_width_mm, label_height_mm, page_width_mm, page_height_mm, rows, columns, gap_x_mm, gap_y_mm, margin_top_mm, margin_bottom_mm, margin_left_mm, margin_right_mm, media_type, avery_code, is_active, created_at) FROM stdin;
3	Avery J8159	24 labels per sheet - 63.5 x 33.9mm	63.50	33.90	210.00	297.00	8	3	0.00	0.00	10.00	10.00	10.00	10.00	sheet	J8159	t	2025-07-12 08:30:07.190116
4	Avery J8160	21 labels per sheet - 63.5 x 38.1mm	63.50	38.10	210.00	297.00	7	3	0.00	0.00	10.00	10.00	10.00	10.00	sheet	J8160	t	2025-07-12 08:30:07.190116
5	Avery J8161	18 labels per sheet - 63.5 x 46.6mm	63.50	46.60	210.00	297.00	6	3	0.00	0.00	10.00	10.00	10.00	10.00	sheet	J8161	t	2025-07-12 08:30:07.190116
6	Avery J8162	16 labels per sheet - 99.1 x 33.9mm	99.10	33.90	210.00	297.00	8	2	0.00	0.00	10.00	10.00	10.00	10.00	sheet	J8162	t	2025-07-12 08:30:07.190116
7	Avery J8163	14 labels per sheet - 99.1 x 38.1mm	99.10	38.10	210.00	297.00	7	2	0.00	0.00	10.00	10.00	10.00	10.00	sheet	J8163	t	2025-07-12 08:30:07.190116
9	Avery J8165	8 labels per sheet - 99.1 x 67.7mm	99.10	67.70	210.00	297.00	4	2	0.00	0.00	10.00	10.00	10.00	10.00	sheet	J8165	t	2025-07-12 08:30:07.190116
10	Custom 30-up	30 labels per sheet - 70 x 25mm	65.90	71.00	210.00	297.00	4	3	1.00	1.00	3.00	10.00	3.00	10.00	sheet	12 A4	t	2025-07-12 08:30:07.190116
11	A4 - 21 Labels (70x42.3mm)	\N	70.00	42.30	210.00	297.00	7	3	0.00	0.00	0.00	10.00	0.00	10.00	sheet	L7160	t	2025-07-12 14:44:32.423992
12	A4 - 14 Labels (99.1x38.1mm)	\N	99.10	38.10	210.00	297.00	7	2	2.50	0.00	15.10	10.00	6.50	10.00	sheet	L7163	t	2025-07-12 14:44:32.423992
13	A4 - 24 Labels (70x37mm)	\N	70.00	37.00	210.00	297.00	8	3	0.00	0.00	13.00	10.00	0.00	10.00	sheet	L7159	t	2025-07-12 14:44:32.423992
14	Letter - 30 Labels (2.625"x1")	\N	66.68	25.40	215.90	279.40	10	3	3.18	0.00	12.70	10.00	4.76	10.00	sheet	5160	t	2025-07-12 14:44:32.423992
\.


--
-- Data for Name: label_templates; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.label_templates (id, name, description, template_data, thumbnail_url, category, is_public, created_by, created_at, updated_at) FROM stdin;
21	Test Template After Delete	Testing refresh after deleting all templates	{"type": "custom", "mediaId": 1, "elements": [{"x": 10, "y": 10, "id": "text1", "text": "Test Label", "type": "text", "fontSize": 14, "fontFamily": "Arial"}], "spacingX": 0, "spacingY": 0, "marginTop": 0, "paperSize": "A4", "labelWidth": 70, "marginLeft": 0, "labelHeight": 29.7, "orientation": "portrait", "verticalCount": 10, "horizontalCount": 3}	\N	\N	f	system	2025-07-12 12:06:04.885939	2025-07-12 12:06:04.885939
22	First Test Template	Testing template refresh	{"type": "custom", "mediaId": 1, "elements": [{"x": 10, "y": 10, "id": "text1", "text": "Test Label", "type": "text", "fontSize": 14, "fontFamily": "Arial"}], "spacingX": 0, "spacingY": 0, "marginTop": 0, "paperSize": "A4", "labelWidth": 70, "marginLeft": 0, "labelHeight": 29.7, "orientation": "portrait", "verticalCount": 10, "horizontalCount": 3}	\N	\N	f	system	2025-07-12 12:06:55.182351	2025-07-12 12:06:55.182351
\.


--
-- Data for Name: loyalty_rewards; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.loyalty_rewards (id, name, description, points_required, reward_type, reward_value, applicable_products, applicable_categories, usage_limit, expiry_days, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: loyalty_transactions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.loyalty_transactions (id, customer_id, transaction_type, points, order_id, description, expires_at, created_at) FROM stdin;
\.


--
-- Data for Name: marketing_campaigns; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.marketing_campaigns (id, name, type, channel, subject, content, target_audience, start_date, end_date, budget, status, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: marketplace_listings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.marketplace_listings (id, product_id, marketplace, external_id, status, listing_data, sync_status, last_synced_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.notifications (id, user_id, title, message, type, channel, is_read, read_at, metadata, created_at) FROM stdin;
\.


--
-- Data for Name: nutrition_templates; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.nutrition_templates (id, category, required_fields, optional_fields, indian_fssai_compliance, created_at) FROM stdin;
1	fruits	["energy_kcal", "protein", "carbohydrates", "total_fat", "dietary_fiber", "total_sugars", "vitamin_c"]	["potassium", "folate", "calcium", "iron"]	t	2025-07-07 18:10:19.807686
2	vegetables	["energy_kcal", "protein", "carbohydrates", "total_fat", "dietary_fiber", "vitamin_a", "vitamin_c"]	["potassium", "iron", "calcium", "folate"]	t	2025-07-07 18:10:19.807686
3	pulses	["energy_kcal", "protein", "carbohydrates", "total_fat", "dietary_fiber", "iron", "folate"]	["calcium", "potassium", "zinc", "magnesium"]	t	2025-07-07 18:10:19.807686
4	grains	["energy_kcal", "protein", "carbohydrates", "total_fat", "dietary_fiber", "iron", "thiamine"]	["calcium", "potassium", "niacin", "riboflavin"]	t	2025-07-07 18:10:19.807686
5	dairy	["energy_kcal", "protein", "carbohydrates", "total_fat", "saturated_fat", "calcium", "vitamin_d"]	["vitamin_a", "vitamin_b12", "riboflavin", "phosphorus"]	t	2025-07-07 18:10:19.807686
6	prepared_foods	["energy_kcal", "protein", "carbohydrates", "total_fat", "saturated_fat", "trans_fat", "sodium", "total_sugars"]	["dietary_fiber", "vitamin_c", "calcium", "iron"]	t	2025-07-07 18:10:19.807686
7	snacks	["energy_kcal", "protein", "carbohydrates", "total_fat", "saturated_fat", "sodium", "total_sugars"]	["trans_fat", "dietary_fiber", "vitamin_c", "calcium"]	t	2025-07-07 18:10:19.807686
8	beverages	["energy_kcal", "total_sugars", "sodium"]	["protein", "carbohydrates", "vitamin_c", "calcium"]	t	2025-07-07 18:10:19.807686
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.order_items (id, order_id, product_id, quantity, unit_price, total_price, product_snapshot, created_at) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.orders (id, order_number, customer_id, branch_id, status, payment_status, shipping_status, subtotal, tax_amount, shipping_amount, discount_amount, total_amount, currency, billing_address, shipping_address, delivery_date, delivery_time_slot, order_notes, internal_notes, metadata, created_at, updated_at) FROM stdin;
1	ORD-2024-001	1	1	delivered	paid	delivered	1150.00	135.50	50.00	50.00	1285.50	INR	{"city": "Hyderabad", "phone": "+919876543230", "state": "Telangana", "street": "123 Gandhi Nagar", "pincode": "500001"}	{"city": "Hyderabad", "phone": "+919876543230", "state": "Telangana", "street": "123 Gandhi Nagar", "pincode": "500001"}	2024-12-20	morning	Customer requested early delivery	First time customer	{"source": "mobile_app", "promocode": "ORGANIC10"}	2025-06-27 17:28:39.818745	2025-06-27 17:28:39.818745
2	ORD-2024-002	2	1	processing	paid	preparing	795.00	100.75	25.00	25.00	895.75	INR	{"city": "Hyderabad", "phone": "+919876543231", "state": "Telangana", "street": "456 Jubilee Hills", "pincode": "500033"}	{"city": "Hyderabad", "phone": "+919876543231", "state": "Telangana", "street": "456 Jubilee Hills", "pincode": "500033"}	2024-12-28	evening	Organic vegetables order	Regular customer	{"device": "desktop", "source": "website"}	2025-06-27 17:28:39.818745	2025-06-27 17:28:39.818745
3	ORD-2024-003	3	2	shipped	paid	in_transit	1950.00	200.25	0.00	100.00	2150.25	INR	{"city": "Hyderabad", "phone": "+919876543232", "state": "Telangana", "street": "789 Kukatpally", "pincode": "500072"}	{"street": "Green Valley Store, Kukatpally"}	2024-12-29	pickup	Bulk order for family function	Store pickup order	{"source": "mobile_app", "bulk_order": true}	2025-06-27 17:28:39.818745	2025-06-27 17:28:39.818745
4	ORD-2024-004	4	3	confirmed	pending	pending	620.00	55.80	35.00	15.00	675.80	INR	{"city": "Hyderabad", "phone": "+919876543233", "state": "Telangana", "street": "789 Banjara Hills", "pincode": "500034"}	{"city": "Hyderabad", "phone": "+919876543233", "state": "Telangana", "street": "789 Banjara Hills", "pincode": "500034"}	2024-12-30	evening	Evening delivery preferred	COD order - verify payment	{"source": "website", "first_time_customer": true}	2025-06-27 17:28:39.818745	2025-06-27 17:28:39.818745
5	ORD-2024-005	5	1	delivered	paid	delivered	1320.00	136.90	40.00	75.00	1456.90	INR	{"city": "Secunderabad", "phone": "+919876543234", "state": "Telangana", "street": "321 Secunderabad", "pincode": "500003"}	{"city": "Secunderabad", "phone": "+919876543234", "state": "Telangana", "street": "321 Secunderabad", "pincode": "500003"}	2024-12-25	morning	Christmas special order	Festival delivery completed	{"source": "mobile_app", "festival_order": true}	2025-06-27 17:28:39.818745	2025-06-27 17:28:39.818745
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.payments (id, order_id, payment_method, payment_gateway, transaction_id, amount, currency, status, gateway_response, failure_reason, refund_amount, created_at, updated_at, branch_id) FROM stdin;
\.


--
-- Data for Name: performance_metrics; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.performance_metrics (id, metric_name, metric_value, metric_unit, branch_id, recorded_at, metadata) FROM stdin;
\.


--
-- Data for Name: price_history; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.price_history (id, product_id, old_price, new_price, change_reason, changed_by, effective_from, created_at) FROM stdin;
\.


--
-- Data for Name: product_answers; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.product_answers (id, question_id, user_id, answer, is_from_seller, helpful_count, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: product_attribute_values; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.product_attribute_values (id, product_id, attribute_id, value, created_at) FROM stdin;
\.


--
-- Data for Name: product_attributes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.product_attributes (id, name, type, is_required, is_filterable, sort_order, options, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: product_collection_items; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.product_collection_items (id, collection_id, product_id, sort_order, created_at) FROM stdin;
\.


--
-- Data for Name: product_collections; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.product_collections (id, name, slug, description, image, sort_order, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: product_questions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.product_questions (id, product_id, customer_id, question, is_answered, is_public, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: product_reviews; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.product_reviews (id, product_id, customer_id, order_id, rating, title, comment, images, is_verified_purchase, is_approved, helpful_count, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.products (id, name, name_telugu, slug, description, description_telugu, short_description, sku, barcode, category_id, selling_price, mrp, cost_price, unit, weight, dimensions, image_url, images, tags, attributes, nutritional_info, organic_certification, is_featured, is_digital, status, seo_title, seo_description, created_at, updated_at, brand_id, branch_id, has_nutrition_facts, nutrition_category, nutrition_data, nutrition_source, nutrition_updated_at) FROM stdin;
1	Organic Tomatoes	సేంద్రీయ టమాటలు	organic-tomatoes	Fresh organic tomatoes from local farms	స్థానిక వ్యవసాయ క్షేత్రాల నుండి తాజా సేంద్రీయ టమాటలు	\N	VEG001	\N	1	45.00	55.00	\N	kg	1.000	\N	\N	\N	\N	\N	\N	\N	t	f	active	\N	\N	2025-06-27 17:04:38.332508	2025-06-27 17:04:38.332508	1	1	f	\N	\N	\N	\N
2	Organic Onions	సేంద్రీయ ఉల్లిపాయలు	organic-onions	Premium quality organic onions	ప్రీమియం నాణ్యత సేంద్రీయ ఉల్లిపాయలు	\N	VEG002	\N	1	35.00	42.00	\N	kg	1.000	\N	\N	\N	\N	\N	\N	\N	t	f	active	\N	\N	2025-06-27 17:04:38.332508	2025-06-27 17:04:38.332508	1	1	f	\N	\N	\N	\N
3	Organic Potatoes	సేంద్రీయ బంగాళాదుంపలు	organic-potatoes	Organic potatoes from Andhra farms	ఆంధ్ర వ్యవసాయ క్షేత్రాల నుండి సేంద్రీయ బంగాళాదుంపలు	\N	VEG003	\N	1	32.00	38.00	\N	kg	1.000	\N	\N	\N	\N	\N	\N	\N	f	f	active	\N	\N	2025-06-27 17:04:38.332508	2025-06-27 17:04:38.332508	2	1	f	\N	\N	\N	\N
4	Organic Brinjal	సేంద్రీయ వంకాయ	organic-brinjal	Traditional Andhra brinjal variety	సంప్రదాయ ఆంధ్ర వంకాయ రకం	\N	VEG004	\N	1	38.00	45.00	\N	kg	1.000	\N	\N	\N	\N	\N	\N	\N	t	f	active	\N	\N	2025-06-27 17:04:38.332508	2025-06-27 17:04:38.332508	3	1	f	\N	\N	\N	\N
5	Organic Okra	సేంద్రీయ బెండకాయ	organic-okra	Fresh organic ladies finger	తాజా సేంద్రీయ బెండకాయలు	\N	VEG005	\N	1	42.00	48.00	\N	kg	0.500	\N	\N	\N	\N	\N	\N	\N	f	f	active	\N	\N	2025-06-27 17:04:38.332508	2025-06-27 17:04:38.332508	2	1	f	\N	\N	\N	\N
6	Organic Bananas	సేంద్రీయ అరటిపండ్లు	organic-bananas	Sweet organic bananas	తీపి సేంద్రీయ అరటిపండ్లు	\N	FRT001	\N	2	55.00	65.00	\N	dozen	1.500	\N	\N	\N	\N	\N	\N	\N	t	f	active	\N	\N	2025-06-27 17:04:38.332508	2025-06-27 17:04:38.332508	2	1	f	\N	\N	\N	\N
7	Organic Mangoes	సేంద్రీయ మామిడిపండ్లు	organic-mangoes	Seasonal Andhra mangoes	కాలానుగుణ ఆంధ్ర మామిడిపండ్లు	\N	FRT002	\N	2	120.00	140.00	\N	kg	1.000	\N	\N	\N	\N	\N	\N	\N	t	f	active	\N	\N	2025-06-27 17:04:38.332508	2025-06-27 17:04:38.332508	3	1	f	\N	\N	\N	\N
8	Organic Guava	సేంద్రీయ జామపండు	organic-guava	Fresh organic guava from local orchards	స్థానిక తోటల నుండి తాజా సేంద్రీయ జామపండు	\N	FRT003	\N	2	65.00	75.00	\N	kg	1.000	\N	\N	\N	\N	\N	\N	\N	f	f	active	\N	\N	2025-06-27 17:04:38.332508	2025-06-27 17:04:38.332508	1	1	f	\N	\N	\N	\N
9	Organic Rice (Sona Masoori)	సేంద్రీయ బియ్యం (సోన మసూరి)	organic-rice-sona-masoori	Premium Sona Masoori rice	ప్రీమియం సోన మసూరి బియ్యం	\N	GRN001	\N	3	85.00	95.00	\N	kg	1.000	\N	\N	\N	\N	\N	\N	\N	t	f	active	\N	\N	2025-06-27 17:04:38.332508	2025-06-27 17:04:38.332508	3	1	f	\N	\N	\N	\N
10	Organic Brown Rice	సేంద్రీయ గోధుమ వర్ణ బియ్యం	organic-brown-rice	Nutritious organic brown rice	పోషకాహార సేంద్రీయ గోధుమ వర్ణ బియ్యం	\N	GRN002	\N	3	95.00	110.00	\N	kg	1.000	\N	\N	\N	\N	\N	\N	\N	f	f	active	\N	\N	2025-06-27 17:04:38.332508	2025-06-27 17:04:38.332508	4	1	f	\N	\N	\N	\N
11	Organic Wheat Flour	సేంద్రీయ గోధుమ పిండి	organic-wheat-flour	Fresh milled organic wheat flour	తాజా రుబ్బిన సేంద్రీయ గోధుమ పిండి	\N	GRN003	\N	3	58.00	65.00	\N	kg	1.000	\N	\N	\N	\N	\N	\N	\N	t	f	active	\N	\N	2025-06-27 17:04:38.332508	2025-06-27 17:04:38.332508	5	1	f	\N	\N	\N	\N
12	Organic Toor Dal	సేంద్రీయ కందిపప్పు	organic-toor-dal	High quality organic toor dal	అధిక నాణ్యత సేంద్రీయ కందిపప్పు	\N	PUL001	\N	4	145.00	160.00	\N	kg	1.000	\N	\N	\N	\N	\N	\N	\N	f	f	active	\N	\N	2025-06-27 17:04:38.332508	2025-06-27 17:04:38.332508	4	1	f	\N	\N	\N	\N
13	Organic Moong Dal	సేంద్రీయ పెసలుపప్పు	organic-moong-dal	Premium organic moong dal	ప్రీమియం సేంద్రీయ పెసలుపప్పు	\N	PUL002	\N	4	135.00	150.00	\N	kg	1.000	\N	\N	\N	\N	\N	\N	\N	t	f	active	\N	\N	2025-06-27 17:04:38.332508	2025-06-27 17:04:38.332508	3	1	f	\N	\N	\N	\N
14	Organic Chana Dal	సేంద్రీయ శనగపప్పు	organic-chana-dal	Nutritious organic chana dal	పోషకాహార సేంద్రీయ శనగపప్పు	\N	PUL003	\N	4	125.00	140.00	\N	kg	1.000	\N	\N	\N	\N	\N	\N	\N	f	f	active	\N	\N	2025-06-27 17:04:38.332508	2025-06-27 17:04:38.332508	5	1	f	\N	\N	\N	\N
15	Organic Turmeric Powder	సేంద్రీయ పసుపు పొడి	organic-turmeric-powder	Pure organic turmeric powder	స్వచ్ఛమైన సేంద్రీయ పసుపు పొడి	\N	SPI001	\N	5	185.00	200.00	\N	kg	0.500	\N	\N	\N	\N	\N	\N	\N	t	f	active	\N	\N	2025-06-27 17:04:38.332508	2025-06-27 17:04:38.332508	5	1	f	\N	\N	\N	\N
16	Organic Red Chili Powder	సేంద్రీయ ఎర్రమిర్చి పొడి	organic-red-chili-powder	Authentic Andhra red chili powder	అసలైన ఆంధ్ర ఎర్రమిర్చి పొడి	\N	SPI002	\N	5	220.00	240.00	\N	kg	0.500	\N	\N	\N	\N	\N	\N	\N	f	f	active	\N	\N	2025-06-27 17:04:38.332508	2025-06-27 17:04:38.332508	5	1	f	\N	\N	\N	\N
17	Organic Coriander Powder	సేంద్రీయ ధనియాల పొడి	organic-coriander-powder	Fresh ground organic coriander	తాజా రుబ్బిన సేంద్రీయ ధనియాలు	\N	SPI003	\N	5	165.00	180.00	\N	kg	0.500	\N	\N	\N	\N	\N	\N	\N	t	f	active	\N	\N	2025-06-27 17:04:38.332508	2025-06-27 17:04:38.332508	4	1	f	\N	\N	\N	\N
18	Organic Coconut Oil	సేంద్రీయ కొబ్బరి నూనె	organic-coconut-oil	Cold-pressed coconut oil	చల్లని నొక్కిన కొబ్బరి నూనె	\N	OIL001	\N	7	285.00	320.00	\N	liter	1.000	\N	\N	\N	\N	\N	\N	\N	t	f	active	\N	\N	2025-06-27 17:04:38.332508	2025-06-27 17:04:38.332508	4	1	f	\N	\N	\N	\N
19	Organic Sesame Oil	సేంద్రీయ నువ్వుల నూనె	organic-sesame-oil	Traditional cold-pressed sesame oil	సంప్రదాయ చల్లని నొక్కిన నువ్వుల నూనె	\N	OIL002	\N	7	195.00	220.00	\N	liter	0.500	\N	\N	\N	\N	\N	\N	\N	f	f	active	\N	\N	2025-06-27 17:04:38.332508	2025-06-27 17:04:38.332508	3	1	f	\N	\N	\N	\N
20	Organic Pure Ghee	సేంద్రీయ స్వచ్ఛమైన నెయ్యి	organic-pure-ghee	Premium organic cow ghee	ప్రీమియం సేంద్రీయ ఆవు నెయ్యి	\N	OIL003	\N	7	485.00	520.00	\N	liter	1.000	\N	\N	\N	\N	\N	\N	\N	t	f	active	\N	\N	2025-06-27 17:04:38.332508	2025-06-27 17:04:38.332508	1	1	f	\N	\N	\N	\N
\.


--
-- Data for Name: promotion_usage; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.promotion_usage (id, promotion_id, customer_id, order_id, discount_amount, used_at) FROM stdin;
\.


--
-- Data for Name: promotions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.promotions (id, name, description, code, type, value, minimum_order_amount, maximum_discount, usage_limit, used_count, per_customer_limit, applicable_categories, applicable_products, start_date, end_date, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: purchase_order_items; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.purchase_order_items (id, purchase_order_id, product_id, quantity, unit_cost, total_cost, received_quantity, status, created_at) FROM stdin;
\.


--
-- Data for Name: purchase_orders; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.purchase_orders (id, po_number, supplier_id, branch_id, status, order_date, expected_delivery_date, actual_delivery_date, subtotal, tax_amount, total_amount, currency, terms_conditions, notes, created_by, approved_by, approved_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: queue_jobs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.queue_jobs (id, queue_name, job_type, payload, status, attempts, max_attempts, scheduled_at, started_at, completed_at, failed_at, error_message, created_at) FROM stdin;
\.


--
-- Data for Name: rate_limits; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.rate_limits (id, identifier, endpoint, requests_count, window_start, created_at) FROM stdin;
\.


--
-- Data for Name: restore_jobs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.restore_jobs (id, job_id, backup_job_id, status, target_database, restore_point, started_at, completed_at, error, metadata, created_by) FROM stdin;
\.


--
-- Data for Name: return_items; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.return_items (id, return_id, order_item_id, quantity, condition, created_at) FROM stdin;
\.


--
-- Data for Name: returns; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.returns (id, return_number, order_id, customer_id, reason, description, status, refund_amount, approved_by, approved_at, processed_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.roles (id, name, description, permissions, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sales_reports; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.sales_reports (id, report_date, branch_id, total_orders, total_revenue, total_items_sold, average_order_value, new_customers, returning_customers, created_at) FROM stdin;
\.


--
-- Data for Name: scheduled_tasks; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.scheduled_tasks (id, name, description, cron_expression, command, is_active, last_run_at, next_run_at, success_count, failure_count, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: search_queries; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.search_queries (id, query, customer_id, results_count, selected_product_id, ip_address, created_at) FROM stdin;
\.


--
-- Data for Name: seo_meta; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.seo_meta (id, entity_type, entity_id, meta_title, meta_description, meta_keywords, og_title, og_description, og_image, canonical_url, robots_meta, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.sessions (sid, sess, expire) FROM stdin;
\.


--
-- Data for Name: shipping_methods; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.shipping_methods (id, name, description, cost, estimated_delivery_days, weight_limit, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: social_media_posts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.social_media_posts (id, platform, post_id, content, media_urls, scheduled_at, published_at, engagement_metrics, status, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: states; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.states (id, country_id, code, name, is_active) FROM stdin;
\.


--
-- Data for Name: stock_alerts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.stock_alerts (id, product_id, branch_id, alert_type, threshold_value, current_value, is_resolved, resolved_at, created_at) FROM stdin;
\.


--
-- Data for Name: subscription_plans; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.subscription_plans (id, name, description, type, duration_days, price, features, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: suppliers; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.suppliers (id, name, code, contact_person, email, phone, address, city, state, country, postal_code, gst_number, payment_terms, credit_limit, rating, status, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: support_ticket_messages; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.support_ticket_messages (id, ticket_id, sender_id, message, attachments, is_internal, created_at) FROM stdin;
\.


--
-- Data for Name: support_tickets; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.support_tickets (id, ticket_number, customer_id, subject, description, priority, status, category, assigned_to, assigned_at, resolved_at, resolution_notes, satisfaction_rating, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: system_logs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.system_logs (id, level, message, context, service, trace_id, created_at) FROM stdin;
\.


--
-- Data for Name: system_settings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.system_settings (id, key, value, type, description, is_public, updated_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: tax_rates; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.tax_rates (id, name, rate, type, applicable_categories, effective_from, effective_to, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: traditional_items; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.traditional_items (id, name_english, name_telugu, category, unit, ordinary_price, medium_price, best_price, is_active, region, created_at, updated_at) FROM stdin;
1	Basmati Rice	బాస్మతి అన్నం	Rice & Grains	kg	120.00	150.00	180.00	t	All	2025-07-06 12:06:30.206721	2025-07-06 12:06:30.206721
2	Sona Masoori Rice	సోనా మసూరి అన్నం	Rice & Grains	kg	80.00	100.00	120.00	t	All	2025-07-06 12:06:30.206721	2025-07-06 12:06:30.206721
3	Red Rice	ఎర్ర అన్నం	Rice & Grains	kg	90.00	110.00	130.00	t	All	2025-07-06 12:06:30.206721	2025-07-06 12:06:30.206721
4	Toor Dal	కందిపప్పు	Pulses & Dal	kg	150.00	180.00	220.00	t	All	2025-07-06 12:06:30.206721	2025-07-06 12:06:30.206721
5	Moong Dal	పెసలు	Pulses & Dal	kg	140.00	170.00	200.00	t	All	2025-07-06 12:06:30.206721	2025-07-06 12:06:30.206721
6	Chana Dal	శనగపప్పు	Pulses & Dal	kg	130.00	160.00	190.00	t	All	2025-07-06 12:06:30.206721	2025-07-06 12:06:30.206721
7	Black Gram Dal	మినుములు	Pulses & Dal	kg	160.00	190.00	230.00	t	All	2025-07-06 12:06:30.206721	2025-07-06 12:06:30.206721
8	Turmeric Powder	పసుపు పొడి	Spices	kg	280.00	320.00	380.00	t	All	2025-07-06 12:06:30.206721	2025-07-06 12:06:30.206721
9	Red Chili Powder	ఎర్రమిర్చి పొడి	Spices	kg	300.00	350.00	420.00	t	All	2025-07-06 12:06:30.206721	2025-07-06 12:06:30.206721
10	Coriander Powder	ధనియాల పొడి	Spices	kg	250.00	290.00	340.00	t	All	2025-07-06 12:06:30.206721	2025-07-06 12:06:30.206721
11	Cumin Powder	జీలకర్ర పొడి	Spices	kg	450.00	520.00	600.00	t	All	2025-07-06 12:06:30.206721	2025-07-06 12:06:30.206721
12	Garam Masala	గరం మసాలా	Spices	kg	380.00	450.00	520.00	t	All	2025-07-06 12:06:30.206721	2025-07-06 12:06:30.206721
13	Coconut Oil	కొబ్బరి నూనె	Oils	litre	180.00	220.00	280.00	t	All	2025-07-06 12:06:30.206721	2025-07-06 12:06:30.206721
14	Sesame Oil	నువ్వుల నూనె	Oils	litre	320.00	380.00	450.00	t	All	2025-07-06 12:06:30.206721	2025-07-06 12:06:30.206721
15	Groundnut Oil	వేరుశనగ నూనె	Oils	litre	150.00	180.00	220.00	t	All	2025-07-06 12:06:30.206721	2025-07-06 12:06:30.206721
16	Sunflower Oil	సూర్యకాంతి నూనె	Oils	litre	140.00	170.00	200.00	t	All	2025-07-06 12:06:30.206721	2025-07-06 12:06:30.206721
17	Jaggery	బెల్లం	Sweeteners	kg	80.00	100.00	120.00	t	All	2025-07-06 12:06:30.206721	2025-07-06 12:06:30.206721
18	Rock Salt	సెంధా నమక్	Salt & Seasonings	kg	60.00	80.00	100.00	t	All	2025-07-06 12:06:30.206721	2025-07-06 12:06:30.206721
19	Black Mustard Seeds	నల్ల ఆవాలు	Spices	kg	200.00	240.00	280.00	t	All	2025-07-06 12:06:30.206721	2025-07-06 12:06:30.206721
20	Fenugreek Seeds	మెంతులు	Spices	kg	180.00	220.00	260.00	t	All	2025-07-06 12:06:30.206721	2025-07-06 12:06:30.206721
\.


--
-- Data for Name: traditional_order_items; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.traditional_order_items (id, order_id, item_id, quantity, unit_price, total_price, created_at) FROM stdin;
\.


--
-- Data for Name: traditional_orders; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.traditional_orders (id, customer_id, order_type, quality_tier, total_amount, selected_vendor_id, delivery_address, order_status, order_date, delivery_date, notes, created_at, updated_at, branch_id) FROM stdin;
\.


--
-- Data for Name: translations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.translations (id, language_code, namespace, key, value, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.user_roles (id, user_id, role_id, assigned_by, assigned_at, expires_at, is_active) FROM stdin;
\.


--
-- Data for Name: user_sessions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.user_sessions (id, user_id, branch_id, session_token, refresh_token, expires_at, ip_address, user_agent, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, email, first_name, last_name, profile_image_url, name, role, status, assigned_app, department, phone, is_active, email_verified, last_login, preferred_branch_id, current_branch_id, last_known_latitude, last_known_longitude, created_at, updated_at, metadata, password_hash) FROM stdin;
admin001	admin@srivenkateswara.com	Rajesh	Kumar	\N	Rajesh Kumar	admin	active	\N	\N	+919876543210	t	t	\N	1	1	\N	\N	2025-06-27 17:25:05.801604	2025-06-27 17:25:05.801604	\N	\N
admin002	admin@greenvalley.com	Priya	Sharma	\N	Priya Sharma	admin	active	\N	\N	+919876543211	t	t	\N	2	2	\N	\N	2025-06-27 17:25:05.801604	2025-06-27 17:25:05.801604	\N	\N
mgr001	manager.hyd@srivenkateswara.com	Venkat	Reddy	\N	Venkat Reddy	manager	active	\N	\N	+919876543212	t	t	\N	1	1	\N	\N	2025-06-27 17:25:05.801604	2025-06-27 17:25:05.801604	\N	\N
mgr002	manager.vij@srivenkateswara.com	Lakshmi	Devi	\N	Lakshmi Devi	manager	active	\N	\N	+919876543213	t	t	\N	3	3	\N	\N	2025-06-27 17:25:05.801604	2025-06-27 17:25:05.801604	\N	\N
staff001	staff1.hyd@srivenkateswara.com	Ravi	Teja	\N	Ravi Teja	staff	active	\N	\N	+919876543214	t	t	\N	1	1	\N	\N	2025-06-27 17:25:05.801604	2025-06-27 17:25:05.801604	\N	\N
staff002	staff1.vsk@srivenkateswara.com	Anjali	Rao	\N	Anjali Rao	staff	active	\N	\N	+919876543215	t	t	\N	4	4	\N	\N	2025-06-27 17:25:05.801604	2025-06-27 17:25:05.801604	\N	\N
delivery001	delivery1.hyd@srivenkateswara.com	Krishna	Murthy	\N	Krishna Murthy	delivery	active	\N	\N	+919876543216	t	t	\N	1	1	\N	\N	2025-06-27 17:25:05.801604	2025-06-27 17:25:05.801604	\N	\N
delivery002	delivery1.vij@srivenkateswara.com	Sita	Mahalakshmi	\N	Sita Mahalakshmi	delivery	active	\N	\N	+919876543217	t	t	\N	3	3	\N	\N	2025-06-27 17:25:05.801604	2025-06-27 17:25:05.801604	\N	\N
superadmin	superadmin@leafyhealth.com	Srinivas	Acharya	\N	Srinivas Acharya	super_admin	active	\N	\N	+919876543218	t	t	\N	1	1	\N	\N	2025-06-27 17:25:05.801604	2025-06-27 17:25:05.801604	\N	\N
customer001	customer1@gmail.com	Ramesh	Babu	\N	Ramesh Babu	customer	active	\N	\N	+919876543219	t	t	\N	1	1	\N	\N	2025-06-27 17:25:05.801604	2025-06-27 17:25:05.801604	\N	\N
support001	support1@srivenkateswara.com	Anita	Rao	\N	Anita Rao	support	active	admin-portal	Customer Service	+919876543220	t	t	\N	1	1	\N	\N	2024-12-27 17:43:51.739109	2024-12-27 17:43:51.739109	\N	\N
support002	support2@srivenkateswara.com	Kiran	Sharma	\N	Kiran Sharma	support	active	admin-portal	Customer Service	+919876543221	t	t	\N	2	2	\N	\N	2025-02-27 17:43:51.739109	2025-02-27 17:43:51.739109	\N	\N
support003	support3@srivenkateswara.com	Preethi	Nair	\N	Preethi Nair	support	active	admin-portal	Customer Service	+919876543222	t	t	\N	3	3	\N	\N	2025-03-27 17:43:51.739109	2025-03-27 17:43:51.739109	\N	\N
marketing001	marketing1@srivenkateswara.com	Rajesh	Kumar	\N	Rajesh Kumar	marketing	active	admin-portal	Marketing	+919876543223	t	t	\N	1	1	\N	\N	2024-10-27 17:43:51.739109	2024-10-27 17:43:51.739109	\N	\N
marketing002	marketing2@srivenkateswara.com	Sneha	Patel	\N	Sneha Patel	marketing	active	admin-portal	Marketing	+919876543224	t	t	\N	2	2	\N	\N	2024-11-27 17:43:51.739109	2024-11-27 17:43:51.739109	\N	\N
customer002	priya.sharma@gmail.com	Priya	Sharma	\N	Priya Sharma	customer	active	ecommerce-web	Customer	+919876543211	t	t	\N	1	1	\N	\N	2025-04-27 17:50:51.43747	2025-04-27 17:50:51.43747	\N	\N
customer003	suresh.reddy@gmail.com	Suresh	Reddy	\N	Suresh Reddy	customer	active	ecommerce-mobile	Customer	+919876543212	t	t	\N	2	2	\N	\N	2025-05-27 17:50:51.43747	2025-05-27 17:50:51.43747	\N	\N
customer004	lakshmi.devi@gmail.com	Lakshmi	Devi	\N	Lakshmi Devi	customer	active	ecommerce-web	Customer	+919876543213	t	t	\N	3	3	\N	\N	2025-06-06 17:50:51.43747	2025-06-06 17:50:51.43747	\N	\N
mgr003	manager3@srivenkateswara.com	Raj	Patel	\N	Raj Patel	manager	active	admin-portal	Management	+919876543217	t	t	\N	3	3	\N	\N	2024-10-27 17:50:51.43747	2024-10-27 17:50:51.43747	\N	\N
customer-1751700072363	customer@leafyhealth.com	Test	\N	\N	Test Customer	customer	active	\N	\N	\N	t	t	\N	\N	\N	\N	\N	2025-07-05 07:21:13.920537	2025-07-05 07:21:13.920537	\N	$2b$12$45/Wxwk18yUh/6fMTD3jIevEJyV55OkasGAOBIl2aGQ9H7Ws/QxGe
global001	global.admin@leafyhealth.com	Global	Administrator	\N	Global Administrator	super_admin	active	super-admin	Administration	\N	t	t	\N	1	1	\N	\N	2025-06-28 15:52:13.06345	2025-06-28 15:52:13.06345	\N	securepassword123
ops001	ops.admin@leafyhealth.com	Operations	Administrator	\N	Operations Administrator	super_admin	active	super-admin	Operations	\N	t	t	\N	1	1	\N	\N	2025-06-28 15:52:13.06345	2025-06-28 15:52:13.06345	\N	securepassword123
global-admin-001	global.admin@leafyhealth.com	Global	Admin	\N	Global Admin	global_admin	active	\N	\N	\N	t	t	\N	\N	\N	\N	\N	2025-07-08 10:10:36.947901	2025-07-08 10:10:36.947901	\N	$2b$12$rOzV8P6P6Y1UKwHNjnDxMOGr5lQKd3aH8Q1lQKd3aH8Q1lQKd3aH
\.


--
-- Data for Name: vendors; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.vendors (id, name, vendor_type, contact_person, phone, email, address, gst_number, pan_number, bank_details, payment_terms, credit_limit, current_balance, is_active, rating, notes, created_at, updated_at, branch_id) FROM stdin;
\.


--
-- Data for Name: webhook_deliveries; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.webhook_deliveries (id, webhook_id, event_type, payload, response_status, response_body, delivered_at, retry_count) FROM stdin;
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

COPY public.wishlists (id, customer_id, name, is_public, created_at, updated_at) FROM stdin;
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
-- Name: branch_contexts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.branch_contexts_id_seq', 1, false);


--
-- Name: branch_traditional_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.branch_traditional_items_id_seq', 1, false);


--
-- Name: branches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.branches_id_seq', 1, false);


--
-- Name: brands_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.brands_id_seq', 1, false);


--
-- Name: cache_entries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.cache_entries_id_seq', 1, false);


--
-- Name: campaign_recipients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.campaign_recipients_id_seq', 1, false);


--
-- Name: cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.cart_items_id_seq', 1, false);


--
-- Name: carts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.carts_id_seq', 1, false);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.categories_id_seq', 1, false);


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

SELECT pg_catalog.setval('public.companies_id_seq', 1, false);


--
-- Name: compliance_checks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.compliance_checks_id_seq', 1, false);


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

SELECT pg_catalog.setval('public.custom_template_dimensions_id_seq', 1, false);


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

SELECT pg_catalog.setval('public.customers_id_seq', 1, false);


--
-- Name: data_privacy_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.data_privacy_requests_id_seq', 1, false);


--
-- Name: delivery_assignments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.delivery_assignments_id_seq', 1, false);


--
-- Name: delivery_schedules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.delivery_schedules_id_seq', 1, false);


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
-- Name: health_checks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.health_checks_id_seq', 1, false);


--
-- Name: image_uploads_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.image_uploads_id_seq', 1, false);


--
-- Name: integrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.integrations_id_seq', 1, false);


--
-- Name: inventory_adjustments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.inventory_adjustments_id_seq', 1, false);


--
-- Name: inventory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.inventory_id_seq', 1, false);


--
-- Name: inventory_transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.inventory_transactions_id_seq', 1, false);


--
-- Name: label_media_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.label_media_types_id_seq', 14, true);


--
-- Name: label_templates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.label_templates_id_seq', 23, true);


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
-- Name: marketplace_listings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.marketplace_listings_id_seq', 1, false);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);


--
-- Name: nutrition_templates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.nutrition_templates_id_seq', 8, true);


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
-- Name: price_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.price_history_id_seq', 1, false);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.products_id_seq', 1, false);


--
-- Name: traditional_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.traditional_items_id_seq', 20, true);


--
-- Name: label_media_types label_media_types_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.label_media_types
    ADD CONSTRAINT label_media_types_pkey PRIMARY KEY (id);


--
-- Name: nutrition_templates nutrition_templates_category_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.nutrition_templates
    ADD CONSTRAINT nutrition_templates_category_key UNIQUE (category);


--
-- Name: nutrition_templates nutrition_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.nutrition_templates
    ADD CONSTRAINT nutrition_templates_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


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

