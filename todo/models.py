from rest_framework import serializers
from django.conf import settings
from django.db import models


class ItemQuerySet(models.QuerySet):

    def serialized(self):
        return ItemSerializer(self.filter(), many=True).data


class Item(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL)
    name = models.CharField(max_length=255)
    complete = models.BooleanField(default=False)
    objects = ItemQuerySet.as_manager()

    def __str__(self):
        return self.name or "New item"


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ('id', 'name', 'complete', )
