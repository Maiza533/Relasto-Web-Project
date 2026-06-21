import json

from rest_framework import serializers
from .models import Profile, Property, Blog, PropertyFeatures, User, Review, AgentProfile, PropertyVideo, PropertyImage, Review, VisitRequest
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.db.models import Avg


class BlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = '__all__'


class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ['image']

class PropertyVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyVideo
        fields = ['video']
        

class PropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    videos = PropertyVideoSerializer(many=True, read_only=True)
    class Meta:
        model = Property
        fields = '__all__'
        read_only_fields = ['slug', 'agent']

    def validate_features(self, value):
        if isinstance(value, str):
            try:
                value = json.loads(value)
            except json.JSONDecodeError:
                raise serializers.ValidationError('Invalid features format')
        return value

    def create(self, validated_data):
        features_data = validated_data.pop('features', [])
        property_obj = Property.objects.create(**validated_data)

        for feature in features_data:
            PropertyFeatures.objects.create(property=property_obj, **feature)

        return property_obj

class AgentSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='user.id') 
    name = serializers.CharField(source='user.username')
    rating = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = AgentProfile
        fields = ['id', 'name', 'image', 'rating']

    def get_rating(self, obj):
        avg = Review.objects.filter(agent=obj.user).aggregate(avg=Avg('rating'))['avg']
        return round(avg, 1) if avg else 0

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return ''
        

class BuyerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['phone', 'city', 'budget_min', 'budget_max', 'property_type', 'purpose']




class ReviewSerializer(serializers.ModelSerializer):
    reviewer_name = serializers.CharField(source="reviewer.username", read_only=True)

    class Meta:
        model = Review
        fields = [
            "id",
            "reviewer",
            "reviewer_name",
            "agent",
            "rating",
            "comment",
            "created_at"
        ]
        read_only_fields = ["reviewer", "created_at"]

class VisitRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = VisitRequest
        fields = '__all__'