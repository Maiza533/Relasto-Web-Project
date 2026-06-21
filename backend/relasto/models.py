import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.text import slugify
from django.conf import settings


class User(AbstractUser):
    ROLE_CHOICES = (
        ('buyer', 'Buyer'),
        ('agent', 'Agent'),
    )

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='buyer')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    
class Property(models.Model):
    TYPE_CHOICES = [
        ('resident', 'Resident'),
        ('commercial', 'Commercial'),
        ('industrial', 'Industrial'),
        ('agriculture', 'Agriculture'),
    ]

    STATUS_CHOICES = [
        ('sale', 'For Sale'),
        ('rent', 'For Rent'),
    ]

    agent = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)

    address = models.TextField()
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)

    bedrooms = models.IntegerField(null=True)
    bathrooms = models.IntegerField(null=True)
    area = models.FloatField(null=True)
    year_built = models.IntegerField(null=True)

    parking = models.CharField(max_length=50, null=True)
    outdoor = models.CharField(max_length=100, null=True)
    price_per_sqft = models.FloatField(null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title) + "-" + str(uuid.uuid4())[:6]
        super().save(*args, **kwargs)


class PropertyImage(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="properties/images/")

class PropertyVideo(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="videos")
    video = models.FileField(upload_to="properties/videos/")


class PropertyFeatures(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='features')
    key = models.CharField(max_length=100)
    value = models.CharField(max_length=200)


class VisitRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    agent = models.ForeignKey(User, on_delete=models.CASCADE, related_name="visit_requests")
    property = models.ForeignKey(Property, on_delete=models.CASCADE)

    name = models.CharField(max_length=100, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    preferred_date = models.DateField()
    message = models.TextField(blank=True, null=True)

    is_reviewed = models.BooleanField(default=False)
    is_completed = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    visit_time = models.DateTimeField(null=True, blank=True)

    status = models.CharField(
    max_length=20,
    choices=[
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected")
    ],
    default="pending"
)

class Blog(models.Model):
    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='blogs/', null=True, blank=True)
    description = models.TextField()

class AgentProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='agents/', null=True, blank=True)
    banner = models.ImageField(upload_to='banners/', null=True, blank=True)
    phone = models.CharField(max_length=20)
    bio = models.TextField(blank=True)
    experience = models.CharField(max_length=100)
    address = models.CharField(max_length=255)

    def __str__(self):
        return self.user.username
    
class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='buyers/', null=True, blank=True)
    banner = models.ImageField(upload_to='banners/', null=True, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    city = models.CharField(max_length=100, blank=True)

    budget_min = models.IntegerField(null=True, blank=True)
    budget_max = models.IntegerField(null=True, blank=True)

    property_type = models.CharField(max_length=50, blank=True)
    purpose = models.CharField(max_length=20, choices=[('buy', 'Buy'), ('rent', 'Rent')], blank=True)
    about = models.TextField(blank=True)

    def __str__(self):
        return self.user.username
    

class Review(models.Model):
    reviewer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="given_reviews", null=True, blank=True
    )

    agent = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="received_reviews", null=True, blank=True
    )

    rating = models.IntegerField()
    comment = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.reviewer.email} → {self.agent.email}"
    
