from django.urls import path
from . import views

app_name = 'place'

urlpatterns = [
    path('', views.places_list, name='places_list'),
    path('<int:place_id>/', views.place_detail, name='place_detail'),
] 