from django.db import models
from ckeditor_uploader.fields import RichTextUploadingField
from django.core.validators import MinValueValidator, MaxValueValidator


class Hotel(models.Model):
    name = models.CharField(max_length=200, verbose_name="نام هتل")
    description = models.TextField(verbose_name="توضیحات")
    city = models.CharField(max_length=100, verbose_name="شهر" , null=True, blank=True)
    address = models.TextField(verbose_name="آدرس")
    rating = models.DecimalField(
        max_digits=3,
        decimal_places=1,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
        verbose_name="امتیاز",
        default=0
    )
    stars = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        verbose_name="تعداد ستاره"
    )
    price_per_night = models.DecimalField(
        max_digits=12,
        decimal_places=0,
        verbose_name="قیمت هر شب",
        null=True
    )
    image = models.ImageField(upload_to='hotels/', verbose_name="تصویر اصلی" , null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Amenities
    has_pool = models.BooleanField(default=False, verbose_name="استخر")
    has_spa = models.BooleanField(default=False, verbose_name="اسپا")
    has_gym = models.BooleanField(default=False, verbose_name="باشگاه ورزشی")
    has_restaurant = models.BooleanField(default=False, verbose_name="رستوران")
    has_wifi = models.BooleanField(default=True, verbose_name="اینترنت")
    has_parking = models.BooleanField(default=False, verbose_name="پارکینگ")
    has_room_service = models.BooleanField(default=False, verbose_name="سرویس اتاق")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "هتل"
        verbose_name_plural = "هتل‌ها"
        ordering = ['-rating', '-stars']

class HotelImage(models.Model):
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='hotels/gallery/')
    is_primary = models.BooleanField(default=False)

    class Meta:
        verbose_name = "تصویر هتل"
        verbose_name_plural = "تصاویر هتل"

    def __str__(self):
        return f"تصویر {self.hotel.name}"

class HotelComment(models.Model):
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name='comments', verbose_name='هتل')
    user = models.ForeignKey('User.User', on_delete=models.CASCADE, verbose_name='کاربر')
    text = models.TextField(verbose_name='متن نظر')
    rating = models.PositiveSmallIntegerField(default=5, verbose_name='امتیاز')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ثبت')
    is_approved = models.BooleanField(default=False, verbose_name='تایید شده')

    def __str__(self):
        return f'نظر {self.user} برای {self.hotel}'

    class Meta:
        verbose_name = 'نظر هتل'
        verbose_name_plural = 'نظرات هتل'
