from django.db import models

class Place(models.Model):
    BUDGET_CHOICES = [
        ('low', 'کم'),
        ('medium', 'متوسط'),
        ('high', 'زیاد'),
    ]

    Cost = models.CharField(max_length=10, choices=BUDGET_CHOICES, verbose_name='بودجه')
    name = models.CharField(max_length=255, verbose_name='نام مکان')
    description = models.TextField(verbose_name='توضیحات')
    address = models.TextField(verbose_name='آدرس')
    location = models.CharField(max_length=255, verbose_name='لوکیشن جغرافیایی')  # مثلاً "35.6892, 51.3890"
    score = models.FloatField(default=0, verbose_name='امتیاز')
    type = models.CharField(max_length=100, verbose_name='نوع مکان')  # مثلاً: جنگلی، کویری، ساحلی و...
    views = models.PositiveIntegerField(default=0, verbose_name='تعداد بازدید')
    city = models.CharField(max_length=100, verbose_name='شهر   ')
    def __str__(self):
        return self.name

class PlaceImage(models.Model):
    place = models.ForeignKey(Place, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='place_images/', verbose_name='عکس مکان')

    def __str__(self):
        return f'تصویر  {self.place.name}'

