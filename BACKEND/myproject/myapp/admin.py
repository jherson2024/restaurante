from django.contrib import admin
from .models import Product
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

from .models import Table, Reservation


# from django.contrib import admin
# from django.contrib.auth.admin import UserAdmin
# from .models import CustomUser

# class CustomUserAdmin(UserAdmin):
#     model = CustomUser
#     fieldsets = UserAdmin.fieldsets + (
#         (None, {'fields': ('groups', 'user_permissions')}),
#     )

# admin.site.register(CustomUserAdmin)

# Register your models here.

admin.site.register(CustomUser, UserAdmin)
admin.site.register(Product)
admin.site.register(Table)
admin.site.register(Reservation)
