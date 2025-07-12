from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import TripPlan
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from Place.models import Place
import json
from datetime import datetime, timedelta
import jdatetime
from django.db.models import Q
import random
import requests
from Hotel.models import Hotel

# Create your views here.

def calculate_days(start_date, end_date):
    """Calculate number of days between two dates"""
    start = datetime.strptime(start_date, '%Y-%m-%d')
    end = datetime.strptime(end_date, '%Y-%m-%d')
    return (end - start).days + 1

def get_places_by_interests(interests, city, budget, limit=10):
    """Get places matching user interests and budget"""
    # Use case-insensitive containment for city name matching
    query = Q(city__icontains=city)
    
    # Add interest-based filters
    interest_filters = {
        'historical': Q(type__icontains='تاریخی'),
        'nature': Q(type__icontains='طبیعت'),
        'shopping': Q(type__icontains='خرید'),
        'food': Q(type__icontains='غذا'),
        'photography': Q(type__icontains='عکاسی'),
        'adventure': Q(type__icontains='ماجراجویی'),
        'culture': Q(type__icontains='فرهنگی')
    }
    
    # Build OR query for interests
    interest_query = Q()
    for interest in interests:
        if interest in interest_filters:
            interest_query |= interest_filters[interest]
    
    if interest_query:
        query &= interest_query
    
    # Filter by budget
    if budget == 'low':
        query &= Q(Cost='low')
    elif budget == 'medium':
        query &= (Q(Cost='low') | Q(Cost='medium'))
    elif budget == 'high':
        query &= (Q(Cost='low') | Q(Cost='medium') | Q(Cost='high'))
    
    # Get places ordered by score and views
    places = Place.objects.filter(query).order_by('-score', '-views')[:limit]
    return places

def generate_daily_activities(places, daily_places_count):
    """Generate daily activities from places"""
    activities = []
    for place in places:
        # Generate random time between 9 AM and 5 PM
        hour = random.randint(9, 17)
        minute = random.choice([0, 15, 30, 45])
        time = f"{hour:02d}:{minute:02d}"
        
        activity = {
            'title': place.name,
            'time': time,
            'image_url': place.images.first().image.url if place.images.exists() else '/static/static_main/images/default-place.jpg',
            'likes': place.score * 10  # Convert score to likes
        }
        activities.append(activity)
    
    # Sort activities by time
    activities.sort(key=lambda x: x['time'])
    return activities

def generate_itinerary(places, daily_places_count, days):
    """Generate complete itinerary"""
    itinerary = []
    places_per_day = min(daily_places_count, len(places))
    
    for day in range(days):
        day_places = places[day * places_per_day:(day + 1) * places_per_day]
        if not day_places:
            break
            
        activities = generate_daily_activities(day_places, places_per_day)
        
        day_plan = {
            'title': f'روز {day + 1}',
            'activities': activities
        }
        itinerary.append(day_plan)
    
    return itinerary

def get_city_name(city_id):
    """Get city name from Iran Places API"""
    try:
        response = requests.get(f'https://iranplacesapi.liara.run/api/cities/id/{city_id}')
        if response.status_code == 200:
            city_data = response.json()
            return city_data.get('name')
        return None
    except Exception as e:
        print(f"Error fetching city name: {str(e)}")
        return None

