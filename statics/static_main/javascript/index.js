$(document).ready(function() {
    // Cache DOM elements
    const $cont = $('.cont');
    const $slider = $('.slider');
    const $nav = $('.nav');
    const $sideNav = $('.side-nav');
    const $navSlides = $('.nav__slide');
    const $header = $('.header');
    const winW = $(window).width();
    const animSpd = 750; // Change also in CSS
    const distOfLetGo = winW * 0.2;
    let curSlide = 1;
    let animation = false;
    let autoScrollVar = true;
    let diff = 0;
    
    // City data
    const cities = [
        { name: 'Tehran', image: 'tehran_slider.jpg' },
        { name: 'Shiraz', image: 'shiraz_slider.jpg' },
        { name: 'Mashhad', image: 'mashhad_slider.jpg' },
        { name: 'Esfehan', image: 'esfehan_slider.jpg' },
        { name: 'Tabriz', image: 'tabriz_slider.jpg' }
    ];
    
    const numOfCities = cities.length;
    let citiesDivided = [];

    cities.forEach((city) => {
        let length = city.name.length;
        let letters = Math.floor(length / 4);
        let exp = new RegExp(".{1," + letters + "}", "g");
        citiesDivided.push(city.name.match(exp).reverse());
    });
    
    // Configuration
    const config = {
        winW: $(window).width(),
        animSpd: 750,
        distOfLetGo: $(window).width() * 0.2,
        numOfCities: 5,
        autoSlideInterval: 5000,
        scrollThreshold: 50
    };
    
    // State management with error handling
    let state = {
        curSlide: 1,
        animation: false,
        autoScrollVar: true,
        diff: 0,
        autoSlideInterval: null,
        isAnimating: false
    };
    
    // Optimized slide generation with error handling
    function generateSlide(city) {
        let frag1 = $(document.createDocumentFragment());
        let frag2 = $(document.createDocumentFragment());
        const numSlide = cities.indexOf(city) + 1;
        const firstLetter = city.name.charAt(0);

        const $slide = $(`
            <div data-target="${numSlide}" class="slide slide--${numSlide}">
                <div class="slide__darkbg slide--${numSlide}__darkbg"></div>
                <div class="slide__text-wrapper slide--${numSlide}__text-wrapper"></div>
            </div>
        `);

        const letter = $(`
            <div class="slide__letter slide--${numSlide}__letter">
                ${firstLetter}
            </div>
        `);

        for (let i = 0, length = citiesDivided[numSlide - 1].length; i < length; i++) {
            const text = $(`
                <div class="slide__text slide__text--${i + 1}">
                    ${citiesDivided[numSlide - 1][i]}
                </div>
            `);
            frag1.append(text);
        }

        const navSlide = $(`<li data-target="${numSlide}" class="nav__slide nav__slide--${numSlide}"></li>`);
        frag2.append(navSlide);
        $nav.append(frag2);

        $slide.find(`.slide--${numSlide}__text-wrapper`).append(letter).append(frag1);
        $slider.append($slide);

        if (city.name.length <= 4) {
            $('.slide--'+ numSlide).find('.slide__text').css("font-size", "12vw");
        }
    }

    cities.forEach(city => generateSlide(city));
    $('.nav__slide--1').addClass('nav-active');
    
    // Optimized navigation functions with debouncing
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };
    
    function bullets(dir) {
        $('.nav__slide').removeClass('nav-active');
        $('.nav__slide--' + dir).addClass('nav-active');
    }
    
    function timeout() {
        animation = false;
    }
    
    // Modified pagination to handle relative and absolute jumps
    function pagination(direction, isAbsoluteJump = false, targetSlide = 0) {
        animation = true;
        diff = 0;
        $slider.addClass('animation');
    
        let slideTargetIndex;
        if (isAbsoluteJump) {
            // Calculate target index for absolute jump (0-based)
            slideTargetIndex = targetSlide - 1; 
        } else {
            // Calculate target index for relative navigation (next/prev/default)
            if (direction === 0) { // Moving right (to next slide)
                 slideTargetIndex = curSlide; // Target index is next slide (curSlide is still the old value here)
            } else if (direction === 2) { // Moving left (to previous slide)
                 slideTargetIndex = curSlide - 2; // Target index is previous slide
            } else { // direction === 1 (toDefault - reset to current slide's base position)
                 slideTargetIndex = curSlide - 1;
            }
        }
    
        $slider.css({
            'transform': 'translate3d(-' + (slideTargetIndex * 100) + '%, 0, 0)'
        });
        
        $slider.find('.slide__darkbg').css({
            'transform': 'translate3d(' + (slideTargetIndex * 50) + '%, 0, 0)'
        });
        
        // Reset letter/text transforms during any pagination animation
        $slider.find('.slide__letter').css({
            'transform': 'translate3d(0, 0, 0)',
        });
        $slider.find('.slide__text').css({
            'transform': 'translate3d(0, 0, 0)'
        });

        // Reset animation flag after the animation completes
        setTimeout(timeout, animSpd); 
    }
    
    function navigateRight() {
        if (!autoScrollVar || animation) return;
    
        if (curSlide >= numOfCities) {
            animation = true; 
            diff = 0;
            $slider.addClass('animation');
            $slider.css({
                'transform': 'translate3d(-' + (numOfCities * 100) + '%, 0, 0)'
            });
            $slider.find('.slide__darkbg').css({
                'transform': 'translate3d(' + (numOfCities * 50) + '%, 0, 0)'
            });
    
            setTimeout(() => {
                $slider.removeClass('animation');
                $slider.css({
                    'transform': 'translate3d(0%, 0, 0)'
                });
                 $slider.find('.slide__darkbg').css({
                    'transform': 'translate3d(0%, 0, 0)'
                });
                 $slider.find('.slide__letter').css({
                    'transform': 'translate3d(0, 0, 0)',
                });
                $slider.find('.slide__text').css({
                    'transform': 'translate3d(0, 0, 0)'
                });
                
                curSlide = 1;
                bullets(curSlide);
                animation = false; // Reset animation flag after loop animation
                
                clearInterval(state.autoSlideInterval);
                resetAutoSlide(); 
            }, animSpd);
    
        } else {
            // Normal navigation to the next slide
            const nextSlide = curSlide + 1;
            pagination(0); // Animate - uses current curSlide value correctly
            bullets(nextSlide); // Update dots for the target slide
            curSlide = nextSlide; // Update curSlide state *after* initiating animation
            
            // Reset auto slide timer after normal navigation
            clearInterval(state.autoSlideInterval);
            resetAutoSlide();
        }
    }
    
    function navigateLeft() {
        // Added animation check
        if (curSlide <= 1 || animation) return; 
        const prevSlide = curSlide - 1;
        pagination(2); // Animate - uses current curSlide value correctly
        bullets(prevSlide); // Update dots for the target slide
        curSlide = prevSlide; // Update curSlide state *after* initiating animation

        // Reset auto slide timer
        clearInterval(state.autoSlideInterval);
        resetAutoSlide();
    }

    function toDefault() {
        // Called from mouse interactions, animation checked there
        pagination(1); // Animate reset to current slide's base position
    }
    
    // Optimized event handlers with error handling
    function handleSlideInteraction(e) {
        if (animation || state.isAnimating) return;
        
        try {
            const target = +$(this).attr('data-target');
            const startX = e.pageX || e.originalEvent.touches[0].pageX;
            
            $slider.removeClass('animation');
            
            const handleMove = debounce((e) => {
                const x = e.pageX || e.originalEvent.touches[0].pageX;
                state.diff = startX - x;
                
                if ((target === 1 && state.diff < 0) || (target === config.numOfCities && state.diff > 0)) return;
                
                const slideTransform = -((state.curSlide - 1) * 100 + (state.diff / 30));
                const bgTransform = ((state.curSlide - 1) * 50 + (state.diff / 60));
                const letterTransform = (state.diff / 60);
                const textTransform = (state.diff / 15);
                
                $slider.css('transform', `translate3d(${slideTransform}%, 0, 0)`);
                $slider.find('.slide__darkbg').css('transform', `translate3d(${bgTransform}%, 0, 0)`);
                $slider.find('.slide__letter').css('transform', `translate3d(${letterTransform}vw, 0, 0)`);
                $slider.find('.slide__text').css('transform', `translate3d(${textTransform}px, 0, 0)`);
            }, 16);
            
            const handleEnd = () => {
                if (animation || state.isAnimating) return;
                
                if (state.diff >= config.distOfLetGo) {
                    navigateRight();
                } else if (state.diff <= -config.distOfLetGo) {
                    navigateLeft();
                } else {
                    toDefault();
                }
            };
            
            $(document).on('mousemove touchmove', handleMove);
            $(document).one('mouseup touchend', handleEnd);
        } catch (error) {
            console.error('Error handling slide interaction:', error);
        }
    }
    
    // Optimized auto-sliding with error handling
    function startAutoSlide() {
        try {
            // Clear any existing interval first
            clearInterval(state.autoSlideInterval);
            
            state.autoSlideInterval = setInterval(navigateRight, config.autoSlideInterval); 
        } catch (error) {
            console.error('Error in auto-sliding:', error);
        }
    }
    
    function resetAutoSlide() {
        clearInterval(state.autoSlideInterval);
        state.autoSlideInterval = setInterval(navigateRight, config.autoSlideInterval);
    }
    
    // Optimized scroll handling with debouncing
    const handleScroll = debounce(() => {
        const scrollTop = $(window).scrollTop();
        if (scrollTop > config.scrollThreshold) {
            $header.addClass('header--scrolled');
        } else {
            $header.removeClass('header--scrolled');
        }
    }, 100);
    
    // Optimized intersection observer with error handling
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    try {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        const famousCitiesSection = document.querySelector('.famous_cities');
        if (famousCitiesSection) {
            observer.observe(famousCitiesSection);
        }

        const categoryCitiesSection = document.querySelector('.category_cities');
        if (categoryCitiesSection) {
            observer.observe(categoryCitiesSection);
        }
    } catch (error) {
        console.error('Error setting up intersection observer:', error);
    }
    
    // Initialize with error handling
    function init() {
        try {
            startAutoSlide();
            
            // Event listeners with error handling
            $slider.on('mousedown touchstart', '.slide', handleSlideInteraction);
            
            // Navigation dot clicks (Updated)
            $(document).on('click', '.nav__slide', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (animation) return;
                
                const target = +$(this).attr('data-target');
                if (target === curSlide) return;
                
                clearInterval(state.autoSlideInterval); // Stop current auto slide

                // Call pagination for absolute jump, passing target
                pagination(1, true, target); // direction 1 is arbitrary, target is used

                // Update state *after* initiating animation
                curSlide = target; 
                bullets(target); // Update dots immediately
                
                // No separate timeout needed, pagination handles it.

                resetAutoSlide(); // Restart auto slide
            });
            
            // Side navigation clicks
            $(document).on('click', '.side-nav', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (state.isAnimating) return;
                
                const target = $(this).attr('data-target');
                if (target === 'right') navigateRight();
                if (target === 'left') navigateLeft();
                clearInterval(state.autoSlideInterval);
                resetAutoSlide();
            });
            
            // Keyboard navigation
            $(document).on('keydown', function(e) {
                if (state.isAnimating) return;
                
                if (e.which === 39) { // Right arrow
                    e.preventDefault();
                    navigateRight();
                }
                if (e.which === 37) { // Left arrow
                    e.preventDefault();
                    navigateLeft();
                }
                resetAutoSlide();
            });
            
            $(window).on('scroll', handleScroll);
        } catch (error) {
            console.error('Error initializing:', error);
        }
    }
    
    // Start the application
    init();
});

