import os
import json
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS # Import CORS
from dotenv import load_dotenv
import psycopg
try:
    from psycopg import rows  # only needed when подключаемся к Postgres
except ModuleNotFoundError:
    rows = None

# --- NEW: SQLAlchemy & Admin -------------------------
from flask_sqlalchemy import SQLAlchemy
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from flask_admin.form import SecureForm
from sqlalchemy import text
# ------------------------------------------------------

load_dotenv()

app = Flask(__name__)
CORS(app) # Initialize CORS with your app

# ---------- SQLAlchemy helper: fix URI ----------------
def _get_sqlalchemy_uri():
    """Return SQLAlchemy URI.

    Локально всегда используем SQLite (простота, без внешней зависимости).
    Чтобы явно подключиться к удалённой БД Postgres, задайте переменную
    окружения USE_REMOTE_DB=1 и корректный DATABASE_URL (postgres://…).
    """
    use_remote = os.getenv('USE_REMOTE_DB', '').lower() in {'1', 'true', 'yes'}
    raw_uri = os.getenv('DATABASE_URL') if use_remote else None

    if raw_uri:
        # Нормализуем URI для драйвера psycopg (psycopg3)
        if raw_uri.startswith('postgres://'):
            raw_uri = raw_uri.replace('postgres://', 'postgresql://', 1)
        if raw_uri.startswith('postgresql://'):
            raw_uri = raw_uri.replace('postgresql://', 'postgresql+psycopg://', 1)
        if 'psycopg2' in raw_uri:
            raw_uri = raw_uri.replace('psycopg2', 'psycopg')
        return raw_uri

    # Fallback: локальный SQLite
    return 'sqlite:///site_data.db'
# ------------------------------------------------------

app.config['DATABASE_URL'] = os.getenv('DATABASE_URL')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your_secret_key') # Consider using a stronger key

# SQLAlchemy config
app.config['SQLALCHEMY_DATABASE_URI'] = _get_sqlalchemy_uri()
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialise DB + Admin
db = SQLAlchemy(app)
admin = Admin(app, name='Boutique 55 – Admin', template_mode='bootstrap4', url='/admin')

# --- NEW: ORM MODELS ---------------------------------

class Settings(db.Model):
    __tablename__ = 'settings'
    id = db.Column(db.Integer, primary_key=True)
    setting_key = db.Column(db.String, unique=True, nullable=False)
    setting_value = db.Column(db.Text)
    language_code = db.Column(db.String, nullable=False)

class Apartment(db.Model):
    __tablename__ = 'apartments'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    level = db.Column(db.String)
    status = db.Column(db.String)
    legal_area_uk = db.Column(db.String)
    actual_area_uk = db.Column(db.String)
    view_uk = db.Column(db.String)
    price_uk = db.Column(db.String)
    included_uk = db.Column(db.String)
    legal_area_en = db.Column(db.String)
    actual_area_en = db.Column(db.String)
    view_en = db.Column(db.String)
    price_en = db.Column(db.String)
    included_en = db.Column(db.String)
    plan_photo_path = db.Column(db.String)
    # SQLite не поддерживает ARRAY; храним JSON-строку (list -> json.dumps)
    additional_photos_paths = db.Column(db.Text)

class Translation(db.Model):
    __tablename__ = 'translations'
    id = db.Column(db.Integer, primary_key=True)
    language_code = db.Column(db.String, nullable=False)
    translation_key = db.Column(db.String, nullable=False)
    translation_value = db.Column(db.Text, nullable=False)

class Media(db.Model):
    __tablename__ = 'media'
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String, nullable=False)
    path = db.Column(db.String, unique=True, nullable=False)
    alt_text_uk = db.Column(db.String)
    alt_text_en = db.Column(db.String)
    caption_uk = db.Column(db.String)
    caption_en = db.Column(db.String)
    media_type = db.Column(db.String, nullable=False)
    section = db.Column(db.String)
    apartment_id = db.Column(db.Integer)

# Customised Media admin to avoid ARRAY field issue and add filters
class MediaAdmin(ModelView):
    form_base_class = SecureForm  # Избегаем ошибок CSRF и проблем совместимости

    column_list = ('id', 'filename', 'section', 'path', 'media_type', 'apartment_id')
    column_filters = ('section', 'media_type', 'apartment_id')
    column_searchable_list = ('filename', 'path', 'section')

    # Разрешённые поля для ручного ввода/редактирования
    form_columns = (
        'filename',
        'section',
        'path',
        'apartment_id',
        'alt_text_uk', 'alt_text_en',
        'caption_uk', 'caption_en',
        'media_type'
    )

    # Предопределённые варианты разделов для удобства
    form_choices = {
        'section': [
            ('hero_slider', 'hero_slider'),
            ('lobby_gallery', 'lobby_gallery'),
            ('apartment_media', 'apartment_media'),
            ('main_video', 'main_video'),
            ('apartments', 'apartments')
        ],
        'media_type': [
            ('image', 'image'),
            ('video', 'video')
        ]
    }

    # Сортировка по id DESC
    column_default_sort = ('id', True)

