from django.contrib import admin
from .models import InventorySoftware, Feature, SoftwareFeature

admin.site.register(InventorySoftware)
admin.site.register(Feature)
admin.site.register(SoftwareFeature)
