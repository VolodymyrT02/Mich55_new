#!/bin/bash
# Скрипт для установки правильных прав доступа к файлам и директориям

# Установка прав на data.json
chmod 666 data.json
echo "Права на data.json установлены (666)"

# Установка прав на директории для изображений
chmod -R 755 assets/images
echo "Права на директорию assets/images установлены (755)"

# Установка прав на директорию для загрузки новых изображений
mkdir -p assets/uploads
chmod 777 assets/uploads
echo "Права на директорию assets/uploads установлены (777)"

# Установка прав на PHP скрипт
chmod 644 save-data.php
echo "Права на save-data.php установлены (644)"

# Проверка наличия .htaccess и установка прав
if [ -f .htaccess ]; then
    chmod 644 .htaccess
    echo "Права на .htaccess установлены (644)"
else
    echo "Файл .htaccess не найден"
fi

echo "Установка прав доступа завершена"
