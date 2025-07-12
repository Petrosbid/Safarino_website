from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    GENDER_CHOICES = [
        ('male', 'مرد'),
        ('female', 'زن'),
        ('other', 'سایر'),
    ]

    national_code = models.CharField(max_length=10, unique=True,null=True, verbose_name='کد ملی')
    phone_number = models.CharField(max_length=15, unique=True,null=True, verbose_name='شماره تلفن')
    birth_date = models.DateField(null=True, blank=True, verbose_name='تاریخ تولد')
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, null=True, blank=True, verbose_name='جنسیت')
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True, verbose_name='عکس پروفایل')
    bio = models.TextField(null=True, blank=True, verbose_name='بیوگرافی')
    date_joined = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ عضویت')

    def __str__(self):
        return f'{self.username}'

    class Meta:
        verbose_name = 'کاربر'
        verbose_name_plural = 'کاربران'
