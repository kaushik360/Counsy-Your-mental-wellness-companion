# Project File Structure

## 📁 Complete Structure

```
counsy/
├── 📄 Configuration Files
│   ├── .env                      # Your environment variables (add Supabase credentials here!)
│   ├── .env.example              # Template for environment variables
│   ├── package.json              # Dependencies (includes @supabase/supabase-js)
│   ├── tsconfig.json             # TypeScript configuration
│   ├── vite.config.ts            # Vite configuration
│   ├── vite-env.d.ts            # ✨ NEW: TypeScript env types
│   ├── tailwind.config.js        # Tailwind CSS configuration
│   └── postcss.config.js         # PostCSS configuration
│
├── 📚 Documentation (✨ NEW)
│   ├── START_HERE.md             # ⭐ Start here!
│   ├── SETUP_CHECKLIST.md        # Step-by-step setup guide
│   ├── MIGRATION_GUIDE.md        # How to update components
│   ├── API_REFERENCE.md          # Quick API reference
│   ├── SUPABASE_SETUP.md         # Detailed Supabase setup
│   ├── README_SUPABASE.md        # Architecture overview
│   ├── WHATS_CHANGED.md          # What's different
│   ├── INTEGRATION_SUMMARY.md    # Complete summary
│   ├── FILE_STRUCTURE.md         # This file
│   ├── supabase-setup.sql        # Database schema
│   └── README.md                 # Original README
│
├── 🔧 Services (Backend Logic)
│   ├── supabase.ts              # ✨ NEW: Supabase client
│   ├── auth.ts                  # ✨ NEW: Authentication functions
│   ├── database.ts              # ✨ NEW: Database operations
│   ├── storage.ts               # OLD: localStorage (can be removed later)
│   └── ai.ts                    # AI/Groq integration
│
├── 🎨 Context (State Management)
│   ├── AuthContext.tsx          # ✨ NEW: Global auth state
│   └── ThemeContext.tsx         # Theme management
│
├── 🧩 Components (Reusable UI)
│   ├── Layout.tsx               # Main layout wrapper
│   ├── Logo.tsx                 # App logo
│   └── BottomNav.tsx            # Bottom navigation
│
├── 📱 Pages (Main Views)
│   ├── Welcome.tsx              # Landing page
│   ├── Auth.tsx                 # ✅ UPDATED: Login/signup (uses Supabase)
│   ├── Home.tsx                 # 📝 TODO: Update to use Supabase
│   ├── Journal.tsx              # 📝 TODO: Update to use Supabase
│   ├── Counselor.tsx            # 📝 TODO: Update to use Supabase
│   ├── Streaks.tsx              # 📝 TODO: Update to use Supabase
│   ├── Profile.tsx              # 📝 TODO: Update to use Supabase
│   ├── EditProfile.tsx          # 📝 TODO: Update to use Supabase
│   ├── Focus.tsx                # 📝 TODO: Update to use Supabase
│   ├── Insights.tsx             # 📝 TODO: Update to use Supabase
│   └── About.tsx                # About page
│
├── 🎯 Core Files
│   ├── App.tsx                  # ✅ UPDATED: Main app (includes AuthProvider)
│   ├── index.tsx                # App entry point
│   ├── index.html               # HTML template
│   ├── index.css                # Global styles
│   └── types.ts                 # TypeScript type definitions
│
└── 📦 Build Output
    └── dist/                    # Production build (generated)
```

## 🎯 Key Files to Know

### ⭐ Start Here
- **START_HERE.md** - Your starting point!
- **SETUP_CHECKLIST.md** - Follow this to set up Supabase

### 🔧 Core Integration Files
- **services/supabase.ts** - Supabase client initialization
- **services/auth.ts** - All authentication functions
- **services/database.ts** - All database operations
- **context/AuthContext.tsx** - Global auth state

### 📝 Files You Need to Update
- **pages/Home.tsx** - Mood tracking
- **pages/Journal.tsx** - Journal entries
- **pages/Counselor.tsx** - AI chat
- **pages/Streaks.tsx** - Streaks display
- **pages/Profile.tsx** - Profile display
- **pages/EditProfile.tsx** - Profile editing
- **pages/Focus.tsx** - Focus sessions
- **pages/Insights.tsx** - Analytics

### 📚 Documentation
- **MIGRATION_GUIDE.md** - How to update components
- **API_REFERENCE.md** - Quick API reference
- **SUPABASE_SETUP.md** - Detailed setup guide

## 🆕 What's New

### New Files (11)
```
✨ services/supabase.ts
✨ services/auth.ts
✨ services/database.ts
✨ context/AuthContext.tsx
✨ vite-env.d.ts
✨ supabase-setup.sql
✨ START_HERE.md
✨ SETUP_CHECKLIST.md
✨ MIGRATION_GUIDE.md
✨ API_REFERENCE.md
✨ (+ 4 more documentation files)
```

