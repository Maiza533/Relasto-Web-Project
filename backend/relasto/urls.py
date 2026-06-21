from django.contrib import admin
from django.urls import path
from .views import add_review, agent_reviews, blog_detail, create_visit_request, get_blogs, get_properties, login_view, set_visit_time, signup_view, agent_profile, edit_profile, agent_list, profile, update_profile,  create_property, update_property, property_detail, agent_visit_requests, approve_request, reject_request, set_visit_time, user_visit_requests

urlpatterns = [
    path('signup/', signup_view, name='signup'),
    path('login/', login_view, name='login'),
    path('agent/<int:agent_id>/', agent_profile),
    path('agents/', agent_list, name='agent_list'),
    path('properties/', get_properties, name='get_properties'),
    path('edit-profile/', edit_profile),
    path('create-property/', create_property),
    path('update-property/<int:id>/', update_property),
   
    path('profile/', profile),
    path('profile/<int:id>/', profile),
    path('profile/update/', update_profile),
    path('blogs/', get_blogs, name='get_blogs'),
    path('property/<int:id>/', property_detail),
    path("add-review/", add_review),
    path("agent/<int:agent_id>/reviews/", agent_reviews),
    path("blog/<int:id>/", blog_detail),
    path('visit-request/<int:property_id>/', create_visit_request),
    path('visit-requests/', agent_visit_requests),
    path('visit-request/<int:pk>/approve/', approve_request),
    path('visit-request/<int:pk>/reject/', reject_request),
    path('visit-request/<int:pk>/set-time/', set_visit_time),
    path('user-visit-requests/', user_visit_requests),
  

]
