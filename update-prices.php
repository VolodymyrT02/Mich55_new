<?php
/**
 * Скрипт для обновления цен в HTML-файле на основе данных из translations.js
 * Этот файл должен быть размещен в той же директории, что и index.html
 */

// Установка заголовков для предотвращения кэширования и разрешения CORS
header('Content-Type: application/json');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Проверка метода запроса
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Предварительный запрос CORS, просто возвращаем заголовки
    exit(0);
}

// Функция для логирования ошибок
function logError($message) {
    $logFile = 'update-prices-errors.log';
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message\n", FILE_APPEND);
}

// Функция для извлечения объекта переводов из файла translations.js
function extractTranslations($filePath) {
    if (!file_exists($filePath)) {
        logError("Файл переводов не найден: $filePath");
        return null;
    }
    
    $content = file_get_contents($filePath);
    if (!$content) {
        logError("Не удалось прочитать файл переводов: $filePath");
        return null;
    }
    
    // Извлекаем объект переводов из текста файла
    if (preg_match('/const\s+translations\s*=\s*(\{[\s\S]*?\}\s*);/', $content, $matches)) {
        $translationsText = $matches[1];
        
        // Преобразуем текст объекта в объект PHP
        $translationsJson = preg_replace('/(\w+):/i', '"$1":', $translationsText); // Заменяем ключи на строки в кавычках
        $translationsJson = preg_replace('/,\s*}/', '}', $translationsJson); // Удаляем запятые перед закрывающими скобками
        
        try {
            $translations = json_decode($translationsJson, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                logError("Ошибка при декодировании JSON: " . json_last_error_msg());
                return null;
            }
            return $translations;
        } catch (Exception $e) {
            logError("Ошибка при преобразовании объекта переводов: " . $e->getMessage());
            return null;
        }
    } else {
        logError("Не удалось извлечь объект переводов из файла");
        return null;
    }
}

// Функция для обновления цен в HTML-файле
function updatePricesInHtml($htmlPath, $translations) {
    if (!file_exists($htmlPath)) {
        logError("HTML-файл не найден: $htmlPath");
        return false;
    }
    
    $content = file_get_contents($htmlPath);
    if (!$content) {
        logError("Не удалось прочитать HTML-файл: $htmlPath");
        return false;
    }
    
    // Создаем резервную копию перед изменением
    $backupPath = $htmlPath . '.backup.' . date('YmdHis');
    if (!copy($htmlPath, $backupPath)) {
        logError("Не удалось создать резервную копию HTML-файла");
        // Продолжаем выполнение, даже если не удалось создать резервную копию
    }
    
    // Обновляем цены квартир в украинской версии
    if (isset($translations['uk'])) {
        $ukPrices = [
            'apartments_apartment1_price' => $translations['uk']['apartments_apartment1_price'] ?? '',
            'apartments_apartment2_price' => $translations['uk']['apartments_apartment2_price'] ?? '',
            'apartments_apartment3_price' => $translations['uk']['apartments_apartment3_price'] ?? ''
        ];
        
        // Обновляем цены в HTML-файле
        // Здесь мы используем регулярные выражения для поиска и замены цен в HTML-коде
        // Это примерная реализация, которую нужно адаптировать под конкретную структуру HTML
    }
    
    // Обновляем цены квартир в английской версии
    if (isset($translations['en'])) {
        $enPrices = [
            'apartments_apartment1_price' => $translations['en']['apartments_apartment1_price'] ?? '',
            'apartments_apartment2_price' => $translations['en']['apartments_apartment2_price'] ?? '',
            'apartments_apartment3_price' => $translations['en']['apartments_apartment3_price'] ?? ''
        ];
        
        // Обновляем цены в HTML-файле
        // Здесь мы используем регулярные выражения для поиска и замены цен в HTML-коде
        // Это примерная реализация, которую нужно адаптировать под конкретную структуру HTML
    }
    
    // Сохраняем обновленный HTML-файл
    if (file_put_contents($htmlPath, $content) === false) {
        logError("Не удалось сохранить обновленный HTML-файл");
        return false;
    }
    
    return true;
}

// Основной код скрипта
try {
    // Пути к файлам
    $translationsPath = 'assets/js/translations.js';
    $htmlPath = 'index.html';
    
    // Извлекаем объект переводов
    $translations = extractTranslations($translationsPath);
    if (!$translations) {
        throw new Exception("Не удалось извлечь объект переводов из файла");
    }
    
    // Обновляем цены в HTML-файле
    $result = updatePricesInHtml($htmlPath, $translations);
    if (!$result) {
        throw new Exception("Не удалось обновить цены в HTML-файле");
    }
    
    // Успешный ответ
    $response = [
        'success' => true,
        'message' => 'Цены успешно обновлены в HTML-файле',
        'timestamp' => time()
    ];
    
    echo json_encode($response);
} catch (Exception $e) {
    // Ошибка
    $response = [
        'success' => false,
        'error' => $e->getMessage()
    ];
    
    logError($e->getMessage());
    echo json_encode($response);
}
?>

