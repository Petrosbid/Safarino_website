"""
URL configuration for Safarino project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth import views as auth_views
from . import views
from Safarino.views import home_page, auth, user_dashboard, update_profile , active_trip

urlpatterns = ([
    path('admin/', admin.site.urls),
    path('', home_page, name='home'),
    path('login', auth, name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='home'), name='logout'),
    path('dashboard', user_dashboard, name='user_dashboard'),
    path('dashboard/update-profile/', update_profile, name='update_profile'),
    path('dashboard/active-trip/', active_trip, name='active_trip'),
    path('dashboard/all-trips/', views.all_trips, name='all_trips'),
    path('blog/', include(('blog.urls', 'blog'), namespace='blog')),
    path('', include(('blog.urls', 'blog_root'), namespace='blog_root')),
    path('trip/', include(('trip.urls', 'trip'), namespace='trip')),
    path('ckeditor/', include('ckeditor_uploader.urls')), # اضافه کردن مسیر برای ckeditor
    path('about/', views.about, name='about'),
    path('comments/', include(('comments.urls', 'comments'), namespace='comments')),
    path('', include(('Hotel.urls', 'hotel_root'), namespace='hotel_root')),
    path('hotel/', include(('Hotel.urls', 'hotel'), namespace='hotel'))
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
  + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)) # اصلاح مسیر برای media files
