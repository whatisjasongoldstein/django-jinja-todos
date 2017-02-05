import json
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .models import Item

# Create your views here.

@login_required
def todos(request):
    items = Item.objects.filter(user=request.user).serialized()
   
    return render(request, "index.njk", {
        "items": items,
        "data": json.dumps({
            "todos": items
        }, indent=2),
    })