// Enhanced Admin Panel Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Admin credentials (in a real application, this would be handled server-side)
    const adminUsername = 'MichBoutique_Admin';
    const adminPassword = 'P3ch3rsk_Ky1v_2025!';
    
    // DOM Elements
    const loginForm = document.getElementById('login-form');
    const adminLoginForm = document.getElementById('admin-login-form');
    const adminContent = document.getElementById('admin-content');
    const usernameInput = document.getElementById('admin-username');
    const passwordInput = document.getElementById('admin-password');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const logoutBtn = document.getElementById('admin-logout');
    const saveChangesBtn = document.getElementById('save-changes');
    const navLinks = document.querySelectorAll('.nav-link');
    const langTabs = document.querySelectorAll('.lang-tab');
    const autosaveIndicator = document.querySelector('.autosave-indicator');
    const sectionNavBtns = document.querySelectorAll('.nav-btn');
    
    // Current state
    let currentLang = 'uk';
    let currentSection = 'main-section';
    let translations = {};
    let isLoggedIn = false;
    
    // Check if user is already logged in
    checkLoginStatus();
    
    // Toggle password visibility
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle eye icon
            const icon = togglePasswordBtn.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }
    
    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = usernameInput.value.trim();
            const password = passwordInput.value;
            
            console.log(`Login attempt: Username=${username}, Password length: ${password.length}`);
            
            // Compare credentials (case-insensitive for username)
            if (username.toLowerCase() === adminUsername.toLowerCase() && password === adminPassword) {
                console.log('Login successful');
                
                // Save login status to localStorage
                localStorage.setItem('adminLoggedIn', 'true');
                
                // Show admin content
                showAdminContent();
            } else {
                console.log(`Login failed. Username: ${username}, Password length: ${password.length}`);
                alert('Невірне ім\'я користувача або пароль. Спробуйте ще раз.');
            }
        });
    }
    
    // Logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // Clear login status
            localStorage.removeItem('adminLoggedIn');
            
            // Show login form
            showLoginForm();
        });
    }
    
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get section ID
            const sectionId = this.getAttribute('data-section');
            
            // Update active link
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
            });
            this.classList.add('active');
            
            // Show section
            showSection(sectionId);
        });
    });
    
    // Section navigation buttons
    sectionNavBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            
            // Update active link in sidebar
            navLinks.forEach(navLink => {
                if (navLink.getAttribute('data-section') === sectionId) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            });
            
            // Show section
            showSection(sectionId);
        });
    });
    
    // Language tabs
    langTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            
            // Update active tab
            langTabs.forEach(langTab => {
                langTab.classList.remove('active');
            });
            this.classList.add('active');
            
            // Update current language
            currentLang = lang;
            
            // Update translations
            updateTranslations();
        });
    });
    
    // Save changes button
    if (saveChangesBtn) {
        saveChangesBtn.addEventListener('click', function() {
            // Save all changes
            saveAllChanges();
            
            // Show autosave indicator
            showAutosaveIndicator();
        });
    }
    
    // Add event listeners for form inputs to trigger autosave
    const formInputs = document.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.addEventListener('change', function() {
            // Autosave after a short delay
            setTimeout(function() {
                saveAllChanges();
                showAutosaveIndicator();
            }, 1000);
        });
    });
    
    // Add tech item button
    const addTechBtn = document.getElementById('add-tech');
    if (addTechBtn) {
        addTechBtn.addEventListener('click', function() {
            addTechItem();
        });
    }
    
    // Add material item button
    const addMaterialBtn = document.getElementById('add-material');
    if (addMaterialBtn) {
        addMaterialBtn.addEventListener('click', function() {
            addMaterialItem();
        });
    }
    
    // Functions
    
    // Check login status
    function checkLoginStatus() {
        const loggedIn = localStorage.getItem('adminLoggedIn') === 'true';
        
        if (loggedIn) {
            showAdminContent();
        } else {
            showLoginForm();
        }
    }
    
    // Show admin content
    function showAdminContent() {
        if (adminLoginForm) adminLoginForm.style.display = 'none';
        if (adminContent) adminContent.style.display = 'flex';
        isLoggedIn = true;
        
        // Load saved data
        loadSavedData();
    }
    
    // Show login form
    function showLoginForm() {
        if (adminLoginForm) adminLoginForm.style.display = 'block';
        if (adminContent) adminContent.style.display = 'none';
        isLoggedIn = false;
    }
    
    // Show section
    function showSection(sectionId) {
        // Hide all sections
        const sections = document.querySelectorAll('.admin-section');
        sections.forEach(section => {
            section.classList.remove('active-section');
        });
        
        // Show selected section
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('active-section');
            currentSection = sectionId;
        }
    }
    
    // Update translations
    function updateTranslations() {
        const translatableElements = document.querySelectorAll('[data-translate]');
        
        translatableElements.forEach(element => {
            const key = element.id;
            
            // Save current value if it's the active language
            if (translations[key] === undefined) {
                translations[key] = {};
            }
            
            if (currentLang === 'uk') {
                // If switching to Ukrainian, save English value
                if (element.value !== undefined) {
                    translations[key]['en'] = element.value;
                } else if (element.textContent !== undefined) {
                    translations[key]['en'] = element.textContent;
                }
                
                // Restore Ukrainian value if exists
                if (translations[key]['uk'] !== undefined) {
                    if (element.value !== undefined) {
                        element.value = translations[key]['uk'];
                    } else if (element.textContent !== undefined) {
                        element.textContent = translations[key]['uk'];
                    }
                }
            } else {
                // If switching to English, save Ukrainian value
                if (element.value !== undefined) {
                    translations[key]['uk'] = element.value;
                } else if (element.textContent !== undefined) {
                    translations[key]['uk'] = element.textContent;
                }
                
                // Restore English value if exists
                if (translations[key]['en'] !== undefined) {
                    if (element.value !== undefined) {
                        element.value = translations[key]['en'];
                    } else if (element.textContent !== undefined) {
                        element.textContent = translations[key]['en'];
                    }
                }
            }
        });
        
        // Save translations to localStorage
        localStorage.setItem('adminTranslations', JSON.stringify(translations));
    }
    
    // Save all changes
    function saveAllChanges() {
        // Save translations
        updateTranslations();
        
        // Save apartment visibility status
        const apartmentCheckboxes = document.querySelectorAll('.apartment-item input[type="checkbox"]');
        const apartmentStatus = {};
        
        apartmentCheckboxes.forEach(checkbox => {
            apartmentStatus[checkbox.id] = {
                visible: checkbox.checked,
                status: document.getElementById('status' + checkbox.id.replace('apartment', '')).value
            };
        });
        
        localStorage.setItem('apartmentStatus', JSON.stringify(apartmentStatus));
        
        // In a real application, this would send data to a server
        console.log('All changes saved');
    }
    
    // Load saved data
    function loadSavedData() {
        // Load translations
        const savedTranslations = localStorage.getItem('adminTranslations');
        if (savedTranslations) {
            translations = JSON.parse(savedTranslations);
        }
        
        // Load apartment visibility status
        const savedApartmentStatus = localStorage.getItem('apartmentStatus');
        if (savedApartmentStatus) {
            const apartmentStatus = JSON.parse(savedApartmentStatus);
            
            for (const id in apartmentStatus) {
                const checkbox = document.getElementById(id);
                if (checkbox) {
                    checkbox.checked = apartmentStatus[id].visible;
                }
                
                const statusSelect = document.getElementById('status' + id.replace('apartment', ''));
                if (statusSelect) {
                    statusSelect.value = apartmentStatus[id].status;
                }
            }
        }
    }
    
    // Show autosave indicator
    function showAutosaveIndicator() {
        autosaveIndicator.style.display = 'flex';
        
        // Hide after 2 seconds
        setTimeout(function() {
            autosaveIndicator.style.display = 'none';
        }, 2000);
    }
    
    // Add tech item
    function addTechItem() {
        const techItems = document.getElementById('tech-items');
        const itemCount = techItems.children.length + 1;
        
        const techItem = document.createElement('div');
        techItem.className = 'tech-item';
        techItem.innerHTML = `
            <div class="form-group">
                <label for="tech-name-${itemCount}">Назва:</label>
                <input type="text" id="tech-name-${itemCount}" data-translate value="">
            </div>
            <div class="form-group">
                <label for="tech-desc-${itemCount}">Опис:</label>
                <textarea id="tech-desc-${itemCount}" data-translate rows="3"></textarea>
            </div>
        `;
        
        techItems.appendChild(techItem);
    }
    
    // Add material item
    function addMaterialItem() {
        const materialsItems = document.getElementById('materials-items');
        const itemCount = materialsItems.children.length + 1;
        
        const materialItem = document.createElement('div');
        materialItem.className = 'tech-item';
        materialItem.innerHTML = `
            <div class="form-group">
                <label for="material-name-${itemCount}">Назва:</label>
                <input type="text" id="material-name-${itemCount}" data-translate value="">
            </div>
            <div class="form-group">
                <label for="material-desc-${itemCount}">Опис:</label>
                <textarea id="material-desc-${itemCount}" data-translate rows="3"></textarea>
            </div>
        `;
        
        materialsItems.appendChild(materialItem);
    }
});
