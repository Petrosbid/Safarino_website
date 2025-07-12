from django.contrib import admin
from .models import Place, PlaceImage

# Register your models here.
class PlaceImageInline(admin.TabularInline): # or admin.StackedInline for a different layout
    model = PlaceImage
    extra = 5 # تعداد فرم های خالی برای اضافه کردن تصویر جدید
class PlaceAdmin(admin.ModelAdmin):
    inlines = [PlaceImageInline]

admin.site.register(Place, PlaceAdmin)
admin.site.register(PlaceImage)