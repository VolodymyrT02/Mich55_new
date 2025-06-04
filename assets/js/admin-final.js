// Final Admin Panel Functionality
document.addEventListener('DOMContentLoaded', function() {
    // --- Credentials & State ---
    const adminUsername = 'MichBoutique_Admin';
    const adminPassword = 'P3ch3rsk_Ky1v_2025!';
    let isLoggedIn = false;
    let currentLang = 'uk';
    let siteData = {}; // This will hold the data loaded from data.json
    let autosaveTimeout;

    // --- DOM Elements ---
    const loginForm = document.getElementById('login-form');
    const adminLoginForm = document.getElementById('admin-login-form');
    const adminContent = document.getElementById('admin-content');
    const usernameInput = document.getElementById('admin-username');
    const passwordInput = document.getElementById('admin-password');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const logoutBtn = document.getElementById('admin-logout');
    const langTabs = document.querySelectorAll('.lang-tab');
    const autosaveIndicator = document.querySelector('.autosave-indicator');
    const sectionNavBtns = document.querySelectorAll('.nav-btn');
    const apartmentSelectorBtns = document.querySelectorAll('.apt-select-btn');
    const apartmentContentDivs = document.querySelectorAll('.apartment-content');
    const addTechBtn = document.getElementById('add-tech');
    const addMaterialBtn = document.getElementById('add-material');
    const updateMapBtn = document.getElementById('update-map');
    const exportJsonBtn = document.getElementById('export-json');
    const exportArchiveBtn = document.getElementById('export-archive');

    // --- Initialization ---
    checkLoginStatus();
    if (isLoggedIn) {
        loadInitialData();
    }

    // --- Event Listeners ---

    // Password visibility toggle
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
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
            if (username.toLowerCase() === adminUsername.toLowerCase() && password === adminPassword) {
                localStorage.setItem('adminLoggedIn', 'true');
                showAdminContent();
                loadInitialData(); // Load data after successful login
            } else {
                alert('Невірне ім\'я користувача або пароль.');
            }
        });
    }

    // Logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Ви впевнені, що хочете вийти? Незбережені зміни можуть бути втрачені.')) {
                localStorage.removeItem('adminLoggedIn');
                showLoginForm();
            }
        });
    }

    // Language tabs
    langTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Save current language data before switching
            gatherDataFromFields(); 
            
            currentLang = this.getAttribute('data-lang');
            langTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            populateFieldsWithData(); // Populate fields with new language data
            localStorage.setItem('selectedLanguage', currentLang);
        });
    });

    // Section navigation buttons
    sectionNavBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
        });
    });

    // Apartment selector buttons
    apartmentSelectorBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const aptNumber = this.getAttribute('data-apt');
            apartmentSelectorBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            apartmentContentDivs.forEach(div => {
                div.classList.remove('active');
                if (div.classList.contains(`apt-${aptNumber}`)) {
                    div.classList.add('active');
                }
            });
        });
    });

    // Input fields change listener (for autosave)
    const allInputs = document.querySelectorAll('#admin-content input, #admin-content textarea, #admin-content select');
    allInputs.forEach(input => {
        input.addEventListener('input', scheduleAutosave);
        input.addEventListener('change', scheduleAutosave); // For selects and checkboxes
    });

    // Media action buttons (Placeholders)
    document.querySelectorAll('.replace-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const mediaItem = this.closest('.media-item');
            const mediaType = mediaItem.querySelector('img') ? 'image' : 'video';
            const inputId = `replace-${mediaType}-${Date.now()}`;
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = mediaType === 'image' ? 'image/*' : 'video/*';
            fileInput.style.display = 'none';
            fileInput.id = inputId;
            document.body.appendChild(fileInput);
            fileInput.click();
            
            fileInput.onchange = (event) => {
                const file = event.target.files[0];
                if (file) {
                    console.log(`Replacing ${mediaType} with: ${file.name}`);
                    // In a real app: upload file, update src, update siteData
                    const previewElement = mediaItem.querySelector('.media-preview');
                    if (previewElement) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            previewElement.src = e.target.result;
                        }
                        reader.readAsDataURL(file);
                    }
                    alert(`Файл ${file.name} обрано для заміни. Збережіть зміни.`);
                    scheduleAutosave();
                }
                document.body.removeChild(fileInput);
            };
        });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('Ви впевнені, що хочете видалити цей медіафайл?')) {
                const mediaItem = this.closest('.media-item');
                // In a real app: delete file from server, update siteData
                mediaItem.remove(); 
                console.log('Media item removed.');
                alert('Медіафайл видалено (візуально). Збережіть зміни.');
                scheduleAutosave();
            }
        });
    });

    document.querySelectorAll('.add-new label').forEach(label => {
        label.addEventListener('click', function() {
            const input = this.querySelector('input[type="file"]');
            if (input) {
                input.onchange = (event) => {
                    const file = event.target.files[0];
                    if (file) {
                        console.log(`Adding new media: ${file.name}`);
                        // In a real app: upload file, create new media item element, update siteData
                        const mediaItemsContainer = this.closest('.media-items');
                        const newMediaItem = document.createElement('div');
                        newMediaItem.className = 'media-item';
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            const isImage = file.type.startsWith('image');
                            newMediaItem.innerHTML = `
                                <${isImage ? 'img' : 'video'} src="${e.target.result}" alt="Новий медіафайл" class="media-preview" ${isImage ? '' : 'controls'}>
                                <div class="media-actions">
                                    <button class="replace-btn"><i class="fas fa-sync-alt"></i> Замінити</button>
                                    <button class="delete-btn"><i class="fas fa-trash"></i> Видалити</button>
                                </div>
                            `;
                            // Re-attach event listeners to new buttons
                            newMediaItem.querySelector('.replace-btn').addEventListener('click', /* ... */);
                            newMediaItem.querySelector('.delete-btn').addEventListener('click', /* ... */);
                            mediaItemsContainer.insertBefore(newMediaItem, label.closest('.add-new'));
                        }
                        reader.readAsDataURL(file);
                        alert(`Файл ${file.name} додано (візуально). Збережіть зміни.`);
                        scheduleAutosave();
                    }
                };
            }
        });
    });

    // Add Technology/Material buttons
    if (addTechBtn) {
        addTechBtn.addEventListener('click', function() {
            addDynamicItem('tech');
        });
    }
    if (addMaterialBtn) {
        addMaterialBtn.addEventListener('click', function() {
            addDynamicItem('material');
        });
    }

    // Update Map button (Placeholder)
    if (updateMapBtn) {
        updateMapBtn.addEventListener('click', function() {
            const address = document.getElementById('map-address').value;
            const iframe = document.querySelector('.map-preview iframe');
            // Basic update - replace spaces with + for URL
            const embedUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(address)}`; // Needs API key
            // iframe.src = embedUrl; // Uncomment when API key is available
            alert('Оновлення карти потребує Google Maps API ключа. Поки що це лише демонстрація.');
            console.log(`Updating map with address: ${address}`);
            scheduleAutosave();
        });
    }

    // Export buttons (Placeholders)
    if (exportJsonBtn) {
        exportJsonBtn.addEventListener('click', function() {
            gatherDataFromFields(); // Ensure latest data is captured
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
            alert('JSON файл експортовано.');
        });
    }

    if (exportArchiveBtn) {
        exportArchiveBtn.addEventListener('click', function() {
            alert('Функція експорту архіву ще не реалізована. Потрібна серверна частина або додаткові інструменти.');
            // In a real app, this would trigger a server-side process 
            // to collect all files (HTML, CSS, JS, images, videos, data.json) and zip them.
        });
    }

    // --- Functions ---

    function checkLoginStatus() {
        isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
        if (isLoggedIn) {
            showAdminContent();
            // Load saved language preference
            const savedLanguage = localStorage.getItem('selectedLanguage') || 'uk';
            currentLang = savedLanguage;
            langTabs.forEach(tab => {
                tab.classList.toggle('active', tab.getAttribute('data-lang') === currentLang);
            });
        } else {
            showLoginForm();
        }
    }

    function showAdminContent() {
        if (adminLoginForm) adminLoginForm.style.display = 'none';
        if (adminContent) adminContent.style.display = 'block'; // Use block instead of flex
        isLoggedIn = true;
    }

    function showLoginForm() {
        if (adminLoginForm) adminLoginForm.style.display = 'block';
        if (adminContent) adminContent.style.display = 'none';
        isLoggedIn = false;
    }

    function showSection(sectionId) {
        document.querySelectorAll('.admin-section').forEach(section => {
            section.classList.remove('active-section');
        });
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('active-section');
        }
        // Update sidebar active link (optional, if sidebar exists)
        // document.querySelectorAll('.nav-link').forEach(link => { ... });
    }

    function loadInitialData() {
        // Try loading from localStorage first (autosaved data)
        const autosavedData = localStorage.getItem('autosavedSiteData');
        if (autosavedData) {
            try {
                siteData = JSON.parse(autosavedData);
                console.log('Loaded data from autosave.');
                populateFieldsWithData();
                return; // Exit if loaded from autosave
            } catch (e) {
                console.error('Error parsing autosaved data:', e);
                localStorage.removeItem('autosavedSiteData'); // Clear corrupted data
            }
        }

        // If no valid autosave, fetch from data.json
        fetch('data.json') // Assuming data.json is in the same directory
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                siteData = data;
                console.log('Loaded data from data.json');
                populateFieldsWithData();
            })
            .catch(error => {
                console.error('Error loading data.json:', error);
                alert('Помилка завантаження даних сайту (data.json). Адмін-панель може працювати некоректно.');
                // Initialize with empty structure if load fails
                siteData = { uk: {}, en: {} }; 
            });
    }

    function populateFieldsWithData() {
        if (!siteData || !siteData[currentLang]) {
            console.warn(`No data found for language: ${currentLang}`);
            // Optionally clear fields or show a message
            // clearAllFields(); 
            return;
        }

        const langData = siteData[currentLang];

        // --- Populate Main Info ---
        document.getElementById('building-name').value = langData.main_info?.title || '';
        // Corrected mapping for subtitle1 and subtitle2
        const sloganInput = document.getElementById('building-slogan');
        if (sloganInput) {
             sloganInput.value = `${langData.main_info?.subtitle1 || ''} ${langData.main_info?.subtitle2 || ''}`.trim();
        }
        document.getElementById('building-address').value = langData.main_info?.address || '';
        document.getElementById('building-status').value = langData.main_info?.commissioning_date || '';
        // Split description into paragraphs based on newline
        const descriptionParts = (langData.main_info?.description || '').split('\n\n');
        document.getElementById('about-text-1').value = descriptionParts[0] || '';
        document.getElementById('about-text-2').value = descriptionParts[1] || '';
        document.getElementById('about-text-3').value = descriptionParts[2] || '';
        // TODO: Populate facade photos (requires dynamic element creation based on siteData.uk.main_info.facade_photos)

        // --- Populate Lobby ---
        document.getElementById('lobby-title').value = langData.lobby?.title || '';
        // TODO: Populate lobby photos (dynamic)

        // --- Populate Video ---
        document.getElementById('video-title').value = langData.video?.title || '';
        // TODO: Populate video elements (dynamic)

        // --- Populate Technologies ---
        document.getElementById('tech-title').value = langData.technologies?.title || '';
        document.getElementById('tech-subtitle').value = langData.technologies?.subtitle || '';
        populateDynamicItems('tech', langData.technologies?.items || []);

        // --- Populate Materials ---
        document.getElementById('materials-title').value = langData.materials?.title || '';
        populateDynamicItems('material', langData.materials?.items || []);

        // --- Populate Apartments ---
        document.getElementById('apartments-title').value = langData.apartments?.title || '';
        const apartments = siteData.uk.apartments?.items || []; // Use UK structure for apartment list/status
        const apartmentListDiv = document.getElementById('apartment-list');
        apartmentListDiv.innerHTML = ''; // Clear existing list items
        apartments.forEach((apt, index) => {
            const aptId = apt.id || `apartment${index + 1}`;
            const aptName = siteData[currentLang]?.apartments?.items[index]?.name || apt.name; // Get name in current lang
            const status = apt.status || 'available'; // Status is likely language-independent
            
            const itemDiv = document.createElement('div');
            itemDiv.className = 'apartment-item';
            itemDiv.innerHTML = `
                <div class="apartment-details">
                    <input type="checkbox" id="${aptId}-visible" ${status !== 'sold' ? 'checked' : ''}> 
                    <label for="${aptId}-visible">${aptName}</label>
                </div>
                <div class="apartment-status">
                    <label for="${aptId}-status">Статус публікації:</label>
                    <select id="${aptId}-status" class="status-select">
                        <option value="available" ${status === 'available' ? 'selected' : ''}>Доступна</option>
                        <option value="reserved" ${status === 'reserved' ? 'selected' : ''}>Зарезервована</option>
                        <option value="sold" ${status === 'sold' ? 'selected' : ''}>Продана</option>
                    </select>
                </div>
            `;
            apartmentListDiv.appendChild(itemDiv);
            // Add change listeners for new elements
            itemDiv.querySelector('input[type="checkbox"]').addEventListener('change', scheduleAutosave);
            itemDiv.querySelector('select').addEventListener('change', scheduleAutosave);
        });

        // Populate details for each apartment
        apartments.forEach((apt, index) => {
            const aptNum = index + 1;
            const aptLangData = langData.apartments?.items[index];
            if (!aptLangData) return;

            document.getElementById(`apt${aptNum}-title`).value = aptLangData.name || '';
            document.getElementById(`apt${aptNum}-status`).value = aptLangData.commissioning_date || '';
            // Join details array into separate fields if needed, or use a single textarea
            document.getElementById(`apt${aptNum}-area-legal`).value = aptLangData.details?.[0]?.split(': ')[1] || '';
            document.getElementById(`apt${aptNum}-area-actual`).value = aptLangData.details?.[1]?.split(': ')[1] || '';
            document.getElementById(`apt${aptNum}-view`).value = aptLangData.details?.[2]?.split(': ')[1] || '';
            document.getElementById(`apt${aptNum}-price`).value = aptLangData.details?.[3]?.split(': ')[1] || '';
            document.getElementById(`apt${aptNum}-included`).value = aptLangData.details?.[4]?.split(': ')[1] || '';
            // TODO: Populate apartment plan & photos (dynamic)
        });

        // --- Populate Location ---
        document.getElementById('location-title').value = langData.location?.title || '';
        // Address for map is likely language-independent, take from 'uk' or 'en'
        document.getElementById('map-address').value = siteData.uk.location?.address || siteData.en.location?.address || ''; 

        // --- Populate Contacts ---
        document.getElementById('contacts-title').value = langData.contacts?.title || '';
        // Contact details are language-independent
        document.getElementById('contact-phone').value = siteData.uk.contacts?.phone || siteData.en.contacts?.phone || '';
        document.getElementById('contact-telegram').value = siteData.uk.contacts?.telegram || siteData.en.contacts?.telegram || '';
        document.getElementById('contact-whatsapp').value = siteData.uk.contacts?.whatsapp || siteData.en.contacts?.whatsapp || '';
        
        console.log(`Fields populated for language: ${currentLang}`);
    }
    
    function populateDynamicItems(type, items) {
        const containerId = type === 'tech' ? 'tech-items' : 'materials-items';
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = ''; // Clear existing items

        items.forEach((item, index) => {
            const itemId = `${type}-${index + 1}`;
            const itemDiv = document.createElement('div');
            itemDiv.className = 'tech-item'; // Use same class for styling
            itemDiv.innerHTML = `
                <div class="form-group">
                    <label for="${itemId}-name">Назва:</label>
                    <input type="text" id="${itemId}-name" data-translate value="${item.name || ''}">
                </div>
                <div class="form-group">
                    <label for="${itemId}-desc">Опис:</label>
                    <textarea id="${itemId}-desc" data-translate rows="3">${item.description || ''}</textarea>
                </div>
                <button class="admin-button danger delete-dynamic-item" data-type="${type}" data-index="${index}" style="margin-top: 5px;">
                    <i class="fas fa-trash"></i> Видалити
                </button>
            `;
            container.appendChild(itemDiv);
            // Add listeners for new inputs
            itemDiv.querySelectorAll('input, textarea').forEach(input => {
                input.addEventListener('input', scheduleAutosave);
            });
            itemDiv.querySelector('.delete-dynamic-item').addEventListener('click', function() {
                if (confirm('Ви впевнені, що хочете видалити цей елемент?')) {
                    itemDiv.remove();
                    scheduleAutosave();
                }
            });
        });
    }

    function gatherDataFromFields() {
        if (!siteData || !siteData[currentLang]) {
             console.warn(`Cannot gather data, structure for language ${currentLang} not initialized.`);
             // Initialize if missing
             if (!siteData) siteData = {};
             if (!siteData[currentLang]) siteData[currentLang] = { main_info:{}, lobby:{}, video:{}, technologies:{items:[]}, materials:{items:[]}, apartments:{items:[]}, location:{}, contacts:{} };
        }
        
        const langData = siteData[currentLang];

        // --- Gather Main Info ---
        if (!langData.main_info) langData.main_info = {};
        langData.main_info.title = document.getElementById('building-name').value;
        // Split slogan back (assuming first part is subtitle1, rest is subtitle2)
        const slogan = document.getElementById('building-slogan').value.split(',');
        langData.main_info.subtitle1 = slogan[0]?.trim() || '';
        langData.main_info.subtitle2 = slogan.slice(1).join(',').trim() || '';
        langData.main_info.address = document.getElementById('building-address').value;
        langData.main_info.commissioning_date = document.getElementById('building-status').value;
        langData.main_info.description = [
            document.getElementById('about-text-1').value,
            document.getElementById('about-text-2').value,
            document.getElementById('about-text-3').value
        ].filter(p => p.trim()).join('\n\n');
        // TODO: Gather facade photos (requires reading dynamic elements)

        // --- Gather Lobby ---
        if (!langData.lobby) langData.lobby = {};
        langData.lobby.title = document.getElementById('lobby-title').value;
        // TODO: Gather lobby photos (dynamic)

        // --- Gather Video ---
        if (!langData.video) langData.video = {};
        langData.video.title = document.getElementById('video-title').value;
        // TODO: Gather video sources (dynamic)

        // --- Gather Technologies ---
        if (!langData.technologies) langData.technologies = { items: [] };
        langData.technologies.title = document.getElementById('tech-title').value;
        langData.technologies.subtitle = document.getElementById('tech-subtitle').value;
        langData.technologies.items = gatherDynamicItems('tech');

        // --- Gather Materials ---
        if (!langData.materials) langData.materials = { items: [] };
        langData.materials.title = document.getElementById('materials-title').value;
        langData.materials.items = gatherDynamicItems('material');

        // --- Gather Apartments ---
        if (!langData.apartments) langData.apartments = { items: [] };
        langData.apartments.title = document.getElementById('apartments-title').value;
        const apartmentItems = document.querySelectorAll('#apartment-list .apartment-item');
        const numApartments = apartmentItems.length;
        // Ensure siteData.uk.apartments.items exists and has the right length
        if (!siteData.uk?.apartments?.items || siteData.uk.apartments.items.length !== numApartments) {
             siteData.uk.apartments.items = Array(numApartments).fill(null).map(() => ({ id: '', name: '', status: 'available', details: [], plan_photo: '', photos: [] }));
        }
        // Ensure siteData.en.apartments.items exists and has the right length
         if (!siteData.en?.apartments?.items || siteData.en.apartments.items.length !== numApartments) {
             siteData.en.apartments.items = Array(numApartments).fill(null).map(() => ({ id: '', name: '', status: 'available', details: [], plan_photo: '', photos: [] }));
        }
        
        apartmentItems.forEach((item, index) => {
            const aptIdInput = item.querySelector('input[type="checkbox"]');
            const statusSelect = item.querySelector('select');
            const aptId = aptIdInput.id.replace('-visible', '');
            const status = statusSelect.value;
            const isVisible = aptIdInput.checked;

            // Update status in UK structure (status is language independent)
            if (siteData.uk.apartments.items[index]) {
                siteData.uk.apartments.items[index].id = aptId;
                siteData.uk.apartments.items[index].status = status;
            }
             // Update status in EN structure (status is language independent)
            if (siteData.en.apartments.items[index]) {
                siteData.en.apartments.items[index].id = aptId;
                siteData.en.apartments.items[index].status = status;
            }

            // Gather details for the current language
            const aptNum = index + 1;
            if (!langData.apartments.items[index]) langData.apartments.items[index] = { details: [] }; // Initialize if needed
            const currentAptData = langData.apartments.items[index];
            currentAptData.id = aptId;
            currentAptData.name = document.getElementById(`apt${aptNum}-title`).value;
            currentAptData.commissioning_date = document.getElementById(`apt${aptNum}-status`).value;
            currentAptData.details = [
                `Юридична площа: ${document.getElementById(`apt${aptNum}-area-legal`).value}`,
                `Фактично: ${document.getElementById(`apt${aptNum}-area-actual`).value}`,
                `Вид: ${document.getElementById(`apt${aptNum}-view`).value}`,
                `Вартість: ${document.getElementById(`apt${aptNum}-price`).value}`,
                `Включено: ${document.getElementById(`apt${aptNum}-included`).value}`
            ];
             // TODO: Gather apartment plan & photos (dynamic)
        });

        // --- Gather Location ---
        if (!langData.location) langData.location = {};
        langData.location.title = document.getElementById('location-title').value;
        // Address is language-independent, update in both 'uk' and 'en'
        const mapAddress = document.getElementById('map-address').value;
        if (!siteData.uk.location) siteData.uk.location = {};
        if (!siteData.en.location) siteData.en.location = {};
        siteData.uk.location.address = mapAddress;
        siteData.en.location.address = mapAddress;

        // --- Gather Contacts ---
        if (!langData.contacts) langData.contacts = {};
        langData.contacts.title = document.getElementById('contacts-title').value;
        // Contact details are language-independent, update in both 'uk' and 'en'
        const phone = document.getElementById('contact-phone').value;
        const telegram = document.getElementById('contact-telegram').value;
        const whatsapp = document.getElementById('contact-whatsapp').value;
        if (!siteData.uk.contacts) siteData.uk.contacts = {};
        if (!siteData.en.contacts) siteData.en.contacts = {};
        siteData.uk.contacts.phone = phone;
        siteData.en.contacts.phone = phone;
        siteData.uk.contacts.telegram = telegram;
        siteData.en.contacts.telegram = telegram;
        siteData.uk.contacts.whatsapp = whatsapp;
        siteData.en.contacts.whatsapp = whatsapp;
        
        console.log(`Data gathered for language: ${currentLang}`);
    }
    
    function gatherDynamicItems(type) {
        const containerId = type === 'tech' ? 'tech-items' : 'materials-items';
        const container = document.getElementById(containerId);
        const items = [];
        if (container) {
            container.querySelectorAll('.tech-item').forEach(itemDiv => {
                const nameInput = itemDiv.querySelector('input[id*="-name"]');
                const descTextarea = itemDiv.querySelector('textarea[id*="-desc"]');
                if (nameInput && descTextarea) {
                    items.push({
                        name: nameInput.value,
                        description: descTextarea.value
                    });
                }
            });
        }
        return items;
    }

    function addDynamicItem(type) {
        const containerId = type === 'tech' ? 'tech-items' : 'materials-items';
        const container = document.getElementById(containerId);
        if (!container) return;

        const itemCount = container.children.length; // Index will be itemCount
        const itemId = `${type}-${itemCount + 1}`;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'tech-item';
        itemDiv.innerHTML = `
            <div class="form-group">
                <label for="${itemId}-name">Назва:</label>
                <input type="text" id="${itemId}-name" data-translate value="">
            </div>
            <div class="form-group">
                <label for="${itemId}-desc">Опис:</label>
                <textarea id="${itemId}-desc" data-translate rows="3"></textarea>
            </div>
            <button class="admin-button danger delete-dynamic-item" data-type="${type}" data-index="${itemCount}" style="margin-top: 5px;">
                <i class="fas fa-trash"></i> Видалити
            </button>
        `;
        container.appendChild(itemDiv);

        // Add listeners for new inputs
        itemDiv.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', scheduleAutosave);
        });
        itemDiv.querySelector('.delete-dynamic-item').addEventListener('click', function() {
             if (confirm('Ви впевнені, що хочете видалити цей елемент?')) {
                itemDiv.remove();
                scheduleAutosave();
            }
        });
        scheduleAutosave(); // Save after adding
    }

    function scheduleAutosave() {
        clearTimeout(autosaveTimeout);
        autosaveTimeout = setTimeout(() => {
            autosave();
        }, 1500); // Autosave after 1.5 seconds of inactivity
    }

    function autosave() {
        gatherDataFromFields();
        try {
            localStorage.setItem('autosavedSiteData', JSON.stringify(siteData));
            showAutosaveIndicator();
            console.log('Autosaved data to localStorage');
        } catch (e) {
            console.error('Error autosaving data:', e);
            alert('Помилка автозбереження. Можливо, досягнуто ліміту localStorage.');
        }
    }

    function showAutosaveIndicator() {
        if (autosaveIndicator) {
            autosaveIndicator.style.display = 'flex';
            setTimeout(() => {
                autosaveIndicator.style.display = 'none';
            }, 2000);
        }
    }

});

