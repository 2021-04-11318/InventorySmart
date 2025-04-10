# api/serializers.py

from rest_framework import serializers
from .models import InventorySoftware, Feature, SoftwareFeature, Review, Rating
from accounts.models import User, VendorProfile, NormalUserProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'password', 'is_vendor')
        extra_kwargs = {'password': {'write_only': True}}

class VendorProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    
    class Meta:
        model = VendorProfile
        fields = ('id', 'user', 'company_name', 'contact_person')
    
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user_data['is_vendor'] = True
        user = User.objects.create_user(**user_data)
        return VendorProfile.objects.create(user=user, **validated_data)

class NormalUserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    
    class Meta:
        model = NormalUserProfile
        fields = ('id', 'user', 'name')
    
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user_data['is_vendor'] = False
        user = User.objects.create_user(**user_data)
        return NormalUserProfile.objects.create(user=user, **validated_data)

class FeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feature
        fields = '__all__'

class SoftwareFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoftwareFeature
        fields = ['feature', 'details']

class InventorySoftwareSerializer(serializers.ModelSerializer):
    features = SoftwareFeatureSerializer(source='softwarefeature_set', many=True)
    vendor_name = serializers.CharField(source='vendor.company_name', read_only=True)
    
    class Meta:
        model = InventorySoftware
        fields = '__all__'
        read_only_fields = ('vendor',)
    
    def create(self, validated_data):
        features_data = validated_data.pop('softwarefeature_set')
        software = InventorySoftware.objects.create(**validated_data)
        
        for feature_data in features_data:
            SoftwareFeature.objects.create(
                software=software,
                **feature_data
            )
        return software

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'software', 'user', 'user_name', 'content', 'created_at', 'updated_at']
        read_only_fields = ['user']

class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['id', 'software', 'user', 'rating', 'created_at']
        read_only_fields = ['user']