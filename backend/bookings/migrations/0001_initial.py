# Generated by Django 5.2.3 on 2025-06-22 20:12

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('venues', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Booking',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=150)),
                ('email', models.EmailField(max_length=254)),
                ('phone', models.CharField(max_length=40)),
                ('group_size', models.PositiveIntegerField()),
                ('check_in', models.DateField()),
                ('check_out', models.DateField()),
                ('message', models.TextField(blank=True)),
                ('total_price', models.DecimalField(decimal_places=2, default=100, max_digits=12)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('confirmed', models.BooleanField(default=False)),
                ('venue', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bookings', to='venues.venue')),
            ],
        ),
    ]
