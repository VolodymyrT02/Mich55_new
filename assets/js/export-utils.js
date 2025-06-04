/**
 * Утилиты для экспорта сайта
 * Этот файл содержит функции для экспорта данных сайта и создания архива
 */

// Функция для экспорта данных в JSON
function exportSiteDataToJson(siteData) {
    try {
        const jsonString = JSON.stringify(siteData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log('JSON файл успешно экспортирован');
        return true;
    } catch (error) {
        console.error('Ошибка при экспорте JSON:', error);
        alert('Произошла ошибка при экспорте JSON. Проверьте консоль для деталей.');
        return false;
    }
}

// Функция для создания архива сайта с использованием JSZip
async function createSiteArchive(siteData) {
    try {
        // Проверяем, загружена ли библиотека JSZip
        if (typeof JSZip === 'undefined') {
            await loadJSZip();
        }
        
        const zip = new JSZip();
        
        // Добавляем data.json
        const jsonString = JSON.stringify(siteData, null, 2);
        zip.file('data.json', jsonString);
        
        // Добавляем HTML файлы
        await addFileToZip(zip, 'index.html');
        await addFileToZip(zip, 'admin-panel-final.html', 'admin-panel.html'); // Переименовываем при экспорте
        
        // Создаем структуру директорий
        const assetsFolder = zip.folder('assets');
        const cssFolder = assetsFolder.folder('css');
        const jsFolder = assetsFolder.folder('js');
        const imagesFolder = assetsFolder.folder('images');
        const videosFolder = assetsFolder.folder('videos');
        
        // Добавляем CSS файлы
        await addFileToZip(zip, 'assets/css/style.css');
        await addFileToZip(zip, 'assets/css/admin-restructured.css', 'assets/css/admin.css');
        
        // Добавляем JS файлы
        await addFileToZip(zip, 'assets/js/main.js');
        await addFileToZip(zip, 'assets/js/translations.js');
        await addFileToZip(zip, 'assets/js/admin-final.js', 'assets/js/admin.js');
        await addFileToZip(zip, 'assets/js/export-utils.js');
        
        // Добавляем изображения и видео
        await addDirectoryToZip(zip, 'assets/images');
        await addDirectoryToZip(zip, 'assets/videos');
        
        // Генерируем архив
        const content = await zip.generateAsync({
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: { level: 9 }
        }, updateProgress);
        
        // Скачиваем архив
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'michurina55_site.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('Архив сайта успешно создан и скачан');
        return true;
    } catch (error) {
        console.error('Ошибка при создании архива:', error);
        alert('Произошла ошибка при создании архива. Проверьте консоль для деталей.');
        return false;
    }
}

// Функция для загрузки JSZip, если она еще не загружена
async function loadJSZip() {
    return new Promise((resolve, reject) => {
        if (typeof JSZip !== 'undefined') {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
        script.integrity = 'sha512-XMVd28F1oH/O71fzwBnV7HucLxVwtxf26XV8P4wPk26EDxuGZ91N8bsOttmnomcCD3CS5ZMRL50H0GgOHvegtg==';
        script.crossOrigin = 'anonymous';
        script.onload = resolve;
        script.onerror = () => reject(new Error('Не удалось загрузить JSZip'));
        document.head.appendChild(script);
    });
}

// Функция для добавления файла в архив
async function addFileToZip(zip, filePath, newPath = null) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Ошибка загрузки файла ${filePath}: ${response.status} ${response.statusText}`);
        }
        
        const content = await response.blob();
        zip.file(newPath || filePath, content);
        console.log(`Файл ${filePath} добавлен в архив`);
    } catch (error) {
        console.warn(`Не удалось добавить файл ${filePath} в архив:`, error);
    }
}

// Функция для рекурсивного добавления директории в архив
async function addDirectoryToZip(zip, dirPath) {
    try {
        // В реальном приложении здесь был бы запрос к серверу для получения списка файлов
        // В нашем случае мы используем предопределенный список файлов
        const fileList = await getFileList(dirPath);
        
        for (const file of fileList) {
            await addFileToZip(zip, `${dirPath}/${file}`);
        }
        
        console.log(`Директория ${dirPath} добавлена в архив`);
    } catch (error) {
        console.warn(`Не удалось добавить директорию ${dirPath} в архив:`, error);
    }
}

// Функция для получения списка файлов в директории
// В реальном приложении это был бы запрос к серверу
async function getFileList(dirPath) {
    // Имитация получения списка файлов
    // В реальном приложении здесь был бы запрос к серверу
    switch (dirPath) {
        case 'assets/images':
            return [
                'facade/Michurina1.JPEG',
                'facade/Michurina2.JPEG',
                'facade/Michurina3.JPEG',
                'lobby/1.JPEG',
                'lobby/3.JPEG',
                'lobby/4.JPEG',
                'lobby/5.JPEG',
                'lobby/6.JPEG',
                'lobby/7.JPEG',
                'lobby/8.JPEG',
                'lobby/9.JPEG',
                'elevator/10.JPEG',
                'elevator/11.JPEG',
                'elevator/12.JPEG',
                'plans/apartment1.jpg',
                'plans/apartment2.jpg',
                'plans/apartment3.jpg',
                'plans/apartment3_terrace.jpg',
                'hero-bg.webp',
                'logo.svg'
            ];
        case 'assets/videos':
            return ['video1.mp4'];
        default:
            return [];
    }
}

// Функция для обновления прогресса создания архива
function updateProgress(metadata) {
    const progressElement = document.getElementById('export-progress');
    if (progressElement) {
        const percent = Math.floor(metadata.percent);
        progressElement.style.width = `${percent}%`;
        progressElement.textContent = `${percent}%`;
    }
}

// Функция для инициализации экспорта
async function initExport() {
    // Создаем модальное окно для отображения прогресса
    const modal = document.createElement('div');
    modal.className = 'export-modal';
    modal.innerHTML = `
        <div class="export-modal-content">
            <h3>Экспорт сайта</h3>
            <p>Создание архива сайта. Пожалуйста, подождите...</p>
            <div class="export-progress-container">
                <div id="export-progress" class="export-progress">0%</div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Добавляем стили для модального окна
    const style = document.createElement('style');
    style.textContent = `
        .export-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }
        
        .export-modal-content {
            background-color: white;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
            width: 400px;
            max-width: 90%;
        }
        
        .export-progress-container {
            width: 100%;
            background-color: #f0f0f0;
            border-radius: 4px;
            margin-top: 20px;
            overflow: hidden;
        }
        
        .export-progress {
            height: 20px;
            background-color: #1a2456;
            color: white;
            text-align: center;
            line-height: 20px;
            transition: width 0.3s;
            width: 0%;
        }
    `;
    document.head.appendChild(style);
    
    try {
        // Получаем данные сайта
        const siteData = JSON.parse(localStorage.getItem('autosavedSiteData')) || await fetchSiteData();
        
        // Создаем архив
        const success = await createSiteArchive(siteData);
        
        // Закрываем модальное окно
        document.body.removeChild(modal);
        
        if (success) {
            alert('Архив сайта успешно создан и скачан.');
        }
    } catch (error) {
        console.error('Ошибка при экспорте сайта:', error);
        alert('Произошла ошибка при экспорте сайта. Проверьте консоль для деталей.');
        document.body.removeChild(modal);
    }
}

// Функция для получения данных сайта из data.json
async function fetchSiteData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`Ошибка загрузки data.json: ${response.status} ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Ошибка при загрузке data.json:', error);
        alert('Не удалось загрузить данные сайта. Будет создан пустой шаблон.');
        return { uk: {}, en: {} };
    }
}
