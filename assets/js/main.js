// Main JavaScript for the landing page

// Google Map initialization - moved to global scope
window.initMap = function() {
    const mapDiv = document.getElementById('map');
    console.log('Map initialization attempt.');
    console.log('window.settings:', window.settings);
    console.log('map_latitude:', window.settings.map_latitude, 'Type:', typeof window.settings.map_latitude);
    console.log('map_longitude:', window.settings.map_longitude, 'Type:', typeof window.settings.map_longitude);

    if (mapDiv && typeof google !== 'undefined' && window.settings && window.settings.map_latitude && window.settings.map_longitude) {
        const lat = parseFloat(window.settings.map_latitude);
        const lng = parseFloat(window.settings.map_longitude);

        if (isNaN(lat) || isNaN(lng)) {
            console.error('Invalid map coordinates: Latitude or Longitude is not a number.', window.settings.map_latitude, window.settings.map_longitude);
            return;
        }

        const map = new google.maps.Map(mapDiv, {
            center: { lat: lat, lng: lng },
            zoom: 15
        });
        new google.maps.Marker({
            position: { lat: lat, lng: lng },
            map: map,
            title: 'Наш адрес'
        });
    } else {
        console.log('MapDiv not found, Google API not loaded, or settings missing for map init.');
    }
};

// Function to check if Google Maps API is loaded and initialize the map
function checkAndInitMap() {
    if (typeof google !== 'undefined' && google.maps && window.settings && window.settings.map_latitude && window.settings.map_longitude) {
        console.log('Initializing Google Map...');
        window.initMap();
    } else {
        console.log('Google Maps API not yet loaded or settings missing. Retrying in 100ms...');
        setTimeout(checkAndInitMap, 100);
    }
}

// Declare translations, apartmentsData, mediaData, and currentLang as global window properties
// This ensures they are accessible everywhere, especially for initMap and language switching
window.translations = {};
window.apartmentsData = [];
window.mediaData = [];
window.settings = {}; // Already done, but reiterating for clarity

// Initialize currentLang globally
window.currentLang = localStorage.getItem('lang') || 'uk'; // Use stored language or default to Ukrainian
// NEW: persist default if nothing was stored so that further page loads keep Ukrainian
if (!localStorage.getItem('lang')) {
    localStorage.setItem('lang', 'uk');
}

