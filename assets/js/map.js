// Map integration for the landing page
document.addEventListener('DOMContentLoaded', function() {
    // Update Google Maps embed with correct location from user's link
    // https://maps.app.goo.gl/8MM4M63KYH4Wsr8M8
    const mapIframe = document.querySelector('.map-container iframe');
    
    // Set the correct map URL with the location from the user's link and satellite view (k)
    mapIframe.src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2540.7222285378507!2d30.54701287678437!3d50.44079997159774!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4cfa04a0c8e5b%3A0x3b31d1973ec8bea8!2z0YPQuy4g0JvQvtC80LDQutC-0LLRgdC60LDRjywgNTUsINCa0LjQtdCyLCAwMjAwMA!5e1!3m2!1sru!2sua!4v1716990994793!5m2!1sru!2sua";
    
    // Add custom marker style to make it more prominent
    const mapContainer = document.querySelector('.map-container');
    
    // Add map loading event
    mapIframe.addEventListener('load', function() {
        console.log('Map loaded successfully');
    });
});
