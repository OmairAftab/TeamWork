# 🚀 TeamWork - Collaborative Workspace & Project Management Platform

TeamWork is a modern, full-stack collaborative project and task management application designed for agile teams. It provides workspaces, projects, task tracking (Kanban & Table views), role-based access control (RBAC), and team collaboration features.

---

## 🌟 Features

### 🏢 Workspace Management
- Create, customize, and switch between multiple workspaces.
- Workspace-level member management with granular roles (**Owner**, **Member**).
- Dedicated Workspace Settings and Members directory.

### 📁 Project Management
- Create and organize projects under specific workspaces.
- Project-specific analytics, task distributions, and team activity.

### 📋 Task Management & Tracking
- **Table & Kanban Views**: Filter tasks by status, priority, and assigned member.
- Real-time task creation, editing, status transitions, and pagination.
- **Role-Based Task Permissions**:
  - **Owners**: Full task lifecycle control (create, reassign, update metadata, delete).
  - **Members**: Can view all tasks and update the status of tasks specifically assigned to them.

### ✉️ Inviting Members to a Workspace
- **Invite Link Generation**: Workspace Ownerscan generate a unique invite link from the Members  page.
- **Copy & Share**: Copy the shareable join link directly to clipboard.
- **Seamless Join Flow**:
  - When an invited user opens the invite link (`/invite/workspace/:inviteCode/join`), they are presented with an invite acceptance screen showing workspace details.
  - Upon clicking **Join Workspace**, the user is automatically added to the workspace as a **Member** and redirected to the workspace dashboard.
  - If the invited user is not logged in, they are guided to log in or create an account first, after which they can join seamlessly.

### 🔐 Authentication & Security
- Secure Email & Password authentication with password hashing (bcrypt).
- **Google OAuth 2.0** Single Sign-On (SSO).
- Secure, HTTP-only cookie session management (`cookie-session`).
- Role-based route and API endpoint protection.

---

## 🛠️ Tech Stack

### **Frontend (`client/`)**
- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/)
- **State & Data Fetching**: [TanStack Query v5](https://tanstack.com/query) + [Zustand](https://zustand-demo.pmnd.rs/)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Tables & UI**: [TanStack Table](https://tanstack.com/table), [Lucide React](https://lucide.dev/)

### **Backend (`backendd/`)**
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/)
- **Authentication**: [Passport.js](http://www.passportjs.org/) (Local + Google OAuth 2.0)
- **Validation & Error Handling**: Zod validation schemas with centralized async error handling

---

## 📂 Project Structure

```text
TeamWork/
├── client/                     # Frontend Vite + React application
│   ├── src/
│   │   ├── api/                # API service functions (auth, workspace, task, project, member)
│   │   ├── components/         # Reusable UI components & dialogs
│   │   ├── context/            # Authentication & workspace context providers
│   │   ├── hooks/              # Custom React Query & utility hooks
│   │   ├── page/               # Application pages (Auth, Dashboard, Tasks, Members, Settings, Invite)
│   │   ├── routes/             # Protected and public route configurations
│   │   └── types/              # TypeScript interface & type definitions
│   └── vercel.json             # Vercel SPA routing configuration
│
├── backendd/                   # Backend Express + TypeScript API
│   ├── src/
│   │   ├── config/             # App, database, and passport configurations
│   │   ├── controllers/        # Request handlers
│   │   ├── middleware/         # Auth, permission, and error handling middlewares
│   │   ├── models/             # Mongoose schemas & data models
│   │   ├── routes/             # Express API routes
│   │   ├── seeders/            # Database seed scripts (Roles & Permissions)
│   │   └── services/           # Core business logic
│   └── vercel.json             # Vercel Serverless function configuration
│
└── README.md
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher)
- MongoDB instance (Local MongoDB or MongoDB Atlas)
- Git

---

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/TeamWork.git
cd TeamWork
```

---

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backendd
   npm install
   ```
2. Create a `.env` file in `backendd/`:
   ```env
   NODE_ENV=development
   PORT=5000
   BASE_PATH=/api
   MONGO_URI=mongodb://localhost:27017/teamwork
   SESSION_SECRET=your_super_secret_session_key
   SESSION_EXPIRES_IN=24h
   FRONTEND_ORIGIN=http://localhost:5173
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
   FRONTEND_GOOGLE_CALLBACK_URL=http://localhost:5173/google/oauth/callback
   ```
3. Seed the initial roles into the database:
   ```bash
   npm run seed
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

---

### 3. Frontend Setup
1. Open a new terminal and navigate to the client directory:
   ```bash
   cd client
   npm install
   ```
2. Create a `.env` file in `client/`:
   ```env
   API_BASE_URL=http://localhost:5000/api
   ```
3. Start the client development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

