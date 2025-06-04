// Header functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add any header-specific JavaScript here
    console.log("header_footer.js loaded");
    const header = document.querySelector('.header');
    
    // Add scroll event listener for header
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    });

    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const headerNav = document.querySelector('.header__nav');
    const menuOverlay = document.querySelector('.menu-overlay');
    const body = document.body;

    function toggleMenu() {
        mobileMenuBtn.classList.toggle('active');
        headerNav.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        body.style.overflow = body.style.overflow === 'hidden' ? '' : 'hidden';
    }

    if (mobileMenuBtn && headerNav && menuOverlay) {
        mobileMenuBtn.addEventListener('click', toggleMenu);
        menuOverlay.addEventListener('click', toggleMenu);

        // Close menu when clicking on a link
        const menuLinks = document.querySelectorAll('.header__menu-item a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (headerNav.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });
    }
}); 