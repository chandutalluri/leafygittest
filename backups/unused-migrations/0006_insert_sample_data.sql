-- Migration: Insert sample data for LeafyHealth platform
-- Order: 6 (after all tables created)

-- Insert default roles
INSERT INTO roles (name, description, permissions) VALUES
('super_admin', 'Full system access', '["*"]'),
('admin', 'Branch administrator', '["branch.*", "products.read", "orders.*", "inventory.*"]'),
('manager', 'Branch manager', '["branch.read", "products.*", "orders.*", "inventory.*", "reports.read"]'),
('cashier', 'Point of sale operator', '["pos.*", "orders.create", "products.read"]'),
('delivery', 'Delivery personnel', '["deliveries.*", "orders.read"]'),
('customer', 'Regular customer', '["profile.*", "orders.own", "products.read"]')
ON CONFLICT (name) DO NOTHING;

-- Insert sample companies
INSERT INTO companies (id, name, name_telugu, description, description_telugu, registration_number, gst_number, fssai_license, phone, email, website, headquarters_address, headquarters_city, headquarters_state, headquarters_pincode, established_date, status, business_type) VALUES
(1, 'Sri Venkateswara Organic Foods', 'శ్రీ వెంకటేశ్వర ఆర్గానిక్ ఫుడ్స్', 'Leading organic food retailer in Telangana', 'తెలంగాణలో ప్రముఖ సేంద్రీయ ఆహార రిటైలర్', 'REG2020001', '36AABCS1234F1Z5', '10020043004323', '040-23456789', 'info@svorganics.com', 'www.svorganics.com', 'Plot No. 45, Road No. 12, Banjara Hills', 'Hyderabad', 'Telangana', '500034', '2020-01-15', 'active', 'Organic Retail Chain'),
(2, 'Green Valley Naturals', 'గ్రీన్ వ్యాలీ నేచురల్స్', 'Premium organic grocery chain', 'ప్రీమియం సేంద్రీయ కిరాణా చైన్', 'REG2019002', '36BCDGV5678G2H6', '10020043004324', '040-34567890', 'contact@greenvalley.in', 'www.greenvalleynaturals.in', 'Green Valley Complex, Madhapur', 'Hyderabad', 'Telangana', '500081', '2019-06-20', 'active', 'Organic Retail'),
(3, 'Pure Earth Organics', 'ప్యూర్ ఎర్త్ ఆర్గానిక్స్', 'Farm to table organic products', 'వ్యవసాయ క్షేత్రం నుండి టేబుల్ వరకు సేంద్రీయ ఉత్పత్తులు', 'REG2021003', '36CDEFG9012H3I7', '10020043004325', '040-45678901', 'hello@pureearth.co.in', 'www.pureearthorganics.co.in', 'Kondapur Main Road', 'Hyderabad', 'Telangana', '500084', '2021-03-10', 'active', 'Organic Producer & Retailer')
ON CONFLICT (id) DO NOTHING;

-- Reset company sequence
SELECT setval('companies_id_seq', 3, true);

-- Insert sample branches
INSERT INTO branches (id, company_id, name, name_telugu, code, type, phone, email, address, city, state, pincode, latitude, longitude, opening_time, closing_time, is_active, square_feet, employee_count) VALUES
(1, 1, 'Banjara Hills Store', 'బంజారా హిల్స్ స్టోర్', 'SVOF-BH-001', 'retail', '040-23456790', 'banjarahills@svorganics.com', 'Shop No. 101, Road No. 12, Banjara Hills', 'Hyderabad', 'Telangana', '500034', 17.4156, 78.4385, '08:00:00', '22:00:00', true, 3500, 12),
(2, 1, 'Jubilee Hills Store', 'జూబిలీ హిల్స్ స్టోర్', 'SVOF-JH-002', 'retail', '040-23456791', 'jubileehills@svorganics.com', 'Plot No. 234, Road No. 36, Jubilee Hills', 'Hyderabad', 'Telangana', '500033', 17.4319, 78.4070, '08:00:00', '22:00:00', true, 4000, 15),
(3, 1, 'Kondapur Store', 'కొండాపూర్ స్టోర్', 'SVOF-KP-003', 'retail', '040-23456792', 'kondapur@svorganics.com', 'Botanical Garden Road, Kondapur', 'Hyderabad', 'Telangana', '500084', 17.4582, 78.3733, '08:00:00', '22:00:00', true, 5000, 18),
(4, 2, 'Madhapur Store', 'మధాపూర్ స్టోర్', 'GVN-MP-001', 'retail', '040-34567891', 'madhapur@greenvalley.in', 'Hitech City Main Road, Madhapur', 'Hyderabad', 'Telangana', '500081', 17.4483, 78.3915, '07:00:00', '23:00:00', true, 6000, 20),
(5, 3, 'Gachibowli Store', 'గచ్చిబౌలి స్టోర్', 'PEO-GB-001', 'retail', '040-45678902', 'gachibowli@pureearth.co.in', 'DLF Road, Gachibowli', 'Hyderabad', 'Telangana', '500032', 17.4401, 78.3489, '07:30:00', '22:30:00', true, 4500, 16)
ON CONFLICT (id) DO NOTHING;

