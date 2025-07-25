// Admin panel functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const adminLoginForm = document.getElementById('admin-login-form');
    const adminContent = document.getElementById('admin-content');
    const logoutBtn = document.getElementById('admin-logout');
    const saveChangesBtn = document.getElementById('save-changes');
    const langTabs = document.querySelectorAll('.lang-tab');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('admin-password');
    
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
        localStorage.clear();
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
            
            // Hardcoded credentials for direct comparison
            const hardcodedUsername = 'MichBoutique_Admin';
            const hardcodedPassword = 'P3ch3rsk_Ky1v_2025!';
            
            // Case-insensitive username comparison and exact password match
            if (username.toLowerCase() === hardcodedUsername.toLowerCase() && 
                password === hardcodedPassword) {
                console.log('Login successful');
                localStorage.setItem('adminLoggedIn', 'true');
                showAdminPanel();
            } else {
                console.log('Login failed. Username: ' + (username.toLowerCase() === hardcodedUsername.toLowerCase() ? 'correct' : 'incorrect') + 
                          ', Password: ' + (password === hardcodedPassword ? 'correct' : 'incorrect'));
                console.log('Expected password: ' + hardcodedPassword.length + ' chars');
                
                // Force clear localStorage to ensure clean state
                localStorage.removeItem('adminLoggedIn');
                alert('Неверное имя пользователя или пароль');
            }
        });
    }
    
    // Logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('adminLoggedIn');
            hideAdminPanel();
        });
    }
    
    // Save changes button
    if (saveChangesBtn) {
        saveChangesBtn.addEventListener('click', function() {
            saveChanges();
        });
    }
    
    // Language tabs
    langTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            
            // Update active tab
            langTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Load content for selected language
            loadLanguageContent(lang);
        });
    });
    
    // Apartment visibility checkboxes
    const apartmentCheckboxes = document.querySelectorAll('#apartment-list input[type="checkbox"]');
    apartmentCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const apartmentId = this.id;
            const isVisible = this.checked;
            
            // Save visibility state to localStorage
            localStorage.setItem(`apartment_${apartmentId}_visible`, isVisible);
        });
        
        // Load saved visibility state
        const apartmentId = checkbox.id;
        const savedState = localStorage.getItem(`apartment_${apartmentId}_visible`);
        if (savedState !== null) {
            checkbox.checked = savedState === 'true';
        }
    });
    
    // Media actions
    const replaceButtons = document.querySelectorAll('.replace-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');
    const addNewButtons = document.querySelectorAll('.add-new');
    
    replaceButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const mediaItem = this.closest('.media-item');
            const img = mediaItem.querySelector('img');
            
            // In a real application, this would open a file picker
            alert('В реальном приложении здесь будет открываться выбор файла для замены изображения');
        });
    });
    
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const mediaItem = this.closest('.media-item');
            
            if (confirm('Вы уверены, что хотите удалить это изображение?')) {
                // In a real application, this would delete the file
                mediaItem.style.opacity = '0.5';
                btn.textContent = 'Удалено';
                btn.disabled = true;
            }
        });
    });
    
    addNewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // In a real application, this would open a file picker
            alert('В реальном приложении здесь будет открываться выбор файла для добавления нового изображения');
        });
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
        // In a real application, this would load content from the server or translations object
        // For now, we'll just simulate it
        const buildingName = document.getElementById('building-name');
        const buildingSlogan = document.getElementById('building-slogan');
        const buildingAddress = document.getElementById('building-address');
        const aboutText1 = document.getElementById('about-text-1');
        const aboutText2 = document.getElementById('about-text-2');
        
        if (lang === 'uk') {
            if (buildingName) buildingName.value = 'BOUTIQUE APARTMENTS KYIV';
            if (buildingSlogan) buildingSlogan.value = 'Ваш краєвид, ваше натхнення';
            if (buildingAddress) buildingAddress.value = 'вулиця Ломаківська / Мічуріна, 55, Печерський район, м. Київ';
            if (aboutText1) aboutText1.value = '6 резиденцій на Печерських схилах. Приватність історичного центру з видами на Києво-Печерську Лавру та Ботанічний сад.';
            if (aboutText2) aboutText2.value = 'Ексклюзивна локація для тих, хто цінує автентичність та незалежність. Поєднання культурної спадщини з сучасним комфортом у серці історичного району.';
        } else if (lang === 'en') {
            if (buildingName) buildingName.value = 'BOUTIQUE APARTMENTS KYIV';
            if (buildingSlogan) buildingSlogan.value = 'Your landscape, your inspiration';
            if (buildingAddress) buildingAddress.value = 'Lomakivska / Michurina Street, 55, Pechersk district, Kyiv';
            if (aboutText1) aboutText1.value = '6 residences on Pechersk slopes. Privacy of the historic centre with views of Kyiv Pechersk Lavra and the Botanical Garden.';
            if (aboutText2) aboutText2.value = 'An exclusive location for those who value authenticity and independence. The fusion of cultural heritage with contemporary comfort in the heart of the historic district.';
        }
    }
    
    function saveChanges() {
        // In a real application, this would save changes to the server
        alert('Изменения сохранены!');
        
        // Apply visibility settings
        apartmentCheckboxes.forEach(checkbox => {
            const apartmentId = checkbox.id;
            const isVisible = checkbox.checked;
            
            // In a real application, this would update the main page
            console.log(`Apartment ${apartmentId} visibility: ${isVisible}`);
        });
    }
});
