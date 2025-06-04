// Интеграция функций экспорта с админ-панелью
document.addEventListener('DOMContentLoaded', function() {
    // Добавляем обработчики для кнопок экспорта
    const exportJsonBtn = document.getElementById('export-json');
    const exportArchiveBtn = document.getElementById('export-archive');
    
    if (exportJsonBtn) {
        exportJsonBtn.addEventListener('click', function() {
            // Получаем актуальные данные из полей формы
            gatherDataFromFields();
            
            // Экспортируем данные в JSON
            exportSiteDataToJson(siteData);
        });
    }
    
    if (exportArchiveBtn) {
        exportArchiveBtn.addEventListener('click', function() {
            // Получаем актуальные данные из полей формы
            gatherDataFromFields();
            
            // Инициируем процесс экспорта архива
            initExport();
        });
    }
    
    // Загружаем JSZip заранее
    loadJSZip().catch(error => {
        console.warn('Не удалось предварительно загрузить JSZip:', error);
    });
});
