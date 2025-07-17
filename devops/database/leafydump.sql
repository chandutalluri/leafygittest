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
    customer_id integer,
    variant character varying(50) NOT NULL,
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
    test_name character varying(255) NOT NULL,
    description text,
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone,
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
    action character varying(100) NOT NULL,
    resource_type character varying(50),
    resource_id integer,
    details jsonb,
    ip_address inet,
    user_agent text,
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
    event_type character varying(50) NOT NULL,
    event_data jsonb,
    user_id integer,
    session_id character varying(100),
    ip_address inet,
    user_agent text,
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
    user_id integer,
    key_name character varying(255) NOT NULL,
    api_key character varying(255) NOT NULL,
    permissions jsonb,
    is_active boolean DEFAULT true,
    expires_at timestamp without time zone,
    last_used_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
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
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.audit_logs (
    id integer NOT NULL,
    user_id integer,
    action character varying(100) NOT NULL,
    table_name character varying(100),
    record_id integer,
    old_data jsonb,
    new_data jsonb,
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
-- Name: backup_schedules; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.backup_schedules (
    id integer NOT NULL,
    schedule_name character varying(255) NOT NULL,
    frequency character varying(50) NOT NULL,
    last_run timestamp without time zone,
    next_run timestamp without time zone,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
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
-- Name: branches; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.branches (
    id integer NOT NULL,
    company_id integer,
    name character varying(255) NOT NULL,
    name_telugu character varying(255),
    code character varying(10),
    city character varying(100) NOT NULL,
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
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
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
-- Name: categories; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    name_telugu character varying(255),
    description text,
    parent_id integer,
    slug character varying(255),
    image_url character varying(500),
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
    logo_url character varying(500),
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
-- Name: customer_addresses; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.customer_addresses (
    id integer NOT NULL,
    customer_id integer,
    address_type character varying(20) DEFAULT 'home'::character varying,
    street_address text NOT NULL,
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
    subscription_plan_id integer,
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone NOT NULL,
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
    customer_code character varying(20),
    first_name character varying(255) NOT NULL,
    last_name character varying(255),
    email character varying(255),
    phone character varying(20) NOT NULL,
    alternate_phone character varying(20),
    date_of_birth date,
    gender character varying(10),
    branch_id integer,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
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
    delivery_personnel_id integer,
    pickup_time timestamp without time zone,
    delivery_time timestamp without time zone,
    status character varying(50) DEFAULT 'assigned'::character varying,
    tracking_number character varying(50),
    delivery_notes text,
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
-- Name: delivery_personnel; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.delivery_personnel (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    phone character varying(20) NOT NULL,
    email character varying(255),
    vehicle_number character varying(20),
    vehicle_type character varying(50),
    branch_id integer,
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
-- Name: expense_categories; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.expense_categories (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
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
    branch_id integer,
    category_id integer,
    amount numeric(10,2) NOT NULL,
    description text,
    expense_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    receipt_url character varying(500),
    approved_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
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
-- Name: inventory; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.inventory (
    id integer NOT NULL,
    product_id integer,
    branch_id integer,
    current_stock integer DEFAULT 0 NOT NULL,
    reserved_stock integer DEFAULT 0,
    min_stock_level integer DEFAULT 0,
    max_stock_level integer DEFAULT 100,
    reorder_point integer DEFAULT 10,
    last_updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.inventory OWNER TO neondb_owner;

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
-- Name: invoices; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.invoices (
    id integer NOT NULL,
    order_id integer,
    invoice_number character varying(50) NOT NULL,
    invoice_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    due_date timestamp without time zone,
    total_amount numeric(10,2) NOT NULL,
    tax_amount numeric(10,2) DEFAULT 0,
    status character varying(50) DEFAULT 'draft'::character varying,
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
    description text,
    template_id integer,
    media_type_id integer,
    design_data jsonb,
    preview_image_url character varying(500),
    created_by integer,
    branch_id integer,
    is_active boolean DEFAULT true,
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
    description text,
    width_mm numeric(10,2),
    height_mm numeric(10,2),
    avery_code character varying(50),
    media_type character varying(50) DEFAULT 'sheet'::character varying,
    is_roll boolean DEFAULT false,
    is_sheet boolean DEFAULT true,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
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
    category character varying(100),
    template_data jsonb,
    preview_image_url character varying(500),
    is_active boolean DEFAULT true,
    created_by integer,
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
    order_id integer,
    points_earned integer DEFAULT 0,
    points_redeemed integer DEFAULT 0,
    balance integer DEFAULT 0,
    transaction_type character varying(50) NOT NULL,
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
-- Name: marketing_campaigns; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.marketing_campaigns (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    campaign_type character varying(50) NOT NULL,
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone,
    budget numeric(10,2),
    target_audience jsonb,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
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
    email_enabled boolean DEFAULT true,
    sms_enabled boolean DEFAULT false,
    push_enabled boolean DEFAULT true,
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
    message text NOT NULL,
    type character varying(50) DEFAULT 'info'::character varying,
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
-- Name: order_items; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer,
    product_id integer,
    quantity integer NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    discount_amount numeric(10,2) DEFAULT 0,
    tax_amount numeric(10,2) DEFAULT 0,
    total_price numeric(10,2) NOT NULL,
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
    order_number character varying(50) NOT NULL,
    customer_id integer,
    branch_id integer,
    delivery_address_id integer,
    order_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    delivery_date timestamp without time zone,
    total_amount numeric(10,2) NOT NULL,
    discount_amount numeric(10,2) DEFAULT 0,
    tax_amount numeric(10,2) DEFAULT 0,
    delivery_charge numeric(10,2) DEFAULT 0,
    final_amount numeric(10,2) NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying,
    payment_status character varying(50) DEFAULT 'pending'::character varying,
    payment_method character varying(50),
    notes text,
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
    status character varying(50) DEFAULT 'pending'::character varying,
    transaction_id character varying(100),
    gateway_response jsonb,
    payment_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
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
-- Name: product_labels; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.product_labels (
    id integer NOT NULL,
    product_id integer,
    label_design_id integer,
    label_data jsonb,
    print_count integer DEFAULT 0,
    last_printed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
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
-- Name: product_reviews; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.product_reviews (
    id integer NOT NULL,
    product_id integer,
    customer_id integer,
    rating integer,
    review_title character varying(255),
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
    supplier_id integer,
    sku character varying(100),
    barcode character varying(50),
    qr_code character varying(200),
    price numeric(10,2) NOT NULL,
    mrp numeric(10,2),
    cost_price numeric(10,2),
    weight numeric(10,2),
    weight_unit character varying(10) DEFAULT 'grams'::character varying,
    stock_quantity integer DEFAULT 0,
    min_stock_level integer DEFAULT 0,
    max_stock_level integer DEFAULT 100,
    is_organic boolean DEFAULT true,
    is_active boolean DEFAULT true,
    tax_rate numeric(5,2) DEFAULT 0,
    nutrition_facts jsonb,
    images jsonb,
    tags text[],
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
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
    discount_amount numeric(10,2) NOT NULL,
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
    discount_type character varying(20) NOT NULL,
    discount_value numeric(10,2) NOT NULL,
    min_order_amount numeric(10,2) DEFAULT 0,
    max_discount_amount numeric(10,2),
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone NOT NULL,
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
    purchase_order_id integer,
    product_id integer,
    quantity integer NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    total_price numeric(10,2) NOT NULL,
    received_quantity integer DEFAULT 0,
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
    po_number character varying(50) NOT NULL,
    supplier_id integer,
    branch_id integer,
    total_amount numeric(10,2) NOT NULL,
    status character varying(50) DEFAULT 'draft'::character varying,
    order_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    expected_delivery_date timestamp without time zone,
    created_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
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
-- Name: reports; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.reports (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    report_type character varying(50) NOT NULL,
    parameters jsonb,
    generated_by integer,
    file_path character varying(500),
    generated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
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
-- Name: sales_reports; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.sales_reports (
    id integer NOT NULL,
    branch_id integer,
    report_date date NOT NULL,
    total_sales numeric(10,2) DEFAULT 0,
    total_orders integer DEFAULT 0,
    total_customers integer DEFAULT 0,
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
-- Name: stock_movements; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.stock_movements (
    id integer NOT NULL,
    product_id integer,
    branch_id integer,
    movement_type character varying(20) NOT NULL,
    quantity integer NOT NULL,
    reference_type character varying(50),
    reference_id integer,
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
    gstin character varying(20),
    organic_certified boolean DEFAULT false,
    certification_number character varying(100),
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
-- Name: system_settings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.system_settings (
    id integer NOT NULL,
    setting_key character varying(100) NOT NULL,
    setting_value text,
    description text,
    is_active boolean DEFAULT true,
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
    role character varying(50) DEFAULT 'customer'::character varying,
    branch_id integer,
    profile_image character varying(500),
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
-- Name: wishlists; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.wishlists (
    id integer NOT NULL,
    customer_id integer,
    product_id integer,
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
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- Name: backup_schedules id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.backup_schedules ALTER COLUMN id SET DEFAULT nextval('public.backup_schedules_id_seq'::regclass);


--
-- Name: branches id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.branches ALTER COLUMN id SET DEFAULT nextval('public.branches_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: companies id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.companies ALTER COLUMN id SET DEFAULT nextval('public.companies_id_seq'::regclass);


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
-- Name: delivery_personnel id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.delivery_personnel ALTER COLUMN id SET DEFAULT nextval('public.delivery_personnel_id_seq'::regclass);


--
-- Name: expense_categories id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.expense_categories ALTER COLUMN id SET DEFAULT nextval('public.expense_categories_id_seq'::regclass);


--
-- Name: expenses id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.expenses ALTER COLUMN id SET DEFAULT nextval('public.expenses_id_seq'::regclass);


--
-- Name: inventory id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory ALTER COLUMN id SET DEFAULT nextval('public.inventory_id_seq'::regclass);


--
-- Name: inventory_alerts id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory_alerts ALTER COLUMN id SET DEFAULT nextval('public.inventory_alerts_id_seq'::regclass);


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
-- Name: product_labels id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_labels ALTER COLUMN id SET DEFAULT nextval('public.product_labels_id_seq'::regclass);


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
-- Name: reports id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.reports ALTER COLUMN id SET DEFAULT nextval('public.reports_id_seq'::regclass);


--
-- Name: sales_reports id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sales_reports ALTER COLUMN id SET DEFAULT nextval('public.sales_reports_id_seq'::regclass);


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
-- Name: system_settings id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.system_settings ALTER COLUMN id SET DEFAULT nextval('public.system_settings_id_seq'::regclass);


--
-- Name: tax_rates id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tax_rates ALTER COLUMN id SET DEFAULT nextval('public.tax_rates_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: wishlists id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.wishlists ALTER COLUMN id SET DEFAULT nextval('public.wishlists_id_seq'::regclass);


--
-- Data for Name: ab_test_assignments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.ab_test_assignments (id, test_id, customer_id, variant, assigned_at) FROM stdin;
\.


--
-- Data for Name: ab_tests; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.ab_tests (id, test_name, description, start_date, end_date, is_active, created_at) FROM stdin;
\.


--
-- Data for Name: activity_logs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.activity_logs (id, user_id, action, resource_type, resource_id, details, ip_address, user_agent, created_at) FROM stdin;
\.


--
-- Data for Name: analytics_events; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.analytics_events (id, event_type, event_data, user_id, session_id, ip_address, user_agent, created_at) FROM stdin;
\.


--
-- Data for Name: api_keys; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.api_keys (id, user_id, key_name, api_key, permissions, is_active, expires_at, last_used_at, created_at) FROM stdin;
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.audit_logs (id, user_id, action, table_name, record_id, old_data, new_data, ip_address, user_agent, created_at) FROM stdin;
\.


--
-- Data for Name: backup_schedules; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.backup_schedules (id, schedule_name, frequency, last_run, next_run, is_active, created_at) FROM stdin;
\.


--
-- Data for Name: branches; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.branches (id, company_id, name, name_telugu, code, city, state, address, phone, email, manager_name, manager_phone, latitude, longitude, is_active, created_at, updated_at) FROM stdin;
1	1	LeafyHealth Hyderabad Central	లీఫీ హెల్త్ హైదరాబాద్ సెంట్రల్	HYD001	Hyderabad	Telangana	Banjara Hills, Road No 12, Hyderabad	+91-9876543210	hyderabad@leafyhealth.com	రమేష్ కుమార్	+91-9876543215	\N	\N	t	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
2	1	LeafyHealth Secunderabad	లీఫీ హెల్త్ సికింద్రాబాద్	SEC001	Secunderabad	Telangana	Paradise Circle, Secunderabad	+91-9876543216	secunderabad@leafyhealth.com	ప్రియా శర్మ	+91-9876543217	\N	\N	t	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
3	2	LeafyHealth Vijayawada Main	లీఫీ హెల్త్ విజయవాడ మెయిన్	VJA001	Vijayawada	Andhra Pradesh	MG Road, Vijayawada	+91-9876543211	vijayawada@leafyhealth.com	సురేష్ రెడ్డి	+91-9876543218	\N	\N	t	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
4	2	LeafyHealth Bezawada	లీఫీ హెల్త్ బెజవాడ	BEZ001	Vijayawada	Andhra Pradesh	Governorpet, Vijayawada	+91-9876543219	bezawada@leafyhealth.com	లక్ష్మీ దేవి	+91-9876543220	\N	\N	t	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
5	3	LeafyHealth Visakhapatnam Beach	లీఫీ హెల్త్ విశాఖపట్నం బీచ్	VZG001	Visakhapatnam	Andhra Pradesh	Beach Road, Visakhapatnam	+91-9876543212	visakhapatnam@leafyhealth.com	వెంకట్ రావు	+91-9876543221	\N	\N	t	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
6	4	LeafyHealth Warangal Central	లీఫీ హెల్త్ వరంగల్ సెంట్రల్	WGL001	Warangal	Telangana	Hanamkonda Main Road, Warangal	+91-9876543213	warangal@leafyhealth.com	శాంతి కుమారి	+91-9876543222	\N	\N	t	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.categories (id, name, name_telugu, description, parent_id, slug, image_url, sort_order, is_active, created_at, updated_at) FROM stdin;
1	Organic Vegetables	సేంద్రియ కూరగాయలు	Fresh organic vegetables grown without pesticides	\N	organic-vegetables	\N	1	t	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
2	Organic Fruits	సేంద్రియ పండ్లు	Naturally ripened organic fruits from Telugu regions	\N	organic-fruits	\N	2	t	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
3	Organic Grains	సేంద్రియ ధాన్యాలు	Traditional organic grains and cereals	\N	organic-grains	\N	3	t	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
4	Organic Spices	సేంద్రియ మసాలాలు	Pure organic spices and seasonings	\N	organic-spices	\N	4	t	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
5	Organic Pulses	సేంద్రియ పప్పులు	Protein-rich organic pulses and legumes	\N	organic-pulses	\N	5	t	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
6	Organic Dairy	సేంద్రియ పాల ఉత్పత్తులు	Fresh organic dairy products	\N	organic-dairy	\N	6	t	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
7	Organic Oils	సేంద్రియ నూనెలు	Cold-pressed organic cooking oils	\N	organic-oils	\N	7	t	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
8	Traditional Sweets	సాంప్రదాయ తీపులు	Authentic Telugu sweets made with organic ingredients	\N	traditional-sweets	\N	8	t	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
\.


--
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.companies (id, name, name_telugu, description, address, phone, email, website, logo_url, is_active, created_at, updated_at) FROM stdin;
1	LeafyHealth Hyderabad	లీఫీ హెల్త్ హైదరాబాద్	Premium organic grocery store chain specializing in fresh Telugu region produce	Banjara Hills, Road No 12, Hyderabad, Telangana 500034	+91-9876543210	hyderabad@leafyhealth.com	https://leafyhealth.com/hyderabad	\N	t	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
2	LeafyHealth Vijayawada	లీఫీ హెల్త్ విజయవాడ	Authentic organic grocery supplier serving Andhra Pradesh	MG Road, Vijayawada, Andhra Pradesh 520010	+91-9876543211	vijayawada@leafyhealth.com	https://leafyhealth.com/vijayawada	\N	t	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
3	LeafyHealth Visakhapatnam	లీఫీ హెల్త్ విశాఖపట్నం	Coastal organic grocery chain with fresh daily deliveries	Beach Road, Visakhapatnam, Andhra Pradesh 530001	+91-9876543212	visakhapatnam@leafyhealth.com	https://leafyhealth.com/visakhapatnam	\N	t	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
4	LeafyHealth Warangal	లీఫీ హెల్త్ వరంగల్	Traditional organic grocery store serving North Telangana	Hanamkonda, Warangal, Telangana 506001	+91-9876543213	warangal@leafyhealth.com	https://leafyhealth.com/warangal	\N	t	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
5	LeafyHealth Tirupati	లీఫీ హెల్త్ తిరుపతి	Sacred city organic grocery with temple-quality produce	Tirumala Road, Tirupati, Andhra Pradesh 517501	+91-9876543214	tirupati@leafyhealth.com	https://leafyhealth.com/tirupati	\N	t	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
\.


--
-- Data for Name: customer_addresses; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.customer_addresses (id, customer_id, address_type, street_address, city, state, pincode, landmark, is_default, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: customer_subscriptions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.customer_subscriptions (id, customer_id, subscription_plan_id, start_date, end_date, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.customers (id, customer_code, first_name, last_name, email, phone, alternate_phone, date_of_birth, gender, branch_id, is_active, created_at, updated_at) FROM stdin;
1	CUST001	రామ	కుమార్	rama.kumar@gmail.com	+91-9876543400	\N	\N	\N	1	t	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
2	CUST002	సీత	దేవి	sitha.devi@gmail.com	+91-9876543401	\N	\N	\N	1	t	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
3	CUST003	కృష్ణ	రెడ్డి	krishna.reddy@gmail.com	+91-9876543402	\N	\N	\N	2	t	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
4	CUST004	లక్ష్మీ	ప్రసాద్	lakshmi.prasad@gmail.com	+91-9876543403	\N	\N	\N	3	t	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
5	CUST005	వెంకట్	రావు	venkat.rao@gmail.com	+91-9876543404	\N	\N	\N	1	t	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
\.


--
-- Data for Name: deliveries; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.deliveries (id, order_id, delivery_personnel_id, pickup_time, delivery_time, status, tracking_number, delivery_notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: delivery_personnel; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.delivery_personnel (id, name, phone, email, vehicle_number, vehicle_type, branch_id, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: expense_categories; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.expense_categories (id, name, description, is_active, created_at) FROM stdin;
\.


--
-- Data for Name: expenses; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.expenses (id, branch_id, category_id, amount, description, expense_date, receipt_url, approved_by, created_at) FROM stdin;
\.


--
-- Data for Name: inventory; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.inventory (id, product_id, branch_id, current_stock, reserved_stock, min_stock_level, max_stock_level, reorder_point, last_updated_at, created_at) FROM stdin;
1	1	1	100	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
2	1	2	100	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
3	1	3	100	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
4	1	4	100	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
5	1	5	100	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
6	1	6	100	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
7	2	1	200	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
8	2	2	200	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
9	2	3	200	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
10	2	4	200	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
11	2	5	200	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
12	2	6	200	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
13	3	1	150	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
14	3	2	150	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
15	3	3	150	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
16	3	4	150	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
17	3	5	150	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
18	3	6	150	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
19	4	1	80	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
20	4	2	80	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
21	4	3	80	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
22	4	4	80	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
23	4	5	80	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
24	4	6	80	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
25	5	1	60	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
26	5	2	60	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
27	5	3	60	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
28	5	4	60	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
29	5	5	60	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
30	5	6	60	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
31	6	1	50	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
32	6	2	50	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
33	6	3	50	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
34	6	4	50	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
35	6	5	50	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
36	6	6	50	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
37	7	1	40	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
38	7	2	40	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
39	7	3	40	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
40	7	4	40	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
41	7	5	40	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
42	7	6	40	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
43	8	1	45	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
44	8	2	45	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
45	8	3	45	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
46	8	4	45	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
47	8	5	45	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
48	8	6	45	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
49	9	1	120	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
50	9	2	120	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
51	9	3	120	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
52	9	4	120	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
53	9	5	120	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
54	9	6	120	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
55	10	1	50	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
56	10	2	50	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
57	10	3	50	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
58	10	4	50	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
59	10	5	50	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
60	10	6	50	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
61	11	1	70	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
62	11	2	70	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
63	11	3	70	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
64	11	4	70	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
65	11	5	70	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
66	11	6	70	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
67	12	1	40	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
68	12	2	40	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
69	12	3	40	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
70	12	4	40	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
71	12	5	40	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
72	12	6	40	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
73	13	1	60	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
74	13	2	60	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
75	13	3	60	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
76	13	4	60	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
77	13	5	60	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
78	13	6	60	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
79	14	1	300	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
80	14	2	300	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
81	14	3	300	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
82	14	4	300	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
83	14	5	300	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
84	14	6	300	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
85	15	1	250	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
86	15	2	250	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
87	15	3	250	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
88	15	4	250	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
89	15	5	250	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
90	15	6	250	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
91	16	1	200	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
92	16	2	200	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
93	16	3	200	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
94	16	4	200	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
95	16	5	200	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
96	16	6	200	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
97	17	1	180	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
98	17	2	180	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
99	17	3	180	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
100	17	4	180	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
101	17	5	180	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
102	17	6	180	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
103	18	1	150	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
104	18	2	150	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
105	18	3	150	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
106	18	4	150	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
107	18	5	150	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
108	18	6	150	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
109	19	1	100	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
110	19	2	100	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
111	19	3	100	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
112	19	4	100	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
113	19	5	100	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
114	19	6	100	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
115	20	1	90	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
116	20	2	90	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
117	20	3	90	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
118	20	4	90	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
119	20	5	90	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
120	20	6	90	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
121	21	1	80	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
122	21	2	80	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
123	21	3	80	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
124	21	4	80	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
125	21	5	80	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
126	21	6	80	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
127	22	1	70	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
128	22	2	70	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
129	22	3	70	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
130	22	4	70	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
131	22	5	70	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
132	22	6	70	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
133	23	1	60	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
134	23	2	60	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
135	23	3	60	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
136	23	4	60	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
137	23	5	60	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
138	23	6	60	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
139	24	1	200	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
140	24	2	200	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
141	24	3	200	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
142	24	4	200	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
143	24	5	200	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
144	24	6	200	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
145	25	1	180	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
146	25	2	180	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
147	25	3	180	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
148	25	4	180	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
149	25	5	180	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
150	25	6	180	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
151	26	1	160	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
152	26	2	160	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
153	26	3	160	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
154	26	4	160	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
155	26	5	160	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
156	26	6	160	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
157	27	1	140	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
158	27	2	140	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
159	27	3	140	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
160	27	4	140	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
161	27	5	140	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
162	27	6	140	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
163	28	1	120	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
164	28	2	120	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
165	28	3	120	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
166	28	4	120	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
167	28	5	120	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
168	28	6	120	0	10	200	10	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
\.


--
-- Data for Name: inventory_alerts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.inventory_alerts (id, product_id, branch_id, alert_type, message, is_resolved, created_at) FROM stdin;
\.


--
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.invoices (id, order_id, invoice_number, invoice_date, due_date, total_amount, tax_amount, status, created_at) FROM stdin;
\.


--
-- Data for Name: label_designs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.label_designs (id, name, description, template_id, media_type_id, design_data, preview_image_url, created_by, branch_id, is_active, created_at, updated_at) FROM stdin;
1	Organic Tomato Label	Label design for organic tomatoes with Telugu name	2	5	{"price": "₹60/500g", "telugu": "సేంద్రియ టమోటాలు", "product": "Organic Tomatoes"}	\N	5	1	t	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
2	Organic Rice Label	Premium rice label with certification	5	4	{"telugu": "సేంద్రియ బియ్యం", "product": "Organic Rice", "certification": "Certified Organic"}	\N	5	1	t	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
3	Spice Label Design	Label for organic spices with usage instructions	1	6	{"usage": "For cooking and health", "telugu": "సేంద్రియ పసుపు", "product": "Organic Turmeric"}	\N	5	1	t	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
\.


--
-- Data for Name: label_media_types; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.label_media_types (id, name, description, width_mm, height_mm, avery_code, media_type, is_roll, is_sheet, is_active, created_at, updated_at) FROM stdin;
1	A4 Sheet Labels	Standard A4 paper sheet for multiple labels	210.00	297.00	AVY-001	sheet	f	t	t	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
2	Roll 50x25mm	Small product label roll for price tags	50.00	25.00	AVY-002	roll	f	t	t	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
3	Roll 100x50mm	Medium product label roll for detailed info	100.00	50.00	AVY-003	roll	f	t	t	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
4	Roll 100x100mm	Large square label roll for comprehensive details	100.00	100.00	AVY-004	roll	f	t	t	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
5	Roll 75x35mm	Standard organic product label	75.00	35.00	AVY-005	roll	f	t	t	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
6	Roll 60x40mm	Compact product label for small items	60.00	40.00	AVY-006	roll	f	t	t	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
7	A5 Sheet Labels	Half A4 size for smaller batch printing	148.00	210.00	AVY-007	sheet	f	t	t	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
8	Roll 80x60mm	Telugu product label with description space	80.00	60.00	AVY-008	roll	f	t	t	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
\.


--
-- Data for Name: label_templates; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.label_templates (id, name, description, category, template_data, preview_image_url, is_active, created_by, created_at, updated_at) FROM stdin;
1	Organic Product Basic	Basic template for organic products with price and name	grocery	{"elements": [{"type": "text", "style": {"fontSize": 16, "fontWeight": "bold"}, "content": "Organic Product"}]}	\N	t	5	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
2	Telugu Product Template	Template with Telugu product name and English translation	grocery	{"elements": [{"type": "text", "style": {"fontSize": 14, "fontFamily": "Telugu"}, "content": "సేంద్రియ ఉత్పాదనలు"}]}	\N	t	5	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
3	Price Tag Template	Simple price tag with MRP and selling price	price	{"elements": [{"type": "text", "style": {"fontSize": 12}, "content": "MRP: ₹"}]}	\N	t	5	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
4	Nutrition Label Template	Template for nutrition facts display	nutrition	{"elements": [{"type": "text", "style": {"fontSize": 14, "fontWeight": "bold"}, "content": "Nutrition Facts"}]}	\N	t	5	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
5	Organic Certification Label	Template showing organic certification details	certification	{"elements": [{"type": "text", "style": {"color": "green", "fontSize": 12}, "content": "Certified Organic"}]}	\N	t	5	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
6	Barcode Label Template	Template with barcode and product details	barcode	{"elements": [{"type": "barcode", "style": {"width": 80, "height": 30}, "content": "1234567890123"}]}	\N	t	5	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
\.


--
-- Data for Name: loyalty_points; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.loyalty_points (id, customer_id, order_id, points_earned, points_redeemed, balance, transaction_type, created_at) FROM stdin;
\.


--
-- Data for Name: marketing_campaigns; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.marketing_campaigns (id, name, description, campaign_type, start_date, end_date, budget, target_audience, is_active, created_at) FROM stdin;
\.


--
-- Data for Name: notification_settings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.notification_settings (id, user_id, notification_type, email_enabled, sms_enabled, push_enabled, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.notifications (id, user_id, title, message, type, is_read, created_at) FROM stdin;
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.order_items (id, order_id, product_id, quantity, unit_price, discount_amount, tax_amount, total_price, created_at) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.orders (id, order_number, customer_id, branch_id, delivery_address_id, order_date, delivery_date, total_amount, discount_amount, tax_amount, delivery_charge, final_amount, status, payment_status, payment_method, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.payments (id, order_id, payment_method, amount, status, transaction_id, gateway_response, payment_date, created_at) FROM stdin;
\.


--
-- Data for Name: product_labels; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.product_labels (id, product_id, label_design_id, label_data, print_count, last_printed_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: product_reviews; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.product_reviews (id, product_id, customer_id, rating, review_title, review_text, is_verified, is_approved, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: product_tax_mappings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.product_tax_mappings (id, product_id, tax_rate_id, created_at) FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.products (id, name, name_telugu, description, category_id, supplier_id, sku, barcode, qr_code, price, mrp, cost_price, weight, weight_unit, stock_quantity, min_stock_level, max_stock_level, is_organic, is_active, tax_rate, nutrition_facts, images, tags, created_at, updated_at) FROM stdin;
1	Organic Tomatoes	సేంద్రియ టమోటాలు	Fresh organic tomatoes from Telangana farms	1	1	ORG-VEG-001	\N	\N	60.00	80.00	45.00	500.00	grams	100	0	100	t	t	0.00	\N	\N	\N	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
2	Organic Onions	సేంద్రియ ఉల్లిపాయలు	Natural organic onions without chemicals	1	1	ORG-VEG-002	\N	\N	40.00	55.00	30.00	1000.00	grams	200	0	100	t	t	0.00	\N	\N	\N	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
3	Organic Potatoes	సేంద్రియ బంగాళాదుంపలు	Freshly harvested organic potatoes	1	1	ORG-VEG-003	\N	\N	35.00	45.00	25.00	1000.00	grams	150	0	100	t	t	0.00	\N	\N	\N	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
4	Organic Brinjal	సేంద్రియ వంకాయలు	Purple organic brinjal from local farms	1	1	ORG-VEG-004	\N	\N	45.00	60.00	35.00	500.00	grams	80	0	100	t	t	0.00	\N	\N	\N	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
5	Organic Okra	సేంద్రియ బెండకాయలు	Fresh organic okra (ladies finger)	1	2	ORG-VEG-005	\N	\N	55.00	70.00	40.00	500.00	grams	60	0	100	t	t	0.00	\N	\N	\N	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
6	Organic Spinach	సేంద్రియ పాలకూర	Nutritious organic spinach leaves	1	2	ORG-VEG-006	\N	\N	30.00	40.00	20.00	250.00	grams	50	0	100	t	t	0.00	\N	\N	\N	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
7	Organic Curry Leaves	సేంద్రియ కరివేపాకు	Fresh organic curry leaves	1	2	ORG-VEG-007	\N	\N	25.00	35.00	15.00	100.00	grams	40	0	100	t	t	0.00	\N	\N	\N	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
8	Organic Coriander	సేంద్రియ కొత్తిమీర	Fresh organic coriander leaves	1	2	ORG-VEG-008	\N	\N	20.00	30.00	12.00	100.00	grams	45	0	100	t	t	0.00	\N	\N	\N	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
9	Organic Bananas	సేంద్రియ అరటిపండ్లు	Sweet organic bananas from Andhra Pradesh	2	2	ORG-FRU-001	\N	\N	70.00	90.00	55.00	1000.00	grams	120	0	100	t	t	0.00	\N	\N	\N	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
10	Organic Mangoes	సేంద్రియ మామిడిపండ్లు	Alphonso organic mangoes from coastal regions	2	3	ORG-FRU-002	\N	\N	250.00	300.00	200.00	1000.00	grams	50	0	100	t	t	0.00	\N	\N	\N	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
11	Organic Guavas	సేంద్రియ జామపండ్లు	Fresh organic guavas rich in vitamin C	2	3	ORG-FRU-003	\N	\N	80.00	100.00	60.00	500.00	grams	70	0	100	t	t	0.00	\N	\N	\N	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
12	Organic Pomegranates	సేంద్రియ దానిమ్మపండ్లు	Antioxidant-rich organic pomegranates	2	3	ORG-FRU-004	\N	\N	180.00	220.00	140.00	500.00	grams	40	0	100	t	t	0.00	\N	\N	\N	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
13	Organic Grapes	సేంద్రియ ద్రాక్షపండ్లు	Sweet organic grapes from local vineyards	2	3	ORG-FRU-005	\N	\N	120.00	150.00	90.00	500.00	grams	60	0	100	t	t	0.00	\N	\N	\N	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
14	Organic Rice	సేంద్రియ బియ్యం	Premium organic rice from Godavari region	3	5	ORG-GRA-001	\N	\N	180.00	220.00	150.00	1000.00	grams	300	0	100	t	t	0.00	\N	\N	\N	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
15	Organic Wheat	సేంద్రియ గోధుమలు	Whole organic wheat grains	3	5	ORG-GRA-002	\N	\N	160.00	200.00	130.00	1000.00	grams	250	0	100	t	t	0.00	\N	\N	\N	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
16	Organic Jowar	సేంద్రియ జొన్నలు	Nutritious organic sorghum grains	3	5	ORG-GRA-003	\N	\N	140.00	180.00	110.00	1000.00	grams	200	0	100	t	t	0.00	\N	\N	\N	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
17	Organic Bajra	సేంద్రియ సజ్జలు	Healthy organic pearl millet	3	5	ORG-GRA-004	\N	\N	130.00	170.00	100.00	1000.00	grams	180	0	100	t	t	0.00	\N	\N	\N	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
18	Organic Ragi	సేంద్రియ రాగులు	Finger millet rich in calcium	3	5	ORG-GRA-005	\N	\N	150.00	190.00	120.00	1000.00	grams	150	0	100	t	t	0.00	\N	\N	\N	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
19	Organic Turmeric	సేంద్రియ పసుపు	Pure organic turmeric powder	4	4	ORG-SPI-001	\N	\N	200.00	250.00	170.00	100.00	grams	100	0	100	t	t	0.00	\N	\N	\N	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
20	Organic Red Chili	సేంద్రియ ఎర్రమిర్చి	Spicy organic red chili powder	4	4	ORG-SPI-002	\N	\N	180.00	220.00	150.00	100.00	grams	90	0	100	t	t	0.00	\N	\N	\N	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
21	Organic Coriander Seeds	సేంద్రియ ధనియాలు	Aromatic organic coriander seeds	4	4	ORG-SPI-003	\N	\N	160.00	200.00	130.00	100.00	grams	80	0	100	t	t	0.00	\N	\N	\N	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
22	Organic Cumin Seeds	సేంద్రియ జీలకర్ర	Premium organic cumin seeds	4	4	ORG-SPI-004	\N	\N	220.00	280.00	180.00	100.00	grams	70	0	100	t	t	0.00	\N	\N	\N	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
23	Organic Fenugreek	సేంద్రియ మెంతులు	Bitter organic fenugreek seeds	4	4	ORG-SPI-005	\N	\N	190.00	240.00	160.00	100.00	grams	60	0	100	t	t	0.00	\N	\N	\N	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
24	Organic Toor Dal	సేంద్రియ కందిపప్పు	Protein-rich organic toor dal	5	5	ORG-PUL-001	\N	\N	200.00	250.00	170.00	1000.00	grams	200	0	100	t	t	0.00	\N	\N	\N	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
25	Organic Moong Dal	సేంద్రియ పెసలుపప్పు	Nutritious organic moong dal	5	5	ORG-PUL-002	\N	\N	180.00	220.00	150.00	1000.00	grams	180	0	100	t	t	0.00	\N	\N	\N	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
26	Organic Chana Dal	సేంద్రియ శనగపప్పు	High-protein organic chana dal	5	5	ORG-PUL-003	\N	\N	160.00	200.00	130.00	1000.00	grams	160	0	100	t	t	0.00	\N	\N	\N	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
27	Organic Urad Dal	సేంద్రియ మినుముల పప్పు	Premium organic urad dal	5	5	ORG-PUL-004	\N	\N	190.00	240.00	160.00	1000.00	grams	140	0	100	t	t	0.00	\N	\N	\N	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
28	Organic Masoor Dal	సేంద్రియ మసూర్ పప్పు	Iron-rich organic masoor dal	5	5	ORG-PUL-005	\N	\N	170.00	210.00	140.00	1000.00	grams	120	0	100	t	t	0.00	\N	\N	\N	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
\.


--
-- Data for Name: promotion_usage; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.promotion_usage (id, promotion_id, customer_id, order_id, discount_amount, used_at) FROM stdin;
\.


--
-- Data for Name: promotions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.promotions (id, name, description, discount_type, discount_value, min_order_amount, max_discount_amount, start_date, end_date, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: purchase_order_items; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.purchase_order_items (id, purchase_order_id, product_id, quantity, unit_price, total_price, received_quantity, created_at) FROM stdin;
\.


--
-- Data for Name: purchase_orders; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.purchase_orders (id, po_number, supplier_id, branch_id, total_amount, status, order_date, expected_delivery_date, created_by, created_at) FROM stdin;
\.


--
-- Data for Name: reports; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.reports (id, name, description, report_type, parameters, generated_by, file_path, generated_at) FROM stdin;
\.


--
-- Data for Name: sales_reports; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.sales_reports (id, branch_id, report_date, total_sales, total_orders, total_customers, created_at) FROM stdin;
\.


--
-- Data for Name: stock_movements; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.stock_movements (id, product_id, branch_id, movement_type, quantity, reference_type, reference_id, notes, created_by, created_at) FROM stdin;
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
1	Organic Farms Telangana	సేంద్రియ వ్యవసాయ తెలంగాణ	రాజేష్ కుమార్	rajesh@organicfarms.com	+91-9876543300	Medak District, Telangana	Medak	Telangana	\N	\N	t	\N	t	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
2	Andhra Organic Producers	ఆంధ్ర సేంద్రియ ఉత్పాదకులు	సునీత దేవి	sunitha@andhraorganic.com	+91-9876543301	Guntur District, Andhra Pradesh	Guntur	Andhra Pradesh	\N	\N	t	\N	t	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
3	Coastal Organic Suppliers	తీరప్రాంత సేంద్రియ సరఫరాదారులు	వెంకట్ రెడ్డి	venkat@coastalorganic.com	+91-9876543302	East Godavari District, Andhra Pradesh	Kakinada	Andhra Pradesh	\N	\N	t	\N	t	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
4	Traditional Spice Growers	సాంప్రదాయ మసాలా వ్యవసాయదారులు	లక్ష్మీ నారాయణ	lakshmi@traditionalspices.com	+91-9876543303	Chittoor District, Andhra Pradesh	Chittoor	Andhra Pradesh	\N	\N	t	\N	t	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
5	Godavari Organic Mills	గోదావరి సేంద్రియ మిల్లులు	కృష్ణ మూర్తి	krishna@godavariorganic.com	+91-9876543304	West Godavari District, Andhra Pradesh	Eluru	Andhra Pradesh	\N	\N	t	\N	t	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
\.


--
-- Data for Name: system_settings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.system_settings (id, setting_key, setting_value, description, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: tax_rates; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.tax_rates (id, name, rate, is_active, created_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, username, email, password_hash, first_name, last_name, phone, role, branch_id, profile_image, is_active, last_login, email_verified, phone_verified, created_at, updated_at) FROM stdin;
1	global.admin	global.admin@leafyhealth.com	securepassword123	Global	Admin	+91-9999999999	super_admin	1	\N	t	\N	f	f	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
2	admin	admin@leafyhealth.com	securepassword123	Admin	User	+91-9999999998	admin	1	\N	t	\N	f	f	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
3	ops.admin	ops.admin@leafyhealth.com	securepassword123	Operations	Admin	+91-9999999997	admin	1	\N	t	\N	f	f	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
4	branch.manager	manager@leafyhealth.com	securepassword123	Branch	Manager	+91-9999999996	manager	1	\N	t	\N	f	f	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
5	label.designer	designer@leafyhealth.com	securepassword123	Label	Designer	+91-9999999995	designer	1	\N	t	\N	f	f	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
6	inventory.clerk	inventory@leafyhealth.com	securepassword123	Inventory	Clerk	+91-9999999994	clerk	1	\N	t	\N	f	f	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
7	cashier.user	cashier@leafyhealth.com	securepassword123	Cashier	User	+91-9999999993	cashier	1	\N	t	\N	f	f	2025-07-14 07:29:00.101038	2025-07-14 07:29:00.101038
\.


--
-- Data for Name: wishlists; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.wishlists (id, customer_id, product_id, created_at) FROM stdin;
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
-- Name: audit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.audit_logs_id_seq', 1, false);


--
-- Name: backup_schedules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.backup_schedules_id_seq', 1, false);


--
-- Name: branches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.branches_id_seq', 6, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.categories_id_seq', 8, true);


--
-- Name: companies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.companies_id_seq', 5, true);


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

SELECT pg_catalog.setval('public.customers_id_seq', 5, true);


--
-- Name: deliveries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.deliveries_id_seq', 1, false);


--
-- Name: delivery_personnel_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.delivery_personnel_id_seq', 1, false);


--
-- Name: expense_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.expense_categories_id_seq', 1, false);


--
-- Name: expenses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.expenses_id_seq', 1, false);


--
-- Name: inventory_alerts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.inventory_alerts_id_seq', 1, false);


--
-- Name: inventory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.inventory_id_seq', 168, true);


--
-- Name: invoices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.invoices_id_seq', 1, false);


--
-- Name: label_designs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.label_designs_id_seq', 3, true);


--
-- Name: label_media_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.label_media_types_id_seq', 8, true);


--
-- Name: label_templates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.label_templates_id_seq', 6, true);


--
-- Name: loyalty_points_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.loyalty_points_id_seq', 1, false);


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
-- Name: product_labels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.product_labels_id_seq', 1, false);


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

SELECT pg_catalog.setval('public.products_id_seq', 28, true);


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
-- Name: reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.reports_id_seq', 1, false);


--
-- Name: sales_reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.sales_reports_id_seq', 1, false);


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

SELECT pg_catalog.setval('public.suppliers_id_seq', 5, true);


--
-- Name: system_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.system_settings_id_seq', 1, false);


--
-- Name: tax_rates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.tax_rates_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.users_id_seq', 7, true);


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
-- Name: api_keys api_keys_api_key_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_api_key_key UNIQUE (api_key);


--
-- Name: api_keys api_keys_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: backup_schedules backup_schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.backup_schedules
    ADD CONSTRAINT backup_schedules_pkey PRIMARY KEY (id);


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
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);


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
-- Name: customers customers_phone_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_phone_key UNIQUE (phone);


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
-- Name: delivery_personnel delivery_personnel_phone_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.delivery_personnel
    ADD CONSTRAINT delivery_personnel_phone_key UNIQUE (phone);


--
-- Name: delivery_personnel delivery_personnel_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.delivery_personnel
    ADD CONSTRAINT delivery_personnel_pkey PRIMARY KEY (id);


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
-- Name: inventory_alerts inventory_alerts_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory_alerts
    ADD CONSTRAINT inventory_alerts_pkey PRIMARY KEY (id);


--
-- Name: inventory inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_pkey PRIMARY KEY (id);


--
-- Name: inventory inventory_product_id_branch_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_product_id_branch_id_key UNIQUE (product_id, branch_id);


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
-- Name: product_labels product_labels_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_labels
    ADD CONSTRAINT product_labels_pkey PRIMARY KEY (id);


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
-- Name: reports reports_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_pkey PRIMARY KEY (id);


--
-- Name: sales_reports sales_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sales_reports
    ADD CONSTRAINT sales_reports_pkey PRIMARY KEY (id);


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
-- Name: system_settings system_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.system_settings
    ADD CONSTRAINT system_settings_pkey PRIMARY KEY (id);


--
-- Name: system_settings system_settings_setting_key_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.system_settings
    ADD CONSTRAINT system_settings_setting_key_key UNIQUE (setting_key);


--
-- Name: tax_rates tax_rates_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tax_rates
    ADD CONSTRAINT tax_rates_pkey PRIMARY KEY (id);


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
-- Name: wishlists wishlists_customer_id_product_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.wishlists
    ADD CONSTRAINT wishlists_customer_id_product_id_key UNIQUE (customer_id, product_id);


--
-- Name: wishlists wishlists_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.wishlists
    ADD CONSTRAINT wishlists_pkey PRIMARY KEY (id);


--
-- Name: ab_test_assignments ab_test_assignments_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ab_test_assignments
    ADD CONSTRAINT ab_test_assignments_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;


--
-- Name: ab_test_assignments ab_test_assignments_test_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ab_test_assignments
    ADD CONSTRAINT ab_test_assignments_test_id_fkey FOREIGN KEY (test_id) REFERENCES public.ab_tests(id) ON DELETE CASCADE;


--
-- Name: activity_logs activity_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: analytics_events analytics_events_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.analytics_events
    ADD CONSTRAINT analytics_events_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: api_keys api_keys_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: audit_logs audit_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: branches branches_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.branches
    ADD CONSTRAINT branches_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- Name: categories categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.categories(id);


--
-- Name: customer_addresses customer_addresses_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.customer_addresses
    ADD CONSTRAINT customer_addresses_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;


--
-- Name: customer_subscriptions customer_subscriptions_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.customer_subscriptions
    ADD CONSTRAINT customer_subscriptions_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;


--
-- Name: customer_subscriptions customer_subscriptions_subscription_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.customer_subscriptions
    ADD CONSTRAINT customer_subscriptions_subscription_plan_id_fkey FOREIGN KEY (subscription_plan_id) REFERENCES public.subscription_plans(id);


--
-- Name: customers customers_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: deliveries deliveries_delivery_personnel_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.deliveries
    ADD CONSTRAINT deliveries_delivery_personnel_id_fkey FOREIGN KEY (delivery_personnel_id) REFERENCES public.delivery_personnel(id);


--
-- Name: deliveries deliveries_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.deliveries
    ADD CONSTRAINT deliveries_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: delivery_personnel delivery_personnel_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.delivery_personnel
    ADD CONSTRAINT delivery_personnel_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: expenses expenses_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id);


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
-- Name: inventory_alerts inventory_alerts_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory_alerts
    ADD CONSTRAINT inventory_alerts_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id) ON DELETE CASCADE;


--
-- Name: inventory_alerts inventory_alerts_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory_alerts
    ADD CONSTRAINT inventory_alerts_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: inventory inventory_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id) ON DELETE CASCADE;


--
-- Name: inventory inventory_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: invoices invoices_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: label_designs label_designs_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.label_designs
    ADD CONSTRAINT label_designs_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: label_designs label_designs_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.label_designs
    ADD CONSTRAINT label_designs_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: label_designs label_designs_media_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.label_designs
    ADD CONSTRAINT label_designs_media_type_id_fkey FOREIGN KEY (media_type_id) REFERENCES public.label_media_types(id);


--
-- Name: label_designs label_designs_template_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.label_designs
    ADD CONSTRAINT label_designs_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.label_templates(id);


--
-- Name: label_templates label_templates_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.label_templates
    ADD CONSTRAINT label_templates_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: loyalty_points loyalty_points_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.loyalty_points
    ADD CONSTRAINT loyalty_points_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;


--
-- Name: loyalty_points loyalty_points_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.loyalty_points
    ADD CONSTRAINT loyalty_points_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: notification_settings notification_settings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notification_settings
    ADD CONSTRAINT notification_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


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
-- Name: payments payments_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: product_labels product_labels_label_design_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_labels
    ADD CONSTRAINT product_labels_label_design_id_fkey FOREIGN KEY (label_design_id) REFERENCES public.label_designs(id);


--
-- Name: product_labels product_labels_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_labels
    ADD CONSTRAINT product_labels_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: product_reviews product_reviews_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_reviews
    ADD CONSTRAINT product_reviews_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;


--
-- Name: product_reviews product_reviews_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_reviews
    ADD CONSTRAINT product_reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: product_tax_mappings product_tax_mappings_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_tax_mappings
    ADD CONSTRAINT product_tax_mappings_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: product_tax_mappings product_tax_mappings_tax_rate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_tax_mappings
    ADD CONSTRAINT product_tax_mappings_tax_rate_id_fkey FOREIGN KEY (tax_rate_id) REFERENCES public.tax_rates(id);


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
    ADD CONSTRAINT promotion_usage_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;


--
-- Name: promotion_usage promotion_usage_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.promotion_usage
    ADD CONSTRAINT promotion_usage_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: promotion_usage promotion_usage_promotion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.promotion_usage
    ADD CONSTRAINT promotion_usage_promotion_id_fkey FOREIGN KEY (promotion_id) REFERENCES public.promotions(id) ON DELETE CASCADE;


--
-- Name: purchase_order_items purchase_order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.purchase_order_items
    ADD CONSTRAINT purchase_order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: purchase_order_items purchase_order_items_purchase_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.purchase_order_items
    ADD CONSTRAINT purchase_order_items_purchase_order_id_fkey FOREIGN KEY (purchase_order_id) REFERENCES public.purchase_orders(id) ON DELETE CASCADE;


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
-- Name: sales_reports sales_reports_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sales_reports
    ADD CONSTRAINT sales_reports_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: stock_movements stock_movements_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT stock_movements_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id) ON DELETE CASCADE;


--
-- Name: stock_movements stock_movements_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT stock_movements_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: stock_movements stock_movements_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT stock_movements_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: users users_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id) ON DELETE SET NULL;


--
-- Name: wishlists wishlists_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.wishlists
    ADD CONSTRAINT wishlists_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;


--
-- Name: wishlists wishlists_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.wishlists
    ADD CONSTRAINT wishlists_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: neondb_owner
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