-- Reset branch sequence
SELECT setval('branches_id_seq', 5, true);

-- Insert sample categories
INSERT INTO categories (id, name, name_telugu, slug, description, description_telugu, display_order, is_active, is_featured) VALUES
(1, 'Fresh Vegetables', 'తాజా కూరగాయలు', 'fresh-vegetables', 'Organic fresh vegetables directly from farms', 'పొలాల నుండి నేరుగా సేంద్రీయ తాజా కూరగాయలు', 1, true, true),
(2, 'Fresh Fruits', 'తాజా పండ్లు', 'fresh-fruits', 'Seasonal organic fruits', 'కాలానుగుణ సేంద్రీయ పండ్లు', 2, true, true),
(3, 'Grains & Cereals', 'ధాన్యాలు', 'grains-cereals', 'Organic rice, wheat and millets', 'సేంద్రీయ బియ్యం, గోధుమ మరియు చిరుధాన్యాలు', 3, true, true),
(4, 'Pulses & Lentils', 'పప్పులు', 'pulses-lentils', 'Organic dals and legumes', 'సేంద్రీయ పప్పులు మరియు కాయధాన్యాలు', 4, true, true),
(5, 'Spices', 'మసాలా దినుసులు', 'spices', 'Pure organic spices and condiments', 'స్వచ్ఛమైన సేంద్రీయ మసాలాలు', 5, true, false),
(6, 'Oils & Ghee', 'నూనెలు & నెయ్యి', 'oils-ghee', 'Cold pressed oils and pure ghee', 'కోల్డ్ ప్రెస్డ్ నూనెలు మరియు స్వచ్ఛమైన నెయ్యి', 6, true, false),
(7, 'Dairy Products', 'పాల ఉత్పత్తులు', 'dairy-products', 'Fresh organic dairy products', 'తాజా సేంద్రీయ పాల ఉత్పత్తులు', 7, true, false),
(8, 'Honey & Jaggery', 'తేనె & బెల్లం', 'honey-jaggery', 'Natural sweeteners', 'సహజ తీపి పదార్థాలు', 8, true, false),
(9, 'Dry Fruits & Nuts', 'డ్రై ఫ్రూట్స్ & గింజలు', 'dry-fruits-nuts', 'Premium quality dry fruits and nuts', 'ప్రీమియం నాణ్యత డ్రై ఫ్రూట్స్ మరియు గింజలు', 9, true, false),
(10, 'Ready to Eat', 'రెడీ టు ఈట్', 'ready-to-eat', 'Healthy ready to eat snacks and foods', 'ఆరోగ్యకరమైన రెడీ టు ఈట్ స్నాక్స్ మరియు ఆహారాలు', 10, true, false)
ON CONFLICT (id) DO NOTHING;

-- Reset category sequence
SELECT setval('categories_id_seq', 10, true);

-- Insert sample products
INSERT INTO products (id, name, name_telugu, slug, sku, description, description_telugu, category_id, brand, unit, unit_telugu, size, weight, selling_price, mrp, cost_price, discount_percentage, tax_percentage, image_url, is_active, is_featured, is_organic, is_perishable, shelf_life_days, storage_instructions, storage_instructions_telugu, nutritional_info, ingredients, ingredients_telugu, country_of_origin, manufacturer) VALUES
(1, 'Organic Tomatoes', 'సేంద్రీయ టమాటాలు', 'organic-tomatoes', 'VEG-TOM-001', 'Fresh organic tomatoes grown without pesticides', 'పురుగుమందులు లేకుండా పెంచిన తాజా సేంద్రీయ టమాటాలు', 1, 'LeafyHealth Farms', 'kg', 'కిలో', '1kg', 1.000, 40.00, 50.00, 25.00, 20.0, 0.0, '/images/tomatoes.jpg', true, true, true, true, 7, 'Store in cool, dry place', 'చల్లని, పొడి ప్రదేశంలో నిల్వ చేయండి', '{"calories": 18, "protein": 0.9, "carbs": 3.9, "fiber": 1.2}', 'Fresh organic tomatoes', 'తాజా సేంద్రీయ టమాటాలు', 'India', 'Local Organic Farms'),

