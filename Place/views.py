from django.shortcuts import render, get_object_or_404
from django.db.models import F, Q
from django.contrib.contenttypes.models import ContentType
from .models import Place
from comments.models import Comment

# Create your views here.

def places_list(request):
    places = Place.objects.all()
    
    # Search functionality
    query = request.GET.get('q')
    place_type = request.GET.get('type')
    cost = request.GET.get('cost')
    
    if query:
        places = places.filter(
            Q(name__icontains=query) |
            Q(description__icontains=query) |
            Q(city__icontains=query)
        )
    
    if place_type:
        places = places.filter(type=place_type)
    
    if cost:
        places = places.filter(Cost=cost)
    
    places = places.order_by('-views')
    return render(request, 'places.html', {'places': places})

def place_detail(request, place_id):
    place = get_object_or_404(Place, id=place_id)
    # Increment view count
    Place.objects.filter(id=place_id).update(views=F('views') + 1)
    
    # Get comments
    content_type = ContentType.objects.get_for_model(place)
    comments = Comment.objects.filter(
        content_type=content_type,
        object_id=place.id,
        status='approved'
    ).order_by('-created_at')
    
    return render(request, 'place_detail.html', {
        'place': place,
        'comments': comments
    })
