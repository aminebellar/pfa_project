# Generated by Django 5.2 on 2025-04-16 13:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_flight_created_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='flight',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
