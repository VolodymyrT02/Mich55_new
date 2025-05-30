// Lightbox functionality for images and videos
document.addEventListener('DOMContentLoaded', function() {
    // Create lightbox elements
    const lightboxHTML = `
        <div id="lightbox" class="lightbox">
            <span class="close">&times;</span>
            <div class="lightbox-content">
                <img class="lightbox-image" id="lightbox-img">
                <video class="lightbox-video" id="lightbox-video" controls style="display: none;"></video>
            </div>
            <a class="prev">&#10094;</a>
            <a class="next">&#10095;</a>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxVideo = document.getElementById('lightbox-video');
    const close = document.querySelector('.close');
    const prev = document.querySelector('.prev');
    const next = document.querySelector('.next');

    // Add lightbox to lobby gallery
    addLightboxToGallery('.lobby-gallery img');

    // Add lightbox to facade slider
    addLightboxToGallery('.hero-slider img');

    // Add lightbox to apartment images
    addLightboxToGallery('.apartment-image img');

    // Add lightbox to horizontal galleries with apartment isolation
    document.querySelectorAll('.apartment-details').forEach(apartmentDetail => {
        if (apartmentDetail.querySelector('.horizontal-gallery')) {
            const apartmentId = apartmentDetail.getAttribute('data-apartment');
            const galleryImages = apartmentDetail.querySelectorAll('.horizontal-gallery img');
            
            // Add data attribute to identify which apartment each image belongs to
            galleryImages.forEach(img => {
                img.setAttribute('data-apartment-id', apartmentId);
            });
            
            // Add lightbox with strict isolation
            addLightboxToGallery(galleryImages, true);
        }
    });

    // Add lightbox to videos
    addLightboxToVideos();

    // Close lightbox when clicking on X
    close.addEventListener('click', function() {
        lightbox.style.display = 'none';
        lightboxVideo.pause();
        lightboxVideo.style.display = 'none';
        lightboxImg.style.display = 'block';
    });

    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
            lightboxVideo.pause();
            lightboxVideo.style.display = 'none';
            lightboxImg.style.display = 'block';
        }
    });

    // Global variables for gallery navigation
    let currentGallery = [];
    let currentIndex = 0;

    // Navigate through gallery images
    prev.addEventListener('click', function() {
        if (currentGallery.length <= 1) return;
        currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
        updateLightboxContent(currentGallery[currentIndex]);
    });

    next.addEventListener('click', function() {
        if (currentGallery.length <= 1) return;
        currentIndex = (currentIndex + 1) % currentGallery.length;
        updateLightboxContent(currentGallery[currentIndex]);
    });

    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox.style.display === 'block') {
            if (e.key === 'ArrowLeft') {
                prev.click();
            } else if (e.key === 'ArrowRight') {
                next.click();
            } else if (e.key === 'Escape') {
                close.click();
            }
        }
    });

    // Function to add lightbox to gallery images
    function addLightboxToGallery(selector, isolateGallery = false) {
        const images = typeof selector === 'string' ? document.querySelectorAll(selector) : selector;
        
        images.forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', function() {
                // Find all images in the same gallery
                let galleryImages;
                
                if (this.hasAttribute('data-apartment-id')) {
                    // For apartment galleries, strictly isolate by apartment ID
                    const apartmentId = this.getAttribute('data-apartment-id');
                    galleryImages = document.querySelectorAll(`img[data-apartment-id="${apartmentId}"]`);
                } else if (this.closest('.horizontal-gallery')) {
                    // Fallback for horizontal galleries without apartment ID
                    const activeApartment = this.closest('.apartment-details');
                    if (activeApartment) {
                        galleryImages = activeApartment.querySelectorAll('.horizontal-gallery img');
                    } else {
                        galleryImages = this.closest('.horizontal-gallery').querySelectorAll('img');
                    }
                } else if (this.closest('.lobby-gallery')) {
                    galleryImages = document.querySelectorAll('.lobby-gallery img');
                } else if (this.closest('.hero-slider')) {
                    galleryImages = document.querySelectorAll('.hero-slider img');
                } else if (this.closest('.apartment-image')) {
                    galleryImages = document.querySelectorAll('.apartment-image img');
                } else {
                    galleryImages = [this];
                }
                
                // Set current gallery and index
                currentGallery = Array.from(galleryImages);
                currentIndex = currentGallery.indexOf(this);
                
                // Show lightbox with clicked image
                updateLightboxContent(this);
                lightbox.style.display = 'block';
            });
        });
    }

    // Function to add lightbox to videos
    function addLightboxToVideos() {
        const videos = document.querySelectorAll('.video-container video');
        
        videos.forEach(video => {
            // Create a thumbnail or use the first frame
            const thumbnail = document.createElement('div');
            thumbnail.className = 'video-thumbnail';
            thumbnail.style.backgroundImage = `url('assets/images/video-thumbnail.jpg')`;
            thumbnail.style.width = '100%';
            thumbnail.style.height = '100%';
            thumbnail.style.position = 'absolute';
            thumbnail.style.top = '0';
            thumbnail.style.left = '0';
            thumbnail.style.cursor = 'pointer';
            thumbnail.style.display = 'flex';
            thumbnail.style.justifyContent = 'center';
            thumbnail.style.alignItems = 'center';
            
            // Add play button
            const playButton = document.createElement('div');
            playButton.innerHTML = '▶';
            playButton.style.fontSize = '48px';
            playButton.style.color = 'white';
            
            thumbnail.appendChild(playButton);
            video.parentNode.style.position = 'relative';
            video.parentNode.appendChild(thumbnail);
            
            // Open video in lightbox on click
            thumbnail.addEventListener('click', function() {
                lightboxImg.style.display = 'none';
                lightboxVideo.style.display = 'block';
                lightboxVideo.src = video.src;
                lightbox.style.display = 'block';
                lightboxVideo.play();
                
                // Set current gallery to just this video
                currentGallery = [video];
                currentIndex = 0;
            });
        });
    }

    // Function to update lightbox content
    function updateLightboxContent(element) {
        if (element.tagName === 'VIDEO') {
            lightboxImg.style.display = 'none';
            lightboxVideo.style.display = 'block';
            lightboxVideo.src = element.src;
            lightboxVideo.play();
        } else {
            lightboxVideo.pause();
            lightboxVideo.style.display = 'none';
            lightboxImg.style.display = 'block';
            lightboxImg.src = element.src;
        }
    }
});
