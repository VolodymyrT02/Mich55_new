// Main JavaScript for the landing page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize language
    const currentLang = localStorage.getItem('lang') || 'uk';
    setLanguage(currentLang);
    
    // Language switcher
    const langSwitch = document.getElementById('lang-switch');
    langSwitch.addEventListener('click', function() {
        const newLang = this.getAttribute('data-lang') === 'en' ? 'uk' : 'en';
        this.setAttribute('data-lang', newLang);
        this.textContent = newLang === 'en' ? 'UKR' : 'ENG';
        setLanguage(newLang);
        localStorage.setItem('lang', newLang);
    });
    
    // Set initial language button text
    if (currentLang === 'en') {
        langSwitch.setAttribute('data-lang', 'uk');
        langSwitch.textContent = 'UKR';
    } else {
        langSwitch.setAttribute('data-lang', 'en');
        langSwitch.textContent = 'ENG';
    }
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
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
                
                // Close mobile menu after clicking a link
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            }
        });
    });
    
    // Hero slider
    const heroSlider = document.querySelector('.hero-slider');
    const facadeImages = [
        'assets/images/facade/Michurina1.JPEG',
        'assets/images/facade/Michurina2.JPEG',
        'assets/images/facade/Michurina3.JPEG'
    ];
    
    // Create slider images
    facadeImages.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `Facade ${index + 1}`;
        img.className = index === 0 ? 'active' : '';
        heroSlider.appendChild(img);
    });
    
    // Auto slider
    let currentSlide = 0;
    const slides = heroSlider.querySelectorAll('img');
    
    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }
    
    setInterval(nextSlide, 5000);
    
    // Lobby gallery
    const lobbyGallery = document.querySelector('.lobby-gallery');
    const lobbyImages = [
        'assets/images/lobby/1.JPEG',
        'assets/images/lobby/3.JPEG',
        'assets/images/lobby/4.JPEG',
        'assets/images/lobby/5.JPEG',
        'assets/images/lobby/6.JPEG',
        'assets/images/lobby/7.JPEG',
        'assets/images/lobby/8.JPEG',
        'assets/images/lobby/9.JPEG'
    ];
    
    // Create lobby gallery
    lobbyImages.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `Lobby ${index + 1}`;
        lobbyGallery.appendChild(img);
    });
    
    // Apartment tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const apartmentDetails = document.querySelectorAll('.apartment-details');
    const apartmentImages = document.querySelectorAll('.apartment-image img');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const apartment = this.getAttribute('data-apartment');
            
            // Update active tab
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update active content
            apartmentDetails.forEach(detail => {
                detail.classList.remove('active');
                if (detail.getAttribute('data-apartment') === apartment) {
                    detail.classList.add('active');
                }
            });
            
            // Update active image
            apartmentImages.forEach(img => {
                img.classList.remove('active');
                if (img.getAttribute('data-apartment') === apartment) {
                    img.classList.add('active');
                }
            });
        });
    });
    
    // Set language function
    function setLanguage(lang) {
        document.documentElement.lang = lang;
        
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            
            if (translations[lang] && translations[lang][key]) {
                // Special handling for slogan with line break for mobile
                if (key === 'building_slogan') {
                    if (lang === 'uk') {
                        element.innerHTML = 'Ваш краєвид,<span class="line-break"></span>ваше натхнення';
                    } else {
                        element.innerHTML = 'Your landscape,<span class="line-break"></span>your inspiration';
                    }
                } else {
                    // For links, preserve the href attribute
                    if (element.tagName === 'A' && element.hasAttribute('href')) {
                        const href = element.getAttribute('href');
                        element.textContent = translations[lang][key];
                        element.setAttribute('href', href);
                    } else {
                        element.textContent = translations[lang][key];
                    }
                }
            }
        });
    }
    
    // Check for orientation changes to update slogan formatting
    window.addEventListener('resize', function() {
        setLanguage(document.documentElement.lang);
    });
});
