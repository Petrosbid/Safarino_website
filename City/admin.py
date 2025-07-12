from django.contrib import admin
from .models import City, CityImage

# Register your models here.

class CityImageInline(admin.TabularInline): # or admin.StackedInline for a different layout
    model = CityImage
    extra = 5
class CityAdmin(admin.ModelAdmin):
    inlines = [CityImageInline]

admin.site.register(City, CityAdmin)
admin.site.register(CityImage) # اختیاری: اگر می خواهید مدل CityImage را جداگانه هم در ادمین ببینید