(2, 'Organic Spinach', 'సేంద్రీయ పాలకూర', 'organic-spinach', 'VEG-SPN-001', 'Fresh leafy spinach rich in iron', 'ఇనుము అధికంగా ఉండే తాజా ఆకు పాలకూర', 1, 'LeafyHealth Farms', 'bunch', 'కట్ట', '250g', 0.250, 25.00, 30.00, 15.00, 16.7, 0.0, '/images/spinach.jpg', true, true, true, true, 3, 'Refrigerate and use within 3 days', 'రిఫ్రిజిరేటర్‌లో ఉంచి 3 రోజుల్లో ఉపయోగించండి', '{"calories": 23, "protein": 2.9, "iron": 2.7, "vitamins": "A,C,K"}', 'Organic spinach leaves', 'సేంద్రీయ పాలకూర ఆకులు', 'India', 'Local Organic Farms'),

(3, 'Organic Bananas', 'సేంద్రీయ అరటిపండ్లు', 'organic-bananas', 'FRT-BAN-001', 'Sweet and nutritious organic bananas', 'తీపి మరియు పోషకమైన సేంద్రీయ అరటిపండ్లు', 2, 'LeafyHealth Farms', 'dozen', 'డజను', '1 dozen', 1.200, 45.00, 60.00, 30.00, 25.0, 0.0, '/images/bananas.jpg', true, true, true, true, 5, 'Store at room temperature', 'గది ఉష్ణోగ్రత వద్ద నిల్వ చేయండి', '{"calories": 89, "protein": 1.1, "carbs": 22.8, "potassium": 358}', 'Organic bananas', 'సేంద్రీయ అరటిపండ్లు', 'India', 'Organic Fruit Suppliers'),

(4, 'Organic Apples', 'సేంద్రీయ ఆపిల్స్', 'organic-apples', 'FRT-APL-001', 'Crisp and juicy organic apples from Kashmir', 'కాశ్మీర్ నుండి వచ్చిన క్రిస్ప్ మరియు జ్యూసీ సేంద్రీయ ఆపిల్స్', 2, 'Kashmir Organics', 'kg', 'కిలో', '1kg', 1.000, 120.00, 150.00, 90.00, 20.0, 0.0, '/images/apples.jpg', true, true, true, true, 15, 'Store in refrigerator', 'రిఫ్రిజిరేటర్‌లో నిల్వ చేయండి', '{"calories": 52, "protein": 0.3, "carbs": 13.8, "fiber": 2.4}', 'Fresh organic apples', 'తాజా సేంద్రీయ ఆపిల్స్', 'India', 'Kashmir Organic Orchards'),

(5, 'Organic Basmati Rice', 'సేంద్రీయ బాస్మతి బియ్యం', 'organic-basmati-rice', 'GRN-RCE-001', 'Premium long grain basmati rice', 'ప్రీమియం పొడవైన గింజల బాస్మతి బియ్యం', 3, 'Heritage Grains', 'kg', 'కిలో', '5kg', 5.000, 450.00, 500.00, 350.00, 10.0, 5.0, '/images/basmati-rice.jpg', true, true, true, false, 365, 'Store in airtight container', 'గాలి చొరబడని కంటైనర్‌లో నిల్వ చేయండి', '{"calories": 350, "protein": 8, "carbs": 77, "fiber": 0.4}', 'Organic basmati rice', 'సేంద్రీయ బాస్మతి బియ్యం', 'India', 'Heritage Organic Mills'),

(6, 'Organic Toor Dal', 'సేంద్రీయ కందిపప్పు', 'organic-toor-dal', 'PLS-TOR-001', 'High protein organic toor dal', 'అధిక ప్రోటీన్ సేంద్రీయ కందిపప్పు', 4, 'Pure Pulses', 'kg', 'కిలో', '1kg', 1.000, 140.00, 160.00, 110.00, 12.5, 5.0, '/images/toor-dal.jpg', true, false, true, false, 180, 'Store in cool, dry place', 'చల్లని, పొడి ప్రదేశంలో నిల్వ చేయండి', '{"calories": 343, "protein": 22, "carbs": 63, "fiber": 15}', 'Split pigeon peas', 'విభజించిన కందిపప్పు', 'India', 'Organic Pulse Processors'),

(7, 'Organic Turmeric Powder', 'సేంద్రీయ పసుపు పొడి', 'organic-turmeric-powder', 'SPC-TRM-001', 'Pure organic turmeric powder with high curcumin', 'అధిక కర్కుమిన్ తో స్వచ్ఛమైన సేంద్రీయ పసుపు పొడి', 5, 'Spice Valley', 'g', 'గ్రా', '200g', 0.200, 60.00, 75.00, 40.00, 20.0, 5.0, '/images/turmeric.jpg', true, true, true, false, 730, 'Store in airtight container away from light', 'కాంతి నుండి దూరంగా గాలి చొరబడని కంటైనర్‌లో నిల్వ చేయండి', '{"calories": 312, "protein": 9.7, "curcumin": "3-5%"}', 'Ground organic turmeric', 'రుబ్బిన సేంద్రీయ పసుపు', 'India', 'Organic Spice Gardens'),

