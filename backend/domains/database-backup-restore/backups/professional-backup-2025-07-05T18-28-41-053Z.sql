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

ALTER TABLE IF EXISTS ONLY public.wishlists DROP CONSTRAINT IF EXISTS wishlists_customer_id_fkey;
ALTER TABLE IF EXISTS ONLY public.wishlist_items DROP CONSTRAINT IF EXISTS wishlist_items_wishlist_id_fkey;
ALTER TABLE IF EXISTS ONLY public.wishlist_items DROP CONSTRAINT IF EXISTS wishlist_items_product_id_fkey;
ALTER TABLE IF EXISTS ONLY public.webhook_deliveries DROP CONSTRAINT IF EXISTS webhook_deliveries_webhook_id_fkey;
ALTER TABLE IF EXISTS ONLY public.user_sessions DROP CONSTRAINT IF EXISTS user_sessions_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.user_sessions DROP CONSTRAINT IF EXISTS user_sessions_branch_id_fkey;
ALTER TABLE IF EXISTS ONLY public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.user_roles DROP CONSTRAINT IF EXISTS user_roles_role_id_fkey;
ALTER TABLE IF EXISTS ONLY public.user_roles DROP CONSTRAINT IF EXISTS user_roles_assigned_by_fkey;
ALTER TABLE IF EXISTS ONLY public.traditional_orders DROP CONSTRAINT IF EXISTS traditional_orders_selected_vendor_id_fkey;
ALTER TABLE IF EXISTS ONLY public.traditional_orders DROP CONSTRAINT IF EXISTS traditional_orders_customer_id_fkey;
ALTER TABLE IF EXISTS ONLY public.traditional_orders DROP CONSTRAINT IF EXISTS traditional_orders_branch_id_fkey;
ALTER TABLE IF EXISTS ONLY public.traditional_order_items DROP CONSTRAINT IF EXISTS traditional_order_items_order_id_fkey;
ALTER TABLE IF EXISTS ONLY public.traditional_order_items DROP CONSTRAINT IF EXISTS traditional_order_items_item_id_fkey;
ALTER TABLE IF EXISTS ONLY public.system_settings DROP CONSTRAINT IF EXISTS system_settings_updated_by_fkey;
ALTER TABLE IF EXISTS ONLY public.support_tickets DROP CONSTRAINT IF EXISTS support_tickets_customer_id_fkey;
ALTER TABLE IF EXISTS ONLY public.support_tickets DROP CONSTRAINT IF EXISTS support_tickets_assigned_to_fkey;
ALTER TABLE IF EXISTS ONLY public.support_ticket_messages DROP CONSTRAINT IF EXISTS support_ticket_messages_ticket_id_fkey;
ALTER TABLE IF EXISTS ONLY public.support_ticket_messages DROP CONSTRAINT IF EXISTS support_ticket_messages_sender_id_fkey;
ALTER TABLE IF EXISTS ONLY public.stock_alerts DROP CONSTRAINT IF EXISTS stock_alerts_product_id_fkey;
ALTER TABLE IF EXISTS ONLY public.stock_alerts DROP CONSTRAINT IF EXISTS stock_alerts_branch_id_fkey;
ALTER TABLE IF EXISTS ONLY public.states DROP CONSTRAINT IF EXISTS states_country_id_fkey;
ALTER TABLE IF EXISTS ONLY public.social_media_posts DROP CONSTRAINT IF EXISTS social_media_posts_created_by_fkey;
ALTER TABLE IF EXISTS ONLY public.search_queries DROP CONSTRAINT IF EXISTS search_queries_selected_product_id_fkey;
ALTER TABLE IF EXISTS ONLY public.search_queries DROP CONSTRAINT IF EXISTS search_queries_customer_id_fkey;
ALTER TABLE IF EXISTS ONLY public.sales_reports DROP CONSTRAINT IF EXISTS sales_reports_branch_id_fkey;
ALTER TABLE IF EXISTS ONLY public.returns DROP CONSTRAINT IF EXISTS returns_order_id_fkey;
ALTER TABLE IF EXISTS ONLY public.returns DROP CONSTRAINT IF EXISTS returns_customer_id_fkey;
ALTER TABLE IF EXISTS ONLY public.returns DROP CONSTRAINT IF EXISTS returns_approved_by_fkey;
ALTER TABLE IF EXISTS ONLY public.return_items DROP CONSTRAINT IF EXISTS return_items_return_id_fkey;
ALTER TABLE IF EXISTS ONLY public.return_items DROP CONSTRAINT IF EXISTS return_items_order_item_id_fkey;
ALTER TABLE IF EXISTS ONLY public.purchase_orders DROP CONSTRAINT IF EXISTS purchase_orders_supplier_id_fkey;
ALTER TABLE IF EXISTS ONLY public.purchase_orders DROP CONSTRAINT IF EXISTS purchase_orders_created_by_fkey;
ALTER TABLE IF EXISTS ONLY public.purchase_orders DROP CONSTRAINT IF EXISTS purchase_orders_branch_id_fkey;
ALTER TABLE IF EXISTS ONLY public.purchase_orders DROP CONSTRAINT IF EXISTS purchase_orders_approved_by_fkey;
ALTER TABLE IF EXISTS ONLY public.purchase_order_items DROP CONSTRAINT IF EXISTS purchase_order_items_purchase_order_id_fkey;
ALTER TABLE IF EXISTS ONLY public.purchase_order_items DROP CONSTRAINT IF EXISTS purchase_order_items_product_id_fkey;
ALTER TABLE IF EXISTS ONLY public.promotion_usage DROP CONSTRAINT IF EXISTS promotion_usage_promotion_id_fkey;
ALTER TABLE IF EXISTS ONLY public.promotion_usage DROP CONSTRAINT IF EXISTS promotion_usage_order_id_fkey;
ALTER TABLE IF EXISTS ONLY public.promotion_usage DROP CONSTRAINT IF EXISTS promotion_usage_customer_id_fkey;
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS products_category_id_fkey;
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS products_brand_id_fkey;
ALTER TABLE IF EXISTS ONLY public.product_reviews DROP CONSTRAINT IF EXISTS product_reviews_product_id_fkey;
ALTER TABLE IF EXISTS ONLY public.product_reviews DROP CONSTRAINT IF EXISTS product_reviews_order_id_fkey;
ALTER TABLE IF EXISTS ONLY public.product_reviews DROP CONSTRAINT IF EXISTS product_reviews_customer_id_fkey;
ALTER TABLE IF EXISTS ONLY public.product_questions DROP CONSTRAINT IF EXISTS product_questions_product_id_fkey;
ALTER TABLE IF EXISTS ONLY public.product_questions DROP CONSTRAINT IF EXISTS product_questions_customer_id_fkey;
ALTER TABLE IF EXISTS ONLY public.product_collection_items DROP CONSTRAINT IF EXISTS product_collection_items_product_id_fkey;
ALTER TABLE IF EXISTS ONLY public.product_collection_items DROP CONSTRAINT IF EXISTS product_collection_items_collection_id_fkey;
ALTER TABLE IF EXISTS ONLY public.product_attribute_values DROP CONSTRAINT IF EXISTS product_attribute_values_product_id_fkey;
ALTER TABLE IF EXISTS ONLY public.product_attribute_values DROP CONSTRAINT IF EXISTS product_attribute_values_attribute_id_fkey;
ALTER TABLE IF EXISTS ONLY public.product_answers DROP CONSTRAINT IF EXISTS product_answers_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.product_answers DROP CONSTRAINT IF EXISTS product_answers_question_id_fkey;
ALTER TABLE IF EXISTS ONLY public.price_history DROP CONSTRAINT IF EXISTS price_history_product_id_fkey;
ALTER TABLE IF EXISTS ONLY public.price_history DROP CONSTRAINT IF EXISTS price_history_changed_by_fkey;
ALTER TABLE IF EXISTS ONLY public.performance_metrics DROP CONSTRAINT IF EXISTS performance_metrics_branch_id_fkey;
ALTER TABLE IF EXISTS ONLY public.payments DROP CONSTRAINT IF EXISTS payments_order_id_fkey;
ALTER TABLE IF EXISTS ONLY public.orders DROP CONSTRAINT IF EXISTS orders_customer_id_fkey;
ALTER TABLE IF EXISTS ONLY public.orders DROP CONSTRAINT IF EXISTS orders_branch_id_fkey;
ALTER TABLE IF EXISTS ONLY public.order_items DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;
ALTER TABLE IF EXISTS ONLY public.order_items DROP CONSTRAINT IF EXISTS order_items_order_id_fkey;
ALTER TABLE IF EXISTS ONLY public.notifications DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.marketplace_listings DROP CONSTRAINT IF EXISTS marketplace_listings_product_id_fkey;
ALTER TABLE IF EXISTS ONLY public.marketing_campaigns DROP CONSTRAINT IF EXISTS marketing_campaigns_created_by_fkey;
ALTER TABLE IF EXISTS ONLY public.loyalty_transactions DROP CONSTRAINT IF EXISTS loyalty_transactions_order_id_fkey;
ALTER TABLE IF EXISTS ONLY public.loyalty_transactions DROP CONSTRAINT IF EXISTS loyalty_transactions_customer_id_fkey;
ALTER TABLE IF EXISTS ONLY public.label_templates DROP CONSTRAINT IF EXISTS label_templates_created_by_fkey;
ALTER TABLE IF EXISTS ONLY public.inventory_transactions DROP CONSTRAINT IF EXISTS inventory_transactions_product_id_fkey;
ALTER TABLE IF EXISTS ONLY public.inventory_transactions DROP CONSTRAINT IF EXISTS inventory_transactions_created_by_fkey;
ALTER TABLE IF EXISTS ONLY public.inventory_transactions DROP CONSTRAINT IF EXISTS inventory_transactions_branch_id_fkey;
ALTER TABLE IF EXISTS ONLY public.inventory DROP CONSTRAINT IF EXISTS inventory_product_id_fkey;
ALTER TABLE IF EXISTS ONLY public.inventory DROP CONSTRAINT IF EXISTS inventory_branch_id_fkey;
ALTER TABLE IF EXISTS ONLY public.inventory_adjustments DROP CONSTRAINT IF EXISTS inventory_adjustments_product_id_fkey;
ALTER TABLE IF EXISTS ONLY public.inventory_adjustments DROP CONSTRAINT IF EXISTS inventory_adjustments_branch_id_fkey;
ALTER TABLE IF EXISTS ONLY public.inventory_adjustments DROP CONSTRAINT IF EXISTS inventory_adjustments_adjusted_by_fkey;
ALTER TABLE IF EXISTS ONLY public.image_uploads DROP CONSTRAINT IF EXISTS image_uploads_uploaded_by_fkey;
ALTER TABLE IF EXISTS ONLY public.gift_cards DROP CONSTRAINT IF EXISTS gift_cards_purchased_by_fkey;
ALTER TABLE IF EXISTS ONLY public.gift_card_transactions DROP CONSTRAINT IF EXISTS gift_card_transactions_order_id_fkey;
ALTER TABLE IF EXISTS ONLY public.gift_card_transactions DROP CONSTRAINT IF EXISTS gift_card_transactions_gift_card_id_fkey;
ALTER TABLE IF EXISTS ONLY public.expenses DROP CONSTRAINT IF EXISTS expenses_created_by_fkey;
ALTER TABLE IF EXISTS ONLY public.expenses DROP CONSTRAINT IF EXISTS expenses_category_id_fkey;
ALTER TABLE IF EXISTS ONLY public.expenses DROP CONSTRAINT IF EXISTS expenses_branch_id_fkey;
ALTER TABLE IF EXISTS ONLY public.expenses DROP CONSTRAINT IF EXISTS expenses_approved_by_fkey;
ALTER TABLE IF EXISTS ONLY public.expense_categories DROP CONSTRAINT IF EXISTS expense_categories_parent_id_fkey;
ALTER TABLE IF EXISTS ONLY public.employees DROP CONSTRAINT IF EXISTS employees_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.employees DROP CONSTRAINT IF EXISTS employees_branch_id_fkey;
ALTER TABLE IF EXISTS ONLY public.employee_attendance DROP CONSTRAINT IF EXISTS employee_attendance_employee_id_fkey;
ALTER TABLE IF EXISTS ONLY public.delivery_zones DROP CONSTRAINT IF EXISTS delivery_zones_branch_id_fkey;
ALTER TABLE IF EXISTS ONLY public.delivery_schedules DROP CONSTRAINT IF EXISTS delivery_schedules_branch_id_fkey;
ALTER TABLE IF EXISTS ONLY public.delivery_assignments DROP CONSTRAINT IF EXISTS delivery_assignments_order_id_fkey;
ALTER TABLE IF EXISTS ONLY public.delivery_assignments DROP CONSTRAINT IF EXISTS delivery_assignments_delivery_person_id_fkey;
ALTER TABLE IF EXISTS ONLY public.data_privacy_requests DROP CONSTRAINT IF EXISTS data_privacy_requests_processed_by_fkey;
ALTER TABLE IF EXISTS ONLY public.data_privacy_requests DROP CONSTRAINT IF EXISTS data_privacy_requests_customer_id_fkey;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.customer_subscriptions DROP CONSTRAINT IF EXISTS customer_subscriptions_plan_id_fkey;
ALTER TABLE IF EXISTS ONLY public.customer_subscriptions DROP CONSTRAINT IF EXISTS customer_subscriptions_customer_id_fkey;
ALTER TABLE IF EXISTS ONLY public.customer_addresses DROP CONSTRAINT IF EXISTS customer_addresses_customer_id_fkey;
ALTER TABLE IF EXISTS ONLY public.content_versions DROP CONSTRAINT IF EXISTS content_versions_created_by_fkey;
ALTER TABLE IF EXISTS ONLY public.compliance_checks DROP CONSTRAINT IF EXISTS compliance_checks_checked_by_fkey;
ALTER TABLE IF EXISTS ONLY public.communication_logs DROP CONSTRAINT IF EXISTS communication_logs_template_id_fkey;
ALTER TABLE IF EXISTS ONLY public.cms_pages DROP CONSTRAINT IF EXISTS cms_pages_author_id_fkey;
ALTER TABLE IF EXISTS ONLY public.cities DROP CONSTRAINT IF EXISTS cities_state_id_fkey;
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS categories_parent_id_fkey;
ALTER TABLE IF EXISTS ONLY public.carts DROP CONSTRAINT IF EXISTS carts_customer_id_fkey;
ALTER TABLE IF EXISTS ONLY public.carts DROP CONSTRAINT IF EXISTS carts_branch_id_fkey;
ALTER TABLE IF EXISTS ONLY public.cart_items DROP CONSTRAINT IF EXISTS cart_items_product_id_fkey;
ALTER TABLE IF EXISTS ONLY public.cart_items DROP CONSTRAINT IF EXISTS cart_items_cart_id_fkey;
ALTER TABLE IF EXISTS ONLY public.campaign_recipients DROP CONSTRAINT IF EXISTS campaign_recipients_customer_id_fkey;
ALTER TABLE IF EXISTS ONLY public.campaign_recipients DROP CONSTRAINT IF EXISTS campaign_recipients_campaign_id_fkey;
ALTER TABLE IF EXISTS ONLY public.branches DROP CONSTRAINT IF EXISTS branches_company_id_fkey;
ALTER TABLE IF EXISTS ONLY public.branch_traditional_items DROP CONSTRAINT IF EXISTS branch_traditional_items_item_id_fkey;
ALTER TABLE IF EXISTS ONLY public.branch_traditional_items DROP CONSTRAINT IF EXISTS branch_traditional_items_branch_id_fkey;
ALTER TABLE IF EXISTS ONLY public.audit_logs DROP CONSTRAINT IF EXISTS audit_logs_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.api_keys DROP CONSTRAINT IF EXISTS api_keys_created_by_fkey;
ALTER TABLE IF EXISTS ONLY public.activity_logs DROP CONSTRAINT IF EXISTS activity_logs_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.ab_test_assignments DROP CONSTRAINT IF EXISTS ab_test_assignments_test_id_fkey;
DROP INDEX IF EXISTS public.idx_session_expire;
DROP INDEX IF EXISTS public.idx_restore_jobs_status;
DROP INDEX IF EXISTS public.idx_branch_traditional_items_branch;
DROP INDEX IF EXISTS public.idx_branch_traditional_items_available;
DROP INDEX IF EXISTS public.idx_backup_schedules_active;
DROP INDEX IF EXISTS public.idx_backup_jobs_status;
DROP INDEX IF EXISTS public.idx_backup_jobs_created_by;
ALTER TABLE IF EXISTS ONLY public.wishlists DROP CONSTRAINT IF EXISTS wishlists_pkey;
ALTER TABLE IF EXISTS ONLY public.wishlist_items DROP CONSTRAINT IF EXISTS wishlist_items_wishlist_id_product_id_key;
ALTER TABLE IF EXISTS ONLY public.wishlist_items DROP CONSTRAINT IF EXISTS wishlist_items_pkey;
ALTER TABLE IF EXISTS ONLY public.webhooks DROP CONSTRAINT IF EXISTS webhooks_pkey;
ALTER TABLE IF EXISTS ONLY public.webhook_deliveries DROP CONSTRAINT IF EXISTS webhook_deliveries_pkey;
ALTER TABLE IF EXISTS ONLY public.vendors DROP CONSTRAINT IF EXISTS vendors_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_key;
ALTER TABLE IF EXISTS ONLY public.user_sessions DROP CONSTRAINT IF EXISTS user_sessions_session_token_key;
ALTER TABLE IF EXISTS ONLY public.user_sessions DROP CONSTRAINT IF EXISTS user_sessions_refresh_token_key;
ALTER TABLE IF EXISTS ONLY public.user_sessions DROP CONSTRAINT IF EXISTS user_sessions_pkey;
ALTER TABLE IF EXISTS ONLY public.user_roles DROP CONSTRAINT IF EXISTS user_roles_pkey;
ALTER TABLE IF EXISTS ONLY public.translations DROP CONSTRAINT IF EXISTS translations_pkey;
ALTER TABLE IF EXISTS ONLY public.translations DROP CONSTRAINT IF EXISTS translations_language_code_namespace_key_key;
ALTER TABLE IF EXISTS ONLY public.traditional_orders DROP CONSTRAINT IF EXISTS traditional_orders_pkey;
ALTER TABLE IF EXISTS ONLY public.traditional_order_items DROP CONSTRAINT IF EXISTS traditional_order_items_pkey;
ALTER TABLE IF EXISTS ONLY public.traditional_items DROP CONSTRAINT IF EXISTS traditional_items_pkey;
ALTER TABLE IF EXISTS ONLY public.tax_rates DROP CONSTRAINT IF EXISTS tax_rates_pkey;
ALTER TABLE IF EXISTS ONLY public.system_settings DROP CONSTRAINT IF EXISTS system_settings_pkey;
ALTER TABLE IF EXISTS ONLY public.system_settings DROP CONSTRAINT IF EXISTS system_settings_key_key;
ALTER TABLE IF EXISTS ONLY public.system_logs DROP CONSTRAINT IF EXISTS system_logs_pkey;
ALTER TABLE IF EXISTS ONLY public.support_tickets DROP CONSTRAINT IF EXISTS support_tickets_ticket_number_key;
ALTER TABLE IF EXISTS ONLY public.support_tickets DROP CONSTRAINT IF EXISTS support_tickets_pkey;
ALTER TABLE IF EXISTS ONLY public.support_ticket_messages DROP CONSTRAINT IF EXISTS support_ticket_messages_pkey;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_pkey;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_code_key;
ALTER TABLE IF EXISTS ONLY public.subscription_plans DROP CONSTRAINT IF EXISTS subscription_plans_pkey;
ALTER TABLE IF EXISTS ONLY public.stock_alerts DROP CONSTRAINT IF EXISTS stock_alerts_product_id_branch_id_alert_type_is_resolved_key;
ALTER TABLE IF EXISTS ONLY public.stock_alerts DROP CONSTRAINT IF EXISTS stock_alerts_pkey;
ALTER TABLE IF EXISTS ONLY public.states DROP CONSTRAINT IF EXISTS states_pkey;
ALTER TABLE IF EXISTS ONLY public.social_media_posts DROP CONSTRAINT IF EXISTS social_media_posts_pkey;
ALTER TABLE IF EXISTS ONLY public.shipping_methods DROP CONSTRAINT IF EXISTS shipping_methods_pkey;
ALTER TABLE IF EXISTS ONLY public.sessions DROP CONSTRAINT IF EXISTS sessions_pkey;
ALTER TABLE IF EXISTS ONLY public.seo_meta DROP CONSTRAINT IF EXISTS seo_meta_pkey;
ALTER TABLE IF EXISTS ONLY public.seo_meta DROP CONSTRAINT IF EXISTS seo_meta_entity_type_entity_id_key;
ALTER TABLE IF EXISTS ONLY public.search_queries DROP CONSTRAINT IF EXISTS search_queries_pkey;
ALTER TABLE IF EXISTS ONLY public.scheduled_tasks DROP CONSTRAINT IF EXISTS scheduled_tasks_pkey;
ALTER TABLE IF EXISTS ONLY public.sales_reports DROP CONSTRAINT IF EXISTS sales_reports_report_date_branch_id_key;
ALTER TABLE IF EXISTS ONLY public.sales_reports DROP CONSTRAINT IF EXISTS sales_reports_pkey;
ALTER TABLE IF EXISTS ONLY public.roles DROP CONSTRAINT IF EXISTS roles_pkey;
ALTER TABLE IF EXISTS ONLY public.roles DROP CONSTRAINT IF EXISTS roles_name_key;
ALTER TABLE IF EXISTS ONLY public.returns DROP CONSTRAINT IF EXISTS returns_return_number_key;
ALTER TABLE IF EXISTS ONLY public.returns DROP CONSTRAINT IF EXISTS returns_pkey;
ALTER TABLE IF EXISTS ONLY public.return_items DROP CONSTRAINT IF EXISTS return_items_pkey;
ALTER TABLE IF EXISTS ONLY public.restore_jobs DROP CONSTRAINT IF EXISTS restore_jobs_pkey;
ALTER TABLE IF EXISTS ONLY public.restore_jobs DROP CONSTRAINT IF EXISTS restore_jobs_job_id_key;
ALTER TABLE IF EXISTS ONLY public.rate_limits DROP CONSTRAINT IF EXISTS rate_limits_pkey;
ALTER TABLE IF EXISTS ONLY public.rate_limits DROP CONSTRAINT IF EXISTS rate_limits_identifier_endpoint_window_start_key;
ALTER TABLE IF EXISTS ONLY public.queue_jobs DROP CONSTRAINT IF EXISTS queue_jobs_pkey;
ALTER TABLE IF EXISTS ONLY public.purchase_orders DROP CONSTRAINT IF EXISTS purchase_orders_po_number_key;
ALTER TABLE IF EXISTS ONLY public.purchase_orders DROP CONSTRAINT IF EXISTS purchase_orders_pkey;
ALTER TABLE IF EXISTS ONLY public.purchase_order_items DROP CONSTRAINT IF EXISTS purchase_order_items_pkey;
ALTER TABLE IF EXISTS ONLY public.promotions DROP CONSTRAINT IF EXISTS promotions_pkey;
ALTER TABLE IF EXISTS ONLY public.promotions DROP CONSTRAINT IF EXISTS promotions_code_key;
ALTER TABLE IF EXISTS ONLY public.promotion_usage DROP CONSTRAINT IF EXISTS promotion_usage_pkey;
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS products_slug_key;
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS products_sku_key;
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS products_pkey;
ALTER TABLE IF EXISTS ONLY public.product_reviews DROP CONSTRAINT IF EXISTS product_reviews_pkey;
ALTER TABLE IF EXISTS ONLY public.product_questions DROP CONSTRAINT IF EXISTS product_questions_pkey;
ALTER TABLE IF EXISTS ONLY public.product_collections DROP CONSTRAINT IF EXISTS product_collections_slug_key;
ALTER TABLE IF EXISTS ONLY public.product_collections DROP CONSTRAINT IF EXISTS product_collections_pkey;
ALTER TABLE IF EXISTS ONLY public.product_collection_items DROP CONSTRAINT IF EXISTS product_collection_items_pkey;
ALTER TABLE IF EXISTS ONLY public.product_collection_items DROP CONSTRAINT IF EXISTS product_collection_items_collection_id_product_id_key;
ALTER TABLE IF EXISTS ONLY public.product_attributes DROP CONSTRAINT IF EXISTS product_attributes_pkey;
ALTER TABLE IF EXISTS ONLY public.product_attribute_values DROP CONSTRAINT IF EXISTS product_attribute_values_product_id_attribute_id_key;
ALTER TABLE IF EXISTS ONLY public.product_attribute_values DROP CONSTRAINT IF EXISTS product_attribute_values_pkey;
ALTER TABLE IF EXISTS ONLY public.product_answers DROP CONSTRAINT IF EXISTS product_answers_pkey;
ALTER TABLE IF EXISTS ONLY public.price_history DROP CONSTRAINT IF EXISTS price_history_pkey;
ALTER TABLE IF EXISTS ONLY public.performance_metrics DROP CONSTRAINT IF EXISTS performance_metrics_pkey;
ALTER TABLE IF EXISTS ONLY public.payments DROP CONSTRAINT IF EXISTS payments_pkey;
ALTER TABLE IF EXISTS ONLY public.orders DROP CONSTRAINT IF EXISTS orders_pkey;
ALTER TABLE IF EXISTS ONLY public.orders DROP CONSTRAINT IF EXISTS orders_order_number_key;
ALTER TABLE IF EXISTS ONLY public.order_items DROP CONSTRAINT IF EXISTS order_items_pkey;
ALTER TABLE IF EXISTS ONLY public.notifications DROP CONSTRAINT IF EXISTS notifications_pkey;
ALTER TABLE IF EXISTS ONLY public.marketplace_listings DROP CONSTRAINT IF EXISTS marketplace_listings_product_id_marketplace_key;
ALTER TABLE IF EXISTS ONLY public.marketplace_listings DROP CONSTRAINT IF EXISTS marketplace_listings_pkey;
ALTER TABLE IF EXISTS ONLY public.marketing_campaigns DROP CONSTRAINT IF EXISTS marketing_campaigns_pkey;
ALTER TABLE IF EXISTS ONLY public.loyalty_transactions DROP CONSTRAINT IF EXISTS loyalty_transactions_pkey;
ALTER TABLE IF EXISTS ONLY public.loyalty_rewards DROP CONSTRAINT IF EXISTS loyalty_rewards_pkey;
ALTER TABLE IF EXISTS ONLY public.label_templates DROP CONSTRAINT IF EXISTS label_templates_pkey;
ALTER TABLE IF EXISTS ONLY public.inventory_transactions DROP CONSTRAINT IF EXISTS inventory_transactions_pkey;
ALTER TABLE IF EXISTS ONLY public.inventory DROP CONSTRAINT IF EXISTS inventory_product_id_branch_id_key;
ALTER TABLE IF EXISTS ONLY public.inventory DROP CONSTRAINT IF EXISTS inventory_pkey;
ALTER TABLE IF EXISTS ONLY public.inventory_adjustments DROP CONSTRAINT IF EXISTS inventory_adjustments_pkey;
ALTER TABLE IF EXISTS ONLY public.integrations DROP CONSTRAINT IF EXISTS integrations_pkey;
ALTER TABLE IF EXISTS ONLY public.image_uploads DROP CONSTRAINT IF EXISTS image_uploads_pkey;
ALTER TABLE IF EXISTS ONLY public.health_checks DROP CONSTRAINT IF EXISTS health_checks_pkey;
ALTER TABLE IF EXISTS ONLY public.gift_cards DROP CONSTRAINT IF EXISTS gift_cards_pkey;
ALTER TABLE IF EXISTS ONLY public.gift_cards DROP CONSTRAINT IF EXISTS gift_cards_code_key;
ALTER TABLE IF EXISTS ONLY public.gift_card_transactions DROP CONSTRAINT IF EXISTS gift_card_transactions_pkey;
ALTER TABLE IF EXISTS ONLY public.feature_flags DROP CONSTRAINT IF EXISTS feature_flags_pkey;
ALTER TABLE IF EXISTS ONLY public.feature_flags DROP CONSTRAINT IF EXISTS feature_flags_name_key;
ALTER TABLE IF EXISTS ONLY public.expenses DROP CONSTRAINT IF EXISTS expenses_pkey;
ALTER TABLE IF EXISTS ONLY public.expenses DROP CONSTRAINT IF EXISTS expenses_expense_number_key;
ALTER TABLE IF EXISTS ONLY public.expense_categories DROP CONSTRAINT IF EXISTS expense_categories_pkey;
ALTER TABLE IF EXISTS ONLY public.employees DROP CONSTRAINT IF EXISTS employees_user_id_key;
ALTER TABLE IF EXISTS ONLY public.employees DROP CONSTRAINT IF EXISTS employees_pkey;
ALTER TABLE IF EXISTS ONLY public.employees DROP CONSTRAINT IF EXISTS employees_employee_id_key;
ALTER TABLE IF EXISTS ONLY public.employee_attendance DROP CONSTRAINT IF EXISTS employee_attendance_pkey;
ALTER TABLE IF EXISTS ONLY public.employee_attendance DROP CONSTRAINT IF EXISTS employee_attendance_employee_id_attendance_date_key;
ALTER TABLE IF EXISTS ONLY public.delivery_zones DROP CONSTRAINT IF EXISTS delivery_zones_pkey;
ALTER TABLE IF EXISTS ONLY public.delivery_schedules DROP CONSTRAINT IF EXISTS delivery_schedules_pkey;
ALTER TABLE IF EXISTS ONLY public.delivery_assignments DROP CONSTRAINT IF EXISTS delivery_assignments_pkey;
ALTER TABLE IF EXISTS ONLY public.data_privacy_requests DROP CONSTRAINT IF EXISTS data_privacy_requests_pkey;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_user_id_key;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_pkey;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_email_key;
ALTER TABLE IF EXISTS ONLY public.customer_subscriptions DROP CONSTRAINT IF EXISTS customer_subscriptions_pkey;
ALTER TABLE IF EXISTS ONLY public.customer_addresses DROP CONSTRAINT IF EXISTS customer_addresses_pkey;
ALTER TABLE IF EXISTS ONLY public.custom_template_dimensions DROP CONSTRAINT IF EXISTS custom_template_dimensions_pkey;
ALTER TABLE IF EXISTS ONLY public.currencies DROP CONSTRAINT IF EXISTS currencies_pkey;
ALTER TABLE IF EXISTS ONLY public.currencies DROP CONSTRAINT IF EXISTS currencies_code_key;
ALTER TABLE IF EXISTS ONLY public.countries DROP CONSTRAINT IF EXISTS countries_pkey;
ALTER TABLE IF EXISTS ONLY public.countries DROP CONSTRAINT IF EXISTS countries_code_key;
ALTER TABLE IF EXISTS ONLY public.content_versions DROP CONSTRAINT IF EXISTS content_versions_pkey;
ALTER TABLE IF EXISTS ONLY public.compliance_checks DROP CONSTRAINT IF EXISTS compliance_checks_pkey;
ALTER TABLE IF EXISTS ONLY public.companies DROP CONSTRAINT IF EXISTS companies_slug_key;
ALTER TABLE IF EXISTS ONLY public.companies DROP CONSTRAINT IF EXISTS companies_pkey;
ALTER TABLE IF EXISTS ONLY public.communication_templates DROP CONSTRAINT IF EXISTS communication_templates_pkey;
ALTER TABLE IF EXISTS ONLY public.communication_logs DROP CONSTRAINT IF EXISTS communication_logs_pkey;
ALTER TABLE IF EXISTS ONLY public.cms_pages DROP CONSTRAINT IF EXISTS cms_pages_slug_key;
ALTER TABLE IF EXISTS ONLY public.cms_pages DROP CONSTRAINT IF EXISTS cms_pages_pkey;
ALTER TABLE IF EXISTS ONLY public.cms_banners DROP CONSTRAINT IF EXISTS cms_banners_pkey;
ALTER TABLE IF EXISTS ONLY public.cities DROP CONSTRAINT IF EXISTS cities_pkey;
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS categories_slug_key;
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS categories_pkey;
ALTER TABLE IF EXISTS ONLY public.carts DROP CONSTRAINT IF EXISTS carts_pkey;
ALTER TABLE IF EXISTS ONLY public.cart_items DROP CONSTRAINT IF EXISTS cart_items_pkey;
ALTER TABLE IF EXISTS ONLY public.cart_items DROP CONSTRAINT IF EXISTS cart_items_cart_id_product_id_key;
ALTER TABLE IF EXISTS ONLY public.campaign_recipients DROP CONSTRAINT IF EXISTS campaign_recipients_pkey;
ALTER TABLE IF EXISTS ONLY public.cache_entries DROP CONSTRAINT IF EXISTS cache_entries_pkey;
ALTER TABLE IF EXISTS ONLY public.cache_entries DROP CONSTRAINT IF EXISTS cache_entries_cache_key_key;
ALTER TABLE IF EXISTS ONLY public.brands DROP CONSTRAINT IF EXISTS brands_slug_key;
ALTER TABLE IF EXISTS ONLY public.brands DROP CONSTRAINT IF EXISTS brands_pkey;
ALTER TABLE IF EXISTS ONLY public.branches DROP CONSTRAINT IF EXISTS branches_pkey;
ALTER TABLE IF EXISTS ONLY public.branch_traditional_items DROP CONSTRAINT IF EXISTS branch_traditional_items_pkey;
ALTER TABLE IF EXISTS ONLY public.branch_traditional_items DROP CONSTRAINT IF EXISTS branch_traditional_items_branch_id_item_id_key;
ALTER TABLE IF EXISTS ONLY public.backup_schedules DROP CONSTRAINT IF EXISTS backup_schedules_pkey;
ALTER TABLE IF EXISTS ONLY public.backup_logs DROP CONSTRAINT IF EXISTS backup_logs_pkey;
ALTER TABLE IF EXISTS ONLY public.backup_jobs DROP CONSTRAINT IF EXISTS backup_jobs_pkey;
ALTER TABLE IF EXISTS ONLY public.backup_jobs DROP CONSTRAINT IF EXISTS backup_jobs_job_id_key;
ALTER TABLE IF EXISTS ONLY public.audit_logs DROP CONSTRAINT IF EXISTS audit_logs_pkey;
ALTER TABLE IF EXISTS ONLY public.api_request_logs DROP CONSTRAINT IF EXISTS api_request_logs_pkey;
ALTER TABLE IF EXISTS ONLY public.api_keys DROP CONSTRAINT IF EXISTS api_keys_pkey;
ALTER TABLE IF EXISTS ONLY public.api_keys DROP CONSTRAINT IF EXISTS api_keys_key_hash_key;
ALTER TABLE IF EXISTS ONLY public.analytics_events DROP CONSTRAINT IF EXISTS analytics_events_pkey;
ALTER TABLE IF EXISTS ONLY public.activity_logs DROP CONSTRAINT IF EXISTS activity_logs_pkey;
ALTER TABLE IF EXISTS ONLY public.ab_tests DROP CONSTRAINT IF EXISTS ab_tests_pkey;
ALTER TABLE IF EXISTS ONLY public.ab_test_assignments DROP CONSTRAINT IF EXISTS ab_test_assignments_pkey;
ALTER TABLE IF EXISTS public.wishlists ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.wishlist_items ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.webhooks ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.webhook_deliveries ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.vendors ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.user_sessions ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.user_roles ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.translations ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.traditional_orders ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.traditional_order_items ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.traditional_items ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.tax_rates ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.system_settings ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.system_logs ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.support_tickets ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.support_ticket_messages ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.suppliers ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.subscription_plans ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.stock_alerts ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.states ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.social_media_posts ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.shipping_methods ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.seo_meta ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.search_queries ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.scheduled_tasks ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.sales_reports ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.roles ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.returns ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.return_items ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.restore_jobs ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.rate_limits ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.queue_jobs ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.purchase_orders ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.purchase_order_items ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.promotions ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.promotion_usage ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.products ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.product_reviews ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.product_questions ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.product_collections ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.product_collection_items ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.product_attributes ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.product_attribute_values ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.product_answers ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.price_history ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.performance_metrics ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.payments ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.orders ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.order_items ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.notifications ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.marketplace_listings ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.marketing_campaigns ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.loyalty_transactions ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.loyalty_rewards ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.label_templates ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.inventory_transactions ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.inventory_adjustments ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.inventory ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.integrations ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.image_uploads ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.health_checks ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.gift_cards ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.gift_card_transactions ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.feature_flags ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.expenses ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.expense_categories ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.employees ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.employee_attendance ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.delivery_zones ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.delivery_schedules ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.delivery_assignments ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.data_privacy_requests ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.customers ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.customer_subscriptions ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.customer_addresses ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.custom_template_dimensions ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.currencies ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.countries ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.content_versions ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.compliance_checks ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.companies ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.communication_templates ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.communication_logs ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.cms_pages ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.cms_banners ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.cities ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.categories ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.carts ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.cart_items ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.campaign_recipients ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.cache_entries ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.brands ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.branches ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.branch_traditional_items ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.backup_schedules ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.backup_logs ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.backup_jobs ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.audit_logs ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.api_request_logs ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.api_keys ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.analytics_events ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.activity_logs ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.ab_tests ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.ab_test_assignments ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.wishlists_id_seq;
DROP TABLE IF EXISTS public.wishlists;
DROP SEQUENCE IF EXISTS public.wishlist_items_id_seq;
DROP TABLE IF EXISTS public.wishlist_items;
DROP SEQUENCE IF EXISTS public.webhooks_id_seq;
DROP TABLE IF EXISTS public.webhooks;
DROP SEQUENCE IF EXISTS public.webhook_deliveries_id_seq;
DROP TABLE IF EXISTS public.webhook_deliveries;
DROP SEQUENCE IF EXISTS public.vendors_id_seq;
DROP TABLE IF EXISTS public.vendors;
DROP TABLE IF EXISTS public.users;
DROP SEQUENCE IF EXISTS public.user_sessions_id_seq;
DROP TABLE IF EXISTS public.user_sessions;
DROP SEQUENCE IF EXISTS public.user_roles_id_seq;
DROP TABLE IF EXISTS public.user_roles;
DROP SEQUENCE IF EXISTS public.translations_id_seq;
DROP TABLE IF EXISTS public.translations;
DROP SEQUENCE IF EXISTS public.traditional_orders_id_seq;
DROP TABLE IF EXISTS public.traditional_orders;
DROP SEQUENCE IF EXISTS public.traditional_order_items_id_seq;
DROP TABLE IF EXISTS public.traditional_order_items;
DROP SEQUENCE IF EXISTS public.traditional_items_id_seq;
DROP TABLE IF EXISTS public.traditional_items;
DROP SEQUENCE IF EXISTS public.tax_rates_id_seq;
DROP TABLE IF EXISTS public.tax_rates;
DROP SEQUENCE IF EXISTS public.system_settings_id_seq;
DROP TABLE IF EXISTS public.system_settings;
DROP SEQUENCE IF EXISTS public.system_logs_id_seq;
DROP TABLE IF EXISTS public.system_logs;
DROP SEQUENCE IF EXISTS public.support_tickets_id_seq;
DROP TABLE IF EXISTS public.support_tickets;
DROP SEQUENCE IF EXISTS public.support_ticket_messages_id_seq;
DROP TABLE IF EXISTS public.support_ticket_messages;
DROP SEQUENCE IF EXISTS public.suppliers_id_seq;
DROP TABLE IF EXISTS public.suppliers;
DROP SEQUENCE IF EXISTS public.subscription_plans_id_seq;
DROP TABLE IF EXISTS public.subscription_plans;
DROP SEQUENCE IF EXISTS public.stock_alerts_id_seq;
DROP TABLE IF EXISTS public.stock_alerts;
DROP SEQUENCE IF EXISTS public.states_id_seq;
DROP TABLE IF EXISTS public.states;
DROP SEQUENCE IF EXISTS public.social_media_posts_id_seq;
DROP TABLE IF EXISTS public.social_media_posts;
DROP SEQUENCE IF EXISTS public.shipping_methods_id_seq;
DROP TABLE IF EXISTS public.shipping_methods;
DROP TABLE IF EXISTS public.sessions;
DROP SEQUENCE IF EXISTS public.seo_meta_id_seq;
DROP TABLE IF EXISTS public.seo_meta;
DROP SEQUENCE IF EXISTS public.search_queries_id_seq;
DROP TABLE IF EXISTS public.search_queries;
DROP SEQUENCE IF EXISTS public.scheduled_tasks_id_seq;
DROP TABLE IF EXISTS public.scheduled_tasks;
DROP SEQUENCE IF EXISTS public.sales_reports_id_seq;
DROP TABLE IF EXISTS public.sales_reports;
DROP SEQUENCE IF EXISTS public.roles_id_seq;
DROP TABLE IF EXISTS public.roles;
DROP SEQUENCE IF EXISTS public.returns_id_seq;
DROP TABLE IF EXISTS public.returns;
DROP SEQUENCE IF EXISTS public.return_items_id_seq;
DROP TABLE IF EXISTS public.return_items;
DROP SEQUENCE IF EXISTS public.restore_jobs_id_seq;
DROP TABLE IF EXISTS public.restore_jobs;
DROP SEQUENCE IF EXISTS public.rate_limits_id_seq;
DROP TABLE IF EXISTS public.rate_limits;
DROP SEQUENCE IF EXISTS public.queue_jobs_id_seq;
DROP TABLE IF EXISTS public.queue_jobs;
DROP SEQUENCE IF EXISTS public.purchase_orders_id_seq;
DROP TABLE IF EXISTS public.purchase_orders;
DROP SEQUENCE IF EXISTS public.purchase_order_items_id_seq;
DROP TABLE IF EXISTS public.purchase_order_items;
DROP SEQUENCE IF EXISTS public.promotions_id_seq;
DROP TABLE IF EXISTS public.promotions;
DROP SEQUENCE IF EXISTS public.promotion_usage_id_seq;
DROP TABLE IF EXISTS public.promotion_usage;
DROP SEQUENCE IF EXISTS public.products_id_seq;
DROP TABLE IF EXISTS public.products;
DROP SEQUENCE IF EXISTS public.product_reviews_id_seq;
DROP TABLE IF EXISTS public.product_reviews;
DROP SEQUENCE IF EXISTS public.product_questions_id_seq;
DROP TABLE IF EXISTS public.product_questions;
DROP SEQUENCE IF EXISTS public.product_collections_id_seq;
DROP TABLE IF EXISTS public.product_collections;
DROP SEQUENCE IF EXISTS public.product_collection_items_id_seq;
DROP TABLE IF EXISTS public.product_collection_items;
DROP SEQUENCE IF EXISTS public.product_attributes_id_seq;
DROP TABLE IF EXISTS public.product_attributes;
DROP SEQUENCE IF EXISTS public.product_attribute_values_id_seq;
DROP TABLE IF EXISTS public.product_attribute_values;
DROP SEQUENCE IF EXISTS public.product_answers_id_seq;
DROP TABLE IF EXISTS public.product_answers;
DROP SEQUENCE IF EXISTS public.price_history_id_seq;
DROP TABLE IF EXISTS public.price_history;
DROP SEQUENCE IF EXISTS public.performance_metrics_id_seq;
DROP TABLE IF EXISTS public.performance_metrics;
DROP SEQUENCE IF EXISTS public.payments_id_seq;
DROP TABLE IF EXISTS public.payments;
DROP SEQUENCE IF EXISTS public.orders_id_seq;
DROP TABLE IF EXISTS public.orders;
DROP SEQUENCE IF EXISTS public.order_items_id_seq;
DROP TABLE IF EXISTS public.order_items;
DROP SEQUENCE IF EXISTS public.notifications_id_seq;
DROP TABLE IF EXISTS public.notifications;
DROP SEQUENCE IF EXISTS public.marketplace_listings_id_seq;
DROP TABLE IF EXISTS public.marketplace_listings;
DROP SEQUENCE IF EXISTS public.marketing_campaigns_id_seq;
DROP TABLE IF EXISTS public.marketing_campaigns;
DROP SEQUENCE IF EXISTS public.loyalty_transactions_id_seq;
DROP TABLE IF EXISTS public.loyalty_transactions;
DROP SEQUENCE IF EXISTS public.loyalty_rewards_id_seq;
DROP TABLE IF EXISTS public.loyalty_rewards;
DROP SEQUENCE IF EXISTS public.label_templates_id_seq;
DROP TABLE IF EXISTS public.label_templates;
DROP SEQUENCE IF EXISTS public.inventory_transactions_id_seq;
DROP TABLE IF EXISTS public.inventory_transactions;
DROP SEQUENCE IF EXISTS public.inventory_id_seq;
DROP SEQUENCE IF EXISTS public.inventory_adjustments_id_seq;
DROP TABLE IF EXISTS public.inventory_adjustments;
DROP TABLE IF EXISTS public.inventory;
DROP SEQUENCE IF EXISTS public.integrations_id_seq;
DROP TABLE IF EXISTS public.integrations;
DROP SEQUENCE IF EXISTS public.image_uploads_id_seq;
DROP TABLE IF EXISTS public.image_uploads;
DROP SEQUENCE IF EXISTS public.health_checks_id_seq;
DROP TABLE IF EXISTS public.health_checks;
DROP SEQUENCE IF EXISTS public.gift_cards_id_seq;
DROP TABLE IF EXISTS public.gift_cards;
DROP SEQUENCE IF EXISTS public.gift_card_transactions_id_seq;
DROP TABLE IF EXISTS public.gift_card_transactions;
DROP SEQUENCE IF EXISTS public.feature_flags_id_seq;
DROP TABLE IF EXISTS public.feature_flags;
DROP SEQUENCE IF EXISTS public.expenses_id_seq;
DROP TABLE IF EXISTS public.expenses;
DROP SEQUENCE IF EXISTS public.expense_categories_id_seq;
DROP TABLE IF EXISTS public.expense_categories;
DROP SEQUENCE IF EXISTS public.employees_id_seq;
DROP TABLE IF EXISTS public.employees;
DROP SEQUENCE IF EXISTS public.employee_attendance_id_seq;
DROP TABLE IF EXISTS public.employee_attendance;
DROP SEQUENCE IF EXISTS public.delivery_zones_id_seq;
DROP TABLE IF EXISTS public.delivery_zones;
DROP SEQUENCE IF EXISTS public.delivery_schedules_id_seq;
DROP TABLE IF EXISTS public.delivery_schedules;
DROP SEQUENCE IF EXISTS public.delivery_assignments_id_seq;
DROP TABLE IF EXISTS public.delivery_assignments;
DROP SEQUENCE IF EXISTS public.data_privacy_requests_id_seq;
DROP TABLE IF EXISTS public.data_privacy_requests;
DROP SEQUENCE IF EXISTS public.customers_id_seq;
DROP TABLE IF EXISTS public.customers;
DROP SEQUENCE IF EXISTS public.customer_subscriptions_id_seq;
DROP TABLE IF EXISTS public.customer_subscriptions;
DROP SEQUENCE IF EXISTS public.customer_addresses_id_seq;
DROP TABLE IF EXISTS public.customer_addresses;
DROP SEQUENCE IF EXISTS public.custom_template_dimensions_id_seq;
DROP TABLE IF EXISTS public.custom_template_dimensions;
DROP SEQUENCE IF EXISTS public.currencies_id_seq;
DROP TABLE IF EXISTS public.currencies;
DROP SEQUENCE IF EXISTS public.countries_id_seq;
DROP TABLE IF EXISTS public.countries;
DROP SEQUENCE IF EXISTS public.content_versions_id_seq;
DROP TABLE IF EXISTS public.content_versions;
DROP SEQUENCE IF EXISTS public.compliance_checks_id_seq;
DROP TABLE IF EXISTS public.compliance_checks;
DROP SEQUENCE IF EXISTS public.companies_id_seq;
DROP TABLE IF EXISTS public.companies;
DROP SEQUENCE IF EXISTS public.communication_templates_id_seq;
DROP TABLE IF EXISTS public.communication_templates;
DROP SEQUENCE IF EXISTS public.communication_logs_id_seq;
DROP TABLE IF EXISTS public.communication_logs;
DROP SEQUENCE IF EXISTS public.cms_pages_id_seq;
DROP TABLE IF EXISTS public.cms_pages;
DROP SEQUENCE IF EXISTS public.cms_banners_id_seq;
DROP TABLE IF EXISTS public.cms_banners;
DROP SEQUENCE IF EXISTS public.cities_id_seq;
DROP TABLE IF EXISTS public.cities;
DROP SEQUENCE IF EXISTS public.categories_id_seq;
DROP TABLE IF EXISTS public.categories;
DROP SEQUENCE IF EXISTS public.carts_id_seq;
DROP TABLE IF EXISTS public.carts;
DROP SEQUENCE IF EXISTS public.cart_items_id_seq;
DROP TABLE IF EXISTS public.cart_items;
DROP SEQUENCE IF EXISTS public.campaign_recipients_id_seq;
DROP TABLE IF EXISTS public.campaign_recipients;
DROP SEQUENCE IF EXISTS public.cache_entries_id_seq;
DROP TABLE IF EXISTS public.cache_entries;
DROP SEQUENCE IF EXISTS public.brands_id_seq;
DROP TABLE IF EXISTS public.brands;
DROP SEQUENCE IF EXISTS public.branches_id_seq;
DROP TABLE IF EXISTS public.branches;
DROP SEQUENCE IF EXISTS public.branch_traditional_items_id_seq;
DROP TABLE IF EXISTS public.branch_traditional_items;
DROP SEQUENCE IF EXISTS public.backup_schedules_id_seq;
DROP TABLE IF EXISTS public.backup_schedules;
DROP SEQUENCE IF EXISTS public.backup_logs_id_seq;
DROP TABLE IF EXISTS public.backup_logs;
DROP SEQUENCE IF EXISTS public.backup_jobs_id_seq;
DROP TABLE IF EXISTS public.backup_jobs;
DROP SEQUENCE IF EXISTS public.audit_logs_id_seq;
DROP TABLE IF EXISTS public.audit_logs;
DROP SEQUENCE IF EXISTS public.api_request_logs_id_seq;
DROP TABLE IF EXISTS public.api_request_logs;
DROP SEQUENCE IF EXISTS public.api_keys_id_seq;
DROP TABLE IF EXISTS public.api_keys;
DROP SEQUENCE IF EXISTS public.analytics_events_id_seq;
DROP TABLE IF EXISTS public.analytics_events;
DROP SEQUENCE IF EXISTS public.activity_logs_id_seq;
DROP TABLE IF EXISTS public.activity_logs;
DROP SEQUENCE IF EXISTS public.ab_tests_id_seq;
DROP TABLE IF EXISTS public.ab_tests;
DROP SEQUENCE IF EXISTS public.ab_test_assignments_id_seq;
DROP TABLE IF EXISTS public.ab_test_assignments;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ab_test_assignments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ab_test_assignments (
    id integer NOT NULL,
    test_id integer NOT NULL,
    user_id character varying(255),
    session_id character varying(255),
    variant character varying(100) NOT NULL,
    assigned_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: ab_test_assignments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ab_test_assignments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ab_test_assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ab_test_assignments_id_seq OWNED BY public.ab_test_assignments.id;


--
-- Name: ab_tests; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: ab_tests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ab_tests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ab_tests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ab_tests_id_seq OWNED BY public.ab_tests.id;


--
-- Name: activity_logs; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: activity_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.activity_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: activity_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.activity_logs_id_seq OWNED BY public.activity_logs.id;


--
-- Name: analytics_events; Type: TABLE; Schema: public; Owner: -
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
-- Name: api_keys; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: api_keys_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.api_keys_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: api_keys_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.api_keys_id_seq OWNED BY public.api_keys.id;


--
-- Name: api_request_logs; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: api_request_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.api_request_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: api_request_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.api_request_logs_id_seq OWNED BY public.api_request_logs.id;


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.audit_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
-- Name: backup_jobs; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: backup_jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.backup_jobs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: backup_jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.backup_jobs_id_seq OWNED BY public.backup_jobs.id;


--
-- Name: backup_logs; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: backup_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.backup_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: backup_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.backup_logs_id_seq OWNED BY public.backup_logs.id;


--
-- Name: backup_schedules; Type: TABLE; Schema: public; Owner: -
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
-- Name: branch_traditional_items; Type: TABLE; Schema: public; Owner: -
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
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: branch_traditional_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.branch_traditional_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: branch_traditional_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.branch_traditional_items_id_seq OWNED BY public.branch_traditional_items.id;


--
-- Name: branches; Type: TABLE; Schema: public; Owner: -
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
-- Name: brands; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: brands_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.brands_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: brands_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.brands_id_seq OWNED BY public.brands.id;


--
-- Name: cache_entries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cache_entries (
    id integer NOT NULL,
    cache_key character varying(255) NOT NULL,
    cache_value text NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: cache_entries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cache_entries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cache_entries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cache_entries_id_seq OWNED BY public.cache_entries.id;


--
-- Name: campaign_recipients; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: campaign_recipients_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.campaign_recipients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: campaign_recipients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.campaign_recipients_id_seq OWNED BY public.campaign_recipients.id;


--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cart_items (
    id integer NOT NULL,
    cart_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    total_price numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: cart_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cart_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cart_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cart_items_id_seq OWNED BY public.cart_items.id;


--
-- Name: carts; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: carts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.carts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: carts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.carts_id_seq OWNED BY public.carts.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
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
-- Name: cities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cities (
    id integer NOT NULL,
    state_id integer NOT NULL,
    name character varying(100) NOT NULL,
    latitude numeric(10,8),
    longitude numeric(11,8),
    is_active boolean DEFAULT true
);


--
-- Name: cities_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cities_id_seq OWNED BY public.cities.id;


--
-- Name: cms_banners; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: cms_banners_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cms_banners_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cms_banners_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cms_banners_id_seq OWNED BY public.cms_banners.id;


--
-- Name: cms_pages; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: cms_pages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cms_pages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cms_pages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cms_pages_id_seq OWNED BY public.cms_pages.id;


--
-- Name: communication_logs; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: communication_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.communication_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: communication_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.communication_logs_id_seq OWNED BY public.communication_logs.id;


--
-- Name: communication_templates; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: communication_templates_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.communication_templates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: communication_templates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.communication_templates_id_seq OWNED BY public.communication_templates.id;


--
-- Name: companies; Type: TABLE; Schema: public; Owner: -
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
-- Name: compliance_checks; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: compliance_checks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.compliance_checks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: compliance_checks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.compliance_checks_id_seq OWNED BY public.compliance_checks.id;


--
-- Name: content_versions; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: content_versions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.content_versions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: content_versions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.content_versions_id_seq OWNED BY public.content_versions.id;


--
-- Name: countries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.countries (
    id integer NOT NULL,
    code character varying(2) NOT NULL,
    name character varying(100) NOT NULL,
    currency_code character varying(3),
    phone_code character varying(10),
    is_active boolean DEFAULT true
);


--
-- Name: countries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.countries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: countries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.countries_id_seq OWNED BY public.countries.id;


--
-- Name: currencies; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: currencies_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.currencies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: currencies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.currencies_id_seq OWNED BY public.currencies.id;


--
-- Name: custom_template_dimensions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.custom_template_dimensions (
    id integer NOT NULL,
    template_name character varying(255) NOT NULL,
    width numeric(8,2) NOT NULL,
    height numeric(8,2) NOT NULL,
    unit character varying(10) DEFAULT 'mm'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: custom_template_dimensions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.custom_template_dimensions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: custom_template_dimensions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.custom_template_dimensions_id_seq OWNED BY public.custom_template_dimensions.id;


--
-- Name: customer_addresses; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: customer_addresses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.customer_addresses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: customer_addresses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.customer_addresses_id_seq OWNED BY public.customer_addresses.id;


--
-- Name: customer_subscriptions; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: customer_subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.customer_subscriptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: customer_subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.customer_subscriptions_id_seq OWNED BY public.customer_subscriptions.id;


--
-- Name: customers; Type: TABLE; Schema: public; Owner: -
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
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: customers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.customers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.customers_id_seq OWNED BY public.customers.id;


--
-- Name: data_privacy_requests; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: data_privacy_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.data_privacy_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: data_privacy_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.data_privacy_requests_id_seq OWNED BY public.data_privacy_requests.id;


--
-- Name: delivery_assignments; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: delivery_assignments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.delivery_assignments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: delivery_assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.delivery_assignments_id_seq OWNED BY public.delivery_assignments.id;


--
-- Name: delivery_schedules; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: delivery_schedules_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.delivery_schedules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: delivery_schedules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.delivery_schedules_id_seq OWNED BY public.delivery_schedules.id;


--
-- Name: delivery_zones; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: delivery_zones_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.delivery_zones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: delivery_zones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.delivery_zones_id_seq OWNED BY public.delivery_zones.id;


--
-- Name: employee_attendance; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: employee_attendance_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.employee_attendance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: employee_attendance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.employee_attendance_id_seq OWNED BY public.employee_attendance.id;


--
-- Name: employees; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: employees_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.employees_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: employees_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.employees_id_seq OWNED BY public.employees.id;


--
-- Name: expense_categories; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: expense_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.expense_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: expense_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.expense_categories_id_seq OWNED BY public.expense_categories.id;


--
-- Name: expenses; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: expenses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.expenses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: expenses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.expenses_id_seq OWNED BY public.expenses.id;


--
-- Name: feature_flags; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: feature_flags_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.feature_flags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: feature_flags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.feature_flags_id_seq OWNED BY public.feature_flags.id;


--
-- Name: gift_card_transactions; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: gift_card_transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.gift_card_transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: gift_card_transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.gift_card_transactions_id_seq OWNED BY public.gift_card_transactions.id;


--
-- Name: gift_cards; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: gift_cards_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.gift_cards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: gift_cards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.gift_cards_id_seq OWNED BY public.gift_cards.id;


--
-- Name: health_checks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.health_checks (
    id integer NOT NULL,
    service_name character varying(100) NOT NULL,
    status character varying(20) NOT NULL,
    response_time integer,
    error_message text,
    checked_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: health_checks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.health_checks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: health_checks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.health_checks_id_seq OWNED BY public.health_checks.id;


--
-- Name: image_uploads; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: image_uploads_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.image_uploads_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: image_uploads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.image_uploads_id_seq OWNED BY public.image_uploads.id;


--
-- Name: integrations; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: integrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.integrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: integrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.integrations_id_seq OWNED BY public.integrations.id;


--
-- Name: inventory; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: inventory_adjustments; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: inventory_adjustments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.inventory_adjustments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: inventory_adjustments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.inventory_adjustments_id_seq OWNED BY public.inventory_adjustments.id;


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
-- Name: inventory_transactions; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: inventory_transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.inventory_transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: inventory_transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.inventory_transactions_id_seq OWNED BY public.inventory_transactions.id;


--
-- Name: label_templates; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: label_templates_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.label_templates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: label_templates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.label_templates_id_seq OWNED BY public.label_templates.id;


--
-- Name: loyalty_rewards; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: loyalty_rewards_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.loyalty_rewards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: loyalty_rewards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.loyalty_rewards_id_seq OWNED BY public.loyalty_rewards.id;


--
-- Name: loyalty_transactions; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: loyalty_transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.loyalty_transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: loyalty_transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.loyalty_transactions_id_seq OWNED BY public.loyalty_transactions.id;


--
-- Name: marketing_campaigns; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: marketing_campaigns_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.marketing_campaigns_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: marketing_campaigns_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.marketing_campaigns_id_seq OWNED BY public.marketing_campaigns.id;


--
-- Name: marketplace_listings; Type: TABLE; Schema: public; Owner: -
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
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: -
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
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- Name: performance_metrics; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: performance_metrics_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.performance_metrics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: performance_metrics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.performance_metrics_id_seq OWNED BY public.performance_metrics.id;


--
-- Name: price_history; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: price_history_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.price_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: price_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.price_history_id_seq OWNED BY public.price_history.id;


--
-- Name: product_answers; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: product_answers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.product_answers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: product_answers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.product_answers_id_seq OWNED BY public.product_answers.id;


--
-- Name: product_attribute_values; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_attribute_values (
    id integer NOT NULL,
    product_id integer NOT NULL,
    attribute_id integer NOT NULL,
    value text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: product_attribute_values_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.product_attribute_values_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: product_attribute_values_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.product_attribute_values_id_seq OWNED BY public.product_attribute_values.id;


--
-- Name: product_attributes; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: product_attributes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.product_attributes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: product_attributes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.product_attributes_id_seq OWNED BY public.product_attributes.id;


--
-- Name: product_collection_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_collection_items (
    id integer NOT NULL,
    collection_id integer NOT NULL,
    product_id integer NOT NULL,
    sort_order integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: product_collection_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.product_collection_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: product_collection_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.product_collection_items_id_seq OWNED BY public.product_collection_items.id;


--
-- Name: product_collections; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: product_collections_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.product_collections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: product_collections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.product_collections_id_seq OWNED BY public.product_collections.id;


--
-- Name: product_questions; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: product_questions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.product_questions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: product_questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.product_questions_id_seq OWNED BY public.product_questions.id;


--
-- Name: product_reviews; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: product_reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.product_reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: product_reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.product_reviews_id_seq OWNED BY public.product_reviews.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    name_telugu character varying(255),
    slug character varying(255) NOT NULL,
    description text,
    description_telugu text,
    short_description text,
    sku character varying(100) NOT NULL,
    barcode character varying(100),
    category_id integer,
    selling_price numeric(10,2) NOT NULL,
    mrp numeric(10,2),
    cost_price numeric(10,2),
    unit character varying(50) DEFAULT 'kg'::character varying,
    weight numeric(8,3),
    dimensions jsonb,
    image_url character varying(500),
    images jsonb,
    tags jsonb,
    attributes jsonb,
    nutritional_info jsonb,
    organic_certification jsonb,
    is_featured boolean DEFAULT false,
    is_digital boolean DEFAULT false,
    status character varying(20) DEFAULT 'active'::character varying,
    seo_title character varying(255),
    seo_description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    brand_id integer
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
-- Name: promotion_usage; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.promotion_usage (
    id integer NOT NULL,
    promotion_id integer NOT NULL,
    customer_id integer NOT NULL,
    order_id integer NOT NULL,
    discount_amount numeric(10,2) NOT NULL,
    used_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: promotion_usage_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.promotion_usage_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: promotion_usage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.promotion_usage_id_seq OWNED BY public.promotion_usage.id;


--
-- Name: promotions; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: promotions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.promotions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: promotions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.promotions_id_seq OWNED BY public.promotions.id;


--
-- Name: purchase_order_items; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: purchase_order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.purchase_order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: purchase_order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.purchase_order_items_id_seq OWNED BY public.purchase_order_items.id;


--
-- Name: purchase_orders; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: purchase_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.purchase_orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: purchase_orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.purchase_orders_id_seq OWNED BY public.purchase_orders.id;


--
-- Name: queue_jobs; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: queue_jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.queue_jobs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: queue_jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.queue_jobs_id_seq OWNED BY public.queue_jobs.id;


--
-- Name: rate_limits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rate_limits (
    id integer NOT NULL,
    identifier character varying(255) NOT NULL,
    endpoint character varying(255) NOT NULL,
    requests_count integer DEFAULT 1,
    window_start timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: rate_limits_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.rate_limits_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: rate_limits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.rate_limits_id_seq OWNED BY public.rate_limits.id;


--
-- Name: restore_jobs; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: restore_jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.restore_jobs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: restore_jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.restore_jobs_id_seq OWNED BY public.restore_jobs.id;


--
-- Name: return_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.return_items (
    id integer NOT NULL,
    return_id integer NOT NULL,
    order_item_id integer NOT NULL,
    quantity integer NOT NULL,
    condition character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: return_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.return_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: return_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.return_items_id_seq OWNED BY public.return_items.id;


--
-- Name: returns; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: returns_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.returns_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: returns_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.returns_id_seq OWNED BY public.returns.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: sales_reports; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: sales_reports_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sales_reports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sales_reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sales_reports_id_seq OWNED BY public.sales_reports.id;


--
-- Name: scheduled_tasks; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: scheduled_tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.scheduled_tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: scheduled_tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.scheduled_tasks_id_seq OWNED BY public.scheduled_tasks.id;


--
-- Name: search_queries; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: search_queries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.search_queries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: search_queries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.search_queries_id_seq OWNED BY public.search_queries.id;


--
-- Name: seo_meta; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: seo_meta_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.seo_meta_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: seo_meta_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.seo_meta_id_seq OWNED BY public.seo_meta.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    sid character varying(255) NOT NULL,
    sess jsonb NOT NULL,
    expire timestamp without time zone NOT NULL
);


--
-- Name: shipping_methods; Type: TABLE; Schema: public; Owner: -
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
-- Name: social_media_posts; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: social_media_posts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.social_media_posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: social_media_posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.social_media_posts_id_seq OWNED BY public.social_media_posts.id;


--
-- Name: states; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.states (
    id integer NOT NULL,
    country_id integer NOT NULL,
    code character varying(10) NOT NULL,
    name character varying(100) NOT NULL,
    is_active boolean DEFAULT true
);


--
-- Name: states_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.states_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: states_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.states_id_seq OWNED BY public.states.id;


--
-- Name: stock_alerts; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: stock_alerts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.stock_alerts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: stock_alerts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.stock_alerts_id_seq OWNED BY public.stock_alerts.id;


--
-- Name: subscription_plans; Type: TABLE; Schema: public; Owner: -
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
-- Name: support_ticket_messages; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: support_ticket_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.support_ticket_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: support_ticket_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.support_ticket_messages_id_seq OWNED BY public.support_ticket_messages.id;


--
-- Name: support_tickets; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: support_tickets_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.support_tickets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: support_tickets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.support_tickets_id_seq OWNED BY public.support_tickets.id;


--
-- Name: system_logs; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: system_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.system_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: system_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.system_logs_id_seq OWNED BY public.system_logs.id;


--
-- Name: system_settings; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: system_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.system_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: system_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.system_settings_id_seq OWNED BY public.system_settings.id;


--
-- Name: tax_rates; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: tax_rates_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tax_rates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tax_rates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tax_rates_id_seq OWNED BY public.tax_rates.id;


--
-- Name: traditional_items; Type: TABLE; Schema: public; Owner: -
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
    created_at timestamp without time zone DEFAULT now()
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
    CONSTRAINT traditional_orders_quality_tier_check CHECK (((quality_tier)::text = ANY ((ARRAY['ordinary'::character varying, 'medium'::character varying, 'best'::character varying])::text[])))
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
    language_code character varying(10) NOT NULL,
    namespace character varying(100) NOT NULL,
    key character varying(255) NOT NULL,
    value text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
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
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: user_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_roles_id_seq OWNED BY public.user_roles.id;


--
-- Name: user_sessions; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: user_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_sessions_id_seq OWNED BY public.user_sessions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
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
-- Name: webhook_deliveries; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: webhook_deliveries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.webhook_deliveries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: webhook_deliveries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.webhook_deliveries_id_seq OWNED BY public.webhook_deliveries.id;


--
-- Name: webhooks; Type: TABLE; Schema: public; Owner: -
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
-- Name: wishlist_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.wishlist_items (
    id integer NOT NULL,
    wishlist_id integer NOT NULL,
    product_id integer NOT NULL,
    added_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: wishlist_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.wishlist_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: wishlist_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.wishlist_items_id_seq OWNED BY public.wishlist_items.id;


--
-- Name: wishlists; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.wishlists (
    id integer NOT NULL,
    customer_id integer NOT NULL,
    name character varying(255) DEFAULT 'My Wishlist'::character varying,
    is_public boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: wishlists_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.wishlists_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: wishlists_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.wishlists_id_seq OWNED BY public.wishlists.id;


--
-- Name: ab_test_assignments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ab_test_assignments ALTER COLUMN id SET DEFAULT nextval('public.ab_test_assignments_id_seq'::regclass);


--
-- Name: ab_tests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ab_tests ALTER COLUMN id SET DEFAULT nextval('public.ab_tests_id_seq'::regclass);


--
-- Name: activity_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_logs ALTER COLUMN id SET DEFAULT nextval('public.activity_logs_id_seq'::regclass);


--
-- Name: analytics_events id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analytics_events ALTER COLUMN id SET DEFAULT nextval('public.analytics_events_id_seq'::regclass);


--
-- Name: api_keys id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_keys ALTER COLUMN id SET DEFAULT nextval('public.api_keys_id_seq'::regclass);


--
-- Name: api_request_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_request_logs ALTER COLUMN id SET DEFAULT nextval('public.api_request_logs_id_seq'::regclass);


--
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- Name: backup_jobs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.backup_jobs ALTER COLUMN id SET DEFAULT nextval('public.backup_jobs_id_seq'::regclass);


--
-- Name: backup_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.backup_logs ALTER COLUMN id SET DEFAULT nextval('public.backup_logs_id_seq'::regclass);


--
-- Name: backup_schedules id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.backup_schedules ALTER COLUMN id SET DEFAULT nextval('public.backup_schedules_id_seq'::regclass);


--
-- Name: branch_traditional_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.branch_traditional_items ALTER COLUMN id SET DEFAULT nextval('public.branch_traditional_items_id_seq'::regclass);


--
-- Name: branches id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.branches ALTER COLUMN id SET DEFAULT nextval('public.branches_id_seq'::regclass);


--
-- Name: brands id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brands ALTER COLUMN id SET DEFAULT nextval('public.brands_id_seq'::regclass);


--
-- Name: cache_entries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cache_entries ALTER COLUMN id SET DEFAULT nextval('public.cache_entries_id_seq'::regclass);


--
-- Name: campaign_recipients id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_recipients ALTER COLUMN id SET DEFAULT nextval('public.campaign_recipients_id_seq'::regclass);


--
-- Name: cart_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items ALTER COLUMN id SET DEFAULT nextval('public.cart_items_id_seq'::regclass);


--
-- Name: carts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts ALTER COLUMN id SET DEFAULT nextval('public.carts_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: cities id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cities ALTER COLUMN id SET DEFAULT nextval('public.cities_id_seq'::regclass);


--
-- Name: cms_banners id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cms_banners ALTER COLUMN id SET DEFAULT nextval('public.cms_banners_id_seq'::regclass);


--
-- Name: cms_pages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cms_pages ALTER COLUMN id SET DEFAULT nextval('public.cms_pages_id_seq'::regclass);


--
-- Name: communication_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communication_logs ALTER COLUMN id SET DEFAULT nextval('public.communication_logs_id_seq'::regclass);


--
-- Name: communication_templates id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communication_templates ALTER COLUMN id SET DEFAULT nextval('public.communication_templates_id_seq'::regclass);


--
-- Name: companies id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.companies ALTER COLUMN id SET DEFAULT nextval('public.companies_id_seq'::regclass);


--
-- Name: compliance_checks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compliance_checks ALTER COLUMN id SET DEFAULT nextval('public.compliance_checks_id_seq'::regclass);


--
-- Name: content_versions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_versions ALTER COLUMN id SET DEFAULT nextval('public.content_versions_id_seq'::regclass);


--
-- Name: countries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.countries ALTER COLUMN id SET DEFAULT nextval('public.countries_id_seq'::regclass);


--
-- Name: currencies id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.currencies ALTER COLUMN id SET DEFAULT nextval('public.currencies_id_seq'::regclass);


--
-- Name: custom_template_dimensions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.custom_template_dimensions ALTER COLUMN id SET DEFAULT nextval('public.custom_template_dimensions_id_seq'::regclass);


--
-- Name: customer_addresses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_addresses ALTER COLUMN id SET DEFAULT nextval('public.customer_addresses_id_seq'::regclass);


--
-- Name: customer_subscriptions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_subscriptions ALTER COLUMN id SET DEFAULT nextval('public.customer_subscriptions_id_seq'::regclass);


--
-- Name: customers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers ALTER COLUMN id SET DEFAULT nextval('public.customers_id_seq'::regclass);


--
-- Name: data_privacy_requests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_privacy_requests ALTER COLUMN id SET DEFAULT nextval('public.data_privacy_requests_id_seq'::regclass);


--
-- Name: delivery_assignments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.delivery_assignments ALTER COLUMN id SET DEFAULT nextval('public.delivery_assignments_id_seq'::regclass);


--
-- Name: delivery_schedules id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.delivery_schedules ALTER COLUMN id SET DEFAULT nextval('public.delivery_schedules_id_seq'::regclass);


--
-- Name: delivery_zones id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.delivery_zones ALTER COLUMN id SET DEFAULT nextval('public.delivery_zones_id_seq'::regclass);


--
-- Name: employee_attendance id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_attendance ALTER COLUMN id SET DEFAULT nextval('public.employee_attendance_id_seq'::regclass);


--
-- Name: employees id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employees ALTER COLUMN id SET DEFAULT nextval('public.employees_id_seq'::regclass);


--
-- Name: expense_categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.expense_categories ALTER COLUMN id SET DEFAULT nextval('public.expense_categories_id_seq'::regclass);


--
-- Name: expenses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.expenses ALTER COLUMN id SET DEFAULT nextval('public.expenses_id_seq'::regclass);


--
-- Name: feature_flags id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feature_flags ALTER COLUMN id SET DEFAULT nextval('public.feature_flags_id_seq'::regclass);


--
-- Name: gift_card_transactions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gift_card_transactions ALTER COLUMN id SET DEFAULT nextval('public.gift_card_transactions_id_seq'::regclass);


--
-- Name: gift_cards id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gift_cards ALTER COLUMN id SET DEFAULT nextval('public.gift_cards_id_seq'::regclass);


--
-- Name: health_checks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.health_checks ALTER COLUMN id SET DEFAULT nextval('public.health_checks_id_seq'::regclass);


--
-- Name: image_uploads id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.image_uploads ALTER COLUMN id SET DEFAULT nextval('public.image_uploads_id_seq'::regclass);


--
-- Name: integrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.integrations ALTER COLUMN id SET DEFAULT nextval('public.integrations_id_seq'::regclass);


--
-- Name: inventory id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventory ALTER COLUMN id SET DEFAULT nextval('public.inventory_id_seq'::regclass);


--
-- Name: inventory_adjustments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventory_adjustments ALTER COLUMN id SET DEFAULT nextval('public.inventory_adjustments_id_seq'::regclass);


--
-- Name: inventory_transactions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventory_transactions ALTER COLUMN id SET DEFAULT nextval('public.inventory_transactions_id_seq'::regclass);


--
-- Name: label_templates id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.label_templates ALTER COLUMN id SET DEFAULT nextval('public.label_templates_id_seq'::regclass);


--
-- Name: loyalty_rewards id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.loyalty_rewards ALTER COLUMN id SET DEFAULT nextval('public.loyalty_rewards_id_seq'::regclass);


--
-- Name: loyalty_transactions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.loyalty_transactions ALTER COLUMN id SET DEFAULT nextval('public.loyalty_transactions_id_seq'::regclass);


--
-- Name: marketing_campaigns id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marketing_campaigns ALTER COLUMN id SET DEFAULT nextval('public.marketing_campaigns_id_seq'::regclass);


--
-- Name: marketplace_listings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marketplace_listings ALTER COLUMN id SET DEFAULT nextval('public.marketplace_listings_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- Name: performance_metrics id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.performance_metrics ALTER COLUMN id SET DEFAULT nextval('public.performance_metrics_id_seq'::regclass);


--
-- Name: price_history id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.price_history ALTER COLUMN id SET DEFAULT nextval('public.price_history_id_seq'::regclass);


--
-- Name: product_answers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_answers ALTER COLUMN id SET DEFAULT nextval('public.product_answers_id_seq'::regclass);


--
-- Name: product_attribute_values id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_attribute_values ALTER COLUMN id SET DEFAULT nextval('public.product_attribute_values_id_seq'::regclass);


--
-- Name: product_attributes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_attributes ALTER COLUMN id SET DEFAULT nextval('public.product_attributes_id_seq'::regclass);


--
-- Name: product_collection_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_collection_items ALTER COLUMN id SET DEFAULT nextval('public.product_collection_items_id_seq'::regclass);


--
-- Name: product_collections id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_collections ALTER COLUMN id SET DEFAULT nextval('public.product_collections_id_seq'::regclass);


--
-- Name: product_questions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_questions ALTER COLUMN id SET DEFAULT nextval('public.product_questions_id_seq'::regclass);


--
-- Name: product_reviews id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_reviews ALTER COLUMN id SET DEFAULT nextval('public.product_reviews_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: promotion_usage id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.promotion_usage ALTER COLUMN id SET DEFAULT nextval('public.promotion_usage_id_seq'::regclass);


--
-- Name: promotions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.promotions ALTER COLUMN id SET DEFAULT nextval('public.promotions_id_seq'::regclass);


--
-- Name: purchase_order_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchase_order_items ALTER COLUMN id SET DEFAULT nextval('public.purchase_order_items_id_seq'::regclass);


--
-- Name: purchase_orders id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchase_orders ALTER COLUMN id SET DEFAULT nextval('public.purchase_orders_id_seq'::regclass);


--
-- Name: queue_jobs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.queue_jobs ALTER COLUMN id SET DEFAULT nextval('public.queue_jobs_id_seq'::regclass);


--
-- Name: rate_limits id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rate_limits ALTER COLUMN id SET DEFAULT nextval('public.rate_limits_id_seq'::regclass);


--
-- Name: restore_jobs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.restore_jobs ALTER COLUMN id SET DEFAULT nextval('public.restore_jobs_id_seq'::regclass);


--
-- Name: return_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.return_items ALTER COLUMN id SET DEFAULT nextval('public.return_items_id_seq'::regclass);


--
-- Name: returns id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.returns ALTER COLUMN id SET DEFAULT nextval('public.returns_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: sales_reports id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_reports ALTER COLUMN id SET DEFAULT nextval('public.sales_reports_id_seq'::regclass);


--
-- Name: scheduled_tasks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scheduled_tasks ALTER COLUMN id SET DEFAULT nextval('public.scheduled_tasks_id_seq'::regclass);


--
-- Name: search_queries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.search_queries ALTER COLUMN id SET DEFAULT nextval('public.search_queries_id_seq'::regclass);


--
-- Name: seo_meta id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seo_meta ALTER COLUMN id SET DEFAULT nextval('public.seo_meta_id_seq'::regclass);


--
-- Name: shipping_methods id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_methods ALTER COLUMN id SET DEFAULT nextval('public.shipping_methods_id_seq'::regclass);


--
-- Name: social_media_posts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.social_media_posts ALTER COLUMN id SET DEFAULT nextval('public.social_media_posts_id_seq'::regclass);


--
-- Name: states id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.states ALTER COLUMN id SET DEFAULT nextval('public.states_id_seq'::regclass);


--
-- Name: stock_alerts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_alerts ALTER COLUMN id SET DEFAULT nextval('public.stock_alerts_id_seq'::regclass);


--
-- Name: subscription_plans id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscription_plans ALTER COLUMN id SET DEFAULT nextval('public.subscription_plans_id_seq'::regclass);


--
-- Name: suppliers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers ALTER COLUMN id SET DEFAULT nextval('public.suppliers_id_seq'::regclass);


--
-- Name: support_ticket_messages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.support_ticket_messages ALTER COLUMN id SET DEFAULT nextval('public.support_ticket_messages_id_seq'::regclass);


--
-- Name: support_tickets id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.support_tickets ALTER COLUMN id SET DEFAULT nextval('public.support_tickets_id_seq'::regclass);


--
-- Name: system_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_logs ALTER COLUMN id SET DEFAULT nextval('public.system_logs_id_seq'::regclass);


--
-- Name: system_settings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_settings ALTER COLUMN id SET DEFAULT nextval('public.system_settings_id_seq'::regclass);


--
-- Name: tax_rates id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tax_rates ALTER COLUMN id SET DEFAULT nextval('public.tax_rates_id_seq'::regclass);


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
-- Name: user_roles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles ALTER COLUMN id SET DEFAULT nextval('public.user_roles_id_seq'::regclass);


--
-- Name: user_sessions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_sessions ALTER COLUMN id SET DEFAULT nextval('public.user_sessions_id_seq'::regclass);


--
-- Name: vendors id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vendors ALTER COLUMN id SET DEFAULT nextval('public.vendors_id_seq'::regclass);


--
-- Name: webhook_deliveries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.webhook_deliveries ALTER COLUMN id SET DEFAULT nextval('public.webhook_deliveries_id_seq'::regclass);


--
-- Name: webhooks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.webhooks ALTER COLUMN id SET DEFAULT nextval('public.webhooks_id_seq'::regclass);


--
-- Name: wishlist_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wishlist_items ALTER COLUMN id SET DEFAULT nextval('public.wishlist_items_id_seq'::regclass);


--
-- Name: wishlists id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wishlists ALTER COLUMN id SET DEFAULT nextval('public.wishlists_id_seq'::regclass);


--
-- Data for Name: ab_test_assignments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.ab_test_assignments (id, test_id, user_id, session_id, variant, assigned_at) FROM stdin;
\.


--
-- Data for Name: ab_tests; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.ab_tests (id, name, description, variants, start_date, end_date, success_metric, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: activity_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.activity_logs (id, user_id, action, entity_type, entity_id, description, ip_address, user_agent, metadata, created_at) FROM stdin;
\.


--
-- Data for Name: analytics_events; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.analytics_events (id, event_name, event_category, event_data, user_id, session_id, ip_address, user_agent, referrer, page_url, created_at) FROM stdin;
\.


--
-- Data for Name: api_keys; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.api_keys (id, name, key_hash, permissions, rate_limit, last_used_at, expires_at, is_active, created_by, created_at, updated_at) FROM stdin;
1	Razorpay Production	$2b$12$LQv3c1yqBwmnZ.VDVVj.0.E.9.R4F4.G.Y1oq7QEL4p8xJ2K9qG.2	["payment.create", "payment.capture", "refund.create"]	1000	2025-06-27 16:36:45.351487	2026-06-27 17:36:45.351487	t	admin001	2025-06-27 17:36:45.351487	2025-06-27 17:36:45.351487
2	SMS Gateway API	$2b$12$LQv3c1yqBwmnZ.VDVVj.0.E.9.R4F4.G.Y1oq7QEL4p8xJ2K9qG.3	["sms.send", "sms.status"]	500	2025-06-27 15:36:45.351487	2025-12-27 17:36:45.351487	t	admin001	2025-06-27 17:36:45.351487	2025-06-27 17:36:45.351487
3	Email Service API	$2b$12$LQv3c1yqBwmnZ.VDVVj.0.E.9.R4F4.G.Y1oq7QEL4p8xJ2K9qG.4	["email.send", "email.template"]	2000	2025-06-27 17:06:45.351487	2026-06-27 17:36:45.351487	t	admin001	2025-06-27 17:36:45.351487	2025-06-27 17:36:45.351487
4	Maps API Key	$2b$12$LQv3c1yqBwmnZ.VDVVj.0.E.9.R4F4.G.Y1oq7QEL4p8xJ2K9qG.5	["geocoding", "directions"]	10000	2025-06-27 17:21:45.351487	2026-06-27 17:36:45.351487	t	admin001	2025-06-27 17:36:45.351487	2025-06-27 17:36:45.351487
5	Analytics API	$2b$12$LQv3c1yqBwmnZ.VDVVj.0.E.9.R4F4.G.Y1oq7QEL4p8xJ2K9qG.6	["events.track", "reports.generate"]	5000	2025-06-27 17:31:45.351487	2026-06-27 17:36:45.351487	t	superadmin	2025-06-27 17:36:45.351487	2025-06-27 17:36:45.351487
\.


--
-- Data for Name: api_request_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.api_request_logs (id, method, endpoint, user_id, ip_address, request_body, response_status, response_time, error_message, created_at) FROM stdin;
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.audit_logs (id, user_id, action, resource_type, resource_id, old_values, new_values, ip_address, user_agent, created_at) FROM stdin;
1	admin001	CREATE	product	6	\N	{"name": "Organic Bananas", "price": 55}	192.168.1.10	Mozilla/5.0	2025-06-22 17:36:45.351487
2	admin001	UPDATE	product	15	{"price": 200}	{"price": 185}	192.168.1.10	Mozilla/5.0	2025-06-24 17:36:45.351487
3	customer001	CREATE	order	1	\N	{"status": "confirmed", "total_amount": 1285.50}	192.168.1.100	Mozilla/5.0 (Mobile)	2025-06-25 17:36:45.351487
4	delivery001	UPDATE	order	1	{"status": "confirmed"}	{"status": "shipped"}	192.168.1.50	Mozilla/5.0	2025-06-26 17:36:45.351487
5	admin001	DELETE	product	99	{"name": "Expired Product", "status": "active"}	\N	192.168.1.10	Mozilla/5.0	2025-06-20 17:36:45.351487
6	mgr001	UPDATE	inventory	1	{"quantity": 50}	{"quantity": 45}	192.168.1.20	Mozilla/5.0	2025-06-27 15:36:45.351487
7	superadmin	CREATE	user	delivery001	\N	{"role": "delivery", "branch_id": 1}	192.168.1.1	Mozilla/5.0	2025-05-27 17:36:45.351487
\.


--
-- Data for Name: backup_jobs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.backup_jobs (id, job_id, type, status, file_name, gcs_path, file_size, checksum, started_at, completed_at, error, metadata, created_by) FROM stdin;
1	backup-1751708365670-f1ce42d2	manual	completed	backup-2025-07-05T09-39-28.918Z.sql	\N	125MB	6b10c2512db243377080b6990d719047ac16432a199cc1ba954908a8a39dd4a2	2025-07-05 09:39:27.519894	2025-07-05 09:39:29.029137	\N	\N	admin@leafyhealth.com
2	backup-1751723785036-52exiyd6m	manual	completed	backup-2025-07-05T13-56-25-036Z.backup	db-backups/backup-2025-07-05T13-56-25-036Z.backup	321.07 KB	4bae39cc87803088f9bac80612d69f3a48d0682e8fe0761ac7031e6efc4d83a5	2025-07-05 13:56:25.036	2025-07-05 13:57:53.979	\N	{"localPath": "/tmp/backups/backup-2025-07-05T13-56-25-036Z.backup", "uploadUrl": ""}	system
3	backup-1751724482685-3mw50q1k2	manual	running	backup-2025-07-05T14-08-02-685Z.backup	db-backups/backup-2025-07-05T14-08-02-685Z.backup	\N	\N	2025-07-05 14:08:02.685	\N	\N	\N	system
4	backup-1751725244146-kr7552vkh	manual	completed	backup-2025-07-05T14-20-44-146Z.backup	db-backups/backup-2025-07-05T14-20-44-146Z.backup	321.24 KB	fac8ae82372443ba380ab607c60f07ccf910e7901f2a7ebf8561c835e23f11fc	2025-07-05 14:20:44.146	2025-07-05 14:22:15.62	\N	{"localPath": "/tmp/backups/backup-2025-07-05T14-20-44-146Z.backup", "uploadUrl": ""}	system
5	backup-1751730516379-kti51rut7	manual	failed	backup-2025-07-05T15-48-36-379Z.backup	db-backups/backup-2025-07-05T15-48-36-379Z.backup	\N	\N	2025-07-05 15:48:36.38	2025-07-05 15:48:38.109	Command failed: node "/home/runner/workspace/backend/domains/database-backup-restore/dist/scripts/isolated-backup.js" "backup-1751730516379-kti51rut7" "backup-2025-07-05T15-48-36-379Z.backup"\nnode:internal/modules/cjs/loader:1228\n  throw err;\n  ^\n\nError: Cannot find module '/home/runner/workspace/backend/domains/database-backup-restore/dist/scripts/isolated-backup.js'\n    at Module._resolveFilename (node:internal/modules/cjs/loader:1225:15)\n    at Module._load (node:internal/modules/cjs/loader:1051:27)\n    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:173:12)\n    at node:internal/main/run_main_module:28:49 {\n  code: 'MODULE_NOT_FOUND',\n  requireStack: []\n}\n\nNode.js v20.18.1\n	\N	system
\.


--
-- Data for Name: backup_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.backup_logs (id, backup_type, file_name, file_size, status, started_at, completed_at, error_message) FROM stdin;
\.


--
-- Data for Name: backup_schedules; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.backup_schedules (id, name, cron_expression, backup_type, is_active, last_run, next_run, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: branch_traditional_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.branch_traditional_items (id, branch_id, item_id, ordinary_price, medium_price, best_price, is_available, stock_quantity, min_order_quantity, max_order_quantity, created_at, updated_at) FROM stdin;
1	1	1	93.50	132.00	198.00	t	437	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
2	2	1	93.50	132.00	198.00	t	380	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
3	3	1	80.75	114.00	171.00	t	175	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
4	4	1	85.00	120.00	180.00	t	507	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
5	5	1	93.50	132.00	198.00	t	357	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
6	1	2	71.50	93.50	126.50	f	375	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
7	2	2	71.50	93.50	126.50	t	157	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
8	3	2	61.75	80.75	109.25	t	598	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
9	4	2	65.00	85.00	115.00	t	205	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
10	5	2	71.50	93.50	126.50	t	482	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
11	1	3	46.20	60.50	82.50	t	358	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
12	2	3	46.20	60.50	82.50	t	321	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
13	3	3	39.90	52.25	71.25	t	352	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
14	4	3	42.00	55.00	75.00	t	361	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
15	5	3	46.20	60.50	82.50	t	223	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
16	1	4	104.50	126.50	159.50	t	339	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
17	2	4	104.50	126.50	159.50	t	136	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
18	3	4	90.25	109.25	137.75	t	445	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
19	4	4	95.00	115.00	145.00	t	138	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
20	5	4	104.50	126.50	159.50	t	118	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
21	1	5	49.50	66.00	88.00	t	373	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
22	2	5	49.50	66.00	88.00	t	551	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
23	3	5	42.75	57.00	76.00	t	204	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
24	4	5	45.00	60.00	80.00	t	444	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
25	5	5	49.50	66.00	88.00	t	573	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
26	1	6	154.00	181.50	214.50	t	381	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
27	2	6	154.00	181.50	214.50	t	403	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
28	3	6	133.00	156.75	185.25	t	214	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
29	4	6	140.00	165.00	195.00	t	215	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
30	5	6	154.00	181.50	214.50	t	186	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
31	1	7	132.00	159.50	192.50	t	412	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
32	2	7	132.00	159.50	192.50	t	488	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
33	3	7	114.00	137.75	166.25	t	225	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
34	4	7	120.00	145.00	175.00	t	580	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
35	5	7	132.00	159.50	192.50	t	141	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
36	1	8	159.50	187.00	231.00	t	387	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
37	2	8	159.50	187.00	231.00	f	402	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
38	3	8	137.75	161.50	199.50	t	520	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
39	4	8	145.00	170.00	210.00	t	388	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
40	5	8	159.50	187.00	231.00	t	158	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
41	1	9	170.50	203.50	247.50	t	131	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
42	2	9	170.50	203.50	247.50	t	569	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
43	3	9	147.25	175.75	213.75	t	565	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
44	4	9	155.00	185.00	225.00	t	490	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
45	5	9	170.50	203.50	247.50	t	232	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
46	1	10	148.50	176.00	209.00	t	379	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
47	2	10	148.50	176.00	209.00	f	205	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
48	3	10	128.25	152.00	180.50	t	506	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
49	4	10	135.00	160.00	190.00	t	119	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
50	5	10	148.50	176.00	209.00	t	162	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
51	1	11	203.50	247.50	313.50	t	391	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
52	2	11	203.50	247.50	313.50	t	216	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
53	3	11	175.75	213.75	270.75	t	145	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
54	4	11	185.00	225.00	285.00	t	227	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
55	5	11	203.50	247.50	313.50	t	332	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
56	1	12	352.00	434.50	533.50	f	553	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
57	2	12	352.00	434.50	533.50	t	309	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
58	3	12	304.00	375.25	460.75	t	396	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
59	4	12	320.00	395.00	485.00	t	480	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
60	5	12	352.00	434.50	533.50	t	292	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
61	1	13	137.50	181.50	236.50	t	339	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
62	2	13	137.50	181.50	236.50	t	579	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
63	3	13	118.75	156.75	204.25	t	343	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
64	4	13	125.00	165.00	215.00	f	108	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
65	5	13	137.50	181.50	236.50	t	416	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
66	1	14	313.50	401.50	511.50	t	320	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
67	2	14	313.50	401.50	511.50	t	486	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
68	3	14	270.75	346.75	441.75	t	565	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
69	4	14	285.00	365.00	465.00	t	322	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
70	5	14	313.50	401.50	511.50	t	357	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
71	1	15	104.50	137.50	181.50	t	287	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
72	2	15	104.50	137.50	181.50	t	452	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
73	3	15	90.25	118.75	156.75	t	452	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
74	4	15	95.00	125.00	165.00	t	434	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
75	5	15	104.50	137.50	181.50	t	499	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
76	1	16	93.50	121.00	159.50	t	371	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
77	2	16	93.50	121.00	159.50	t	400	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
78	3	16	80.75	104.50	137.75	t	125	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
79	4	16	85.00	110.00	145.00	t	203	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
80	5	16	93.50	121.00	159.50	t	563	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
81	1	17	170.50	203.50	247.50	t	227	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
82	2	17	170.50	203.50	247.50	t	565	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
83	3	17	147.25	175.75	213.75	t	489	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
84	4	17	155.00	185.00	225.00	t	424	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
85	5	17	170.50	203.50	247.50	t	248	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
86	1	18	214.50	258.50	313.50	t	555	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
87	2	18	214.50	258.50	313.50	t	261	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
88	3	18	185.25	223.25	270.75	t	253	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
89	4	18	195.00	235.00	285.00	t	274	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
90	5	18	214.50	258.50	313.50	t	140	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
91	1	19	181.50	225.50	280.50	t	143	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
92	2	19	181.50	225.50	280.50	t	215	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
93	3	19	156.75	194.75	242.25	t	274	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
94	4	19	165.00	205.00	255.00	t	135	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
95	5	19	181.50	225.50	280.50	f	540	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
96	1	20	313.50	379.50	467.50	t	323	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
97	2	20	313.50	379.50	467.50	f	215	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
98	3	20	270.75	327.75	403.75	t	283	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
99	4	20	285.00	345.00	425.00	t	263	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
100	5	20	313.50	379.50	467.50	t	295	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
101	1	21	27.50	38.50	60.50	f	255	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
102	2	21	27.50	38.50	60.50	t	283	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
103	3	21	23.75	33.25	52.25	t	530	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
104	4	21	25.00	35.00	55.00	f	420	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
105	5	21	27.50	38.50	60.50	t	180	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
106	1	22	93.50	115.50	148.50	t	421	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
107	2	22	93.50	115.50	148.50	t	249	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
108	3	22	80.75	99.75	128.25	t	107	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
109	4	22	85.00	105.00	135.00	t	157	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
110	5	22	93.50	115.50	148.50	f	485	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
111	1	23	52.80	63.80	79.20	t	374	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
112	2	23	52.80	63.80	79.20	f	579	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
113	3	23	45.60	55.10	68.40	f	417	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
114	4	23	48.00	58.00	72.00	f	379	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
115	5	23	52.80	63.80	79.20	t	428	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
116	1	24	357.50	467.50	643.50	t	225	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
117	2	24	357.50	467.50	643.50	t	386	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
118	3	24	308.75	403.75	555.75	t	520	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
119	4	24	325.00	425.00	585.00	t	230	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
120	5	24	357.50	467.50	643.50	t	319	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
121	1	25	500.50	643.50	863.50	f	328	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
122	2	25	500.50	643.50	863.50	t	322	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
123	3	25	432.25	555.75	745.75	t	567	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
124	4	25	455.00	585.00	785.00	t	131	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
125	5	25	500.50	643.50	863.50	t	151	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
126	1	26	753.50	973.50	1303.50	t	341	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
127	2	26	753.50	973.50	1303.50	f	142	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
128	3	26	650.75	840.75	1125.75	t	293	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
129	4	26	685.00	885.00	1185.00	f	487	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
130	5	26	753.50	973.50	1303.50	t	387	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
131	1	27	863.50	1083.50	1523.50	t	496	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
132	2	27	863.50	1083.50	1523.50	f	190	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
133	3	27	745.75	935.75	1315.75	t	365	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
134	4	27	785.00	985.00	1385.00	t	396	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
135	5	27	863.50	1083.50	1523.50	t	280	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
136	1	28	313.50	423.50	566.50	t	390	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
137	2	28	313.50	423.50	566.50	t	183	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
138	3	28	270.75	365.75	489.25	t	310	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
139	4	28	285.00	385.00	515.00	t	333	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
140	5	28	313.50	423.50	566.50	t	476	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
141	1	29	203.50	313.50	456.50	t	461	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
142	2	29	203.50	313.50	456.50	f	297	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
143	3	29	175.75	270.75	394.25	t	292	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
144	4	29	185.00	285.00	415.00	t	264	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
145	5	29	203.50	313.50	456.50	t	227	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
146	1	30	60.50	77.00	99.00	t	552	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
147	2	30	60.50	77.00	99.00	t	285	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
148	3	30	52.25	66.50	85.50	t	457	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
149	4	30	55.00	70.00	90.00	t	223	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
150	5	30	60.50	77.00	99.00	t	353	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
151	1	31	52.80	68.20	90.20	t	124	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
152	2	31	52.80	68.20	90.20	t	414	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
153	3	31	45.60	58.90	77.90	t	444	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
154	4	31	48.00	62.00	82.00	t	417	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
155	5	31	52.80	68.20	90.20	t	536	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
156	1	32	71.50	93.50	121.00	t	364	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
157	2	32	71.50	93.50	121.00	t	502	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
158	3	32	61.75	80.75	104.50	t	383	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
159	4	32	65.00	85.00	110.00	t	162	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
160	5	32	71.50	93.50	121.00	t	492	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
161	1	33	93.50	121.00	159.50	t	129	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
162	2	33	93.50	121.00	159.50	t	395	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
163	3	33	80.75	104.50	137.75	t	421	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
164	4	33	85.00	110.00	145.00	t	426	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
165	5	33	93.50	121.00	159.50	t	263	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
166	1	34	82.50	104.50	137.50	t	192	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
167	2	34	82.50	104.50	137.50	t	463	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
168	3	34	71.25	90.25	118.75	t	150	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
169	4	34	75.00	95.00	125.00	t	503	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
170	5	34	82.50	104.50	137.50	t	327	1	100	2025-07-05 17:59:29.584224	2025-07-05 17:59:29.584224
\.


--
-- Data for Name: branches; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.branches (id, company_id, name, code, address, city, state, country, postal_code, latitude, longitude, phone, email, manager_name, operating_hours, delivery_radius, settings, is_active, created_at, updated_at) FROM stdin;
1	1	SVOF Hyderabad Main	HYD001	Plot No. 45, HITEC City, Madhapur	Hyderabad	Telangana	India	500081	17.44850000	78.39080000	+91-8885551234	\N	Rajesh Kumar	\N	25.00	{"services": {"traditional_orders": true}}	t	2025-06-27 17:03:57.116373	2025-06-27 17:03:57.116373
2	1	SVOF Gachibowli	HYD002	Road No. 36, Jubilee Hills	Hyderabad	Telangana	India	500033	17.40650000	78.46910000	+91-8885551235	\N	Priya Sharma	\N	20.00	{"services": {"traditional_orders": true}}	t	2025-06-27 17:03:57.116373	2025-06-27 17:03:57.116373
3	2	GVN Visakhapatnam Central	VZG001	Main Road, Opposite Bus Stand	Visakhapatnam	Andhra Pradesh	India	530001	17.68680000	83.21850000	+91-8912345678	\N	Venkata Rao	\N	30.00	{"services": {"traditional_orders": true}}	t	2025-06-27 17:03:57.116373	2025-06-27 17:03:57.116373
5	1	SVOF Kondapur	HYD003	Kondapur Main Road, Near Metro Station	Hyderabad	Telangana	India	500084	17.46470000	78.36170000	+91-8885551236	\N	Suresh Reddy	\N	22.00	{"services": {"traditional_orders": true}}	t	2025-06-27 17:03:57.116373	2025-06-27 17:03:57.116373
4	3	PEO Vijayawada Market	VJA001	Agricultural Market Yard, Ring Road	Vijayawada	Andhra Pradesh	India	520001	16.50620000	80.64800000	+91-8661234567	\N	Lakshmi Devi	\N	35.00	{"services": {"traditional_orders": false}}	t	2025-06-27 17:03:57.116373	2025-06-27 17:03:57.116373
\.


--
-- Data for Name: brands; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.brands (id, name, slug, description, logo, website, is_active, created_at, updated_at) FROM stdin;
1	Organic Valley AP	organic-valley-ap	Premium Andhra Pradesh organic brand	\N	\N	t	2025-06-27 17:04:38.332508	2025-06-27 17:04:38.332508
2	Farmers Fresh	farmers-fresh	Direct from farm organic products	\N	\N	t	2025-06-27 17:04:38.332508	2025-06-27 17:04:38.332508
3	Telugu Organics	telugu-organics	Traditional Telugu organic foods	\N	\N	t	2025-06-27 17:04:38.332508	2025-06-27 17:04:38.332508
4	Pure Harvest	pure-harvest	Certified organic harvest	\N	\N	t	2025-06-27 17:04:38.332508	2025-06-27 17:04:38.332508
5	Local Organic	local-organic	Local farmers organic collective	\N	\N	t	2025-06-27 17:04:38.332508	2025-06-27 17:04:38.332508
\.


--
-- Data for Name: cache_entries; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cache_entries (id, cache_key, cache_value, expires_at, created_at) FROM stdin;
\.


--
-- Data for Name: campaign_recipients; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.campaign_recipients (id, campaign_id, customer_id, sent_at, opened_at, clicked_at, unsubscribed_at, status, created_at) FROM stdin;
\.


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cart_items (id, cart_id, product_id, quantity, unit_price, total_price, created_at, updated_at) FROM stdin;
3	1	3	1	32.00	32.00	2025-07-05 07:59:03.725329	2025-07-05 07:59:03.725329
1	1	1	4	45.00	135.00	2025-07-05 07:59:03.725329	2025-07-05 07:59:03.725329
2	1	2	2	35.00	35.00	2025-07-05 07:59:03.725329	2025-07-05 07:59:03.725329
\.


--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.carts (id, customer_id, session_id, branch_id, status, total_amount, item_count, expires_at, created_at, updated_at) FROM stdin;
1	9	\N	1	active	0.00	0	\N	2025-07-05 07:59:03.482007	2025-07-05 07:59:03.482007
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
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
-- Data for Name: cities; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cities (id, state_id, name, latitude, longitude, is_active) FROM stdin;
1	1	Visakhapatnam	17.68680000	83.21850000	t
2	1	Vijayawada	16.50620000	80.64800000	t
3	1	Guntur	16.30670000	80.43650000	t
4	1	Tirupati	13.62880000	79.41920000	t
5	2	Hyderabad	17.38500000	78.48670000	t
6	2	Warangal	17.96890000	79.59410000	t
\.


--
-- Data for Name: cms_banners; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cms_banners (id, title, description, image_url, link_url, "position", sort_order, start_date, end_date, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: cms_pages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cms_pages (id, title, slug, content, meta_title, meta_description, status, template, featured_image, author_id, published_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: communication_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.communication_logs (id, recipient, type, template_id, subject, content, status, provider_response, error_message, sent_at) FROM stdin;
1	customer001@gmail.com	email	1	Order Confirmed - ORD-2024-001	Your organic grocery order has been confirmed and is being prepared for delivery.	sent	{"provider": "sendgrid", "message_id": "email_123456"}	\N	2025-06-25 17:39:12.951016
2	+919876543219	sms	2	Order Shipped	Your order ORD-2024-001 has been shipped. Track: TRK123456	delivered	{"provider": "twilio", "message_id": "sms_789012"}	\N	2025-06-26 17:39:12.951016
3	customer001	push	3	Special Offer	20% off on organic spices. Use SPICE20	delivered	{"provider": "firebase", "notification_id": "push_345678"}	\N	2025-06-27 14:39:12.951016
4	admin001@srivenkateswara.com	email	4	Low Stock Alert - Organic Turmeric	Organic Turmeric Powder stock is running low in Hyderabad branch.	sent	{"provider": "sendgrid", "message_id": "email_456789"}	\N	2025-06-27 16:39:12.951016
5	invalid@email	email	5	Welcome to LeafyHealth!	Thank you for joining our organic food community.	failed	\N	Invalid email address format	2025-06-27 15:39:12.951016
\.


--
-- Data for Name: communication_templates; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.communication_templates (id, name, type, subject, content, variables, is_active, created_at, updated_at) FROM stdin;
1	Order Confirmation	email	Order Confirmed - {{order_number}}	Dear {{customer_name}}, your order {{order_number}} has been confirmed.	["customer_name", "order_number", "order_total"]	t	2025-06-27 17:39:12.951016	2025-06-27 17:39:12.951016
2	Order Shipped	sms	Order Shipped	Your order {{order_number}} has been shipped. Track: {{tracking_number}}	["order_number", "tracking_number"]	t	2025-06-27 17:39:12.951016	2025-06-27 17:39:12.951016
3	Promotion	push	Special Offer	{{discount}}% off on {{category}}. Use {{promo_code}}	["discount", "category", "promo_code"]	t	2025-06-27 17:39:12.951016	2025-06-27 17:39:12.951016
4	Low Stock Alert	email	Low Stock Alert - {{product_name}}	{{product_name}} stock is running low in {{branch_name}} branch.	["product_name", "branch_name", "current_stock"]	t	2025-06-27 17:39:12.951016	2025-06-27 17:39:12.951016
5	Welcome Email	email	Welcome to LeafyHealth!	Welcome {{customer_name}}! Thank you for joining our organic food community.	["customer_name"]	t	2025-06-27 17:39:12.951016	2025-06-27 17:39:12.951016
\.


--
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.companies (id, name, slug, description, logo, website, email, phone, address, city, state, country, postal_code, tax_id, registration_number, fssai_license, gst_number, industry, founded_year, employee_count, annual_revenue, settings, is_active, created_at, updated_at) FROM stdin;
1	Sri Venkateswara Organic Foods	svof	Premium organic food retailer specializing in authentic Andhra Pradesh organic produce	\N	\N	info@svorganicfoods.com	+91-8885551234	Plot No. 45, HITEC City	Hyderabad	Telangana	India	500081	\N	\N	12345678901234	36AABCS1234F1Z5	Organic Food Retail	\N	\N	\N	\N	t	2025-06-27 17:03:32.255636	2025-06-27 17:03:32.255636
2	Green Valley Naturals	gvn	Sustainable organic farming and retail chain across Andhra Pradesh	\N	\N	contact@greenvalley.com	+91-8912345678	Main Road, Opposite Bus Stand	Visakhapatnam	Andhra Pradesh	India	530001	\N	\N	12345678901235	37AABCS1234F1Z6	Organic Food Retail	\N	\N	\N	\N	t	2025-06-27 17:03:32.255636	2025-06-27 17:03:32.255636
3	Pure Earth Organics	peo	Certified organic vegetables and grains from local farmers	\N	\N	hello@pureearthorganics.com	+91-8661234567	Agricultural Market Yard	Vijayawada	Andhra Pradesh	India	520001	\N	\N	12345678901236	37AABCS1234F1Z7	Organic Food Retail	\N	\N	\N	\N	t	2025-06-27 17:03:32.255636	2025-06-27 17:03:32.255636
\.


--
-- Data for Name: compliance_checks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.compliance_checks (id, check_type, entity_type, entity_id, status, findings, checked_by, checked_at, next_check_due) FROM stdin;
\.


--
-- Data for Name: content_versions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.content_versions (id, entity_type, entity_id, version_number, content_data, change_summary, created_by, created_at) FROM stdin;
\.


--
-- Data for Name: countries; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.countries (id, code, name, currency_code, phone_code, is_active) FROM stdin;
1	IN	India	INR	+91	t
\.


--
-- Data for Name: currencies; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.currencies (id, code, name, symbol, exchange_rate, is_default, is_active, last_updated, created_at) FROM stdin;
1	INR	Indian Rupee	₹	1.000000	t	t	2025-06-27 17:03:32.255636	2025-06-27 17:03:32.255636
\.


--
-- Data for Name: custom_template_dimensions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.custom_template_dimensions (id, template_name, width, height, unit, created_at) FROM stdin;
\.


--
-- Data for Name: customer_addresses; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.customer_addresses (id, customer_id, type, is_default, first_name, last_name, company, address1, address2, city, state, postal_code, country, phone, latitude, longitude, instructions, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: customer_subscriptions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.customer_subscriptions (id, customer_id, plan_id, start_date, end_date, auto_renew, status, payment_method, amount_paid, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.customers (id, user_id, first_name, last_name, email, phone, date_of_birth, gender, loyalty_points, total_orders, total_spent, average_order_value, last_order_date, status, source, tags, preferences, created_at, updated_at) FROM stdin;
1	\N	Rajesh	Kumar	rajesh.kumar@gmail.com	+91-9876543210	\N	\N	150	12	8500.00	0.00	\N	active	\N	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
2	\N	Priya	Sharma	priya.sharma@gmail.com	+91-9876543211	\N	\N	89	8	5200.00	0.00	\N	active	\N	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
3	\N	Venkata	Rao	venkata.rao@gmail.com	+91-9876543212	\N	\N	245	18	12800.00	0.00	\N	active	\N	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
4	\N	Lakshmi	Devi	lakshmi.devi@gmail.com	+91-9876543213	\N	\N	67	5	3400.00	0.00	\N	active	\N	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
5	\N	Suresh	Reddy	suresh.reddy@gmail.com	+91-9876543214	\N	\N	312	25	18900.00	0.00	\N	active	\N	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
6	\N	Anitha	Kumari	anitha.kumari@gmail.com	+91-9876543215	\N	\N	198	14	11200.00	0.00	\N	active	\N	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
7	\N	Ramesh	Babu	ramesh.babu@gmail.com	+91-9876543216	\N	\N	76	6	4800.00	0.00	\N	active	\N	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
8	\N	Sita	Mahalakshmi	sita.mahalakshmi@gmail.com	+91-9876543217	\N	\N	456	32	24500.00	0.00	\N	active	\N	\N	\N	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
9	customer-1751700072363	Test	Customer	customer@leafyhealth.com	9876543210	\N	\N	0	0	0.00	0.00	\N	active	\N	\N	\N	2025-07-05 07:59:02.994862	2025-07-05 07:59:02.994862
\.


--
-- Data for Name: data_privacy_requests; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.data_privacy_requests (id, customer_id, request_type, status, requested_data, processed_by, processed_at, created_at) FROM stdin;
\.


--
-- Data for Name: delivery_assignments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.delivery_assignments (id, order_id, delivery_person_id, assigned_at, picked_up_at, delivered_at, delivery_notes, customer_signature, delivery_photo, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: delivery_schedules; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.delivery_schedules (id, branch_id, day_of_week, time_slots, max_orders_per_slot, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: delivery_zones; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.delivery_zones (id, branch_id, name, description, postal_codes, polygon_coordinates, delivery_fee, free_delivery_threshold, estimated_delivery_time, is_active, created_at, updated_at) FROM stdin;
1	1	HITEC City Zone	Madhapur, Gachibowli, Kondapur area	\N	\N	25.00	500.00	2-4 hours	t	2025-06-27 17:05:43.666219	2025-06-27 17:05:43.666219
2	1	Jubilee Hills Zone	Jubilee Hills, Banjara Hills area	\N	\N	30.00	500.00	3-5 hours	t	2025-06-27 17:05:43.666219	2025-06-27 17:05:43.666219
3	2	Gachibowli Zone	Gachibowli, Nanakramguda area	\N	\N	20.00	400.00	1-3 hours	t	2025-06-27 17:05:43.666219	2025-06-27 17:05:43.666219
4	3	Visakhapatnam Central	MVP Colony, Dwaraka Nagar area	\N	\N	35.00	600.00	2-4 hours	t	2025-06-27 17:05:43.666219	2025-06-27 17:05:43.666219
5	4	Vijayawada Market	Governorpet, Patamata area	\N	\N	40.00	700.00	3-5 hours	t	2025-06-27 17:05:43.666219	2025-06-27 17:05:43.666219
6	5	Kondapur Zone	Kondapur, KPHB area	\N	\N	25.00	450.00	2-4 hours	t	2025-06-27 17:05:43.666219	2025-06-27 17:05:43.666219
\.


--
-- Data for Name: employee_attendance; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.employee_attendance (id, employee_id, attendance_date, check_in_time, check_out_time, break_duration, total_hours, status, notes, created_at) FROM stdin;
\.


--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.employees (id, user_id, employee_id, branch_id, department, designation, salary, date_of_joining, date_of_leaving, emergency_contact, documents, performance_metrics, status, created_at, updated_at) FROM stdin;
1	admin001	EMP001	1	Management	Store Manager	45000.00	2024-01-15	\N	{"name": "Sita Kumar", "phone": "+919876543299", "relation": "spouse"}	{"pan": "ABCDE1234F", "aadhar": "123456789012"}	{"rating": 4.5, "last_review": "2024-12-01"}	active	2025-06-27 17:26:27.1487	2025-06-27 17:26:27.1487
2	mgr001	EMP002	1	Operations	Branch Manager	38000.00	2024-02-01	\N	{"name": "Priya Reddy", "phone": "+919876543298", "relation": "spouse"}	{"pan": "ABCDE1234G", "aadhar": "123456789013"}	{"rating": 4.2, "last_review": "2024-11-15"}	active	2025-06-27 17:26:27.1487	2025-06-27 17:26:27.1487
3	staff001	EMP003	1	Sales	Sales Associate	25000.00	2024-03-10	\N	{"name": "Rama Teja", "phone": "+919876543297", "relation": "father"}	{"pan": "ABCDE1234H", "aadhar": "123456789014"}	{"rating": 4.0, "last_review": "2024-11-01"}	active	2025-06-27 17:26:27.1487	2025-06-27 17:26:27.1487
4	staff002	EMP004	4	Sales	Cashier	22000.00	2024-01-20	\N	{"name": "Vishnu Rao", "phone": "+919876543296", "relation": "husband"}	{"pan": "ABCDE1234I", "aadhar": "123456789015"}	{"rating": 4.3, "last_review": "2024-10-20"}	active	2025-06-27 17:26:27.1487	2025-06-27 17:26:27.1487
5	delivery001	EMP005	1	Logistics	Delivery Executive	28000.00	2024-02-15	\N	{"name": "Lakshmi Murthy", "phone": "+919876543295", "relation": "spouse"}	{"pan": "ABCDE1234J", "aadhar": "123456789016"}	{"rating": 4.7, "last_review": "2024-12-10"}	active	2025-06-27 17:26:27.1487	2025-06-27 17:26:27.1487
6	delivery002	EMP006	3	Logistics	Delivery Executive	28000.00	2024-03-01	\N	{"name": "Ram Mahalakshmi", "phone": "+919876543294", "relation": "husband"}	{"pan": "ABCDE1234K", "aadhar": "123456789017"}	{"rating": 4.4, "last_review": "2024-11-25"}	active	2025-06-27 17:26:27.1487	2025-06-27 17:26:27.1487
7	admin002	EMP007	2	Management	Area Manager	42000.00	2024-01-10	\N	{"name": "Ravi Sharma", "phone": "+919876543293", "relation": "spouse"}	{"pan": "ABCDE1234L", "aadhar": "123456789018"}	{"rating": 4.6, "last_review": "2024-12-05"}	active	2025-06-27 17:26:27.1487	2025-06-27 17:26:27.1487
8	superadmin	EMP008	1	IT	System Administrator	55000.00	2023-12-01	\N	{"name": "Meera Acharya", "phone": "+919876543292", "relation": "spouse"}	{"pan": "ABCDE1234M", "aadhar": "123456789019"}	{"rating": 4.8, "last_review": "2024-12-15"}	active	2025-06-27 17:26:27.1487	2025-06-27 17:26:27.1487
\.


--
-- Data for Name: expense_categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.expense_categories (id, name, description, parent_id, is_active, created_at, updated_at) FROM stdin;
1	Transportation	Vehicle fuel, maintenance, and delivery costs	\N	t	2024-12-27 17:46:39.439793	2024-12-27 17:46:39.439793
2	Marketing	Advertising, promotions, and customer acquisition	\N	t	2024-12-27 17:46:39.439793	2024-12-27 17:46:39.439793
3	Utilities	Electricity, water, internet, and communication	\N	t	2024-12-27 17:46:39.439793	2024-12-27 17:46:39.439793
4	Fuel Costs	Petrol and diesel for delivery vehicles	1	t	2025-01-27 17:46:39.439793	2025-01-27 17:46:39.439793
5	Digital Marketing	Online ads, social media promotion, email campaigns	2	t	2025-02-27 17:46:39.439793	2025-02-27 17:46:39.439793
\.


--
-- Data for Name: expenses; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.expenses (id, expense_number, category_id, branch_id, description, amount, expense_date, payment_method, receipt_url, vendor_name, approved_by, approved_at, status, created_by, created_at, updated_at) FROM stdin;
1	EXP-2024-001	1	1	Fuel for delivery vehicles - December 2024	2500.00	2024-12-20	corporate_card	/uploads/receipts/fuel_dec_2024.jpg	Bharat Petroleum	admin001	2025-06-20 17:46:39.439793	approved	admin001	2025-06-20 17:46:39.439793	2025-06-20 17:46:39.439793
2	EXP-2024-002	2	1	Facebook and Google Ads - Holiday Campaign	15000.00	2024-12-15	bank_transfer	/uploads/receipts/digital_ads_dec.pdf	Meta Ads Manager	admin001	2025-06-13 17:46:39.439793	approved	marketing001	2025-06-13 17:46:39.439793	2025-06-13 17:46:39.439793
3	EXP-2024-003	3	1	Electricity bill - Hyderabad branch	8500.00	2024-12-10	online_payment	/uploads/receipts/electricity_dec.pdf	TSSPDCL	admin001	2025-06-06 17:46:39.439793	approved	admin001	2025-06-06 17:46:39.439793	2025-06-06 17:46:39.439793
4	EXP-2024-004	1	2	Vehicle maintenance and repair	12000.00	2024-12-05	cash	/uploads/receipts/vehicle_service.jpg	Sri Krishna Motors	admin001	2025-05-27 17:46:39.439793	approved	admin001	2025-05-27 17:46:39.439793	2025-05-27 17:46:39.439793
5	EXP-2024-005	2	3	Promotional banners and flyers printing	5000.00	2024-11-28	cheque	/uploads/receipts/printing_nov.pdf	Digital Print Solutions	admin001	2025-05-27 17:46:39.439793	approved	marketing002	2025-05-27 17:46:39.439793	2025-05-27 17:46:39.439793
\.


--
-- Data for Name: feature_flags; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.feature_flags (id, name, description, is_enabled, conditions, rollout_percentage, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: gift_card_transactions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.gift_card_transactions (id, gift_card_id, order_id, transaction_type, amount, balance_after, created_at) FROM stdin;
\.


--
-- Data for Name: gift_cards; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.gift_cards (id, code, amount, balance, status, expires_at, purchased_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: health_checks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.health_checks (id, service_name, status, response_time, error_message, checked_at) FROM stdin;
\.


--
-- Data for Name: image_uploads; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.image_uploads (id, original_name, filename, file_path, file_size, mime_type, dimensions, alt_text, entity_type, entity_id, uploaded_by, created_at) FROM stdin;
\.


--
-- Data for Name: integrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.integrations (id, name, type, provider, configuration, credentials, is_active, last_sync_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: inventory; Type: TABLE DATA; Schema: public; Owner: -
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
-- Data for Name: inventory_adjustments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.inventory_adjustments (id, product_id, branch_id, old_quantity, new_quantity, adjustment_reason, adjusted_by, created_at) FROM stdin;
\.


--
-- Data for Name: inventory_transactions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.inventory_transactions (id, product_id, branch_id, transaction_type, quantity_change, new_quantity, reference_id, reference_type, notes, created_by, created_at) FROM stdin;
\.


--
-- Data for Name: label_templates; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.label_templates (id, name, description, template_data, thumbnail_url, category, is_public, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: loyalty_rewards; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.loyalty_rewards (id, name, description, points_required, reward_type, reward_value, applicable_products, applicable_categories, usage_limit, expiry_days, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: loyalty_transactions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.loyalty_transactions (id, customer_id, transaction_type, points, order_id, description, expires_at, created_at) FROM stdin;
\.


--
-- Data for Name: marketing_campaigns; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.marketing_campaigns (id, name, type, channel, subject, content, target_audience, start_date, end_date, budget, status, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: marketplace_listings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.marketplace_listings (id, product_id, marketplace, external_id, status, listing_data, sync_status, last_synced_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.notifications (id, user_id, title, message, type, channel, is_read, read_at, metadata, created_at) FROM stdin;
1	customer001	Order Confirmed	Your order ORD-2024-001 has been confirmed and is being prepared.	order_update	push	t	2025-06-26 17:50:51.43747	{"order_id": 1, "action_url": "/customer/orders/1"}	2025-06-25 17:50:51.43747
2	customer001	Order Shipped	Your organic groceries are on their way! Track your delivery.	order_update	sms	f	\N	{"order_id": 1, "tracking_url": "/customer/orders/1/track"}	2025-06-26 17:50:51.43747
3	customer002	Welcome to LeafyHealth!	Thank you for joining our organic food community. Enjoy 20% off your first order.	welcome	email	t	2025-06-25 17:50:51.43747	{"action_url": "/customer/products", "promo_code": "NEWCUST50"}	2025-06-24 17:50:51.43747
4	admin001	Low Stock Alert	Organic Turmeric Powder is running low in Hyderabad branch.	stock_alert	email	t	2025-06-27 17:20:51.43747	{"branch_id": 1, "product_id": 15, "current_stock": 8}	2025-06-27 16:50:51.43747
5	customer003	Special Offer	Get 25% off on organic spices this weekend. Limited time offer!	promotion	push	f	\N	{"category": "spices", "promo_code": "SPICE25"}	2025-06-27 15:50:51.43747
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_items (id, order_id, product_id, quantity, unit_price, total_price, product_snapshot, created_at) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orders (id, order_number, customer_id, branch_id, status, payment_status, shipping_status, subtotal, tax_amount, shipping_amount, discount_amount, total_amount, currency, billing_address, shipping_address, delivery_date, delivery_time_slot, order_notes, internal_notes, metadata, created_at, updated_at) FROM stdin;
1	ORD-2024-001	1	1	delivered	paid	delivered	1150.00	135.50	50.00	50.00	1285.50	INR	{"city": "Hyderabad", "phone": "+919876543230", "state": "Telangana", "street": "123 Gandhi Nagar", "pincode": "500001"}	{"city": "Hyderabad", "phone": "+919876543230", "state": "Telangana", "street": "123 Gandhi Nagar", "pincode": "500001"}	2024-12-20	morning	Customer requested early delivery	First time customer	{"source": "mobile_app", "promocode": "ORGANIC10"}	2025-06-27 17:28:39.818745	2025-06-27 17:28:39.818745
2	ORD-2024-002	2	1	processing	paid	preparing	795.00	100.75	25.00	25.00	895.75	INR	{"city": "Hyderabad", "phone": "+919876543231", "state": "Telangana", "street": "456 Jubilee Hills", "pincode": "500033"}	{"city": "Hyderabad", "phone": "+919876543231", "state": "Telangana", "street": "456 Jubilee Hills", "pincode": "500033"}	2024-12-28	evening	Organic vegetables order	Regular customer	{"device": "desktop", "source": "website"}	2025-06-27 17:28:39.818745	2025-06-27 17:28:39.818745
3	ORD-2024-003	3	2	shipped	paid	in_transit	1950.00	200.25	0.00	100.00	2150.25	INR	{"city": "Hyderabad", "phone": "+919876543232", "state": "Telangana", "street": "789 Kukatpally", "pincode": "500072"}	{"street": "Green Valley Store, Kukatpally"}	2024-12-29	pickup	Bulk order for family function	Store pickup order	{"source": "mobile_app", "bulk_order": true}	2025-06-27 17:28:39.818745	2025-06-27 17:28:39.818745
4	ORD-2024-004	4	3	confirmed	pending	pending	620.00	55.80	35.00	15.00	675.80	INR	{"city": "Hyderabad", "phone": "+919876543233", "state": "Telangana", "street": "789 Banjara Hills", "pincode": "500034"}	{"city": "Hyderabad", "phone": "+919876543233", "state": "Telangana", "street": "789 Banjara Hills", "pincode": "500034"}	2024-12-30	evening	Evening delivery preferred	COD order - verify payment	{"source": "website", "first_time_customer": true}	2025-06-27 17:28:39.818745	2025-06-27 17:28:39.818745
5	ORD-2024-005	5	1	delivered	paid	delivered	1320.00	136.90	40.00	75.00	1456.90	INR	{"city": "Secunderabad", "phone": "+919876543234", "state": "Telangana", "street": "321 Secunderabad", "pincode": "500003"}	{"city": "Secunderabad", "phone": "+919876543234", "state": "Telangana", "street": "321 Secunderabad", "pincode": "500003"}	2024-12-25	morning	Christmas special order	Festival delivery completed	{"source": "mobile_app", "festival_order": true}	2025-06-27 17:28:39.818745	2025-06-27 17:28:39.818745
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payments (id, order_id, payment_method, payment_gateway, transaction_id, amount, currency, status, gateway_response, failure_reason, refund_amount, created_at, updated_at) FROM stdin;
1	1	card	razorpay	TXN123456789	1285.50	INR	completed	{"status": "success", "gateway": "razorpay", "card_last4": "1234", "payment_id": "pay_123456789"}	\N	0.00	2025-06-27 17:29:56.471295	2025-06-27 17:29:56.471295
2	2	upi	payu	UPI987654321	895.75	INR	completed	{"vpa": "customer@paytm", "status": "success", "upi_id": "customer@paytm", "gateway": "payu"}	\N	0.00	2025-06-27 17:29:56.471295	2025-06-27 17:29:56.471295
3	3	card	stripe	TXN456789123	2150.25	INR	completed	{"status": "success", "gateway": "stripe", "charge_id": "ch_456789123", "card_last4": "5678"}	\N	0.00	2025-06-27 17:29:56.471295	2025-06-27 17:29:56.471295
4	4	cod	manual	\N	675.80	INR	pending	{"notes": "Payment to be collected on delivery", "payment_type": "cash_on_delivery"}	\N	0.00	2025-06-27 17:29:56.471295	2025-06-27 17:29:56.471295
5	5	upi	phonepe	UPI246810357	1456.90	INR	completed	{"status": "success", "upi_id": "customer@phonepe", "gateway": "phonepe", "transaction_id": "TXN246810357"}	\N	0.00	2025-06-27 17:29:56.471295	2025-06-27 17:29:56.471295
\.


--
-- Data for Name: performance_metrics; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.performance_metrics (id, metric_name, metric_value, metric_unit, branch_id, recorded_at, metadata) FROM stdin;
\.


--
-- Data for Name: price_history; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.price_history (id, product_id, old_price, new_price, change_reason, changed_by, effective_from, created_at) FROM stdin;
\.


--
-- Data for Name: product_answers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_answers (id, question_id, user_id, answer, is_from_seller, helpful_count, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: product_attribute_values; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_attribute_values (id, product_id, attribute_id, value, created_at) FROM stdin;
\.


--
-- Data for Name: product_attributes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_attributes (id, name, type, is_required, is_filterable, sort_order, options, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: product_collection_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_collection_items (id, collection_id, product_id, sort_order, created_at) FROM stdin;
\.


--
-- Data for Name: product_collections; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_collections (id, name, slug, description, image, sort_order, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: product_questions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_questions (id, product_id, customer_id, question, is_answered, is_public, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: product_reviews; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_reviews (id, product_id, customer_id, order_id, rating, title, comment, images, is_verified_purchase, is_approved, helpful_count, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products (id, name, name_telugu, slug, description, description_telugu, short_description, sku, barcode, category_id, selling_price, mrp, cost_price, unit, weight, dimensions, image_url, images, tags, attributes, nutritional_info, organic_certification, is_featured, is_digital, status, seo_title, seo_description, created_at, updated_at, brand_id) FROM stdin;
1	Organic Tomatoes	సేంద్రీయ టమాటలు	organic-tomatoes	Fresh organic tomatoes from local farms	స్థానిక వ్యవసాయ క్షేత్రాల నుండి తాజా సేంద్రీయ టమాటలు	\N	VEG001	\N	1	45.00	55.00	\N	kg	1.000	\N	\N	\N	\N	\N	\N	\N	t	f	active	\N	\N	2025-06-27 17:04:38.332508	2025-06-27 17:04:38.332508	1
2	Organic Onions	సేంద్రీయ ఉల్లిపాయలు	organic-onions	Premium quality organic onions	ప్రీమియం నాణ్యత సేంద్రీయ ఉల్లిపాయలు	\N	VEG002	\N	1	35.00	42.00	\N	kg	1.000	\N	\N	\N	\N	\N	\N	\N	t	f	active	\N	\N	2025-06-27 17:04:38.332508	2025-06-27 17:04:38.332508	1
3	Organic Potatoes	సేంద్రీయ బంగాళాదుంపలు	organic-potatoes	Organic potatoes from Andhra farms	ఆంధ్ర వ్యవసాయ క్షేత్రాల నుండి సేంద్రీయ బంగాళాదుంపలు	\N	VEG003	\N	1	32.00	38.00	\N	kg	1.000	\N	\N	\N	\N	\N	\N	\N	f	f	active	\N	\N	2025-06-27 17:04:38.332508	2025-06-27 17:04:38.332508	2
4	Organic Brinjal	సేంద్రీయ వంకాయ	organic-brinjal	Traditional Andhra brinjal variety	సంప్రదాయ ఆంధ్ర వంకాయ రకం	\N	VEG004	\N	1	38.00	45.00	\N	kg	1.000	\N	\N	\N	\N	\N	\N	\N	t	f	active	\N	\N	2025-06-27 17:04:38.332508	2025-06-27 17:04:38.332508	3
5	Organic Okra	సేంద్రీయ బెండకాయ	organic-okra	Fresh organic ladies finger	తాజా సేంద్రీయ బెండకాయలు	\N	VEG005	\N	1	42.00	48.00	\N	kg	0.500	\N	\N	\N	\N	\N	\N	\N	f	f	active	\N	\N	2025-06-27 17:04:38.332508	2025-06-27 17:04:38.332508	2
6	Organic Bananas	సేంద్రీయ అరటిపండ్లు	organic-bananas	Sweet organic bananas	తీపి సేంద్రీయ అరటిపండ్లు	\N	FRT001	\N	2	55.00	65.00	\N	dozen	1.500	\N	\N	\N	\N	\N	\N	\N	t	f	active	\N	\N	2025-06-27 17:04:38.332508	2025-06-27 17:04:38.332508	2
7	Organic Mangoes	సేంద్రీయ మామిడిపండ్లు	organic-mangoes	Seasonal Andhra mangoes	కాలానుగుణ ఆంధ్ర మామిడిపండ్లు	\N	FRT002	\N	2	120.00	140.00	\N	kg	1.000	\N	\N	\N	\N	\N	\N	\N	t	f	active	\N	\N	2025-06-27 17:04:38.332508	2025-06-27 17:04:38.332508	3
8	Organic Guava	సేంద్రీయ జామపండు	organic-guava	Fresh organic guava from local orchards	స్థానిక తోటల నుండి తాజా సేంద్రీయ జామపండు	\N	FRT003	\N	2	65.00	75.00	\N	kg	1.000	\N	\N	\N	\N	\N	\N	\N	f	f	active	\N	\N	2025-06-27 17:04:38.332508	2025-06-27 17:04:38.332508	1
9	Organic Rice (Sona Masoori)	సేంద్రీయ బియ్యం (సోన మసూరి)	organic-rice-sona-masoori	Premium Sona Masoori rice	ప్రీమియం సోన మసూరి బియ్యం	\N	GRN001	\N	3	85.00	95.00	\N	kg	1.000	\N	\N	\N	\N	\N	\N	\N	t	f	active	\N	\N	2025-06-27 17:04:38.332508	2025-06-27 17:04:38.332508	3
10	Organic Brown Rice	సేంద్రీయ గోధుమ వర్ణ బియ్యం	organic-brown-rice	Nutritious organic brown rice	పోషకాహార సేంద్రీయ గోధుమ వర్ణ బియ్యం	\N	GRN002	\N	3	95.00	110.00	\N	kg	1.000	\N	\N	\N	\N	\N	\N	\N	f	f	active	\N	\N	2025-06-27 17:04:38.332508	2025-06-27 17:04:38.332508	4
11	Organic Wheat Flour	సేంద్రీయ గోధుమ పిండి	organic-wheat-flour	Fresh milled organic wheat flour	తాజా రుబ్బిన సేంద్రీయ గోధుమ పిండి	\N	GRN003	\N	3	58.00	65.00	\N	kg	1.000	\N	\N	\N	\N	\N	\N	\N	t	f	active	\N	\N	2025-06-27 17:04:38.332508	2025-06-27 17:04:38.332508	5
12	Organic Toor Dal	సేంద్రీయ కందిపప్పు	organic-toor-dal	High quality organic toor dal	అధిక నాణ్యత సేంద్రీయ కందిపప్పు	\N	PUL001	\N	4	145.00	160.00	\N	kg	1.000	\N	\N	\N	\N	\N	\N	\N	f	f	active	\N	\N	2025-06-27 17:04:38.332508	2025-06-27 17:04:38.332508	4
13	Organic Moong Dal	సేంద్రీయ పెసలుపప్పు	organic-moong-dal	Premium organic moong dal	ప్రీమియం సేంద్రీయ పెసలుపప్పు	\N	PUL002	\N	4	135.00	150.00	\N	kg	1.000	\N	\N	\N	\N	\N	\N	\N	t	f	active	\N	\N	2025-06-27 17:04:38.332508	2025-06-27 17:04:38.332508	3
14	Organic Chana Dal	సేంద్రీయ శనగపప్పు	organic-chana-dal	Nutritious organic chana dal	పోషకాహార సేంద్రీయ శనగపప్పు	\N	PUL003	\N	4	125.00	140.00	\N	kg	1.000	\N	\N	\N	\N	\N	\N	\N	f	f	active	\N	\N	2025-06-27 17:04:38.332508	2025-06-27 17:04:38.332508	5
15	Organic Turmeric Powder	సేంద్రీయ పసుపు పొడి	organic-turmeric-powder	Pure organic turmeric powder	స్వచ్ఛమైన సేంద్రీయ పసుపు పొడి	\N	SPI001	\N	5	185.00	200.00	\N	kg	0.500	\N	\N	\N	\N	\N	\N	\N	t	f	active	\N	\N	2025-06-27 17:04:38.332508	2025-06-27 17:04:38.332508	5
16	Organic Red Chili Powder	సేంద్రీయ ఎర్రమిర్చి పొడి	organic-red-chili-powder	Authentic Andhra red chili powder	అసలైన ఆంధ్ర ఎర్రమిర్చి పొడి	\N	SPI002	\N	5	220.00	240.00	\N	kg	0.500	\N	\N	\N	\N	\N	\N	\N	f	f	active	\N	\N	2025-06-27 17:04:38.332508	2025-06-27 17:04:38.332508	5
17	Organic Coriander Powder	సేంద్రీయ ధనియాల పొడి	organic-coriander-powder	Fresh ground organic coriander	తాజా రుబ్బిన సేంద్రీయ ధనియాలు	\N	SPI003	\N	5	165.00	180.00	\N	kg	0.500	\N	\N	\N	\N	\N	\N	\N	t	f	active	\N	\N	2025-06-27 17:04:38.332508	2025-06-27 17:04:38.332508	4
18	Organic Coconut Oil	సేంద్రీయ కొబ్బరి నూనె	organic-coconut-oil	Cold-pressed coconut oil	చల్లని నొక్కిన కొబ్బరి నూనె	\N	OIL001	\N	7	285.00	320.00	\N	liter	1.000	\N	\N	\N	\N	\N	\N	\N	t	f	active	\N	\N	2025-06-27 17:04:38.332508	2025-06-27 17:04:38.332508	4
19	Organic Sesame Oil	సేంద్రీయ నువ్వుల నూనె	organic-sesame-oil	Traditional cold-pressed sesame oil	సంప్రదాయ చల్లని నొక్కిన నువ్వుల నూనె	\N	OIL002	\N	7	195.00	220.00	\N	liter	0.500	\N	\N	\N	\N	\N	\N	\N	f	f	active	\N	\N	2025-06-27 17:04:38.332508	2025-06-27 17:04:38.332508	3
20	Organic Pure Ghee	సేంద్రీయ స్వచ్ఛమైన నెయ్యి	organic-pure-ghee	Premium organic cow ghee	ప్రీమియం సేంద్రీయ ఆవు నెయ్యి	\N	OIL003	\N	7	485.00	520.00	\N	liter	1.000	\N	\N	\N	\N	\N	\N	\N	t	f	active	\N	\N	2025-06-27 17:04:38.332508	2025-06-27 17:04:38.332508	1
\.


--
-- Data for Name: promotion_usage; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.promotion_usage (id, promotion_id, customer_id, order_id, discount_amount, used_at) FROM stdin;
\.


--
-- Data for Name: promotions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.promotions (id, name, description, code, type, value, minimum_order_amount, maximum_discount, usage_limit, used_count, per_customer_limit, applicable_categories, applicable_products, start_date, end_date, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: purchase_order_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.purchase_order_items (id, purchase_order_id, product_id, quantity, unit_cost, total_cost, received_quantity, status, created_at) FROM stdin;
\.


--
-- Data for Name: purchase_orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.purchase_orders (id, po_number, supplier_id, branch_id, status, order_date, expected_delivery_date, actual_delivery_date, subtotal, tax_amount, total_amount, currency, terms_conditions, notes, created_by, approved_by, approved_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: queue_jobs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.queue_jobs (id, queue_name, job_type, payload, status, attempts, max_attempts, scheduled_at, started_at, completed_at, failed_at, error_message, created_at) FROM stdin;
\.


--
-- Data for Name: rate_limits; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.rate_limits (id, identifier, endpoint, requests_count, window_start, created_at) FROM stdin;
\.


--
-- Data for Name: restore_jobs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.restore_jobs (id, job_id, backup_job_id, status, target_database, restore_point, started_at, completed_at, error, metadata, created_by) FROM stdin;
\.


--
-- Data for Name: return_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.return_items (id, return_id, order_item_id, quantity, condition, created_at) FROM stdin;
\.


--
-- Data for Name: returns; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.returns (id, return_number, order_id, customer_id, reason, description, status, refund_amount, approved_by, approved_at, processed_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.roles (id, name, description, permissions, is_active, created_at, updated_at) FROM stdin;
1	super_admin	Super Administrator with full access	{"all": true}	t	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
2	admin	Branch Administrator	{"branch": "manage", "orders": "manage", "inventory": "manage"}	t	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
3	manager	Branch Manager	{"branch": "view", "orders": "view", "inventory": "view"}	t	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
4	employee	Branch Employee	{"orders": "view", "inventory": "view"}	t	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
5	customer	Regular Customer	{"orders": "own", "profile": "manage"}	t	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
6	delivery_person	Delivery Personnel	{"orders": "delivery", "inventory": "view"}	t	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
7	accountant	Financial Manager	{"reports": "view", "expenses": "manage"}	t	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
8	marketing_manager	Marketing Manager	{"analytics": "view", "campaigns": "manage"}	t	2025-06-27 17:05:24.206346	2025-06-27 17:05:24.206346
\.


--
-- Data for Name: sales_reports; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sales_reports (id, report_date, branch_id, total_orders, total_revenue, total_items_sold, average_order_value, new_customers, returning_customers, created_at) FROM stdin;
\.


--
-- Data for Name: scheduled_tasks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.scheduled_tasks (id, name, description, cron_expression, command, is_active, last_run_at, next_run_at, success_count, failure_count, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: search_queries; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.search_queries (id, query, customer_id, results_count, selected_product_id, ip_address, created_at) FROM stdin;
\.


--
-- Data for Name: seo_meta; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.seo_meta (id, entity_type, entity_id, meta_title, meta_description, meta_keywords, og_title, og_description, og_image, canonical_url, robots_meta, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sessions (sid, sess, expire) FROM stdin;
\.


--
-- Data for Name: shipping_methods; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.shipping_methods (id, name, description, cost, estimated_delivery_days, weight_limit, is_active, created_at, updated_at) FROM stdin;
1	Standard Delivery	Regular home delivery	25.00	1	50.00	t	2025-06-27 17:05:43.666219	2025-06-27 17:05:43.666219
2	Express Delivery	Same day delivery	75.00	0	25.00	t	2025-06-27 17:05:43.666219	2025-06-27 17:05:43.666219
3	Bulk Delivery	For large orders	50.00	2	100.00	t	2025-06-27 17:05:43.666219	2025-06-27 17:05:43.666219
4	Premium Delivery	White glove service	150.00	0	30.00	t	2025-06-27 17:05:43.666219	2025-06-27 17:05:43.666219
\.


--
-- Data for Name: social_media_posts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.social_media_posts (id, platform, post_id, content, media_urls, scheduled_at, published_at, engagement_metrics, status, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: states; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.states (id, country_id, code, name, is_active) FROM stdin;
1	1	AP	Andhra Pradesh	t
2	1	TS	Telangana	t
\.


--
-- Data for Name: stock_alerts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.stock_alerts (id, product_id, branch_id, alert_type, threshold_value, current_value, is_resolved, resolved_at, created_at) FROM stdin;
\.


--
-- Data for Name: subscription_plans; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.subscription_plans (id, name, description, type, duration_days, price, features, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: suppliers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.suppliers (id, name, code, contact_person, email, phone, address, city, state, country, postal_code, gst_number, payment_terms, credit_limit, rating, status, notes, created_at, updated_at) FROM stdin;
1	Andhra Organic Farms	SUP001	Ramesh Naidu	ramesh@andhraorganic.com	+919876543220	123 Organic Lane, Guntur	Guntur	Andhra Pradesh	India	522001	29ABCDE1234F1Z5	Net 30	500000.00	4.50	active	Premium organic vegetables supplier	2025-06-27 17:27:16.81067	2025-06-27 17:27:16.81067
2	Telangana Spice Co	SUP002	Lakshmi Reddy	lakshmi@telanganaspice.com	+919876543221	456 Spice Street, Warangal	Warangal	Telangana	India	506001	36FGHIJ5678K2A1	Net 15	300000.00	4.30	active	Traditional spices and condiments	2025-06-27 17:27:16.81067	2025-06-27 17:27:16.81067
3	Kerala Coconut Products	SUP003	Suresh Kumar	suresh@keralacoconut.com	+919876543222	789 Coconut Grove, Kochi	Kochi	Kerala	India	682001	32KLMNO9012P3B2	Net 45	400000.00	4.70	active	Coconut oil and products	2025-06-27 17:27:16.81067	2025-06-27 17:27:16.81067
4	Tamil Nadu Rice Mills	SUP004	Murugan Selvam	murugan@tnrice.com	+919876543223	321 Rice Mill Road, Thanjavur	Thanjavur	Tamil Nadu	India	613001	33QRSTU3456V4C3	Net 30	600000.00	4.40	active	Organic rice and grains	2025-06-27 17:27:16.81067	2025-06-27 17:27:16.81067
5	Karnataka Pulse Trading	SUP005	Geetha Rao	geetha@karnatakpulse.com	+919876543224	654 Pulse Market, Mysore	Mysore	Karnataka	India	570001	29WXYZAB7890C5D4	Net 30	350000.00	4.60	active	Dal and pulses specialist	2025-06-27 17:27:16.81067	2025-06-27 17:27:16.81067
\.


--
-- Data for Name: support_ticket_messages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.support_ticket_messages (id, ticket_id, sender_id, message, attachments, is_internal, created_at) FROM stdin;
\.


--
-- Data for Name: support_tickets; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.support_tickets (id, ticket_number, customer_id, subject, description, priority, status, category, assigned_to, assigned_at, resolved_at, resolution_notes, satisfaction_rating, created_at, updated_at) FROM stdin;
1	TKT-2024-001	1	Late Delivery - Order ORD-2024-001	My organic vegetables order was supposed to arrive yesterday but it is still not delivered.	high	resolved	delivery	support001	2025-06-24 17:43:51.739109	2025-06-25 17:43:51.739109	Contacted delivery partner. Order delivered successfully with compensation coupon.	5	2025-06-24 17:43:51.739109	2025-06-25 17:43:51.739109
2	TKT-2024-002	2	Product Quality Issue	The organic bananas received were overripe and not fresh as expected.	medium	in_progress	quality	support002	2025-06-26 17:43:51.739109	\N	Quality team investigating. Replacement order initiated.	\N	2025-06-26 17:43:51.739109	2025-06-27 05:43:51.739109
3	TKT-2024-003	3	Payment Gateway Error	Payment was deducted but order status shows payment failed.	high	open	payment	\N	\N	\N	\N	\N	2025-06-27 11:43:51.739109	2025-06-27 11:43:51.739109
4	TKT-2024-004	1	Request for Bulk Discount	I regularly order organic products for my family. Can I get bulk discount for monthly orders?	low	resolved	billing	support001	2025-06-20 17:43:51.739109	2025-06-22 17:43:51.739109	Bulk discount program explained. Customer enrolled in family plan.	4	2025-06-20 17:43:51.739109	2025-06-22 17:43:51.739109
5	TKT-2024-005	4	Unable to Apply Coupon Code	The coupon code ORGANIC20 is not working during checkout.	medium	open	technical	support003	2025-06-27 15:43:51.739109	\N	\N	\N	2025-06-27 15:43:51.739109	2025-06-27 15:43:51.739109
\.


--
-- Data for Name: system_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.system_logs (id, level, message, context, service, trace_id, created_at) FROM stdin;
\.


--
-- Data for Name: system_settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.system_settings (id, key, value, type, description, is_public, updated_by, created_at, updated_at) FROM stdin;
1	site_name	LeafyHealth	string	Website name	t	\N	2025-06-27 17:05:43.666219	2025-06-27 17:05:43.666219
2	site_tagline	Organic. Authentic. Telugu.	string	Website tagline	t	\N	2025-06-27 17:05:43.666219	2025-06-27 17:05:43.666219
3	default_currency	INR	string	Default currency code	t	\N	2025-06-27 17:05:43.666219	2025-06-27 17:05:43.666219
4	tax_rate	18.0	number	Default GST rate	f	\N	2025-06-27 17:05:43.666219	2025-06-27 17:05:43.666219
5	min_order_amount	200.0	number	Minimum order amount for delivery	t	\N	2025-06-27 17:05:43.666219	2025-06-27 17:05:43.666219
6	free_delivery_threshold	500.0	number	Free delivery above this amount	t	\N	2025-06-27 17:05:43.666219	2025-06-27 17:05:43.666219
7	platform_commission	8.5	number	Platform commission percentage	f	\N	2025-06-27 17:05:43.666219	2025-06-27 17:05:43.666219
8	loyalty_points_rate	1.0	number	Points earned per rupee spent	t	\N	2025-06-27 17:05:43.666219	2025-06-27 17:05:43.666219
9	max_delivery_distance	50.0	number	Maximum delivery distance in km	t	\N	2025-06-27 17:05:43.666219	2025-06-27 17:05:43.666219
10	order_processing_time	2	number	Order processing time in hours	t	\N	2025-06-27 17:05:43.666219	2025-06-27 17:05:43.666219
\.


--
-- Data for Name: tax_rates; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tax_rates (id, name, rate, type, applicable_categories, effective_from, effective_to, is_active, created_at, updated_at) FROM stdin;
1	GST Standard Rate	18.00	GST	[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]	2024-01-01	\N	t	2025-06-27 17:05:43.666219	2025-06-27 17:05:43.666219
2	GST Reduced Rate	5.00	GST	[1, 2]	2024-01-01	\N	t	2025-06-27 17:05:43.666219	2025-06-27 17:05:43.666219
3	GST Zero Rate	0.00	GST	[]	2024-01-01	\N	t	2025-06-27 17:05:43.666219	2025-06-27 17:05:43.666219
\.


--
-- Data for Name: traditional_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.traditional_items (id, name_english, name_telugu, category, unit, ordinary_price, medium_price, best_price, is_active, region, created_at, updated_at) FROM stdin;
1	Basmati Rice	బాస్మతి బియ్యం	grains	kg	85.00	120.00	180.00	t	AP_TG	2025-07-05 17:35:56.024542	2025-07-05 17:35:56.024542
2	Sona Masoori Rice	సోనా మసూరి బియ్యం	grains	kg	65.00	85.00	115.00	t	AP_TG	2025-07-05 17:35:56.024542	2025-07-05 17:35:56.024542
3	Wheat Flour	గోధుమ పిండి	grains	kg	42.00	55.00	75.00	t	AP_TG	2025-07-05 17:35:56.024542	2025-07-05 17:35:56.024542
4	Besan Flour	శనగ పిండి	grains	kg	95.00	115.00	145.00	t	AP_TG	2025-07-05 17:35:56.024542	2025-07-05 17:35:56.024542
5	Rice Flour	బియ్యం పిండి	grains	kg	45.00	60.00	80.00	t	AP_TG	2025-07-05 17:35:56.024542	2025-07-05 17:35:56.024542
6	Toor Dal	కందిపప్పు	pulses	kg	140.00	165.00	195.00	t	AP_TG	2025-07-05 17:35:56.024542	2025-07-05 17:35:56.024542
7	Chana Dal	శనగపప్పు	pulses	kg	120.00	145.00	175.00	t	AP_TG	2025-07-05 17:35:56.024542	2025-07-05 17:35:56.024542
8	Moong Dal	పెసరపప్పు	pulses	kg	145.00	170.00	210.00	t	AP_TG	2025-07-05 17:35:56.024542	2025-07-05 17:35:56.024542
9	Urad Dal	మినుములు	pulses	kg	155.00	185.00	225.00	t	AP_TG	2025-07-05 17:35:56.024542	2025-07-05 17:35:56.024542
10	Masoor Dal	ఎర్ర శనగలు	pulses	kg	135.00	160.00	190.00	t	AP_TG	2025-07-05 17:35:56.024542	2025-07-05 17:35:56.024542
11	Turmeric Powder	పసుపు పొడి	spices	kg	185.00	225.00	285.00	t	AP_TG	2025-07-05 17:35:56.024542	2025-07-05 17:35:56.024542
12	Red Chili Powder	ఎర్రమిర్చి పొడి	spices	kg	320.00	395.00	485.00	t	AP_TG	2025-07-05 17:35:56.024542	2025-07-05 17:35:56.024542
13	Coriander Powder	ధనియాల పొడి	spices	kg	125.00	165.00	215.00	t	AP_TG	2025-07-05 17:35:56.024542	2025-07-05 17:35:56.024542
14	Cumin Seeds	జీలకర్ర	spices	kg	285.00	365.00	465.00	t	AP_TG	2025-07-05 17:35:56.024542	2025-07-05 17:35:56.024542
15	Mustard Seeds	ఆవాలు	spices	kg	95.00	125.00	165.00	t	AP_TG	2025-07-05 17:35:56.024542	2025-07-05 17:35:56.024542
16	Tamarind	చింతపండు	spices	kg	85.00	110.00	145.00	t	AP_TG	2025-07-05 17:35:56.024542	2025-07-05 17:35:56.024542
17	Sunflower Oil	సూర్యకాంతి నూనె	oils	liter	155.00	185.00	225.00	t	AP_TG	2025-07-05 17:35:56.024542	2025-07-05 17:35:56.024542
18	Groundnut Oil	వేరుశెనగ నూనె	oils	liter	195.00	235.00	285.00	t	AP_TG	2025-07-05 17:35:56.024542	2025-07-05 17:35:56.024542
19	Coconut Oil	కొబ్బరి నూనె	oils	liter	165.00	205.00	255.00	t	AP_TG	2025-07-05 17:35:56.024542	2025-07-05 17:35:56.024542
20	Sesame Oil	నువ్వుల నూనె	oils	liter	285.00	345.00	425.00	t	AP_TG	2025-07-05 17:35:56.024542	2025-07-05 17:35:56.024542
21	Rock Salt	శిలా లవణం	essentials	kg	25.00	35.00	55.00	t	AP_TG	2025-07-05 17:35:56.024542	2025-07-05 17:35:56.024542
22	Jaggery	బెల్లం	essentials	kg	85.00	105.00	135.00	t	AP_TG	2025-07-05 17:35:56.024542	2025-07-05 17:35:56.024542
23	Sugar	చక్కెర	essentials	kg	48.00	58.00	72.00	t	AP_TG	2025-07-05 17:35:56.024542	2025-07-05 17:35:56.024542
24	Tea Powder	టీ పొడి	essentials	kg	325.00	425.00	585.00	t	AP_TG	2025-07-05 17:35:56.024542	2025-07-05 17:35:56.024542
25	Coffee Powder	కాఫీ పొడి	essentials	kg	455.00	585.00	785.00	t	AP_TG	2025-07-05 17:35:56.024542	2025-07-05 17:35:56.024542
26	Cashews	జీడిపప్పు	dry_fruits	kg	685.00	885.00	1185.00	t	AP_TG	2025-07-05 17:35:56.024542	2025-07-05 17:35:56.024542
27	Almonds	బాదంపప్పు	dry_fruits	kg	785.00	985.00	1385.00	t	AP_TG	2025-07-05 17:35:56.024542	2025-07-05 17:35:56.024542
28	Raisins	ఎండు ద్రాక్ష	dry_fruits	kg	285.00	385.00	515.00	t	AP_TG	2025-07-05 17:35:56.024542	2025-07-05 17:35:56.024542
29	Dates	ఖర్జూరం	dry_fruits	kg	185.00	285.00	415.00	t	AP_TG	2025-07-05 17:35:56.024542	2025-07-05 17:35:56.024542
30	Bombay Rava	బాంబాయి రవ్వ	grains	kg	55.00	70.00	90.00	t	AP_TG	2025-07-05 17:35:56.024542	2025-07-05 17:35:56.024542
31	Idli Rava	ఇడ్లీ రవ్వ	grains	kg	48.00	62.00	82.00	t	AP_TG	2025-07-05 17:35:56.024542	2025-07-05 17:35:56.024542
32	Poha	అటుకులు	grains	kg	65.00	85.00	110.00	t	AP_TG	2025-07-05 17:35:56.024542	2025-07-05 17:35:56.024542
33	Sabudana	సగ్గుబియ్యం	grains	kg	85.00	110.00	145.00	t	AP_TG	2025-07-05 17:35:56.024542	2025-07-05 17:35:56.024542
34	Vermicelli	సేమియా	grains	kg	75.00	95.00	125.00	t	AP_TG	2025-07-05 17:35:56.024542	2025-07-05 17:35:56.024542
\.


--
-- Data for Name: traditional_order_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.traditional_order_items (id, order_id, item_id, quantity, unit_price, total_price, created_at) FROM stdin;
\.


--
-- Data for Name: traditional_orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.traditional_orders (id, customer_id, order_type, quality_tier, total_amount, selected_vendor_id, delivery_address, order_status, order_date, delivery_date, notes, created_at, updated_at, branch_id) FROM stdin;
\.


--
-- Data for Name: translations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.translations (id, language_code, namespace, key, value, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_roles (id, user_id, role_id, assigned_by, assigned_at, expires_at, is_active) FROM stdin;
\.


--
-- Data for Name: user_sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_sessions (id, user_id, branch_id, session_token, refresh_token, expires_at, ip_address, user_agent, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
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
global001	global.admin@leafyhealth.com	Global	Administrator	\N	Global Administrator	super_admin	active	super-admin	Administration	\N	t	t	\N	1	1	\N	\N	2025-06-28 15:52:13.06345	2025-06-28 15:52:13.06345	\N	$2b$12$ngWPboWN8Qp7c5WNxfyyHe4UReNNXJxg6L5Y/A1bRsYhk78l.0I5y
ops001	ops.admin@leafyhealth.com	Operations	Administrator	\N	Operations Administrator	super_admin	active	super-admin	Operations	\N	t	t	\N	1	1	\N	\N	2025-06-28 15:52:13.06345	2025-06-28 15:52:13.06345	\N	$2b$12$3glyzej29A0FIyUnCtrGBOkGPakULDj/f1z37LYPt8H3nXp9xlZyC
customer-1751700072363	customer@leafyhealth.com	Test	\N	\N	Test Customer	customer	active	\N	\N	\N	t	t	\N	\N	\N	\N	\N	2025-07-05 07:21:13.920537	2025-07-05 07:21:13.920537	\N	$2b$12$45/Wxwk18yUh/6fMTD3jIevEJyV55OkasGAOBIl2aGQ9H7Ws/QxGe
\.


--
-- Data for Name: vendors; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.vendors (id, name, vendor_type, contact_person, phone, email, address, gst_number, pan_number, bank_details, payment_terms, credit_limit, current_balance, is_active, rating, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: webhook_deliveries; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.webhook_deliveries (id, webhook_id, event_type, payload, response_status, response_body, delivered_at, retry_count) FROM stdin;
\.


--
-- Data for Name: webhooks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.webhooks (id, name, url, events, secret, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: wishlist_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.wishlist_items (id, wishlist_id, product_id, added_at) FROM stdin;
1	1	6	2025-06-27 17:32:10.100126
2	1	15	2025-06-27 17:32:10.100126
3	1	18	2025-06-27 17:32:10.100126
4	2	10	2025-06-27 17:32:10.100126
5	2	11	2025-06-27 17:32:10.100126
6	2	14	2025-06-27 17:32:10.100126
7	3	15	2025-06-27 17:32:10.100126
8	3	18	2025-06-27 17:32:10.100126
9	3	17	2025-06-27 17:32:10.100126
10	4	6	2025-06-27 17:32:10.100126
11	4	4	2025-06-27 17:32:10.100126
12	5	15	2025-06-27 17:32:10.100126
\.


--
-- Data for Name: wishlists; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.wishlists (id, customer_id, name, is_public, created_at, updated_at) FROM stdin;
1	1	My Favorites	f	2025-06-27 17:32:10.100126	2025-06-27 17:32:10.100126
2	2	Weekly Groceries	f	2025-06-27 17:32:10.100126	2025-06-27 17:32:10.100126
3	3	Organic Essentials	t	2025-06-27 17:32:10.100126	2025-06-27 17:32:10.100126
4	4	Festival Shopping	f	2025-06-27 17:32:10.100126	2025-06-27 17:32:10.100126
5	5	Health Foods	f	2025-06-27 17:32:10.100126	2025-06-27 17:32:10.100126
\.


--
-- Name: ab_test_assignments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.ab_test_assignments_id_seq', 1, false);


--
-- Name: ab_tests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.ab_tests_id_seq', 1, false);


--
-- Name: activity_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.activity_logs_id_seq', 1, false);


--
-- Name: analytics_events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.analytics_events_id_seq', 1, false);


--
-- Name: api_keys_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.api_keys_id_seq', 1, false);


--
-- Name: api_request_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.api_request_logs_id_seq', 1, false);


--
-- Name: audit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.audit_logs_id_seq', 1, false);


--
-- Name: backup_jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.backup_jobs_id_seq', 5, true);


--
-- Name: backup_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.backup_logs_id_seq', 1, false);


--
-- Name: backup_schedules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.backup_schedules_id_seq', 1, false);


--
-- Name: branch_traditional_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.branch_traditional_items_id_seq', 170, true);


--
-- Name: branches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.branches_id_seq', 5, true);


--
-- Name: brands_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.brands_id_seq', 5, true);


--
-- Name: cache_entries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cache_entries_id_seq', 1, false);


--
-- Name: campaign_recipients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.campaign_recipients_id_seq', 1, false);


--
-- Name: cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cart_items_id_seq', 3, true);


--
-- Name: carts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.carts_id_seq', 1, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_id_seq', 10, true);


--
-- Name: cities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cities_id_seq', 6, true);


--
-- Name: cms_banners_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cms_banners_id_seq', 1, false);


--
-- Name: cms_pages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cms_pages_id_seq', 1, false);


--
-- Name: communication_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.communication_logs_id_seq', 1, false);


--
-- Name: communication_templates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.communication_templates_id_seq', 1, false);


--
-- Name: companies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.companies_id_seq', 3, true);


--
-- Name: compliance_checks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.compliance_checks_id_seq', 1, false);


--
-- Name: content_versions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.content_versions_id_seq', 1, false);


--
-- Name: countries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.countries_id_seq', 1, true);


--
-- Name: currencies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.currencies_id_seq', 1, true);


--
-- Name: custom_template_dimensions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.custom_template_dimensions_id_seq', 1, false);


--
-- Name: customer_addresses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.customer_addresses_id_seq', 1, false);


--
-- Name: customer_subscriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.customer_subscriptions_id_seq', 1, false);


--
-- Name: customers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.customers_id_seq', 10, true);


--
-- Name: data_privacy_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.data_privacy_requests_id_seq', 1, false);


--
-- Name: delivery_assignments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.delivery_assignments_id_seq', 1, false);


--
-- Name: delivery_schedules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.delivery_schedules_id_seq', 1, false);


--
-- Name: delivery_zones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.delivery_zones_id_seq', 6, true);


--
-- Name: employee_attendance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.employee_attendance_id_seq', 1, false);


--
-- Name: employees_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.employees_id_seq', 1, false);


--
-- Name: expense_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.expense_categories_id_seq', 1, false);


--
-- Name: expenses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.expenses_id_seq', 1, false);


--
-- Name: feature_flags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.feature_flags_id_seq', 1, false);


--
-- Name: gift_card_transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.gift_card_transactions_id_seq', 1, false);


--
-- Name: gift_cards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.gift_cards_id_seq', 1, false);


--
-- Name: health_checks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.health_checks_id_seq', 1, false);


--
-- Name: image_uploads_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.image_uploads_id_seq', 1, false);


--
-- Name: integrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.integrations_id_seq', 1, false);


--
-- Name: inventory_adjustments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.inventory_adjustments_id_seq', 1, false);


--
-- Name: inventory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.inventory_id_seq', 100, true);


--
-- Name: inventory_transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.inventory_transactions_id_seq', 1, false);


--
-- Name: label_templates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.label_templates_id_seq', 1, false);


--
-- Name: loyalty_rewards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.loyalty_rewards_id_seq', 1, false);


--
-- Name: loyalty_transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.loyalty_transactions_id_seq', 1, false);


--
-- Name: marketing_campaigns_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.marketing_campaigns_id_seq', 1, false);


--
-- Name: marketplace_listings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.marketplace_listings_id_seq', 1, false);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.order_items_id_seq', 1, false);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.orders_id_seq', 1, false);


--
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payments_id_seq', 1, false);


--
-- Name: performance_metrics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.performance_metrics_id_seq', 1, false);


--
-- Name: price_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.price_history_id_seq', 1, false);


--
-- Name: product_answers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_answers_id_seq', 1, false);


--
-- Name: product_attribute_values_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_attribute_values_id_seq', 1, false);


--
-- Name: product_attributes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_attributes_id_seq', 1, false);


--
-- Name: product_collection_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_collection_items_id_seq', 1, false);


--
-- Name: product_collections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_collections_id_seq', 1, false);


--
-- Name: product_questions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_questions_id_seq', 1, false);


--
-- Name: product_reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_reviews_id_seq', 1, false);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.products_id_seq', 20, true);


--
-- Name: promotion_usage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.promotion_usage_id_seq', 1, false);


--
-- Name: promotions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.promotions_id_seq', 1, false);


--
-- Name: purchase_order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.purchase_order_items_id_seq', 1, false);


--
-- Name: purchase_orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.purchase_orders_id_seq', 1, false);


--
-- Name: queue_jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.queue_jobs_id_seq', 1, false);


--
-- Name: rate_limits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.rate_limits_id_seq', 1, false);


--
-- Name: restore_jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.restore_jobs_id_seq', 1, false);


--
-- Name: return_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.return_items_id_seq', 1, false);


--
-- Name: returns_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.returns_id_seq', 1, false);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.roles_id_seq', 8, true);


--
-- Name: sales_reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sales_reports_id_seq', 1, false);


--
-- Name: scheduled_tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.scheduled_tasks_id_seq', 1, false);


--
-- Name: search_queries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.search_queries_id_seq', 1, false);


--
-- Name: seo_meta_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.seo_meta_id_seq', 1, false);


--
-- Name: shipping_methods_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.shipping_methods_id_seq', 4, true);


--
-- Name: social_media_posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.social_media_posts_id_seq', 1, false);


--
-- Name: states_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.states_id_seq', 2, true);


--
-- Name: stock_alerts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.stock_alerts_id_seq', 1, false);


--
-- Name: subscription_plans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.subscription_plans_id_seq', 1, false);


--
-- Name: suppliers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.suppliers_id_seq', 1, false);


--
-- Name: support_ticket_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.support_ticket_messages_id_seq', 1, false);


--
-- Name: support_tickets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.support_tickets_id_seq', 1, false);


--
-- Name: system_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.system_logs_id_seq', 1, false);


--
-- Name: system_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.system_settings_id_seq', 10, true);


--
-- Name: tax_rates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tax_rates_id_seq', 3, true);


--
-- Name: traditional_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.traditional_items_id_seq', 34, true);


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
-- Name: user_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_roles_id_seq', 1, false);


--
-- Name: user_sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_sessions_id_seq', 1, false);


--
-- Name: vendors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.vendors_id_seq', 1, false);


--
-- Name: webhook_deliveries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.webhook_deliveries_id_seq', 1, false);


--
-- Name: webhooks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.webhooks_id_seq', 1, false);


--
-- Name: wishlist_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.wishlist_items_id_seq', 1, false);


--
-- Name: wishlists_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.wishlists_id_seq', 1, false);


--
-- Name: ab_test_assignments ab_test_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ab_test_assignments
    ADD CONSTRAINT ab_test_assignments_pkey PRIMARY KEY (id);


--
-- Name: ab_tests ab_tests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ab_tests
    ADD CONSTRAINT ab_tests_pkey PRIMARY KEY (id);


--
-- Name: activity_logs activity_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_pkey PRIMARY KEY (id);


--
-- Name: analytics_events analytics_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analytics_events
    ADD CONSTRAINT analytics_events_pkey PRIMARY KEY (id);


--
-- Name: api_keys api_keys_key_hash_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_key_hash_key UNIQUE (key_hash);


--
-- Name: api_keys api_keys_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_pkey PRIMARY KEY (id);


--
-- Name: api_request_logs api_request_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_request_logs
    ADD CONSTRAINT api_request_logs_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: backup_jobs backup_jobs_job_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.backup_jobs
    ADD CONSTRAINT backup_jobs_job_id_key UNIQUE (job_id);


--
-- Name: backup_jobs backup_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.backup_jobs
    ADD CONSTRAINT backup_jobs_pkey PRIMARY KEY (id);


--
-- Name: backup_logs backup_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.backup_logs
    ADD CONSTRAINT backup_logs_pkey PRIMARY KEY (id);


--
-- Name: backup_schedules backup_schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.backup_schedules
    ADD CONSTRAINT backup_schedules_pkey PRIMARY KEY (id);


--
-- Name: branch_traditional_items branch_traditional_items_branch_id_item_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.branch_traditional_items
    ADD CONSTRAINT branch_traditional_items_branch_id_item_id_key UNIQUE (branch_id, item_id);


--
-- Name: branch_traditional_items branch_traditional_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.branch_traditional_items
    ADD CONSTRAINT branch_traditional_items_pkey PRIMARY KEY (id);


--
-- Name: branches branches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.branches
    ADD CONSTRAINT branches_pkey PRIMARY KEY (id);


--
-- Name: brands brands_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_pkey PRIMARY KEY (id);


--
-- Name: brands brands_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_slug_key UNIQUE (slug);


--
-- Name: cache_entries cache_entries_cache_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cache_entries
    ADD CONSTRAINT cache_entries_cache_key_key UNIQUE (cache_key);


--
-- Name: cache_entries cache_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cache_entries
    ADD CONSTRAINT cache_entries_pkey PRIMARY KEY (id);


--
-- Name: campaign_recipients campaign_recipients_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_recipients
    ADD CONSTRAINT campaign_recipients_pkey PRIMARY KEY (id);


--
-- Name: cart_items cart_items_cart_id_product_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_cart_id_product_id_key UNIQUE (cart_id, product_id);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: categories categories_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_slug_key UNIQUE (slug);


--
-- Name: cities cities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cities
    ADD CONSTRAINT cities_pkey PRIMARY KEY (id);


--
-- Name: cms_banners cms_banners_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cms_banners
    ADD CONSTRAINT cms_banners_pkey PRIMARY KEY (id);


--
-- Name: cms_pages cms_pages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cms_pages
    ADD CONSTRAINT cms_pages_pkey PRIMARY KEY (id);


--
-- Name: cms_pages cms_pages_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cms_pages
    ADD CONSTRAINT cms_pages_slug_key UNIQUE (slug);


--
-- Name: communication_logs communication_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communication_logs
    ADD CONSTRAINT communication_logs_pkey PRIMARY KEY (id);


--
-- Name: communication_templates communication_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communication_templates
    ADD CONSTRAINT communication_templates_pkey PRIMARY KEY (id);


--
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);


--
-- Name: companies companies_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_slug_key UNIQUE (slug);


--
-- Name: compliance_checks compliance_checks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compliance_checks
    ADD CONSTRAINT compliance_checks_pkey PRIMARY KEY (id);


--
-- Name: content_versions content_versions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_versions
    ADD CONSTRAINT content_versions_pkey PRIMARY KEY (id);


--
-- Name: countries countries_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_code_key UNIQUE (code);


--
-- Name: countries countries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_pkey PRIMARY KEY (id);


--
-- Name: currencies currencies_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.currencies
    ADD CONSTRAINT currencies_code_key UNIQUE (code);


--
-- Name: currencies currencies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.currencies
    ADD CONSTRAINT currencies_pkey PRIMARY KEY (id);


--
-- Name: custom_template_dimensions custom_template_dimensions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.custom_template_dimensions
    ADD CONSTRAINT custom_template_dimensions_pkey PRIMARY KEY (id);


--
-- Name: customer_addresses customer_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_addresses
    ADD CONSTRAINT customer_addresses_pkey PRIMARY KEY (id);


--
-- Name: customer_subscriptions customer_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_subscriptions
    ADD CONSTRAINT customer_subscriptions_pkey PRIMARY KEY (id);


--
-- Name: customers customers_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_email_key UNIQUE (email);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- Name: customers customers_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_user_id_key UNIQUE (user_id);


--
-- Name: data_privacy_requests data_privacy_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_privacy_requests
    ADD CONSTRAINT data_privacy_requests_pkey PRIMARY KEY (id);


--
-- Name: delivery_assignments delivery_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.delivery_assignments
    ADD CONSTRAINT delivery_assignments_pkey PRIMARY KEY (id);


--
-- Name: delivery_schedules delivery_schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.delivery_schedules
    ADD CONSTRAINT delivery_schedules_pkey PRIMARY KEY (id);


--
-- Name: delivery_zones delivery_zones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.delivery_zones
    ADD CONSTRAINT delivery_zones_pkey PRIMARY KEY (id);


--
-- Name: employee_attendance employee_attendance_employee_id_attendance_date_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_attendance
    ADD CONSTRAINT employee_attendance_employee_id_attendance_date_key UNIQUE (employee_id, attendance_date);


--
-- Name: employee_attendance employee_attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_attendance
    ADD CONSTRAINT employee_attendance_pkey PRIMARY KEY (id);


--
-- Name: employees employees_employee_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_employee_id_key UNIQUE (employee_id);


--
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (id);


--
-- Name: employees employees_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_user_id_key UNIQUE (user_id);


--
-- Name: expense_categories expense_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.expense_categories
    ADD CONSTRAINT expense_categories_pkey PRIMARY KEY (id);


--
-- Name: expenses expenses_expense_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_expense_number_key UNIQUE (expense_number);


--
-- Name: expenses expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_pkey PRIMARY KEY (id);


--
-- Name: feature_flags feature_flags_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feature_flags
    ADD CONSTRAINT feature_flags_name_key UNIQUE (name);


--
-- Name: feature_flags feature_flags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feature_flags
    ADD CONSTRAINT feature_flags_pkey PRIMARY KEY (id);


--
-- Name: gift_card_transactions gift_card_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gift_card_transactions
    ADD CONSTRAINT gift_card_transactions_pkey PRIMARY KEY (id);


--
-- Name: gift_cards gift_cards_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gift_cards
    ADD CONSTRAINT gift_cards_code_key UNIQUE (code);


--
-- Name: gift_cards gift_cards_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gift_cards
    ADD CONSTRAINT gift_cards_pkey PRIMARY KEY (id);


--
-- Name: health_checks health_checks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.health_checks
    ADD CONSTRAINT health_checks_pkey PRIMARY KEY (id);


--
-- Name: image_uploads image_uploads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.image_uploads
    ADD CONSTRAINT image_uploads_pkey PRIMARY KEY (id);


--
-- Name: integrations integrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.integrations
    ADD CONSTRAINT integrations_pkey PRIMARY KEY (id);


--
-- Name: inventory_adjustments inventory_adjustments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventory_adjustments
    ADD CONSTRAINT inventory_adjustments_pkey PRIMARY KEY (id);


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
-- Name: inventory_transactions inventory_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventory_transactions
    ADD CONSTRAINT inventory_transactions_pkey PRIMARY KEY (id);


--
-- Name: label_templates label_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.label_templates
    ADD CONSTRAINT label_templates_pkey PRIMARY KEY (id);


--
-- Name: loyalty_rewards loyalty_rewards_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.loyalty_rewards
    ADD CONSTRAINT loyalty_rewards_pkey PRIMARY KEY (id);


--
-- Name: loyalty_transactions loyalty_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.loyalty_transactions
    ADD CONSTRAINT loyalty_transactions_pkey PRIMARY KEY (id);


--
-- Name: marketing_campaigns marketing_campaigns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marketing_campaigns
    ADD CONSTRAINT marketing_campaigns_pkey PRIMARY KEY (id);


--
-- Name: marketplace_listings marketplace_listings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marketplace_listings
    ADD CONSTRAINT marketplace_listings_pkey PRIMARY KEY (id);


--
-- Name: marketplace_listings marketplace_listings_product_id_marketplace_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marketplace_listings
    ADD CONSTRAINT marketplace_listings_product_id_marketplace_key UNIQUE (product_id, marketplace);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_order_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_order_number_key UNIQUE (order_number);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: performance_metrics performance_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.performance_metrics
    ADD CONSTRAINT performance_metrics_pkey PRIMARY KEY (id);


--
-- Name: price_history price_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.price_history
    ADD CONSTRAINT price_history_pkey PRIMARY KEY (id);


--
-- Name: product_answers product_answers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_answers
    ADD CONSTRAINT product_answers_pkey PRIMARY KEY (id);


--
-- Name: product_attribute_values product_attribute_values_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_attribute_values
    ADD CONSTRAINT product_attribute_values_pkey PRIMARY KEY (id);


--
-- Name: product_attribute_values product_attribute_values_product_id_attribute_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_attribute_values
    ADD CONSTRAINT product_attribute_values_product_id_attribute_id_key UNIQUE (product_id, attribute_id);


--
-- Name: product_attributes product_attributes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_attributes
    ADD CONSTRAINT product_attributes_pkey PRIMARY KEY (id);


--
-- Name: product_collection_items product_collection_items_collection_id_product_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_collection_items
    ADD CONSTRAINT product_collection_items_collection_id_product_id_key UNIQUE (collection_id, product_id);


--
-- Name: product_collection_items product_collection_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_collection_items
    ADD CONSTRAINT product_collection_items_pkey PRIMARY KEY (id);


--
-- Name: product_collections product_collections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_collections
    ADD CONSTRAINT product_collections_pkey PRIMARY KEY (id);


--
-- Name: product_collections product_collections_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_collections
    ADD CONSTRAINT product_collections_slug_key UNIQUE (slug);


--
-- Name: product_questions product_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_questions
    ADD CONSTRAINT product_questions_pkey PRIMARY KEY (id);


--
-- Name: product_reviews product_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_reviews
    ADD CONSTRAINT product_reviews_pkey PRIMARY KEY (id);


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
-- Name: products products_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_slug_key UNIQUE (slug);


--
-- Name: promotion_usage promotion_usage_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.promotion_usage
    ADD CONSTRAINT promotion_usage_pkey PRIMARY KEY (id);


--
-- Name: promotions promotions_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_code_key UNIQUE (code);


--
-- Name: promotions promotions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_pkey PRIMARY KEY (id);


--
-- Name: purchase_order_items purchase_order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchase_order_items
    ADD CONSTRAINT purchase_order_items_pkey PRIMARY KEY (id);


--
-- Name: purchase_orders purchase_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_pkey PRIMARY KEY (id);


--
-- Name: purchase_orders purchase_orders_po_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_po_number_key UNIQUE (po_number);


--
-- Name: queue_jobs queue_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.queue_jobs
    ADD CONSTRAINT queue_jobs_pkey PRIMARY KEY (id);


--
-- Name: rate_limits rate_limits_identifier_endpoint_window_start_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rate_limits
    ADD CONSTRAINT rate_limits_identifier_endpoint_window_start_key UNIQUE (identifier, endpoint, window_start);


--
-- Name: rate_limits rate_limits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rate_limits
    ADD CONSTRAINT rate_limits_pkey PRIMARY KEY (id);


--
-- Name: restore_jobs restore_jobs_job_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.restore_jobs
    ADD CONSTRAINT restore_jobs_job_id_key UNIQUE (job_id);


--
-- Name: restore_jobs restore_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.restore_jobs
    ADD CONSTRAINT restore_jobs_pkey PRIMARY KEY (id);


--
-- Name: return_items return_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.return_items
    ADD CONSTRAINT return_items_pkey PRIMARY KEY (id);


--
-- Name: returns returns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.returns
    ADD CONSTRAINT returns_pkey PRIMARY KEY (id);


--
-- Name: returns returns_return_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.returns
    ADD CONSTRAINT returns_return_number_key UNIQUE (return_number);


--
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: sales_reports sales_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_reports
    ADD CONSTRAINT sales_reports_pkey PRIMARY KEY (id);


--
-- Name: sales_reports sales_reports_report_date_branch_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_reports
    ADD CONSTRAINT sales_reports_report_date_branch_id_key UNIQUE (report_date, branch_id);


--
-- Name: scheduled_tasks scheduled_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scheduled_tasks
    ADD CONSTRAINT scheduled_tasks_pkey PRIMARY KEY (id);


--
-- Name: search_queries search_queries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.search_queries
    ADD CONSTRAINT search_queries_pkey PRIMARY KEY (id);


--
-- Name: seo_meta seo_meta_entity_type_entity_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seo_meta
    ADD CONSTRAINT seo_meta_entity_type_entity_id_key UNIQUE (entity_type, entity_id);


--
-- Name: seo_meta seo_meta_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seo_meta
    ADD CONSTRAINT seo_meta_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);


--
-- Name: shipping_methods shipping_methods_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_methods
    ADD CONSTRAINT shipping_methods_pkey PRIMARY KEY (id);


--
-- Name: social_media_posts social_media_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.social_media_posts
    ADD CONSTRAINT social_media_posts_pkey PRIMARY KEY (id);


--
-- Name: states states_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.states
    ADD CONSTRAINT states_pkey PRIMARY KEY (id);


--
-- Name: stock_alerts stock_alerts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_alerts
    ADD CONSTRAINT stock_alerts_pkey PRIMARY KEY (id);


--
-- Name: stock_alerts stock_alerts_product_id_branch_id_alert_type_is_resolved_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_alerts
    ADD CONSTRAINT stock_alerts_product_id_branch_id_alert_type_is_resolved_key UNIQUE (product_id, branch_id, alert_type, is_resolved);


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
-- Name: support_ticket_messages support_ticket_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.support_ticket_messages
    ADD CONSTRAINT support_ticket_messages_pkey PRIMARY KEY (id);


--
-- Name: support_tickets support_tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_pkey PRIMARY KEY (id);


--
-- Name: support_tickets support_tickets_ticket_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_ticket_number_key UNIQUE (ticket_number);


--
-- Name: system_logs system_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_logs
    ADD CONSTRAINT system_logs_pkey PRIMARY KEY (id);


--
-- Name: system_settings system_settings_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_settings
    ADD CONSTRAINT system_settings_key_key UNIQUE (key);


--
-- Name: system_settings system_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_settings
    ADD CONSTRAINT system_settings_pkey PRIMARY KEY (id);


--
-- Name: tax_rates tax_rates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tax_rates
    ADD CONSTRAINT tax_rates_pkey PRIMARY KEY (id);


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
-- Name: translations translations_language_code_namespace_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.translations
    ADD CONSTRAINT translations_language_code_namespace_key_key UNIQUE (language_code, namespace, key);


--
-- Name: translations translations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.translations
    ADD CONSTRAINT translations_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_sessions user_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_pkey PRIMARY KEY (id);


--
-- Name: user_sessions user_sessions_refresh_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_refresh_token_key UNIQUE (refresh_token);


--
-- Name: user_sessions user_sessions_session_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_session_token_key UNIQUE (session_token);


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
-- Name: webhook_deliveries webhook_deliveries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.webhook_deliveries
    ADD CONSTRAINT webhook_deliveries_pkey PRIMARY KEY (id);


--
-- Name: webhooks webhooks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.webhooks
    ADD CONSTRAINT webhooks_pkey PRIMARY KEY (id);


--
-- Name: wishlist_items wishlist_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wishlist_items
    ADD CONSTRAINT wishlist_items_pkey PRIMARY KEY (id);


--
-- Name: wishlist_items wishlist_items_wishlist_id_product_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wishlist_items
    ADD CONSTRAINT wishlist_items_wishlist_id_product_id_key UNIQUE (wishlist_id, product_id);


--
-- Name: wishlists wishlists_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wishlists
    ADD CONSTRAINT wishlists_pkey PRIMARY KEY (id);


--
-- Name: idx_backup_jobs_created_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_backup_jobs_created_by ON public.backup_jobs USING btree (created_by);


--
-- Name: idx_backup_jobs_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_backup_jobs_status ON public.backup_jobs USING btree (status);


--
-- Name: idx_backup_schedules_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_backup_schedules_active ON public.backup_schedules USING btree (is_active);


--
-- Name: idx_branch_traditional_items_available; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_branch_traditional_items_available ON public.branch_traditional_items USING btree (is_available);


--
-- Name: idx_branch_traditional_items_branch; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_branch_traditional_items_branch ON public.branch_traditional_items USING btree (branch_id);


--
-- Name: idx_restore_jobs_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_restore_jobs_status ON public.restore_jobs USING btree (status);


--
-- Name: idx_session_expire; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_session_expire ON public.sessions USING btree (expire);


--
-- Name: ab_test_assignments ab_test_assignments_test_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ab_test_assignments
    ADD CONSTRAINT ab_test_assignments_test_id_fkey FOREIGN KEY (test_id) REFERENCES public.ab_tests(id);


--
-- Name: activity_logs activity_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: api_keys api_keys_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: audit_logs audit_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: branch_traditional_items branch_traditional_items_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.branch_traditional_items
    ADD CONSTRAINT branch_traditional_items_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id) ON DELETE CASCADE;


--
-- Name: branch_traditional_items branch_traditional_items_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.branch_traditional_items
    ADD CONSTRAINT branch_traditional_items_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.traditional_items(id) ON DELETE CASCADE;


--
-- Name: branches branches_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.branches
    ADD CONSTRAINT branches_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);


--
-- Name: campaign_recipients campaign_recipients_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_recipients
    ADD CONSTRAINT campaign_recipients_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.marketing_campaigns(id);


--
-- Name: campaign_recipients campaign_recipients_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_recipients
    ADD CONSTRAINT campaign_recipients_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: cart_items cart_items_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.carts(id);


--
-- Name: cart_items cart_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: carts carts_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: carts carts_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: categories categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.categories(id);


--
-- Name: cities cities_state_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cities
    ADD CONSTRAINT cities_state_id_fkey FOREIGN KEY (state_id) REFERENCES public.states(id);


--
-- Name: cms_pages cms_pages_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cms_pages
    ADD CONSTRAINT cms_pages_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id);


--
-- Name: communication_logs communication_logs_template_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communication_logs
    ADD CONSTRAINT communication_logs_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.communication_templates(id);


--
-- Name: compliance_checks compliance_checks_checked_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compliance_checks
    ADD CONSTRAINT compliance_checks_checked_by_fkey FOREIGN KEY (checked_by) REFERENCES public.users(id);


--
-- Name: content_versions content_versions_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_versions
    ADD CONSTRAINT content_versions_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: customer_addresses customer_addresses_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_addresses
    ADD CONSTRAINT customer_addresses_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: customer_subscriptions customer_subscriptions_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_subscriptions
    ADD CONSTRAINT customer_subscriptions_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: customer_subscriptions customer_subscriptions_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_subscriptions
    ADD CONSTRAINT customer_subscriptions_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.subscription_plans(id);


--
-- Name: customers customers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: data_privacy_requests data_privacy_requests_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_privacy_requests
    ADD CONSTRAINT data_privacy_requests_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: data_privacy_requests data_privacy_requests_processed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_privacy_requests
    ADD CONSTRAINT data_privacy_requests_processed_by_fkey FOREIGN KEY (processed_by) REFERENCES public.users(id);


--
-- Name: delivery_assignments delivery_assignments_delivery_person_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.delivery_assignments
    ADD CONSTRAINT delivery_assignments_delivery_person_id_fkey FOREIGN KEY (delivery_person_id) REFERENCES public.users(id);


--
-- Name: delivery_assignments delivery_assignments_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.delivery_assignments
    ADD CONSTRAINT delivery_assignments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: delivery_schedules delivery_schedules_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.delivery_schedules
    ADD CONSTRAINT delivery_schedules_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: delivery_zones delivery_zones_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.delivery_zones
    ADD CONSTRAINT delivery_zones_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: employee_attendance employee_attendance_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_attendance
    ADD CONSTRAINT employee_attendance_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id);


--
-- Name: employees employees_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: employees employees_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: expense_categories expense_categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.expense_categories
    ADD CONSTRAINT expense_categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.expense_categories(id);


--
-- Name: expenses expenses_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id);


--
-- Name: expenses expenses_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: expenses expenses_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.expense_categories(id);


--
-- Name: expenses expenses_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: gift_card_transactions gift_card_transactions_gift_card_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gift_card_transactions
    ADD CONSTRAINT gift_card_transactions_gift_card_id_fkey FOREIGN KEY (gift_card_id) REFERENCES public.gift_cards(id);


--
-- Name: gift_card_transactions gift_card_transactions_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gift_card_transactions
    ADD CONSTRAINT gift_card_transactions_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: gift_cards gift_cards_purchased_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gift_cards
    ADD CONSTRAINT gift_cards_purchased_by_fkey FOREIGN KEY (purchased_by) REFERENCES public.customers(id);


--
-- Name: image_uploads image_uploads_uploaded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.image_uploads
    ADD CONSTRAINT image_uploads_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.users(id);


--
-- Name: inventory_adjustments inventory_adjustments_adjusted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventory_adjustments
    ADD CONSTRAINT inventory_adjustments_adjusted_by_fkey FOREIGN KEY (adjusted_by) REFERENCES public.users(id);


--
-- Name: inventory_adjustments inventory_adjustments_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventory_adjustments
    ADD CONSTRAINT inventory_adjustments_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: inventory_adjustments inventory_adjustments_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventory_adjustments
    ADD CONSTRAINT inventory_adjustments_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: inventory inventory_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: inventory inventory_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: inventory_transactions inventory_transactions_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventory_transactions
    ADD CONSTRAINT inventory_transactions_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: inventory_transactions inventory_transactions_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventory_transactions
    ADD CONSTRAINT inventory_transactions_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: inventory_transactions inventory_transactions_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventory_transactions
    ADD CONSTRAINT inventory_transactions_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: label_templates label_templates_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.label_templates
    ADD CONSTRAINT label_templates_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: loyalty_transactions loyalty_transactions_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.loyalty_transactions
    ADD CONSTRAINT loyalty_transactions_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: loyalty_transactions loyalty_transactions_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.loyalty_transactions
    ADD CONSTRAINT loyalty_transactions_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: marketing_campaigns marketing_campaigns_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marketing_campaigns
    ADD CONSTRAINT marketing_campaigns_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: marketplace_listings marketplace_listings_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marketplace_listings
    ADD CONSTRAINT marketplace_listings_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: orders orders_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: orders orders_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: payments payments_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: performance_metrics performance_metrics_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.performance_metrics
    ADD CONSTRAINT performance_metrics_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: price_history price_history_changed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.price_history
    ADD CONSTRAINT price_history_changed_by_fkey FOREIGN KEY (changed_by) REFERENCES public.users(id);


--
-- Name: price_history price_history_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.price_history
    ADD CONSTRAINT price_history_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: product_answers product_answers_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_answers
    ADD CONSTRAINT product_answers_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.product_questions(id);


--
-- Name: product_answers product_answers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_answers
    ADD CONSTRAINT product_answers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: product_attribute_values product_attribute_values_attribute_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_attribute_values
    ADD CONSTRAINT product_attribute_values_attribute_id_fkey FOREIGN KEY (attribute_id) REFERENCES public.product_attributes(id);


--
-- Name: product_attribute_values product_attribute_values_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_attribute_values
    ADD CONSTRAINT product_attribute_values_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: product_collection_items product_collection_items_collection_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_collection_items
    ADD CONSTRAINT product_collection_items_collection_id_fkey FOREIGN KEY (collection_id) REFERENCES public.product_collections(id);


--
-- Name: product_collection_items product_collection_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_collection_items
    ADD CONSTRAINT product_collection_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: product_questions product_questions_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_questions
    ADD CONSTRAINT product_questions_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: product_questions product_questions_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_questions
    ADD CONSTRAINT product_questions_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: product_reviews product_reviews_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_reviews
    ADD CONSTRAINT product_reviews_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: product_reviews product_reviews_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_reviews
    ADD CONSTRAINT product_reviews_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: product_reviews product_reviews_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_reviews
    ADD CONSTRAINT product_reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: products products_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id);


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: promotion_usage promotion_usage_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.promotion_usage
    ADD CONSTRAINT promotion_usage_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: promotion_usage promotion_usage_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.promotion_usage
    ADD CONSTRAINT promotion_usage_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: promotion_usage promotion_usage_promotion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.promotion_usage
    ADD CONSTRAINT promotion_usage_promotion_id_fkey FOREIGN KEY (promotion_id) REFERENCES public.promotions(id);


--
-- Name: purchase_order_items purchase_order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchase_order_items
    ADD CONSTRAINT purchase_order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: purchase_order_items purchase_order_items_purchase_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchase_order_items
    ADD CONSTRAINT purchase_order_items_purchase_order_id_fkey FOREIGN KEY (purchase_order_id) REFERENCES public.purchase_orders(id);


--
-- Name: purchase_orders purchase_orders_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id);


--
-- Name: purchase_orders purchase_orders_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: purchase_orders purchase_orders_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: purchase_orders purchase_orders_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id);


--
-- Name: return_items return_items_order_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.return_items
    ADD CONSTRAINT return_items_order_item_id_fkey FOREIGN KEY (order_item_id) REFERENCES public.order_items(id);


--
-- Name: return_items return_items_return_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.return_items
    ADD CONSTRAINT return_items_return_id_fkey FOREIGN KEY (return_id) REFERENCES public.returns(id);


--
-- Name: returns returns_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.returns
    ADD CONSTRAINT returns_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id);


--
-- Name: returns returns_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.returns
    ADD CONSTRAINT returns_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: returns returns_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.returns
    ADD CONSTRAINT returns_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: sales_reports sales_reports_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_reports
    ADD CONSTRAINT sales_reports_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: search_queries search_queries_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.search_queries
    ADD CONSTRAINT search_queries_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: search_queries search_queries_selected_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.search_queries
    ADD CONSTRAINT search_queries_selected_product_id_fkey FOREIGN KEY (selected_product_id) REFERENCES public.products(id);


--
-- Name: social_media_posts social_media_posts_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.social_media_posts
    ADD CONSTRAINT social_media_posts_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: states states_country_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.states
    ADD CONSTRAINT states_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.countries(id);


--
-- Name: stock_alerts stock_alerts_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_alerts
    ADD CONSTRAINT stock_alerts_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: stock_alerts stock_alerts_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_alerts
    ADD CONSTRAINT stock_alerts_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: support_ticket_messages support_ticket_messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.support_ticket_messages
    ADD CONSTRAINT support_ticket_messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id);


--
-- Name: support_ticket_messages support_ticket_messages_ticket_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.support_ticket_messages
    ADD CONSTRAINT support_ticket_messages_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES public.support_tickets(id);


--
-- Name: support_tickets support_tickets_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.users(id);


--
-- Name: support_tickets support_tickets_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: system_settings system_settings_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_settings
    ADD CONSTRAINT system_settings_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id);


--
-- Name: traditional_order_items traditional_order_items_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.traditional_order_items
    ADD CONSTRAINT traditional_order_items_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.traditional_items(id);


--
-- Name: traditional_order_items traditional_order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.traditional_order_items
    ADD CONSTRAINT traditional_order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.traditional_orders(id) ON DELETE CASCADE;


--
-- Name: traditional_orders traditional_orders_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.traditional_orders
    ADD CONSTRAINT traditional_orders_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: traditional_orders traditional_orders_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.traditional_orders
    ADD CONSTRAINT traditional_orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.users(id);


--
-- Name: traditional_orders traditional_orders_selected_vendor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.traditional_orders
    ADD CONSTRAINT traditional_orders_selected_vendor_id_fkey FOREIGN KEY (selected_vendor_id) REFERENCES public.vendors(id);


--
-- Name: user_roles user_roles_assigned_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_assigned_by_fkey FOREIGN KEY (assigned_by) REFERENCES public.users(id);


--
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: user_sessions user_sessions_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: user_sessions user_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: webhook_deliveries webhook_deliveries_webhook_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.webhook_deliveries
    ADD CONSTRAINT webhook_deliveries_webhook_id_fkey FOREIGN KEY (webhook_id) REFERENCES public.webhooks(id);


--
-- Name: wishlist_items wishlist_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wishlist_items
    ADD CONSTRAINT wishlist_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: wishlist_items wishlist_items_wishlist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wishlist_items
    ADD CONSTRAINT wishlist_items_wishlist_id_fkey FOREIGN KEY (wishlist_id) REFERENCES public.wishlists(id);


--
-- Name: wishlists wishlists_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wishlists
    ADD CONSTRAINT wishlists_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- PostgreSQL database dump complete
--

