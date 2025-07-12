from django.db import models


class City(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    population = models.PositiveIntegerField()
    area = models.FloatField(help_text="مساحت به کیلومتر مربع")

    def __str__(self):
        return self.name

class CityImage(models.Model):
    city = models.ForeignKey(City, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='city_images/')

    def __str__(self):
        return f"Image of {self.city.name}"