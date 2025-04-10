# api/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'software', views.InventorySoftwareViewSet)
router.register(r'features', views.FeatureViewSet)
router.register(r'reviews', views.ReviewViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # Authentication URLs
    path('signup/user/', views.UserSignupView.as_view(), name='user-signup'),
    path('signup/vendor/', views.VendorSignupView.as_view(), name='vendor-signup'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    # Search and Rating URLs
    path('software/search/', views.search_software, name='search-software'),
    path('software/<int:pk>/rate/', views.rate_software, name='rate-software'),
]