from django.contrib import admin

from Hotel.models import Hotel , HotelImage

# Register your models here.
class HotelImageInline(admin.TabularInline): # or admin.StackedInline for a different layout
    model = HotelImage
    extra = 5 # تعداد فرم های خالی برای اضافه کردن تصویر جدید
class HotelAdmin(admin.ModelAdmin):
    inlines = [HotelImageInline]

admin.site.register(Hotel, HotelAdmin)
admin.site.register(HotelImage)