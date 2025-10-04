-- Categories data with parent relationships
INSERT INTO categories (name, description, icon_name, parent_id, created_at, updated_at) VALUES
('Technology', 'All technology-related courses', 'technology', NULL, NOW(), NOW()),
('Creative Arts', 'Creative and artistic courses', 'creative', NULL, NOW(), NOW()),
('Business & Finance', 'Business and financial courses', 'business', NULL, NOW(), NOW()),
('Languages', 'Language learning courses', 'language', NULL, NOW(), NOW()),
('Health & Lifestyle', 'Health and lifestyle courses', 'health', NULL, NOW(), NOW()),

-- Technology subcategories
('Programming', 'Learn programming languages and software development', 'programming', 1, NOW(), NOW()),
('Web Development', 'Frontend, backend, and full-stack web development', 'web-development', 1, NOW(), NOW()),
('Mobile Development', 'iOS and Android mobile app development', 'mobile-development', 1, NOW(), NOW()),
('Data Science', 'Data analysis, machine learning, and statistics', 'data-science', 1, NOW(), NOW()),
('Artificial Intelligence', 'AI, machine learning, and deep learning', 'artificial-intelligence', 1, NOW(), NOW()),
('Cybersecurity', 'Information security and ethical hacking', 'cybersecurity', 1, NOW(), NOW()),
('Cloud Computing', 'AWS, Azure, and cloud infrastructure', 'cloud-computing', 1, NOW(), NOW()),

-- Creative Arts subcategories
('Design', 'Graphic design, UI/UX design, and creative arts', 'design', 2, NOW(), NOW()),
('UI/UX Design', 'User interface and user experience design', 'ui-ux', 2, NOW(), NOW()),
('Photography', 'Digital photography and photo editing techniques', 'photography', 2, NOW(), NOW()),
('Music', 'Music theory, instruments, and audio production', 'music', 2, NOW(), NOW()),
('Writing', 'Creative writing and content creation', 'writing', 2, NOW(), NOW()),

-- Business & Finance subcategories
('Digital Marketing', 'Online marketing and social media strategies', 'marketing', 3, NOW(), NOW()),
('Finance', 'Financial planning and investment strategies', 'finance', 3, NOW(), NOW()),

-- Health & Lifestyle subcategories
('Cooking', 'Culinary arts and cooking techniques', 'cooking', 5, NOW(), NOW()),
('Mathematics', 'Advanced mathematics and problem solving', 'mathematics', 5, NOW(), NOW()),
('Science', 'Physics, chemistry, and biological sciences', 'science', 5, NOW(), NOW());

-- Languages data
INSERT INTO languages (name, native_name, created_at, updated_at) VALUES
('Vietnamese', 'Tiếng Việt', NOW(), NOW()),
('English', 'English', NOW(), NOW()),
('Chinese', '中文', NOW(), NOW()),
('Japanese', '日本語', NOW(), NOW()),
('Korean', '한국어', NOW(), NOW()),
('French', 'Français', NOW(), NOW()),
('German', 'Deutsch', NOW(), NOW()),
('Spanish', 'Español', NOW(), NOW()),
('Portuguese', 'Português', NOW(), NOW()),
('Russian', 'Русский', NOW(), NOW()),
('Italian', 'Italiano', NOW(), NOW()),
('Thai', 'ไทย', NOW(), NOW()),
('Hindi', 'हिन्दी', NOW(), NOW()),
('Arabic', 'العربية', NOW(), NOW());