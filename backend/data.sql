-- =================================== COMMON SERVICE ===================================
-- Table Countries
CREATE TABLE IF NOT EXISTS public.countries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    name VARCHAR(255) NOT NULL
);

-- Table Languages
CREATE TABLE IF NOT EXISTS public.languages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(10) NOT NULL UNIQUE -- e.g., 'en', 'vi'
);

-- 3. Table Timezones
CREATE TABLE IF NOT EXISTS public.timezones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    name VARCHAR(255) NOT NULL,
    utc_offset VARCHAR(20) NOT NULL -- e.g., '+07:00'
);

-- 4. Table Categories
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES public.categories(id)
);

-- 5. Table Subjects (Danh sách môn học chuẩn)
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    name VARCHAR(255) NOT NULL,
    category_id UUID REFERENCES public.categories(id)
);


-- =========================================================
-- PHẦN 2: INSERT MASTER DATA (MATCH VỚI TUTOR SERVICE)
-- =========================================================

-- 1. COUNTRIES (Map với nationality_code bên Tutor: VN, US, GB, FR...)
INSERT INTO public.countries (name) VALUES 
('Vietnam'),        -- VN
('United States'),  -- US
('United Kingdom'), -- GB
('Japan'),          -- JP
('South Korea'),    -- KR
('France'),         -- FR
('Germany'),        -- DE
('Australia'),      -- AU
('Canada'),         -- CA
('India'),          -- IN
('Singapore'),      -- SG
('Philippines'),    -- PH
('Brazil'),         -- BR
('Mexico'),         -- MX
('Russia'),         -- RU
('South Africa'),   -- ZA
('Sweden'),         -- SE
('Spain'),          -- ES
('Italy'),          -- IT
('Netherlands');    -- NL

-- 2. LANGUAGES (Map chính xác với tutor_languages.language_code)
INSERT INTO public.languages (name, code) VALUES 
('Vietnamese', 'vi'),
('English', 'en'),
('Japanese', 'ja'),
('Korean', 'ko'),
('Chinese', 'zh'),
('French', 'fr'),
('German', 'de'),
('Spanish', 'es'),
('Italian', 'it'),
('Dutch', 'nl'),
('Hindi', 'hi'),
('Tagalog', 'tl'),
('Portuguese', 'pt'),
('Russian', 'ru'),
('Afrikaans', 'af'),
('Swedish', 'sv');

-- 3. TIMEZONES (Map với tutors.timezone_offset)
INSERT INTO public.timezones (name, utc_offset) VALUES 
('Asia/Ho_Chi_Minh', '+07:00'), -- VN, Bangkok
('Asia/Tokyo', '+09:00'),       -- JP, KR
('Asia/Kolkata', '+05:30'),     -- IN
('Asia/Singapore', '+08:00'),   -- SG, PH, CN
('Europe/London', '+00:00'),    -- GB
('Europe/Paris', '+01:00'),     -- FR, DE, IT, ES, SE, NL
('Europe/Moscow', '+03:00'),    -- RU
('Africa/Johannesburg', '+02:00'), -- ZA
('America/New_York', '-05:00'), -- US (East)
('America/Chicago', '-06:00'),  -- US (Central), MX
('America/Los_Angeles', '-08:00'), -- US (West)
('America/Toronto', '-04:00'),  -- CA
('America/Sao_Paulo', '-03:00'), -- BR
('Australia/Sydney', '+10:00'); -- AU

-- 4. CATEGORIES (QUAN TRỌNG: GÁN ID CỨNG)
-- Dùng các ID này để sau này code logic hiển thị cây thư mục môn học
INSERT INTO public.categories (id, name, description, parent_id) VALUES 
-- Nhóm Tự nhiên (...10)
('c0000000-0000-0000-0000-000000000010', 'Natural Sciences', 'Toán, Lý, Hóa, Sinh', NULL),
-- Nhóm Xã hội (...20)
('c0000000-0000-0000-0000-000000000020', 'Social Sciences', 'Sử, Địa, GDCD', NULL),
-- Nhóm Ngôn ngữ (...30)
('c0000000-0000-0000-0000-000000000030', 'Languages & Literature', 'Văn học và Ngoại ngữ', NULL),
-- Nhóm Nghệ thuật (...40)
('c0000000-0000-0000-0000-000000000040', 'Arts & Talents', 'Âm nhạc, Mỹ thuật', NULL),
-- Nhóm Công nghệ (...50)
('c0000000-0000-0000-0000-000000000050', 'Technology & IT', 'Tin học, Lập trình', NULL);

-- 5. SUBJECTS (Map với tutor_subjects.subject_name)
-- Insert đúng tên môn học mà bên Tutor đã insert
INSERT INTO public.subjects (name, category_id) VALUES 
-- Natural Sciences
('Mathematics', 'c0000000-0000-0000-0000-000000000010'),
('Physics', 'c0000000-0000-0000-0000-000000000010'),
('Chemistry', 'c0000000-0000-0000-0000-000000000010'),
('Biology', 'c0000000-0000-0000-0000-000000000010'),

-- Social Sciences
('History', 'c0000000-0000-0000-0000-000000000020'),
('Geography', 'c0000000-0000-0000-0000-000000000020'),
('Civic Education', 'c0000000-0000-0000-0000-000000000020'),

-- Languages & Literature
('Literature', 'c0000000-0000-0000-0000-000000000030'),
('Vietnamese', 'c0000000-0000-0000-0000-000000000030'),
('English', 'c0000000-0000-0000-0000-000000000030'),
('Japanese', 'c0000000-0000-0000-0000-000000000030'),
('Korean', 'c0000000-0000-0000-0000-000000000030'),
('Chinese', 'c0000000-0000-0000-0000-000000000030'),
('French', 'c0000000-0000-0000-0000-000000000030'),

-- Arts & Talents
('Music', 'c0000000-0000-0000-0000-000000000040'),
('Arts', 'c0000000-0000-0000-0000-000000000040'), -- Tương ứng với 'Fine Arts', 'Drawing' bên Tutor gộp chung
('Fine Arts', 'c0000000-0000-0000-0000-000000000040'),
('Drawing', 'c0000000-0000-0000-0000-000000000040'),

-- Technology
('Information Technology', 'c0000000-0000-0000-0000-000000000050');