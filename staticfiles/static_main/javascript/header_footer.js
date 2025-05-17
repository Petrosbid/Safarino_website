// Header functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add any header-specific JavaScript here
    const header = document.querySelector('.header');
    
    // Add scroll event listener for header
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    });
}); 