from django.urls import path
from . import views

app_name = 'hotel'

urlpatterns = [
    path('', views.hotel_list, name='hotel_list'),
    path('hotel/<int:hotel_id>/', views.hotel_post, name='hotel_post'),
] 