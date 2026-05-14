# React Dashboard Starter

A reusable `Vite + React + TypeScript` starter template for CRUD and dashboard-style applications.

This project is intended as a clean foundation for admin panels, internal tools, and business apps that need:

- authenticated and protected routes
- a reusable app shell with sidebar and header
- centralized API access through Axios
- a reusable UI component layer
- a structure that is easy to extend with new modules

## Overview

This starter gives you the common building blocks needed in most dashboard applications without locking you into a specific business domain.

It is a good fit for:

- admin panels
- CRUD applications
- internal tools
- business dashboards
- back-office interfaces

### Main features

- React 19 + TypeScript + Vite
- App layout with header, sidebar, and footer
- Public and protected routing
- Authentication context with token persistence
- Axios API client with auth header support
- Reusable UI components based on Radix/shadcn-style patterns
- Theme support with light/dark mode handling
- Generic starter pages for dashboard-style apps

## Tech Stack

- React
- TypeScript
- Vite
- React Router
- Axios
- Tailwind CSS
- Radix UI primitives
- TanStack Table
- Sonner
- Lucide React

## Project Structure

```text
src/
├── components/
│   ├── app/
│   │   └── layout/          # App shell: header, sidebar, footer, layout wrapper
│   ├── common/              # Shared app-level components
│   ├── routing/             # Route guards such as ProtectedRoute
│   ├── sections/            # Optional page sections / marketing-like blocks
│   └── ui/                  # Reusable UI primitives
├── config/                  # App config, menu config, theme config
├── contexts/                # React contexts such as auth and theme
├── hooks/                   # Custom hooks
├── lib/                     # Axios client, auth API helpers, utilities
├── pages/                   # Route-level pages
├── App.tsx                  # Providers + router setup
├── Router.tsx               # Route definitions
├── index.css                # Global styles
└── main.tsx                 # App entry point
```

### Important folders

#### `src/components`

Contains reusable UI and layout building blocks.

- `components/app/layout`: application shell
- `components/common`: shared higher-level components such as table wrappers and page headers
- `components/ui`: reusable low-level UI primitives
- `components/routing`: route guard components

#### `src/config`

Central place for configuration.

- `app.ts`: app metadata such as name and links
- `menu.ts`: sidebar/header navigation items
- `theme.ts`: layout width, spacing, and theme-related settings

#### `src/contexts`

Contains global state providers.

- `AuthProvider.tsx`: authentication lifecycle and token persistence
- `ThemeContext.tsx`: theme state and theme switching
- `auth-context.tsx`: auth context types and context object

#### `src/lib`

Holds infrastructure code and shared utilities.

- `axios.ts`: configured Axios instance for application API calls
- `api-auth.ts`: auth-specific requests such as login and token refresh
- `utils.ts`: generic helper utilities

#### `src/pages`

Contains route-level pages. These are the pages mapped in `src/Router.tsx`.

Examples in this starter:

- `Dashboard.tsx`
- `Login.tsx`
- `Sample.tsx`
- `ComingSoon.tsx`
- `NotFound.tsx`

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

### 3. Build for production

```bash
npm run build
```

### 4. Preview the production build

```bash
npm run preview
```

## Environment Variables

This project reads configuration from `.env` files via Vite.

### Recommended setup

- use `.env` for local values
- keep a committed `.env.example` in the repo as documentation for required variables

Example:

```env
VITE_APP_NAME=React Dashboard Starter
VITE_API_URL=http://localhost:4000/api/v1
VITE_API_BASE_URL=http://localhost:4000/api/v1
VITE_USE_HASH_ROUTE=false
VITE_BASE_URL=
```

### Variables used by the starter

#### `VITE_APP_NAME`

Used for app-level display values through `src/config/app.ts`.

#### `VITE_API_URL`

Used by `src/lib/api-auth.ts` for authentication endpoints:

- `POST /auth/login`
- `POST /auth/refresh`

#### `VITE_API_BASE_URL`

Used by `src/lib/axios.ts` as the base URL for the shared Axios client.

Use this for your main application API, for example:

```env
VITE_API_BASE_URL=http://localhost:4000/api/v1
```

#### `VITE_USE_HASH_ROUTE`

When set to `true`, the app uses `HashRouter` instead of `BrowserRouter`.

This can be useful for static hosting environments.

#### `VITE_BASE_URL`

Optional base path used when deploying under a subpath.

## Authentication

Authentication is already wired into the starter and can be connected to your backend API.

### How it works

- `src/contexts/AuthProvider.tsx` stores auth state
- access token and refresh token are persisted in `localStorage`
- `src/lib/api-auth.ts` handles login and refresh requests
- `src/components/routing/protected-route.tsx` blocks access to protected pages
- `src/lib/axios.ts` automatically adds the bearer token to outgoing requests

### Auth flow

1. User logs in from `src/pages/Login.tsx`
2. `loginRequest()` sends credentials to your backend
3. Tokens and user data are stored in context and local storage
4. Protected pages become accessible
5. On app load, auth state is restored from storage

### Where to connect your backend

Update these files:

