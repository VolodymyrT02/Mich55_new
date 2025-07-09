# syntax=docker/dockerfile:1
FROM python:3.11-slim

# Устанавливаем переменные окружения
ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    POETRY_VIRTUALENVS_CREATE=false

WORKDIR /app

# Копируем файлы зависимостей и устанавливаем их
COPY requirements.txt ./
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    pip install psycopg[binary] \
    && apt-get clean

# Копируем исходный код backend
COPY . /app

# Открываем порт (в контейнере будет 5000)
EXPOSE 5000

# Копируем и даём право на запуск entrypoint.sh
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

CMD ["/entrypoint.sh"] 