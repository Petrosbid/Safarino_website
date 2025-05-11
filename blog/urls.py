from django.urls import path, include
from .views import show_post , blog_post
from .models import Post
app_name = 'blog'
urlpatterns = ([
    path('', show_post, name='show_post'),
    path('blog/<post_id>', blog_post , name = 'blog_post')
])