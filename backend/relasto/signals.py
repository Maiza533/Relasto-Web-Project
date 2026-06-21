from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .models import AgentProfile, Profile

User = settings.AUTH_USER_MODEL

@receiver(post_save, sender=User)
def create_profiles(sender, instance, created, **kwargs):
    if created:
        if instance.role == "agent":
            AgentProfile.objects.get_or_create(user=instance)
        elif instance.role == "buyer":
            Profile.objects.get_or_create(user=instance)