// Optimized Card class with error handling
class Card {
    constructor(element) {
        try {
            this.card = element;
            // Check for both regular and category card elements
            this.cardWrap = element.querySelector('.card-wrap, .card-wrap_category');
            this.cardElement = element.querySelector('.card, .card_category');
            this.cardBg = element.querySelector('.card-bg, .card-bg_category');
            this.dataImage = element.getAttribute('data-image');
            
            this.width = 0;
            this.height = 0;
            this.mouseX = 0;
            this.mouseY = 0;
            this.mouseLeaveDelay = null;
            
            this.init();
        } catch (error) {
            console.error('Error creating card:', error);
        }
    }
    
    init() {
        try {
            this.width = this.cardWrap.offsetWidth;
            this.height = this.cardWrap.offsetHeight;
            this.setupEventListeners();
            this.setupBackground();
        } catch (error) {
            console.error('Error initializing card:', error);
        }
    }
    
    setupEventListeners() {
        this.cardWrap.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.cardWrap.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
        this.cardWrap.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    }
    
    setupBackground() {
        if (this.dataImage) {
            this.cardBg.style.backgroundImage = `url(${this.dataImage})`;
        }
    }
    
    handleMouseMove(e) {
        try {
            this.mouseX = e.pageX - this.cardWrap.offsetLeft - this.width/2;
            this.mouseY = e.pageY - this.cardWrap.offsetTop - this.height/2;
            this.updateCardTransform();
        } catch (error) {
            console.error('Error handling mouse move:', error);
        }
    }
    
    handleMouseEnter() {
        clearTimeout(this.mouseLeaveDelay);
    }
    
    handleMouseLeave() {
        this.mouseLeaveDelay = setTimeout(() => {
            this.mouseX = 0;
            this.mouseY = 0;
            this.updateCardTransform();
        }, 1000);
    }
    
    updateCardTransform() {
        try {
            const mousePX = this.mouseX / this.width;
            const mousePY = this.mouseY / this.height;
            
            const rX = mousePX * 30;
            const rY = mousePY * -30;
            const tX = mousePX * -40;
            const tY = mousePY * -40;
            
            this.cardElement.style.transform = `rotateY(${rX}deg) rotateX(${rY}deg)`;
            this.cardBg.style.transform = `translateX(${tX}px) translateY(${tY}px)`;
        } catch (error) {
            console.error('Error updating card transform:', error);
        }
    }
}

// Initialize cards with error handling
document.addEventListener('DOMContentLoaded', () => {
    try {
        const cards = document.querySelectorAll('card');
        cards.forEach(card => new Card(card));
    } catch (error) {
        console.error('Error initializing cards:', error);
    }
}); 