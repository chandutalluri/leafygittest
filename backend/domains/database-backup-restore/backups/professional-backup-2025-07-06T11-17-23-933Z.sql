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

ALTER TABLE IF EXISTS ONLY public.webhook_logs DROP CONSTRAINT IF EXISTS webhook_logs_webhook_id_fkey;
ALTER TABLE IF EXISTS ONLY public.translations DROP CONSTRAINT IF EXISTS translations_language_id_fkey;
ALTER TABLE IF EXISTS ONLY public.product_statistics DROP CONSTRAINT IF EXISTS product_statistics_product_id_fkey;
ALTER TABLE IF EXISTS ONLY public.marketplace_listings DROP CONSTRAINT IF EXISTS marketplace_listings_product_id_fkey;
ALTER TABLE IF EXISTS ONLY public.marketplace_listings DROP CONSTRAINT IF EXISTS marketplace_listings_marketplace_id_fkey;
ALTER TABLE IF EXISTS ONLY public.inventory DROP CONSTRAINT IF EXISTS inventory_product_id_fkey;
ALTER TABLE IF EXISTS ONLY public.inventory DROP CONSTRAINT IF EXISTS inventory_branch_id_fkey;
ALTER TABLE IF EXISTS ONLY public.integration_logs DROP CONSTRAINT IF EXISTS integration_logs_integration_id_fkey;
ALTER TABLE IF EXISTS ONLY public.daily_statistics DROP CONSTRAINT IF EXISTS daily_statistics_branch_id_fkey;
ALTER TABLE IF EXISTS ONLY public.branches DROP CONSTRAINT IF EXISTS branches_company_id_fkey;
DROP INDEX IF EXISTS public.idx_inventory_product;
DROP INDEX IF EXISTS public.idx_inventory_branch;
DROP INDEX IF EXISTS public.idx_inventory_active;
DROP INDEX IF EXISTS public.idx_analytics_events_user;
DROP INDEX IF EXISTS public.idx_analytics_events_session;
ALTER TABLE IF EXISTS ONLY public.webhooks DROP CONSTRAINT IF EXISTS webhooks_pkey;
ALTER TABLE IF EXISTS ONLY public.webhook_logs DROP CONSTRAINT IF EXISTS webhook_logs_pkey;
ALTER TABLE IF EXISTS ONLY public.vendors DROP CONSTRAINT IF EXISTS vendors_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_key;
ALTER TABLE IF EXISTS ONLY public.translations DROP CONSTRAINT IF EXISTS translations_pkey;
ALTER TABLE IF EXISTS ONLY public.translations DROP CONSTRAINT IF EXISTS translations_language_id_key_context_key;
ALTER TABLE IF EXISTS ONLY public.traditional_orders DROP CONSTRAINT IF EXISTS traditional_orders_pkey;
ALTER TABLE IF EXISTS ONLY public.traditional_order_items DROP CONSTRAINT IF EXISTS traditional_order_items_pkey;
ALTER TABLE IF EXISTS ONLY public.traditional_items DROP CONSTRAINT IF EXISTS traditional_items_pkey;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_pkey;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_code_key;
ALTER TABLE IF EXISTS ONLY public.subscription_plans DROP CONSTRAINT IF EXISTS subscription_plans_pkey;
ALTER TABLE IF EXISTS ONLY public.subscription_plans DROP CONSTRAINT IF EXISTS subscription_plans_code_key;
ALTER TABLE IF EXISTS ONLY public.sms_logs DROP CONSTRAINT IF EXISTS sms_logs_pkey;
ALTER TABLE IF EXISTS ONLY public.shipping_methods DROP CONSTRAINT IF EXISTS shipping_methods_pkey;
ALTER TABLE IF EXISTS ONLY public.shipping_methods DROP CONSTRAINT IF EXISTS shipping_methods_code_key;
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS products_sku_key;
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS products_pkey;
ALTER TABLE IF EXISTS ONLY public.product_statistics DROP CONSTRAINT IF EXISTS product_statistics_product_id_date_key;
ALTER TABLE IF EXISTS ONLY public.product_statistics DROP CONSTRAINT IF EXISTS product_statistics_pkey;
ALTER TABLE IF EXISTS ONLY public.marketplaces DROP CONSTRAINT IF EXISTS marketplaces_pkey;
ALTER TABLE IF EXISTS ONLY public.marketplaces DROP CONSTRAINT IF EXISTS marketplaces_code_key;
ALTER TABLE IF EXISTS ONLY public.marketplace_listings DROP CONSTRAINT IF EXISTS marketplace_listings_pkey;
ALTER TABLE IF EXISTS ONLY public.marketplace_listings DROP CONSTRAINT IF EXISTS marketplace_listings_marketplace_id_product_id_key;
ALTER TABLE IF EXISTS ONLY public.loyalty_programs DROP CONSTRAINT IF EXISTS loyalty_programs_pkey;
ALTER TABLE IF EXISTS ONLY public.languages DROP CONSTRAINT IF EXISTS languages_pkey;
ALTER TABLE IF EXISTS ONLY public.languages DROP CONSTRAINT IF EXISTS languages_code_key;
ALTER TABLE IF EXISTS ONLY public.inventory DROP CONSTRAINT IF EXISTS inventory_product_id_branch_id_key;
ALTER TABLE IF EXISTS ONLY public.inventory DROP CONSTRAINT IF EXISTS inventory_pkey;
ALTER TABLE IF EXISTS ONLY public.integration_logs DROP CONSTRAINT IF EXISTS integration_logs_pkey;
ALTER TABLE IF EXISTS ONLY public.faqs DROP CONSTRAINT IF EXISTS faqs_pkey;
ALTER TABLE IF EXISTS ONLY public.email_logs DROP CONSTRAINT IF EXISTS email_logs_pkey;
ALTER TABLE IF EXISTS ONLY public.database_performance_logs DROP CONSTRAINT IF EXISTS database_performance_logs_pkey;
ALTER TABLE IF EXISTS ONLY public.daily_statistics DROP CONSTRAINT IF EXISTS daily_statistics_pkey;
ALTER TABLE IF EXISTS ONLY public.daily_statistics DROP CONSTRAINT IF EXISTS daily_statistics_date_branch_id_key;
ALTER TABLE IF EXISTS ONLY public.compliance_rules DROP CONSTRAINT IF EXISTS compliance_rules_pkey;
ALTER TABLE IF EXISTS ONLY public.companies DROP CONSTRAINT IF EXISTS companies_pkey;
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS categories_pkey;
ALTER TABLE IF EXISTS ONLY public.branches DROP CONSTRAINT IF EXISTS branches_pkey;
ALTER TABLE IF EXISTS ONLY public.banners DROP CONSTRAINT IF EXISTS banners_pkey;
ALTER TABLE IF EXISTS ONLY public.backup_schedules DROP CONSTRAINT IF EXISTS backup_schedules_pkey;
ALTER TABLE IF EXISTS ONLY public.api_performance_logs DROP CONSTRAINT IF EXISTS api_performance_logs_pkey;
ALTER TABLE IF EXISTS ONLY public.api_integrations DROP CONSTRAINT IF EXISTS api_integrations_pkey;
ALTER TABLE IF EXISTS ONLY public.analytics_events DROP CONSTRAINT IF EXISTS analytics_events_pkey;
ALTER TABLE IF EXISTS public.webhooks ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.webhook_logs ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.vendors ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.translations ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.traditional_orders ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.traditional_order_items ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.traditional_items ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.suppliers ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.subscription_plans ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.sms_logs ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.shipping_methods ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.products ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.product_statistics ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.marketplaces ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.marketplace_listings ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.loyalty_programs ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.languages ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.inventory ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.integration_logs ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.faqs ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.email_logs ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.database_performance_logs ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.daily_statistics ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.compliance_rules ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.companies ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.categories ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.branches ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.banners ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.backup_schedules ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.api_performance_logs ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.api_integrations ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.analytics_events ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.webhooks_id_seq;
DROP TABLE IF EXISTS public.webhooks;
DROP SEQUENCE IF EXISTS public.webhook_logs_id_seq;
DROP TABLE IF EXISTS public.webhook_logs;
DROP SEQUENCE IF EXISTS public.vendors_id_seq;
DROP TABLE IF EXISTS public.vendors;
DROP SEQUENCE IF EXISTS public.users_id_seq;
DROP TABLE IF EXISTS public.users;
DROP SEQUENCE IF EXISTS public.translations_id_seq;
DROP TABLE IF EXISTS public.translations;
DROP SEQUENCE IF EXISTS public.traditional_orders_id_seq;
DROP TABLE IF EXISTS public.traditional_orders;
DROP SEQUENCE IF EXISTS public.traditional_order_items_id_seq;
DROP TABLE IF EXISTS public.traditional_order_items;
DROP SEQUENCE IF EXISTS public.traditional_items_id_seq;
DROP TABLE IF EXISTS public.traditional_items;
DROP SEQUENCE IF EXISTS public.suppliers_id_seq;
DROP TABLE IF EXISTS public.suppliers;
DROP SEQUENCE IF EXISTS public.subscription_plans_id_seq;
DROP TABLE IF EXISTS public.subscription_plans;
DROP SEQUENCE IF EXISTS public.sms_logs_id_seq;
DROP TABLE IF EXISTS public.sms_logs;
DROP SEQUENCE IF EXISTS public.shipping_methods_id_seq;
DROP TABLE IF EXISTS public.shipping_methods;
DROP SEQUENCE IF EXISTS public.products_id_seq;
DROP TABLE IF EXISTS public.products;
DROP SEQUENCE IF EXISTS public.product_statistics_id_seq;
DROP TABLE IF EXISTS public.product_statistics;
DROP SEQUENCE IF EXISTS public.marketplaces_id_seq;
DROP TABLE IF EXISTS public.marketplaces;
DROP SEQUENCE IF EXISTS public.marketplace_listings_id_seq;
DROP TABLE IF EXISTS public.marketplace_listings;
DROP SEQUENCE IF EXISTS public.loyalty_programs_id_seq;
DROP TABLE IF EXISTS public.loyalty_programs;
DROP SEQUENCE IF EXISTS public.languages_id_seq;
DROP TABLE IF EXISTS public.languages;
DROP SEQUENCE IF EXISTS public.inventory_id_seq;
DROP TABLE IF EXISTS public.inventory;
DROP SEQUENCE IF EXISTS public.integration_logs_id_seq;
DROP TABLE IF EXISTS public.integration_logs;
DROP SEQUENCE IF EXISTS public.faqs_id_seq;
DROP TABLE IF EXISTS public.faqs;
DROP SEQUENCE IF EXISTS public.email_logs_id_seq;
DROP TABLE IF EXISTS public.email_logs;
DROP SEQUENCE IF EXISTS public.database_performance_logs_id_seq;
DROP TABLE IF EXISTS public.database_performance_logs;
DROP SEQUENCE IF EXISTS public.daily_statistics_id_seq;
DROP TABLE IF EXISTS public.daily_statistics;
DROP SEQUENCE IF EXISTS public.compliance_rules_id_seq;
DROP TABLE IF EXISTS public.compliance_rules;
DROP SEQUENCE IF EXISTS public.companies_id_seq;
DROP TABLE IF EXISTS public.companies;
DROP SEQUENCE IF EXISTS public.categories_id_seq;
DROP TABLE IF EXISTS public.categories;
DROP SEQUENCE IF EXISTS public.branches_id_seq;
DROP TABLE IF EXISTS public.branches;
DROP SEQUENCE IF EXISTS public.banners_id_seq;
DROP TABLE IF EXISTS public.banners;
DROP SEQUENCE IF EXISTS public.backup_schedules_id_seq;
DROP TABLE IF EXISTS public.backup_schedules;
DROP SEQUENCE IF EXISTS public.api_performance_logs_id_seq;
DROP TABLE IF EXISTS public.api_performance_logs;
DROP SEQUENCE IF EXISTS public.api_integrations_id_seq;
DROP TABLE IF EXISTS public.api_integrations;
DROP SEQUENCE IF EXISTS public.analytics_events_id_seq;
DROP TABLE IF EXISTS public.analytics_events;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: analytics_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.analytics_events (
    id integer NOT NULL,
    user_id character varying(255),
    session_id character varying(255),
    event_type character varying(100) NOT NULL,
    event_name character varying(255) NOT NULL,
    page_url text,
    referrer_url text,
    properties jsonb DEFAULT '{}'::jsonb,
    user_agent text,
    ip_address inet,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: analytics_events_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.analytics_events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: analytics_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.analytics_events_id_seq OWNED BY public.analytics_events.id;


--
-- Name: api_integrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.api_integrations (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    type character varying(100) NOT NULL,
    config jsonb NOT NULL,
    credentials jsonb,
    is_active boolean DEFAULT true,
    last_sync_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: api_integrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.api_integrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: api_integrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.api_integrations_id_seq OWNED BY public.api_integrations.id;


--
-- Name: api_performance_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.api_performance_logs (
    id integer NOT NULL,
    endpoint character varying(500) NOT NULL,
    method character varying(10) NOT NULL,
    response_time_ms integer,
    status_code integer,
    user_id character varying(255),
    ip_address inet,
    error_message text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: api_performance_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.api_performance_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: api_performance_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.api_performance_logs_id_seq OWNED BY public.api_performance_logs.id;


--
-- Name: backup_schedules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.backup_schedules (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    schedule_expression character varying(100) NOT NULL,
    backup_type character varying(50) DEFAULT 'full'::character varying,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: backup_schedules_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.backup_schedules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: backup_schedules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.backup_schedules_id_seq OWNED BY public.backup_schedules.id;


--
-- Name: banners; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.banners (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    image_url character varying(500) NOT NULL,
    link_url character varying(500),
    "position" character varying(50) DEFAULT 'home'::character varying,
    display_order integer DEFAULT 0,
    start_date timestamp without time zone,
    end_date timestamp without time zone,
    is_active boolean DEFAULT true,
    click_count integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: banners_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.banners_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: banners_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.banners_id_seq OWNED BY public.banners.id;


--
-- Name: branches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.branches (
    id integer NOT NULL,
    company_id integer,
    name character varying(255) NOT NULL,
    address text,
    city character varying(100),
    state character varying(100),
    pincode character varying(10),
    phone character varying(20),
    manager_name character varying(255),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: branches_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.branches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: branches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.branches_id_seq OWNED BY public.branches.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    name_telugu character varying(255),
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: companies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.companies (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255),
    phone character varying(20),
    address text,
    city character varying(100),
    state character varying(100),
    pincode character varying(10),
    fssai_license character varying(50),
    gst_number character varying(20),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: companies_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.companies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: companies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.companies_id_seq OWNED BY public.companies.id;


--
-- Name: compliance_rules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.compliance_rules (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    type character varying(100) NOT NULL,
    description text,
    requirements jsonb NOT NULL,
    is_mandatory boolean DEFAULT true,
    effective_date date,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: compliance_rules_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.compliance_rules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: compliance_rules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.compliance_rules_id_seq OWNED BY public.compliance_rules.id;


--
-- Name: daily_statistics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.daily_statistics (
    id integer NOT NULL,
    date date NOT NULL,
    branch_id integer,
    total_orders integer DEFAULT 0,
    total_revenue numeric(12,2) DEFAULT 0,
    total_customers integer DEFAULT 0,
    new_customers integer DEFAULT 0,
    average_order_value numeric(10,2) DEFAULT 0,
    total_items_sold integer DEFAULT 0,
    top_selling_products jsonb DEFAULT '[]'::jsonb,
    payment_method_breakdown jsonb DEFAULT '{}'::jsonb,
    hourly_sales jsonb DEFAULT '{}'::jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: daily_statistics_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.daily_statistics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: daily_statistics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.daily_statistics_id_seq OWNED BY public.daily_statistics.id;


--
-- Name: database_performance_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.database_performance_logs (
    id integer NOT NULL,
    query_hash character varying(64),
    query_text text,
    execution_time_ms integer,
    rows_affected integer,
    service_name character varying(100),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: database_performance_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.database_performance_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: database_performance_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.database_performance_logs_id_seq OWNED BY public.database_performance_logs.id;


--
-- Name: email_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_logs (
    id integer NOT NULL,
    to_email character varying(255) NOT NULL,
    from_email character varying(255) NOT NULL,
    subject character varying(500) NOT NULL,
    body text,
    status character varying(50) DEFAULT 'pending'::character varying,
    sent_at timestamp without time zone,
    error_message text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: email_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.email_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: email_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.email_logs_id_seq OWNED BY public.email_logs.id;


--
-- Name: faqs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.faqs (
    id integer NOT NULL,
    question text NOT NULL,
    answer text NOT NULL,
    category character varying(100),
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: faqs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.faqs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: faqs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.faqs_id_seq OWNED BY public.faqs.id;


--
-- Name: integration_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.integration_logs (
    id integer NOT NULL,
    integration_id integer,
    action character varying(100) NOT NULL,
    status character varying(50),
    request_data jsonb,
    response_data jsonb,
    error_message text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: integration_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.integration_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: integration_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.integration_logs_id_seq OWNED BY public.integration_logs.id;


--
-- Name: inventory; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.inventory (
    id integer NOT NULL,
    product_id integer,
    branch_id integer,
    current_stock integer DEFAULT 0,
    minimum_stock integer DEFAULT 10,
    maximum_stock integer DEFAULT 1000,
    reorder_point integer DEFAULT 20,
    reorder_quantity integer DEFAULT 50,
    last_restock_date timestamp without time zone,
    last_stock_check timestamp without time zone,
    stock_value numeric(10,2),
    location_in_store character varying(100),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: inventory_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.inventory_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: inventory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.inventory_id_seq OWNED BY public.inventory.id;


--
-- Name: languages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.languages (
    id integer NOT NULL,
    code character varying(10) NOT NULL,
    name character varying(100) NOT NULL,
    native_name character varying(100),
    is_active boolean DEFAULT true,
    is_default boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: languages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.languages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: languages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.languages_id_seq OWNED BY public.languages.id;


--
-- Name: loyalty_programs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.loyalty_programs (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    points_per_rupee numeric(5,2) DEFAULT 1,
    rupee_per_point numeric(5,2) DEFAULT 0.1,
    minimum_points_redeem integer DEFAULT 100,
    maximum_points_redeem integer,
    is_active boolean DEFAULT true,
    terms_conditions text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: loyalty_programs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.loyalty_programs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: loyalty_programs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.loyalty_programs_id_seq OWNED BY public.loyalty_programs.id;


--
-- Name: marketplace_listings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.marketplace_listings (
    id integer NOT NULL,
    marketplace_id integer,
    product_id integer,
    listing_id character varying(100),
    price numeric(10,2),
    stock_quantity integer,
    status character varying(50) DEFAULT 'active'::character varying,
    last_updated timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: marketplace_listings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.marketplace_listings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: marketplace_listings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.marketplace_listings_id_seq OWNED BY public.marketplace_listings.id;


--
-- Name: marketplaces; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.marketplaces (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    code character varying(50) NOT NULL,
    api_endpoint character varying(500),
    api_key character varying(500),
    commission_percentage numeric(5,2),
    is_active boolean DEFAULT true,
    sync_enabled boolean DEFAULT false,
    last_sync_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: marketplaces_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.marketplaces_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: marketplaces_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.marketplaces_id_seq OWNED BY public.marketplaces.id;


--
-- Name: product_statistics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_statistics (
    id integer NOT NULL,
    product_id integer,
    date date NOT NULL,
    views integer DEFAULT 0,
    add_to_cart integer DEFAULT 0,
    purchases integer DEFAULT 0,
    revenue numeric(10,2) DEFAULT 0,
    quantity_sold integer DEFAULT 0,
    average_rating numeric(3,2),
    review_count integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: product_statistics_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.product_statistics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: product_statistics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.product_statistics_id_seq OWNED BY public.product_statistics.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    name_telugu character varying(255),
    description text,
    description_telugu text,
    sku character varying(100) NOT NULL,
    category_id integer,
    selling_price numeric(10,2) NOT NULL,
    mrp numeric(10,2),
    unit character varying(50),
    image_url text,
    is_featured boolean DEFAULT false,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(50) DEFAULT 'active'::character varying,
    brand character varying(255),
    weight numeric(10,2),
    dimensions character varying(255),
    tags text[],
    stock_quantity integer DEFAULT 0
);


--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: shipping_methods; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shipping_methods (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    code character varying(50) NOT NULL,
    description text,
    base_charge numeric(10,2) NOT NULL,
    per_kg_charge numeric(10,2) DEFAULT 0,
    per_km_charge numeric(10,2) DEFAULT 0,
    free_delivery_above numeric(10,2),
    estimated_days_min integer,
    estimated_days_max integer,
    is_active boolean DEFAULT true,
    zones jsonb DEFAULT '[]'::jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: shipping_methods_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.shipping_methods_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: shipping_methods_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.shipping_methods_id_seq OWNED BY public.shipping_methods.id;


--
-- Name: sms_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sms_logs (
    id integer NOT NULL,
    to_phone character varying(20) NOT NULL,
    message text NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying,
    sent_at timestamp without time zone,
    delivery_status character varying(50),
    error_message text,
    provider character varying(50),
    cost numeric(5,2),
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: sms_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sms_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sms_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sms_logs_id_seq OWNED BY public.sms_logs.id;


--
-- Name: subscription_plans; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subscription_plans (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    code character varying(50) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    duration_days integer NOT NULL,
    delivery_frequency_days integer,
    products jsonb DEFAULT '[]'::jsonb,
    benefits jsonb DEFAULT '[]'::jsonb,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: subscription_plans_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.subscription_plans_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: subscription_plans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.subscription_plans_id_seq OWNED BY public.subscription_plans.id;


--
-- Name: suppliers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.suppliers (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    code character varying(50) NOT NULL,
    contact_person character varying(255),
    phone character varying(20),
    email character varying(255),
    address text,
    gst_number character varying(50),
    payment_terms character varying(100),
    delivery_days integer,
    is_active boolean DEFAULT true,
    rating numeric(3,2),
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: suppliers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.suppliers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: suppliers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.suppliers_id_seq OWNED BY public.suppliers.id;


--
-- Name: traditional_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.traditional_items (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    name_telugu character varying(255) NOT NULL,
    category character varying(100) NOT NULL,
    category_telugu character varying(100) NOT NULL,
    base_unit character varying(50) NOT NULL,
    default_quantity numeric(10,2) DEFAULT 1.0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: traditional_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.traditional_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: traditional_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.traditional_items_id_seq OWNED BY public.traditional_items.id;


--
-- Name: traditional_order_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.traditional_order_items (
    id integer NOT NULL,
    order_id integer,
    item_id integer,
    quantity numeric(10,2) NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    total_price numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: traditional_order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.traditional_order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: traditional_order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.traditional_order_items_id_seq OWNED BY public.traditional_order_items.id;


--
-- Name: traditional_orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.traditional_orders (
    id integer NOT NULL,
    user_id integer,
    branch_id integer,
    order_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(50) DEFAULT 'pending'::character varying,
    total_amount numeric(10,2) DEFAULT 0.00,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: traditional_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.traditional_orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: traditional_orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.traditional_orders_id_seq OWNED BY public.traditional_orders.id;


--
-- Name: translations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.translations (
    id integer NOT NULL,
    language_id integer,
    key character varying(255) NOT NULL,
    value text NOT NULL,
    context character varying(100),
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: translations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.translations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: translations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.translations_id_seq OWNED BY public.translations.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    full_name character varying(255),
    role character varying(50) DEFAULT 'customer'::character varying,
    phone character varying(20),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: vendors; Type: TABLE; Schema: public; Owner: -
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
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: vendors_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.vendors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: vendors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.vendors_id_seq OWNED BY public.vendors.id;


--
-- Name: webhook_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.webhook_logs (
    id integer NOT NULL,
    webhook_id integer,
    event character varying(100) NOT NULL,
    payload jsonb,
    response_status integer,
    response_body text,
    error_message text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: webhook_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.webhook_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: webhook_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.webhook_logs_id_seq OWNED BY public.webhook_logs.id;


--
-- Name: webhooks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.webhooks (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    url text NOT NULL,
    events jsonb NOT NULL,
    headers jsonb DEFAULT '{}'::jsonb,
    is_active boolean DEFAULT true,
    last_triggered_at timestamp without time zone,
    failure_count integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: webhooks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.webhooks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: webhooks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.webhooks_id_seq OWNED BY public.webhooks.id;


--
-- Name: analytics_events id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analytics_events ALTER COLUMN id SET DEFAULT nextval('public.analytics_events_id_seq'::regclass);


--
-- Name: api_integrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_integrations ALTER COLUMN id SET DEFAULT nextval('public.api_integrations_id_seq'::regclass);


--
-- Name: api_performance_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_performance_logs ALTER COLUMN id SET DEFAULT nextval('public.api_performance_logs_id_seq'::regclass);


--
-- Name: backup_schedules id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.backup_schedules ALTER COLUMN id SET DEFAULT nextval('public.backup_schedules_id_seq'::regclass);


--
-- Name: banners id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.banners ALTER COLUMN id SET DEFAULT nextval('public.banners_id_seq'::regclass);


--
-- Name: branches id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.branches ALTER COLUMN id SET DEFAULT nextval('public.branches_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: companies id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.companies ALTER COLUMN id SET DEFAULT nextval('public.companies_id_seq'::regclass);


--
-- Name: compliance_rules id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compliance_rules ALTER COLUMN id SET DEFAULT nextval('public.compliance_rules_id_seq'::regclass);


--
-- Name: daily_statistics id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_statistics ALTER COLUMN id SET DEFAULT nextval('public.daily_statistics_id_seq'::regclass);


--
-- Name: database_performance_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.database_performance_logs ALTER COLUMN id SET DEFAULT nextval('public.database_performance_logs_id_seq'::regclass);


--
-- Name: email_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_logs ALTER COLUMN id SET DEFAULT nextval('public.email_logs_id_seq'::regclass);


--
-- Name: faqs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faqs ALTER COLUMN id SET DEFAULT nextval('public.faqs_id_seq'::regclass);


--
-- Name: integration_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.integration_logs ALTER COLUMN id SET DEFAULT nextval('public.integration_logs_id_seq'::regclass);


--
-- Name: inventory id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventory ALTER COLUMN id SET DEFAULT nextval('public.inventory_id_seq'::regclass);


--
-- Name: languages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.languages ALTER COLUMN id SET DEFAULT nextval('public.languages_id_seq'::regclass);


--
-- Name: loyalty_programs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.loyalty_programs ALTER COLUMN id SET DEFAULT nextval('public.loyalty_programs_id_seq'::regclass);


--
-- Name: marketplace_listings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marketplace_listings ALTER COLUMN id SET DEFAULT nextval('public.marketplace_listings_id_seq'::regclass);


--
-- Name: marketplaces id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marketplaces ALTER COLUMN id SET DEFAULT nextval('public.marketplaces_id_seq'::regclass);


--
-- Name: product_statistics id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_statistics ALTER COLUMN id SET DEFAULT nextval('public.product_statistics_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: shipping_methods id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_methods ALTER COLUMN id SET DEFAULT nextval('public.shipping_methods_id_seq'::regclass);


--
-- Name: sms_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sms_logs ALTER COLUMN id SET DEFAULT nextval('public.sms_logs_id_seq'::regclass);


--
-- Name: subscription_plans id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscription_plans ALTER COLUMN id SET DEFAULT nextval('public.subscription_plans_id_seq'::regclass);


--
-- Name: suppliers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers ALTER COLUMN id SET DEFAULT nextval('public.suppliers_id_seq'::regclass);


--
-- Name: traditional_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.traditional_items ALTER COLUMN id SET DEFAULT nextval('public.traditional_items_id_seq'::regclass);


--
-- Name: traditional_order_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.traditional_order_items ALTER COLUMN id SET DEFAULT nextval('public.traditional_order_items_id_seq'::regclass);


--
-- Name: traditional_orders id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.traditional_orders ALTER COLUMN id SET DEFAULT nextval('public.traditional_orders_id_seq'::regclass);


--
-- Name: translations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.translations ALTER COLUMN id SET DEFAULT nextval('public.translations_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: vendors id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vendors ALTER COLUMN id SET DEFAULT nextval('public.vendors_id_seq'::regclass);


--
-- Name: webhook_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.webhook_logs ALTER COLUMN id SET DEFAULT nextval('public.webhook_logs_id_seq'::regclass);


--
-- Name: webhooks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.webhooks ALTER COLUMN id SET DEFAULT nextval('public.webhooks_id_seq'::regclass);


--
-- Data for Name: analytics_events; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.analytics_events (id, user_id, session_id, event_type, event_name, page_url, referrer_url, properties, user_agent, ip_address, created_at) FROM stdin;
\.


--
-- Data for Name: api_integrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.api_integrations (id, name, type, config, credentials, is_active, last_sync_at, created_at) FROM stdin;
\.


--
-- Data for Name: api_performance_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.api_performance_logs (id, endpoint, method, response_time_ms, status_code, user_id, ip_address, error_message, created_at) FROM stdin;
\.


--
-- Data for Name: backup_schedules; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.backup_schedules (id, name, schedule_expression, backup_type, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: banners; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.banners (id, title, image_url, link_url, "position", display_order, start_date, end_date, is_active, click_count, created_at) FROM stdin;
\.


--
-- Data for Name: branches; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.branches (id, company_id, name, address, city, state, pincode, phone, manager_name, is_active, created_at, updated_at) FROM stdin;
1	1	Begumpet Main Branch	15-8-564, Begumpet Main Road	Hyderabad	Telangana	500016	+91-40-2345-6789	Rajesh Kumar	t	2025-07-06 11:11:56.04754	2025-07-06 11:11:56.04754
2	1	Secunderabad Branch	12-13-45, SP Road, Secunderabad	Hyderabad	Telangana	500003	+91-40-2765-4321	Priya Sharma	t	2025-07-06 11:11:56.04754	2025-07-06 11:11:56.04754
3	1	Kukatpally Branch	45-67-89, KPHB Colony	Hyderabad	Telangana	500072	+91-40-2987-6543	Anil Reddy	t	2025-07-06 11:11:56.04754	2025-07-06 11:11:56.04754
4	2	Visakhapatnam Central	Plot No. 45, Madhavadhara Main Road	Visakhapatnam	Andhra Pradesh	530013	+91-891-234-5678	Lakshmi Devi	t	2025-07-06 11:11:56.04754	2025-07-06 11:11:56.04754
5	3	Vijayawada Main	27-4-89, Governorpet Center	Vijayawada	Andhra Pradesh	520002	+91-866-345-6789	Venkata Rao	t	2025-07-06 11:11:56.04754	2025-07-06 11:11:56.04754
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (id, name, name_telugu, description, is_active, created_at) FROM stdin;
1	Organic Vegetables	సేంద్రీయ కూరగాయలు	Fresh organic vegetables	t	2025-07-06 10:23:05.823624
2	Organic Fruits	సేంద్రీయ పండ్లు	Fresh organic fruits	t	2025-07-06 10:23:05.823624
3	Organic Grains	సేంద్రీయ ధాన్యాలు	Organic rice and grains	t	2025-07-06 10:23:05.823624
4	Organic Spices	సేంద్రీయ మసాలాలు	Pure organic spices	t	2025-07-06 10:23:05.823624
\.


--
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.companies (id, name, email, phone, address, city, state, pincode, fssai_license, gst_number, created_at, updated_at) FROM stdin;
1	Sri Venkateswara Organic Foods	contact@srivenkateshwaraorganics.com	+91-40-2345-6789	15-8-564, Begumpet	Hyderabad	Telangana	500016	12345678901234	36AABCS1234A1Z5	2025-07-06 11:11:41.398029	2025-07-06 11:11:41.398029
2	Green Valley Naturals	info@greenvalleynaturals.com	+91-891-234-5678	Plot No. 45, Madhavadhara	Visakhapatnam	Andhra Pradesh	530013	98765432101234	36AABCG5678B2Z9	2025-07-06 11:11:41.398029	2025-07-06 11:11:41.398029
3	Pure Earth Organics	support@pureearthorganics.com	+91-866-345-6789	27-4-89, Governorpet	Vijayawada	Andhra Pradesh	520002	56789012345678	36AABCP9012C3Z4	2025-07-06 11:11:41.398029	2025-07-06 11:11:41.398029
\.


--
-- Data for Name: compliance_rules; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.compliance_rules (id, name, type, description, requirements, is_mandatory, effective_date, created_at) FROM stdin;
\.


--
-- Data for Name: daily_statistics; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.daily_statistics (id, date, branch_id, total_orders, total_revenue, total_customers, new_customers, average_order_value, total_items_sold, top_selling_products, payment_method_breakdown, hourly_sales, created_at) FROM stdin;
\.


--
-- Data for Name: database_performance_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.database_performance_logs (id, query_hash, query_text, execution_time_ms, rows_affected, service_name, created_at) FROM stdin;
\.


--
-- Data for Name: email_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.email_logs (id, to_email, from_email, subject, body, status, sent_at, error_message, metadata, created_at) FROM stdin;
\.


--
-- Data for Name: faqs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.faqs (id, question, answer, category, display_order, is_active, created_at) FROM stdin;
\.


--
-- Data for Name: integration_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.integration_logs (id, integration_id, action, status, request_data, response_data, error_message, created_at) FROM stdin;
\.


--
-- Data for Name: inventory; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.inventory (id, product_id, branch_id, current_stock, minimum_stock, maximum_stock, reorder_point, reorder_quantity, last_restock_date, last_stock_check, stock_value, location_in_store, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: languages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.languages (id, code, name, native_name, is_active, is_default, created_at) FROM stdin;
\.


--
-- Data for Name: loyalty_programs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.loyalty_programs (id, name, points_per_rupee, rupee_per_point, minimum_points_redeem, maximum_points_redeem, is_active, terms_conditions, created_at) FROM stdin;
\.


--
-- Data for Name: marketplace_listings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.marketplace_listings (id, marketplace_id, product_id, listing_id, price, stock_quantity, status, last_updated, created_at) FROM stdin;
\.


--
-- Data for Name: marketplaces; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.marketplaces (id, name, code, api_endpoint, api_key, commission_percentage, is_active, sync_enabled, last_sync_at, created_at) FROM stdin;
\.


--
-- Data for Name: product_statistics; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_statistics (id, product_id, date, views, add_to_cart, purchases, revenue, quantity_sold, average_rating, review_count, created_at) FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products (id, name, name_telugu, description, description_telugu, sku, category_id, selling_price, mrp, unit, image_url, is_featured, is_active, created_at, updated_at, status, brand, weight, dimensions, tags, stock_quantity) FROM stdin;
1	Organic Tomatoes	సేంద్రీయ టమోటాలు	Fresh organic tomatoes	\N	VEG-TOM-001	1	45.00	50.00	kg	\N	t	t	2025-07-06 10:23:14.896842	2025-07-06 10:23:14.896842	active	\N	\N	\N	\N	0
2	Organic Bananas	సేంద్రీయ అరటిపండ్లు	Sweet organic bananas	\N	FRT-BAN-001	2	55.00	60.00	dozen	\N	t	t	2025-07-06 10:23:14.896842	2025-07-06 10:23:14.896842	active	\N	\N	\N	\N	0
3	Organic Basmati Rice	సేంద్రీయ బాస్మతి బియ్యం	Premium organic basmati rice	\N	GRN-RIC-001	3	185.00	200.00	kg	\N	t	t	2025-07-06 10:23:14.896842	2025-07-06 10:23:14.896842	active	\N	\N	\N	\N	0
4	Organic Turmeric Powder	సేంద్రీయ పసుపు పొడి	Pure organic turmeric powder	\N	SPC-TUR-001	4	285.00	300.00	kg	\N	t	t	2025-07-06 10:23:14.896842	2025-07-06 10:23:14.896842	active	\N	\N	\N	\N	0
\.


--
-- Data for Name: shipping_methods; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.shipping_methods (id, name, code, description, base_charge, per_kg_charge, per_km_charge, free_delivery_above, estimated_days_min, estimated_days_max, is_active, zones, created_at) FROM stdin;
\.


--
-- Data for Name: sms_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sms_logs (id, to_phone, message, status, sent_at, delivery_status, error_message, provider, cost, metadata, created_at) FROM stdin;
\.


--
-- Data for Name: subscription_plans; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.subscription_plans (id, name, code, description, price, duration_days, delivery_frequency_days, products, benefits, is_active, created_at) FROM stdin;
\.


--
-- Data for Name: suppliers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.suppliers (id, name, code, contact_person, phone, email, address, gst_number, payment_terms, delivery_days, is_active, rating, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: traditional_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.traditional_items (id, name, name_telugu, category, category_telugu, base_unit, default_quantity, created_at, updated_at) FROM stdin;
1	Rice	బియ్యం	Grains	ధాన్యాలు	kg	1.00	2025-07-06 10:31:32.212441	2025-07-06 10:31:32.212441
2	Wheat	గోధుమలు	Grains	ధాన్యాలు	kg	1.00	2025-07-06 10:31:32.212441	2025-07-06 10:31:32.212441
3	Toor Dal	కంది పప్పు	Pulses	పప్పులు	kg	1.00	2025-07-06 10:31:32.212441	2025-07-06 10:31:32.212441
4	Turmeric	పసుపు	Spices	మసాలాలు	kg	1.00	2025-07-06 10:31:32.212441	2025-07-06 10:31:32.212441
5	Oil	నూనె	Oils	నూనెలు	liter	1.00	2025-07-06 10:31:32.212441	2025-07-06 10:31:32.212441
6	Onions	ఉల్లిపాయలు	Vegetables	కూరగాయలు	kg	1.00	2025-07-06 10:31:32.212441	2025-07-06 10:31:32.212441
7	Sugar	చక్కెర	Grocery	కిరాణా	kg	1.00	2025-07-06 10:31:32.212441	2025-07-06 10:31:32.212441
8	Salt	ఉప్పు	Grocery	కిరాణా	kg	1.00	2025-07-06 10:31:32.212441	2025-07-06 10:31:32.212441
\.


--
-- Data for Name: traditional_order_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.traditional_order_items (id, order_id, item_id, quantity, unit_price, total_price, created_at) FROM stdin;
\.


--
-- Data for Name: traditional_orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.traditional_orders (id, user_id, branch_id, order_date, status, total_amount, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: translations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.translations (id, language_id, key, value, context, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, password_hash, full_name, role, phone, created_at, updated_at) FROM stdin;
1	global.admin@leafyhealth.com	$2b$12$8gLlF474PGODuHqSqwV4T.wQpDLyQpE/LlyrGFx/KP4GeL0H74Lj6	Global Administrator	super_admin	+91-9876543210	2025-07-06 11:10:59.816643	2025-07-06 11:10:59.816643
2	ops.admin@leafyhealth.com	$2b$12$8gLlF474PGODuHqSqwV4T.wQpDLyQpE/LlyrGFx/KP4GeL0H74Lj6	Operations Administrator	super_admin	+91-9876543211	2025-07-06 11:10:59.816643	2025-07-06 11:10:59.816643
3	customer@leafyhealth.com	$2b$12$8gLlF474PGODuHqSqwV4T.wQpDLyQpE/LlyrGFx/KP4GeL0H74Lj6	Demo Customer	customer	+91-9876543212	2025-07-06 11:10:59.816643	2025-07-06 11:10:59.816643
\.


--
-- Data for Name: vendors; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.vendors (id, name, vendor_type, contact_person, phone, email, address, gst_number, pan_number, bank_details, payment_terms, credit_limit, current_balance, is_active, rating, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: webhook_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.webhook_logs (id, webhook_id, event, payload, response_status, response_body, error_message, created_at) FROM stdin;
\.


--
-- Data for Name: webhooks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.webhooks (id, name, url, events, headers, is_active, last_triggered_at, failure_count, created_at) FROM stdin;
\.


--
-- Name: analytics_events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.analytics_events_id_seq', 1, false);


--
-- Name: api_integrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.api_integrations_id_seq', 1, false);


--
-- Name: api_performance_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.api_performance_logs_id_seq', 1, false);


--
-- Name: backup_schedules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.backup_schedules_id_seq', 1, false);


--
-- Name: banners_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.banners_id_seq', 1, false);


--
-- Name: branches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.branches_id_seq', 5, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_id_seq', 10, true);


--
-- Name: companies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.companies_id_seq', 3, true);


--
-- Name: compliance_rules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.compliance_rules_id_seq', 1, false);


--
-- Name: daily_statistics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.daily_statistics_id_seq', 1, false);


--
-- Name: database_performance_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.database_performance_logs_id_seq', 1, false);


--
-- Name: email_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.email_logs_id_seq', 1, false);


--
-- Name: faqs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.faqs_id_seq', 1, false);


--
-- Name: integration_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.integration_logs_id_seq', 1, false);


--
-- Name: inventory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.inventory_id_seq', 1, false);


--
-- Name: languages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.languages_id_seq', 1, false);


--
-- Name: loyalty_programs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.loyalty_programs_id_seq', 1, false);


--
-- Name: marketplace_listings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.marketplace_listings_id_seq', 1, false);


--
-- Name: marketplaces_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.marketplaces_id_seq', 1, false);


--
-- Name: product_statistics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_statistics_id_seq', 1, false);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.products_id_seq', 32, true);


--
-- Name: shipping_methods_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.shipping_methods_id_seq', 1, false);


--
-- Name: sms_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sms_logs_id_seq', 1, false);


--
-- Name: subscription_plans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.subscription_plans_id_seq', 1, false);


--
-- Name: suppliers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.suppliers_id_seq', 1, false);


--
-- Name: traditional_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.traditional_items_id_seq', 8, true);


--
-- Name: traditional_order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.traditional_order_items_id_seq', 1, false);


--
-- Name: traditional_orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.traditional_orders_id_seq', 1, false);


--
-- Name: translations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.translations_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: vendors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.vendors_id_seq', 1, false);


--
-- Name: webhook_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.webhook_logs_id_seq', 1, false);


--
-- Name: webhooks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.webhooks_id_seq', 1, false);


--
-- Name: analytics_events analytics_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analytics_events
    ADD CONSTRAINT analytics_events_pkey PRIMARY KEY (id);


--
-- Name: api_integrations api_integrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_integrations
    ADD CONSTRAINT api_integrations_pkey PRIMARY KEY (id);


--
-- Name: api_performance_logs api_performance_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_performance_logs
    ADD CONSTRAINT api_performance_logs_pkey PRIMARY KEY (id);


--
-- Name: backup_schedules backup_schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.backup_schedules
    ADD CONSTRAINT backup_schedules_pkey PRIMARY KEY (id);


--
-- Name: banners banners_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.banners
    ADD CONSTRAINT banners_pkey PRIMARY KEY (id);


--
-- Name: branches branches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.branches
    ADD CONSTRAINT branches_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);


--
-- Name: compliance_rules compliance_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compliance_rules
    ADD CONSTRAINT compliance_rules_pkey PRIMARY KEY (id);


--
-- Name: daily_statistics daily_statistics_date_branch_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_statistics
    ADD CONSTRAINT daily_statistics_date_branch_id_key UNIQUE (date, branch_id);


--
-- Name: daily_statistics daily_statistics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_statistics
    ADD CONSTRAINT daily_statistics_pkey PRIMARY KEY (id);


--
-- Name: database_performance_logs database_performance_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.database_performance_logs
    ADD CONSTRAINT database_performance_logs_pkey PRIMARY KEY (id);


--
-- Name: email_logs email_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_logs
    ADD CONSTRAINT email_logs_pkey PRIMARY KEY (id);


--
-- Name: faqs faqs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faqs
    ADD CONSTRAINT faqs_pkey PRIMARY KEY (id);


--
-- Name: integration_logs integration_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.integration_logs
    ADD CONSTRAINT integration_logs_pkey PRIMARY KEY (id);


--
-- Name: inventory inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_pkey PRIMARY KEY (id);


--
-- Name: inventory inventory_product_id_branch_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_product_id_branch_id_key UNIQUE (product_id, branch_id);


--
-- Name: languages languages_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.languages
    ADD CONSTRAINT languages_code_key UNIQUE (code);


--
-- Name: languages languages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.languages
    ADD CONSTRAINT languages_pkey PRIMARY KEY (id);


--
-- Name: loyalty_programs loyalty_programs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.loyalty_programs
    ADD CONSTRAINT loyalty_programs_pkey PRIMARY KEY (id);


--
-- Name: marketplace_listings marketplace_listings_marketplace_id_product_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marketplace_listings
    ADD CONSTRAINT marketplace_listings_marketplace_id_product_id_key UNIQUE (marketplace_id, product_id);


--
-- Name: marketplace_listings marketplace_listings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marketplace_listings
    ADD CONSTRAINT marketplace_listings_pkey PRIMARY KEY (id);


--
-- Name: marketplaces marketplaces_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marketplaces
    ADD CONSTRAINT marketplaces_code_key UNIQUE (code);


--
-- Name: marketplaces marketplaces_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marketplaces
    ADD CONSTRAINT marketplaces_pkey PRIMARY KEY (id);


--
-- Name: product_statistics product_statistics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_statistics
    ADD CONSTRAINT product_statistics_pkey PRIMARY KEY (id);


--
-- Name: product_statistics product_statistics_product_id_date_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_statistics
    ADD CONSTRAINT product_statistics_product_id_date_key UNIQUE (product_id, date);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: products products_sku_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_sku_key UNIQUE (sku);


--
-- Name: shipping_methods shipping_methods_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_methods
    ADD CONSTRAINT shipping_methods_code_key UNIQUE (code);


--
-- Name: shipping_methods shipping_methods_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_methods
    ADD CONSTRAINT shipping_methods_pkey PRIMARY KEY (id);


--
-- Name: sms_logs sms_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sms_logs
    ADD CONSTRAINT sms_logs_pkey PRIMARY KEY (id);


--
-- Name: subscription_plans subscription_plans_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscription_plans
    ADD CONSTRAINT subscription_plans_code_key UNIQUE (code);


--
-- Name: subscription_plans subscription_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscription_plans
    ADD CONSTRAINT subscription_plans_pkey PRIMARY KEY (id);


--
-- Name: suppliers suppliers_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_code_key UNIQUE (code);


--
-- Name: suppliers suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (id);


--
-- Name: traditional_items traditional_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.traditional_items
    ADD CONSTRAINT traditional_items_pkey PRIMARY KEY (id);


--
-- Name: traditional_order_items traditional_order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.traditional_order_items
    ADD CONSTRAINT traditional_order_items_pkey PRIMARY KEY (id);


--
-- Name: traditional_orders traditional_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.traditional_orders
    ADD CONSTRAINT traditional_orders_pkey PRIMARY KEY (id);


--
-- Name: translations translations_language_id_key_context_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.translations
    ADD CONSTRAINT translations_language_id_key_context_key UNIQUE (language_id, key, context);


--
-- Name: translations translations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.translations
    ADD CONSTRAINT translations_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: vendors vendors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vendors
    ADD CONSTRAINT vendors_pkey PRIMARY KEY (id);


--
-- Name: webhook_logs webhook_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.webhook_logs
    ADD CONSTRAINT webhook_logs_pkey PRIMARY KEY (id);


--
-- Name: webhooks webhooks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.webhooks
    ADD CONSTRAINT webhooks_pkey PRIMARY KEY (id);


--
-- Name: idx_analytics_events_session; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_analytics_events_session ON public.analytics_events USING btree (session_id);


--
-- Name: idx_analytics_events_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_analytics_events_user ON public.analytics_events USING btree (user_id);


--
-- Name: idx_inventory_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_inventory_active ON public.inventory USING btree (is_active);


--
-- Name: idx_inventory_branch; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_inventory_branch ON public.inventory USING btree (branch_id);


--
-- Name: idx_inventory_product; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_inventory_product ON public.inventory USING btree (product_id);


--
-- Name: branches branches_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.branches
    ADD CONSTRAINT branches_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);


--
-- Name: daily_statistics daily_statistics_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_statistics
    ADD CONSTRAINT daily_statistics_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: integration_logs integration_logs_integration_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.integration_logs
    ADD CONSTRAINT integration_logs_integration_id_fkey FOREIGN KEY (integration_id) REFERENCES public.api_integrations(id);


--
-- Name: inventory inventory_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id) ON DELETE CASCADE;


--
-- Name: inventory inventory_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: marketplace_listings marketplace_listings_marketplace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marketplace_listings
    ADD CONSTRAINT marketplace_listings_marketplace_id_fkey FOREIGN KEY (marketplace_id) REFERENCES public.marketplaces(id);


--
-- Name: marketplace_listings marketplace_listings_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marketplace_listings
    ADD CONSTRAINT marketplace_listings_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: product_statistics product_statistics_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_statistics
    ADD CONSTRAINT product_statistics_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: translations translations_language_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.translations
    ADD CONSTRAINT translations_language_id_fkey FOREIGN KEY (language_id) REFERENCES public.languages(id);


--
-- Name: webhook_logs webhook_logs_webhook_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.webhook_logs
    ADD CONSTRAINT webhook_logs_webhook_id_fkey FOREIGN KEY (webhook_id) REFERENCES public.webhooks(id);


--
-- PostgreSQL database dump complete
--

