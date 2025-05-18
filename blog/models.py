from django.db import models
from django.contrib.auth import get_user_model
from City.models import City
from ckeditor_uploader.fields import RichTextUploadingField

User = get_user_model()
# Create your models here.
class Post(models.Model):
    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='post_images/', null=True, blank=True)
    content = RichTextUploadingField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    category = models.CharField(max_length=100)  # موضوع پست
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='posts')
    likes = models.PositiveIntegerField(default=0)
    views = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.title}"