(8, 'Organic Red Chilli Powder', 'సేంద్రీయ ఎర్ర మిరపకాయ పొడి', 'organic-red-chilli-powder', 'SPC-CHL-001', 'Medium spicy organic red chilli powder', 'మధ్యస్థ కారమైన సేంద్రీయ ఎర్ర మిరపకాయ పొడి', 5, 'Spice Valley', 'g', 'గ్రా', '100g', 0.100, 40.00, 50.00, 25.00, 20.0, 5.0, '/images/chilli-powder.jpg', true, false, true, false, 365, 'Store in cool, dry place', 'చల్లని, పొడి ప్రదేశంలో నిల్వ చేయండి', '{"calories": 282, "protein": 13.5, "capsaicin": "moderate"}', 'Ground organic red chillies', 'రుబ్బిన సేంద్రీయ ఎర్ర మిరపకాయలు', 'India', 'Organic Spice Gardens'),

(9, 'Organic Coconut Oil', 'సేంద్రీయ కొబ్బరి నూనె', 'organic-coconut-oil', 'OIL-COC-001', 'Cold pressed virgin coconut oil', 'కోల్డ్ ప్రెస్డ్ వర్జిన్ కొబ్బరి నూనె', 6, 'Pure Oils', 'ml', 'మి.లీ', '500ml', 0.500, 250.00, 300.00, 180.00, 16.7, 5.0, '/images/coconut-oil.jpg', true, true, true, false, 730, 'Store in cool, dark place', 'చల్లని, చీకటి ప్రదేశంలో నిల్వ చేయండి', '{"calories": 862, "saturated_fat": 87, "mct": "high"}', 'Pure coconut oil', 'స్వచ్ఛమైన కొబ్బరి నూనె', 'India', 'Coastal Organic Oils'),

(10, 'Organic A2 Ghee', 'సేంద్రీయ A2 నెయ్యి', 'organic-a2-ghee', 'OIL-GHE-001', 'Pure A2 cow ghee from grass-fed cows', 'గడ్డి తినే ఆవుల నుండి స్వచ్ఛమైన A2 ఆవు నెయ్యి', 6, 'Traditional Dairy', 'ml', 'మి.లీ', '250ml', 0.250, 400.00, 450.00, 320.00, 11.1, 12.0, '/images/a2-ghee.jpg', true, true, true, false, 365, 'Store in cool place', 'చల్లని ప్రదేశంలో నిల్వ చేయండి', '{"calories": 900, "vitamin_a": "high", "vitamin_d": "present"}', 'Clarified butter from A2 milk', 'A2 పాల నుండి స్వచ్ఛమైన నెయ్యి', 'India', 'Traditional Organic Dairy'),

(11, 'Organic Milk', 'సేంద్రీయ పాలు', 'organic-milk', 'DRY-MLK-001', 'Fresh organic whole milk', 'తాజా సేంద్రీయ పూర్తి కొవ్వు పాలు', 7, 'Happy Cows', 'ml', 'మి.లీ', '500ml', 0.500, 35.00, 40.00, 28.00, 12.5, 0.0, '/images/milk.jpg', true, true, true, true, 3, 'Refrigerate, use within 3 days', 'రిఫ్రిజిరేట్ చేయండి, 3 రోజుల్లో ఉపయోగించండి', '{"calories": 61, "protein": 3.2, "calcium": 113}', 'Organic cow milk', 'సేంద్రీయ ఆవు పాలు', 'India', 'Happy Cows Organic Dairy'),

(12, 'Organic Honey', 'సేంద్రీయ తేనె', 'organic-honey', 'HNY-RAW-001', 'Raw unprocessed forest honey', 'ముడి ప్రాసెస్ చేయని అటవీ తేనె', 8, 'Forest Gold', 'g', 'గ్రా', '500g', 0.500, 350.00, 400.00, 250.00, 12.5, 0.0, '/images/honey.jpg', true, true, true, false, 1095, 'Store at room temperature', 'గది ఉష్ణోగ్రత వద్ద నిల్వ చేయండి', '{"calories": 304, "sugars": 82, "antioxidants": "high"}', 'Pure forest honey', 'స్వచ్ఛమైన అటవీ తేనె', 'India', 'Forest Gold Honey Co.'),

