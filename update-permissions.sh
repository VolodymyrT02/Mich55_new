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

# Установка прав на PHP скрипты
chmod 644 save-data.php
echo "Права на save-data.php установлены (644)"

chmod 644 save-translations.php
echo "Права на save-translations.php установлены (644)"

chmod 644 update-prices.php
echo "Права на update-prices.php установлены (644)"

# Установка прав на JavaScript файлы
chmod 644 assets/js/*.js
echo "Права на JavaScript файлы установлены (644)"

# Проверка наличия .htaccess и установка прав
if [ -f .htaccess ]; then
    chmod 644 .htaccess
    echo "Права на .htaccess установлены (644)"
else
    echo "Файл .htaccess не найден"
fi

# Установка прав на директорию assets/js
chmod 755 assets/js
echo "Права на директорию assets/js установлены (755)"

# Установка прав на директорию assets/css
chmod 755 assets/css
echo "Права на директорию assets/css установлены (755)"

# Установка прав на HTML файлы
chmod 644 *.html
echo "Права на HTML файлы установлены (644)"

# Создание файла для логов ошибок и установка прав
touch update-prices-errors.log
chmod 666 update-prices-errors.log
echo "Файл логов update-prices-errors.log создан с правами 666"

touch translations-sync-errors.log
chmod 666 translations-sync-errors.log
echo "Файл логов translations-sync-errors.log создан с правами 666"

echo "Установка прав доступа завершена"
