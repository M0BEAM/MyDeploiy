# 🚀 MyDeploy

**MyDeploy** is a **cloud platform for hosting static websites and web services**, built with a modern microservices architecture.  
It provides a simple way for users to deploy, manage, and scale their applications.

---

## 📂 Project Structure

```
MyDeploy/
│── Selenium Test/                # End-to-end testing automation
│
│── my-deploy-frontend/           # Frontend (Next.js + TailwindCSS)
│
│── my-microservices-backend/     # Backend (NestJS Microservices)
│   ├── deployment-service/       # Service for handling deployments
│   ├── user-service/             # Service for user authentication & profiles
│   ├── prisma-schema/            # Prisma schema definitions
│   └── docker-compose.yaml       # Multi-service orchestration
│
└── README.md
```

---

## ⚙️ Tech Stack

### 🔹 Frontend
- [Next.js](https://nextjs.org/) — React framework for SSR & SSG
- [TailwindCSS](https://tailwindcss.com/) — Utility-first CSS framework

### 🔹 Backend (Microservices)
- [NestJS](https://nestjs.com/) — Modular Node.js backend
- **User Service** — Authentication & user management
- **Deployment Service** — Handles deployments of static sites & services
- [Prisma ORM](https://www.prisma.io/) — Type-safe DB access
- [PostgreSQL](https://www.postgresql.org/) — Relational database

### 🔹 Infrastructure
- [Docker Compose](https://docs.docker.com/compose/) — Orchestration for local development
- [Selenium](https://www.selenium.dev/) — End-to-end testing framework

---

## 🛠️ Setup & Installation

### 1️⃣ Clone Repository
```bash
git clone https://github.com/your-username/mydeploy.git
cd mydeploy
```

### 2️⃣ Setup Frontend
```bash
cd my-deploy-frontend
npm install
npm run dev
```
Frontend will be available at: **http://localhost:3000**

### 3️⃣ Setup Backend (Microservices)
```bash
cd ../my-microservices-backend
docker-compose up --build
```

This will start:
- **User Service** → `http://localhost:4000`
- **Deployment Service** → `http://localhost:5000`
- **PostgreSQL Database** → `localhost:5432`

### 4️⃣ Apply Prisma Migrations
```bash
cd prisma-schema
npx prisma migrate dev --name init
```

---

## 🧪 Running Tests
Run automated E2E tests with Selenium:
```bash
cd "Selenium Test"
npm install
npm test
```

---

## 📌 Features
- ✅ Deploy static sites (Next.js, React, etc.)
- ✅ Deploy microservices with NestJS
- ✅ Authentication & user management
- ✅ PostgreSQL + Prisma ORM
- ✅ End-to-end testing with Selenium
- ✅ Containerized with Docker Compose

---

## 📜 License
This project is licensed under the **MIT License**.
