from django.contrib import admin
from .models import User, Profile, Property, Blog, Review, VisitRequest

admin.site.register(User)
admin.site.register(Profile)
admin.site.register(Property)
admin.site.register(Blog)
admin.site.register(Review)
admin.site.register(VisitRequest)

