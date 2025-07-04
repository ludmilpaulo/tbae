# Generated by Django 5.2.3 on 2025-06-22 20:12

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='About',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
                ('facebook_url', models.URLField(blank=True, null=True)),
                ('twitter_url', models.URLField(blank=True, null=True)),
                ('instagram_url', models.URLField(blank=True, null=True)),
                ('linkedin_url', models.URLField(blank=True, null=True)),
                ('youtube_url', models.URLField(blank=True, null=True)),
                ('tiktok_url', models.URLField(blank=True, null=True)),
                ('whatsapp_url', models.URLField(blank=True, null=True)),
                ('pinterest_url', models.URLField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Client',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=120, unique=True)),
                ('logo', models.ImageField(upload_to='clients/')),
                ('website', models.URLField(blank=True, null=True)),
                ('order', models.PositiveIntegerField(default=0)),
            ],
            options={
                'ordering': ['order', 'name'],
            },
        ),
        migrations.CreateModel(
            name='ContactRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=120)),
                ('email', models.EmailField(max_length=254)),
                ('phone', models.CharField(blank=True, max_length=32)),
                ('message', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('responded', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='FAQCategory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True)),
                ('order', models.PositiveIntegerField(default=0)),
            ],
            options={
                'ordering': ['order', 'name'],
            },
        ),
        migrations.CreateModel(
            name='GalleryImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('url', models.ImageField(upload_to='gallery/')),
                ('title', models.CharField(max_length=100)),
                ('alt', models.CharField(blank=True, max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='Homepage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bannerTitle', models.CharField(max_length=100)),
                ('bannerImage', models.ImageField(upload_to='homepage/')),
            ],
        ),
        migrations.CreateModel(
            name='Stat',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('label', models.CharField(max_length=100)),
                ('value', models.PositiveIntegerField()),
                ('order', models.PositiveIntegerField(default=0)),
            ],
            options={
                'ordering': ['order', 'label'],
            },
        ),
        migrations.CreateModel(
            name='TeamMember',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=80)),
                ('role', models.CharField(max_length=100)),
                ('photo', models.ImageField(upload_to='team/')),
                ('bio', models.TextField(blank=True, null=True)),
                ('order', models.PositiveIntegerField(default=0)),
            ],
            options={
                'ordering': ['order', 'name'],
            },
        ),
        migrations.CreateModel(
            name='Testimonial',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('text', models.TextField()),
                ('company', models.CharField(max_length=100)),
                ('image', models.ImageField(blank=True, null=True, upload_to='testimonials/')),
                ('feedback', models.TextField()),
                ('avatar', models.ImageField(upload_to='testimonials/')),
            ],
        ),
        migrations.CreateModel(
            name='TimelineEvent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('year', models.PositiveIntegerField()),
                ('title', models.CharField(max_length=150)),
                ('desc', models.TextField()),
                ('order', models.PositiveIntegerField(default=0)),
            ],
            options={
                'ordering': ['order', 'year'],
            },
        ),
        migrations.CreateModel(
            name='FAQ',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question', models.CharField(max_length=512)),
                ('answer', models.TextField()),
                ('order', models.PositiveIntegerField(default=0)),
                ('is_active', models.BooleanField(default=True)),
                ('category', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='faqs', to='core.faqcategory')),
            ],
            options={
                'ordering': ['category__order', 'order', 'question'],
            },
        ),
    ]
