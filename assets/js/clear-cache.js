/**
 * Скрипт для принудительной очистки кэша браузера
 * Этот файл должен быть подключен в index.html и admin-panel.html
 */

// Функция для принудительной очистки кэша
function clearBrowserCache() {
    // Добавляем случайный параметр к URL всех скриптов и стилей
    const version = new Date().getTime();
    
    // Обрабатываем все скрипты
    document.querySelectorAll('script').forEach(script => {
        if (script.src && !script.src.includes('?v=')) {
            const originalSrc = script.src;
            script.src = originalSrc + (originalSrc.includes('?') ? '&' : '?') + 'v=' + version;
        }
    });
    
    // Обрабатываем все стили
    document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
        if (link.href && !link.href.includes('?v=')) {
            const originalHref = link.href;
            link.href = originalHref + (originalHref.includes('?') ? '&' : '?') + 'v=' + version;
        }
    });
    
    // Обрабатываем все изображения
    document.querySelectorAll('img').forEach(img => {
        if (img.src && !img.src.includes('?v=')) {
            const originalSrc = img.src;
            img.src = originalSrc + (originalSrc.includes('?') ? '&' : '?') + 'v=' + version;
        }
    });
    
    // Очищаем localStorage от устаревших данных
    localStorage.removeItem('adminData');
    localStorage.removeItem('adminLastSaved');
    
    console.log('Кэш браузера очищен');
}

// Функция для проверки необходимости очистки кэша
function checkCacheVersion() {
    // Текущая версия кэша (обновляйте при внесении изменений)
    const currentVersion = '20250606';
    
    // Получаем сохраненную версию кэша
    const savedVersion = localStorage.getItem('cacheVersion');
    
    // Если версии не совпадают, очищаем кэш
    if (savedVersion !== currentVersion) {
        clearBrowserCache();
        localStorage.setItem('cacheVersion', currentVersion);
        console.log('Версия кэша обновлена до', currentVersion);
    }
}

// Запускаем проверку версии кэша при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    checkCacheVersion();
});

// Экспортируем функции для использования в других скриптах
window.clearBrowserCache = clearBrowserCache;
window.checkCacheVersion = checkCacheVersion;

