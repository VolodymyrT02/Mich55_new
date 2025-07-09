import os
import json
import re
import psycopg
from psycopg import rows
from dotenv import load_dotenv
from flask_bcrypt import generate_password_hash

load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')
# Ensure a default secret key for bcrypt if not set
SECRET_KEY = os.getenv('SECRET_KEY', 'your_secret_key') 

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable not set.")

def get_db_connection():
    return psycopg.connect(DATABASE_URL)

def initialize_db():
    print("Инициализация базы данных...")
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        with open('schema.sql', 'r') as f:
            cur.execute(f.read())
        conn.commit()
        print("База данных успешно инициализирована.\n")
    except Exception as e:
        print(f"Ошибка инициализации базы данных: {e}")
        if conn:
            conn.rollback()
    finally:
        if conn:
            conn.close()

def import_data():
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor(row_factory=rows.dict_row)

        # 1. Import Users (default admin user)
        print("Импорт пользователей...")
        hashed_password = generate_password_hash('admin_password').decode('utf-8') # Default password
        cur.execute("INSERT INTO users (username, password_hash) VALUES (%s, %s) ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash;", ('admin', hashed_password))
        print("Пользователь 'admin' импортирован/обновлен.")

        # 2. Import data from data.json
        print("Импорт данных из data.json...")
        with open('../data.json', 'r', encoding='utf-8') as f:
            data_json = json.load(f)

        # 3. Import data from translations.js - TEMPORARY HARDCODED SOLUTION
        print("Импорт данных из translations.js (временное решение)...")
        # In a real scenario, this data would be fetched from a reliable source or properly parsed.
        # For initial setup, we will use a minimal set of translations.
        translations_js = {
            "uk": {
                "nav_home": "Головна",
                "nav_about": "Про комплекс",
                "nav_apartments": "Квартири",
                "nav_location": "Розташування",
                "nav_contacts": "Контакти",
                "building_name": "BOUTIQUE APARTMENTS KYIV",
                "building_slogan": "Ваш краєвид, ваше натхнення",
                "building_address": "вулиця Ломаківська / Мічуріна, 55, Печерський район, м. Київ",
                "building_status": "Здано в експлуатацію лютий 2025р.",
                "about_title": "BOUTIQUE APARTMENTS KYIV",
                "about_slogan": "Ваш краєвид, ваше натхнення",
                "about_subtitle": "Особливості об'єкта",
                "about_text_1": "6 приватних резиденцій на Печерських схилах — камерна колекція житла, де унікальність панорами поєднується з внутрішнім спокоєм та розкішшю.\n\nБудинок виділяється високим статусом за рахунок розташування в історичному центрі міста, в оточенні вікових дерев та клубних будінків. Лише декілька хвилин від центральної артерії Києва — бульвару Лесі Українки, але водночас в тихому затишному місці.\n\nШість квартир у п'ятиповерховій секції з власним лобі та комерційним приміщенням на першому поверсі. Будинок створений з турботою про вашу безпеку та комфорт.\n\nВисока якість будівельних матеріалів — це ключовий показник надійності. Стіни з червоної цегли та залізобетонні перекриття надають надійну довговічну основу, що відповідає найвищим стандартам.\n\nЗавершальний штрих — стильний та функціональний дизайн з сучасними рішеннями, що підкреслює елегантність та функціональність. Фасад виконаний з керамограніту та натурального каменю. Усі вікна з алюмінієвим профілем та енергозберігаючими склопакетами. \n\nЛаконічність у архітектурі, ергономічність у деталях, екологічність у матеріалах. З турботою про вас та ваше майбутнє. Boutique Apartments Kyiv – це не просто житло, а особливий досвід, який об'єднує престиж, інновації та розкіш у серці Києва.\n",
                "about_text_2": "Будинок Boutique Apartments Kyiv — це оазис спокою та комфорту, що розташований в історичному центрі Києва, серед вікових дерев та престижних клубних будінків.  Насолоджуйтеся панорамними краєвидами з вікон вашої резиденції, які надихатимуть вас щодня. Продуманий дизайн, висока якість матеріалів та екологічність забезпечують надійність та довговічність. Boutique Apartments Kyiv — це не просто житло, це особливий досвід, який об'єднує престиж, інновації та розкіш у серці столиці.\n",
                "lobby_title": "Лоббі",
                "video_title": "Відео презентація",
                "technology_title": "Технології",
                "technology_section_1_title": "Матеріали",
                "technology_section_1_text_1": "Червона цегла\n",
                "technology_section_1_text_2": "Залізобетонні перекриття\n",
                "technology_section_2_title": "Фасад",
                "technology_section_2_text_1": "Керамограніт\n",
                "technology_section_2_text_2": "Натуральний камінь\n",
                "technology_section_3_title": "Вікна",
                "technology_section_3_text_1": "Алюмінієвий профіль\n",
                "technology_section_3_text_2": "Енергозберігаючі склопакети\n",
                "apartments_title": "Квартири",
                "location_title": "Розташування",
                "contacts_title": "Контакти",
                "contact_address": "вулиця Ломаківська / Мічуріна, 55, Печерський район, м. Київ",
                "contact_phone_1": "+38 (067) 560-60-20",
                "contact_phone_2": "+38 (067) 640-60-20",
                "contact_email": "sales@butik55.id-app.io",
                "footer_copyright": "2024 BOUTIQUE APARTMENTS KYIV Всі права захищені",
                "footer_made_by": "Made by"
            },
            "en": {
                "nav_home": "Home",
                "nav_about": "About Complex",
                "nav_apartments": "Apartments",
                "nav_location": "Location",
                "nav_contacts": "Contacts",
                "building_name": "BOUTIQUE APARTMENTS KYIV",
                "building_slogan": "Your View, Your Inspiration",
                "building_address": "Lomakivska / Michurina Street, 55, Pecherskyi District, Kyiv",
                "building_status": "Commissioned February 2025",
                "about_title": "BOUTIQUE APARTMENTS KYIV",
                "about_slogan": "Your View, Your Inspiration",
                "about_subtitle": "Features of the Object",
                "about_text_1": "6 private residences on the Pechersk hills — a chamber collection of housing where the uniqueness of the panorama combines with inner tranquility and luxury.\n\nThe building stands out with its high status due to its location in the historical center of the city, surrounded by ancient trees and club houses. Only a few minutes from the central artery of Kyiv — Lesya Ukrainka Boulevard, yet in a quiet, cozy place.\n\nSix apartments in a five-story section with its own lobby and commercial premises on the ground floor. The building is designed with care for your safety and comfort.\n\nHigh quality building materials are a key indicator of reliability. Red brick walls and reinforced concrete slabs provide a reliable, long-lasting foundation that meets the highest standards.\n\nThe finishing touch is a stylish and functional design with modern solutions that emphasize elegance and functionality. The facade is made of ceramic granite and natural stone. All windows have aluminum profiles and energy-saving double-glazed windows.\n\nConciseness in architecture, ergonomics in details, environmental friendliness in materials. With care for you and your future. Boutique Apartments Kyiv is not just housing, but a special experience that combines prestige, innovation, and luxury in the heart of Kyiv.\n",
                "about_text_2": "Boutique Apartments Kyiv is an oasis of peace and comfort, located in the historical center of Kyiv, among ancient trees and prestigious club houses. Enjoy panoramic views from the windows of your residence that will inspire you every day. Thoughtful design, high quality materials, and environmental friendliness ensure reliability and durability. Boutique Apartments Kyiv is not just housing, it is a special experience that combines prestige, innovation, and luxury in the heart of the capital.\n",
                "lobby_title": "Lobby",
                "video_title": "Video Presentation",
                "technology_title": "Technologies",
                "technology_section_1_title": "Materials",
                "technology_section_1_text_1": "Red brick\n",
                "technology_section_1_text_2": "Reinforced concrete slabs\n",
                "technology_section_2_title": "Facade",
                "technology_section_2_text_1": "Ceramic granite\n",
                "technology_section_2_text_2": "Natural stone\n",
                "technology_section_3_title": "Windows",
                "technology_section_3_text_1": "Aluminum profile\n",
                "technology_section_3_text_2": "Energy-saving double-glazed windows\n",
                "apartments_title": "Apartments",
                "location_title": "Location",
                "contacts_title": "Contacts",
                "contact_address": "Lomakivska / Michurina Street, 55, Pecherskyi District, Kyiv",
                "contact_phone_1": "+38 (067) 560-60-20",
                "contact_phone_2": "+38 (067) 640-60-20",
                "contact_email": "sales@butik55.id-app.io",
                "footer_copyright": "2024 BOUTIQUE APARTMENTS KYIV All rights reserved",
                "footer_made_by": "Made by"
            }
        }

        # Insert into translations table
        for lang, keys in translations_js.items():
            for key, value in keys.items():
                cur.execute(
                    "INSERT INTO translations (language_code, translation_key, translation_value) VALUES (%s, %s, %s) ON CONFLICT (language_code, translation_key) DO UPDATE SET translation_value = EXCLUDED.translation_value;",
                    (lang, key, value)
                )
        print("Переводы импортированы/обновлены.\n")

        # 4. Import Apartments
        print("Импорт информации о квартирах...\n")
        apartments_data_uk = data_json['uk']['sections']['apartments']['items']
        apartments_data_en = data_json['en']['sections']['apartments']['items']

        for i, apartment_uk in enumerate(apartments_data_uk):
            apartment_en = apartments_data_en[i]
            
            # Extract details
            legal_area_uk = next((d for d in apartment_uk['details'] if 'Юридична площа:' in d), None)
            actual_area_uk = next((d for d in apartment_uk['details'] if 'Фактично:' in d), None)
            view_uk = next((d for d in apartment_uk['details'] if 'Вид:' in d), None)
            price_uk = next((d for d in apartment_uk['details'] if 'Вартість:' in d), None)
            included_uk = next((d for d in apartment_uk['details'] if 'Включено:' in d), None)

            legal_area_en = next((d for d in apartment_en['details'] if 'Legal area:' in d), None)
            actual_area_en = next((d for d in apartment_en['details'] if 'Actual:' in d), None)
            view_en = next((d for d in apartment_en['details'] if 'View:' in d), None)
            price_en = next((d for d in apartment_en['details'] if 'Price:' in d), None)
            included_en = next((d for d in apartment_en['details'] if 'Included:' in d), None)

            plan_photo_path = apartment_uk['plan_photo'].replace("assets/images/plans/", "assets/images/apartment_media/") if apartment_uk['plan_photo'] else None
            additional_photos_paths = [path.replace("assets/images/elevator/", "assets/images/apartment_media/") for path in apartment_uk['photos']] if apartment_uk['photos'] else []

            cur.execute(
                """INSERT INTO apartments (name, level, status, legal_area_uk, actual_area_uk, view_uk, price_uk, included_uk, legal_area_en, actual_area_en, view_en, price_en, included_en, plan_photo_path, additional_photos_paths) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (id) DO UPDATE SET 
                    name = EXCLUDED.name, level = EXCLUDED.level, status = EXCLUDED.status,
                    legal_area_uk = EXCLUDED.legal_area_uk, actual_area_uk = EXCLUDED.actual_area_uk, view_uk = EXCLUDED.view_uk, price_uk = EXCLUDED.price_uk, included_uk = EXCLUDED.included_uk,
                    legal_area_en = EXCLUDED.legal_area_en, actual_area_en = EXCLUDED.actual_area_en, view_en = EXCLUDED.view_en, price_en = EXCLUDED.price_en, included_en = EXCLUDED.included_en,
                    plan_photo_path = EXCLUDED.plan_photo_path, additional_photos_paths = EXCLUDED.additional_photos_paths;""",
                (apartment_uk['name'], None, apartment_uk['commissioning_date'], 
                 legal_area_uk, actual_area_uk, view_uk, price_uk, included_uk,
                 legal_area_en, actual_area_en, view_en, price_en, included_en,
                 plan_photo_path, additional_photos_paths)
            )
        print("Информация о квартирах импортирована/обновлена.\n")

        # 5. Import Media (images and videos)
        print("Импорт медиафайлов...\n")
        
        # Facade images (direct scan)
        facade_dir = '../assets/images/facade/'
        if os.path.exists(facade_dir):
            for filename in os.listdir(facade_dir):
                # Ensure it's an image file and not a directory or other file
                if filename.lower().endswith( ('.jpg', '.jpeg', '.png', '.gif') ):
                    src = os.path.join('assets/images/facade', filename).replace('\\', '/')
                    base_filename = os.path.basename(src)
                    cur.execute(
                        "INSERT INTO media (filename, path, alt_text_uk, alt_text_en, media_type, section) VALUES (%s, %s, %s, %s, %s, %s) ON CONFLICT (path) DO UPDATE SET filename = EXCLUDED.filename, alt_text_uk = EXCLUDED.alt_text_uk, alt_text_en = EXCLUDED.alt_text_en, media_type = EXCLUDED.media_type, section = EXCLUDED.section;",
                        (base_filename, src, f"Фасад {base_filename}", f"Facade {base_filename}", 'image', 'hero_slider')
                    )
        
        # Lobby images (direct scan)
        lobby_dir = '../assets/images/lobby/'
        if os.path.exists(lobby_dir):
            for filename in os.listdir(lobby_dir):
                # Ensure it's an image file
                if filename.lower().endswith( ('.jpg', '.jpeg', '.png', '.gif') ):
                    src = os.path.join('assets/images/lobby', filename).replace('\\', '/')
                    base_filename = os.path.basename(src)
                    cur.execute(
                        "INSERT INTO media (filename, path, alt_text_uk, alt_text_en, media_type, section) VALUES (%s, %s, %s, %s, %s, %s) ON CONFLICT (path) DO UPDATE SET filename = EXCLUDED.filename, alt_text_uk = EXCLUDED.alt_text_uk, alt_text_en = EXCLUDED.alt_text_en, media_type = EXCLUDED.media_type, section = EXCLUDED.section;",
                        (base_filename, src, f"Лобби {base_filename}", f"Lobby {base_filename}", 'image', 'lobby_gallery')
                    )

        # Apartment media images from the new directory (already handled correctly)
        apartment_media_dir = '../assets/images/apartment_media/'
        if os.path.exists(apartment_media_dir):
            for filename in os.listdir(apartment_media_dir):
                if filename.lower().endswith( ('.jpg', '.jpeg', '.png', '.gif') ):
                    src = os.path.join('assets/images/apartment_media', filename).replace('\\', '/') # Use forward slashes
                    base_filename = os.path.basename(filename)
                    cur.execute(
                        "INSERT INTO media (filename, path, alt_text_uk, alt_text_en, media_type, section) VALUES (%s, %s, %s, %s, %s, %s) ON CONFLICT (path) DO UPDATE SET filename = EXCLUDED.filename, alt_text_uk = EXCLUDED.alt_text_uk, alt_text_en = EXCLUDED.alt_text_en, media_type = EXCLUDED.media_type, section = EXCLUDED.section;",
                        (base_filename, src, f"Изображение квартиры {base_filename}", f"Apartment image {base_filename}", 'image', 'apartment_media')
                    )

        # Video from index.html (this logic is still valid)
        video_match = re.search(r'<source\s+src="([^"]+)"\s+type="video/mp4">', open('../index.html', 'r', encoding='utf-8').read())
        if video_match:
            video_src = video_match.group(1)
            filename = os.path.basename(video_src)
            cur.execute(
                "INSERT INTO media (filename, path, alt_text_uk, alt_text_en, media_type, section) VALUES (%s, %s, %s, %s, %s, %s) ON CONFLICT (path) DO UPDATE SET filename = EXCLUDED.filename, alt_text_uk = EXCLUDED.alt_text_uk, alt_text_en = EXCLUDED.alt_text_en, media_type = EXCLUDED.media_type, section = EXCLUDED.section;",
                (filename, video_src, "Основное видео", "Main video", 'video', 'main_video')
            )

        print("Медиафайлы импортированы/обновлены.\n")

        conn.commit()
        print("Данные успешно импортированы в базу данных.")

    except Exception as e:
        print(f"Ошибка при импорте данных: {e}")
        if conn:
            conn.rollback()
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    initialize_db()
    import_data() 