<?php
/**
 * Скрипт для сохранения обновленных переводов в файл translations.js
 * Этот файл должен быть размещен в той же директории, что и admin-panel.html
 */

// Установка заголовков для предотвращения кеширования и разрешения CORS
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
    $logFile = 'translations-sync-errors.log';
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message\n", FILE_APPEND);
}

// Проверка метода запроса
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response = [
        'success' => false,
        'error' => 'Метод не поддерживается. Используйте POST.'
    ];
    echo json_encode($response);
    exit;
}

// Получение данных из тела запроса
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

// Проверка корректности JSON
if (json_last_error() !== JSON_ERROR_NONE) {
    $response = [
        'success' => false,
        'error' => 'Некорректный формат JSON: ' . json_last_error_msg()
    ];
    logError('Некорректный формат JSON: ' . json_last_error_msg());
    echo json_encode($response);
    exit;
}

// Проверка наличия данных
if (!isset($input['translationsText'])) {
    $response = [
        'success' => false,
        'error' => 'Отсутствует текст переводов для сохранения'
    ];
    logError('Отсутствует текст переводов для сохранения');
    echo json_encode($response);
    exit;
}

// Путь к файлу переводов
$translationsFile = 'assets/js/translations.js';

// Создание резервной копии перед сохранением
if (file_exists($translationsFile)) {
    $backupFile = 'assets/js/translations_backup_' . date('Y-m-d_H-i-s') . '.js';
    if (!copy($translationsFile, $backupFile)) {
        logError("Не удалось создать резервную копию файла переводов");
    }
}

// Сохранение данных в файл
$result = file_put_contents($translationsFile, $input['translationsText']);

if ($result === false) {
    $response = [
        'success' => false,
        'error' => 'Не удалось сохранить переводы в файл. Проверьте права доступа.'
    ];
    logError('Не удалось сохранить переводы в файл. Проверьте права доступа.');
    echo json_encode($response);
    exit;
}

// Установка прав доступа на файл
chmod($translationsFile, 0666);

// Успешный ответ
$response = [
    'success' => true,
    'message' => 'Переводы успешно сохранены',
    'timestamp' => time(),
    'bytes_written' => $result
];

echo json_encode($response);
?>

