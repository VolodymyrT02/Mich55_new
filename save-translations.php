<?php
/**
 * Скрипт для сохранения обновленных переводов в файл translations.js
 * Этот файл должен быть размещен в той же директории, что и translations.js
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
    $logFile = 'translations-sync-errors.log';
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message\n", FILE_APPEND);
}

// Проверка метода запроса
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response = [
        'success' => false,
        'error' => 'Метод не поддерживается'
    ];
    echo json_encode($response);
    exit;
}

// Получение данных из запроса
$requestData = json_decode(file_get_contents('php://input'), true);
if (!$requestData || !isset($requestData['translationsText'])) {
    $response = [
        'success' => false,
        'error' => 'Неверный формат данных'
    ];
    echo json_encode($response);
    exit;
}

// Путь к файлу переводов
$translationsPath = 'assets/js/translations.js';

// Создание резервной копии перед изменением
$backupPath = $translationsPath . '.backup.' . date('YmdHis');
if (!copy($translationsPath, $backupPath)) {
    logError("Не удалось создать резервную копию файла переводов");
    // Продолжаем выполнение, даже если не удалось создать резервную копию
}

// Сохранение обновленных переводов
try {
    $result = file_put_contents($translationsPath, $requestData['translationsText']);
    if ($result === false) {
        throw new Exception("Не удалось сохранить файл переводов");
    }
    
    // Установка прав доступа
    chmod($translationsPath, 0644);
    
    // Успешный ответ
    $response = [
        'success' => true,
        'message' => 'Переводы успешно сохранены',
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

