// Admin Panel JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Navigation between sections
    const sidebarLinks = document.querySelectorAll('.admin-sidebar nav ul li a');
    const adminSections = document.querySelectorAll('.admin-section');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            sidebarLinks.forEach(l => l.classList.remove('active'));
            adminSections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).classList.add('active');
        });
    });
    
    // Apartment tabs functionality
    const apartmentTabs = document.querySelectorAll('.admin-tabs .tab-btn');
    const apartmentContents = document.querySelectorAll('.admin-tab-content > div');
    
    apartmentTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const apartmentId = this.getAttribute('data-apartment');
            
            // Remove active class from all tabs and contents
            apartmentTabs.forEach(t => t.classList.remove('active'));
            apartmentContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.querySelector(`.apartment-admin[data-apartment="${apartmentId}"]`).classList.add('active');
        });
    });
    
    // Upload modal functionality
    const addNewButtons = document.querySelectorAll('.media-item.add-new');
    const replaceButtons = document.querySelectorAll('.replace-btn');
    const uploadModal = document.getElementById('upload-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalSectionLabel = document.getElementById('modal-section-label');
    const modalSubsectionLabel = document.getElementById('modal-subsection-label');
    
    // Track current upload context
    let currentUploadContext = {
        section: null,
        subsection: null,
        action: null, // 'add' or 'replace'
        element: null
    };
    
    // Open modal for adding new media
    addNewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const mediaManager = this.closest('.media-manager');
            const section = this.closest('.admin-section');
            const sectionName = section.querySelector('.section-header h2').textContent.trim();
            const subsectionName = mediaManager.querySelector('h3, h4').textContent.trim();
            
            currentUploadContext = {
                section: section.id,
                sectionName: sectionName,
                subsectionName: subsectionName,
                action: 'add',
                element: null
            };
            
            // Update modal labels
            modalSectionLabel.textContent = sectionName;
            modalSubsectionLabel.textContent = subsectionName;
            
            uploadModal.style.display = 'block';
        });
    });
    
    // Open modal for replacing media
    replaceButtons.forEach(button => {
        button.addEventListener('click', function() {
            const mediaManager = this.closest('.media-manager');
            const section = this.closest('.admin-section');
            const sectionName = section.querySelector('.section-header h2').textContent.trim();
            const subsectionName = mediaManager.querySelector('h3, h4').textContent.trim();
            const mediaItem = this.closest('.media-item');
            
            currentUploadContext = {
                section: section.id,
                sectionName: sectionName,
                subsectionName: subsectionName,
                action: 'replace',
                element: mediaItem
            };
            
            // Update modal labels
            modalSectionLabel.textContent = sectionName;
            modalSubsectionLabel.textContent = subsectionName;
            
            uploadModal.style.display = 'block';
        });
    });
    
    // Close modal
    closeModal.addEventListener('click', function() {
        uploadModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === uploadModal) {
            uploadModal.style.display = 'none';
        }
    });
    
    // Handle file upload
    const uploadForm = document.getElementById('upload-form');
    
    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fileInput = document.getElementById('file-upload');
        const fileDescription = document.getElementById('file-description').value;
        
        if (fileInput.files.length === 0) {
            alert('Будь ласка, виберіть файл для завантаження.');
            return;
        }
        
        const file = fileInput.files[0];
        
        // Here we would normally send the file to the server
        // For this demo, we'll simulate a successful upload
        
        // Create a preview of the uploaded file
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const fileUrl = e.target.result;
            
            if (currentUploadContext.action === 'add') {
                // Create new media item
                addNewMediaItem(currentUploadContext.section, fileUrl, fileDescription);
            } else if (currentUploadContext.action === 'replace') {
                // Replace existing media item
                replaceMediaItem(currentUploadContext.element, fileUrl);
            }
            
            // Close modal and reset form
            uploadModal.style.display = 'none';
            uploadForm.reset();
        };
        
        reader.readAsDataURL(file);
    });
    
    // Function to add new media item
    function addNewMediaItem(section, fileUrl, description) {
        const mediaGrid = document.querySelector(`#${section} .media-grid`);
        const addNewItem = mediaGrid.querySelector('.media-item.add-new');
        
        // Create new media item
        const newItem = document.createElement('div');
        newItem.className = 'media-item';
        
        // Determine if it's an image or video
        const isVideo = fileUrl.includes('video');
        
        if (isVideo) {
            newItem.innerHTML = `
                <div class="media-preview">
                    <video controls>
                        <source src="${fileUrl}" type="video/mp4">
                        Ваш браузер не підтримує відео.
                    </video>
                </div>
                <div class="media-actions">
                    <button class="replace-btn"><i class="fas fa-exchange-alt"></i> Замінити</button>
                    <button class="delete-btn"><i class="fas fa-trash"></i> Видалити</button>
                </div>
            `;
        } else {
            newItem.innerHTML = `
                <div class="media-preview">
                    <img src="${fileUrl}" alt="${description || 'Зображення'}">
                </div>
                <div class="media-actions">
                    <button class="replace-btn"><i class="fas fa-exchange-alt"></i> Замінити</button>
                    <button class="delete-btn"><i class="fas fa-trash"></i> Видалити</button>
                </div>
            `;
        }
        
        // Insert new item before the "add new" button
        mediaGrid.insertBefore(newItem, addNewItem);
        
        // Add event listeners to new buttons
        addButtonEventListeners(newItem);
    }
    
    // Function to replace media item
    function replaceMediaItem(mediaItem, fileUrl) {
        const mediaPreview = mediaItem.querySelector('.media-preview');
        const isVideo = fileUrl.includes('video');
        
        if (isVideo) {
            mediaPreview.innerHTML = `
                <video controls>
                    <source src="${fileUrl}" type="video/mp4">
                    Ваш браузер не підтримує відео.
                </video>
            `;
        } else {
            mediaPreview.innerHTML = `<img src="${fileUrl}" alt="Зображення">`;
        }
    }
    
    // Function to add event listeners to buttons in new media items
    function addButtonEventListeners(mediaItem) {
        const replaceBtn = mediaItem.querySelector('.replace-btn');
        const deleteBtn = mediaItem.querySelector('.delete-btn');
        
        replaceBtn.addEventListener('click', function() {
            const mediaManager = this.closest('.media-manager');
            const section = this.closest('.admin-section');
            const sectionName = section.querySelector('.section-header h2').textContent.trim();
            const subsectionName = mediaManager.querySelector('h3, h4').textContent.trim();
            
            currentUploadContext = {
                section: section.id,
                sectionName: sectionName,
                subsectionName: subsectionName,
                action: 'replace',
                element: mediaItem
            };
            
            // Update modal labels
            modalSectionLabel.textContent = sectionName;
            modalSubsectionLabel.textContent = subsectionName;
            
            uploadModal.style.display = 'block';
        });
        
        deleteBtn.addEventListener('click', function() {
            if (confirm('Ви впевнені, що хочете видалити цей файл?')) {
                mediaItem.remove();
            }
        });
    }
    
    // Add event listeners to existing delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            if (confirm('Ви впевнені, що хочете видалити цей файл?')) {
                this.closest('.media-item').remove();
            }
        });
    });
    
    // Handle text content saving
    document.querySelectorAll('.save-btn').forEach(button => {
        button.addEventListener('click', function() {
            const section = this.closest('.admin-section').id;
            const formGroups = this.closest('.text-manager').querySelectorAll('.form-group');
            
            // Collect form data
            const formData = {};
            formGroups.forEach(group => {
                const input = group.querySelector('input, textarea');
                if (input) {
                    formData[input.id] = input.value;
                }
            });
            
            // Here we would normally send the data to the server
            // For this demo, we'll just show a success message
            
            alert('Зміни успішно збережено!');
            console.log(`Saving data for section ${section}:`, formData);
        });
    });
    
    // Language switcher
    const langSwitch = document.getElementById('lang-switch');
    if (langSwitch) {
        langSwitch.addEventListener('click', function() {
            const currentLang = this.getAttribute('data-lang');
            const newLang = currentLang === 'en' ? 'uk' : 'en';
            
            this.setAttribute('data-lang', newLang);
            this.textContent = newLang === 'en' ? 'UKR' : 'ENG';
            
            // Update all text fields with translations
            updateAdminPanelLanguage(newLang);
        });
    }
    
    // Function to update admin panel language
    function updateAdminPanelLanguage(lang) {
        // Load translations
        const translations = adminTranslations[lang];
        
        // Update section titles and descriptions
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[key]) {
                element.textContent = translations[key];
            }
        });
        
        // Update input placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (translations[key]) {
                element.placeholder = translations[key];
            }
        });
        
        // Update form labels
        document.querySelectorAll('label[for]').forEach(label => {
            const forAttr = label.getAttribute('for');
            const key = `label_${forAttr}`;
            if (translations[key]) {
                label.textContent = translations[key];
            }
        });
        
        // Update buttons
        document.querySelectorAll('button:not(#lang-switch)').forEach(button => {
            const key = `button_${button.className.replace(/-/g, '_')}`;
            if (translations[key]) {
                button.textContent = translations[key];
            }
        });
        
        // Update form inputs and textareas with their corresponding translations
        updateFormFieldsWithTranslations(lang);
    }
    
    // Function to update form fields with translations
    function updateFormFieldsWithTranslations(lang) {
        const translations = adminTranslations[lang];
        
        // Hero section
        document.getElementById('building-name').value = translations.building_name || '';
        document.getElementById('building-slogan').value = translations.building_slogan || '';
        document.getElementById('building-address').value = translations.building_address || '';
        document.getElementById('building-status').value = translations.building_status || '';
        
        // About section
        document.getElementById('about-text-1').value = translations.about_text_main_1 || '';
        document.getElementById('about-text-2').value = translations.about_text_main_2 || '';
        document.getElementById('about-text-3').value = translations.about_text_main_3 || '';
        
        // Technology section
        document.getElementById('tech-title').value = translations.technology_title || '';
        document.getElementById('tech-subtitle').value = translations.technology_subtitle || '';
        document.getElementById('tech-section-1-title').value = translations.tech_section_1_title || '';
        document.getElementById('tech-section-1-text').value = translations.tech_section_1_text || '';
        
        // Apartments section
        if (document.getElementById('apt1-title')) {
            document.getElementById('apt1-title').value = translations.apartments_apartment1_title || '';
            document.getElementById('apt1-status').value = translations.apartments_apartment1_status || '';
            document.getElementById('apt1-area').value = translations.apartments_apartment1_actual_area || '';
            document.getElementById('apt1-description').value = translations.apartments_apartment1_view || '';
        }
        
        if (document.getElementById('apt2-title')) {
            document.getElementById('apt2-title').value = translations.apartments_apartment2_title || '';
            document.getElementById('apt2-status').value = translations.apartments_apartment2_status || '';
            document.getElementById('apt2-area').value = translations.apartments_apartment2_actual_area || '';
            document.getElementById('apt2-description').value = translations.apartments_apartment2_view || '';
        }
        
        if (document.getElementById('apt3-title')) {
            document.getElementById('apt3-title').value = translations.apartments_apartment3_title || '';
            document.getElementById('apt3-status').value = translations.apartments_apartment3_status || '';
            document.getElementById('apt3-area').value = translations.apartments_apartment3_actual_area || '';
            document.getElementById('apt3-description').value = translations.apartments_apartment3_view || '';
        }
        
        // Location section
        document.getElementById('location-title').value = translations.location_title || '';
        document.getElementById('location-address').value = translations.building_address || '';
        
        // Contacts section
        if (document.getElementById('contact-phone')) {
            document.getElementById('contact-phone').value = translations.contacts_phone || '';
        }
        if (document.getElementById('contact-email')) {
            document.getElementById('contact-email').value = translations.contacts_email || '';
        }
        if (document.getElementById('contact-telegram')) {
            document.getElementById('contact-telegram').value = translations.telegram_link || '';
        }
    }
    
    // Add section labels to all media managers
    document.querySelectorAll('.media-manager').forEach(manager => {
        const section = manager.closest('.admin-section');
        const sectionName = section.querySelector('.section-header h2').textContent.trim();
        manager.setAttribute('data-section-name', sectionName);
    });
    
    // Add section labels to all text managers
    document.querySelectorAll('.text-manager').forEach(manager => {
        const section = manager.closest('.admin-section');
        const sectionName = section.querySelector('.section-header h2').textContent.trim();
        manager.setAttribute('data-section-name', sectionName);
    });
    
    // Add section navigation
    document.querySelectorAll('.admin-section').forEach((section, index, sections) => {
        const navigation = document.createElement('div');
        navigation.className = 'section-navigation';
        
        // Previous button
        const prevButton = document.createElement('button');
        if (index > 0) {
            const prevSection = sections[index - 1];
            const prevSectionName = prevSection.querySelector('.section-header h2').textContent.trim();
            prevButton.innerHTML = `<i class="fas fa-arrow-left"></i> ${prevSectionName}`;
            prevButton.addEventListener('click', () => {
                // Simulate click on previous section in sidebar
                document.querySelector(`a[href="#${prevSection.id}"]`).click();
            });
        } else {
            prevButton.innerHTML = `<i class="fas fa-arrow-left"></i> Попередній`;
            prevButton.disabled = true;
        }
        
        // Next button
        const nextButton = document.createElement('button');
        if (index < sections.length - 1) {
            const nextSection = sections[index + 1];
            const nextSectionName = nextSection.querySelector('.section-header h2').textContent.trim();
            nextButton.innerHTML = `${nextSectionName} <i class="fas fa-arrow-right"></i>`;
            nextButton.addEventListener('click', () => {
                // Simulate click on next section in sidebar
                document.querySelector(`a[href="#${nextSection.id}"]`).click();
            });
        } else {
            nextButton.innerHTML = `Наступний <i class="fas fa-arrow-right"></i>`;
            nextButton.disabled = true;
        }
        
        navigation.appendChild(prevButton);
        navigation.appendChild(nextButton);
        section.appendChild(navigation);
    });
    
    // Admin panel translations
    const adminTranslations = {
        uk: {
            // Section titles
            section_hero: "Головна (Hero)",
            section_about: "Про комплекс",
            section_lobby: "Лобі",
            section_video: "Відео",
            section_technology: "Технології",
            section_apartments: "Квартири",
            section_location: "Розташування",
            section_contacts: "Контакти",
            
            // Section descriptions
            desc_hero: "Управління головними фото фасаду будівлі, які відображаються у слайдері на головній сторінці",
            desc_about: "Управління текстовою інформацією про комплекс",
            desc_lobby: "Управління фотографіями лобі будівлі",
            desc_video: "Управління відеоматеріалами",
            desc_technology: "Управління інформацією про технології",
            desc_apartments: "Управління інформацією про квартири та планами",
            desc_location: "Управління інформацією про розташування",
            desc_contacts: "Управління контактною інформацією",
            
            // Form labels
            label_building_name: "Назва будівлі:",
            label_building_slogan: "Слоган:",
            label_building_address: "Адреса:",
            label_building_status: "Статус:",
            label_about_text_1: "Абзац 1:",
            label_about_text_2: "Абзац 2:",
            label_about_text_3: "Абзац 3:",
            label_tech_title: "Заголовок секції:",
            label_tech_subtitle: "Підзаголовок:",
            label_tech_section_1_title: "Заголовок 1:",
            label_tech_section_1_text: "Опис 1:",
            label_apt1_title: "Заголовок:",
            label_apt1_status: "Статус:",
            label_apt1_area: "Площа:",
            label_apt1_rooms: "Кімнати:",
            label_apt1_description: "Опис:",
            label_location_title: "Заголовок секції:",
            label_location_address: "Адреса:",
            label_map_lat: "Широта:",
            label_map_lng: "Довгота:",
            label_map_zoom: "Масштаб:",
            label_contact_phone: "Телефон:",
            label_contact_email: "Email:",
            label_contact_telegram: "Телеграм:",
            label_contact_instagram: "Instagram:",
            
            // Buttons
            button_save_btn: "Зберегти зміни",
            button_replace_btn: "Замінити",
            button_delete_btn: "Видалити",
            button_upload_btn: "Завантажити",
            
            // Content
            building_name: "BOUTIQUE APARTMENTS KYIV",
            building_slogan: "Ваш краєвид, ваше натхнення",
            building_address: "вулиця Ломаківська / Мічуріна, 55, Печерський район, м. Київ",
            building_status: "Здано в експлуатацію лютий 2025р.",
            
            about_text_main_1: "6 приватних резиденцій на Печерських схилах — камерна колекція житла, де унікальність панорами поєднується з внутрішнім спокоєм. Простір, де кожне вікно — це живе полотно з видами на Києво-Печерську Лавру, куполи храмів та столичну зелень Ботанічного саду.",
            about_text_main_2: "Це локація не для всіх. Лише для тих, хто звик жити на своїх умовах, цінує тишу за закритими дверима і вміє бачити суть у деталях. Тут минуле перетікає в сучасність: історичний настрій району — у діалозі з бездоганним рівнем комфорту та приватності.",
            about_text_main_3: "Кожен апартамент — з повним пакетом документів на право власності. Житло, що належить лише вам. Без компромісів. Без шуму. Без зайвих очей.",
            
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
            
            apartments_apartment1_title: "РЕЗИДЕНЦІЯ №1 (1-й поверх)",
            apartments_apartment1_status: "Здано в експлуатацію лютий 2025р.",
            apartments_apartment1_legal_area: "211,7 м²",
            apartments_apartment1_actual_area: "189,5 м² внутрішня площа + 74 м² тераса з зеленою зоною",
            apartments_apartment1_view: "Києво-Печерська Лавра, Батьківщина-Мати",
            apartments_apartment1_price: "1 100 000 $",
            apartments_apartment1_included: "2 паркомісця + кладова",
            
            apartments_apartment2_title: "РЕЗИДЕНЦІЯ №2 (2-й поверх)",
            apartments_apartment2_status: "Здано в експлуатацію лютий 2025р.",
            apartments_apartment2_legal_area: "237 м²",
            apartments_apartment2_actual_area: "227 м² внутрішня площа + 33,3 м² тераса",
            apartments_apartment2_view: "Батьківщина-Мати, Києво-Печерська Лавра",
            apartments_apartment2_price: "1 185 000 $",
            apartments_apartment2_included: "2 паркомісця + кладова",
            
            apartments_apartment3_title: "РЕЗИДЕНЦІЯ №3 (3-й поверх)",
            apartments_apartment3_status: "Здано в експлуатацію лютий 2025р.",
            apartments_apartment3_legal_area: "238,2 м²",
            apartments_apartment3_actual_area: "204 м² внутрішня площа + 30 м² балкони + 84 м² панорамна тераса на покрівлі",
            apartments_apartment3_view: "Ботанічний сад + панорама міста з покрівлі",
            apartments_apartment3_price: "1 085 000 $",
            apartments_apartment3_included: "2 паркомісця + кладова",
            
            location_title: "РОЗТАШУВАННЯ",
            
            contacts_title: "КОНТАКТИ",
            contacts_phone: "+380 67 123 4567",
            contacts_email: "info@idgroup.ua",
            contacts_address: "м. Київ, вул. Мічуріна, 55",
            telegram_link: "IDGroup Kyiv",
            
            footer_copyright: "Всі права захищені."
        },
        en: {
            // Section titles
            section_hero: "Home (Hero)",
            section_about: "About",
            section_lobby: "Lobby",
            section_video: "Video",
            section_technology: "Technologies",
            section_apartments: "Apartments",
            section_location: "Location",
            section_contacts: "Contacts",
            
            // Section descriptions
            desc_hero: "Manage main facade photos displayed in the slider on the home page",
            desc_about: "Manage text information about the complex",
            desc_lobby: "Manage lobby photos",
            desc_video: "Manage video materials",
            desc_technology: "Manage information about technologies",
            desc_apartments: "Manage information about apartments and plans",
            desc_location: "Manage location information",
            desc_contacts: "Manage contact information",
            
            // Form labels
            label_building_name: "Building name:",
            label_building_slogan: "Slogan:",
            label_building_address: "Address:",
            label_building_status: "Status:",
            label_about_text_1: "Paragraph 1:",
            label_about_text_2: "Paragraph 2:",
            label_about_text_3: "Paragraph 3:",
            label_tech_title: "Section title:",
            label_tech_subtitle: "Subtitle:",
            label_tech_section_1_title: "Title 1:",
            label_tech_section_1_text: "Description 1:",
            label_apt1_title: "Title:",
            label_apt1_status: "Status:",
            label_apt1_area: "Area:",
            label_apt1_rooms: "Rooms:",
            label_apt1_description: "Description:",
            label_location_title: "Section title:",
            label_location_address: "Address:",
            label_map_lat: "Latitude:",
            label_map_lng: "Longitude:",
            label_map_zoom: "Zoom:",
            label_contact_phone: "Phone:",
            label_contact_email: "Email:",
            label_contact_telegram: "Telegram:",
            label_contact_instagram: "Instagram:",
            
            // Buttons
            button_save_btn: "Save changes",
            button_replace_btn: "Replace",
            button_delete_btn: "Delete",
            button_upload_btn: "Upload",
            
            // Content
            building_name: "BOUTIQUE APARTMENTS KYIV",
            building_slogan: "Your landscape, your inspiration",
            building_address: "Lomakivska / Michurina Street, 55, Pechersk district, Kyiv",
            building_status: "Commissioned February 2025",
            
            about_text_main_1: "6 private residences on the slopes of Pechersk — a curated collection of homes where panoramic views meet inner calm. Every window frames a living canvas of the Kyiv-Pechersk Lavra, golden domes, and the verdant expanse of the Botanical Garden.",
            about_text_main_2: "This is not a location for everyone. It is for those who live on their own terms, value silence behind closed doors, and appreciate meaning in subtlety. Here, heritage meets modern refinement — the spirit of an historic district in harmony with contemporary comfort and privacy.",
            about_text_main_3: "Each apartment comes with full ownership documentation. A residence that is entirely yours. No compromises. No noise. No unwanted eyes.",
            
            technology_title: "TECHNOLOGIES",
            technology_subtitle: "Premium-class engineering built for independence",
            
            tech_section_1_title: "Individual Heat Pumps",
            tech_section_1_text: "Energy-efficient heating, cooling, ventilation and hot water — fully autonomous for each residence.",
            
            tech_section_2_title: "Ecosoft Water Treatment",
            tech_section_2_text: "Centralised premium-grade filtration and purification — guaranteed water quality at every tap.",
            
            tech_section_3_title: "Smart Control System",
            tech_section_3_text: "Real-time building management and system monitoring via panel or smartphone.",
            
            tech_section_4_title: "Schindler Elevator",
            tech_section_4_text: "Smooth operation and direct access to underground parking — refined comfort without compromise.",
            
            apartments_apartment1_title: "RESIDENCE №1 (Ground floor)",
            apartments_apartment1_status: "Commissioned February 2025",
            apartments_apartment1_legal_area: "211.7 m²",
            apartments_apartment1_actual_area: "189.5 m² internal area + 74 m² terrace with green zone",
            apartments_apartment1_view: "Kyiv Pechersk Lavra, Motherland Monument",
            apartments_apartment1_price: "$1,100,000",
            apartments_apartment1_included: "2 parking spaces + storage room",
            
            apartments_apartment2_title: "RESIDENCE №2 (2nd floor)",
            apartments_apartment2_status: "Commissioned February 2025",
            apartments_apartment2_legal_area: "237 m²",
            apartments_apartment2_actual_area: "227 m² internal area + 33.3 m² terrace",
            apartments_apartment2_view: "Motherland Monument, Kyiv Pechersk Lavra",
            apartments_apartment2_price: "$1,185,000",
            apartments_apartment2_included: "2 parking spaces + storage room",
            
            apartments_apartment3_title: "RESIDENCE №3 (3rd floor)",
            apartments_apartment3_status: "Commissioned February 2025",
            apartments_apartment3_legal_area: "238.2 m²",
            apartments_apartment3_actual_area: "204 m² internal area + 30 m² balconies + 84 m² panoramic rooftop terrace",
            apartments_apartment3_view: "Botanical Garden + city panorama from rooftop",
            apartments_apartment3_price: "$1,085,000",
            apartments_apartment3_included: "2 parking spaces + storage room",
            
            location_title: "LOCATION",
            
            contacts_title: "CONTACTS",
            contacts_phone: "+380 67 123 4567",
            contacts_email: "info@idgroup.ua",
            contacts_address: "Kyiv, Michurina St., 55",
            telegram_link: "IDGroup Kyiv",
            
            footer_copyright: "All rights reserved."
        }
    };
});