### Updated Files (4)
```
✅ App.tsx (added AuthProvider)
✅ pages/Auth.tsx (uses Supabase auth)
✅ .env (added Supabase variables)
✅ .env.example (added Supabase variables)
```

### Files to Update (8)
```
📝 pages/Home.tsx
📝 pages/Journal.tsx
📝 pages/Counselor.tsx
📝 pages/Streaks.tsx
📝 pages/Profile.tsx
📝 pages/EditProfile.tsx
📝 pages/Focus.tsx
📝 pages/Insights.tsx
```

## 🗂️ File Purposes

### Services Layer
| File | Purpose |
|------|---------|
| `supabase.ts` | Initialize Supabase client, define database types |
| `auth.ts` | Sign up, sign in, sign out, profile updates |
| `database.ts` | CRUD operations for moods, journals, chat, streaks |
| `storage.ts` | OLD localStorage code (can be removed later) |
| `ai.ts` | Groq AI integration (unchanged) |

### Context Layer
| File | Purpose |
|------|---------|
| `AuthContext.tsx` | Global auth state, useAuth hook |
| `ThemeContext.tsx` | Theme management (unchanged) |

### Pages Layer
| File | Status | Purpose |
|------|--------|---------|
| `Welcome.tsx` | ✅ OK | Landing page |
| `Auth.tsx` | ✅ Updated | Login/signup with Supabase |
| `Home.tsx` | 📝 TODO | Mood tracking - needs update |
| `Journal.tsx` | 📝 TODO | Journal entries - needs update |
| `Counselor.tsx` | 📝 TODO | AI chat - needs update |
| `Streaks.tsx` | 📝 TODO | Streaks display - needs update |
| `Profile.tsx` | 📝 TODO | Profile display - needs update |
| `EditProfile.tsx` | 📝 TODO | Profile editing - needs update |
| `Focus.tsx` | 📝 TODO | Focus sessions - needs update |
| `Insights.tsx` | 📝 TODO | Analytics - needs update |
| `About.tsx` | ✅ OK | About page |

## 📊 Import Patterns

### Authentication
```typescript
// In any component
import { useAuth } from '../context/AuthContext';

const { user, loading, signOut, refreshUser } = useAuth();
```

### Database Operations
```typescript
// Import what you need
import { getMoods, saveMood } from '../services/database';
import { getJournals, saveJournal } from '../services/database';
import { getChatHistory, saveChatMessage } from '../services/database';
```

### Auth Functions
```typescript
// Usually only in Auth.tsx
import { signUp, signIn, signOut } from '../services/auth';
```

## 🎯 Workflow

### 1. Setup (One Time)
```
1. Read START_HERE.md
2. Follow SETUP_CHECKLIST.md
3. Set up Supabase project
4. Add credentials to .env
5. Test authentication
```

### 2. Development (Ongoing)
```
1. Read MIGRATION_GUIDE.md
2. Update one page at a time
3. Test after each update
4. Use API_REFERENCE.md for help
5. Check Supabase dashboard
```

### 3. Testing
```
1. Create test account
2. Test each feature
3. Check data in Supabase
4. Test sign out/in
5. Verify data persists
```

## 🔍 Finding Things

### Need to...
- **Set up Supabase?** → `SETUP_CHECKLIST.md`
- **Update a component?** → `MIGRATION_GUIDE.md`
- **Find an API function?** → `API_REFERENCE.md`
- **Understand architecture?** → `README_SUPABASE.md`
- **See what changed?** → `WHATS_CHANGED.md`
- **Get overview?** → `INTEGRATION_SUMMARY.md`

### Working on...
- **Authentication?** → `services/auth.ts`, `context/AuthContext.tsx`
- **Database?** → `services/database.ts`
- **UI components?** → `pages/` folder
- **Styling?** → `index.css`, `tailwind.config.js`
- **Types?** → `types.ts`

## 📦 Dependencies

### New
- `@supabase/supabase-js` - Supabase client library

### Existing
- `react` & `react-dom` - UI framework
- `react-router-dom` - Routing
- `groq-sdk` - AI integration
- `lucide-react` - Icons
- `recharts` - Charts
- `tailwindcss` - Styling

## 🎉 Next Steps

1. **Read** `START_HERE.md`
2. **Follow** `SETUP_CHECKLIST.md`
3. **Update** components using `MIGRATION_GUIDE.md`
4. **Reference** `API_REFERENCE.md` as needed

---

**Ready?** Open **[START_HERE.md](./START_HERE.md)** now! 🚀
