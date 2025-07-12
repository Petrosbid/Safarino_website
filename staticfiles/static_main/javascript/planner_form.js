document.addEventListener('DOMContentLoaded', function() {
    console.log('js loaded'); //
    // Form navigation
    const form = document.querySelector('.planner-form');
    const steps = form.querySelectorAll('.form-step');
    const prevButton = form.querySelector('.prev-button');
    const nextButton = form.querySelector('.next-button');
    const submitButton = form.querySelector('.submit-button');
    let currentStep = 1;

    // Number input functionality
    function updateNumberButtonStates(input) {
        const minusBtn = input.parentElement.querySelector('.minus');
        const plusBtn = input.parentElement.querySelector('.plus');
        const value = parseInt(input.value);
        const min = parseInt(input.min);
        const max = parseInt(input.max);

        minusBtn.disabled = value <= min;
        plusBtn.disabled = value >= max;
    }

    // Initialize number button states
    document.querySelectorAll('.number-input-group input').forEach(input => {
        updateNumberButtonStates(input);
    });

    // Handle number button clicks
    document.querySelectorAll('.number-btn').forEach(button => {
        button.addEventListener('click', function() {
            const input = document.getElementById(this.dataset.target);
            const currentValue = parseInt(input.value);

            if (this.classList.contains('minus')) {
                input.value = Math.max(parseInt(input.min), currentValue - 1);
            } else {
                input.value = Math.min(parseInt(input.max), currentValue + 1);
            }

            updateNumberButtonStates(input);
        });
    });

    // Navigation functions
    function showStep(stepNumber) {
        steps.forEach((step, index) => {
            if (index + 1 === stepNumber) {
                step.style.display = 'block';
                step.classList.add('active');
            } else {
                step.style.display = 'none';
                step.classList.remove('active');
            }
        });

        // Update buttons
        prevButton.disabled = stepNumber === 1;
        if (stepNumber === steps.length) {
            nextButton.style.display = 'none';
            submitButton.style.display = 'flex';
        } else {
            nextButton.style.display = 'flex';
            submitButton.style.display = 'none';
        }

        currentStep = stepNumber;
    }

    // Add event listeners for radio and checkbox inputs
    document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
        input.addEventListener('change', function() {
            this.offsetHeight; // Force a reflow to ensure the animation triggers
        });
    });

    // Event listeners for navigation
    nextButton.addEventListener('click', () => {
        if (currentStep < steps.length) {
            const currentStepElement = steps[currentStep - 1];
            let isValid = true;
            let specificErrorMessageText = 'لطفا تمام فیلدهای ضروری را پر کنید.'; // Default error message

            // --- Validation Logic for each step ---
            if (currentStep === 1) { // Location Selection validation
                const province = document.getElementById('province').value;
                const city = document.getElementById('city').value;
                if (!province || !city) {
                    isValid = false;
                    specificErrorMessageText = 'لطفا استان و شهر مقصد را انتخاب کنید.';
                }
            } else if (currentStep === 2) { // Travel Companions validation
                const companionRadios = currentStepElement.querySelectorAll('input[name="companion"]');
                isValid = Array.from(companionRadios).some(radio => radio.checked);
                if (!isValid) {
                    specificErrorMessageText = 'لطفا نحوه سفر را انتخاب کنید.';
                }
            } else if (currentStep === 3) { // Number of Travelers validation
                const adults = parseInt(document.getElementById('adults').value);
                if (adults < 1) {
                    isValid = false;
                    specificErrorMessageText = 'تعداد بزرگسالان باید حداقل ۱ نفر باشد.';
                }
            } else if (currentStep === 4) { // Transportation validation
                const transportRadios = currentStepElement.querySelectorAll('input[name="transportation"]');
                isValid = Array.from(transportRadios).some(radio => radio.checked);
                if (!isValid) {
                    specificErrorMessageText = 'لطفا وسیله نقلیه خود را انتخاب کنید.';
                }
            } else if (currentStep === 5) { // Accommodation validation
                const accommodationRadios = currentStepElement.querySelectorAll('input[name="accommodation"]');
                isValid = Array.from(accommodationRadios).some(radio => radio.checked);
                if (!isValid) {
                    specificErrorMessageText = 'لطفا محل اقامت خود را انتخاب کنید.';
                }
            } else if (currentStep === 6) { // Dining validation
                const diningCheckboxes = currentStepElement.querySelectorAll('input[name="dining"]');
                isValid = Array.from(diningCheckboxes).some(checkbox => checkbox.checked);
                if (!isValid) {
                    specificErrorMessageText = 'لطفا حداقل یک گزینه برای وعده‌های غذایی انتخاب کنید.';
                }
            } else if (currentStep === 7) { // Daily Activities validation
                const activityRadios = currentStepElement.querySelectorAll('input[name="daily_activities"]');
                isValid = Array.from(activityRadios).some(radio => radio.checked);
                if (!isValid) {
                    specificErrorMessageText = 'لطفا تعداد مکان‌های مورد بازدید در روز را انتخاب کنید.';
                }
            } else if (currentStep === 8) { // Budget validation
                const budgetRadios = currentStepElement.querySelectorAll('input[name="budget"]');
                isValid = Array.from(budgetRadios).some(radio => radio.checked);
                if (!isValid) {
                    specificErrorMessageText = 'لطفا بودجه سفر خود را انتخاب کنید.';
                }
            } else if (currentStep === 9) { // Interests validation
                const interestsCheckboxes = currentStepElement.querySelectorAll('input[name="interests"]');
                isValid = Array.from(interestsCheckboxes).some(checkbox => checkbox.checked);
                if (!isValid) {
                    specificErrorMessageText = 'لطفا حداقل یک علاقه مندی را انتخاب کنید.';
                }
            } else if (currentStep === 10) { // Date validation
                const startDateStr = $("#start_date").val();
                const endDateStr = $("#end_date").val();
                if (!startDateStr || !endDateStr) {
                    isValid = false;
                    specificErrorMessageText = 'لطفا تاریخ شروع و تاریخ پایان را انتخاب کنید.';
                }
            }

            if (isValid) {
                const existingError = currentStepElement.querySelector('.error-message');
                if (existingError) {
                    existingError.remove();
                }
                showStep(currentStep + 1);
            } else {
                const errorMessageElement = document.createElement('div');
                errorMessageElement.className = 'error-message';
                errorMessageElement.textContent = specificErrorMessageText;
                errorMessageElement.style.color = '#ff4444';
                errorMessageElement.style.textAlign = 'center';
                errorMessageElement.style.marginTop = '1rem';

                const existingError = currentStepElement.querySelector('.error-message');
                if (existingError) {
                    existingError.remove();
                }

                currentStepElement.appendChild(errorMessageElement);

                setTimeout(() => {
                    if (errorMessageElement.parentNode) {
                        errorMessageElement.remove();
                    }
                }, 3000);
            }
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentStep > 1) {
            showStep(currentStep - 1);
        }
    });

    // Helper function to convert Persian numbers to English numbers
    function toEnglishNumber(str) {
        const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
        const arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
        if (typeof str === 'string') {
            for (let i = 0; i < 10; i++) {
                str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
            }
        }
        return str;
    }

    // Function to convert Persian date string to Gregorian YYYY-MM-DD
    function toGregorianDateString(persianDateStr) {
        if (!persianDateStr) return '';
        try {
            // Convert Persian numbers in the date string to English numbers
            const englishDateStr = toEnglishNumber(persianDateStr);
            const parts = englishDateStr.split('/').map(Number);

            if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
                const pd = new persianDate([parts[0], parts[1], parts[2]]);
                const jsDate = pd.toDate(); // Convert to standard JavaScript Date object
                const gYear = jsDate.getFullYear();
                const gMonth = jsDate.getMonth() + 1; // getMonth() is 0-indexed
                const gDay = jsDate.getDate();
                return `${gYear}-${String(gMonth).padStart(2, '0')}-${String(gDay).padStart(2, '0')}`;
            } else {
                console.error('Invalid persianDateStr format or components after conversion to English numbers:', persianDateStr, 'Converted:', englishDateStr);
                return '';
            }
        } catch (e) {
            console.error("Error converting Persian date to Gregorian:", e, "Input:", persianDateStr);
            return '';
        }
    }

    function collectTripData() {
        const formData = {
            province: document.getElementById('province').value,
            city: document.getElementById('city').value,
            companion: document.querySelector('input[name="companion"]:checked')?.value || '',
            adults: parseInt(document.getElementById('adults').value) || 0,
            children: parseInt(document.getElementById('children').value) || 0,
            infants: parseInt(document.getElementById('infants').value) || 0,
            transportation: document.querySelector('input[name="transportation"]:checked')?.value || '',
            accommodation: document.querySelector('input[name="accommodation"]:checked')?.value || '',
            dining: Array.from(document.querySelectorAll('input[name="dining"]:checked')).map(cb => cb.value),
            daily_activities: document.querySelector('input[name="daily_activities"]:checked')?.value || '',
            budget: document.querySelector('input[name="budget"]:checked')?.value || '',
            interests: Array.from(document.querySelectorAll('input[name="interests"]:checked')).map(cb => cb.value),
            // Ensure these values are correctly obtained from hidden inputs
            start_date: toGregorianDateString($("#start_date").val()),
            end_date: toGregorianDateString($("#end_date").val())
        };

        // Format data for Trip model
        const dailyActivitiesValue = formData.daily_activities;
        let placesPerDay = 1; // Default value
        if (dailyActivitiesValue) {
            if (dailyActivitiesValue.includes('-')) {
                placesPerDay = parseInt(dailyActivitiesValue.split('-')[0]);
            } else if (dailyActivitiesValue.includes('+')) {
                placesPerDay = parseInt(dailyActivitiesValue.replace('+', ''));
            } else {
                placesPerDay = parseInt(dailyActivitiesValue);
            }
        }

        const tripData = {
            budget: formData.budget,
            people_count: formData.adults + formData.children + formData.infants,
            trip_type: formData.companion,
            places_of_interest: formData.interests.join(', '),
            places_per_day: placesPerDay
        };

        // Format data for TripPlan model
        const tripPlanData = {
            companion_type: formData.companion,
            budget_level: formData.budget,
            interests: formData.interests,
            start_date: formData.start_date, // This will now be Gregorian YYYY-MM-DD
            end_date: formData.end_date      // This will now be Gregorian YYYY-MM-DD
        };

        return {
            trip: tripData,
            tripPlan: tripPlanData
        };
    }

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Comprehensive validation for the final submit
        let isFormFullyValid = true;
        let firstErrorMessage = '';

        // All step validations combined for final submit
        // (This should ideally align with the 'nextButton' validations)

        // Step 1: Location
        const province = document.getElementById('province').value;
        const city = document.getElementById('city').value;
        if (!province || !city) {
            isFormFullyValid = false;
            firstErrorMessage = 'لطفا استان و شهر مقصد را انتخاب کنید.';
        }

        // Step 2: Companion
        const companionRadios = document.querySelectorAll('input[name="companion"]');
        if (!Array.from(companionRadios).some(radio => radio.checked)) {
            isFormFullyValid = false;
            firstErrorMessage = firstErrorMessage || 'لطفا نحوه سفر را انتخاب کنید.';
        }

        // Step 3: Adults count
        const adults = parseInt(document.getElementById('adults').value);
        if (adults < 1) {
            isFormFullyValid = false;
            firstErrorMessage = firstErrorMessage || 'تعداد بزرگسالان باید حداقل ۱ نفر باشد.';
        }

        // Step 4: Transportation
        const transportRadios = document.querySelectorAll('input[name="transportation"]');
        if (!Array.from(transportRadios).some(radio => radio.checked)) {
            isFormFullyValid = false;
            firstErrorMessage = firstErrorMessage || 'لطفا وسیله نقلیه خود را انتخاب کنید.';
        }

        // Step 5: Accommodation
        const accommodationRadios = document.querySelectorAll('input[name="accommodation"]');
        if (!Array.from(accommodationRadios).some(radio => radio.checked)) {
            isFormFullyValid = false;
            firstErrorMessage = firstErrorMessage || 'لطفا محل اقامت خود را انتخاب کنید.';
        }

        // Step 6: Dining
        const diningCheckboxes = document.querySelectorAll('input[name="dining"]');
        if (!Array.from(diningCheckboxes).some(checkbox => checkbox.checked)) {
            isFormFullyValid = false;
            firstErrorMessage = firstErrorMessage || 'لطفا حداقل یک گزینه برای وعده‌های غذایی انتخاب کنید.';
        }

        // Step 7: Daily Activities
        const activityRadios = document.querySelectorAll('input[name="daily_activities"]');
        if (!Array.from(activityRadios).some(radio => radio.checked)) {
            isFormFullyValid = false;
            firstErrorMessage = firstErrorMessage || 'لطفا تعداد مکان‌های مورد بازدید در روز را انتخاب کنید.';
        }

        // Step 8: Budget
        const budgetRadios = document.querySelectorAll('input[name="budget"]');
        if (!Array.from(budgetRadios).some(radio => radio.checked)) {
            isFormFullyValid = false;
            firstErrorMessage = firstErrorMessage || 'لطفا بودجه سفر خود را انتخاب کنید.';
        }

        // Step 9: Interests
        const interestsCheckboxes = document.querySelectorAll('input[name="interests"]');
        if (!Array.from(interestsCheckboxes).some(checkbox => checkbox.checked)) {
            isFormFullyValid = false;
            firstErrorMessage = firstErrorMessage || 'لطفا حداقل یک علاقه مندی را انتخاب کنید.';
        }

        // Step 10: Dates
        const startDateVal = $("#start_date").val();
        const endDateVal = $("#end_date").val();
        if (!startDateVal || !endDateVal) {
            isFormFullyValid = false;
            firstErrorMessage = firstErrorMessage || 'لطفا تاریخ شروع و تاریخ پایان را انتخاب کنید.';
        }


        if (!isFormFullyValid) {
            alert(firstErrorMessage);
            return;
        }

        const formData = collectTripData();

        console.log('Submitting form data:', formData); //

        submitButton.disabled = true;
        submitButton.innerHTML = `
            <i class="fas fa-spinner fa-spin"></i>
            در حال پردازش...
        `;

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                },
                body: JSON.stringify(formData)
            });

            const responseData = await response.json();

            if (response.ok) {
                if (responseData.html) {
                    document.open();
                    document.write(responseData.html);
                    document.close();
                } else if (responseData.redirect_url) {
                    window.location.href = responseData.redirect_url;
                } else {
                    console.warn('Successful response, but no HTML or redirect URL:', responseData); //
                    alert('درخواست با موفقیت انجام شد، اما پاسخ غیرمنتظره‌ای دریافت شد.');
                }
            } else {
                throw new Error(responseData.error || 'خطا در ارسال فرم. لطفا دوباره تلاش کنید.');
            }
        } catch (error) {
            console.error('Error submitting form:', error); //
            alert(error.message || 'خطا در ارسال فرم. لطفا دوباره تلاش کنید.');
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = `
                دریافت برنامه سفر
                <i class="fas fa-paper-plane"></i>
            `;
        }
    });

    // Initialize the first step
    showStep(1);

    // Location dropdowns
    const provinceSelect = document.getElementById('province');
    const citySelect = document.getElementById('city');
    const API_BASE_URL = 'https://iranplacesapi.liara.run/api';

    async function fetchProvinces() {
        try {
            const response = await fetch(`${API_BASE_URL}/provinces`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const provinces = await response.json();
            console.log('Fetched provinces:', provinces); //
            provinceSelect.length = 1; // Keep the "Select Province" option
            provinces.forEach(province => {
                const option = document.createElement('option');
                option.value = province.id;
                option.textContent = province.name;
                provinceSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching provinces:', error);
            provinceSelect.innerHTML = '<option value="">خطا در دریافت اطلاعات استان‌ها</option>';
        }
    }
    fetchProvinces();

    provinceSelect.addEventListener('change', function() {
        const selectedProvinceId = this.value;
        citySelect.innerHTML = '<option value="">ابتدا استان را انتخاب کنید</option>'; // Reset city options
        citySelect.disabled = true;
        if (selectedProvinceId) {
            fetchCities(selectedProvinceId);
        }
    });

    async function fetchCities(provinceId) {
        try {
            if (!provinceId) return;
            const response = await fetch(`${API_BASE_URL}/provinces/id/${provinceId}/cities`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const cities = await response.json();
            console.log('Fetched cities:', cities); //
            citySelect.innerHTML = '<option value="">انتخاب شهر</option>';
            cities.forEach(city => {
                const option = document.createElement('option');
                option.value = city.id;
                option.textContent = city.name;
                citySelect.appendChild(option);
            });
            citySelect.disabled = false;
        } catch (error) {
            console.error('Error fetching cities:', error);
            citySelect.innerHTML = '<option value="">خطا در دریافت اطلاعات شهرها</option>';
            citySelect.disabled = true;
        }
    }

    if (typeof $ !== 'undefined' && $.fn.persianDatepicker) {
        $("#start-date-input").persianDatepicker({
            format: "YYYY/MM/DD",
            initialValue: false,
            autoClose: true,
            onSelect: function(unix) {
                // The persianDatepicker returns the date with Persian numbers by default in its format.
                // We need to ensure that the hidden input (which will be used by toGregorianDateString)
                // receives the date with English numbers.
                const selectedDatePersianNumbers = new persianDate(unix).format("YYYY/MM/DD");
                const selectedDateEnglishNumbers = toEnglishNumber(selectedDatePersianNumbers);

                $("#start_date").val(selectedDateEnglishNumbers); // Store English numbers
                $("#start-date-input").val(selectedDatePersianNumbers); // Display Persian numbers
                console.log("Start date selected (YYYY/MM/DD):", selectedDatePersianNumbers, "(English for hidden):", selectedDateEnglishNumbers); //
            }
        });

        $("#end-date-input").persianDatepicker({
            format: "YYYY/MM/DD",
            initialValue: false,
            autoClose: true,
            onSelect: function(unix) {
                const selectedDatePersianNumbers = new persianDate(unix).format("YYYY/MM/DD");
                const selectedDateEnglishNumbers = toEnglishNumber(selectedDatePersianNumbers);

                $("#end_date").val(selectedDateEnglishNumbers); // Store English numbers
                $("#end-date-input").val(selectedDatePersianNumbers); // Display Persian numbers
                console.log("End date selected (YYYY/MM/DD):", selectedDatePersianNumbers, "(English for hidden):", selectedDateEnglishNumbers); //
            }
        });
    } else {
        console.error("jQuery or persianDatepicker is not loaded.");
    }
});