from django.contrib import admin

# Register your models here.
# accounts/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, VendorProfile, NormalUserProfile

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'is_staff', 'is_vendor')
    list_filter = ('is_staff', 'is_vendor')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'is_vendor')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'is_staff', 'is_active', 'is_vendor'),
        }),
    )
    search_fields = ('email',)
    ordering = ('email',)

@admin.register(VendorProfile)
class VendorProfileAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'contact_person', 'user')
    search_fields = ('company_name', 'contact_person')

@admin.register(NormalUserProfile)
class NormalUserProfileAdmin(admin.ModelAdmin):
    list_display = ('name', 'user')
    search_fields = ('name',)

# api/admin.py

from django.contrib import admin
from .models import InventorySoftware, Feature, SoftwareFeature, Review

@admin.register(InventorySoftware)
class InventorySoftwareAdmin(admin.ModelAdmin):
    list_display = ('name', 'vendor', 'industry', 'pricing_method', 'price')
    list_filter = ('industry', 'deployment_method', 'pricing_method')
    search_fields = ('name', 'description')

@admin.register(Feature)
class FeatureAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(SoftwareFeature)
class SoftwareFeatureAdmin(admin.ModelAdmin):
    list_display = ('software', 'feature')
    list_filter = ('feature',)

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('software', 'user', 'rating', 'created_at')
    list_filter = ('rating',)
    search_fields = ('comment',)