- `src/lib/api-auth.ts`
- `src/lib/axios.ts`
- `src/contexts/AuthProvider.tsx` if your token or user shape differs

Current auth endpoints expected by the starter:

```ts
POST /auth/login
POST /auth/refresh
```

Current expected login response shape:

```ts
{
  ok: boolean;
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    username: string;
    role: string;
    status: string;
  };
}
```

If your backend returns a different shape, update the `LoginResponse` type in `src/lib/api-auth.ts`.

## Routing

Routes are defined in [src/Router.tsx](./src/Router.tsx).

### Public routes

Public routes are accessible without authentication.

Example:

- `/login`

### Protected routes

Protected routes are wrapped with `ProtectedRoute`.

Current structure:

```tsx
<Route path="/login" element={<LoginPage />} />

<Route element={<ProtectedRoute />}>
  <Route element={<AppLayout />}>
    <Route index element={<Dashboard />} />
    <Route path="pages/sample" element={<Sample />} />
    <Route path="pages/feature" element={<ComingSoon />} />
  </Route>
</Route>
```

### How to add a new route

1. Create a new page in `src/pages`
2. Import it in `src/Router.tsx`
3. Add a new `<Route />`
4. Add a menu item in `src/config/menu.ts` if it should appear in navigation

Example:

```tsx
import UsersPage from "@/pages/Users";

<Route path="users" element={<UsersPage />} />
```

## Layout System

The starter uses a reusable app shell for dashboard-style pages.

### Main layout files

- `src/components/app/layout/app-layout.tsx`
- `src/components/app/layout/app-header.tsx`
- `src/components/app/layout/app-sidebar.tsx`
- `src/components/app/layout/app-footer.tsx`

### How it works

- `AppLayout` renders the header, page container, and footer
- route content is rendered through `<Outlet />`
- navigation items come from `src/config/menu.ts`

This keeps page components focused on content instead of shell structure.

## How to Add a New Feature

This starter is designed to make new CRUD modules straightforward to add.

Below is a safe and simple example for adding a `Users` module.

### Step 1. Create the page

Create `src/pages/Users.tsx`:

```tsx
export default function UsersPage() {
  return <div>Users page</div>;
}
```

### Step 2. Add the route

Update `src/Router.tsx`:

```tsx
import UsersPage from "@/pages/Users";

<Route path="users" element={<UsersPage />} />
```

### Step 3. Add the menu item

Update `src/config/menu.ts`:

```tsx
{
  title: "Users",
  url: "/users",
  icon: Users,
}
```

### Step 4. Add API calls

Create a small API helper, for example `src/lib/api-users.ts` or a local module file:

```ts
import { api } from "@/lib/axios";

export async function listUsers() {
  const response = await api.get("/users");
  return response.data;
}
```

### Step 5. Load data inside the page

```tsx
import { useEffect, useState } from "react";
import { listUsers } from "@/lib/api-users";

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await listUsers();
      setUsers(data);
    }

    load();
  }, []);

  return <div>{users.length} users</div>;
}
```

### Step 6. Add create/edit/delete flows

For a typical CRUD module, add:

- list page
- create form
- edit form
- detail view if needed
- API functions for `GET`, `POST`, `PATCH/PUT`, and `DELETE`

Keep the same pattern:

- page in `src/pages`
- API calls in `src/lib` or a small local module file
- route in `src/Router.tsx`
- menu entry in `src/config/menu.ts`

## API Usage

### Shared Axios client

The app-wide API client is defined in `src/lib/axios.ts`.

It currently:

- sets `baseURL`
- sends JSON by default
- attaches `Authorization: Bearer <token>` if an access token exists

Example:

```ts
import { api } from "@/lib/axios";

export async function listItems() {
  const response = await api.get("/items");
  return response.data;
}
```

### Creating new API calls

Use the shared `api` instance for authenticated application requests:

```ts
import { api } from "@/lib/axios";

export async function createItem(payload: { name: string }) {
  const response = await api.post("/items", payload);
  return response.data;
}
```

For auth-specific requests, continue using `src/lib/api-auth.ts`.

## Customization

### Menu configuration

Update [src/config/menu.ts](./src/config/menu.ts) to control:

- sidebar navigation
- header navigation
- nested menu items

### Theme and layout settings

Check:

- [src/config/theme.ts](./src/config/theme.ts)
- [src/contexts/ThemeContext.tsx](./src/contexts/ThemeContext.tsx)

Use these to adjust:

- container width
- page spacing
- theme mode behavior

### App metadata

Update [src/config/app.ts](./src/config/app.ts):

- app name
- GitHub URL
- author info

### Reusable UI components

Use the components in `src/components/ui` and `src/components/common` as the base for new forms, tables, cards, filters, dialogs, and dashboards.

Examples:

- buttons
- inputs
- cards
- tables
- dropdowns
- popovers
- badges
- sidebars

## Notes

- Keep this starter focused on CRUD and dashboard applications
- Prefer adding business logic as new pages/modules instead of modifying the shared foundation too early
- Keep shared infrastructure generic: auth, layout, API, UI, config
- Avoid introducing domain-specific naming into the starter layer

## License

See [LICENSE](./LICENSE).
