// Blog Post JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Search functionality
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            // Create a search overlay
            const searchOverlay = document.createElement('div');
            searchOverlay.className = 'search-overlay';
            searchOverlay.innerHTML = `
                <div class="search-container">
                    <input type="text" placeholder="جستجو در مقالات..." class="search-input" autofocus>
                    <button class="close-search"><i class="fa-solid fa-times"></i></button>
                </div>
            `;
            document.body.appendChild(searchOverlay);
            document.body.style.overflow = 'hidden';
            
            // Add styles for search overlay
            const style = document.createElement('style');
            style.textContent = `
                .search-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.9);
                    z-index: 1000;
                    display: flex;
                    justify-content: center;
                    align-items: flex-start;
                    padding-top: 100px;
                }
                .search-container {
                    width: 80%;
                    max-width: 600px;
                }
                .search-input {
                    width: 100%;
                    padding: 15px;
                    font-size: 18px;
                    border: none;
                    border-radius: 5px;
                    background-color: rgba(255, 255, 255, 0.9);
                }
                .close-search {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: none;
                    border: none;
                    color: white;
                    font-size: 24px;
                    cursor: pointer;
                }
            `;
            document.head.appendChild(style);
            
            // Close search on button click
            const closeBtn = document.querySelector('.close-search');
            closeBtn.addEventListener('click', () => {
                document.body.removeChild(searchOverlay);
                document.body.style.overflow = 'auto';
            });
            
            // Close search on ESC key
            document.addEventListener('keydown', function closeSearch(e) {
                if (e.key === 'Escape') {
                    document.body.removeChild(searchOverlay);
                    document.body.style.overflow = 'auto';
                    document.removeEventListener('keydown', closeSearch);
                }
            });
        });
    }

    // Add reading progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    document.body.appendChild(progressBar);

    // Add styles for reading progress bar
    const progressBarStyle = document.createElement('style');
    progressBarStyle.textContent = `
        .reading-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: transparent;
            z-index: 1001;
        }
        .reading-progress::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            background: var(--accent-color);
            width: 0;
            transition: width 0.1s ease;
        }
    `;
    document.head.appendChild(progressBarStyle);

    // Update reading progress
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;
        progressBar.style.setProperty('--width', `${progress}%`);
        progressBar.style.cssText = `--width: ${progress}%`;
        progressBar.innerHTML = `<style>
            .reading-progress::before {
                width: ${progress}%;
            }
        </style>`;
    });

    // Lazy load images
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.loading = 'lazy';
        });
    }

    // Copy link functionality
    const linkShareBtns = document.querySelectorAll('.share-btn:has(.fa-link)');
    linkShareBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const url = window.location.href;
            
            // Create a temporary input element
            const tempInput = document.createElement('input');
            tempInput.value = url;
            document.body.appendChild(tempInput);
            
            // Select and copy the link
            tempInput.select();
            document.execCommand('copy');
            
            // Remove the temporary input
            document.body.removeChild(tempInput);
            
            // Show a tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'copy-tooltip';
            tooltip.textContent = 'لینک کپی شد!';
            document.body.appendChild(tooltip);
            
            // Add styles for tooltip
            const tooltipStyle = document.createElement('style');
            tooltipStyle.textContent = `
                .copy-tooltip {
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 10px 15px;
                    border-radius: 4px;
                    font-size: 14px;
                    z-index: 1000;
                    animation: fadeIn 0.3s, fadeOut 0.3s 1.7s;
                    animation-fill-mode: forwards;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `;
            document.head.appendChild(tooltipStyle);
            
            // Remove tooltip after animation
            setTimeout(() => {
                document.body.removeChild(tooltip);
                document.head.removeChild(tooltipStyle);
            }, 2000);
        });
    });

    // Add scroll-to-top button
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    document.body.appendChild(scrollToTopBtn);

    // Add styles for scroll-to-top button
    const scrollToTopStyle = document.createElement('style');
    scrollToTopStyle.textContent = `
        .scroll-to-top {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: var(--text-color);
            color: white;
            border: none;
            cursor: pointer;
            display: none;
            font-size: 1rem;
            z-index: 999;
            transition: all 0.3s ease;
        }
        .scroll-to-top:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
        }
    `;
    document.head.appendChild(scrollToTopStyle);

    // Show/hide scroll-to-top button
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.display = 'block';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });

    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Generate table of contents
    const postBody = document.querySelector('.post-body');
    const tocPlaceholder = document.getElementById('toc-placeholder');
    
    if (postBody && tocPlaceholder) {
        const headings = postBody.querySelectorAll('h1, h2, h3, h4, h5, h6');
        
        if (headings.length > 0) {
            const toc = document.createElement('div');
            toc.className = 'table-of-contents';
            toc.innerHTML = '<h3>فهرست مطالب</h3><ul></ul>';
            
            const tocList = toc.querySelector('ul');
            
            headings.forEach((heading, index) => {
                // Add ID to heading if not exists
                if (!heading.id) {
                    heading.id = `heading-${index}`;
                }
                
                // Create list item
                const li = document.createElement('li');
                li.className = `toc-level-${heading.tagName[1]}`;
                
                // Create link
                const a = document.createElement('a');
                a.href = `#${heading.id}`;
                a.textContent = heading.textContent;
                
                li.appendChild(a);
                tocList.appendChild(li);
            });
            
            tocPlaceholder.appendChild(toc);
        }
    }
    // --- Share Buttons ---
