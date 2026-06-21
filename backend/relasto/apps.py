from django.apps import AppConfig


class RelastoConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'relasto'

def ready(self):
    import relasto.signals