(13, 'Organic Jaggery', 'సేంద్రీయ బెల్లం', 'organic-jaggery', 'HNY-JGR-001', 'Traditional organic jaggery', 'సాంప్రదాయ సేంద్రీయ బెల్లం', 8, 'Sweet Traditions', 'g', 'గ్రా', '500g', 0.500, 80.00, 100.00, 60.00, 20.0, 5.0, '/images/jaggery.jpg', true, false, true, false, 365, 'Store in airtight container', 'గాలి చొరబడని కంటైనర్‌లో నిల్వ చేయండి', '{"calories": 383, "iron": 11, "minerals": "rich"}', 'Sugarcane jaggery', 'చెరుకు బెల్లం', 'India', 'Traditional Sweet Makers'),

(14, 'Organic Almonds', 'సేంద్రీయ బాదం', 'organic-almonds', 'NUT-ALM-001', 'Premium California almonds', 'ప్రీమియం కాలిఫోర్నియా బాదం', 9, 'Nutty Delights', 'g', 'గ్రా', '250g', 0.250, 300.00, 350.00, 240.00, 14.3, 5.0, '/images/almonds.jpg', true, true, true, false, 365, 'Store in cool, dry place', 'చల్లని, పొడి ప్రదేశంలో నిల్వ చేయండి', '{"calories": 579, "protein": 21, "vitamin_e": "high"}', 'Whole almonds', 'మొత్తం బాదం పప్పులు', 'USA', 'California Organic Nuts'),

(15, 'Organic Cashews', 'సేంద్రీయ జీడిపప్పు', 'organic-cashews', 'NUT-CSH-001', 'W320 grade organic cashews', 'W320 గ్రేడ్ సేంద్రీయ జీడిపప్పు', 9, 'Nutty Delights', 'g', 'గ్రా', '250g', 0.250, 250.00, 300.00, 200.00, 16.7, 5.0, '/images/cashews.jpg', true, false, true, false, 180, 'Store in airtight container', 'గాలి చొరబడని కంటైనర్‌లో నిల్వ చేయండి', '{"calories": 553, "protein": 18, "magnesium": "high"}', 'Whole cashew nuts', 'మొత్తం జీడిపప్పు', 'India', 'Konkan Organic Cashews'),

(16, 'Organic Millet Cookies', 'సేంద్రీయ చిరుధాన్యాల బిస్కెట్లు', 'organic-millet-cookies', 'RTE-COK-001', 'Healthy millet cookies with jaggery', 'బెల్లంతో ఆరోగ్యకరమైన చిరుధాన్యాల బిస్కెట్లు', 10, 'Healthy Bites', 'g', 'గ్రా', '200g', 0.200, 60.00, 75.00, 45.00, 20.0, 18.0, '/images/millet-cookies.jpg', true, true, true, false, 90, 'Store in cool, dry place', 'చల్లని, పొడి ప్రదేశంలో నిల్వ చేయండి', '{"calories": 450, "protein": 8, "fiber": 4}', 'Millet flour, jaggery, ghee', 'చిరుధాన్యాల పిండి, బెల్లం, నెయ్యి', 'India', 'Healthy Bites Foods'),

(17, 'Organic Green Tea', 'సేంద్రీయ గ్రీన్ టీ', 'organic-green-tea', 'BEV-GRT-001', 'Antioxidant rich green tea', 'యాంటీఆక్సిడెంట్ అధికంగా ఉండే గ్రీన్ టీ', 10, 'Tea Gardens', 'g', 'గ్రా', '100g', 0.100, 150.00, 180.00, 100.00, 16.7, 5.0, '/images/green-tea.jpg', true, false, true, false, 365, 'Store in airtight container', 'గాలి చొరబడని కంటైనర్‌లో నిల్వ చేయండి', '{"calories": 2, "caffeine": "moderate", "antioxidants": "high"}', 'Organic green tea leaves', 'సేంద్రీయ గ్రీన్ టీ ఆకులు', 'India', 'Himalayan Tea Gardens'),

(18, 'Organic Dates', 'సేంద్రీయ ఖర్జూరాలు', 'organic-dates', 'NUT-DAT-001', 'Premium Medjool dates', 'ప్రీమియం మెడ్జూల్ ఖర్జూరాలు', 9, 'Desert Gold', 'g', 'గ్రా', '500g', 0.500, 400.00, 480.00, 320.00, 16.7, 0.0, '/images/dates.jpg', true, true, true, false, 365, 'Store in cool place', 'చల్లని ప్రదేశంలో నిల్వ చేయండి', '{"calories": 277, "fiber": 7, "potassium": "high"}', 'Medjool dates', 'మెడ్జూల్ ఖర్జూరాలు', 'Saudi Arabia', 'Desert Gold Imports'),

