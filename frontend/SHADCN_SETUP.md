# Shadcn/UI và Folder Structure - Setup Guide

## 📁 Folder Structure

```
frontend/src/
├── components/
│   └── ui/                 # Shadcn/UI components
│       ├── button.jsx
│       ├── card.jsx
│       ├── input.jsx
│       └── label.jsx
├── layouts/                # Layout components
│   ├── MainLayout.jsx     # Main app layout (header, content, footer)
│   └── AuthLayout.jsx     # Auth pages layout (centered card)
├── pages/                  # Page components
│   ├── HomePage.jsx       # Landing page
│   └── LoginPage.jsx      # Login page
├── hooks/                  # Custom React hooks
│   └── useAuth.js         # Auth-related hooks (TanStack Query)
├── store/                  # Redux store
│   ├── store.js
│   ├── hooks.js
│   └── features/          # Redux slices
│       └── auth/
│           └── authSlice.js
├── services/              # API services
│   └── authService.js
├── lib/                   # Utility libraries
│   ├── axios.js          # Axios instance
│   ├── queryClient.js    # TanStack Query client
│   └── utils.js          # cn() và utilities khác
├── constants/            # Constants (API endpoints, routes, etc.)
│   └── index.js
├── App.jsx               # Main app with routing
├── main.jsx              # Entry point với providers
└── index.css             # Global styles + Shadcn theme
```

## 🎨 Shadcn/UI Components

### Đã Cài Đặt

1. **Button** - `@/components/ui/button.jsx`

   - Variants: default, destructive, outline, secondary, ghost, link
   - Sizes: default, sm, lg, icon

2. **Card** - `@/components/ui/card.jsx`

   - Components: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter

3. **Input** - `@/components/ui/input.jsx`

   - Styled input field

4. **Label** - `@/components/ui/label.jsx`
   - Form label

### Thêm Components Mới

Để thêm component shadcn/ui mới, bạn có thể:

**Cách 1: Manual (Khuyến nghị cho learning)**

1. Vào https://ui.shadcn.com/docs/components
2. Chọn component cần thiết
3. Copy code và tạo file trong `src/components/ui/`

**Cách 2: Using CLI (Nhanh hơn)**

```bash
npx shadcn@latest add [component-name]

# Ví dụ:
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add toast
```

## 🛠️ Configuration Files

### 1. components.json

Cấu hình cho shadcn/ui:

```json
{
  "style": "default",
  "tailwind": { "baseColor": "slate" },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

### 2. tailwind.config.js

Theme với CSS variables cho dark mode:

- Colors: primary, secondary, muted, destructive, etc.
- Border radius: lg, md, sm
- Support dark mode với class strategy

### 3. vite.config.js

- Path alias `@` → `./src`
- TailwindCSS plugin

## 💡 Usage Examples

### Button Component

```jsx
import { Button } from '@/components/ui/button';

<Button>Click me</Button>
<Button variant="outline">Outline</Button>
<Button variant="destructive">Delete</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
```

### Card Component

```jsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
</Card>;
```

### Form với Input & Label

```jsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="email@example.com" />
</div>;
```

## 🎭 Layouts

### MainLayout

Dùng cho các trang chính của app (sau khi login):

- Header với navigation
- Main content area với `<Outlet />`
- Footer

Usage:

```jsx
<Route element={<MainLayout />}>
  <Route path="/" element={<HomePage />} />
  <Route path="/chat" element={<ChatPage />} />
</Route>
```

### AuthLayout

Dùng cho authentication pages:

- Centered layout
- Muted background
- Card container

Usage:

```jsx
<Route element={<AuthLayout />}>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
</Route>
```

## 📝 Constants

File `constants/index.js` chứa:

- **API_ENDPOINTS** - Tất cả API endpoints
- **QUERY_KEYS** - Keys cho TanStack Query
- **STORAGE_KEYS** - Keys cho localStorage
- **ROUTES** - App routes

Example:

```javascript
import { API_ENDPOINTS, QUERY_KEYS } from "@/constants";

// Trong service
api.post(API_ENDPOINTS.LOGIN, credentials);

// Trong TanStack Query
useQuery({ queryKey: QUERY_KEYS.CURRENT_USER });
```

## 🎨 Theme Customization

### Light/Dark Mode Toggle

Để thêm dark mode toggle:

1. Tạo theme provider (optional):

```jsx
// contexts/ThemeProvider.jsx
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

2. Tạo toggle button:

```jsx
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeProvider";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </Button>
  );
}
```

### Custom Colors

Để thay đổi primary color, edit CSS variables trong `index.css`:

```css
:root {
  --primary: 221.2 83.2% 53.3%; /* Blue */
  /* Change to green: */
  --primary: 142 76% 36%;
}
```

## 📚 Tài Liệu Tham Khảo

- [Shadcn/UI Documentation](https://ui.shadcn.com/)
- [Shadcn/UI Components](https://ui.shadcn.com/docs/components)
- [TailwindCSS](https://tailwindcss.com/)
- [Class Variance Authority](https://cva.style/docs)
