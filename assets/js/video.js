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
        
        // Fullscreen functionality
        fullscreenBtn.addEventListener('click', function() {
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.webkitRequestFullscreen) { /* Safari */
                video.webkitRequestFullscreen();
            } else if (video.msRequestFullscreen) { /* IE11 */
                video.msRequestFullscreen();
            }
        });
        
        // Auto fullscreen on mobile (optional)
        if (window.innerWidth < 768) {
            video.addEventListener('play', function() {
                if (video.requestFullscreen) {
                    video.requestFullscreen();
                } else if (video.webkitRequestFullscreen) {
                    video.webkitRequestFullscreen();
                } else if (video.msRequestFullscreen) {
                    video.msRequestFullscreen();
                }
            });
        }
    }
});
