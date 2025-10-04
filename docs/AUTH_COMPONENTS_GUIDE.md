# PayFlow Authentication Components Guide

This guide provides comprehensive documentation for the authentication components in PayFlow.

## 📁 File Structure

```
src/app/pages/auth/
├── login/
│   ├── login.component.ts
│   ├── login.component.html
│   └── login.component.css
├── signup/
│   ├── signup.component.ts
│   ├── signup.component.html
│   └── signup.component.css
├── forgot-password/
│   ├── forgot-password.component.ts
│   ├── forgot-password.component.html
│   └── forgot-password.component.css
└── reset-password/
    ├── reset-password.component.ts
    ├── reset-password.component.html
    └── reset-password.component.css
```

## 🔐 Components Overview

### 1. Login Component (`/login`)

**Purpose:** Handles user authentication for all roles (Bank Admin, Organization Admin, Employee)

**Features:**
- Username and password authentication
- CAPTCHA verification for security
- Show/hide password toggle
- Role-based routing after login
- First-time login detection and redirection
- Error handling with user-friendly messages

**API Endpoint:**
```typescript
POST http://localhost:8080/api/auth/login
Body: {
  username: string,
  password: string
}
Response: {
  token: string,
  user: {
    id: number,
    username: string,
    email: string,
    role: string,
    mustResetPassword: boolean
  }
}
```

**Routing Logic:**
- `BANK_ADMIN` → `/bank-admin/dashboard`
- `ORG_ADMIN` → `/organization/dashboard`
- `EMPLOYEE` → `/employee/dashboard`
- If `mustResetPassword: true` → `/reset-password?firstLogin=true`

---

### 2. Signup Component (`/signup`)

**Purpose:** Organization registration with multi-step form

**Features:**
- 3-step registration process:
  1. Organization details + document upload
  2. Bank account information
  3. Admin user account creation
- Progress indicator
- File upload with validation (max 5MB per file)
- Real-time form validation
- Password strength indicator
- Terms and conditions acceptance

**Form Data Structure:**
```typescript
{
  // Step 1: Organization
  name: string,
  registrationNumber: string (10-20 alphanumeric),
  address: string,
  documents: File[],
  
  // Step 2: Bank Account
  accountNumber: string (12 digits),
  ifsc: string (format: ABCD0123456),
  
  // Step 3: Admin User
  adminUsername: string,
  adminEmail: string (valid email),
  tempPassword: string (min 8 chars),
  confirmPassword: string,
  acceptTerms: boolean
}
```

**API Endpoint:**
```typescript
POST http://localhost:8080/api/organizations/register
Content-Type: multipart/form-data
Body: {
  data: JSON string of organization data,
  documents: File[]
}
```

**Validations:**
- Registration Number: `/^[A-Z0-9]{10,20}$/`
- Account Number: `/^\d{12}$/`
- IFSC Code: `/^[A-Z]{4}0[A-Z0-9]{6}$/`
- Email: Standard email validation
- Password: Minimum 8 characters

---

### 3. Forgot Password Component (`/forgot-password`)

**Purpose:** Password recovery through OTP verification (3-step process)

**Features:**
- **Step 1:** Request OTP via email
- **Step 2:** Verify 6-digit OTP with timer (5 minutes)
- **Step 3:** Set new password with strength indicator
- Resend OTP functionality
- Navigation between steps

**API Endpoints:**

**Step 1 - Request OTP:**
```typescript
POST http://localhost:8080/api/auth/forgot-password/request-otp
Body: {
  email: string
}
```

**Step 2 - Verify OTP:**
```typescript
POST http://localhost:8080/api/auth/forgot-password/verify-otp
Body: {
  email: string,
  otp: string (6 digits)
}
```

**Step 3 - Reset Password:**
```typescript
POST http://localhost:8080/api/auth/forgot-password/reset-password
Body: {
  email: string,
  newPassword: string
}
```

**Features:**
- OTP Timer: 5 minutes countdown
- OTP Format: 6 digits
- Password validation: Same as signup

---

### 4. Reset Password Component (`/reset-password`)

**Purpose:** Password reset for first-time login and regular password changes

