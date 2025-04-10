from django.shortcuts import render
import numpy as np

# Create your views here.
# api/views.py

from rest_framework import viewsets, status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import ValidationError, PermissionDenied
from django.core.exceptions import ObjectDoesNotExist
from django.db import IntegrityError
from django.db.models import Q, Avg
from django.contrib.auth import authenticate, login, logout

from .models import InventorySoftware, Feature, SoftwareFeature, Review, Rating
from accounts.models import User, VendorProfile, NormalUserProfile
from .serializers import (
    InventorySoftwareSerializer, FeatureSerializer, 
    UserSerializer, VendorProfileSerializer, NormalUserProfileSerializer,
    ReviewSerializer, RatingSerializer
)

# Authentication views
class UserSignupView(generics.CreateAPIView):
    serializer_class = NormalUserProfileSerializer
    permission_classes = [AllowAny]

class VendorSignupView(generics.CreateAPIView):
    serializer_class = VendorProfileSerializer
    permission_classes = [AllowAny]

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    user = authenticate(request, username=email, password=password)
    
    if user is not None:
        login(request, user)
        return Response({
            'id': user.id,
            'email': user.email,
            'is_vendor': user.is_vendor,
        })
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    logout(request)
    return Response({'detail': 'Successfully logged out'})

# Software views
class InventorySoftwareViewSet(viewsets.ModelViewSet):
    queryset = InventorySoftware.objects.all()
    serializer_class = InventorySoftwareSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'search']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def perform_create(self, serializer):
        try:
            if not hasattr(self.request.user, 'vendor_profile'):
                raise PermissionDenied('Only vendors can create software listings')
            serializer.save(vendor=self.request.user.vendor_profile)
        except IntegrityError as e:
            raise ValidationError({'error': 'Software with this name already exists'})
        except Exception as e:
            raise ValidationError({'error': str(e)})

@api_view(['GET'])
@permission_classes([AllowAny])
def search_software(request):
    # Get criteria weights from request
    weights = {
        'industry': float(request.GET.get('industry_weight', 0.2)),
        'inventory_size': float(request.GET.get('size_weight', 0.2)),
        'deployment_method': float(request.GET.get('deployment_weight', 0.15)),
        'deployment_platform': float(request.GET.get('platform_weight', 0.15)),
        'pricing_method': float(request.GET.get('pricing_weight', 0.3))
    }
    
    # Get user preferences
    preferred_industry = request.GET.get('industry')
    preferred_size = request.GET.get('inventorySize')
    preferred_deployment = request.GET.get('deploymentMethod')
    preferred_platform = request.GET.get('deploymentPlatform')
    preferred_pricing = request.GET.get('pricingMethod')
    
    # Get all software
    queryset = InventorySoftware.objects.all()
    
    def calculate_score(software):
        scores = []
        
        # Calculate similarity scores for each criterion
        if preferred_industry:
            industry_score = 1.0 if software.industry == preferred_industry else 0.0
            scores.append(industry_score * weights['industry'])
        
        if preferred_size:
            size_score = 1.0 if software.inventory_size == preferred_size else 0.0
            scores.append(size_score * weights['inventory_size'])
            
        if preferred_deployment:
            deployment_score = 1.0 if software.deployment_method == preferred_deployment else 0.0
            scores.append(deployment_score * weights['deployment_method'])
            
        if preferred_platform:
            platform_score = 1.0 if software.deployment_platform == preferred_platform else 0.0
            scores.append(platform_score * weights['deployment_platform'])
            
        if preferred_pricing:
            pricing_score = 1.0 if software.pricing_method == preferred_pricing else 0.0
            scores.append(pricing_score * weights['pricing_method'])
        
        # Calculate final weighted score
        return sum(scores) if scores else 0.0
    
    # Calculate scores for all software
    ranked_software = []
    for software in queryset:
        score = calculate_score(software)
        ranked_software.append((software, score))
    
    # Sort by score in descending order
    ranked_software.sort(key=lambda x: x[1], reverse=True)
    
    # Return only the software objects, now sorted by relevance
    sorted_queryset = [item[0] for item in ranked_software]
    serializer = InventorySoftwareSerializer(sorted_queryset, many=True)
    
    return Response({
        'results': serializer.data,
        'weights_used': weights
    })

# Feature views
class FeatureViewSet(viewsets.ModelViewSet):
    queryset = Feature.objects.all()
    serializer_class = FeatureSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]

# Review and Rating views
class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        try:
            if not serializer.validated_data.get('content'):
                raise ValidationError({'content': 'Review content is required'})
            if len(serializer.validated_data['content']) < 10:
                raise ValidationError({'content': 'Review must be at least 10 characters long'})
            serializer.save(user=self.request.user)
        except IntegrityError:
            raise ValidationError({'error': 'You have already reviewed this software'})

    def get_queryset(self):
        queryset = super().get_queryset()
        software_id = self.request.query_params.get('software', None)
        if software_id is not None:
            queryset = queryset.filter(software_id=software_id)
        return queryset

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def rate_software(request, pk):
    try:
        software = InventorySoftware.objects.get(pk=pk)
        rating_value = request.data.get('rating')
        
        if not rating_value or not isinstance(rating_value, int) or not (1 <= rating_value <= 5):
            raise ValidationError({'rating': 'Rating must be an integer between 1 and 5'})
        
        rating, created = Rating.objects.get_or_create(
            user=request.user,
            software=software,
            defaults={'rating': rating_value}
        )
        
        if not created:
            rating.rating = rating_value
            rating.save()
        
        avg_rating = Rating.objects.filter(software=software).aggregate(Avg('rating'))
        return Response({'average_rating': avg_rating['rating__avg']})
    except ObjectDoesNotExist:
        return Response({'error': 'Software not found'}, status=status.HTTP_404_NOT_FOUND)
    except ValidationError as e:
        return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)