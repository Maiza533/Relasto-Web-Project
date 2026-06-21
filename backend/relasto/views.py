from django.shortcuts import render
from django.contrib.auth import authenticate
from .models import PropertyImage, PropertyVideo, PropertyFeatures, User, Property, Blog, AgentProfile, Review, Profile, VisitRequest
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .serializers import BuyerProfileSerializer, PropertySerializer, BlogSerializer, ReviewSerializer, AgentSerializer, PropertyImageSerializer, VisitRequestSerializer
from rest_framework import status
from django.db.models import Avg
import json

@api_view(['POST'])
def login_view(request):

    email = request.data.get("email")
    password = request.data.get("password")

    user = authenticate(username=email, password=password)


    if user is not None:

        refresh = RefreshToken.for_user(user)
 
        return Response({
            "msg": "Login Successful",
            "user_id": user.id,
            "role": user.role,
            "access": str(refresh.access_token),   
            "refresh": str(refresh)                
        })
    return Response({"error": "Invalid credentials"}, status=400)
    
@api_view(['POST'])
def signup_view(request):
    email = request.data.get("email")
    username = request.data.get("username")
    password = request.data.get("password")
    confirm_password = request.data.get("confirm_password")
    role = request.data.get("role")

    if password != confirm_password:
        return Response({"msg": "Passwords do not match"}, status=400)

    if User.objects.filter(email=email).exists():
        return Response({"msg": "Email already exists"}, status=400)

    user = User.objects.create_user(email=email, username=username, password=password, role=role)

    refresh = RefreshToken.for_user(user)

    return Response({
        "msg": "Account Created Successfully!",
        "user_id": user.id,
        "access": str(refresh.access_token),   
        "refresh": str(refresh)                
    })



@api_view(['GET', 'POST', 'DELETE'])  
def get_properties(request):

    if request.method == 'GET':
        properties = Property.objects.all()
        
        property_type = request.GET.get('type')
        if property_type:
            properties = properties.filter(type=property_type)
            
        search = request.GET.get('search')
        if search:
            properties = properties.filter(title__icontains=search) | properties.filter(address__icontains=search)
            
        status = request.GET.get('status')
        if status:
            properties = properties.filter(status=status)
            
        price_min = request.GET.get('price_min')
        if price_min:
            properties = properties.filter(price__gte=price_min)
            
        price_max = request.GET.get('price_max')
        if price_max:
            properties = properties.filter(price__lte=price_max)
        
        properties = properties.order_by('-id')
        
        # Pagination
        page = int(request.GET.get('page', 1))
        limit = int(request.GET.get('limit', 12))  
        start = (page - 1) * limit
        end = start + limit
        total = properties.count()
        properties = properties[start:end]
        
        serializer = PropertySerializer(properties, many=True, context={'request': request})
        return Response({
            'properties': serializer.data,
            'total': total,
            'page': page,
            'limit': limit,
            'total_pages': (total + limit - 1) // limit
        })

    elif request.method == 'POST':
        serializer = PropertySerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(agent=request.user) 
            return Response(serializer.data)

        return Response(serializer.errors)

    elif request.method == 'DELETE':
        property_id = request.GET.get('id')
        if not property_id:
            return Response({"error": "Property ID required"}, status=400)
        
        try:
            property_obj = Property.objects.get(id=property_id, agent=request.user)
            property_obj.delete()
            return Response({"message": "Property deleted successfully"})
        except Property.DoesNotExist:
            return Response({"error": "Property not found or not owned by user"}, status=404)

@api_view(['GET'])
def get_blogs(request):
    blogs = Blog.objects.all()
    
    
    search = request.GET.get('search', '')
    if search:
        blogs = blogs.filter(title__icontains=search) | blogs.filter(description__icontains=search)
    
   
    category = request.GET.get('category', '')
    if category:
        blogs = blogs.filter(category=category)
    
    
    sort = request.GET.get('sort', 'latest')
    if sort == 'popular':
        blogs = blogs.order_by('-id') 
    else:
        blogs = blogs.order_by('-id')
    
    # Pagination
    page = int(request.GET.get('page', 1))
    limit = int(request.GET.get('limit', 9))  # 9 blogs per page
    start = (page - 1) * limit
    end = start + limit
    total = blogs.count()
    blogs = blogs[start:end]
    
    serializer = BlogSerializer(blogs, many=True)
    return Response({
        'blogs': serializer.data,
        'total': total,
        'page': page,
        'limit': limit,
        'total_pages': (total + limit - 1) // limit
    })