document.querySelectorAll('.share-btn').forEach((btn, idx) => {
    btn.addEventListener('click', function(e) {
        console.log('clicked btn idx' , idx);
        e.preventDefault();
        const url = window.location.href;
        if (idx === 0 || idx === 5) {
            // Copy link
            navigator.clipboard.writeText(url);
            btn.title = "لینک کپی شد!";
            btn.classList.add('copied');
            setTimeout(() => {
                btn.classList.remove('copied');
                btn.title = "";
            }, 1500);
            window.open(twitterBtn.getAttribute('href'), '_blank');
        } else if (idx === 2 || idx === 7) {
            console.log('its telegram btn');
            // Share to Telegram
            window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}`, '_blank');
        } else if (idx === 1 || idx === 6) {
            console.log('its whatsapp btn');
            // Share to WhatsApp
            window.open(`https://wa.me/?text=${encodeURIComponent(url)}`, '_blank');
        }
    });
});

// --- Like/Dislike with AJAX ---
const likeBtns = document.querySelectorAll('.share-post .share-btn');
const likeCountSpan = document.querySelector('.share-post span:not(.share-label)');
let likeCount = parseInt(likeCountSpan?.textContent) || 0;

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

if (likeBtns.length >= 2 && likeCountSpan) {
    const postId = window.location.pathname.split('/').filter(Boolean)[1]; // Get post ID from URL
    const csrftoken = getCookie('csrftoken');

    async function updateLikes(action) {
        try {
            const response = await fetch(`/blog/${postId}/update-likes/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': csrftoken,
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: `action=${action}`
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            if (data.error) {
                console.error('Error:', data.error);
                return;
            }

            // Update like count
            likeCountSpan.textContent = data.likes;

            // Add animation class
            const btn = action === 'like' ? likeBtns[0] : likeBtns[1];
            btn.classList.add(action === 'like' ? 'liked' : 'disliked');
            setTimeout(() => btn.classList.remove(action === 'like' ? 'liked' : 'disliked'), 800);

        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Like button
    likeBtns[0].addEventListener('click', function(e) {
        e.preventDefault();
        updateLikes('like');
    });

    // Dislike button
    likeBtns[1].addEventListener('click', function(e) {
        e.preventDefault();
        updateLikes('dislike');
    });
}

    // Twitter share button dynamic link
    const twitterBtn = document.querySelector('.twitter-share-button');
    if (twitterBtn) {
        const pageUrl = window.location.href;
        const preText = "این مقاله رو خیلی دوست داشتم.";
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(preText)}&url=${encodeURIComponent(pageUrl)}`;
        twitterBtn.setAttribute('href', tweetUrl);
    }
});