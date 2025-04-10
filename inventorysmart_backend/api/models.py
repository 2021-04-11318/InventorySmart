from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from accounts.models import VendorProfile, User

class Feature(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    
    def __str__(self):
        return self.name

class InventorySoftware(models.Model):
    INDUSTRY_CHOICES = [
        ('retail', 'Retail'),
        ('manufacturing', 'Manufacturing'),
        ('healthcare', 'Healthcare'),
        ('logistics', 'Logistics'),
        ('other', 'Other'),
    ]
    
    INVENTORY_SIZE_CHOICES = [
        ('small', 'Small (< 1000 items)'),
        ('medium', 'Medium (1000-10000 items)'),
        ('large', 'Large (> 10000 items)'),
    ]
    
    DEPLOYMENT_METHOD_CHOICES = [
        ('cloud', 'Cloud-based'),
        ('on-premise', 'On-premise'),
        ('hybrid', 'Hybrid'),
    ]
    
    DEPLOYMENT_PLATFORM_CHOICES = [
        ('web', 'Web-based'),
        ('desktop', 'Desktop'),
        ('mobile', 'Mobile'),
        ('multi-platform', 'Multi-platform'),
    ]
    
    PRICING_METHOD_CHOICES = [
        ('subscription', 'Subscription'),
        ('one-time', 'One-time Purchase'),
        ('freemium', 'Freemium'),
    ]
    
    name = models.CharField(max_length=200)
    vendor = models.ForeignKey(VendorProfile, on_delete=models.CASCADE)
    description = models.TextField()
    features = models.ManyToManyField(Feature, through='SoftwareFeature')
    website = models.URLField()
    logo = models.ImageField(upload_to='software_logos/', null=True, blank=True)
    
    # Classification fields
    industry = models.CharField(max_length=20, choices=INDUSTRY_CHOICES)
    inventory_size = models.CharField(max_length=20, choices=INVENTORY_SIZE_CHOICES)
    deployment_method = models.CharField(max_length=20, choices=DEPLOYMENT_METHOD_CHOICES)
    deployment_platform = models.CharField(max_length=20, choices=DEPLOYMENT_PLATFORM_CHOICES)
    pricing_method = models.CharField(max_length=20, choices=PRICING_METHOD_CHOICES)
    
    def __str__(self):
        return self.name

class SoftwareFeature(models.Model):
    software = models.ForeignKey(InventorySoftware, on_delete=models.CASCADE)
    feature = models.ForeignKey(Feature, on_delete=models.CASCADE)
    details = models.TextField(blank=True)
    
    class Meta:
        unique_together = ('software', 'feature')

class Review(models.Model):
    software = models.ForeignKey(InventorySoftware, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('software', 'user')

class Rating(models.Model):
    software = models.ForeignKey(InventorySoftware, on_delete=models.CASCADE, related_name='ratings')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('software', 'user')