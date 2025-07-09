// Lightbox functionality for images and videos

// Private functions for internal use
function addLightboxToGallery(selector) {
        const images = typeof selector === 'string' ? document.querySelectorAll(selector) : selector;
        
        images.forEach(img => {
        // Remove existing event listener to prevent duplicates
        const clonedImg = img.cloneNode(true);
        img.parentNode.replaceChild(clonedImg, img);
        
        clonedImg.style.cursor = 'pointer';
        clonedImg.addEventListener('click', function() {
                let galleryImages;
                
                if (this.closest('.apartment-images')) {
                    galleryImages = this.closest('.apartment-images').querySelectorAll('img');
                } else if (this.closest('.lobby-gallery')) {
                    galleryImages = document.querySelectorAll('.lobby-gallery img');
                } else if (this.closest('.hero-slider')) {
                    galleryImages = document.querySelectorAll('.hero-slider img');
                } else if (this.closest('.apartment-image')) {
                    const clickedApartmentId = this.getAttribute('data-apartment');
                    if (clickedApartmentId) {
                        const apartmentDetails = document.querySelector(`.apartment-details[data-apartment="${clickedApartmentId}"]`);
                        if (apartmentDetails && apartmentDetails.querySelector('.horizontal-gallery')) {
                            galleryImages = apartmentDetails.querySelectorAll('.horizontal-gallery img');
                    } else {
                        galleryImages = [this];
                    }
                } else {
                        galleryImages = [this];
                    }
                } else {
                    galleryImages = [this];
                }
                
            window.lightbox.currentGallery = Array.from(galleryImages).filter(img => img !== null);
            window.lightbox.currentIndex = window.lightbox.currentGallery.indexOf(this);
            if (window.lightbox.currentIndex === -1) window.lightbox.currentIndex = 0;
            
                updateLightboxContent(this);
            window.lightbox.lightboxElement.style.display = 'block';
        });
        });
    }

    function addLightboxToVideos() {
        const videos = document.querySelectorAll('.video-container video');
        
        videos.forEach(video => {
        // Remove existing event listeners from thumbnail to prevent duplicates
        const existingThumbnail = video.parentNode.querySelector('.video-thumbnail');
        if (existingThumbnail) {
            existingThumbnail.remove();
        }

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
            
            const playButton = document.createElement('div');
            playButton.className = 'video-play-button';
            playButton.innerHTML = '▶';
            playButton.style.fontSize = '48px';
            playButton.style.color = 'white';
            
            thumbnail.appendChild(playButton);
            video.parentNode.style.position = 'relative';
            video.parentNode.appendChild(thumbnail);
            
            video.addEventListener('play', function() {
                thumbnail.style.display = 'none';
            });
            
            video.addEventListener('pause', function() {
                thumbnail.style.display = 'flex';
            });
            
            video.addEventListener('ended', function() {
                thumbnail.style.display = 'flex';
            });
            
            video.addEventListener('click', function() {
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
            });
            
            thumbnail.addEventListener('click', function() {
                if (!event.ctrlKey && !event.metaKey) {
                    thumbnail.style.display = 'none';
                    video.play();
                    return;
                }
                
            window.lightbox.lightboxImg.style.display = 'none';
            window.lightbox.lightboxVideo.style.display = 'block';
            window.lightbox.lightboxVideo.src = video.src;
            window.lightbox.lightboxElement.style.display = 'block';
            window.lightbox.lightboxVideo.play();
            
            window.lightbox.currentGallery = [video];
            window.lightbox.currentIndex = 0;
        });
        
            const fullscreenBtn = video.parentNode.querySelector('.fullscreen-button');
            if (fullscreenBtn) {
            // Remove existing event listener to prevent duplicates
            const newFullscreenBtn = fullscreenBtn.cloneNode(true);
            fullscreenBtn.parentNode.replaceChild(newFullscreenBtn, fullscreenBtn);
            
            newFullscreenBtn.addEventListener('click', function() {
                window.lightbox.lightboxImg.style.display = 'none';
                window.lightbox.lightboxVideo.style.display = 'block';
                window.lightbox.lightboxVideo.src = video.src;
                window.lightbox.lightboxElement.style.display = 'block';
                window.lightbox.lightboxVideo.play();
                });
            }
        });
    }

    function updateLightboxContent(element) {
    if (element.tagName === 'IMG') {
        window.lightbox.lightboxImg.src = element.src;
        window.lightbox.lightboxImg.style.display = 'block';
        window.lightbox.lightboxVideo.style.display = 'none';
        window.lightbox.lightboxVideo.pause();
    } else if (element.tagName === 'VIDEO') {
        window.lightbox.lightboxVideo.src = element.src;
        window.lightbox.lightboxVideo.style.display = 'block';
        window.lightbox.lightboxImg.style.display = 'none';
        window.lightbox.lightboxVideo.play();
    }
}

