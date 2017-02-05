import json
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import Item, ItemSchema

# Create your views here.

@login_required
def todos(request):
    items = Item.objects.filter(user=request.user).serialized()
   
    return render(request, "index.njk", {
        "items": items,
        "count": len([item for item in items if not item["complete"]]),
        "data": json.dumps({
            "todos": items
        }, indent=2),
    })


@login_required
def endpoint(request):
    """
    Garbage code. TODO.
    """

    # Delete
    if request.POST.get("delete"):
        id = request.POST.get("delete") 
        Item.objects.filter(user=request.user, id=id).delete()
        return JsonResponse({"status": "Gone!"})
    
    item_schema = ItemSchema()
    data = json.loads(request.POST.get("todo"))
    todo, errors = item_schema.load(data)
    if errors:
        return JsonResponse({'errors': errors})
    try:
        item = Item.objects.get(id=data["id"])
    except Item.DoesNotExist:
        item = Item.objects.create(
            id=data["id"],
            user=request.user,
            name=data["name"],
            complete=data["complete"])
    if item.user != request.user:
        return JsonResponse({"error": "That doesn't below to you!"})
    item.complete = data["complete"]
    item.name = data["name"]
    item.save()
    return JsonResponse({"status": "Done!"})
