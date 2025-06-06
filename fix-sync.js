/**
 * Скрипт для исправления синхронизации между админ-панелью и основным сайтом
 * Добавьте этот скрипт в конец файла admin-panel-final.html перед закрывающим тегом </body>
 */

document.addEventListener('DOMContentLoaded', function() {
    // Функция для принудительного обновления data.json с правильными правами доступа
    function fixDataSync() {
        // Получаем текущие данные
        let currentData = {};
        try {
            currentData = JSON.parse(localStorage.getItem('siteData')) || {};
        } catch (e) {
            console.error('Ошибка при чтении данных из localStorage:', e);
            return;
        }
        
        // Добавляем временную метку для предотвращения кеширования
        const timestamp = new Date().getTime();
        
        // Сохраняем данные с принудительным обновлением
        fetch(`data.json?nocache=${timestamp}`, {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        })
        .then(response => response.json())
        .then(serverData => {
            // Объединяем данные, приоритет отдаем текущим данным из localStorage
            const mergedData = { ...serverData, ...currentData };
            
            // Сохраняем объединенные данные обратно в файл
            return fetch('save-data.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                },
                body: JSON.stringify({
                    data: mergedData,
                    timestamp: timestamp
                })
            });
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                console.log('Синхронизация данных успешно исправлена');
                alert('Синхронизация данных успешно исправлена. Обновите страницу основного сайта, чтобы увидеть изменения.');
            } else {
                console.error('Ошибка при синхронизации данных:', result.error);
                alert('Ошибка при синхронизации данных: ' + result.error);
            }
        })
        .catch(error => {
            console.error('Ошибка при синхронизации данных:', error);
            alert('Ошибка при синхронизации данных. Проверьте консоль для деталей.');
        });
    }
    
    // Добавляем кнопку для исправления синхронизации
    const fixSyncButton = document.createElement('button');
    fixSyncButton.textContent = 'Исправить синхронизацию с сайтом';
    fixSyncButton.className = 'btn btn-warning';
    fixSyncButton.style.position = 'fixed';
    fixSyncButton.style.bottom = '20px';
    fixSyncButton.style.right = '20px';
    fixSyncButton.style.zIndex = '9999';
    fixSyncButton.onclick = fixDataSync;
    
    document.body.appendChild(fixSyncButton);
    
    // Переопределяем функцию сохранения данных
    window.saveData = function(data) {
        // Сохраняем в localStorage
        localStorage.setItem('siteData', JSON.stringify(data));
        
        // Добавляем временную метку для предотвращения кеширования
        const timestamp = new Date().getTime();
        
        // Отправляем на сервер с принудительным обновлением
        return fetch('save-data.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            },
            body: JSON.stringify({
                data: data,
                timestamp: timestamp
            })
        })
        .then(response => response.json())
        .then(result => {
            if (!result.success) {
                console.error('Ошибка при сохранении данных:', result.error);
                throw new Error(result.error);
            }
            return result;
        });
    };
});
