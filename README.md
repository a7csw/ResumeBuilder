# 🚀 Resume Builder - Full Stack Application

A modern, AI-powered resume builder with secure payment processing, built with React, Node.js, and Paddle payments.

## 📁 Project Structure

```
ResumeBuilder/
├── frontend/                 # React + Vite frontend application
│   ├── src/                 # React source code
│   ├── public/              # Static assets
│   ├── package.json         # Frontend dependencies
│   ├── vite.config.ts       # Vite configuration
│   └── vercel.json          # Vercel deployment config
├── backend/                  # Node.js + Express backend
│   ├── src/                 # Backend source code
│   ├── package.json         # Backend dependencies
│   └── env.example          # Environment variables template
├── package.json              # Root monorepo configuration
└── README.md                 # This file
```

## 🎯 Features

### Frontend (React + Vite)
- ✅ **Modern UI/UX** with Tailwind CSS and shadcn/ui
- ✅ **AI-Powered Resume Generation** with intelligent suggestions
- ✅ **Professional Templates** for various industries
- ✅ **Real-time Preview** with live editing
- ✅ **Responsive Design** for all devices
- ✅ **Dark/Light Theme** support
- ✅ **Performance Optimized** with code splitting and lazy loading

### Backend (Node.js + Express)
- ✅ **RESTful API** with comprehensive endpoints
- ✅ **Paddle Payment Integration** for secure transactions
- ✅ **User Authentication** with JWT tokens
- ✅ **MongoDB Database** with Mongoose ODM
- ✅ **Webhook Processing** for payment events
- ✅ **Rate Limiting** and security middleware
- ✅ **Vercel Serverless** compatible

### Payment Features
- ✅ **One-time Payments** (Basic Plan - $5)
- ✅ **Recurring Subscriptions** (Pro Plan - $11/month)
- ✅ **Secure Webhooks** with signature verification
- ✅ **Automatic Plan Upgrades** after successful payment

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 8+
- MongoDB (local or cloud)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/a7csw/ResumeBuilder.git
   cd ResumeBuilder
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   # Backend
   cp backend/env.example backend/.env
   # Edit backend/.env with your configuration
   
   # Frontend
   cp frontend/.env.local.template frontend/.env.local
   # Edit frontend/.env.local with your configuration
   ```

4. **Start development servers**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start individually
   npm run dev:frontend    # Frontend on http://localhost:8080
   npm run dev:backend     # Backend on http://localhost:5000
   ```

## 🛠️ Development

### Available Scripts

```bash
# Root level (monorepo)
npm run dev              # Start both frontend and backend
npm run build            # Build both applications
npm run install:all      # Install dependencies for all workspaces
npm run clean            # Clean all build artifacts

# Frontend specific
npm run dev:frontend     # Start frontend dev server
npm run build:frontend   # Build frontend for production
npm run lint:frontend    # Lint frontend code

# Backend specific
npm run dev:backend      # Start backend dev server
npm run build:backend    # Build backend for production
npm run lint:backend     # Lint backend code
```

### Frontend Development
```bash
cd frontend
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run preview          # Preview production build
```

### Backend Development
```bash
cd backend
npm run dev              # Start with nodemon
npm start                # Start production server
npm run test             # Run tests
```

## 🌐 Deployment

### Frontend (Vercel)
The frontend is configured for Vercel deployment:
- Automatic builds from Git
- Environment variables configured
- Optimized for performance

### Backend (Vercel Functions)
The backend is optimized for Vercel serverless deployment:
- API routes as serverless functions
- Environment variables support
- Webhook compatibility

### Environment Variables

#### Frontend (.env.local)
```bash
VITE_API_URL=http://localhost:5000/api/v1
VITE_APP_NAME=NovaCV Resume Builder
```

#### Backend (.env)
```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PADDLE_API_KEY=your_paddle_api_key
PADDLE_ENVIRONMENT=production
PADDLE_WEBHOOK_SECRET=your_webhook_secret
```

## 🔐 Security Features

- ✅ **JWT Authentication** with refresh tokens
- ✅ **Rate Limiting** to prevent abuse
- ✅ **CORS Protection** with configurable origins
- ✅ **Input Validation** and sanitization
- ✅ **Secure Headers** with Helmet.js
- ✅ **Webhook Signature Verification** for Paddle

## 📊 API Documentation

### Authentication
- `POST /api/v1/users/register` - User registration
- `POST /api/v1/users/login` - User login
- `POST /api/v1/users/refresh` - Refresh JWT token

### Payments
- `POST /api/v1/payments/checkout` - Create payment checkout
- `GET /api/v1/payments/plans` - Get subscription plans
- `GET /api/v1/payments/subscription` - Get user subscription

### Webhooks
- `POST /api/v1/payments/webhook/paddle` - Paddle webhook endpoint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the docs folder for detailed guides
- **Issues**: Report bugs and request features via GitHub Issues
- **Discussions**: Join the community discussions

---

**🚀 Built with ❤️ by the NovaCV Team**