from django.db import models

# Create your models here.


class Game(models.Model):
    app_id = models.IntegerField()
    name = models.TextField()
    img = URLField()
    tags = CharField()