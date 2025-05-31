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
        // Update section titles and content
        document.querySelectorAll('[id^="building-"], [id^="about-text-"], [id^="tech-"], [id^="materials-section-"], [id^="apt"], [id^="location-"], [id^="contact-"]').forEach(element => {
            const key = element.id;
            if (translations[key] && translations[key][currentLang]) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.value = translations[key][currentLang];
                } else {
                    element.textContent = translations[key][currentLang];
                }
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
            }
        });
        
        // Update apartment tabs
        document.querySelectorAll('.apartment-tabs .tab-btn').forEach((tab, index) => {
            const aptNum = index + 1;
            const key = `apartment_${aptNum}_tab`;
            if (translations[key] && translations[key][currentLang]) {
                tab.textContent = translations[key][currentLang];
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
        
        // Update form labels and buttons
        const uiElements = {
            'save-btn': { uk: 'Зберегти зміни', en: 'Save Changes' },
            'replace-btn': { uk: 'Замінити', en: 'Replace' },
            'delete-btn': { uk: 'Видалити', en: 'Delete' },
            'add-new': { uk: 'Додати фото', en: 'Add Photo' },
            'add-video': { uk: 'Додати відео', en: 'Add Video' }
        };
        
        Object.keys(uiElements).forEach(className => {
            document.querySelectorAll('.' + className).forEach(element => {
                if (element.classList.contains('add-new')) {
                    const span = element.querySelector('span');
                    if (span) {
                        if (span.parentElement.closest('.video-grid')) {
                            span.textContent = currentLang === 'uk' ? 'Додати відео' : 'Add Video';
                        } else {
                            span.textContent = currentLang === 'uk' ? 'Додати фото' : 'Add Photo';
                        }
                    }
                } else if (element.classList.contains('save-btn') || element.classList.contains('replace-btn') || element.classList.contains('delete-btn')) {
                    const icon = element.querySelector('i').outerHTML;
                    const text = uiElements[className][currentLang];
                    element.innerHTML = icon + ' ' + text;
                }
            });
        });
    }
    
    // Navigation
    const navLinks = document.querySelectorAll('.admin-sidebar nav ul li a');
    const sections = document.querySelectorAll('.admin-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            
            // Update active link
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
            
            // Show target section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });
        });
    });
    
    // Apartment tabs
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
    
    // Media upload modal
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
            const subsectionName = mediaItem.closest('.media-grid').previousElementSibling.textContent;
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
        alert('Файл успішно завантажено!');
        uploadModal.style.display = 'none';
    });
    
    // Delete media (mock)
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (confirm('Ви впевнені, що хочете видалити цей файл?')) {
                // Mock deletion
                const mediaItem = this.closest('.media-item');
                mediaItem.style.opacity = '0.5';
                setTimeout(() => {
                    mediaItem.remove();
                }, 500);
            }
        });
    });
    
    // Save changes (mock)
    const saveButtons = document.querySelectorAll('.save-btn');
    saveButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Mock saving
            alert('Зміни успішно збережено!');
        });
    });
    
    // Apartment publication status
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
                alert(`Резиденція №${apartmentId} знята з публікації (позначена як продана)`);
            }
        });
    });
    
    // Initialize translations
    loadTranslations();
});
