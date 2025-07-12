-- Create Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Create Cities table
CREATE TABLE cities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Places table
CREATE TABLE places (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    city_id INTEGER REFERENCES cities(id),
    address TEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Hotels table
CREATE TABLE hotels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    city_id INTEGER REFERENCES cities(id),
    address TEXT,
    price_per_night DECIMAL(10,2),
    rating DECIMAL(2,1),
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Trips table
CREATE TABLE trips (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    price DECIMAL(10,2),
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    city_id INTEGER REFERENCES cities(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Trip Bookings table
CREATE TABLE trip_bookings (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER REFERENCES trips(id),
    user_id INTEGER REFERENCES users(id),
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending',
    number_of_people INTEGER DEFAULT 1
);

-- Create Comments table
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    parent_id INTEGER REFERENCES comments(id),
    -- Polymorphic relationship fields
    commentable_type VARCHAR(50),
    commentable_id INTEGER
);

-- Create Blog Posts table
CREATE TABLE blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    author_id INTEGER REFERENCES users(id),
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Hotel Bookings table
CREATE TABLE hotel_bookings (
    id SERIAL PRIMARY KEY,
    hotel_id INTEGER REFERENCES hotels(id),
    user_id INTEGER REFERENCES users(id),
    check_in_date DATE,
    check_out_date DATE,
    number_of_rooms INTEGER DEFAULT 1,
    total_price DECIMAL(10,2),
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending'
);

-- Sample SELECT queries

-- Get all active users
SELECT * FROM users WHERE is_active = TRUE;

-- Get hotels in a specific city with their ratings
SELECT h.*, c.name as city_name 
FROM hotels h 
JOIN cities c ON h.city_id = c.id 
WHERE c.name = 'Tehran' 
ORDER BY h.rating DESC;

-- Get upcoming trips
SELECT t.*, c.name as city_name 
FROM trips t 
JOIN cities c ON t.city_id = c.id 
WHERE t.start_date > CURRENT_DATE 
ORDER BY t.start_date;

-- Get user's bookings
SELECT 
    hb.*, 
    h.name as hotel_name,
    t.title as trip_title
FROM users u
LEFT JOIN hotel_bookings hb ON u.id = hb.user_id
LEFT JOIN hotels h ON hb.hotel_id = h.id
LEFT JOIN trip_bookings tb ON u.id = tb.user_id
LEFT JOIN trips t ON tb.trip_id = t.id
WHERE u.id = 1;

-- Get comments for a specific entity
SELECT 
    c.*,
    u.username
FROM comments c
JOIN users u ON c.user_id = u.id
WHERE c.commentable_type = 'hotel' 
AND c.commentable_id = 1
ORDER BY c.created_at DESC;

-- Get popular destinations
SELECT 
    c.name as city_name,
    COUNT(t.id) as trip_count,
    COUNT(h.id) as hotel_count
FROM cities c
LEFT JOIN trips t ON c.id = t.city_id
LEFT JOIN hotels h ON c.id = h.city_id
GROUP BY c.id, c.name
ORDER BY (trip_count + hotel_count) DESC
LIMIT 10;

-- UPDATE and DELETE Scripts

-- Users table operations
-- Update user information
UPDATE users 
SET 
    first_name = 'New First Name',
    last_name = 'New Last Name',
    phone_number = 'New Phone'
WHERE id = 1;

-- Deactivate a user
UPDATE users 
SET is_active = FALSE 
WHERE id = 1;

-- Delete a user (only if they have no related records)
DELETE FROM users 
WHERE id = 1 
AND NOT EXISTS (
    SELECT 1 FROM hotel_bookings WHERE user_id = 1
) 
AND NOT EXISTS (
    SELECT 1 FROM trip_bookings WHERE user_id = 1
) 
AND NOT EXISTS (
    SELECT 1 FROM comments WHERE user_id = 1
);

-- Cities table operations
-- Update city information
UPDATE cities 
SET 
    name = 'New City Name',
    description = 'New Description'
WHERE id = 1;

-- Delete a city (only if it has no related records)
DELETE FROM cities 
WHERE id = 1 
AND NOT EXISTS (
    SELECT 1 FROM places WHERE city_id = 1
) 
AND NOT EXISTS (
    SELECT 1 FROM hotels WHERE city_id = 1
) 
AND NOT EXISTS (
    SELECT 1 FROM trips WHERE city_id = 1
);

-- Places table operations
-- Update place information
UPDATE places 
SET 
    name = 'New Place Name',
    description = 'New Description',
    address = 'New Address'
WHERE id = 1;

-- Delete a place
DELETE FROM places 
WHERE id = 1;

-- Hotels table operations
-- Update hotel information
UPDATE hotels 
SET 
    name = 'New Hotel Name',
    price_per_night = 150.00,
    rating = 4.5
WHERE id = 1;

-- Delete a hotel (only if it has no bookings)
DELETE FROM hotels 
WHERE id = 1 
AND NOT EXISTS (
    SELECT 1 FROM hotel_bookings WHERE hotel_id = 1
);

-- Trips table operations
-- Update trip information
UPDATE trips 
SET 
    title = 'New Trip Title',
    price = 200.00,
    max_participants = 20
WHERE id = 1;

-- Delete a trip (only if it has no bookings)
DELETE FROM trips 
WHERE id = 1 
AND NOT EXISTS (
    SELECT 1 FROM trip_bookings WHERE trip_id = 1
);

-- Trip Bookings operations
-- Update booking status
UPDATE trip_bookings 
SET 
    status = 'confirmed',
    number_of_people = 2
WHERE id = 1;

-- Delete a trip booking
DELETE FROM trip_bookings 
WHERE id = 1;

-- Comments operations
-- Update a comment
UPDATE comments 
SET content = 'Updated comment content' 
WHERE id = 1;

-- Delete a comment and its replies
WITH RECURSIVE comment_tree AS (
    SELECT id FROM comments WHERE id = 1
    UNION ALL
    SELECT c.id FROM comments c
    JOIN comment_tree ct ON c.parent_id = ct.id
)
DELETE FROM comments 
WHERE id IN (SELECT id FROM comment_tree);

-- Blog Posts operations
-- Update a blog post
UPDATE blog_posts 
SET 
    title = 'New Blog Title',
    content = 'New blog content',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 1;

-- Delete a blog post
DELETE FROM blog_posts 
WHERE id = 1;

-- Hotel Bookings operations
-- Update booking status
UPDATE hotel_bookings 
SET 
    status = 'confirmed',
    number_of_rooms = 2,
    total_price = 300.00
WHERE id = 1;

-- Delete a hotel booking
DELETE FROM hotel_bookings 
WHERE id = 1;

-- Bulk Update Examples
-- Update all prices in a city
UPDATE hotels 
SET price_per_night = price_per_night * 1.1 
WHERE city_id = 1;

-- Update all upcoming trips
UPDATE trips 
SET max_participants = max_participants + 5 
WHERE start_date > CURRENT_DATE;

-- Bulk Delete Examples
-- Delete all inactive users
DELETE FROM users 
WHERE is_active = FALSE;

-- Delete all expired bookings
DELETE FROM hotel_bookings 
WHERE check_in_date < CURRENT_DATE - INTERVAL '1 year';

-- Delete all old comments
DELETE FROM comments 
WHERE created_at < CURRENT_DATE - INTERVAL '2 years';
