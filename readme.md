# 📚 DirectEd E-Learning Platform (MERN + TypeScript)

A comprehensive **E-Learning MERN Fullstack Application** built with **React**, **Node.js**, **Express**, **TypeScript**, and **MongoDB**. Features complete authentication system, role-based access control, and modern UI with Tailwind CSS.

---

## 🚀 Features

### Backend (Complete)
- ⚡ TypeScript-powered Express server
- 🗄️ MongoDB (Atlas) integration with Mongoose
- 🔐 Complete JWT authentication system
- 👥 Role-based access control (Student, Instructor, Admin)
- 🛡️ Secure password hashing with bcrypt
- ⚙️ Environment validation with Zod
- 🚨 Centralized error handling
- 📝 Shared TypeScript interfaces

### Frontend (Setup Complete)
- ⚛️ React 19 with TypeScript
- ⚡ Vite for fast development
- 🎨 Tailwind CSS for styling
- 📱 Responsive design ready
- 🔧 ESLint configuration

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (Atlas)
- **ODM**: Mongoose
- **Authentication**: JWT + bcrypt
- **Validation**: Zod
- **Environment**: dotenv

### Frontend
- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Linting**: ESLint

---

## 📦 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/Boaz-marube/E-Learning-App.git
cd E-Learning-App
```

### 2. Backend Setup
```bash
cd server
npm install
```

**Environment Configuration**  
Create a `.env` file in the server directory:
```env
MONGO_USERNAME=yourMongoUsername
MONGO_PASSWORD=yourMongoPassword
SERVER_PORT=8090
SERVER_ROUNDS=10
JWT_SECRET=your-super-secure-jwt-secret-key-at-least-32-characters-long
JWT_EXPIRES_IN=7d
```

**Start Backend Server**
```bash
npm run dev
```
👉 Backend runs on: http://localhost:8090

### 3. Frontend Setup
```bash
cd ../client
npm install
```

**Start Frontend Server**
```bash
npm run dev
```
👉 Frontend runs on: http://localhost:5173

---

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User authentication
- `POST /api/auth/reset-password` - Password reset
- `GET /api/auth/profile` - Get user profile (Protected)

### Health Check
- `GET /health` - Server health status

---

## 📂 Project Structure
```bash
E-Learning-App/
├── client/                  # React Frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Utility functions
│   │   ├── App.tsx         # Main App component
│   │   └── main.tsx        # Entry point
│   ├── public/             # Static assets
│   ├── tailwind.config.js  # Tailwind configuration
│   ├── vite.config.ts      # Vite configuration
│   └── package.json        # Frontend dependencies
│
├── server/                  # Node.js Backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   │   └── config.ts   # Environment & DB config
│   │   ├── controllers/    # Route controllers
│   │   │   └── authController.ts
│   │   ├── middleware/     # Custom middleware
│   │   │   ├── authMiddleware.ts
│   │   │   ├── roleMiddleware.ts
│   │   │   └── errorMiddleware.ts
│   │   ├── models/         # Mongoose schemas
│   │   │   ├── userModel.ts
│   │   │   ├── courseModel.ts
│   │   │   └── enrollmentModel.ts
│   │   ├── routes/         # API routes
│   │   │   ├── authRoutes.ts
│   │   │   └── index.ts
│   │   ├── utils/          # Utility functions
│   │   │   ├── jwt.ts      # JWT utilities
│   │   │   └── errorHandler.ts
│   │   └── server.ts       # Entry point
│   ├── .env               # Environment variables
│   └── package.json       # Backend dependencies
│
├── types/                  # Shared TypeScript types
│   └── shared.ts          # Common interfaces
│
└── README.md              # Project documentation
```

---

## 🧪 Testing

### Backend API Testing (Postman/curl)
```bash
# Health Check
curl http://localhost:8090/health

# User Signup
curl -X POST http://localhost:8090/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123","role":"student"}'

# User Login
curl -X POST http://localhost:8090/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```


## 📄 License

This project is licensed under the MIT License.


## 👥 Contributors

| Name | Role | GitHub |
|------|------|--------|
| [Boaz Marube] | Full Stack Developer | [@Boaz-marube](https://github.com/Boaz-marube) |
| [Bereket Eshete] | Full Stack Developer | [@Bereket-Eshete](https://github.com/Bereket-Eshete) |
| [Sena Kebede] | Gen AI Developer | [@SenaKebe](https://github.com/SenaKebe) |
| [Mahder Hawaz] | Full Stack Developer | [@mahderhawaz](https://github.com/mahderhawaz) |
| [June Kwamboka] | UI/UX Designer ||
| [Solomon Nderitu] | Gen AI Developer | [@Solomon-Nderit](https://github.com/Solomon-Nderit) |
| [Nuhamin W] | UI/UX Designer | |
| [Finlay Ndung'u] | UI/UX Designer | |