@api_view(['GET'])
def blog_detail(request, id):
    try:
        blog = Blog.objects.get(id=id)
        serializer = BlogSerializer(blog)
        return Response(serializer.data)
    except Blog.DoesNotExist:
        return Response({"error": "Not found"}, status=404)


@api_view(['GET'])
def agent_profile(request, agent_id):
    try:
        profile = AgentProfile.objects.select_related('user').get(user__id=agent_id)
    except AgentProfile.DoesNotExist:
        return Response({"error": "Agent profile not found"}, status=404)
    
    agent = profile.user

    properties = Property.objects.filter(agent=agent)
    rent_props = properties.filter(status='rent')
    sale_props = properties.filter(status='sale')

    reviews = Review.objects.filter(agent=agent)
    avg_rating = reviews.aggregate(avg=Avg('rating'))['avg'] or 0

    return Response ({
        'agent': {
            'id': agent.id,
            'name': agent.username,
            'email': agent.email,

            'phone': profile.phone if profile else "",
            'bio': profile.bio if profile else "",
            'experience': profile.experience if profile else "",
            'address': profile.address if profile else "",
            'image': profile.image.url if profile and profile.image else "",
            'banner': profile.banner.url if profile and profile.banner else "",
            'rating': round(avg_rating, 1),
        },

        'rent_properties': PropertySerializer(rent_props, many=True, context={'request': request}).data,
        'sale_properties': PropertySerializer(sale_props, many=True, context={'request': request}).data,
        'reviews': ReviewSerializer(reviews, many=True).data
    })

@api_view(['GET'])
def agent_list(request):
    search = request.GET.get('search', '')
    sort = request.GET.get('sort', 'latest')

    agents = AgentProfile.objects.filter(user__role='agent')

    if search:
        agents = agents.filter(user__username__icontains=search)

    if sort == 'top':
        agents = sorted(
            agents,
            key=lambda a: Review.objects.filter(agent=a.user).aggregate(avg=Avg('rating'))['avg'] or 0, reverse = True
            )

    # Pagination
    page = int(request.GET.get('page', 1))
    limit = 8
    start = (page - 1) * limit
    end = start + limit
    total = len(agents)
    agents = agents[start:end]

    serializer = AgentSerializer(agents, many=True, context={'request': request})

    return Response({
        'total': total,
        'page': page,
        'limit': limit,
        'total_pages': (total + limit - 1) // limit,
        'agents': serializer.data
    })

@api_view(['POST'])
def add_property(request):
    
    serializer = PropertySerializer(data = request.data)

    if serializer.is_valid():
        serializer.save(agent=request.user)
        return Response({'msg': 'Property Addedd'})
    
    return Response(serializer.errors)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_profile(request):
    profile, created = AgentProfile.objects.get_or_create(
        user=request.user,
        defaults={
            'phone': '',
            'bio': '',
            'experience': '',
            'address': ''
        }
    )

    profile.phone = request.data.get('phone', profile.phone)
    profile.bio = request.data.get('bio', profile.bio)
    profile.experience = request.data.get('experience', profile.experience)
    profile.address = request.data.get('address', profile.address)

    if request.FILES.get('image'):
        profile.image = request.FILES['image']

    if request.FILES.get('banner'):
        profile.banner = request.FILES['banner']

    profile.save()

    return Response({"msg": "Profile updated"})



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user
    profile = Profile.objects.filter(user=user).first()

    return Response({
        "user": {
            "id": user.id,
            "name": user.username,
            "email": user.email,
            "image": profile.image.url if profile and profile.image else "",
            "banner": profile.banner.url if profile and profile.banner else "",
            "phone": profile.phone if profile else "",
            "city": profile.city if profile else "",
            "budget_min": profile.budget_min if profile else "",
            "budget_max": profile.budget_max if profile else "",
            "property_type": profile.property_type if profile else "",
            "purpose": profile.purpose if profile else "",
            "about": profile.about if profile else "",
        }
    })

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    profile, created = Profile.objects.get_or_create(user=request.user)

    profile.phone = request.data.get('phone', profile.phone)
    profile.city = request.data.get('city', profile.city)
    profile.budget_min = request.data.get('budget_min', profile.budget_min)
    profile.budget_max = request.data.get('budget_max', profile.budget_max)
    profile.about = request.data.get('about', profile.about)
    profile.purpose = request.data.get('purpose', profile.purpose)

    if request.FILES.get("image"):
        profile.image = request.FILES["image"]

    if request.FILES.get("banner"):
        profile.banner = request.FILES["banner"]

    profile.save()

    return Response({"msg": "Profile updated successfully"})


