document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    initializeTripPlan();
    
    // Add event listeners
    document.getElementById('save-trip').addEventListener('click', saveTripPlan);
    document.getElementById('modify-trip').addEventListener('click', modifyTripPlan);
});

function initializeTripPlan() {
    // Show loading state
    showLoading();
    
    // Get trip data from the server
    fetchTripData()
        .then(data => {
            updateTripSummary(data);
            renderItinerary(data.itinerary);
            renderHotels(data.recommended_hotels);
            renderTours(data.recommended_tours);
            hideLoading();
        })
        .catch(error => {
            console.error('Error loading trip data:', error);
            showError('خطا در بارگذاری اطلاعات سفر');
            hideLoading();
        });
}

function showLoading() {
    const containers = ['itinerary-container', 'hotels-container', 'tours-container'];
    containers.forEach(containerId => {
        const container = document.getElementById(containerId);
        container.innerHTML = '<div class="loading"></div>';
    });
}

function hideLoading() {
    const loadingElements = document.querySelectorAll('.loading');
    loadingElements.forEach(element => element.remove());
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.querySelector('.trip-plan-container').prepend(errorDiv);
}

function updateTripSummary(data) {
    // Update trip duration
    const durationElement = document.getElementById('trip-duration');
    durationElement.textContent = `${data.days} روز`;

    // Update budget
    const budgetElement = document.getElementById('trip-budget');
    const budgetText = {
        'low': 'اقتصادی',
        'medium': 'متوسط',
        'high': 'لوکس'
    }[data.budget] || data.budget;
    budgetElement.textContent = budgetText;

    // Update companion type
    const companionElement = document.getElementById('trip-companion');
    companionElement.textContent = data.companion;
}

function renderItinerary(itinerary) {
    const container = document.getElementById('itinerary-container');
    container.innerHTML = '';

    itinerary.forEach(day => {
        const dayCard = document.createElement('div');
        dayCard.className = 'day-card';
        
        const dayTitle = document.createElement('h3');
        dayTitle.className = 'day-title';
        dayTitle.textContent = day.title;
        dayCard.appendChild(dayTitle);

        day.activities.forEach(activity => {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            
            activityItem.innerHTML = `
                <div class="activity-time">${activity.time}</div>
                <div class="activity-details">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-likes">
                        <lord-icon src="https://cdn.lordicon.com/zzcjjxew.json" trigger="hover" colors="primary:#08a88a" style="width:16px;height:16px"></lord-icon>
                        ${activity.likes} پسند
                    </div>
                </div>
            `;
            
            dayCard.appendChild(activityItem);
        });

        container.appendChild(dayCard);
    });
}

function renderHotels(hotels) {
    const container = document.getElementById('hotels-container');
    container.innerHTML = '';

    hotels.forEach(hotel => {
        const hotelCard = document.createElement('div');
        hotelCard.className = 'recommendation-card';
        
        hotelCard.innerHTML = `
            <img src="${hotel.image_url}" alt="${hotel.name}" class="recommendation-image">
            <div class="recommendation-content">
                <h3 class="recommendation-title">${hotel.name}</h3>
                <p class="recommendation-description">${hotel.description}</p>
            </div>
        `;
        
        container.appendChild(hotelCard);
    });
}

function renderTours(tours) {
    const container = document.getElementById('tours-container');
    container.innerHTML = '';

    tours.forEach(tour => {
        const tourCard = document.createElement('div');
        tourCard.className = 'recommendation-card';
        
        tourCard.innerHTML = `
            <img src="${tour.image_url}" alt="${tour.name}" class="recommendation-image">
            <div class="recommendation-content">
                <h3 class="recommendation-title">${tour.name}</h3>
                <p class="recommendation-description">${tour.description}</p>
            </div>
        `;
        
        container.appendChild(tourCard);
    });
}

function saveTripPlan() {
    showLoading();
    
    fetch('/trip/save-plan/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            // Add any necessary data to save
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSuccess('برنامه سفر با موفقیت ذخیره شد');
            // Redirect to dashboard after a short delay
            setTimeout(() => {
                window.location.href = '/dashboard/';
            }, 2000);
        } else {
            throw new Error(data.error || 'خطا در ذخیره برنامه سفر');
        }
    })
    .catch(error => {
        console.error('Error saving trip plan:', error);
        showError(error.message);
    })
    .finally(() => {
        hideLoading();
    });
}

function modifyTripPlan() {
    // Redirect to the planner form
    window.location.href = '/trip/planner/';
}

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

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.querySelector('.trip-plan-container').prepend(successDiv);
    
    // Remove success message after 3 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}