**Features:**
- Detects first-time login via query parameter
- Current password verification
- New password with strength indicator
- Password requirements checklist with real-time validation
- Automatic routing to dashboard after success

**API Endpoint:**
```typescript
POST http://localhost:8080/api/auth/reset-password
Headers: {
  Authorization: Bearer <token>
}
Body: {
  currentPassword: string,
  newPassword: string
}
```

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@$!%*?&)

**Pattern:**
```typescript
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
```

---

## 🎨 Design System

All components follow the PayFlow color scheme:

```css
/* Primary Colors */
--primary-blue: #2563eb
--primary-dark: #1e40af
--secondary-teal: #0d9488

/* Neutral Colors */
--dark-gray: #1f2937
--medium-gray: #6b7280
--light-gray: #f3f4f6

/* Status Colors */
--success-green: #10b981
--warning-orange: #f59e0b
--error-red: #ef4444
```

---

## 🔧 Configuration Required

### 1. Update `app.routes.ts`

Add these routes to your routing configuration:

```typescript
{
  path: 'login',
  loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent),
  title: 'Login - PayFlow'
},
{
  path: 'signup',
  loadComponent: () => import('./pages/auth/signup/signup.component').then(m => m.SignupComponent),
  title: 'Sign Up - PayFlow'
},
{
  path: 'forgot-password',
  loadComponent: () => import('./pages/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
  title: 'Forgot Password - PayFlow'
},
{
  path: 'reset-password',
  loadComponent: () => import('./pages/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
  title: 'Reset Password - PayFlow'
}
```

### 2. Install Bootstrap Icons

Add to your `index.html`:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
```

Or install via npm:

```bash
npm install bootstrap-icons
```

### 3. Update Backend URLs

Change the API base URL in all components from `http://localhost:8080` to your actual backend URL.

---

## 🔒 Security Features

1. **CAPTCHA Protection:** Login form includes CAPTCHA to prevent bot attacks
2. **JWT Authentication:** Token-based authentication stored in localStorage
3. **Password Encryption:** Passwords hashed on backend (BCrypt)
4. **OTP Expiry:** 5-minute timer for OTP verification
5. **Password Complexity:** Strong password requirements enforced
6. **First Login Protection:** Mandatory password reset on first login

---

## 📱 Responsive Design

All components are fully responsive:
- Desktop: Full-width layouts with side panels
- Tablet: Single column with adjusted spacing
- Mobile: Optimized touch targets and compact layouts

---

## 🧪 Testing Checklist

### Login Component
- [ ] Valid credentials login
- [ ] Invalid credentials error
- [ ] CAPTCHA validation
- [ ] First-time login redirect
- [ ] Role-based routing
- [ ] Show/hide password toggle

### Signup Component
- [ ] Step navigation (forward/backward)
- [ ] Form validation at each step
- [ ] File upload (multiple files)
- [ ] File size validation (5MB limit)
- [ ] Registration number format
- [ ] IFSC code format
- [ ] Account number validation
- [ ] Password match validation
- [ ] Terms acceptance requirement
- [ ] Success redirect to login

### Forgot Password Component
- [ ] Email validation
- [ ] OTP sent successfully
- [ ] OTP timer countdown
- [ ] Resend OTP functionality
- [ ] OTP verification
- [ ] Password reset
- [ ] Step navigation
- [ ] Redirect to login after success

### Reset Password Component
- [ ] Current password verification
- [ ] Password strength indicator
- [ ] Password requirements checklist
- [ ] Password match validation
- [ ] First login detection
- [ ] Success redirect to dashboard
- [ ] Logout functionality

---

## 🚀 Deployment Notes

1. **Environment Variables:** Store API URLs in environment files
2. **HTTPS Only:** All authentication endpoints must use HTTPS in production
3. **Token Storage:** Consider using HttpOnly cookies instead of localStorage for enhanced security
4. **CORS Configuration:** Ensure backend allows requests from frontend domain
5. **Rate Limiting:** Implement rate limiting on backend for authentication endpoints

---

## 📞 Support

For issues or questions, contact the Swabhav Team or refer to the main SRS document.