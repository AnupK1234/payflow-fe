# PayFlow Project Structure

This document outlines the recommended folder structure for your PayFlow application.

```
src/
├── app/
│   ├── core/                          # Singleton services and core functionality
│   │   ├── guards/
│   │   │   ├── auth.guard.ts          # Authentication guard
│   │   │   └── role.guard.ts          # Role-based authorization guard
│   │   ├── interceptors/
│   │   │   ├── auth.interceptor.ts    # JWT token interceptor
│   │   │   └── error.interceptor.ts   # Global error handler
│   │   ├── services/
│   │   │   ├── auth.service.ts        # Authentication service
│   │   │   ├── storage.service.ts     # Local storage wrapper
│   │   │   └── notification.service.ts # Toast/alert notifications
│   │   └── models/
│   │       ├── user.model.ts
│   │       ├── organization.model.ts
│   │       └── response.model.ts
│   │
│   ├── shared/                        # Shared components, directives, pipes
│   │   ├── components/
│   │   │   ├── header/
│   │   │   ├── footer/
│   │   │   ├── sidebar/
│   │   │   ├── loader/
│   │   │   ├── modal/
│   │   │   └── data-table/
│   │   ├── directives/
│   │   │   └── role-access.directive.ts
│   │   ├── pipes/
│   │   │   ├── currency-format.pipe.ts
│   │   │   └── date-format.pipe.ts
│   │   └── utils/
│   │       ├── constants.ts
│   │       └── validators.ts
│   │
│   ├── pages/                         # Public pages (no auth required)
│   │   ├── home/
│   │   │   ├── home.component.ts
│   │   │   ├── home.component.html
│   │   │   └── home.component.css
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   └── forgot-password/
│   │   └── errors/
│   │       ├── not-found/
│   │       └── unauthorized/
│   │
│   ├── modules/                       # Feature modules (lazy-loaded)
│   │   ├── bank-admin/
│   │   │   ├── bank-admin.routes.ts
│   │   │   ├── layout/
│   │   │   │   └── bank-admin-layout.component.ts
│   │   │   ├── pages/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── organizations/
│   │   │   │   ├── payment-requests/
│   │   │   │   ├── salary-requests/
│   │   │   │   ├── reports/
│   │   │   │   └── profile/
│   │   │   └── services/
│   │   │       ├── organization.service.ts
│   │   │       └── payment-request.service.ts
│   │   │
│   │   ├── organization/
│   │   │   ├── organization.routes.ts
│   │   │   ├── layout/
│   │   │   │   └── organization-layout.component.ts
│   │   │   ├── pages/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── employees/
│   │   │   │   ├── clients-vendors/
│   │   │   │   ├── salary-disbursal/
│   │   │   │   ├── payment-requests/
│   │   │   │   ├── employee-concerns/
│   │   │   │   ├── reports/
│   │   │   │   └── profile/
│   │   │   └── services/
│   │   │       ├── employee.service.ts
│   │   │       ├── client-vendor.service.ts
│   │   │       └── salary.service.ts
│   │   │
│   │   └── employee/
│   │       ├── employee.routes.ts
│   │       ├── layout/
│   │       │   └── employee-layout.component.ts
│   │       ├── pages/
│   │       │   ├── dashboard/
│   │       │   ├── salary-history/
│   │       │   ├── bank-account/
│   │       │   ├── concerns/
│   │       │   └── profile/
│   │       └── services/
│   │           ├── salary-history.service.ts
│   │           └── concern.service.ts
│   │
│   ├── app.component.ts               # Root component
│   ├── app.routes.ts                  # Main routing configuration
│   └── app.config.ts                  # Application configuration
│
├── assets/                            # Static assets
│   ├── images/
│   ├── icons/
│   └── styles/
│       ├── variables.css              # CSS variables (colors, fonts)
│       └── global.css                 # Global styles
│
├── environments/                      # Environment configurations
│   ├── environment.ts                 # Development
│   └── environment.prod.ts            # Production
│
├── index.html                         # Main HTML file
├── main.ts                            # Application entry point
└── styles.css                         # Global styles import

```

## Key Concepts

### 1. **Standalone Components (Angular 20)**
All components are standalone - no need for NgModule declarations.

### 2. **Lazy Loading**
Feature modules (bank-admin, organization, employee) are lazy-loaded for better performance.

### 3. **Route Structure**
- `/` - Home page (public)
- `/login` - Login page (public)
- `/signup` - Signup page (public)
- `/bank-admin/*` - Bank admin routes (protected)
- `/organization/*` - Organization routes (protected)
- `/employee/*` - Employee routes (protected)

### 4. **Layout Components**
Each module has its own layout component with:
- Role-specific sidebar navigation
- Header with user info
- Main content area with router outlet

### 5. **Guards**
- **AuthGuard**: Checks if user is authenticated
- **RoleGuard**: Checks if user has required role for the route

### 6. **Services Organization**
- **Core services**: Singleton services used across the app
- **Module services**: Feature-specific services within each module

### 7. **Shared Resources**
Reusable components, directives, and pipes are in the `shared/` folder.

## Getting Started

1. **Create the folder structure** as shown above
2. **Move your home component** to `src/app/pages/home/`
3. **Create layout components** for each role
4. **Implement guards** for authentication and authorization
5. **Create services** for API communication
6. **Build feature components** for each module

## Next Steps

1. Set up authentication guards
2. Create layout components with navigation
3. Implement API services
4. Build role-specific dashboards
5. Add form validations and error handling