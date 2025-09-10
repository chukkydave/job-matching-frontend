# Job Matching Platform - Frontend

A modern, responsive React frontend for the Instollar Jobs platform built with Next.js, featuring a clean and intuitive user interface for job matching and talent management.

## Features

### Public Features
- **Home Page** with compelling landing experience
- **Public Job Browsing** without authentication required
- **Job Search & Filtering** by skills, location, and keywords
- **Job Details Viewing** with comprehensive job information
- **Responsive Design** optimized for all devices

### Authentication System
- **User Registration** with email verification
- **Secure Login** with JWT token management
- **Email Verification** with OTP code input
- **Password Reset** with secure token-based flow
- **Forgot Password** functionality with email integration

### Role-Based Interfaces

#### Talent Dashboard
- **Personal Dashboard** with match statistics
- **My Matches** page showing matched jobs
- **Browse Jobs** with advanced filtering
- **Profile Management** with skills and location updates
- **Match Analytics** and success tracking

#### Admin Dashboard
- **Comprehensive Admin Dashboard** with system statistics
- **Job Management** (Create, Read, Update, Delete)
- **User Management** with detailed user profiles
- **Match Management** with talent-job pairing
- **System Analytics** and performance metrics

### User Experience
- **Modern UI/UX** with Instollar brand colors (#002620, #EFFE3D)
- **Responsive Design** with mobile-first approach
- **Loading States** and error handling
- **Toast Notifications** for user feedback
- **Intuitive Navigation** with role-based menus

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (useState, useEffect, useCallback)
- **HTTP Client**: Fetch API with custom utilities
- **Authentication**: JWT token management
- **Notifications**: react-hot-toast
- **Icons**: Heroicons (SVG)
- **Development**: ESLint, TypeScript compiler

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Backend API running (see backend README)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/chukkydave/job-matching-frontend.git
   cd job-matching-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file in the root directory:
   ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:3001/api

   # App Configuration
   NEXT_PUBLIC_APP_NAME=Instollar Jobs
   NEXT_PUBLIC_APP_VERSION=1.0.0
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Authentication pages
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   ├── reset-password/
│   │   └── verify-email/
│   ├── admin/                    # Admin-only pages
│   │   ├── dashboard/
│   │   ├── jobs/
│   │   ├── matches/
│   │   ├── users/
│   │   └── profile/
│   ├── talent/                   # Talent-only pages
│   │   ├── dashboard/
│   │   ├── matches/
│   │   ├── jobs/
│   │   └── profile/
│   ├── jobs/                     # Public job pages
│   │   ├── page.tsx              # Job listing
│   │   └── [id]/page.tsx         # Job details
│   ├── dashboard/                # Role-based dashboard redirect
│   ├── page.tsx                  # Home page
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/                   # Reusable components
│   ├── shared/                   # Shared UI components
│   │   ├── buttons/
│   │   ├── cards/
│   │   ├── modals/
│   │   └── layout/
│   ├── AuthenticatedLayout.tsx   # Main layout wrapper
│   ├── Header.tsx                # Public navigation
│   ├── Sidebar.tsx               # Authenticated navigation
│   └── ConditionalLayout.tsx     # Layout conditionals
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts                # Authentication hook
│   └── useApi.ts                 # API call hook
├── utils/                        # Utility functions
│   └── api.ts                    # API client utilities
├── config/                       # Configuration files
│   └── api.ts                    # API configuration
├── lib/                          # Library files
│   ├── types.ts                  # TypeScript type definitions
│   └── api.ts                    # Axios API client
└── styles/                       # Additional styles
```

## Design System

### Color Palette
- **Primary Dark**: #002620 (Instollar Dark)
- **Primary Yellow**: #EFFE3D (Instollar Yellow)
- **White**: #FFFFFF
- **Gray Scale**: Various shades for text and backgrounds

### Typography
- **Font Family**: Geist Sans (primary), Geist Mono (code)
- **Font Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Components
- **Buttons**: Primary, secondary, and variant styles
- **Cards**: Consistent card layouts with shadows
- **Modals**: Reusable modal components
- **Forms**: Styled form inputs and validation
- **Navigation**: Responsive navigation components

## Authentication Flow

### Registration Process
1. User fills registration form
2. Email verification code sent
3. User enters verification code
4. Account activated and redirected to dashboard

### Login Process
1. User enters credentials
2. JWT token stored in localStorage
3. User redirected to role-based dashboard
4. Token used for authenticated requests

### Password Reset
1. User requests password reset
2. Reset link sent to email
3. User clicks link and enters new password
4. Password updated and user logged in

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile-First Approach
- All components designed for mobile first
- Progressive enhancement for larger screens
- Touch-friendly interface elements
- Optimized navigation for mobile devices

## Component Architecture

### Shared Components
- **Button**: Reusable button with variants
- **Card**: Content container with consistent styling
- **Modal**: Overlay component for forms and content
- **PageLayout**: Consistent page structure
- **ResponsiveGrid**: Grid layout for responsive design

### Custom Hooks
- **useAuth**: Authentication state management
- **useApi**: API call management with loading states

### Layout Components
- **AuthenticatedLayout**: Main app layout with sidebar
- **Header**: Public navigation header
- **Sidebar**: Role-based navigation menu

## API Integration

### API Client
```typescript
// Centralized API configuration
import { getApiUrl } from '@/config/api';

// Making API calls
const response = await fetch(getApiUrl('/jobs'));
```

### Authentication
```typescript
// Adding auth token to requests
const token = localStorage.getItem('token');
const response = await fetch(getApiUrl('/jobs'), {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## Deployment

### Environment Variables for Production
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
NEXT_PUBLIC_APP_NAME=Instollar Jobs
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Build and Deploy
```bash
# Build for production
npm run build

# Start production server
npm start

# Or deploy to Vercel
vercel --prod
```

### Deployment Platforms
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Railway**
- **Heroku**

## Development

### Available Scripts
```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type checking
npm run type-check
```

### Code Quality
- **ESLint**: Code linting and formatting
- **TypeScript**: Type safety and development experience
- **Prettier**: Code formatting (if configured)

## Key Features Implementation

### Role-Based Access Control
- Automatic redirects based on user role
- Protected routes with authentication checks
- Different navigation menus for each role

### Job Matching Interface
- Advanced search and filtering
- Real-time job updates
- Match status tracking
- Detailed job information display

### Admin Management
- Comprehensive dashboard with statistics
- User management with detailed profiles
- Job CRUD operations
- Match creation and management

## Configuration

### API Configuration
```typescript
// src/config/api.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const getApiUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`;
```

### Authentication Configuration
```typescript
// src/hooks/useAuth.ts
export const useAuth = (requiredRole?: 'Admin' | 'Talent') => {
  // Authentication logic
};
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact: [your-email@domain.com]

## Version History

- **v1.0.0** - Initial release
  - Complete authentication system
  - Role-based dashboards
  - Job browsing and management
  - Matching system interface
  - Responsive design
  - Admin and talent interfaces

---