@login_required
def planner_form(request):
    if request.method == 'GET':
        return render(request, 'planner_form.html')
        
    elif request.method == 'POST':
        try:
            # Extract form data
            try:
                data = json.loads(request.body)
            except json.JSONDecodeError as e:
                return JsonResponse({'error': 'خطا در پردازش داده‌های فرم'}, status=400)
            
            # Check if tripPlan object exists
            trip_plan_data = data.get('tripPlan')
            if not trip_plan_data:
                return JsonResponse({'error': 'Missing tripPlan data'}, status=400)

            # Validate required fields from tripPlan data
            required_fields = ['city', 'companion_type', 'budget_level', 'interests', 'start_date', 'end_date']
            
            missing_fields = [field for field in required_fields if not trip_plan_data.get(field)]
            
            if missing_fields:
                return JsonResponse({
                    'error': f'فیلدهای الزامی پر نشده‌اند: {", ".join(missing_fields)}'
                }, status=400)
            
            # Get city name from city_id
            city_id = trip_plan_data.get('city')
            city_name = get_city_name(city_id)
            if not city_name:
                return JsonResponse({'error': 'خطا در دریافت نام شهر'}, status=400)

            # Create TripPlan instance
            try:
                trip_plan = TripPlan.objects.create(
                    user=request.user,
                    companion_type=trip_plan_data.get('companion_type'),
                    budget_level=trip_plan_data.get('budget_level'),
                    interests=trip_plan_data.get('interests', []),
                    start_date=trip_plan_data.get('start_date'),
                    end_date=trip_plan_data.get('end_date')
                )
                print("TripPlan created successfully:", trip_plan.pk)
            except Exception as e:
                return JsonResponse({'error': 'خطا در ذخیره اطلاعات سفر'}, status=400)
            
            # Calculate trip duration
            try:
                days = calculate_days(trip_plan_data['start_date'], trip_plan_data['end_date'])
                print("Trip duration:", days, "days")
            except Exception as e:
                return JsonResponse({'error': 'خطا در محاسبه مدت سفر'}, status=400)
            
            # Get daily places count based on user preference
            daily_activities_preference = data.get('daily_activities', '3-4')
            daily_places_count = {
                '1-2': 2,
                '3-4': 4,
                '5+': 5
            }.get(daily_activities_preference, 3)
            
            # Get matching places using city name
            try:
                places = get_places_by_interests(
                    interests=trip_plan_data.get('interests', []),
                    city=city_name,  # Use city name instead of ID
                    budget=trip_plan_data.get('budget_level')
                )
                print("Found places:", len(places))
            except Exception as e:
                return JsonResponse({'error': 'خطا در یافتن مکان‌های مناسب'}, status=400)
            
            # Generate itinerary
            try:
                itinerary = generate_itinerary(places, daily_places_count, days)
                print("Generated itinerary with", len(itinerary), "days")
            except Exception as e:
                return JsonResponse({'error': 'خطا در ایجاد برنامه سفر'}, status=400)
            
            # Get recommended hotels (placeholder - implement actual hotel recommendation)
            recommended_hotels = [
                {
                    'name': 'هتل نمونه ۱',
                    'description': 'هتلی زیبا در مرکز شهر',
                    'image_url': '/static/static_main/images/hotel1.jpg'
                },
                {
                    'name': 'هتل نمونه ۲',
                    'description': 'هتلی لوکس با امکانات کامل',
                    'image_url': '/static/static_main/images/hotel2.jpg'
                }
            ]
            
            # Get recommended tours (placeholder - implement actual tour recommendation)
            recommended_tours = [
                {
                    'name': 'تور گشت شهری',
                    'description': 'بازدید از جاذبه‌های اصلی شهر',
                    'image_url': '/static/static_main/images/tour1.jpg'
                },
                {
                    'name': 'تور طبیعت‌گردی',
                    'description': 'گشت و گذار در طبیعت زیبای منطقه',
                    'image_url': '/static/static_main/images/tour2.jpg'
                }
            ]
            
            context = {
                'itinerary': itinerary,
                'recommended_hotels': recommended_hotels,
                'recommended_tours': recommended_tours
            }
            
            # Return HTML response
            html = render(request, 'trip_plan.html', context).content.decode('utf-8')
            return JsonResponse({
                'html': html,
                'redirect_url': None
            })
            
        except Exception as e:
            print("Unexpected error:", str(e))
            return JsonResponse({'error': 'خطای غیرمنتظره در پردازش درخواست'}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@login_required
def plan_detail(request, plan_id):
    plan = TripPlan.objects.get(id=plan_id, user=request.user)
    return render(request, 'trip_plan.html', {'plan': plan})

def fake_trip_plan(request):
    """Show a fake trip plan for Kerman"""
    # Get places from Kerman
    places = Place.objects.filter(city__icontains='کرمان').order_by('-score')[:6]
    
    # Get hotels from Kerman
    hotels = Hotel.objects.filter(city__icontains='کرمان').order_by('-rating')[:3]
    
    # Create a fake itinerary for 2 days
    itinerary = []
    
    # Day 1
    day1_places = places[:3]
    day1_activities = []
    for place in day1_places:
        activity = {
            'title': place.name,
            'time': f"{random.randint(9, 17):02d}:{random.choice([0, 15, 30, 45]):02d}",
            'image_url': place.images.first().image.url if place.images.exists() else '/static/static_main/images/default-place.jpg',
            'likes': place.score * 10,
            'place_id': place.id  # Add place ID for linking
        }
        day1_activities.append(activity)
    
    itinerary.append({
        'title': 'روز اول',
        'activities': day1_activities
    })
    
    # Day 2
    day2_places = places[3:6]
    day2_activities = []
    for place in day2_places:
        activity = {
            'title': place.name,
            'time': f"{random.randint(9, 17):02d}:{random.choice([0, 15, 30, 45]):02d}",
            'image_url': place.images.first().image.url if place.images.exists() else '/static/static_main/images/default-place.jpg',
            'likes': place.score * 10,
            'place_id': place.id  # Add place ID for linking
        }
        day2_activities.append(activity)
    
    itinerary.append({
        'title': 'روز دوم',
        'activities': day2_activities
    })
    
    # Format hotels for display
    recommended_hotels = []
    for hotel in hotels:
        hotel_data = {
            'id': hotel.id,  # Add hotel ID for linking
            'name': hotel.name,
            'description': hotel.description,
            'image_url': hotel.image.url if hotel.image else '/static/static_main/images/default-hotel.jpg',
            'rating': hotel.rating,
            'stars': hotel.stars,
            'price': hotel.price_per_night
        }
        recommended_hotels.append(hotel_data)
    
    context = {
        'itinerary': itinerary,
        'recommended_hotels': recommended_hotels,
        'trip_duration': '۲ روز',
        'trip_budget': 'متوسط',
        'trip_companion': 'خانوادگی'
    }
    
    return render(request, 'trip_plan.html', context)
