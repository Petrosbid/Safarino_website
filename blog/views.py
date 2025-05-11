from django.shortcuts import render , get_list_or_404
from .models import Post
# Create your views here.
def show_post(request):
    posts = Post.objects.all()
    context = {
        'blog_list': posts,
    }
    return render(request , 'blog.html' , context)

def blog_post(request , post_id):
    #post = Post.objects.get(title = post_title)
    post = get_list_or_404(Post , id = post_id)
    context = {
        'post': post,
    }
    return render(request , 'blogPost.html' , context)