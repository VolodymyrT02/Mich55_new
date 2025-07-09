#!/usr/bin/env bash
set -e

# Ожидаем, пока БД (PostgreSQL) станет доступной, если переменная указана
if [[ "$USE_REMOTE_DB" == "1" && -n "$DATABASE_URL" ]]; then
  echo "waiting for database ..."
  python - <<'PY'
import os, time, sys
import psycopg, urllib.parse
url = os.getenv('DATABASE_URL')
try:
    while True:
        try:
            conn = psycopg.connect(url)
            conn.close()
            break
        except Exception as e:
            print('Postgres unavailable, retry in 2s:', e)
            time.sleep(2)
except KeyboardInterrupt:
    sys.exit(1)
PY
fi

# Импортируем данные при первом старте (если таблица apartments пуста)
python - <<'PY'
import importlib.util, os, json
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError
backend_path = '/app/app.py'
spec = importlib.util.spec_from_file_location('app', backend_path)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)
engine = create_engine(mod.app.config['SQLALCHEMY_DATABASE_URI'])
with engine.connect() as conn:
    try:
        count = conn.execute(text('SELECT COUNT(*) FROM apartments')).scalar()
    except Exception:
        count = 0
if count == 0:
    print('Первый старт — наполняем базу контентом')
    import subprocess, sys
    subprocess.check_call([sys.executable, '/app/import_data.py'])
else:
    print('База не пуста, пропускаем импорт данных')
PY

# Запускаем gunicorn
exec gunicorn app:app --workers 2 --bind 0.0.0.0:5000 --timeout 120 --log-file - 