@api_view(['GET'])
def property_detail(request, id):
    try:
        property_obj = Property.objects.get(id=id)
    except Property.DoesNotExist:
        return Response({"error": "Property not found"}, status=404)

    reviews = Review.objects.filter(agent=property_obj.agent)

    agent_profile = AgentProfile.objects.filter(user=property_obj.agent).first()
    agent_reviews = reviews
    avg_rating = agent_reviews.aggregate(avg=Avg('rating'))['avg'] or 0

    
    agent_image = ""
    if agent_profile and agent_profile.image:
        try:
            agent_image = agent_profile.image.url
        except:
            agent_image = ""

    return Response({
        "property": PropertySerializer(property_obj, context={'request': request}).data,
        "agent": {
            "name": property_obj.agent.username,
            "email": property_obj.agent.email,
            "phone": agent_profile.phone if agent_profile else "",
            "image": agent_image,
            "rating": round(avg_rating, 1)
        },
        "images": PropertyImageSerializer(
            PropertyImage.objects.filter(property=property_obj),
            many=True,
            context={'request': request}
        ).data,
        "reviews": ReviewSerializer(reviews, many=True).data
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_property(request):
    data = request.data.copy()
    features = data.get('features')

    property = Property.objects.create(
        agent=request.user,
        title=data.get('title'),
        description=data.get('description'),
        price=data.get('price'),
        type=data.get('type'),
        status=data.get('status'),
        address=data.get('address'),
        city=data.get('city'),
        country=data.get('country'),
        bedrooms=data.get('bedrooms') or None,
        bathrooms=data.get('bathrooms') or None,
        area=data.get('area') or None,
        year_built=data.get('year_built') or None,
        parking=data.get('parking'),
        outdoor=data.get('outdoor'),
        price_per_sqft=data.get('price_per_sqft') or None,
   

    )

   
    images = request.FILES.getlist('images')
    for img in images:
        PropertyImage.objects.create(property=property, image=img)

   
    videos = request.FILES.getlist('videos')
    for vid in videos:
        PropertyVideo.objects.create(property=property, video=vid)

    if features:
        features = json.loads(features)
        for f in features:
            PropertyFeatures.objects.create(
                property=property,
                key=f['key'],
                value=f['value']
            )

    return Response({"message": "Property created"})


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_property(request, id):
    try:
        property = Property.objects.get(id=id, agent=request.user)
    except Property.DoesNotExist:
        return Response({"error": "Property not found or not authorized"}, status=404)

    data = request.data.copy()
    features = data.get('features')

    try:
        # Update string fields
        if data.get('title'):
            property.title = data.get('title')
        if data.get('description'):
            property.description = data.get('description')
        if data.get('type'):
            property.type = data.get('type')
        if data.get('status'):
            property.status = data.get('status')
        if data.get('address'):
            property.address = data.get('address')
        if data.get('city'):
            property.city = data.get('city')
        if data.get('country'):
            property.country = data.get('country')
        if data.get('parking'):
            property.parking = data.get('parking')
        if data.get('outdoor'):
            property.outdoor = data.get('outdoor')

        # Update numeric fields
        if data.get('price'):
            property.price = data.get('price')
        if data.get('price_per_sqft'):
            property.price_per_sqft = float(data.get('price_per_sqft'))
        if data.get('bedrooms'):
            property.bedrooms = int(data.get('bedrooms'))
        if data.get('bathrooms'):
            property.bathrooms = int(data.get('bathrooms'))
        if data.get('area'):
            property.area = float(data.get('area'))
        if data.get('year_built'):
            property.year_built = int(data.get('year_built'))

        property.save()
        print(f"Property {id} updated successfully")

    except (ValueError, TypeError) as e:
        print(f"Error converting fields: {str(e)}")
        return Response({"error": f"Invalid field values: {str(e)}"}, status=400)

    images = request.FILES.getlist('images')
    for img in images:
        PropertyImage.objects.create(property=property, image=img)

    
    videos = request.FILES.getlist('videos')
    for vid in videos:
        PropertyVideo.objects.create(property=property, video=vid)

    return Response({"message": "Property updated successfully"})



@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_buyer_profile(request):
    try:
        profile = Profile.objects.get(user=request.user)
    except Profile.DoesNotExist:
        return Response({"error": "Profile not found"}, status=404)

    serializer = BuyerProfileSerializer(profile, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_review(request):
    serializer = ReviewSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(reviewer=request.user)
        return Response(serializer.data)

    return Response(serializer.errors, status=400)


@api_view(['GET'])
def agent_reviews(request, agent_id):
    reviews = Review.objects.filter(agent_id=agent_id).order_by('-created_at')
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_visit_request(request, property_id):
    try:
        property_obj = Property.objects.get(id=property_id)

    except Property.DoesNotExist:
        return Response({"error": "Property not found"}, status=404)

    visit = VisitRequest.objects.create(
        user=request.user,
        agent=property_obj.agent,
        property=property_obj,
        name=request.data.get("name"),
        email=request.data.get("email"),    
        phone=request.data.get('phone'),
        message=request.data.get("message"),
        preferred_date=request.data.get('preferred_date')
        )

    return Response({"message": "Visit request created"}, status=201)


@api_view(['GET'])
def agent_visit_requests(request):
    agent_id = request.GET.get("agent_id")

    requests = VisitRequest.objects.filter(agent__id=agent_id).select_related("property", "user")

    data = []
    for r in requests:
        data.append({
            "id": r.id,
            "name": r.name,
            "email": r.email,
            "phone": r.phone,
            "message": r.message,
            "preferred_date": r.preferred_date,
            "status": r.status,
            "visit_time": r.visit_time,

            "property": {
                "id": r.property.id,
                "title": r.property.title,
                "price": r.property.price,
                "images": [
                    {"image": img.image.url} for img in r.property.images.all()
                ]
            }
        })

    return Response(data)

@api_view(['PATCH'])
def approve_request(request, pk):
    vr = VisitRequest.objects.get(id=pk, agent=request.user)
    vr.status = "approved"
    vr.save()
    return Response({"message": "Approved"})

@api_view(['PATCH'])
def reject_request(request, pk):
    vr = VisitRequest.objects.get(id=pk, agent=request.user)
    vr.status = "rejected"
    vr.save()
    return Response({"message": "Rejected"})

@api_view(['PATCH'])
def set_visit_time(request, pk):
    vr = VisitRequest.objects.get(id=pk, agent=request.user)
    vr.visit_time = request.data.get("visit_time")
    vr.save()
    return Response({"message": "Time updated"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_visit_requests(request):
    user = request.user

    requests = VisitRequest.objects.filter(user=user).select_related("property", "agent")

    data = []

    for r in requests:
        agent_profile = AgentProfile.objects.filter(user=r.agent).first()

        data.append({
            "id": r.id,

            "status": r.status,
            "visit_time": r.visit_time,

           
            "property": {
                "id": r.property.id,
                "title": r.property.title,
                "price": r.property.price,
                "address": r.property.address,
                "images": [
                    {"image": img.image.url} for img in r.property.images.all()
                ]
            },

            "agent": {
                "id": r.agent.id,
                "name": r.agent.username,
                "email": r.agent.email,
                "phone": agent_profile.phone if agent_profile else "",
            }
        })

    return Response(data)