(19, 'Organic Moong Dal', 'సేంద్రీయ పెసరపప్పు', 'organic-moong-dal', 'PLS-MNG-001', 'Split green gram dal', 'విభజించిన పెసరపప్పు', 4, 'Pure Pulses', 'kg', 'కిలో', '1kg', 1.000, 130.00, 150.00, 100.00, 13.3, 5.0, '/images/moong-dal.jpg', true, false, true, false, 180, 'Store in cool, dry place', 'చల్లని, పొడి ప్రదేశంలో నిల్వ చేయండి', '{"calories": 347, "protein": 24, "fiber": 16}', 'Split green gram', 'విభజించిన పెసరపప్పు', 'India', 'Organic Pulse Processors'),

(20, 'Organic Coriander Powder', 'సేంద్రీయ ధనియాల పొడి', 'organic-coriander-powder', 'SPC-COR-001', 'Aromatic coriander powder', 'సుగంధ ధనియాల పొడి', 5, 'Spice Valley', 'g', 'గ్రా', '100g', 0.100, 30.00, 40.00, 20.00, 25.0, 5.0, '/images/coriander-powder.jpg', true, false, true, false, 365, 'Store in airtight container', 'గాలి చొరబడని కంటైనర్‌లో నిల్వ చేయండి', '{"calories": 298, "protein": 12, "fiber": 42}', 'Ground coriander seeds', 'రుబ్బిన ధనియాలు', 'India', 'Organic Spice Gardens'),

(21, 'Organic Cumin Seeds', 'సేంద్రీయ జీలకర్ర', 'organic-cumin-seeds', 'SPC-CMN-001', 'Whole cumin seeds', 'పూర్తి జీలకర్ర', 5, 'Spice Valley', 'g', 'గ్రా', '100g', 0.100, 50.00, 60.00, 35.00, 16.7, 5.0, '/images/cumin-seeds.jpg', true, false, true, false, 730, 'Store in cool, dry place', 'చల్లని, పొడి ప్రదేశంలో నిల్వ చేయండి', '{"calories": 375, "protein": 18, "iron": "high"}', 'Whole cumin seeds', 'పూర్తి జీలకర్ర', 'India', 'Organic Spice Gardens'),

(22, 'Organic Black Pepper', 'సేంద్రీయ మిరియాలు', 'organic-black-pepper', 'SPC-PEP-001', 'Whole black peppercorns', 'పూర్తి నల్ల మిరియాలు', 5, 'Spice Valley', 'g', 'గ్రా', '50g', 0.050, 80.00, 100.00, 60.00, 20.0, 5.0, '/images/black-pepper.jpg', true, false, true, false, 1095, 'Store in airtight container', 'గాలి చొరబడని కంటైనర్‌లో నిల్వ చేయండి', '{"calories": 251, "piperine": "5-9%", "antioxidants": "high"}', 'Whole black pepper', 'పూర్తి నల్ల మిరియాలు', 'India', 'Kerala Spice Estates'),

(23, 'Organic Mustard Oil', 'సేంద్రీయ ఆవనూనె', 'organic-mustard-oil', 'OIL-MST-001', 'Cold pressed mustard oil', 'కోల్డ్ ప్రెస్డ్ ఆవనూనె', 6, 'Pure Oils', 'ml', 'మి.లీ', '500ml', 0.500, 120.00, 140.00, 90.00, 14.3, 5.0, '/images/mustard-oil.jpg', true, false, true, false, 365, 'Store in cool, dark place', 'చల్లని, చీకటి ప్రదేశంలో నిల్వ చేయండి', '{"calories": 884, "omega_3": "moderate", "erucic_acid": "low"}', 'Pure mustard oil', 'స్వచ్ఛమైన ఆవనూనె', 'India', 'Traditional Oil Mills'),

(24, 'Organic Sesame Oil', 'సేంద్రీయ నువ్వుల నూనె', 'organic-sesame-oil', 'OIL-SES-001', 'Cold pressed sesame oil', 'కోల్డ్ ప్రెస్డ్ నువ్వుల నూనె', 6, 'Pure Oils', 'ml', 'మి.లీ', '500ml', 0.500, 180.00, 200.00, 140.00, 10.0, 5.0, '/images/sesame-oil.jpg', true, false, true, false, 365, 'Store in cool place', 'చల్లని ప్రదేశంలో నిల్వ చేయండి', '{"calories": 884, "vitamin_e": "moderate", "sesamol": "present"}', 'Pure sesame oil', 'స్వచ్ఛమైన నువ్వుల నూనె', 'India', 'Traditional Oil Mills'),

