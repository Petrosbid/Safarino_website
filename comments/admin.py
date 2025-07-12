from django.contrib import admin
from .models import Comment

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('user', 'text_snippet', 'content_object', 'created_at', 'status')
    list_filter = ('status', 'created_at', 'content_type')
    search_fields = ('user__username', 'text')
    actions = ['approve_comments', 'reject_comments']

    def text_snippet(self, obj):
        return obj.text[:50] + "..." if len(obj.text) > 50 else obj.text
    text_snippet.short_description = 'متن کامنت'

    def approve_comments(self, request, queryset):
        queryset.update(status='approved')
    approve_comments.short_description = "تایید کامنت‌های انتخاب شده"

    def reject_comments(self, request, queryset):
        queryset.update(status='rejected')
    reject_comments.short_description = "رد کامنت‌های انتخاب شده"

    # For displaying content_object more meaningfully if needed, though default is usually fine.
    # You might need to customize how content_object is displayed if it's not clear enough.
