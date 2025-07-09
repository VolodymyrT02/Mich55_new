DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS apartments CASCADE;
DROP TABLE IF EXISTS translations CASCADE;
DROP TABLE IF EXISTS media CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
);

CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT,
    language_code TEXT NOT NULL
);

CREATE TABLE apartments (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    level TEXT,
    status TEXT,
    legal_area_uk TEXT,
    actual_area_uk TEXT,
    view_uk TEXT,
    price_uk TEXT,
    included_uk TEXT,
    legal_area_en TEXT,
    actual_area_en TEXT,
    view_en TEXT,
    price_en TEXT,
    included_en TEXT,
    plan_photo_path TEXT,
    additional_photos_paths TEXT[]
);

CREATE TABLE translations (
    id SERIAL PRIMARY KEY,
    language_code TEXT NOT NULL,
    translation_key TEXT NOT NULL,
    translation_value TEXT NOT NULL,
    UNIQUE(language_code, translation_key)
);

CREATE TABLE media (
    id SERIAL PRIMARY KEY,
    filename TEXT NOT NULL,
    path TEXT UNIQUE NOT NULL,
    alt_text_uk TEXT,
    alt_text_en TEXT,
    caption_uk TEXT,
    caption_en TEXT,
    media_type TEXT NOT NULL,
    section TEXT
); 