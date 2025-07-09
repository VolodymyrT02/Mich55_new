import os
import json
import sys
from pathlib import Path

import requests

"""
Скрипт выгружает данные с локального API `/api/content` и сохраняет
их в `assets/data/content.json`, чтобы статический фронтенд
мог работать без запущенного Flask.

Запускать так (при активном виртуальном окружении и запущенном backend):

    python build_static_content.py [URL]

URL по умолчанию: http://127.0.0.1:5002/api/content
"""

def main():
    api_url = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:5002/api/content"
    print(f"Запрашиваю данные из {api_url} ...")

    try:
        resp = requests.get(api_url, timeout=30)
        resp.raise_for_status()
    except Exception as e:
        print(f"Ошибка при запросе API: {e}\nУбедитесь, что backend запущен и доступен.")
        sys.exit(1)

    data = resp.json()

    target_path = Path(__file__).parent / "assets" / "data"
    target_path.mkdir(parents=True, exist_ok=True)
    output_file = target_path / "content.json"

    with output_file.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Контент успешно сохранён в {output_file.relative_to(Path(__file__).parent)}")


if __name__ == "__main__":
    main() 