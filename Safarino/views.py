from django.contrib.auth import authenticate, login, get_user_model
from django.contrib.auth.forms import AuthenticationForm
from django.shortcuts import render, redirect
from Safarino.forms import LoginForm, RegisterForm
from blog.models import Post
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from User.models import User
from datetime import datetime
from django.http import JsonResponse
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from trip.models import Trip  # Import your Trip model

def home_page(request):
    latest_posts = Post.objects.all().order_by('-created_at')[:3]  # Get 3 latest posts
    context = {
        'latest_posts': latest_posts
    }
    return render(request, 'home_page.html', context)

@login_required
def user_dashboard(request):
    user = request.user
    
    context = {
        'user': user,
        'user_trips_count': 0,  # You can implement this when you have the trips model
        'active_trips_count': 0,  # You can implement this when you have the trips model
        'travel_points': 0,  # You can implement this when you have the points system
        'gender_choices': User.GENDER_CHOICES,  # Add gender choices to context
    }
    return render(request, 'user_dashbord.html', context)

@login_required
def update_profile(request):
    if request.method == 'POST':
        try:
            user = request.user
            
            # Handle profile picture update
            if 'profile_picture' in request.FILES:
                user.profile_picture = request.FILES['profile_picture']
                user.save()
                return JsonResponse({
                    'success': True,
                    'profile_picture_url': user.profile_picture.url if user.profile_picture else None
                })
            
            # Handle username change
            new_username = request.POST.get('username')
            if new_username and new_username != user.username:
                if User.objects.filter(username=new_username).exists():
                    return JsonResponse({
                        'success': False,
                        'error': 'این نام کاربری قبلا استفاده شده است'
                    })
                user.username = new_username
            
            # Handle password change
            current_password = request.POST.get('current_password')
            new_password = request.POST.get('new_password')
            confirm_password = request.POST.get('confirm_password')
            
            if current_password and new_password and confirm_password:
                if not user.check_password(current_password):
                    return JsonResponse({
                        'success': False,
                        'error': 'رمز عبور فعلی اشتباه است'
                    })
                
                if new_password != confirm_password:
                    return JsonResponse({
                        'success': False,
                        'error': 'رمز عبور جدید و تکرار آن مطابقت ندارند'
                    })
                
                try:
                    validate_password(new_password, user)
                except ValidationError as e:
                    return JsonResponse({
                        'success': False,
                        'error': 'رمز عبور جدید معتبر نیست: ' + str(e)
                    })
                
                user.set_password(new_password)
            
            # Handle other profile updates
            user.first_name = request.POST.get('first_name', user.first_name)
            user.last_name = request.POST.get('last_name', user.last_name)
            user.phone_number = request.POST.get('phone_number', user.phone_number)
            user.national_code = request.POST.get('national_code', user.national_code)
            user.birth_date = request.POST.get('birth_date', user.birth_date)
            user.gender = request.POST.get('gender', user.gender)
            user.bio = request.POST.get('bio', user.bio)
            
            user.save()
            
            # If password was changed, re-authenticate the user
            if current_password and new_password and confirm_password:
                user = authenticate(request, username=user.username, password=new_password)
                if user is not None:
                    login(request, user)
            
            messages.success(request, 'پروفایل با موفقیت بروزرسانی شد')
            return JsonResponse({'success': True})
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    return JsonResponse({'success': False, 'error': 'Invalid request method'})

def auth(request):
    global notfound
    notfound = ""
    login_form = LoginForm(request.POST or None)
    register_form = RegisterForm(request.POST or None)

    if request.method == "POST":
        if 'action' in request.POST:
            if request.POST['action'] == 'login_btn':
                if login_form.is_valid():
                    username = login_form.cleaned_data.get('userName')
                    password = login_form.cleaned_data.get('password')
                    user = authenticate(request, username=username, password=password)
                    if user is not None:
                        login(request, user)
                        return redirect('/dashboard')
                    else:
                        notfound = "کاربر یافت نشد.\n نام کاربری یا رمز عبور اشتباه"
            elif request.POST['action'] == 'register':
                if register_form.is_valid():
                    username = register_form.cleaned_data.get('userName')
                    email = register_form.cleaned_data.get('email')
                    password = register_form.cleaned_data.get('password')
                    
                    # Get additional fields from the form
                    national_code = register_form.cleaned_data.get('national_code')
                    phone_number = register_form.cleaned_data.get('phone_number')
                    birth_date = register_form.cleaned_data.get('birth_date')
                    gender = register_form.cleaned_data.get('gender')
                    
                    try:
                        # Create new user with all fields
                        user = User.objects.create_user(
                            username=username,
                            email=email,
                            password=password,
                            national_code=national_code,
                            phone_number=phone_number,
                            birth_date=birth_date,
                            gender=gender
                        )
                        
                        # Authenticate and login the new user
                        user = authenticate(request, username=username, password=password)
                        if user is not None:
                            login(request, user)
                            return redirect('/dashboard')
                    except Exception as e:
                        notfound = f"خطا در ثبت نام: {str(e)}"

    context = {
        'login_form': login_form,
        'register_form': register_form,
        'notfound': notfound,
        'gender_choices': User.GENDER_CHOICES,  # Add gender choices to context
    }
    return render(request, "login.html", context)

def about(request):
    return render(request, 'about.html')

@login_required
def active_trip(request):
    # Get the user's active trip (you'll need to implement the logic to determine what makes a trip "active")
    active_trip = Trip.objects.filter(
        user=request.user,
        status='active'  # Assuming you have a status field in your Trip model
    ).first()
    
    if active_trip:
        # Calculate trip progress
        total_days = (active_trip.end_date - active_trip.start_date).days
        days_passed = (datetime.now().date() - active_trip.start_date).days
        progress = min(100, max(0, int((days_passed / total_days) * 100)))
        
        # Get upcoming activities
        upcoming_activities = active_trip.activities.filter(
            date__gte=datetime.now().date()
        ).order_by('date', 'time')[:5]
        
        # Add icons for activities
        activity_icons = {
            'hotel': 'https://cdn.lordicon.com/jeuxydnh.json',
            'flight': 'https://cdn.lordicon.com/onmwuuox.json',
            'tour': 'https://cdn.lordicon.com/pkxwrmde.json',
            'restaurant': 'https://cdn.lordicon.com/wsaaegar.json',
            'default': 'https://cdn.lordicon.com/jeuxydnh.json'
        }
        
        for activity in upcoming_activities:
            activity.icon = activity_icons.get(activity.type, activity_icons['default'])
        
        context = {
            'active_trip': active_trip,
            'upcoming_activities': upcoming_activities,
            'progress': progress
        }
    else:
        context = {
            'active_trip': None
        }
    
    return render(request, 'active_trip.html', context)

@login_required
def all_trips(request):
    trips = Trip.objects.filter(user=request.user).order_by('-start_date')
    return render(request, 'all_trips.html', {'trips': trips})
