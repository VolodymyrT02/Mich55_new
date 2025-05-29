// Contact section functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get contact elements
    const socialIcons = document.querySelectorAll('.social-icon');
    
    // Initialize social media icons as hidden (will be activated later)
    socialIcons.forEach(icon => {
        icon.style.visibility = 'hidden';
    });
    
    // Add click tracking for contact links
    const contactLinks = document.querySelectorAll('.contact-item a');
    contactLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Track contact interaction (can be expanded with analytics)
            console.log('Contact interaction:', this.href);
        });
    });
    
    // Add Telegram bot link functionality
    const telegramLink = document.querySelector('.contact-item a[href*="telegram"]');
    if (telegramLink) {
        telegramLink.addEventListener('click', function(e) {
            // Optional: Add custom behavior for Telegram link
            console.log('Telegram bot clicked');
        });
    }
    
    // Function to activate social media icons (for future use)
    window.activateSocialMedia = function(platform, url) {
        const icons = document.querySelectorAll('.social-icon');
        icons.forEach(icon => {
            if (icon.querySelector('i').classList.contains('fa-' + platform)) {
                icon.href = url;
                icon.style.visibility = 'visible';
            }
        });
    };
    
    // Example of how to activate social media (commented out for now)
    // activateSocialMedia('facebook', 'https://facebook.com/idgroup');
    // activateSocialMedia('instagram', 'https://instagram.com/idgroup');
    // activateSocialMedia('tiktok', 'https://tiktok.com/@idgroup');
});
