# PayFlow : Payroll Management System - Angular Frontend

This is the **Angular 19 frontend** for the Payroll Management System.
It is built with **Angular 19**, **Bootstrap 5**, and follows **best practices for production-ready applications**.

---

## Table of Contents

* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Running the Project](#running-the-project)
* [Building for Production](#building-for-production)
* [Folder Structure](#folder-structure)
* [Core Concepts](#core-concepts)
* [Environment Variables](#environment-variables)
* [VS Code Recommended Setup](#vs-code-recommended-setup)

---

## Prerequisites

Make sure you have installed:

* [Node.js](https://nodejs.org/) >= 18.x
* [Angular CLI](https://angular.io/cli) >= 19.x
* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

---

## Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd payroll-fe
```

2. Install dependencies:

```bash
npm install
```

---

## Running the Project

Start the development server:

```bash
ng serve
```

Visit the app at `http://localhost:4200`.
The app will automatically reload when you change any source files.

---

## Building for Production

To build the project for production:

```bash
ng build --configuration production
```

* Output will be in the `dist/` folder.
* You can serve these files via **NGINX, Apache, or Spring Boot static resources**.

---

## Folder Structure

```
src/
 ├── app/
 │    ├── core/                # Singleton services and app-wide components
 │    │    ├── services/       # AuthService, ApiService
 │    │    ├── guards/         # AuthGuard, RoleGuard
 │    │    ├── interceptors/   # JWT interceptor, error handling
 │    │    ├── layouts/        # Navbar, Sidebar, Footer
 │    │    └── core.module.ts
 │    │
 │    ├── shared/              # Reusable components, pipes, directives
 │    │    ├── components/     # Buttons, Modals, Tables
 │    │    ├── directives/     # Custom directives
 │    │    ├── pipes/          # CurrencyPipe, DatePipe
 │    │    └── shared.module.ts
 │    │
 │    ├── features/            # Feature modules (lazy-loaded)
 │    │    ├── employees/      # Employee management module
 │    │    ├── payroll/        # Payroll processing module
 │    │    ├── reports/        # Reports & analytics module
 │    │    └── settings/       # App settings module
 │    │
 │    ├── auth/                # Authentication module (login, register)
 │    ├── app-routing.module.ts
 │    ├── app.module.ts
 │    └── app.component.ts
 ├── assets/                   # Images, fonts, icons
 ├── public/                   # Raw static files (robots.txt, favicon.ico)
 ├── environments/             # environment.ts and environment.prod.ts
 └── styles/                   # Global SCSS, Bootstrap overrides
```

---

## Core Concepts

* **CoreModule**: Singleton services, app-wide guards, interceptors, layout components.

  * Import only once in `AppModule`.

* **SharedModule**: Reusable UI components, directives, and pipes.

  * Import in any feature module.

* **Feature Modules**: Each major business domain (Employees, Payroll, Reports) is a **lazy-loaded module**.

* **AuthModule**: Handles authentication pages and logic.

* **Lazy Loading**: Improves app performance by loading modules only when needed.

---

## Environment Variables

Angular uses `environment.ts` files instead of `.env`:

* `src/environments/environment.ts` → Development
* `src/environments/environment.prod.ts` → Production

Example:

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

Access in code:

```ts
import { environment } from '../environments/environment';
this.http.get(`${environment.apiUrl}/employees`);
```

> ⚠️ Do not store secrets (DB credentials, JWT keys) in Angular — frontend is public. Keep secrets in backend.

---

## VS Code Recommended Setup

### Extensions (`.vscode/extensions.json`)

* Angular Language Service (`angular.ng-template`)
* Prettier (`esbenp.prettier-vscode`)
* ESLint (`dbaeumer.vscode-eslint`)
* GitLens (`eamodio.gitlens`)

### Settings (`.vscode/settings.json`)

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.exclude": {
    "node_modules": true,
    "dist": true
  }
}
```