(25, 'Organic Paneer', 'సేంద్రీయ పనీర్', 'organic-paneer', 'DRY-PNR-001', 'Fresh cottage cheese', 'తాజా కాటేజ్ చీజ్', 7, 'Happy Cows', 'g', 'గ్రా', '200g', 0.200, 90.00, 100.00, 70.00, 10.0, 5.0, '/images/paneer.jpg', true, false, true, true, 7, 'Refrigerate, use within 7 days', 'రిఫ్రిజిరేట్ చేయండి, 7 రోజుల్లో ఉపయోగించండి', '{"calories": 265, "protein": 18, "calcium": "high"}', 'Cottage cheese from organic milk', 'సేంద్రీయ పాల నుండి కాటేజ్ చీజ్', 'India', 'Happy Cows Dairy'),

(26, 'Organic Yogurt', 'సేంద్రీయ పెరుగు', 'organic-yogurt', 'DRY-YGT-001', 'Probiotic rich yogurt', 'ప్రోబయోటిక్ అధికంగా ఉండే పెరుగు', 7, 'Happy Cows', 'ml', 'మి.లీ', '400ml', 0.400, 40.00, 45.00, 30.00, 11.1, 5.0, '/images/yogurt.jpg', true, true, true, true, 15, 'Refrigerate, consume before expiry', 'రిఫ్రిజిరేట్ చేయండి, గడువుకు ముందు వినియోగించండి', '{"calories": 61, "protein": 3.5, "probiotics": "high"}', 'Cultured organic milk', 'కల్చర్ చేసిన సేంద్రీయ పాలు', 'India', 'Happy Cows Dairy'),

(27, 'Organic Wheat Flour', 'సేంద్రీయ గోధుమ పిండి', 'organic-wheat-flour', 'GRN-WHT-001', 'Stone ground whole wheat flour', 'రాతి రుబ్బిన పూర్తి గోధుమ పిండి', 3, 'Heritage Grains', 'kg', 'కిలో', '5kg', 5.000, 200.00, 225.00, 150.00, 11.1, 5.0, '/images/wheat-flour.jpg', true, true, true, false, 90, 'Store in cool, dry place', 'చల్లని, పొడి ప్రదేశంలో నిల్వ చేయండి', '{"calories": 340, "protein": 13, "fiber": 11}', 'Whole wheat flour', 'పూర్తి గోధుమ పిండి', 'India', 'Heritage Mills'),

(28, 'Organic Ragi Flour', 'సేంద్రీయ రాగి పిండి', 'organic-ragi-flour', 'GRN-RGI-001', 'Finger millet flour', 'రాగి పిండి', 3, 'Millet Magic', 'kg', 'కిలో', '1kg', 1.000, 80.00, 90.00, 60.00, 11.1, 5.0, '/images/ragi-flour.jpg', true, false, true, false, 180, 'Store in airtight container', 'గాలి చొరబడని కంటైనర్‌లో నిల్వ చేయండి', '{"calories": 328, "protein": 7, "calcium": "high"}', 'Finger millet flour', 'రాగి పిండి', 'India', 'Millet Processors'),

(29, 'Organic Chana Dal', 'సేంద్రీయ సెనగపప్పు', 'organic-chana-dal', 'PLS-CHN-001', 'Split bengal gram', 'విభజించిన సెనగపప్పు', 4, 'Pure Pulses', 'kg', 'కిలో', '1kg', 1.000, 110.00, 125.00, 85.00, 12.0, 5.0, '/images/chana-dal.jpg', true, false, true, false, 180, 'Store in cool, dry place', 'చల్లని, పొడి ప్రదేశంలో నిల్వ చేయండి', '{"calories": 364, "protein": 19, "fiber": 12}', 'Split chickpeas', 'విభజించిన సెనగలు', 'India', 'Organic Pulse Processors'),

(30, 'Organic Groundnut Oil', 'సేంద్రీయ వేరుశెనగ నూనె', 'organic-groundnut-oil', 'OIL-GNT-001', 'Cold pressed groundnut oil', 'కోల్డ్ ప్రెస్డ్ వేరుశెనగ నూనె', 6, 'Pure Oils', 'litre', 'లీటర్', '1L', 1.000, 220.00, 250.00, 170.00, 12.0, 5.0, '/images/groundnut-oil.jpg', true, true, true, false, 365, 'Store in cool, dark place', 'చల్లని, చీకటి ప్రదేశంలో నిల్వ చేయండి', '{"calories": 884, "vitamin_e": "high", "smoke_point": "232°C"}', 'Pure groundnut oil', 'స్వచ్ఛమైన వేరుశెనగ నూనె', 'India', 'Traditional Oil Mills'),

