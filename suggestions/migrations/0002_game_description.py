# Generated by Django 3.1.1 on 2020-11-24 16:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('suggestions', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='game',
            name='description',
            field=models.TextField(blank=True),
        ),
    ]