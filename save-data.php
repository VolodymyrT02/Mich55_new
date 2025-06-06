<?php
/**
 * Скрипт для сохранения данных из админ-панели в JSON файл
 * Этот файл должен быть размещен в той же директории, что и admin-panel-final.html
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
    $logFile = 'data-sync-errors.log';
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
if (!isset($input['data'])) {
    $response = [
        'success' => false,
        'error' => 'Отсутствуют данные для сохранения'
    ];
    logError('Отсутствуют данные для сохранения');
    echo json_encode($response);
    exit;
}

// Путь к файлу данных
$dataFile = 'data.json';

// Создание резервной копии перед сохранением
if (file_exists($dataFile)) {
    $backupFile = 'data_backup_' . date('Y-m-d_H-i-s') . '.json';
    if (!copy($dataFile, $backupFile)) {
        logError("Не удалось создать резервную копию файла данных");
    }
}

// Сохранение данных в файл
$result = file_put_contents($dataFile, json_encode($input['data'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

if ($result === false) {
    $response = [
        'success' => false,
        'error' => 'Не удалось сохранить данные в файл. Проверьте права доступа.'
    ];
    logError('Не удалось сохранить данные в файл. Проверьте права доступа.');
    echo json_encode($response);
    exit;
}

// Установка прав доступа на файл
chmod($dataFile, 0666);

// Успешный ответ
$response = [
    'success' => true,
    'message' => 'Данные успешно сохранены',
    'timestamp' => time(),
    'bytes_written' => $result
];

echo json_encode($response);
?>