document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOMContentLoaded event fired.');
    console.log('Initial window.currentLang (before fetch):', window.currentLang);

    // Force clear localStorage language setting to ensure Ukrainian is default
    // localStorage.removeItem('lang'); // Removed for now, can be added back if needed for initial language
    
    // No need to declare translations, apartmentsData, mediaData, settings, or currentLang again here as they are now window properties
    // let translations = {}; // Define translations globally (REMOVED)
    // let apartmentsData = []; // Define apartmentsData globally (REMOVED)
    // let mediaData = []; // Define mediaData globally (REMOVED)
    // window.settings = {}; // Define settings globally on window object (REMOVED)

    // No need to declare currentLang again here (REMOVED)
    // let currentLang;

    // Function to set language for static elements (with data-i18n attribute)
    function setStaticContentLanguage(lang) {
        console.log('setStaticContentLanguage called with lang:', lang);
        console.log('window.currentLang in setStaticContentLanguage:', window.currentLang);
        console.log('window.translations for currentLang (' + lang + '):', window.translations[lang]);
        document.documentElement.lang = lang;
        
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            // Use window.translations
            let translationValue = window.translations[lang]?.[key];
            if (!translationValue) {
                // fallback to Ukrainian if missing
                translationValue = window.translations['uk']?.[key];
            }
            if (translationValue) {
                console.log(`Translating key: ${key} for lang: ${lang} - value: ${translationValue}`);
                if (key === 'building_slogan') {
                    const slogan = translationValue;
                    element.innerHTML = slogan.replace(/\n/g, '<br>');
                } else {
                    if (element.tagName === 'A' && element.hasAttribute('href')) {
                        const href = element.getAttribute('href');
                        element.textContent = translationValue;
                        element.setAttribute('href', href);
                    } else {
                        element.textContent = translationValue;
                    }
                }
            } else {
                console.warn(`Translation missing for key: ${key} in language: ${lang}`);
            }
        });
    }

    // Function to update dynamically created content's language
    function updateDynamicContentTranslations(lang) {
        console.log('updateDynamicContentTranslations called with lang:', lang);
        console.log('window.currentLang in updateDynamicContentTranslations:', window.currentLang);
        // Update dynamically created apartment details with current language
        const apartmentDetails = document.querySelectorAll('.apartment-details');
        apartmentDetails.forEach(detailDiv => {
            const apartmentId = detailDiv.getAttribute('data-apartment-id');
            // Use window.apartmentsData
            const apartment = window.apartmentsData.find(a => String(a.id) === apartmentId);
            if (apartment) {
                const newName = lang === 'uk' ? (apartment.name_uk || apartment.name) : (apartment.name_en || apartment.name_uk || apartment.name);
                detailDiv.querySelector('h3').textContent = newName;

                const newStatus = lang === 'uk' ? (apartment.status_uk || apartment.status) : (apartment.status_en || apartment.status_uk || apartment.status);
                detailDiv.querySelector('p').textContent = newStatus;

                const ul = detailDiv.querySelector('ul');
                if (ul) {
                    // Use window.translations
                    ul.innerHTML = `
                        <li>${window.currentLang === 'uk' ? apartment.legal_area_uk : apartment.legal_area_en || apartment.legal_area_uk}</li>
                        <li>${window.currentLang === 'uk' ? apartment.actual_area_uk : apartment.actual_area_en || apartment.actual_area_uk}</li>
                        <li>${window.currentLang === 'uk' ? apartment.view_uk : apartment.view_en || apartment.view_uk}</li>
                        <li>${window.currentLang === 'uk' ? apartment.price_uk : apartment.price_en || apartment.price_uk}</li>
                        <li>${window.currentLang === 'uk' ? apartment.included_uk : apartment.included_en || apartment.included_uk}</li>
                    `;
                }
            }
        });

        // Update contact info from settings/translations
        const contactAddress = document.querySelector('[data-i18n="contact_address"]');
        if (contactAddress) {
            contactAddress.textContent = window.translations[lang]?.contact_address || window.translations.uk.contact_address;
        }

        const contactPhone1 = document.querySelector('[data-i18n="contact_phone_1"]');
        if (contactPhone1) {
            contactPhone1.textContent = window.translations[lang]?.contact_phone_1 || window.translations.uk.contact_phone_1;
            contactPhone1.href = `tel:${window.translations[lang]?.contact_phone_1.replace(/\D/g, '') || window.translations.uk.contact_phone_1.replace(/\D/g, '')}`;
        }

        const contactPhone2 = document.querySelector('[data-i18n="contact_phone_2"]');
        if (contactPhone2) {
            contactPhone2.textContent = window.translations[lang]?.contact_phone_2 || window.translations.uk.contact_phone_2;
            contactPhone2.href = `tel:${window.translations[lang]?.contact_phone_2.replace(/\D/g, '') || window.translations.uk.contact_phone_2.replace(/\D/g, '')}`;
        }

        const contactEmail = document.querySelector('[data-i18n="contact_email"]');
        if (contactEmail) {
            contactEmail.textContent = window.translations[lang]?.contact_email || window.translations.uk.contact_email;
            contactEmail.href = `mailto:${window.translations[lang]?.contact_email || window.translations.uk.contact_email}`;
        }

        const contactTelegram = document.querySelector('[data-i18n="contact_telegram_bot"]');
        if (contactTelegram) {
            const tgText = window.translations[lang]?.contact_telegram_bot || window.translations.uk.contact_telegram_bot;
            contactTelegram.textContent = tgText;
            // Ensure parent anchor has correct href
            const parentAnchor = contactTelegram.closest('a') || contactTelegram;
            if (parentAnchor && parentAnchor.tagName === 'A') {
                parentAnchor.href = 'https://t.me/IDGroup_Kyiv_bot';
            }
        }

        // Update apartment tab names
        document.querySelectorAll('.apartment-tab').forEach(btn => {
            const id = btn.getAttribute('data-apartment-id');
            const apt = window.apartmentsData.find(a => String(a.id) === id);
            if (apt) {
                const newName = lang === 'uk' ? (apt.name_uk || apt.name) : (apt.name_en || apt.name_uk || apt.name);
                btn.textContent = newName;
            }
        });
    }

    try {
        const response = await fetch('assets/data/content_static.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched data:', data);

        window.translations = data.translations || {};
        window.apartmentsData = data.apartments; // Assign fetched apartments to window
        window.mediaData = data.media; // Assign fetched media to window
        window.settings = data.settings; // Assign fetched settings to window

        console.log('Window translations after fetch:', window.translations);
        console.log('Window settings after fetch:', window.settings);

        // Determine initial language - already initialized globally
        // const storedLang = localStorage.getItem('lang');
        // window.currentLang = storedLang || 'uk'; // Use stored language or default to Ukrainian

        // Set initial language for static content
        setStaticContentLanguage(window.currentLang);
        console.log('Initial static content language set to:', window.currentLang);

        // Set initial language button text
        const langSwitch = document.getElementById('lang-switch');
        if (langSwitch) {
            // NEW: data-lang should contain TARGET language (opposite of current)
            const targetLangOnInit = window.currentLang === 'uk' ? 'en' : 'uk';
            langSwitch.setAttribute('data-lang', targetLangOnInit);
            langSwitch.textContent = targetLangOnInit === 'en' ? 'ENG' : 'UKR';
        }

        // Google Map на странице заменён на iframe; инициализация JS-карты не требуется.

        // --- fallback English translations for missing keys ---
        const fallbackEnTranslations = {
            about_text_main_1: "6 private residences on the Pechersk Hills — an intimate collection of homes where the uniqueness of the panorama blends with inner peace. A space where every window is a living canvas showcasing views of the Kyiv-Pechersk Lavra, church domes, and the lush greenery of the Botanical Garden.",
            about_text_main_2: "This location is not for everyone. Only for those who are used to living on their own terms, value silence behind closed doors, and know how to see meaning in details. Here, the past flows into the present: the historic spirit of the area enters into dialogue with impeccable comfort and privacy.",
            about_text_main_3: "Each apartment comes with a complete set of ownership documents. A home that belongs only to you. No compromises. No noise. No unwanted eyes.",

            technology_title: "TECHNOLOGIES",
            technology_subtitle: "Premium engineering designed for independence",
            tech_section_1_title: "Individual heat pumps",
            tech_section_1_text: "Autonomy for each residence. Energy-efficient heating, cooling, ventilation, and hot water — completely independent of centralised systems.",
            tech_section_2_title: "Centralised Ecosoft system",
            tech_section_2_text: "Premium-level filtration and water treatment — guaranteed drinking water quality from every tap.",
            tech_section_3_title: "Intelligent dispatching",
            tech_section_3_text: "Control all systems in real time — from a single panel or directly from your smartphone.",
            tech_section_4_title: "Schindler lift",
            tech_section_4_text: "Smooth operation and direct access to the underground car park — uncompromising comfort.",
            materials_title: "Materials and construction",
            materials_section_1_title: "Monolithic structure",
            materials_section_1_text: "Load-bearing elements made of reinforced concrete — strength, durability, reliability.",
            materials_section_2_title: "Intercolumn walls with Porotherm",
            materials_section_2_text: "Porotherm ceramic bricks by Wienerberger — natural thermal insulation, eco-friendliness, and silence.",
            materials_section_3_title: "Façade — large-format porcelain stoneware",
            materials_section_3_text: "Ventilated system with basalt insulation and aluminium cladding — a balance of aesthetics and efficiency.",
            materials_section_4_title: "Windows SCHÜCO AWS 75Si+",
            materials_section_4_text: "Aluminium profile with 50 mm SunGuard double-glazed units — maximum daylight, minimal heat loss.",

            apartments_legal_area: "Legal area:",
            apartments_actual_area: "Actual:",
            apartments_view: "View:",
            apartments_price: "Price:",
            apartments_included: "Included:",

            // Newly added keys to avoid mixed languages
            nav_home: "Home",
            nav_about: "About",
            nav_apartments: "Apartments",
            nav_location: "Location",
            nav_contacts: "Contacts",
            building_name: "BOUTIQUE APARTMENTS KYIV",
            building_slogan: "Your view, your inspiration",
            building_address: "Lomakivska / Michurina St., 55, Pechersk District, Kyiv",
            building_status: "Commissioned February 2025",
            lobby_title: "Lobby",
            video_title: "Video",
            tech_divider: "⸻",
            apartments_title: "Apartments",
            location_title: "Location",
            location_address: "Lomakivska / Michurina St., 55, Pechersk District, Kyiv",
            contacts_title: "Contacts",
            contact_phone_main: "+38 (044) 390 79 79",
            contact_telegram_bot: "Telegram bot: IDGroup Kyiv",
            contact_phone_alt: "+380 (93) 434 70 42",
            footer_made_by: "Made by",
            no_apartments_available: "No apartments available at the moment."
        };

        // merge fallbacks into English translation set
        if (!window.translations.en) {
            window.translations.en = {};
        }
        window.translations.en = Object.assign({}, fallbackEnTranslations, window.translations.en);

        // Fallbacks for Ukrainian for new contact keys (in case API lacks them)
        const fallbackUkTranslations = {
            contact_phone_main: "+38 (044) 390 79 79",
            contact_telegram_bot: "Телеграм-бот: IDGroup Kyiv",
            contact_phone_alt: "+380 (93) 434 70 42",

            nav_home: "Головна",
            nav_about: "Про комплекс",
            nav_apartments: "Квартири",
            nav_location: "Розташування",
            nav_contacts: "Контакти",
            building_name: "BOUTIQUE APARTMENTS KYIV",
            building_slogan: "Ваш краєвид, ваше натхнення",
            building_address: "вулиця Ломаківська / Мічуріна, 55, Печерський район, м. Київ",
            building_status: "Здано в експлуатацію лютий 2025р.",
            about_text_main_1: "6 приватних резиденцій на Печерських схилах — камерна колекція житла, де унікальність панорами поєднується з внутрішнім спокоєм. Простір, де кожне вікно — це живе полотно з видами на Києво-Печерську Лавру, куполи храмів та столичну зелень Ботанічного саду.",
            about_text_main_2: "Це локація не для всіх. Лише для тих, хто звик жити на своїх умовах, цінує тишу за закритими дверима і вміє бачити суть у деталях. Тут минуле перетікає в сучасність: історичний настрій району — у діалозі з бездоганним рівнем комфорту та приватності.",
            about_text_main_3: "Кожен апартамент — з повним пакетом документів на право власності. Житло, що належить лише вам. Без компромісів. Без шуму. Без зайвих очей.",
            lobby_title: "Лобі",
            video_title: "Відео",
            technology_title: "ТЕХНОЛОГІЇ",
            technology_subtitle: "Преміум-інженерія, створена для незалежності",
            tech_section_1_title: "Індивідуальні теплові насоси",
            tech_section_1_text: "Автономність кожної резиденції. Енергоефективне опалення, охолодження, вентиляція та гаряча вода — незалежно від центральних систем.",
            tech_section_2_title: "Централізована система Ecosoft",
            tech_section_2_text: "Фільтрація та водопідготовка преміум-рівня — гарантована якість питної води у кожному крані.",
            tech_section_3_title: "Інтелектуальна диспетчеризація",
            tech_section_3_text: "Керуйте всіма системами в реальному часі — з однієї панелі або зі смартфона.",
            tech_section_4_title: "Ліфт Schindler",
            tech_section_4_text: "Плавний хід і прямий доступ до підземного паркінгу — комфорт без компромісів.",
            tech_divider: "⸻",
            materials_title: "Матеріали та конструктив",
            materials_section_1_title: "Монолітна конструкція",
            materials_section_1_text: "Несучі елементи з армованого залізобетону — міцність, довговічність, надійність.",
            materials_section_2_title: "Міжколонні стіни з Porotherm",
            materials_section_2_text: "Керамічна цегла Porotherm Wienerberger — природна термоізоляція, екологічність, тиша.",
            materials_section_3_title: "Фасад — великоформатний керамограніт",
            materials_section_3_text: "Вентильована система з базальтовим утепленням та алюмінієвим кашуванням — баланс естетики та ефективності.",
            materials_section_4_title: "Вікна SCHÜCO AWS 75Si+",
            materials_section_4_text: "Алюмінієвий профіль, двокамерний склопакет 50 мм SunGuard — максимум світла, мінімум тепловтрат.",
            apartments_title: "Квартири",
            location_title: "Розташування",
            contacts_title: "Контакти",
            footer_made_by: "Made by",
            no_apartments_available: "На даний момент квартири відсутні."
        };
        if (!window.translations.uk) {
            window.translations.uk = {};
        }
        window.translations.uk = Object.assign({}, fallbackUkTranslations, window.translations.uk);

        // Ensure English names and statuses exist to avoid Ukrainian fallbacks
        window.apartmentsData.forEach(apartment => {
            if (!apartment.name_en) {
                apartment.name_en = generateEnglishName(apartment.name_uk || apartment.name);
            }
            if (!apartment.status_en && apartment.status_uk) {
                apartment.status_en = translateStatus(apartment.status_uk);
            }
        });

    } catch (error) {
        console.error('Error fetching content:', error);
        // Fallback to static data or display error message
    }
    
    // Add version parameter to force cache refresh
    const version = new Date().getTime();
    document.querySelectorAll('script').forEach(script => {
        if (script.src && !script.src.includes('?v=')) {
            script.src = script.src + '?v=' + version;
        }
    });
    
    // Language switcher
    const langSwitch = document.getElementById('lang-switch');
    if (langSwitch) {
    langSwitch.addEventListener('click', function() {
            console.log('Language switch button clicked. Current window.currentLang:', window.currentLang);
            // Corrected logic for language switching
            const newLang = this.getAttribute('data-lang');
            const targetLang = newLang === 'en' ? 'uk' : 'en';
            this.setAttribute('data-lang', targetLang);
            this.textContent = targetLang === 'en' ? 'UKR' : 'ENG';

            window.currentLang = targetLang; // Update global currentLang
            localStorage.setItem('lang', window.currentLang); // Store the new language

            setStaticContentLanguage(window.currentLang); // Update static content
            updateDynamicContentTranslations(window.currentLang); // Update dynamic content

            console.log('Language switched to:', window.currentLang);
        });
    }
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle && nav) {
    menuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!nav.contains(event.target) && !menuToggle.contains(event.target) && nav.classList.contains('active')) {
            nav.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            }
        });
    });
    
    // Hero slider - populate dynamically from API
    const heroSlider = document.querySelector('.hero-slider');
    const facadeImages = window.mediaData.filter(m => m.section === 'hero_slider').map(m => m.path); // Filter for facade images
    console.log('Facade Images:', facadeImages);
    
    if (heroSlider) {
    heroSlider.innerHTML = ''; // Clear existing content
    facadeImages.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `Facade ${index + 1}`;
        img.className = index === 0 ? 'active' : '';
            img.setAttribute('data-lightbox', 'facade-gallery'); // Add lightbox attribute
            img.setAttribute('data-title', `Фасад ${index + 1}`); // Add title for lightbox
        heroSlider.appendChild(img);
    });
        // Re-initialize Lightbox after images are added
        if (window.lightbox && typeof window.lightbox.reinitializeLightbox === 'function') {
            window.lightbox.reinitializeLightbox();
        }
    }
    
    // Lobby gallery - populate dynamically from API
    const lobbyGallery = document.querySelector('.lobby-gallery');
    const lobbyImages = window.mediaData
        .filter(m => m.section === 'lobby_gallery' || m.section === 'lobby')
        .map(m => m.path);
    console.log('Lobby Images:', lobbyImages);

    if (lobbyGallery) {
    lobbyGallery.innerHTML = ''; // Clear existing content
    lobbyImages.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `Lobby ${index + 1}`;
            img.setAttribute('data-lightbox', 'lobby-gallery'); // Add lightbox attribute
            img.setAttribute('data-title', `Лобі ${index + 1}`); // Add title for lightbox
        lobbyGallery.appendChild(img);
    });
        // Re-initialize Lightbox after images are added
        if (window.lightbox && typeof window.lightbox.reinitializeLightbox === 'function') {
            window.lightbox.reinitializeLightbox();
        }
    }

    // Apartments section - populate dynamically from API
    const apartmentTabs = document.querySelector('.apartment-tabs');
    const apartmentContent = document.querySelector('.apartment-content');
    console.log('Apartments Data:', window.apartmentsData);
    console.log('Media Data (for apartments):', window.mediaData);

    if (apartmentTabs && apartmentContent) {
        apartmentTabs.innerHTML = '';
        apartmentContent.innerHTML = '';

        if (window.apartmentsData.length > 0) {
            // Create tabs
            window.apartmentsData.forEach((apartment, index) => {
                const button = document.createElement('button');
                const aptName = window.currentLang === 'uk' ? (apartment.name_uk || apartment.name) : (apartment.name_en || apartment.name_uk || apartment.name);
                button.textContent = aptName;
                button.classList.add('apartment-tab');
                button.classList.add('tab-btn');
                if (index === 0) {
                    button.classList.add('active');
                }
                button.setAttribute('data-apartment-id', apartment.id);
                apartmentTabs.appendChild(button);
            });

            // Create content for each apartment
            window.apartmentsData.forEach((apartment, index) => {
                // Определяем название резиденции в зависимости от текущего языка
                const aptName = window.currentLang === 'uk' ? (apartment.name_uk || apartment.name) : (apartment.name_en || apartment.name_uk || apartment.name);

                const apartmentDiv = document.createElement('div');
                apartmentDiv.classList.add('apartment-details');
                if (index === 0) {
                    apartmentDiv.classList.add('active');
                }
                apartmentDiv.setAttribute('data-apartment-id', apartment.id);

                // Select media related to this apartment
                const aptIdStr = String(apartment.id);
                const planRegex = new RegExp(`apartment[\\-_]?${aptIdStr}(?!\\d)`, 'i');
                let apartmentMedia = window.mediaData.filter(m => {
                    // Explicit link via apartment_id
                    if (m.apartment_id && String(m.apartment_id) === aptIdStr) return true;
                    // Section tag – допускаем как "apartments", так и "apartment_media" (куда фактически загружаются планы)
                    if (m.section && ['apartments','apartment_media'].includes(m.section.toLowerCase()) && planRegex.test((m.filename||'') + ' ' + (m.path||''))) {
                        return true;
                    }
                    // Filename / path pattern fallback
                    if (planRegex.test(m.filename || '') || planRegex.test(m.path || '')) return true;
                    return false;
                });

                // Ensure plan images are first (sort plans before others)
                apartmentMedia.sort((a,b)=>{
                    const aIsPlan = planRegex.test((a.filename||'') + (a.path||''));
                    const bIsPlan = planRegex.test((b.filename||'') + (b.path||''));
                    return aIsPlan === bIsPlan ? 0 : aIsPlan ? -1 : 1;
                });

                // Определяем нужны ли «общие» фото лифтового холла.
                // Логика: если, кроме планов, у квартиры уже есть ≥1 собственное фото, внешние холлы НЕ добавляем, чтобы не было дублирования.
                const nonPlanCount = apartmentMedia.filter(m => !planRegex.test((m.filename || '') + (m.path || ''))).length;

                let combinedMedia = [...apartmentMedia];

                if (nonPlanCount === 0) {
                    // Добавляем холлы как fallback, чтобы не оставлять только план.
                    if (!window.cachedElevatorImages) {
                        window.cachedElevatorImages = window.mediaData.filter(img => {
                            const sec = (img.section || '').toLowerCase();
                            const fname = (img.filename || '').toLowerCase();
                            const numericHall = /(?:^|[^\d])(1[0-2])\.(jpe?g|png|webp)$/i; // 10,11,12
                            return sec.includes('elevator') || sec.includes('lift') || sec.includes('hall') || fname.includes('elevator') || fname.includes('lift') || fname.includes('hall') || numericHall.test(fname);
                        }).slice(0, 3);
                    }
                    combinedMedia = [...combinedMedia, ...window.cachedElevatorImages];
                }

                console.log(`Apartment ${apartment.id} Media (with elevator halls):`, combinedMedia);

                let imagesHtml = '';
                if (combinedMedia.length > 0) {
                    imagesHtml = `<div class="apartment-images">
`;
                    combinedMedia.forEach((mediaItem, imgIndex) => {
                        imagesHtml += `
                            <img src="${mediaItem.path}" alt="${aptName} Image ${imgIndex + 1}" />
`;
                    });
                    imagesHtml += `</div>`;
                }

                apartmentDiv.innerHTML = `
                    ${imagesHtml}
                    <div class="apartment-info">
                        <h3>${aptName}</h3>
                        <p>${window.currentLang === 'uk' ? (apartment.status_uk || apartment.status) : (apartment.status_en || apartment.status_uk || apartment.status)}</p>
                        <ul>
                            <li>${window.currentLang === 'uk' ? apartment.legal_area_uk : apartment.legal_area_en || apartment.legal_area_uk}</li>
                            <li>${window.currentLang === 'uk' ? apartment.actual_area_uk : apartment.actual_area_en || apartment.actual_area_uk}</li>
                            <li>${window.currentLang === 'uk' ? apartment.view_uk : apartment.view_en || apartment.view_uk}</li>
                            <li>${window.currentLang === 'uk' ? apartment.price_uk : apartment.price_en || apartment.price_uk}</li>
                            <li>${window.currentLang === 'uk' ? apartment.included_uk : apartment.included_en || apartment.included_uk}</li>
                        </ul>
                    </div>
                `;
                apartmentContent.appendChild(apartmentDiv);
            });

            // Tab switching logic
            document.querySelectorAll('.apartment-tab').forEach(button => {
                button.addEventListener('click', function() {
                    document.querySelectorAll('.apartment-tab').forEach(btn => btn.classList.remove('active'));
                    document.querySelectorAll('.apartment-details').forEach(div => div.classList.remove('active'));

                    this.classList.add('active');
                    const targetId = this.getAttribute('data-apartment-id');
                    document.querySelector(`.apartment-details[data-apartment-id="${targetId}"]`).classList.add('active');
                    // Re-initialize Lightbox after tab switch (if new images are loaded)
                    if (window.lightbox && typeof window.lightbox.reinitializeLightbox === 'function') {
                        window.lightbox.reinitializeLightbox();
                    }
                });
            });

            // Re-initialize Lightbox for apartment images after initial load
            if (window.lightbox && typeof window.lightbox.reinitializeLightbox === 'function') {
                window.lightbox.reinitializeLightbox();
            }
        } else {
            console.log('No apartment data available.');
            apartmentContent.innerHTML = '<p data-i18n="no_apartments_available">На даний момент квартири відсутні.</p>';
            setStaticContentLanguage(window.currentLang); // Ensure fallback text is translated
        }
    }

    // Fullscreen video toggle
    const video = document.getElementById('main-video');
    const fullscreenBtn = document.getElementById('fullscreen-btn');

    if (video && fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.mozRequestFullScreen) { /* Firefox */
                video.mozRequestFullScreen();
            } else if (video.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                video.webkitRequestFullscreen();
            } else if (video.msRequestFullscreen) { /* IE/Edge */
                video.msRequestFullscreen();
            }
        });
    }

    // After dynamic sections are populated ensure dynamic translations are applied for the initial language
    updateDynamicContentTranslations(window.currentLang);
});

// Helper to generate English name from Ukrainian if missing
function generateEnglishName(ukName) {
    if (!ukName) return ukName;
    let enName = ukName.replace(/РЕЗИДЕНЦІЯ|Резиденція/gi, 'RESIDENCE');
    enName = enName.replace(/№/g, 'No.');
    enName = enName.replace(/\((\d+)-й поверх\)/gi, (match, p1) => {
        const num = parseInt(p1);
        const suffix = num === 1 ? 'st' : num === 2 ? 'nd' : num === 3 ? 'rd' : 'th';
        return `(${num}${suffix} floor)`;
    });
    return enName;
}

function translateStatus(ukStatus) {
    if (!ukStatus) return ukStatus;
    let status = ukStatus.replace('Здано в експлуатацію', 'Commissioned');
    const months = {
        'січень': 'January',
        'лютий': 'February',
        'березень': 'March',
        'квітень': 'April',
        'травень': 'May',
        'червень': 'June',
        'липень': 'July',
        'серпень': 'August',
        'вересень': 'September',
        'жовтень': 'October',
        'листопад': 'November',
        'грудень': 'December'
    };
    Object.keys(months).forEach(uk => {
        status = status.replace(new RegExp(uk, 'gi'), months[uk]);
    });
    return status;
}
