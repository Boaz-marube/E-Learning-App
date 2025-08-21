# 📚 E-Learning Backend (TypeScript + Node.js + Express + MongoDB)

This is the backend API for the **E-Learning MERN Fullstack Application**.  
It is built with **Node.js**, **Express**, **TypeScript**, and **MongoDB**.

---

## 🚀 Features

- ⚡ TypeScript-powered Express server  
- 🗄️ MongoDB (Atlas) integration with Mongoose  
- 🔐 Environment variables for secure configuration  
- ⚙️ Configurable server port  
- 🛡️ JWT authentication ready (commented for now)  

---

## 🛠️ Tech Stack

- **Backend Framework**: Express.js  
- **Language**: TypeScript  
- **Database**: MongoDB (Atlas)  
- **ORM**: Mongoose  
- **Environment Management**: dotenv  

---

## 📦 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/Boaz-marube/E-Learning-App.git
cd server
```
1.  **Install dependencies**
    ```bash
    npm install
    ```

2.  **Environment Configuration**
    Create a `.env` file in the root directory and configure the following variables:
    ```env
    MONGO_USERNAME=yourMongoUsername
    MONGO_PASSWORD=yourMongoPassword
    SERVER_PORT=8090
    JWT_SECRET=yourSuperSecretKeyMakeThisLongAndComplex
    ```

3.  **Start the Server**
    ```bash
    npm run dev
    ```

The server will start on:
👉 http://localhost:8090


### 📂 Project Structure
```bash
server/
│── src/
│   ├── config/
│   │   └── config.ts        # MongoDB + Server config
│   ├── routes/              # Express routes
│   ├── controllers/         # Route controllers
│   ├── models/              # Mongoose schemas
│   ├── middleware/          # Middleware (e.g., auth)
│   └── server.ts             # Entry point
│
├── .env                     # Environment variables
├── .gitignore               # Git ignored files
├── package.json             # Project dependencies
├── tsconfig.json            # TypeScript config
└── README.md                # Project documentation
```
