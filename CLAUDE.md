# Covered Backend - Clean Supabase Implementation

## Overview
Fresh, clean backend implementation for the Covered home inventory app using modern Supabase-first architecture.

## Architecture
- **Framework**: Express.js with TypeScript
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Push Notifications**: Expo Push Notifications

## Database Schema
The Supabase database includes:
- `users` - User profiles (extends auth.users)
- `homes` - User properties
- `rooms` - Rooms within homes
- `items` - Inventory items in rooms
- `item_images` - Photos and AI analysis data
- `user_push_tokens` - Push notification tokens

## API Endpoints

### Authentication
- `POST /api/auth/verify` - Verify JWT token and sync user
- `GET /api/auth/profile` - Get user profile with homes/rooms/items

### Homes
- `GET /api/homes` - List user's homes
- `POST /api/homes` - Create new home
- `PUT /api/homes/:id` - Update home
- `DELETE /api/homes/:id` - Delete home

### Rooms
- `GET /api/rooms` - List rooms for a home
- `POST /api/rooms` - Create new room
- `PUT /api/rooms/:id` - Update room
- `DELETE /api/rooms/:id` - Delete room

### Items
- `GET /api/items` - List items in a room
- `POST /api/items` - Create new item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

### Images
- `POST /api/images/upload` - Upload image and trigger AI analysis
- `GET /api/images/:id` - Get image details
- `DELETE /api/images/:id` - Delete image

### Notifications
- `POST /api/notifications/push-token` - Store user's push token
- `POST /api/notifications/send` - Send push notification

## Security
- JWT token validation via Supabase Auth
- Row Level Security (RLS) policies on all tables
- User data isolation
- CORS configuration
- Request validation and sanitization

## Development
```bash
npm install
npm run dev
```

## Environment Variables
```env
PORT=3000
NODE_ENV=development
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_key
```