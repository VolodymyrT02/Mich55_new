/**
 * Скрипт для синхронизации данных между data.json и translations.js
 * Этот файл должен быть подключен в admin-panel.html перед export-utils.js
 */

// Функция для загрузки данных из data.json и обновления translations.js
async function syncDataToTranslations() {
    try {
        // Загружаем данные из data.json
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`Ошибка загрузки data.json: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Загружаем текущие переводы
        const translationsScript = await fetch('assets/js/translations.js');
        if (!translationsScript.ok) {
            throw new Error(`Ошибка загрузки translations.js: ${translationsScript.status} ${translationsScript.statusText}`);
        }
        
        let translationsText = await translationsScript.text();
        
        // Обновляем цены квартир в украинской версии
        if (data.uk && data.uk.sections && data.uk.sections.apartments && data.uk.sections.apartments.items) {
            const apartments = data.uk.sections.apartments.items;
            
            // Квартира 1
            if (apartments[0] && apartments[0].details && apartments[0].details[3]) {
                const priceText = apartments[0].details[3]; // "Вартість: 1 050 000 $"
                translationsText = updateTranslationValue(translationsText, 'uk', 'apartments_apartment1_price', priceText);
            }
            
            // Квартира 2
            if (apartments[1] && apartments[1].details && apartments[1].details[3]) {
                const priceText = apartments[1].details[3]; // "Вартість: 1 150 000 $"
                translationsText = updateTranslationValue(translationsText, 'uk', 'apartments_apartment2_price', priceText);
            }
            
            // Квартира 3
            if (apartments[2] && apartments[2].details && apartments[2].details[3]) {
                const priceText = apartments[2].details[3]; // "Вартість: 950 000 $"
                translationsText = updateTranslationValue(translationsText, 'uk', 'apartments_apartment3_price', priceText);
            }
        }
        
        // Обновляем цены квартир в английской версии
        if (data.en && data.en.sections && data.en.sections.apartments && data.en.sections.apartments.items) {
            const apartments = data.en.sections.apartments.items;
            
            // Квартира 1
            if (apartments[0] && apartments[0].details && apartments[0].details[3]) {
                const priceText = apartments[0].details[3]; // "Price: $1,050,000"
                translationsText = updateTranslationValue(translationsText, 'en', 'apartments_apartment1_price', priceText);
            }
            
            // Квартира 2
            if (apartments[1] && apartments[1].details && apartments[1].details[3]) {
                const priceText = apartments[1].details[3]; // "Price: $1,150,000"
                translationsText = updateTranslationValue(translationsText, 'en', 'apartments_apartment2_price', priceText);
            }
            
            // Квартира 3
            if (apartments[2] && apartments[2].details && apartments[2].details[3]) {
                const priceText = apartments[2].details[3]; // "Price: $950,000"
                translationsText = updateTranslationValue(translationsText, 'en', 'apartments_apartment3_price', priceText);
            }
        }
        
        // Сохраняем обновленные переводы
        const saveResponse = await fetch('save-translations.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ translationsText })
        });
        
        if (!saveResponse.ok) {
            throw new Error(`Ошибка сохранения translations.js: ${saveResponse.status} ${saveResponse.statusText}`);
        }
        
        const result = await saveResponse.json();
        if (result.success) {
            console.log('Переводы успешно обновлены');
            return true;
        } else {
            throw new Error(result.error || 'Неизвестная ошибка при сохранении переводов');
        }
    } catch (error) {
        console.error('Ошибка синхронизации данных:', error);
        return false;
    }
}

// Функция для обновления значения перевода в тексте файла translations.js
function updateTranslationValue(text, lang, key, value) {
    // Регулярное выражение для поиска строки перевода
    const regex = new RegExp(`(${lang}:\\s*\\{[\\s\\S]*?${key}:\\s*")([^"]*)(")`, 'g');
    
    // Заменяем значение
    return text.replace(regex, `$1${value}$3`);
}

// Функция для обновления data.json из translations.js
async function syncTranslationsToData() {
    try {
        // Загружаем текущие переводы
        const translationsResponse = await fetch('assets/js/translations.js');
        if (!translationsResponse.ok) {
            throw new Error(`Ошибка загрузки translations.js: ${translationsResponse.status} ${translationsResponse.statusText}`);
        }
        
        const translationsText = await translationsResponse.text();
        
        // Извлекаем объект переводов из текста файла
        const translationsMatch = translationsText.match(/const\s+translations\s*=\s*(\{[\s\S]*?\}\s*);/);
        if (!translationsMatch || !translationsMatch[1]) {
            throw new Error('Не удалось извлечь объект переводов из файла translations.js');
        }
        
        // Преобразуем текст объекта в объект JavaScript
        const translations = eval(`(${translationsMatch[1]})`);
        
        // Загружаем текущие данные из data.json
        const dataResponse = await fetch('data.json');
        if (!dataResponse.ok) {
            throw new Error(`Ошибка загрузки data.json: ${dataResponse.status} ${dataResponse.statusText}`);
        }
        
        const data = await dataResponse.json();
        
        // Обновляем цены квартир в украинской версии
        if (data.uk && data.uk.sections && data.uk.sections.apartments && data.uk.sections.apartments.items) {
            const apartments = data.uk.sections.apartments.items;
            
            // Квартира 1
            if (apartments[0] && apartments[0].details && apartments[0].details[3] && translations.uk.apartments_apartment1_price) {
                apartments[0].details[3] = translations.uk.apartments_apartment1_price;
            }
            
            // Квартира 2
            if (apartments[1] && apartments[1].details && apartments[1].details[3] && translations.uk.apartments_apartment2_price) {
                apartments[1].details[3] = translations.uk.apartments_apartment2_price;
            }
            
            // Квартира 3
            if (apartments[2] && apartments[2].details && apartments[2].details[3] && translations.uk.apartments_apartment3_price) {
                apartments[2].details[3] = translations.uk.apartments_apartment3_price;
            }
        }
        
        // Обновляем цены квартир в английской версии
        if (data.en && data.en.sections && data.en.sections.apartments && data.en.sections.apartments.items) {
            const apartments = data.en.sections.apartments.items;
            
            // Квартира 1
            if (apartments[0] && apartments[0].details && apartments[0].details[3] && translations.en.apartments_apartment1_price) {
                apartments[0].details[3] = translations.en.apartments_apartment1_price;
            }
            
            // Квартира 2
            if (apartments[1] && apartments[1].details && apartments[1].details[3] && translations.en.apartments_apartment2_price) {
                apartments[1].details[3] = translations.en.apartments_apartment2_price;
            }
            
            // Квартира 3
            if (apartments[2] && apartments[2].details && apartments[2].details[3] && translations.en.apartments_apartment3_price) {
                apartments[2].details[3] = translations.en.apartments_apartment3_price;
            }
        }
        
        // Сохраняем обновленные данные
        const saveResponse = await fetch('save-data.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data })
        });
        
        if (!saveResponse.ok) {
            throw new Error(`Ошибка сохранения data.json: ${saveResponse.status} ${saveResponse.statusText}`);
        }
        
        const result = await saveResponse.json();
        if (result.success) {
            console.log('Данные успешно обновлены');
            return true;
        } else {
            throw new Error(result.error || 'Неизвестная ошибка при сохранении данных');
        }
    } catch (error) {
        console.error('Ошибка синхронизации переводов:', error);
        return false;
    }
}

// Функция для сохранения данных в data.json
async function saveDataJson(data) {
    try {
        const response = await fetch('save-data.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data })
        });
        
        if (!response.ok) {
            throw new Error(`Ошибка сохранения data.json: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        if (result.success) {
            console.log('Данные успешно сохранены');
            
            // После сохранения данных синхронизируем их с переводами
            await syncDataToTranslations();
            
            return true;
        } else {
            throw new Error(result.error || 'Неизвестная ошибка при сохранении данных');
        }
    } catch (error) {
        console.error('Ошибка сохранения данных:', error);
        return false;
    }
}

// Экспортируем функции для использования в других скриптах
window.syncDataToTranslations = syncDataToTranslations;
window.syncTranslationsToData = syncTranslationsToData;
window.saveDataJson = saveDataJson;

