from django.shortcuts import render , get_list_or_404, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.contrib.contenttypes.models import ContentType
from .models import Post
from comments.models import Comment

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
    post[0].views += 1
    post[0].save()
    
    # Get comments for this post
    content_type = ContentType.objects.get_for_model(Post)
    comments = Comment.objects.filter(
        content_type=content_type,
        object_id=post_id,
        status='approved'
    ).order_by('-created_at')
    
    context = {
        'post': post,
        'comments': comments,
    }
    return render(request , 'blogPost.html' , context)

@require_POST
def update_likes(request, post_id):
    if not request.is_ajax():
        return JsonResponse({'error': 'Invalid request'}, status=400)
    
    post = get_object_or_404(Post, id=post_id)
    action = request.POST.get('action')
    
    if action == 'like':
        post.likes += 1
    elif action == 'dislike':
        if post.likes > 0:
            post.likes -= 1
    else:
        return JsonResponse({'error': 'Invalid action'}, status=400)
    
    post.save()
    return JsonResponse({'likes': post.likes})