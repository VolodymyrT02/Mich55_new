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
    close.addEventListener('click', function(e) {
        e.stopPropagation();
        lightbox.style.display = 'none';
        lightboxVideo.pause();
        lightboxVideo.currentTime = 0;
        lightboxVideo.style.display = 'none';
        lightboxImg.style.display = 'block';
    });

    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
            lightboxVideo.pause();
            lightboxVideo.currentTime = 0;
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
                
                // Get the active apartment ID
                let activeApartmentId;
                if (this.hasAttribute('data-apartment')) {
                    activeApartmentId = this.getAttribute('data-apartment');
                } else if (this.closest('.apartment-details')) {
                    activeApartmentId = this.closest('.apartment-details').getAttribute('data-apartment');
                }
                
                if (this.closest('.horizontal-gallery')) {
                    // For horizontal galleries, strictly isolate by apartment
                    const activeApartment = this.closest('.apartment-details');
                    if (activeApartment) {
                        // Only get images from this specific apartment's gallery
                        galleryImages = activeApartment.querySelectorAll('.horizontal-gallery img');
                    } else {
                        galleryImages = [this]; // Fallback to single image
                    }
                } else if (this.closest('.lobby-gallery')) {
                    galleryImages = document.querySelectorAll('.lobby-gallery img');
                } else if (this.closest('.hero-slider')) {
                    galleryImages = document.querySelectorAll('.hero-slider img');
                } else if (this.closest('.apartment-image')) {
                    // For apartment preview images, ALWAYS use the data-apartment attribute of the clicked image
                    // to determine which apartment's gallery to show
                    const clickedApartmentId = this.getAttribute('data-apartment');
                    
                    if (clickedApartmentId) {
                        console.log(`Clicked on apartment image with data-apartment=${clickedApartmentId}`);
                        // Find the apartment's gallery based on the clicked image's apartment ID
                        const apartmentDetails = document.querySelector(`.apartment-details[data-apartment="${clickedApartmentId}"]`);
                        if (apartmentDetails && apartmentDetails.querySelector('.horizontal-gallery')) {
                            galleryImages = apartmentDetails.querySelectorAll('.horizontal-gallery img');
                            console.log(`Found ${galleryImages.length} images for apartment ${clickedApartmentId}`);
                        } else {
                            console.log(`No gallery found for apartment ${clickedApartmentId}, using single image`);
                            galleryImages = [this];
                        }
                    } else {
                        console.log('Apartment image clicked but no data-apartment attribute found');
                        galleryImages = [this];
                    }
                } else {
                    galleryImages = [this];
                }
                
                // Set current gallery and index
                currentGallery = Array.from(galleryImages).filter(img => img !== null);
                currentIndex = currentGallery.indexOf(this);
                if (currentIndex === -1) currentIndex = 0;
                
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
            playButton.className = 'video-play-button';
            playButton.innerHTML = '▶';
            playButton.style.fontSize = '48px';
            playButton.style.color = 'white';
            
            thumbnail.appendChild(playButton);
            video.parentNode.style.position = 'relative';
            video.parentNode.appendChild(thumbnail);
            
            // Handle direct video play on desktop and mobile
            video.addEventListener('play', function() {
                thumbnail.style.display = 'none';
            });
            
            video.addEventListener('pause', function() {
                thumbnail.style.display = 'flex';
            });
            
            video.addEventListener('ended', function() {
                thumbnail.style.display = 'flex';
            });
            
            // Add click event to video for toggling play/pause
            video.addEventListener('click', function() {
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
            });
            
            // Open video in lightbox on click
            thumbnail.addEventListener('click', function() {
                // For direct play on the page
                if (!event.ctrlKey && !event.metaKey) {
                    thumbnail.style.display = 'none';
                    video.play();
                    return;
                }
                
                // For lightbox play (with Ctrl/Cmd key)
                lightboxImg.style.display = 'none';
                lightboxVideo.style.display = 'block';
                lightboxVideo.src = video.src;
                lightbox.style.display = 'block';
                lightboxVideo.play();
                
                // Set current gallery to just this video
                currentGallery = [video];
                currentIndex = 0;
            });
            
            // Add fullscreen button functionality
            const fullscreenBtn = video.parentNode.querySelector('.fullscreen-button');
            if (fullscreenBtn) {
                fullscreenBtn.addEventListener('click', function() {
                    lightboxImg.style.display = 'none';
                    lightboxVideo.style.display = 'block';
                    lightboxVideo.src = video.src;
                    lightbox.style.display = 'block';
                    lightboxVideo.play();
                    
                    // Set current gallery to just this video
                    currentGallery = [video];
                    currentIndex = 0;
                });
            }
        });
    }

    // Function to update lightbox content
    function updateLightboxContent(element) {
        if (element.tagName === 'VIDEO') {
            lightboxImg.style.display = 'none';
            lightboxVideo.style.display = 'block';
            lightboxVideo.src = element.src;
            lightboxVideo.controls = true;
            lightboxVideo.play();
            
            // Add custom controls if needed
            const videoControls = document.createElement('div');
            videoControls.className = 'video-controls';
            videoControls.style.position = 'absolute';
            videoControls.style.bottom = '20px';
            videoControls.style.left = '50%';
            videoControls.style.transform = 'translateX(-50%)';
            videoControls.style.zIndex = '1010';
            videoControls.style.display = 'flex';
            videoControls.style.gap = '10px';
            
            // Pause/Play button
            const pausePlayBtn = document.createElement('button');
            pausePlayBtn.innerHTML = '⏸️';
            pausePlayBtn.style.background = 'rgba(0,0,0,0.5)';
            pausePlayBtn.style.color = 'white';
            pausePlayBtn.style.border = 'none';
            pausePlayBtn.style.borderRadius = '50%';
            pausePlayBtn.style.width = '40px';
            pausePlayBtn.style.height = '40px';
            pausePlayBtn.style.cursor = 'pointer';
            
            pausePlayBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                if (lightboxVideo.paused) {
                    lightboxVideo.play();
                    pausePlayBtn.innerHTML = '⏸️';
                } else {
                    lightboxVideo.pause();
                    pausePlayBtn.innerHTML = '▶️';
                }
            });
            
            // Stop button
            const stopBtn = document.createElement('button');
            stopBtn.innerHTML = '⏹️';
            stopBtn.style.background = 'rgba(0,0,0,0.5)';
            stopBtn.style.color = 'white';
            stopBtn.style.border = 'none';
            stopBtn.style.borderRadius = '50%';
            stopBtn.style.width = '40px';
            stopBtn.style.height = '40px';
            stopBtn.style.cursor = 'pointer';
            
            stopBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                lightboxVideo.pause();
                lightboxVideo.currentTime = 0;
                pausePlayBtn.innerHTML = '▶️';
            });
            
            videoControls.appendChild(pausePlayBtn);
            videoControls.appendChild(stopBtn);
            
            // Remove any existing controls first
            const existingControls = document.querySelector('.video-controls');
            if (existingControls) {
                existingControls.remove();
            }
            
            document.querySelector('.lightbox-content').appendChild(videoControls);
        } else {
            lightboxVideo.pause();
            lightboxVideo.style.display = 'none';
            lightboxImg.style.display = 'block';
            lightboxImg.src = element.src;
            
            // Remove video controls if they exist
            const existingControls = document.querySelector('.video-controls');
            if (existingControls) {
                existingControls.remove();
            }
        }
    }
});