# Register views
admin.add_view(ModelView(Settings, db.session))
admin.add_view(ModelView(Apartment, db.session))
admin.add_view(ModelView(Translation, db.session))
admin.add_view(MediaAdmin(Media, db.session))

# --- Ensure DB schema is up-to-date even when app is imported by gunicorn ---
with app.app_context():
    # Создаём таблицы, если их нет
    db.create_all()

    # Добавляем колонку apartment_id в media при необходимости (SQLite/PostgreSQL-agnostic)
    try:
        engine_name = db.session.bind.dialect.name
        if engine_name == 'sqlite':
            # Проверяем через PRAGMA, есть ли уже нужный столбец
            cols = [row[1] for row in db.session.execute(text('PRAGMA table_info(media)')).fetchall()]
            if 'apartment_id' not in cols:
                db.session.execute(text('ALTER TABLE media ADD COLUMN apartment_id INTEGER'))
                db.session.commit()
        else:
            # Для Postgres доступна опция IF NOT EXISTS
            db.session.execute(text('ALTER TABLE media ADD COLUMN IF NOT EXISTS apartment_id INTEGER'))
            db.session.commit()
    except Exception as exc:
        # В случае ошибки выводим её в консоль и откатываем транзакцию, но не падаем
        print(f'WARN: cannot ensure apartment_id column exists – {exc}')
        db.session.rollback()

# ------------------------------------------------------

# Helper to serialise model objects
def _model_to_dict(obj):
    return {c.name: getattr(obj, c.name) for c in obj.__table__.columns}

@app.route('/')
def index():
    return 'Backend is running!'

