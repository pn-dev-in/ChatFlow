# 💬 ChatFlow

### Modern Real-Time Messaging & Collaboration Platform

> **Connect instantly, collaborate seamlessly, and communicate intelligently through a scalable real-time messaging platform inspired by WhatsApp, Telegram, Discord, and Slack.**

---

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-19-blue)
![Node.js](https://img.shields.io/badge/Node.js-20-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-black)

## 🌐 Live Demo

**Application**

https://chat-flow-eta-three.vercel.app/login

---

# 📌 Overview

ChatFlow is a production-ready real-time messaging platform designed for modern communication and collaboration.

Built using Next.js, Express, PostgreSQL, and Socket.IO, the application delivers instant messaging, group conversations, media sharing, AI-assisted interactions, and real-time notifications through a scalable full-stack architecture.

Inspired by leading communication platforms such as WhatsApp, Telegram, Discord, and Slack, ChatFlow demonstrates enterprise-grade backend design, secure authentication, and low-latency communication.

---

# ✨ Key Features

## 💬 Real-Time Messaging

* Instant messaging using Socket.IO
* One-to-one conversations
* Group chats
* Message editing
* Message deletion
* Emoji reactions
* Typing indicators
* Online presence detection
* Read & delivered receipts

---

## 👥 Social & Collaboration

* Friend requests
* Group creation
* Group management
* Conversation history
* Member roles
* Real-time collaboration

---

## 📂 Media Sharing

* Image upload
* Video upload
* Document sharing
* Cloudinary integration
* Secure media storage

---

## 🔔 Notifications

* Real-time notifications
* Unread message counts
* Activity alerts
* Friend request notifications

---

## 🔐 Authentication & Security

* JWT Authentication
* Refresh Tokens
* bcrypt password hashing
* Protected routes
* Role-based authorization
* Secure session management

---

## 📊 Admin Dashboard

* User management
* Group management
* Platform analytics
* Audit logs
* Administrative controls

---

## 🎨 User Experience

* Responsive design
* Dark Mode
* Glassmorphism UI
* Modern dashboard
* Mobile-friendly interface

---

# 🏗️ System Architecture

```text
Client
   │
   ▼
Next.js Frontend
   │
   ▼
REST API + Socket.IO
   │
   ▼
Express Backend
   │
 ┌────────────┬──────────────┬─────────────┐
 │            │              │
 ▼            ▼              ▼
JWT       PostgreSQL     Cloudinary
Auth       Database       Media
 │            │              │
 └────────────┴──────────────┘
              │
              ▼
Real-Time Event Engine
              │
              ▼
Live Communication
```

---

# 🚀 Core Modules

### Authentication

Secure registration, login, refresh tokens, and session management.

### Messaging Engine

Low-latency real-time communication powered by Socket.IO.

### Group Collaboration

Create and manage team conversations with multiple participants.

### AI Assistant

Context-aware AI features for smarter communication.

### Media Management

Upload and share multimedia files securely.

### Notification System

Deliver instant platform updates and unread indicators.

### Administration

Comprehensive dashboard for platform management and analytics.

---

# 📊 Project Highlights

* Enterprise-style full-stack architecture
* Real-time WebSocket communication
* JWT authentication system
* AI-assisted messaging
* Media upload support
* Cloud storage integration
* Production-ready backend
* Dockerized deployment
* REST API architecture
* Admin analytics dashboard

---

# 🛠️ Technology Stack

| Layer            | Technology                       |
| ---------------- | -------------------------------- |
| Frontend         | Next.js 15, React 19, TypeScript |
| UI               | Tailwind CSS, ShadCN UI          |
| State Management | Zustand, React Query             |
| Backend          | Node.js, Express                 |
| Realtime         | Socket.IO                        |
| Database         | PostgreSQL                       |
| ORM              | Prisma                           |
| Authentication   | JWT, bcrypt                      |
| Storage          | Cloudinary                       |
| Deployment       | Vercel, Railway                  |
| DevOps           | Docker, GitHub Actions           |

---

# 📸 Application Screenshots

## 🏠 Login Page
<img width="1919" height="959" alt="image" src="https://github.com/user-attachments/assets/784886e6-3f17-437c-909c-444d26f8c351" />

<img width="1919" height="1014" alt="image" src="https://github.com/user-attachments/assets/e779be38-93d4-4c56-8fba-48f35dec6032" />

---

## 💬 Chat Dashboard
<img width="1919" height="1016" alt="image" src="https://github.com/user-attachments/assets/5a2cf805-59e2-44a5-a653-e62145078f75" />

---

## 👥 Group Conversations

<img width="1919" height="1022" alt="image" src="https://github.com/user-attachments/assets/2ac12132-809d-4a64-92ee-a43f695d398b" />

---

## 📊 Admin Dashboard

<img width="1919" height="1015" alt="Screenshot 2026-06-09 174232" src="https://github.com/user-attachments/assets/3c9d93f9-bf59-4abd-907b-fc7baf40e9db" />
<img width="1919" height="1017" alt="Screenshot 2026-06-09 174211" src="https://github.com/user-attachments/assets/f8e8cb99-0ea6-4753-b780-a29a18b41a8b" />

---

## 🌙 Dark Mode

<img width="1919" height="1018" alt="Screenshot 2026-06-09 174307" src="https://github.com/user-attachments/assets/91e1f103-c12e-49fa-b8b4-57edfc99d47b" />


---

# 📂 Project Structure

```text
ChatFlow/

├── frontend/
│
├── backend/
│
├── docker-compose.yml
│
├── .github/
│
└── README.md
```

---

# 🚀 Local Installation

Clone repository:

```bash
git clone https://github.com/pn-dev-in/ChatFlow.git

cd ChatFlow
```

Backend:

```bash
cd backend

npm install

npm run dev
```

Frontend:

```bash
cd frontend

npm install

npm run dev
```

---

# 🔌 REST API

Supports:

* Authentication
* Conversations
* Messaging
* Groups
* Media Upload
* AI Assistant
* Notifications
* Analytics

Interactive API documentation available through Swagger.

---

# 🎓 Skills Demonstrated

This project demonstrates practical experience in:

✅ Full-Stack Development

✅ Real-Time Systems

✅ WebSockets

✅ REST API Design

✅ Authentication & Authorization

✅ Database Design

✅ Cloud Storage Integration

✅ AI Feature Integration

✅ Docker

✅ Software Architecture

---

# 📈 Future Roadmap

* Voice messaging
* Video calling
* End-to-end encryption
* Message scheduling
* AI meeting assistant
* Smart search
* Mobile application
* Offline synchronization
* Multi-device support

---

# 💼 Business Value

ChatFlow provides a scalable communication platform suitable for startups, educational institutions, teams, and enterprise collaboration.

Its modular architecture allows easy extension with AI features, advanced analytics, and additional collaboration tools, making it a strong foundation for modern messaging applications.

---

# 👨‍💻 Author

### Pravesh Nandanwar

GitHub

https://github.com/pn-dev-in

LinkedIn 

www.linkedin.com/in/pravesh-nandanwar

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

Contributions, suggestions, and feedback are always welcome.

---

### 💬 Connect Instantly. Collaborate Smarter. Communicate Without Limits.
