from django.urls import path
from . import views

app_name = 'trip'
 
urlpatterns = [
    path('planner/', views.planner_form, name='planner_form'),
    path('plan/<int:plan_id>/', views.plan_detail, name='plan_detail'),
    path('plan/200', views.fake_trip_plan, name='fake_trip_plan'),
] 