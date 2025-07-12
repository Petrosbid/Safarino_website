from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()

class Trip(models.Model):
    BUDGET_CHOICES = [
        ('low', 'کم'),
        ('medium', 'متوسط'),
        ('high', 'زیاد'),
    ]

    STATUS_CHOICES = [
        ('canceled', 'لغو شده'),
        ('running', 'در حال انجام'),
        ('finished', 'پایان یافته'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='trips', verbose_name='کاربر')
    budget = models.CharField(max_length=10, choices=BUDGET_CHOICES, verbose_name='بودجه')
    people_count = models.PositiveIntegerField(verbose_name='تعداد افراد')
    distance = models.FloatField(verbose_name='مسافت (کیلومتر)')
    trip_type = models.CharField(max_length=100, verbose_name='نوع سفر')  # مثل: خانوادگی، دوستانه، تنهایی
    places_of_interest = models.TextField(verbose_name='علاقه‌مندی‌ها')  # مثل: بازار، تاریخی، طبیعی (رشته جداشده با ویرگول یا خط تیره)
    places_per_day = models.PositiveIntegerField(default=1, verbose_name='تعداد مکان در روز')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='running', verbose_name='وضعیت سفر')
    start_date = models.DateField(verbose_name='تاریخ شروع')
    end_date = models.DateField(verbose_name='تاریخ پایان')

    def __str__(self):
        return f'سفر {self.trip_type} با {self.people_count} نفر'

    class Meta:
        verbose_name = 'سفر'
        verbose_name_plural = 'سفرها'

class TripPlan(models.Model):
    COMPANION_CHOICES = [
        ('alone', 'تنهایی'),
        ('partner', 'پارتنر'),
        ('friends', 'دوستان'),
        ('family', 'خانوادگی'),
    ]

    BUDGET_CHOICES = [
        ('low', 'کم'),
        ('medium', 'متوسط'),
        ('high', 'زیاد'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='trip_plans')
    companion_type = models.CharField(max_length=20, choices=COMPANION_CHOICES)
    budget_level = models.CharField(max_length=20, choices=BUDGET_CHOICES)
    interests = models.JSONField()  # Store list of interests
    start_date = models.CharField(max_length=11)
    end_date = models.CharField(max_length=11)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Trip Plan for {self.user.username} - {self.start_date} to {self.end_date}"