@app.route('/api/content', methods=['GET'])
def get_content():
    try:
        settings = {s.setting_key: s.setting_value for s in Settings.query.all()}

        # Получаем квартиры из БД
        apartments = [_model_to_dict(a) for a in Apartment.query.order_by(Apartment.id).all()]

        # Fallback: если таблица пуста – подгружаем данные из data.json (если имеется)
        if not apartments:
            project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
            data_json_path = os.path.join(project_root, 'data.json')

            apartments_from_json = []
            try:
                with open(data_json_path, 'r', encoding='utf-8') as jf:
                    site_data = json.load(jf)

                for lang_code in ('uk', 'en'):
                    items = site_data.get(lang_code, {}).get('sections', {}).get('apartments', {}).get('items', [])
                    for item in items:
                        m = __import__('re').search(r'(\d+)', item.get('id',''))
                        if not m:
                            continue
                        apt_id = int(m.group(1))

                        # Ищем уже созданную запись для этого ID
                        existing = next((a for a in apartments_from_json if a['id']==apt_id), None)
                        if not existing:
                            # Базовые поля берем из украинской версии (или первой встреченной)
                            apartments_from_json.append({
                                'id': apt_id,
                                'name': item.get('name') or f'Residence {apt_id}',
                                'name_uk': item.get('name') if lang_code=='uk' else '',
                                'name_en': item.get('name') if lang_code=='en' else '',
                                'level': None,
                                'status': item.get('commissioning_date') if lang_code=='uk' else None,
                                'status_uk': item.get('commissioning_date') if lang_code=='uk' else None,
                                'status_en': item.get('commissioning_date') if lang_code=='en' else None,
                                'legal_area_uk': '',
                                'actual_area_uk': '',
                                'view_uk': '',
                                'price_uk': '',
                                'included_uk': '',
                                'legal_area_en': '',
                                'actual_area_en': '',
                                'view_en': '',
                                'price_en': '',
                                'included_en': '',
                                'plan_photo_path': None,
                                'additional_photos_paths': None
                            })
                        target = next(a for a in apartments_from_json if a['id']==apt_id)

                        # Обновляем language-specific поля
                        def _extract(detail_list, prefix):
                            for d in detail_list:
                                if d.startswith(prefix):
                                    return d
                            return ''

                        if lang_code=='uk':
                            target['legal_area_uk'] = _extract(item.get('details', []), 'Юридична')
                            target['actual_area_uk'] = _extract(item.get('details', []), 'Фактично')
                            target['view_uk'] = _extract(item.get('details', []), 'Вид')
                            target['price_uk'] = _extract(item.get('details', []), 'Вартість')
                            target['included_uk'] = _extract(item.get('details', []), 'Включено')
                        else:
                            target['legal_area_en'] = _extract(item.get('details', []), 'Legal area')
                            target['actual_area_en'] = _extract(item.get('details', []), 'Actual')
                            target['view_en'] = _extract(item.get('details', []), 'View')
                            target['price_en'] = _extract(item.get('details', []), 'Price')
                            target['included_en'] = _extract(item.get('details', []), 'Included')

                        # План
                        if item.get('plan_photo'):
                            plan_rel = item['plan_photo'].replace('assets/images/plans/', '/assets/images/apartments/{}/'.format(apt_id))
                            target['plan_photo_path'] = plan_rel

                if apartments_from_json:
                    apartments = apartments_from_json

                    # --- persist fallback data to DB so что админ-панель видела записи ---
                    if not Apartment.query.first():
                        for raw in apartments_from_json:
                            db.session.add(Apartment(
                                id=raw['id'],
                                name=raw.get('name') or raw.get('name_uk') or raw.get('name_en') or f'Residence {raw["id"]}',
                                level=raw.get('level'),
                                status=raw.get('status_uk') or raw.get('status_en'),
                                legal_area_uk=raw.get('legal_area_uk'),
                                actual_area_uk=raw.get('actual_area_uk'),
                                view_uk=raw.get('view_uk'),
                                price_uk=raw.get('price_uk'),
                                included_uk=raw.get('included_uk'),
                                legal_area_en=raw.get('legal_area_en'),
                                actual_area_en=raw.get('actual_area_en'),
                                view_en=raw.get('view_en'),
                                price_en=raw.get('price_en'),
                                included_en=raw.get('included_en'),
                                plan_photo_path=raw.get('plan_photo_path'),
                                additional_photos_paths=None
                            ))
                        db.session.commit()
            except FileNotFoundError:
                pass

        media = [_model_to_dict(m) for m in Media.query.all()]

        # --- AUTO-SCAN HERO & LOBBY -------------------------------------------
        project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
        facade_dir = os.path.join(project_root, 'assets', 'images', 'facade')
        if os.path.isdir(facade_dir):
            for fname in os.listdir(facade_dir):
                if not fname.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
                    continue
                rel_path = f'/assets/images/facade/{fname}'
                if any(m['path'] == rel_path for m in media):
                    continue
                media.append({
                    'id': None,
                    'filename': fname,
                    'path': rel_path,
                    'alt_text_uk': f'Фасад {fname}',
                    'alt_text_en': f'Facade {fname}',
                    'caption_uk': '',
                    'caption_en': '',
                    'media_type': 'image',
                    'section': 'hero_slider',
                    'apartment_id': None
                })

        lobby_dir = os.path.join(project_root, 'assets', 'images', 'lobby')
        if os.path.isdir(lobby_dir):
            for fname in os.listdir(lobby_dir):
                if not fname.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
                    continue
                rel_path = f'/assets/images/lobby/{fname}'
                if any(m['path'] == rel_path for m in media):
                    continue
                media.append({
                    'id': None,
                    'filename': fname,
                    'path': rel_path,
                    'alt_text_uk': f'Лобі {fname}',
                    'alt_text_en': f'Lobby {fname}',
                    'caption_uk': '',
                    'caption_en': '',
                    'media_type': 'image',
                    'section': 'lobby_gallery',
                    'apartment_id': None
                })

        # --- AUTO-SCAN APARTMENT IMAGES (plans + photos) ----------------------
        static_apts_dir = os.path.join(project_root, 'assets', 'images', 'apartments')
        if os.path.isdir(static_apts_dir):
            for apt_folder in os.listdir(static_apts_dir):
                apt_path = os.path.join(static_apts_dir, apt_folder)
                if not os.path.isdir(apt_path):
                    continue

                import re
                m = re.search(r'(\d+)', apt_folder)
                if not m:
                    continue
                apt_id = int(m.group(1))

                for fname in os.listdir(apt_path):
                    if not fname.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
                        continue
                    rel_path = f'/assets/images/apartments/{apt_folder}/{fname}'
                    if any(m['path'] == rel_path for m in media):
                        continue
                    media.append({
                        'id': None,
                        'filename': fname,
                        'path': rel_path,
                        'alt_text_uk': fname,
                        'alt_text_en': fname,
                        'caption_uk': '',
                        'caption_en': '',
                        'media_type': 'image',
                        'section': 'apartment_media',
                        'apartment_id': apt_id
                    })

        # --- Merge extra descriptive fields from data.json into apartments (fills blanks) ---
        try:
            project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
            data_json_path = os.path.join(project_root, 'data.json')
            with open(data_json_path, 'r', encoding='utf-8') as jf:
                site_json = json.load(jf)

            # helper
            def _fill(target, key, value):
                if not target.get(key):
                    target[key] = value

            for lang_code in ('uk','en'):
                items = site_json.get(lang_code, {}).get('sections', {}).get('apartments', {}).get('items', [])
                for item in items:
                    import re
                    m = re.search(r'(\d+)', item.get('id',''))
                    if not m:
                        continue
                    apt_id = int(m.group(1))
                    tgt = next((a for a in apartments if a['id']==apt_id), None)
                    if not tgt:
                        continue

                    # Map details
                    def _extract(detail_list, prefix):
                        for d in detail_list:
                            if d.startswith(prefix):
                                return d
                        return ''

                    if lang_code=='uk':
                        _fill(tgt,'name_uk',item.get('name'))
                        _fill(tgt,'status_uk',item.get('commissioning_date'))
                        _fill(tgt,'legal_area_uk',_extract(item.get('details',[]),'Юридична'))
                        _fill(tgt,'actual_area_uk',_extract(item.get('details',[]),'Фактично'))
                        _fill(tgt,'view_uk',_extract(item.get('details',[]),'Вид'))
                        _fill(tgt,'price_uk',_extract(item.get('details',[]),'Вартість'))
                        _fill(tgt,'included_uk',_extract(item.get('details',[]),'Включено'))
                    else:
                        _fill(tgt,'name_en',item.get('name'))
                        _fill(tgt,'status_en',item.get('commissioning_date'))
                        _fill(tgt,'legal_area_en',_extract(item.get('details',[]),'Legal area'))
                        _fill(tgt,'actual_area_en',_extract(item.get('details',[]),'Actual'))
                        _fill(tgt,'view_en',_extract(item.get('details',[]),'View'))
                        _fill(tgt,'price_en',_extract(item.get('details',[]),'Price'))
                        _fill(tgt,'included_en',_extract(item.get('details',[]),'Included'))
        except Exception:
            pass

        # --- Persist freshly scanned media so они видны в админ-панели ---
        unsaved_media = [m for m in media if m.get('id') is None]
        if unsaved_media:
            for m in unsaved_media:
                db.session.add(Media(
                    filename=m['filename'],
                    path=m['path'],
                    alt_text_uk=m.get('alt_text_uk'),
                    alt_text_en=m.get('alt_text_en'),
                    caption_uk=m.get('caption_uk'),
                    caption_en=m.get('caption_en'),
                    media_type=m.get('media_type'),
                    section=m.get('section'),
                    apartment_id=m.get('apartment_id')
                ))
            db.session.commit()
            media = [_model_to_dict(m) for m in Media.query.all()]

        translations = {}
        for t in Translation.query.all():
            lang = t.language_code
            translations.setdefault(lang, {})[t.translation_key] = t.translation_value

        # --- FILL TRANSLATIONS TABLE FROM data.json ON FIRST START ---------
        try:
            # build set of existing keys per lang
            existing_keys = {}
            for t in Translation.query.all():
                existing_keys.setdefault(t.language_code, set()).add(t.translation_key)

            def _walk(obj, path_prefix=""):
                """Рекурсивно обходит словарь/список и отдаёт пары (key, value) где value – строка."""
                if isinstance(obj, dict):
                    for k, v in obj.items():
                        yield from _walk(v, f"{path_prefix}{k}.")
                elif isinstance(obj, list):
                    for idx, v in enumerate(obj):
                        yield from _walk(v, f"{path_prefix}{idx}.")
                else:
                    if isinstance(obj, str):
                        # убираем хвостовую точку
                        yield path_prefix[:-1], obj

            for lang_code, lang_data in site_json.items():
                sections = lang_data.get('sections', {})
                # header обычно вне sections
                if 'header' in lang_data:
                    sections['header'] = lang_data['header']

                for key, value in _walk(sections):
                    if not value or not str(value).strip():
                        continue
                    if key in existing_keys.get(lang_code, set()):
                        continue
                    db.session.add(Translation(language_code=lang_code, translation_key=key, translation_value=value))

            if db.session.new:
                db.session.commit()
        except Exception as exc:
            print(f"WARN: cannot seed translations – {exc}")

        response_data = {
            'settings': settings,
            'apartments': apartments,
            'media': media,
            'translations': translations,
            'message': 'Content fetched successfully (ORM)'
        }
        return jsonify(response_data)

    except Exception as e:
        print(f"Error fetching content: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5002) 