# Frontend Setup Guide

## 🎯 Tech Stack

This frontend is built with:

- ⚡ **Vite** - Fast build tool
- ⚛️ **React 19** - UI library
- 🎨 **TailwindCSS** - Utility-first CSS framework
- 🔄 **TanStack Query (React Query)** - Server state management
- 🗃️ **Redux Toolkit** - Client state management
- 🧭 **React Router v6** - Routing
- 📡 **Axios** - HTTP client

## 📁 Folder Structure

```
src/
├── lib/                    # Core utilities
│   ├── axios.js           # Axios instance with interceptors
│   └── queryClient.js     # TanStack Query client config
├── store/                  # Redux store
│   ├── store.js           # Store configuration
│   ├── hooks.js           # Typed Redux hooks
│   └── features/          # Feature slices
│       └── auth/
│           └── authSlice.js
├── services/              # API services
│   └── authService.js
├── hooks/                 # Custom React hooks
│   └── useAuth.js        # TanStack Query hooks
├── components/           # React components
├── pages/               # Page components
└── App.jsx              # Main app component
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Variables

Create `.env` file:

```bash
VITE_API_URL=http://localhost:5000/api
```

### 3. Run Development Server

```bash
npm run dev
```

## 📚 Usage Examples

### Redux Toolkit - Client State

**Using the store:**

```javascript
import { useAppDispatch, useAppSelector } from "./store/hooks";
import {
  setCredentials,
  logout,
  selectCurrentUser,
} from "./store/features/auth/authSlice";

function MyComponent() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);

  const handleLogin = (userData) => {
    dispatch(setCredentials({ user: userData, token: "xxx" }));
  };

  const handleLogout = () => {
    dispatch(logout());
  };
}
```

**Creating a new slice:**

```javascript
// src/store/features/user/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: { profile: null },
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
  },
});

export const { setProfile } = userSlice.actions;
export default userSlice.reducer;

// Don't forget to add to store.js!
```

### TanStack Query - Server State

**Fetching data:**

```javascript
import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";

function UserProfile() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => api.get(`/users/${userId}`).then((res) => res.data),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{data.name}</div>;
}
```

**Mutations:**

```javascript
import { useMutation, useQueryClient } from "@tanstack/react-query";

function UpdateProfile() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newProfile) => api.put("/profile", newProfile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  return (
    <button onClick={() => mutation.mutate({ name: "New Name" })}>
      Update
    </button>
  );
}
```

### React Router

```javascript
import { Routes, Route, Link, useNavigate } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/users/:id" element={<UserDetail />} />
    </Routes>
  );
}
```

### Axios with Interceptors

The axios instance automatically:

- Adds JWT token to all requests
- Handles 401 errors (redirects to login)
- Provides centralized error handling

## 🎨 TailwindCSS Usage

```javascript
function Button() {
  return (
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Click me
    </button>
  );
}
```

## 🔑 Key Concepts

### When to use Redux vs TanStack Query?

| Use Case          | Tool               | Example                     |
| ----------------- | ------------------ | --------------------------- |
| Server data (API) | **TanStack Query** | User profile, posts list    |
| Global UI state   | **Redux**          | Theme, sidebar open/closed  |
| Auth state        | **Redux**          | User token, isAuthenticated |
| Form state        | **Local state**    | Form inputs                 |

## 🛠️ Development Tools

- **Redux DevTools** - Browser extension for Redux debugging
- **React Query DevTools** - Built-in, press floating button in dev mode
- **Vite HMR** - Hot module replacement for instant updates

## 📖 Learn More

- [Redux Toolkit](https://redux-toolkit.js.org/)
- [TanStack Query](https://tanstack.com/query/latest)
- [React Router](https://reactrouter.com/)
- [TailwindCSS](https://tailwindcss.com/)
