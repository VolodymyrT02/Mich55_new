// Admin Panel JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Language switching
    const langSwitch = document.getElementById('lang-switch');
    let currentLang = langSwitch.getAttribute('data-lang');
    
    langSwitch.addEventListener('click', function() {
        currentLang = currentLang === 'uk' ? 'en' : 'uk';
        langSwitch.setAttribute('data-lang', currentLang);
        langSwitch.textContent = currentLang === 'uk' ? 'ENG' : 'УКР';
        
        // Load translations
        loadTranslations();
    });
    
    // Load translations from main site
    function loadTranslations() {
        fetch('../assets/js/translations.js')
            .then(response => response.text())
            .then(data => {
                // Extract translations object from the file
                const scriptContent = data;
                const translationsMatch = scriptContent.match(/const\s+translations\s*=\s*({[\s\S]*?});/);
                
                if (translationsMatch && translationsMatch[1]) {
                    const translationsObj = eval('(' + translationsMatch[1] + ')');
                    updateUIWithTranslations(translationsObj);
                }
            })
            .catch(error => console.error('Error loading translations:', error));
    }
    
    // Update UI with translations
    function updateUIWithTranslations(translations) {
        // Get the translations for the current language
        const langData = translations[currentLang];
        
        // Update all elements with data-i18n attributes
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (langData[key]) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.value = langData[key];
                } else {
                    element.textContent = langData[key];
                }
            }
        });
        
        // Update form inputs that correspond to translation keys
        const formMappings = {
            // Technology section
            'tech-title': 'technology_title',
            'tech-subtitle': 'technology_subtitle',
            'tech-section-1-title': 'tech_section_1_title',
            'tech-section-1-text': 'tech_section_1_text',
            'tech-section-2-title': 'tech_section_2_title',
            'tech-section-2-text': 'tech_section_2_text',
            'tech-section-3-title': 'tech_section_3_title',
            'tech-section-3-text': 'tech_section_3_text',
            'tech-section-4-title': 'tech_section_4_title',
            'tech-section-4-text': 'tech_section_4_text',
            
            // Materials section
            'materials-section-1-title': 'materials_section_1_title',
            'materials-section-1-text': 'materials_section_1_text',
            'materials-section-2-title': 'materials_section_2_title',
            'materials-section-2-text': 'materials_section_2_text',
            'materials-section-3-title': 'materials_section_3_title',
            'materials-section-3-text': 'materials_section_3_text',
            'materials-section-4-title': 'materials_section_4_title',
            'materials-section-4-text': 'materials_section_4_text',
            
            // Apartments section
            'apt1-title': 'apartments_apartment1_title',
            'apt1-status': 'apartments_apartment1_status',
            'apt1-legal-area': 'apartments_apartment1_legal_area',
            'apt1-actual-area': 'apartments_apartment1_actual_area',
            'apt1-view': 'apartments_apartment1_view',
            'apt1-price': 'apartments_apartment1_price',
            'apt1-included': 'apartments_apartment1_included',
            
            'apt2-title': 'apartments_apartment2_title',
            'apt2-status': 'apartments_apartment2_status',
            'apt2-legal-area': 'apartments_apartment2_legal_area',
            'apt2-actual-area': 'apartments_apartment2_actual_area',
            'apt2-view': 'apartments_apartment2_view',
            'apt2-price': 'apartments_apartment2_price',
            'apt2-included': 'apartments_apartment2_included',
            
            'apt3-title': 'apartments_apartment3_title',
            'apt3-status': 'apartments_apartment3_status',
            'apt3-legal-area': 'apartments_apartment3_legal_area',
            'apt3-actual-area': 'apartments_apartment3_actual_area',
            'apt3-view': 'apartments_apartment3_view',
            'apt3-price': 'apartments_apartment3_price',
            'apt3-included': 'apartments_apartment3_included',
            
            // Location section
            'location-title': 'location_title',
            'location-address': 'building_address'
        };
        
        Object.keys(formMappings).forEach(formId => {
            const element = document.getElementById(formId);
            if (element && langData[formMappings[formId]]) {
                element.value = langData[formMappings[formId]];
            }
        });
        
        // Update section headers
        const sectionTitles = {
            'section-hero': { uk: 'Головна (Hero)', en: 'Main (Hero)' },
            'section-about': { uk: 'Про комплекс', en: 'About Complex' },
            'section-lobby': { uk: 'Лобі', en: 'Lobby' },
            'section-video': { uk: 'Відео', en: 'Video' },
            'section-technology': { uk: 'Технології', en: 'Technology' },
            'section-apartments': { uk: 'Квартири', en: 'Apartments' },
            'section-location': { uk: 'Розташування', en: 'Location' },
            'section-contacts': { uk: 'Контакти', en: 'Contacts' }
        };
        
        Object.keys(sectionTitles).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                const h2 = element.querySelector('h2');
                if (h2) {
                    const icon = h2.querySelector('i').outerHTML;
                    h2.innerHTML = icon + ' ' + sectionTitles[id][currentLang];
                }
                
                const description = element.querySelector('.section-description');
                if (description) {
                    const descriptionTexts = {
                        'section-hero': { 
                            uk: 'Управління головними фото фасаду будівлі, які відображаються у слайдері на головній сторінці', 
                            en: 'Manage main facade photos displayed in the slider on the home page' 
                        },
                        'section-about': { 
                            uk: 'Управління текстовою інформацією про комплекс', 
                            en: 'Manage textual information about the complex' 
                        },
                        'section-lobby': { 
                            uk: 'Управління фотографіями лобі будівлі', 
                            en: 'Manage lobby photos' 
                        },
                        'section-video': { 
                            uk: 'Управління відеоматеріалами', 
                            en: 'Manage video materials' 
                        },
                        'section-technology': { 
                            uk: 'Управління інформацією про технології', 
                            en: 'Manage technology information' 
                        },
                        'section-apartments': { 
                            uk: 'Управління інформацією про квартири та планами', 
                            en: 'Manage apartment information and plans' 
                        },
                        'section-location': { 
                            uk: 'Управління інформацією про розташування', 
                            en: 'Manage location information' 
                        },
                        'section-contacts': { 
                            uk: 'Управління контактною інформацією', 
                            en: 'Manage contact information' 
                        }
                    };
                    
                    if (descriptionTexts[id]) {
                        description.textContent = descriptionTexts[id][currentLang];
                    }
                }
            }
        });
        
        // Update apartment tabs
        document.querySelectorAll('.apartment-tabs .tab-btn').forEach((tab, index) => {
            const aptNum = index + 1;
            const key = `apartment_${aptNum}_tab`;
            if (langData[key]) {
                tab.textContent = langData[key];
            }
        });
        
        // Update sidebar navigation
        const sidebarItems = document.querySelectorAll('.admin-sidebar nav ul li a');
        Object.keys(sectionTitles).forEach((id, index) => {
            if (sidebarItems[index]) {
                const icon = sidebarItems[index].querySelector('i').outerHTML;
                sidebarItems[index].innerHTML = icon + ' ' + sectionTitles[id][currentLang];
            }
        });
        
        // Update form labels
        const formLabels = {
            uk: {
                'Заголовок:': 'Заголовок:',
                'Статус:': 'Статус:',
                'Юридична площа:': 'Юридична площа:',
                'Фактична площа:': 'Фактична площа:',
                'Вид:': 'Вид:',
                'Вартість:': 'Вартість:',
                'Включено:': 'Включено:',
                'Статус публікації:': 'Статус публікації:',
                'Опубліковано': 'Опубліковано',
                'Знято з публікації (продано)': 'Знято з публікації (продано)',
                'Заголовок секції:': 'Заголовок секції:',
                'Підзаголовок:': 'Підзаголовок:',
                'Опис:': 'Опис:',
                'Адреса:': 'Адреса:',
                'Широта:': 'Широта:',
                'Довгота:': 'Довгота:',
                'Масштаб:': 'Масштаб:',
                'WhatsApp:': 'WhatsApp:',
                'Telegram:': 'Telegram:',
                'План квартири і фото': 'План квартири і фото',
                'Фотографії квартири': 'Фотографії квартири',
                'Інформація про квартиру': 'Інформація про квартиру',
                'Заголовки': 'Заголовки',
                'Основний текст': 'Основний текст',
                'Абзац 1:': 'Абзац 1:',
                'Абзац 2:': 'Абзац 2:',
                'Абзац 3:': 'Абзац 3:',
                'Технології': 'Технології',
                'Матеріали та конструктив': 'Матеріали та конструктив',
                'Заголовок 1:': 'Заголовок 1:',
                'Опис 1:': 'Опис 1:',
                'Заголовок 2:': 'Заголовок 2:',
                'Опис 2:': 'Опис 2:',
                'Заголовок 3:': 'Заголовок 3:',
                'Опис 3:': 'Опис 3:',
                'Заголовок 4:': 'Заголовок 4:',
                'Опис 4:': 'Опис 4:',
                'Контактна інформація': 'Контактна інформація',
                'Фото фасаду': 'Фото фасаду',
                'Фото лобі': 'Фото лобі',
                'Основне відео': 'Основне відео',
                'Додаткові відео': 'Додаткові відео',
                'Назва будівлі:': 'Назва будівлі:',
                'Слоган:': 'Слоган:',
                'Карта': 'Карта'
            },
            en: {
                'Заголовок:': 'Title:',
                'Статус:': 'Status:',
                'Юридична площа:': 'Legal area:',
                'Фактична площа:': 'Actual area:',
                'Вид:': 'View:',
                'Вартість:': 'Price:',
                'Включено:': 'Included:',
                'Статус публікації:': 'Publication status:',
                'Опубліковано': 'Published',
                'Знято з публікації (продано)': 'Unpublished (sold)',
                'Заголовок секції:': 'Section title:',
                'Підзаголовок:': 'Subtitle:',
                'Опис:': 'Description:',
                'Адреса:': 'Address:',
                'Широта:': 'Latitude:',
                'Довгота:': 'Longitude:',
                'Масштаб:': 'Zoom:',
                'WhatsApp:': 'WhatsApp:',
                'Telegram:': 'Telegram:',
                'План квартири і фото': 'Apartment plan and photos',
                'Фотографії квартири': 'Apartment photos',
                'Інформація про квартиру': 'Apartment information',
                'Заголовки': 'Headings',
                'Основний текст': 'Main text',
                'Абзац 1:': 'Paragraph 1:',
                'Абзац 2:': 'Paragraph 2:',
                'Абзац 3:': 'Paragraph 3:',
                'Технології': 'Technologies',
                'Матеріали та конструктив': 'Materials and construction',
                'Заголовок 1:': 'Title 1:',
                'Опис 1:': 'Description 1:',
                'Заголовок 2:': 'Title 2:',
                'Опис 2:': 'Description 2:',
                'Заголовок 3:': 'Title 3:',
                'Опис 3:': 'Description 3:',
                'Заголовок 4:': 'Title 4:',
                'Опис 4:': 'Description 4:',
                'Контактна інформація': 'Contact information',
                'Фото фасаду': 'Facade photos',
                'Фото лобі': 'Lobby photos',
                'Основне відео': 'Main video',
                'Додаткові відео': 'Additional videos',
                'Назва будівлі:': 'Building name:',
                'Слоган:': 'Slogan:',
                'Карта': 'Map'
            }
        };
        
        document.querySelectorAll('label, h3, h4, option').forEach(element => {
            const text = element.textContent.trim();
            if (formLabels[currentLang][text]) {
                element.textContent = formLabels[currentLang][text];
            }
        });
        
        // Update buttons and UI elements
        const uiElements = {
            'save-btn': { uk: 'Зберегти зміни', en: 'Save Changes' },
            'replace-btn': { uk: 'Замінити', en: 'Replace' },
            'delete-btn': { uk: 'Видалити', en: 'Delete' },
            'view-site-btn': { uk: 'Переглянути сайт', en: 'View Site' }
        };
        
        Object.keys(uiElements).forEach(className => {
            document.querySelectorAll('.' + className).forEach(element => {
                const icon = element.querySelector('i');
                if (icon) {
                    const iconHTML = icon.outerHTML;
                    element.innerHTML = iconHTML + ' ' + uiElements[className][currentLang];
                } else {
                    element.textContent = uiElements[className][currentLang];
                }
            });
        });
        
        // Update add new media buttons
        document.querySelectorAll('.media-item.add-new span').forEach(element => {
            if (element.closest('.video-grid')) {
                element.textContent = currentLang === 'uk' ? 'Додати відео' : 'Add video';
            } else {
                element.textContent = currentLang === 'uk' ? 'Додати фото' : 'Add photo';
            }
        });
        
        // Update modal texts
        const modalTitle = document.querySelector('#upload-modal h2');
        if (modalTitle) {
            modalTitle.textContent = currentLang === 'uk' ? 'Завантаження файлу' : 'File Upload';
        }
        
        const modalSectionLabel = document.querySelector('#upload-modal #modal-section-label').previousElementSibling;
        if (modalSectionLabel) {
            modalSectionLabel.textContent = currentLang === 'uk' ? 'Розділ: ' : 'Section: ';
        }
        
        const modalSubsectionLabel = document.querySelector('#upload-modal #modal-subsection-label').previousElementSibling;
        if (modalSubsectionLabel) {
            modalSubsectionLabel.textContent = currentLang === 'uk' ? 'Підрозділ: ' : 'Subsection: ';
        }
        
        const fileUploadLabel = document.querySelector('#upload-modal label[for="file-upload"]');
        if (fileUploadLabel) {
            fileUploadLabel.textContent = currentLang === 'uk' ? 'Виберіть файл:' : 'Select file:';
        }
        
        const fileDescriptionLabel = document.querySelector('#upload-modal label[for="file-description"]');
        if (fileDescriptionLabel) {
            fileDescriptionLabel.textContent = currentLang === 'uk' ? 'Опис (альтернативний текст):' : 'Description (alt text):';
        }
        
        const uploadBtn = document.querySelector('#upload-modal .upload-btn');
        if (uploadBtn) {
            uploadBtn.textContent = currentLang === 'uk' ? 'Завантажити' : 'Upload';
        }
        
        // Update admin panel title
        const adminTitle = document.querySelector('.admin-header h1');
        if (adminTitle) {
            adminTitle.textContent = currentLang === 'uk' ? 'Адміністративна панель' : 'Admin Panel';
        }
    }
    
    // Navigation - Fixed to ensure proper section switching
    function initNavigation() {
        const navLinks = document.querySelectorAll('.admin-sidebar nav ul li a');
        const sections = document.querySelectorAll('.admin-section');
        
        // Make sure navigation works by directly attaching click handlers
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href').substring(1);
                
                // Update active link
                navLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
                
                // Show target section, hide others
                sections.forEach(section => {
                    section.classList.remove('active');
                });
                
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.classList.add('active');
                }
            });
        });
        
        // Ensure navigation works on page load
        const hash = window.location.hash;
        if (hash) {
            const targetLink = document.querySelector(`.admin-sidebar nav ul li a[href="${hash}"]`);
            if (targetLink) {
                targetLink.click();
            }
        }
    }
    
    // Initialize navigation immediately
    initNavigation();
    
    // Apartment tabs
    function initApartmentTabs() {
        const apartmentTabs = document.querySelectorAll('.apartment-tabs .tab-btn');
        const apartmentContents = document.querySelectorAll('.apartment-admin');
        
        apartmentTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const apartmentId = this.getAttribute('data-apartment');
                
                // Update active tab
                apartmentTabs.forEach(tab => tab.classList.remove('active'));
                this.classList.add('active');
                
                // Show target apartment content
                apartmentContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.getAttribute('data-apartment') === apartmentId) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }
    
    // Initialize apartment tabs
    initApartmentTabs();
    
    // Media upload modal
    function initMediaUpload() {
        const addNewButtons = document.querySelectorAll('.media-item.add-new');
        const replaceButtons = document.querySelectorAll('.replace-btn');
        const uploadModal = document.getElementById('upload-modal');
        const closeModal = document.querySelector('.close-modal');
        const modalSectionLabel = document.getElementById('modal-section-label');
        const modalSubsectionLabel = document.getElementById('modal-subsection-label');
        
        // Function to open modal with context
        function openUploadModal(sectionName, subsectionName) {
            modalSectionLabel.textContent = sectionName;
            modalSubsectionLabel.textContent = subsectionName;
            uploadModal.style.display = 'block';
        }
        
        // Add new media
        addNewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const mediaManager = this.closest('.media-manager');
                const sectionName = mediaManager.getAttribute('data-section-name');
                const subsectionName = this.closest('.media-grid').previousElementSibling.textContent;
                const isVideo = this.closest('.video-grid') !== null;
                
                // Update file input accept attribute based on media type
                const fileUpload = document.getElementById('file-upload');
                fileUpload.setAttribute('accept', isVideo ? 'video/*' : 'image/*');
                
                openUploadModal(sectionName, subsectionName);
            });
        });
        
        // Replace existing media
        replaceButtons.forEach(button => {
            button.addEventListener('click', function() {
                const mediaManager = this.closest('.media-manager');
                const sectionName = mediaManager.getAttribute('data-section-name');
                const mediaItem = this.closest('.media-item');
                const subsectionName = mediaItem.closest('.media-grid') ? 
                                      mediaItem.closest('.media-grid').previousElementSibling.textContent :
                                      mediaItem.closest('.video-preview').previousElementSibling.textContent;
                const isVideo = mediaItem.querySelector('video') !== null;
                
                // Update file input accept attribute based on media type
                const fileUpload = document.getElementById('file-upload');
                fileUpload.setAttribute('accept', isVideo ? 'video/*' : 'image/*');
                
                openUploadModal(sectionName, subsectionName);
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
        
        // Handle form submission (mock)
        const uploadForm = document.getElementById('upload-form');
        uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Mock successful upload
            alert(currentLang === 'uk' ? 'Файл успішно завантажено!' : 'File uploaded successfully!');
            uploadModal.style.display = 'none';
        });
    }
    
    // Initialize media upload
    initMediaUpload();
    
    // Delete media (mock)
    function initDeleteMedia() {
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const confirmMessage = currentLang === 'uk' ? 
                                      'Ви впевнені, що хочете видалити цей файл?' : 
                                      'Are you sure you want to delete this file?';
                
                if (confirm(confirmMessage)) {
                    // Mock deletion
                    const mediaItem = this.closest('.media-item');
                    mediaItem.style.opacity = '0.5';
                    setTimeout(() => {
                        mediaItem.remove();
                    }, 500);
                }
            });
        });
    }
    
    // Initialize delete media
    initDeleteMedia();
    
    // Save changes (mock)
    function initSaveChanges() {
        const saveButtons = document.querySelectorAll('.save-btn');
        saveButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Mock saving
                const successMessage = currentLang === 'uk' ? 
                                      'Зміни успішно збережено!' : 
                                      'Changes saved successfully!';
                alert(successMessage);
            });
        });
    }
    
    // Initialize save changes
    initSaveChanges();
    
    // Apartment publication status
    function initPublicationStatus() {
        const publicationSelects = document.querySelectorAll('[id^="apt"][id$="-published"]');
        publicationSelects.forEach(select => {
            select.addEventListener('change', function() {
                const apartmentId = this.id.match(/apt(\d+)-published/)[1];
                const isPublished = this.value === 'published';
                
                // Visual feedback
                const apartmentAdmin = this.closest('.apartment-admin');
                if (isPublished) {
                    apartmentAdmin.classList.remove('unpublished');
                } else {
                    apartmentAdmin.classList.add('unpublished');
                    const soldMessage = currentLang === 'uk' ? 
                                       `Резиденція №${apartmentId} знята з публікації (позначена як продана)` : 
                                       `Residence №${apartmentId} unpublished (marked as sold)`;
                    alert(soldMessage);
                }
            });
        });
    }
    
    // Initialize publication status
    initPublicationStatus();
    
    // Initialize translations
    loadTranslations();
    
    // Force navigation to work by adding a fallback method
    setTimeout(function() {
        // Double-check that navigation is working
        const navLinks = document.querySelectorAll('.admin-sidebar nav ul li a');
        if (navLinks.length > 0) {
            // Add direct onclick attributes as a fallback
            navLinks.forEach((link, index) => {
                const targetId = link.getAttribute('href').substring(1);
                link.setAttribute('onclick', `
                    event.preventDefault();
                    document.querySelectorAll('.admin-sidebar nav ul li a').forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
                    document.getElementById('${targetId}').classList.add('active');
                `);
            });
        }
    }, 500);
});
