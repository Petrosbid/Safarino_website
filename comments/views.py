from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.contenttypes.models import ContentType
from django.http import JsonResponse
from django.contrib import messages
from .models import Comment

# Create your views here.

@login_required
def add_comment(request):
    if request.method == 'POST':
        content_type = request.POST.get('content_type')
        object_id = request.POST.get('object_id')
        text = request.POST.get('text')

        if not all([content_type, object_id, text]):
            messages.error(request, 'لطفا تمام فیلدها را پر کنید.')
            return redirect(request.META.get('HTTP_REFERER', '/'))

        try:
            content_type = ContentType.objects.get(model=content_type.split('.')[-1])
            comment = Comment.objects.create(
                user=request.user,
                text=text,
                content_type=content_type,
                object_id=object_id
            )
            messages.success(request, 'نظر شما با موفقیت ثبت شد و پس از تایید نمایش داده خواهد شد.')
        except Exception as e:
            messages.error(request, 'خطا در ثبت نظر. لطفا دوباره تلاش کنید.')
            
        return redirect(request.META.get('HTTP_REFERER', '/'))

@login_required
def like_comment(request, comment_id):
    if request.method == 'POST':
        comment = get_object_or_404(Comment, id=comment_id)
        comment.likes += 1
        comment.save()
        return JsonResponse({'likes': comment.likes})
    return JsonResponse({'error': 'Invalid request'}, status=400)
