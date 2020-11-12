from django.db import models

# Create your models here.


class Game(models.Model):
    name = models.TextField()
    app_id = models.IntegerField()
    price = models.FloatField()
    image = models.URLField(blank=True)
    tags = models.CharField(max_length=1000)

    