from .models import Hotel , HotelImage
from django.shortcuts import render , get_list_or_404, get_object_or_404
from django.contrib.contenttypes.models import ContentType
from comments.models import Comment
from django.db.models import Q

# Create your views here.

def hotel_post(request, hotel_id):
    hotel = get_object_or_404(Hotel, id=hotel_id)

    content_type = ContentType.objects.get_for_model(Hotel)
    comments = Comment.objects.filter(
        content_type=content_type,
        object_id=hotel_id,
        status='approved'
    ).order_by('-created_at')

    images = HotelImage.objects.filter(hotel=hotel)

    context ={
        'hotel': hotel,
        'comments': comments,
        'images': images

    }

    return render(request, 'HotelPost.html', context)

def hotel_list(request):
    hotels = Hotel.objects.all()
    
    # Search functionality
    search_query = request.GET.get('search', '')
    if search_query:
        hotels = hotels.filter(
            Q(name__icontains=search_query) |
            Q(city__icontains=search_query) |
            Q(address__icontains=search_query)
        )
    
    # Filter functionality
    city = request.GET.get('city')
    if city:
        hotels = hotels.filter(city=city)
    
    price_range = request.GET.get('price')
    if price_range:
        if price_range == 'budget':
            hotels = hotels.filter(price_per_night__lte=1000000)
        elif price_range == 'mid-range':
            hotels = hotels.filter(price_per_night__gt=1000000, price_per_night__lte=3000000)
        elif price_range == 'luxury':
            hotels = hotels.filter(price_per_night__gt=3000000)
    
    rating = request.GET.get('rating')
    if rating:
        hotels = hotels.filter(stars=rating)
    
    amenities = request.GET.getlist('amenities')
    if amenities:
        if 'pool' in amenities:
            hotels = hotels.filter(has_pool=True)
        if 'spa' in amenities:
            hotels = hotels.filter(has_spa=True)
        if 'gym' in amenities:
            hotels = hotels.filter(has_gym=True)
        if 'restaurant' in amenities:
            hotels = hotels.filter(has_restaurant=True)
    
    context = {
        'hotels': hotels,
        'search_query': search_query,
        'selected_city': city,
        'selected_price': price_range,
        'selected_rating': rating,
        'selected_amenities': amenities,
    }
    
    return render(request, 'Hotels.html', context)

def hotel_detail(request, hotel_id):
    hotel = get_object_or_404(Hotel, id=hotel_id)
    context = {
        'hotel': hotel,
    }
    return render(request, 'HotelPost.html', context)
