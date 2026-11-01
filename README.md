# Devashtra (देवाष्ट्र)
> **Tagline:** *Bridging the gap between passive learning and real-world tech execution.*

Devashtra is a browser-based, AI-powered tech education platform designed to end "tutorial hell" by pairing hands-on in-browser execution with Socratic AI coaching.

---

## Architecture Overview

```
├── /server                 # Backend Express & MongoDB architecture
│   ├── /middleware         # JWT authentication & role-based route guard
│   │   └── auth.ts         # verifyToken & requireRole(['admin', 'student', ...])
│   ├── /models             # Mongoose schemas & fallback stores
│   │   ├── User.ts         # User schema, bcrypt hashing & demo account seeds
│   │   └── Waitlist.ts     # Waitlist schema & registration repository
│   ├── /routes             # Express API routers
│   │   ├── auth.ts         # /api/auth (signup, login, me, demo-users)
│   │   ├── dashboard.ts    # /api/dashboard (student, parent, mentor, admin)
│   │   └── waitlist.ts     # /api/waitlist (post, stats, get)
│   └── db.ts               # MongoDB Mongoose connection manager with resilient fallback
├── /src                    # Frontend React 19 + Tailwind CSS v4
│   ├── /context            # Global state
│   │   └── AuthContext.tsx # JWT session management & 1-click role switcher
│   ├── /components         # Modular components
│   │   ├── /auth           # Authentication modal & forms
│   │   │   └── AuthModal.tsx
│   │   ├── /dashboards     # Role-based workspace views
│   │   │   ├── DashboardLayout.tsx # Shared header, breadcrumbs & role switcher
│   │   │   ├── StudentDashboard.tsx # Enrolled batches, XP, streak, badges
│   │   │   ├── ParentDashboard.tsx  # Screen time budget, module progress, AI logs
│   │   │   ├── MentorDashboard.tsx  # Batches, review queue, office hours
│   │   │   └── AdminDashboard.tsx   # User directory, waitlist admissions
│   │   ├── Navbar.tsx      # Strict 3-zone Top Bar Contract with Auth state
│   │   ├── Hero.tsx        # Value proposition + interactive sandbox simulator
│   │   ├── ProblemSolution.tsx # Tutorial Hell vs. Devashtra execution
│   │   ├── Features.tsx    # Cloud Lab, Gemini Copilot, Batches bento grid
│   │   ├── DevashtraJuniorSection.tsx # Gamified missions & Caesar cipher puzzle
│   │   ├── ParentSection.tsx # Screen time controls & read-only copilot audit logs
│   │   ├── WaitlistSection.tsx # Validated waitlist form & live DB statistics
│   │   ├── WaitlistAdminModal.tsx # Live database inspector modal
│   │   └── Footer.tsx      # Clean brand navigation and system links
│   ├── /types              # Shared TypeScript definitions
│   ├── App.tsx             # Main client entry
│   ├── index.css           # Tailwind v4 configuration + Google Fonts
│   └── main.tsx            # React root
├── server.ts               # Fullstack Express server with Vite middleware integration
├── .env.example            # Environment variables template
├── package.json            # Scripts & dependencies
└── tsconfig.json           # TypeScript configuration
```

---

## Phase Status

- **[x] Phase 1:** Project setup + Landing page + Waitlist API
- **[x] Phase 2:** Auth + Roles (Student, Parent, Mentor, Admin) + Role-Based Dashboards
- **[ ] Phase 3:** Cloud Lab + Code execution (Monaco editor + Judge0 integration)
- **[ ] Phase 4:** Socratic AI Copilot (Gemini API with code context and hints)
- **[ ] Phase 5:** Batches / Lessons + Admin panel
- **[ ] Phase 6:** Devashtra Junior + Parental Dashboard (deep gaming integration)
- **[ ] Phase 7:** Deployment config (Vercel, Render/Railway, MongoDB Atlas)

---

## Pre-Seeded Demo Accounts (Password: `password123`)

For rapid testing and grading, four accounts are pre-configured:

| Role | Email | Password | Features Verified |
| :--- | :--- | :--- | :--- |
| **Student** | `student@devashtra.com` | `password123` | Enrolled batches (Python 3.12, Fullstack), 1450 XP, Level 4, 6-day streak, verified badges, launch task in Cloud Lab. |
| **Parent** | `parent@devashtra.com` | `password123` | Linked to child "Aarav Chen" (Age 10), interactive daily screen time slider (saves to DB), module progress, and read-only AI Copilot audit history. |
| **Mentor** | `mentor@devashtra.com` | `password123` | 2 assigned batches (62 students), pending student submission review modal with code diff and grading. |
| **Admin** | `admin@devashtra.com` | `password123` | User directory table with role filters and search, live waitlist queue manager with "Admit to Batch" actions, DB metrics. |

*You can also create any new account via the Signup tab with custom names and roles.*

---

## Getting Started & Local Setup

### 1. Prerequisites
- Node.js 18+ (Node 20+ or 22 recommended)
- Optional: A MongoDB Atlas connection string (`mongodb+srv://...`) or local MongoDB. If omitted, Devashtra runs with the built-in resilient development store.

### 2. Environment Variables
```bash
cp .env.example .env
```
Key variables:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI="mongodb://localhost:27017/devashtra"
GEMINI_API_KEY="your_gemini_api_key"
JWT_SECRET="devashtra_jwt_secure_secret_key_2026"
```

### 3. Run Development Server
```bash
npm run dev
```

---

## Testing Phase 2

### A. Testing in the Browser UI
1. Open the preview URL.
2. In the top navbar, click **"Sign In"**.
3. In the modal, use the **1-Click Test Demo Accounts** bar:
   - Click **"Student"** $\to$ inspect Aarav's enrolled batches, 1450 XP, streak, and badges.
   - Click the **"Parent"** button in the dashboard top bar $\to$ inspect screen time slider (drag to 60m and click "Save Screen Time Rule") and read-only AI Copilot chat history.
   - Click the **"Mentor"** button in the dashboard top bar $\to$ click **"Review Code"** on Aarav's heap allocator submission, type feedback, and click "Submit Review".
   - Click the **"Admin"** button in the dashboard top bar $\to$ view user list, search by name, filter by role, and admit waitlist applicants to Batch 1.
4. Click **"Landing"** in the top left breadcrumb to navigate back to the landing page anytime; click **"Dashboard"** in the top right to return.

### B. Testing the Auth & Dashboard APIs via cURL
```bash
# 1. Login as Student
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@devashtra.com","password":"password123"}'

# 2. Signup as a new Mentor
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Ananya Rao",
    "email": "ananya@devashtra.com",
    "password": "securepassword",
    "role": "mentor"
  }'

# 3. Access protected Student Dashboard with Token
curl -X GET http://localhost:3000/api/dashboard/student \
  -H "Authorization: Bearer <TOKEN_FROM_STEP_1>"

# 4. Update Parental Screen Time
curl -X PATCH http://localhost:3000/api/dashboard/parent/screentime \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN_FROM_PARENT_LOGIN>" \
  -d '{"minutes": 60}'
```
