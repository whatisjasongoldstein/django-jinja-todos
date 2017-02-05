import uuid
import marshmallow
from django.conf import settings
from django.db import models


class ItemQuerySet(models.QuerySet):

    def serialized(self):
        item_schema = ItemSchema()
        return item_schema.dump(self.filter(), many=True).data


class Item(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL)
    name = models.CharField(max_length=255)
    complete = models.BooleanField(default=False)
    objects = ItemQuerySet.as_manager()

    def __str__(self):
        return self.name or "New item"


class ItemSchema(marshmallow.Schema):
    class Meta:
        fields = ("uuid", "name", "complete", )
