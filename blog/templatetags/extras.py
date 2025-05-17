from django import template
import jdatetime
from datetime import datetime
from django.db import models
from blog.models import Post

register = template.Library()


@register.filter
def read_time(value):
    word_count = len(value.split())
    minutes = max(1, word_count // 200)
    return minutes


@register.filter
def jdate(date, format_string="%Y/%m/%d"):
    """Convert a Gregorian date to Jalali (Persian) date"""
    if not date:
        return ""

    try:
        # If it's already a datetime object, use it directly
        if not isinstance(date, datetime):
            # If it's a string, try to parse it
            if isinstance(date, str):
                try:
                    date = datetime.strptime(date, "%Y-%m-%d")
                except ValueError:
                    # If we can't parse it, return it as is
                    return date

        # Convert to Jalali
        jalali_date = jdatetime.datetime.fromgregorian(datetime=date)
        return jalali_date.strftime(format_string)
    except Exception as e:
        # In case of any error, return a debug message
        return f"Error: {str(e)}"


@register.simple_tag
def get_related_posts(post, count=6):
    """
    Returns related posts based on category and city, excluding the current post.
    Prioritizes posts with the same category and city, then fills with same category or city if needed.
    """
    if not post:
        return Post.objects.none()
    qs = Post.objects.filter(category=post.category, city=post.city).exclude(id=post.id)
    if qs.count() < count:
        # Fill with same category or same city if not enough
        extra_qs = Post.objects.filter(
            (models.Q(category=post.category) | models.Q(city=post.city))
        ).exclude(id__in=list(qs.values_list('id', flat=True)) + [post.id])
        qs = list(qs) + list(extra_qs[:count-len(qs)])
        return qs[:count]
    return qs[:count]