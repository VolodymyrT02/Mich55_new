// Video integration for the landing page
document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('main-video');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    
    // Check if video exists
    if (video) {
        // Fix video playback issues
        video.addEventListener('error', function(e) {
            console.error('Video error:', e);
            // Try to reload the video
            const currentSrc = video.src;
            video.src = '';
            setTimeout(() => {
                video.src = currentSrc;
            }, 1000);
        });
        
        // Ensure video is properly loaded
        video.addEventListener('loadeddata', function() {
            console.log('Video loaded successfully');
        });
        
        // Force video preload
        video.preload = 'auto';
        
        // Add poster image for better loading experience
        if (!video.hasAttribute('poster')) {
            video.poster = 'assets/images/facade/Michurina1.JPEG';
        }
        
        // Ensure video controls are visible
        video.controls = true;
        
        // Add play/pause functionality by clicking on video
        video.addEventListener('click', function() {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        });
        
        // Fullscreen functionality
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                if (video.requestFullscreen) {
                    video.requestFullscreen();
                } else if (video.webkitRequestFullscreen) { /* Safari */
                    video.webkitRequestFullscreen();
                } else if (video.msRequestFullscreen) { /* IE11 */
                    video.msRequestFullscreen();
                } else if (video.mozRequestFullScreen) { /* Firefox */
                    video.mozRequestFullScreen();
                }
            });
        }
        
        // Fix for iOS devices
        video.playsInline = true;
        
        // Fix for mobile devices
        if (window.innerWidth < 768) {
            // Add tap to play for mobile
            const videoContainer = video.parentElement;
            if (videoContainer) {
                const playOverlay = document.createElement('div');
                playOverlay.className = 'video-play-overlay';
                playOverlay.innerHTML = '<i class="fas fa-play"></i>';
                playOverlay.style.position = 'absolute';
                playOverlay.style.top = '0';
                playOverlay.style.left = '0';
                playOverlay.style.width = '100%';
                playOverlay.style.height = '100%';
                playOverlay.style.display = 'flex';
                playOverlay.style.alignItems = 'center';
                playOverlay.style.justifyContent = 'center';
                playOverlay.style.backgroundColor = 'rgba(0,0,0,0.3)';
                playOverlay.style.color = 'white';
                playOverlay.style.fontSize = '3rem';
                playOverlay.style.cursor = 'pointer';
                playOverlay.style.zIndex = '5';
                
                videoContainer.style.position = 'relative';
                videoContainer.appendChild(playOverlay);
                
                playOverlay.addEventListener('click', function() {
                    video.play();
                    playOverlay.style.display = 'none';
                });
                
                video.addEventListener('play', function() {
                    playOverlay.style.display = 'none';
                });
                
                video.addEventListener('pause', function() {
                    playOverlay.style.display = 'flex';
                });
            }
        }
    }
});
