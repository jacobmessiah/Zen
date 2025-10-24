ZenV2: Real-time Chat Application with Modern Features

A full-stack chat application built with React and Node.js that offers:

Key Features:

- Real-time messaging with Socket.IO
- Video/Audio calling capabilities
- Story/Status sharing system similar to social media
- Friend request and management system
- Google OAuth integration
- Secure authentication with JWT and email verification
- Profile customization with bio and media uploads
- Message status tracking (sent/delivered/read)

Technical Stack:
Frontend:

- React with Vite
- Chakra UI for styling
- Zustand for state management
- Framer Motion for animations
- Socket.IO client for real-time features

Backend:

- Express.js server
- MongoDB with Mongoose
- Socket.IO for WebSocket connections
- JWT for authentication
- ImageKit for media storage
- Nodemailer for email services

The application follows modern architecture patterns with separate frontend/backend services and environment-based configurations. Includes comprehensive user management, real-time notifications, and media handling capabilities.

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Git

### Environment Variables

Create `.env` files in both frontend and backend directories:

#### Frontend (.env)

```
VITE_BACKEND_URL=http://localhost:5000
VITE_MODE=dev
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

#### Backend (.env)

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_email
SMTP_PASS=your_smtp_password
```

### Installation Steps

1. Clone the repository:

```bash
git clone https://github.com/yourusername/ZenV2.git
cd ZenV2
```

2. Install Backend Dependencies:

```bash
cd Backend
npm install
```

3. Install Frontend Dependencies:

```bash
cd ../Frontend
npm install
```

4. Start the Backend Server:

```bash
cd ../Backend
npm run dev
```

5. Start the Frontend Development Server:

```bash
cd ../Frontend
npm run dev
```

The application should now be running on:

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### Testing

Run backend tests:

```bash
cd Backend
npm test
```

Run frontend tests:

```bash
cd Frontend
npm test
```

### Production Build

```bash
cd Frontend
npm run build
```