window.lightbox = {
    lightboxElement: null,
    lightboxImg: null,
    lightboxVideo: null,
    closeButton: null,
    prevButton: null,
    nextButton: null,
    currentGallery: [],
    currentIndex: 0,
    init: function() {
        // This function will be called on DOMContentLoaded
        // All initial element selections and event listeners are here
        this.lightboxElement = document.getElementById('lightbox');
        this.lightboxImg = document.getElementById('lightbox-img');
        this.lightboxVideo = document.getElementById('lightbox-video');
        this.closeButton = document.querySelector('.close');
        this.prevButton = document.querySelector('.prev');
        this.nextButton = document.querySelector('.next');

        // Only attach event listeners once
        if (!this.closeButton.hasAttribute('data-listener-added')) {
            this.closeButton.addEventListener('click', function(e) {
                e.stopPropagation();
                window.lightbox.lightboxElement.style.display = 'none';
                window.lightbox.lightboxVideo.pause();
                window.lightbox.lightboxVideo.currentTime = 0;
                window.lightbox.lightboxVideo.style.display = 'none';
                window.lightbox.lightboxImg.style.display = 'block';
            });
            this.closeButton.setAttribute('data-listener-added', 'true');
        }

        if (!this.lightboxElement.hasAttribute('data-listener-added')) {
            this.lightboxElement.addEventListener('click', function(e) {
                if (e.target === window.lightbox.lightboxElement) {
                    window.lightbox.lightboxElement.style.display = 'none';
                    window.lightbox.lightboxVideo.pause();
                    window.lightbox.lightboxVideo.currentTime = 0;
                    window.lightbox.lightboxVideo.style.display = 'none';
                    window.lightbox.lightboxImg.style.display = 'block';
                }
            });
            this.lightboxElement.setAttribute('data-listener-added', 'true');
        }

        if (!this.prevButton.hasAttribute('data-listener-added')) {
            this.prevButton.addEventListener('click', function() {
                if (window.lightbox.currentGallery.length <= 1) return;
                window.lightbox.currentIndex = (window.lightbox.currentIndex - 1 + window.lightbox.currentGallery.length) % window.lightbox.currentGallery.length;
                updateLightboxContent(window.lightbox.currentGallery[window.lightbox.currentIndex]);
            });
            this.prevButton.setAttribute('data-listener-added', 'true');
        }

        if (!this.nextButton.hasAttribute('data-listener-added')) {
            this.nextButton.addEventListener('click', function() {
                if (window.lightbox.currentGallery.length <= 1) return;
                window.lightbox.currentIndex = (window.lightbox.currentIndex + 1) % window.lightbox.currentGallery.length;
                updateLightboxContent(window.lightbox.currentGallery[window.lightbox.currentIndex]);
            });
            this.nextButton.setAttribute('data-listener-added', 'true');
        }

        if (!document.body.hasAttribute('data-keyboard-listener-added')) {
            document.addEventListener('keydown', function(e) {
                if (window.lightbox.lightboxElement.style.display === 'block') {
                    if (e.key === 'ArrowLeft') {
                        window.lightbox.prevButton.click();
                    } else if (e.key === 'ArrowRight') {
                        window.lightbox.nextButton.click();
                    } else if (e.key === 'Escape') {
                        window.lightbox.closeButton.click();
                    }
                }
            });
            document.body.setAttribute('data-keyboard-listener-added', 'true');
        }
        
        // Re-attach listeners to dynamic content
        this.reinitializeLightbox();
    },
    reinitializeLightbox: function() {
        // Re-add lightbox to all relevant galleries and videos
        addLightboxToGallery('.hero-slider img');
        addLightboxToGallery('.lobby-gallery img');
        addLightboxToGallery('.apartment-images img');
        addLightboxToVideos();
    }
};

document.addEventListener('DOMContentLoaded', function() {
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
    window.lightbox.init();
});
