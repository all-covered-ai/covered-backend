# Covered Backend API

Clean, modern backend API for the Covered home inventory application.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Add your Supabase credentials
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

The server will start on http://localhost:3000

## Features

- ✅ **Supabase Integration** - Modern PostgreSQL database with RLS
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **TypeScript** - Full type safety
- ✅ **Push Notifications** - Expo push notification support  
- ✅ **File Upload** - Image handling with AI analysis
- ✅ **RESTful API** - Clean, consistent endpoints

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Validation**: Zod
- **File Upload**: Multer + Supabase Storage

## API Documentation

### Authentication
All protected endpoints require `Authorization: Bearer <jwt_token>` header.

### Endpoints
- `GET /health` - Health check
- `POST /api/auth/verify` - Verify token and sync user
- `GET /api/auth/profile` - Get user profile
- `GET|POST|PUT|DELETE /api/homes` - Home management
- `GET|POST|PUT|DELETE /api/rooms` - Room management  
- `GET|POST|PUT|DELETE /api/items` - Item management
- `POST /api/images/upload` - Image upload
- `POST /api/notifications/push-token` - Store push token

## Development

```bash
# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

## Deployment

The backend is ready to deploy to any Node.js hosting platform:
- Railway
- Render  
- Vercel
- DigitalOcean App Platform
- AWS Lambda (with serverless framework)

## License

MIT