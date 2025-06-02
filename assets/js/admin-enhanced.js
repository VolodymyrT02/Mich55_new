// Enhanced Admin Panel Functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginForm = document.getElementById('login-form');
    const adminLoginForm = document.getElementById('admin-login-form');
    const adminContent = document.getElementById('admin-content');
    const logoutBtn = document.getElementById('admin-logout');
    const saveChangesBtn = document.getElementById('save-changes');
    const langTabs = document.querySelectorAll('.lang-tab');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('admin-password');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.admin-section');
    const actionButtons = document.querySelectorAll('.action-btn');
    const navButtons = document.querySelectorAll('.nav-btn');
    
    // Create autosave indicator
    const autosaveIndicator = document.createElement('div');
    autosaveIndicator.className = 'autosave-indicator';
    autosaveIndicator.innerHTML = '<i class="fas fa-save"></i> Автосохранение...';
    document.body.appendChild(autosaveIndicator);
    
    // Password visibility toggle
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Change icon
            const icon = togglePasswordBtn.querySelector('i');
            if (type === 'password') {
                icon.className = 'fas fa-eye';
            } else {
                icon.className = 'fas fa-eye-slash';
            }
        });
    }
    
    // Version control to force cache refresh and localStorage reset
    const currentVersion = '20250602';
    const savedVersion = localStorage.getItem('adminPanelVersion');
    
    // Clear localStorage if version changed
    if (savedVersion !== currentVersion) {
        console.log('Admin panel version changed, clearing localStorage');
        // Save important data before clearing
        const savedData = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('apartment_') || key.startsWith('content_')) {
                savedData[key] = localStorage.getItem(key);
            }
        }
        
        localStorage.clear();
        
        // Restore important data
        for (const key in savedData) {
            localStorage.setItem(key, savedData[key]);
        }
        
        localStorage.setItem('adminPanelVersion', currentVersion);
    }
    
    // Admin credentials (in a real application, this would be handled server-side)
    const adminUsername = 'MichBoutique_Admin';
    const adminPassword = 'P3ch3rsk_Ky1v_2025!';
    
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (isLoggedIn) {
        showAdminPanel();
    }
    
    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get input values and trim whitespace
            const username = document.getElementById('admin-username').value.trim();
            const password = document.getElementById('admin-password').value.trim();
            
            // Debug info in console
            console.log('Login attempt with username: ' + username);
            console.log('Password length: ' + password.length);
            
            // Case-insensitive username comparison and exact password match
            if (username.toLowerCase() === adminUsername.toLowerCase() && 
                password === adminPassword) {
                console.log('Login successful');
                localStorage.setItem('adminLoggedIn', 'true');
                showAdminPanel();
            } else {
                console.log('Login failed. Username: ' + (username.toLowerCase() === adminUsername.toLowerCase() ? 'correct' : 'incorrect') + 
                          ', Password: ' + (password === adminPassword ? 'correct' : 'incorrect'));
                console.log('Expected password: ' + adminPassword.length + ' chars');
                
                // Force clear localStorage to ensure clean state
                localStorage.removeItem('adminLoggedIn');
                alert('Неверное имя пользователя или пароль');
            }
        });
    }
    
    // Logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Вы уверены, что хотите выйти? Все несохраненные изменения будут потеряны.')) {
                localStorage.removeItem('adminLoggedIn');
                hideAdminPanel();
            }
        });
    }
    
    // Save changes button
    if (saveChangesBtn) {
        saveChangesBtn.addEventListener('click', function() {
            saveAllChanges();
        });
    }
    
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');
            
            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Show target section
            sections.forEach(section => {
                section.classList.remove('active-section');
                if (section.id === targetSection) {
                    section.classList.add('active-section');
                }
            });
        });
    });
    
    // Action buttons
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // Update active link
            navLinks.forEach(l => {
                if (l.getAttribute('data-section') === targetSection) {
                    l.click();
                }
            });
        });
    });
    
    // Navigation buttons
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // Update active link
            navLinks.forEach(l => {
                if (l.getAttribute('data-section') === targetSection) {
                    l.click();
                }
            });
        });
    });
    
    // Language tabs
    langTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            
            // Update active tab
            langTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Load content for selected language
            loadLanguageContent(lang);
            
            // Save selected language
            localStorage.setItem('selectedLanguage', lang);
        });
    });
    
    // Load saved language preference
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'uk';
    langTabs.forEach(tab => {
        if (tab.getAttribute('data-lang') === savedLanguage) {
            tab.click();
        }
    });
    
    // Apartment visibility checkboxes and status selects
    const apartmentCheckboxes = document.querySelectorAll('#apartment-list input[type="checkbox"]');
    const statusSelects = document.querySelectorAll('.status-select');
    
    apartmentCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const apartmentId = this.id;
            const isVisible = this.checked;
            
            // Save visibility state to localStorage
            localStorage.setItem(`apartment_${apartmentId}_visible`, isVisible);
            
            // Auto-save
            showAutosaveIndicator();
        });
        
        // Load saved visibility state
        const apartmentId = checkbox.id;
        const savedState = localStorage.getItem(`apartment_${apartmentId}_visible`);
        if (savedState !== null) {
            checkbox.checked = savedState === 'true';
        }
    });
    
    statusSelects.forEach(select => {
        select.addEventListener('change', function() {
            const statusId = this.id;
            const statusValue = this.value;
            
            // Save status to localStorage
            localStorage.setItem(`apartment_${statusId}_status`, statusValue);
            
            // Update visibility based on status
            if (statusValue === 'sold') {
                const apartmentId = statusId.replace('status', 'apartment');
                const checkbox = document.getElementById(apartmentId);
                if (checkbox) {
                    checkbox.checked = false;
                    localStorage.setItem(`apartment_${apartmentId}_visible`, false);
                }
            }
            
            // Auto-save
            showAutosaveIndicator();
        });
        
        // Load saved status
        const statusId = select.id;
        const savedStatus = localStorage.getItem(`apartment_${statusId}_status`);
        if (savedStatus) {
            select.value = savedStatus;
        }
    });
    
    // Media actions
    const replaceButtons = document.querySelectorAll('.replace-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');
    const addNewButtons = document.querySelectorAll('.add-new');
    
    replaceButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const mediaItem = this.closest('.media-item');
            const img = mediaItem.querySelector('img') || mediaItem.querySelector('video');
            const mediaType = img.tagName.toLowerCase() === 'img' ? 'image' : 'video';
            
            // In a real application, this would open a file picker
            alert(`В реальном приложении здесь будет открываться выбор файла для замены ${mediaType === 'image' ? 'изображения' : 'видео'}`);
        });
    });
    
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const mediaItem = this.closest('.media-item');
            
            if (confirm('Вы уверены, что хотите удалить этот медиафайл?')) {
                // In a real application, this would delete the file
                mediaItem.style.opacity = '0.5';
                btn.textContent = 'Удалено';
                btn.disabled = true;
                
                // Auto-save
                showAutosaveIndicator();
            }
        });
    });
    
    addNewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const mediaCategory = this.closest('.media-category');
            const mediaType = mediaCategory.querySelector('h3').textContent.toLowerCase().includes('видео') ? 'video' : 'image';
            
            // In a real application, this would open a file picker
            alert(`В реальном приложении здесь будет открываться выбор файла для добавления нового ${mediaType === 'image' ? 'изображения' : 'видео'}`);
        });
    });
    
    // Add technology button
    const addTechBtn = document.getElementById('add-tech');
    if (addTechBtn) {
        addTechBtn.addEventListener('click', function() {
            const techItems = document.getElementById('tech-items');
            const techCount = techItems.children.length + 1;
            
            const techItem = document.createElement('div');
            techItem.className = 'tech-item';
            techItem.innerHTML = `
                <div class="form-group">
                    <label for="tech-name-${techCount}">Название:</label>
                    <input type="text" id="tech-name-${techCount}" value="">
                </div>
                <div class="form-group">
                    <label for="tech-desc-${techCount}">Описание:</label>
                    <textarea id="tech-desc-${techCount}" rows="3"></textarea>
                </div>
            `;
            
            techItems.appendChild(techItem);
            
            // Auto-save
            showAutosaveIndicator();
        });
    }
    
    // Auto-save for all input fields
    const allInputs = document.querySelectorAll('input, textarea, select');
    allInputs.forEach(input => {
        input.addEventListener('change', function() {
            const inputId = this.id;
            const inputValue = this.value;
            
            // Save to localStorage
            localStorage.setItem(`content_${inputId}`, inputValue);
            
            // Show auto-save indicator
            showAutosaveIndicator();
        });
        
        // Load saved content
        const inputId = input.id;
        const savedContent = localStorage.getItem(`content_${inputId}`);
        if (savedContent) {
            input.value = savedContent;
        }
    });
    
    // Functions
    function showAdminPanel() {
        if (adminLoginForm) adminLoginForm.style.display = 'none';
        if (adminContent) adminContent.style.display = 'block';
    }
    
    function hideAdminPanel() {
        if (adminLoginForm) adminLoginForm.style.display = 'block';
        if (adminContent) adminContent.style.display = 'none';
    }
    
    function loadLanguageContent(lang) {
        // Get all text fields that need translation
        const textFields = document.querySelectorAll('[data-translate]');
        
        // In a real application, this would load content from the server or translations object
        // For now, we'll use the saved content in localStorage with language prefix
        textFields.forEach(field => {
            const fieldId = field.id;
            const savedContent = localStorage.getItem(`content_${lang}_${fieldId}`);
            
            if (savedContent) {
                if (field.tagName.toLowerCase() === 'input' || field.tagName.toLowerCase() === 'textarea') {
                    field.value = savedContent;
                } else {
                    field.textContent = savedContent;
                }
            }
        });
        
        // Update specific fields based on language
        if (lang === 'uk') {
            updateUkrainianContent();
        } else if (lang === 'en') {
            updateEnglishContent();
        }
    }
    
    function updateUkrainianContent() {
        // Building info
        const buildingName = document.getElementById('building-name');
        const buildingSlogan = document.getElementById('building-slogan');
        const buildingAddress = document.getElementById('building-address');
        const aboutText1 = document.getElementById('about-text-1');
        const aboutText2 = document.getElementById('about-text-2');
        
        // Only update if not already set by user
        if (buildingName && !localStorage.getItem('content_uk_building-name')) {
            buildingName.value = 'BOUTIQUE APARTMENTS KYIV';
            localStorage.setItem('content_uk_building-name', buildingName.value);
        }
        
        if (buildingSlogan && !localStorage.getItem('content_uk_building-slogan')) {
            buildingSlogan.value = 'Ваш краєвид, ваше натхнення';
            localStorage.setItem('content_uk_building-slogan', buildingSlogan.value);
        }
        
        if (buildingAddress && !localStorage.getItem('content_uk_building-address')) {
            buildingAddress.value = 'вулиця Ломаківська / Мічуріна, 55, Печерський район, м. Київ';
            localStorage.setItem('content_uk_building-address', buildingAddress.value);
        }
        
        if (aboutText1 && !localStorage.getItem('content_uk_about-text-1')) {
            aboutText1.value = '6 резиденцій на Печерських схилах. Приватність історичного центру з видами на Києво-Печерську Лавру та Ботанічний сад.';
            localStorage.setItem('content_uk_about-text-1', aboutText1.value);
        }
        
        if (aboutText2 && !localStorage.getItem('content_uk_about-text-2')) {
            aboutText2.value = 'Ексклюзивна локація для тих, хто цінує автентичність та незалежність. Поєднання культурної спадщини з сучасним комфортом у серці історичного району.';
            localStorage.setItem('content_uk_about-text-2', aboutText2.value);
        }
        
        // Location
        const locationTitle = document.getElementById('location-title');
        const locationText = document.getElementById('location-text');
        
        if (locationTitle && !localStorage.getItem('content_uk_location-title')) {
            locationTitle.value = 'Розташування';
            localStorage.setItem('content_uk_location-title', locationTitle.value);
        }
        
        if (locationText && !localStorage.getItem('content_uk_location-text')) {
            locationText.value = 'Печерський район - історичний центр Києва з видами на Києво-Печерську Лавру та Ботанічний сад. Ідеальне розташування для тих, хто цінує приватність та комфорт.';
            localStorage.setItem('content_uk_location-text', locationText.value);
        }
        
        // Technologies
        const techTitle = document.getElementById('tech-title');
        
        if (techTitle && !localStorage.getItem('content_uk_tech-title')) {
            techTitle.value = 'Технології';
            localStorage.setItem('content_uk_tech-title', techTitle.value);
        }
        
        // Tech items
        const techName1 = document.getElementById('tech-name-1');
        const techDesc1 = document.getElementById('tech-desc-1');
        const techName2 = document.getElementById('tech-name-2');
        const techDesc2 = document.getElementById('tech-desc-2');
        const techName3 = document.getElementById('tech-name-3');
        const techDesc3 = document.getElementById('tech-desc-3');
        
        if (techName1 && !localStorage.getItem('content_uk_tech-name-1')) {
            techName1.value = 'Розумний будинок';
            localStorage.setItem('content_uk_tech-name-1', techName1.value);
        }
        
        if (techDesc1 && !localStorage.getItem('content_uk_tech-desc-1')) {
            techDesc1.value = 'Повна автоматизація управління освітленням, кліматом та безпекою.';
            localStorage.setItem('content_uk_tech-desc-1', techDesc1.value);
        }
        
        if (techName2 && !localStorage.getItem('content_uk_tech-name-2')) {
            techName2.value = 'Енергоефективність';
            localStorage.setItem('content_uk_tech-name-2', techName2.value);
        }
        
        if (techDesc2 && !localStorage.getItem('content_uk_tech-desc-2')) {
            techDesc2.value = 'Сучасні технології теплоізоляції та енергозбереження.';
            localStorage.setItem('content_uk_tech-desc-2', techDesc2.value);
        }
        
        if (techName3 && !localStorage.getItem('content_uk_tech-name-3')) {
            techName3.value = 'Преміальні матеріали';
            localStorage.setItem('content_uk_tech-name-3', techName3.value);
        }
        
        if (techDesc3 && !localStorage.getItem('content_uk_tech-desc-3')) {
            techDesc3.value = 'Натуральний камінь, дерево та інші екологічно чисті матеріали.';
            localStorage.setItem('content_uk_tech-desc-3', techDesc3.value);
        }
    }
    
    function updateEnglishContent() {
        // Building info
        const buildingName = document.getElementById('building-name');
        const buildingSlogan = document.getElementById('building-slogan');
        const buildingAddress = document.getElementById('building-address');
        const aboutText1 = document.getElementById('about-text-1');
        const aboutText2 = document.getElementById('about-text-2');
        
        // Only update if not already set by user
        if (buildingName && !localStorage.getItem('content_en_building-name')) {
            buildingName.value = 'BOUTIQUE APARTMENTS KYIV';
            localStorage.setItem('content_en_building-name', buildingName.value);
        }
        
        if (buildingSlogan && !localStorage.getItem('content_en_building-slogan')) {
            buildingSlogan.value = 'Your landscape, your inspiration';
            localStorage.setItem('content_en_building-slogan', buildingSlogan.value);
        }
        
        if (buildingAddress && !localStorage.getItem('content_en_building-address')) {
            buildingAddress.value = 'Lomakivska / Michurina Street, 55, Pechersk district, Kyiv';
            localStorage.setItem('content_en_building-address', buildingAddress.value);
        }
        
        if (aboutText1 && !localStorage.getItem('content_en_about-text-1')) {
            aboutText1.value = '6 residences on Pechersk slopes. Privacy of the historic centre with views of Kyiv Pechersk Lavra and the Botanical Garden.';
            localStorage.setItem('content_en_about-text-1', aboutText1.value);
        }
        
        if (aboutText2 && !localStorage.getItem('content_en_about-text-2')) {
            aboutText2.value = 'An exclusive location for those who value authenticity and independence. The fusion of cultural heritage with contemporary comfort in the heart of the historic district.';
            localStorage.setItem('content_en_about-text-2', aboutText2.value);
        }
        
        // Location
        const locationTitle = document.getElementById('location-title');
        const locationText = document.getElementById('location-text');
        
        if (locationTitle && !localStorage.getItem('content_en_location-title')) {
            locationTitle.value = 'Location';
            localStorage.setItem('content_en_location-title', locationTitle.value);
        }
        
        if (locationText && !localStorage.getItem('content_en_location-text')) {
            locationText.value = 'Pechersk district is the historic center of Kyiv with views of the Kyiv Pechersk Lavra and the Botanical Garden. The perfect location for those who value privacy and comfort.';
            localStorage.setItem('content_en_location-text', locationText.value);
        }
        
        // Technologies
        const techTitle = document.getElementById('tech-title');
        
        if (techTitle && !localStorage.getItem('content_en_tech-title')) {
            techTitle.value = 'Technologies';
            localStorage.setItem('content_en_tech-title', techTitle.value);
        }
        
        // Tech items
        const techName1 = document.getElementById('tech-name-1');
        const techDesc1 = document.getElementById('tech-desc-1');
        const techName2 = document.getElementById('tech-name-2');
        const techDesc2 = document.getElementById('tech-desc-2');
        const techName3 = document.getElementById('tech-name-3');
        const techDesc3 = document.getElementById('tech-desc-3');
        
        if (techName1 && !localStorage.getItem('content_en_tech-name-1')) {
            techName1.value = 'Smart Home';
            localStorage.setItem('content_en_tech-name-1', techName1.value);
        }
        
        if (techDesc1 && !localStorage.getItem('content_en_tech-desc-1')) {
            techDesc1.value = 'Complete automation of lighting, climate and security management.';
            localStorage.setItem('content_en_tech-desc-1', techDesc1.value);
        }
        
        if (techName2 && !localStorage.getItem('content_en_tech-name-2')) {
            techName2.value = 'Energy Efficiency';
            localStorage.setItem('content_en_tech-name-2', techName2.value);
        }
        
        if (techDesc2 && !localStorage.getItem('content_en_tech-desc-2')) {
            techDesc2.value = 'Modern thermal insulation and energy saving technologies.';
            localStorage.setItem('content_en_tech-desc-2', techDesc2.value);
        }
        
        if (techName3 && !localStorage.getItem('content_en_tech-name-3')) {
            techName3.value = 'Premium Materials';
            localStorage.setItem('content_en_tech-name-3', techName3.value);
        }
        
        if (techDesc3 && !localStorage.getItem('content_en_tech-desc-3')) {
            techDesc3.value = 'Natural stone, wood and other environmentally friendly materials.';
            localStorage.setItem('content_en_tech-desc-3', techDesc3.value);
        }
    }
    
    function saveAllChanges() {
        // In a real application, this would save changes to the server
        
        // Apply visibility settings
        apartmentCheckboxes.forEach(checkbox => {
            const apartmentId = checkbox.id;
            const isVisible = checkbox.checked;
            
            // Save to localStorage
            localStorage.setItem(`apartment_${apartmentId}_visible`, isVisible);
        });
        
        // Apply status settings
        statusSelects.forEach(select => {
            const statusId = select.id;
            const statusValue = select.value;
            
            // Save to localStorage
            localStorage.setItem(`apartment_${statusId}_status`, statusValue);
        });
        
        // Save all input values
        allInputs.forEach(input => {
            const inputId = input.id;
            const inputValue = input.value;
            const lang = localStorage.getItem('selectedLanguage') || 'uk';
            
            // Save to localStorage with language prefix
            localStorage.setItem(`content_${lang}_${inputId}`, inputValue);
        });
        
        alert('Все изменения успешно сохранены!');
    }
    
    function showAutosaveIndicator() {
        autosaveIndicator.classList.add('show');
        
        setTimeout(() => {
            autosaveIndicator.classList.remove('show');
        }, 2000);
    }
});