(31, 'Organic Walnuts', 'సేంద్రీయ అక్రోట్లు', 'organic-walnuts', 'NUT-WAL-001', 'Brain-shaped superfood', 'మెదడు ఆకారపు సూపర్‌ఫుడ్', 9, 'Nutty Delights', 'g', 'గ్రా', '250g', 0.250, 450.00, 500.00, 350.00, 10.0, 5.0, '/images/walnuts.jpg', true, false, true, false, 180, 'Store in refrigerator', 'రిఫ్రిజిరేటర్‌లో నిల్వ చేయండి', '{"calories": 654, "omega_3": "high", "protein": 15}', 'Whole walnuts', 'పూర్తి అక్రోట్లు', 'India', 'Kashmir Walnut Farms'),

(32, 'Organic Mixed Dal', 'సేంద్రీయ మిక్స్డ్ పప్పు', 'organic-mixed-dal', 'PLS-MIX-001', 'Five lentil mix', 'ఐదు పప్పుల మిశ్రమం', 4, 'Pure Pulses', 'kg', 'కిలో', '1kg', 1.000, 150.00, 170.00, 120.00, 11.8, 5.0, '/images/mixed-dal.jpg', true, false, true, false, 180, 'Store in cool, dry place', 'చల్లని, పొడి ప్రదేశంలో నిల్వ చేయండి', '{"calories": 350, "protein": 23, "fiber": 14}', 'Mixed lentils', 'మిశ్రమ పప్పులు', 'India', 'Organic Pulse Processors')
ON CONFLICT (id) DO NOTHING;

-- Reset product sequence
SELECT setval('products_id_seq', 32, true);

-- Insert initial inventory for all branches and products
INSERT INTO inventory (product_id, branch_id, current_stock, minimum_stock, maximum_stock, reorder_point, reorder_quantity, stock_value, is_active)
SELECT 
  p.id,
  b.id,
  CASE 
    WHEN p.is_perishable THEN FLOOR(RANDOM() * 50 + 20)::INTEGER
    ELSE FLOOR(RANDOM() * 200 + 50)::INTEGER
  END as current_stock,
  CASE 
    WHEN p.is_perishable THEN 10
    ELSE 20
  END as minimum_stock,
  CASE 
    WHEN p.is_perishable THEN 200
    ELSE 500
  END as maximum_stock,
  CASE 
    WHEN p.is_perishable THEN 15
    ELSE 30
  END as reorder_point,
  CASE 
    WHEN p.is_perishable THEN 50
    ELSE 100
  END as reorder_quantity,
  p.selling_price::TEXT as stock_value,
  true
FROM products p
CROSS JOIN branches b
ON CONFLICT (product_id, branch_id) DO NOTHING;

-- Insert sample suppliers
INSERT INTO suppliers (name, code, contact_person, phone, email, address, gst_number, payment_terms, delivery_days, is_active, rating) VALUES
('Organic Farms Network', 'SUP-ORG-001', 'Rajesh Kumar', '9876543210', 'rajesh@organicfarms.in', 'Farm Road, Shamshabad, Hyderabad', '36ORGFM1234A1Z1', 'Net 30', 2, true, 4.5),
('Green Valley Suppliers', 'SUP-GRN-001', 'Priya Sharma', '9876543211', 'priya@greenvalley.in', 'Industrial Area, Patancheru', '36GRNVL5678B2C2', 'Net 15', 3, true, 4.2),
('Fresh Produce Direct', 'SUP-FRS-001', 'Mohammed Ali', '9876543212', 'ali@freshproduce.in', 'Vegetable Market, Bowenpally', '36FRSPD9012C3D3', 'COD', 1, true, 4.8)
ON CONFLICT (code) DO NOTHING;

-- Insert sample promotions
INSERT INTO promotions (name, code, type, value_type, value, minimum_purchase, start_date, end_date, is_active) VALUES
('Welcome Offer', 'WELCOME20', 'discount', 'percentage', 20.00, 500.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '30 days', true),
('Bulk Buy Discount', 'BULK10', 'discount', 'percentage', 10.00, 2000.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '90 days', true),
('Free Delivery', 'FREEDEL', 'shipping', 'fixed', 0.00, 1000.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '60 days', true)
ON CONFLICT (code) DO NOTHING;

-- Insert sample languages
INSERT INTO languages (code, name, native_name, is_active, is_default) VALUES
('en', 'English', 'English', true, false),
('te', 'Telugu', 'తెలుగు', true, true),
('hi', 'Hindi', 'हिन्दी', true, false)
ON CONFLICT (code) DO NOTHING;

-- Insert system settings
INSERT INTO system_settings (key, value, description) VALUES
('store.name', '"LeafyHealth Organic Stores"', 'Store display name'),
('store.currency', '"INR"', 'Default currency'),
('store.tax_rate', '5', 'Default tax rate percentage'),
('store.delivery_charge', '40', 'Default delivery charge'),
('store.free_delivery_above', '1000', 'Free delivery for orders above this amount')
ON CONFLICT (key) DO NOTHING;