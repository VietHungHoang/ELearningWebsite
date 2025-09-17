# EduLearn - React E-Learning Platform

A modern, responsive e-learning platform built with React, TypeScript, and TailwindCSS.

## 🚀 Features

- **Modern UI/UX**: Clean and responsive design with TailwindCSS
- **Authentication**: User registration and login system
- **Course Management**: Browse, search, and filter courses
- **Learning Experience**: Video lessons with progress tracking
- **User Dashboard**: Personal learning dashboard with statistics
- **Profile Management**: Edit user profile and view achievements
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Animations**: Framer Motion

## 📁 Project Structure

```
src/
├── assets/          # Images, icons, fonts, CSS
├── components/      # Reusable UI components
│   ├── Header.tsx
│   └── Footer.tsx
├── layouts/         # Layout components
│   ├── MainLayout.tsx
│   └── AuthLayout.tsx
├── pages/           # Page components
│   ├── HomePage.tsx
│   ├── CourseListPage.tsx
│   ├── CourseDetailPage.tsx
│   ├── LessonPage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── DashboardPage.tsx
│   └── ProfilePage.tsx
├── routes/          # Routing configuration
│   └── index.tsx
├── services/        # API calls and data handling
├── store/           # Redux store and slices
│   ├── store.ts
│   ├── hooks.ts
│   └── slices/
│       ├── authSlice.ts
│       ├── courseSlice.ts
│       └── userSlice.ts
├── utils/           # Helper functions
├── App.tsx
├── main.tsx
└── index.css
```

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd elearning-react
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📱 Pages Overview

### Public Pages
- **Home Page**: Landing page with featured courses and statistics
- **Course List**: Browse and search all available courses
- **Course Detail**: Detailed course information with curriculum
- **Login/Register**: Authentication pages

### Protected Pages (Requires Authentication)
- **Dashboard**: User's learning dashboard with progress
- **Profile**: User profile management
- **Lesson Page**: Video lesson player with course navigation

## 🎨 Design System

### Colors
- **Primary**: Blue (#3B82F6)
- **Secondary**: Gray (#64748B)
- **Accent**: Orange (#F2750E)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)

### Typography
- **Primary Font**: Inter
- **Heading Font**: Poppins

### Components
- Responsive grid system
- Card components with hover effects
- Form components with validation
- Button variants (primary, secondary, accent)
- Navigation components

## 🔧 Configuration

### TailwindCSS
The project uses a custom TailwindCSS configuration with:
- Custom color palette
- Custom animations
- Responsive breakpoints
- Component utilities

### Redux Store
The Redux store is configured with three main slices:
- **Auth Slice**: User authentication state
- **Course Slice**: Course data and filters
- **User Slice**: User profile and preferences

## 📊 State Management

The application uses Redux Toolkit for state management with the following structure:

```typescript
{
  auth: {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null
  },
  courses: {
    courses: Course[]
    currentCourse: Course | null
    isLoading: boolean
    error: string | null
    filters: FilterState
  },
  user: {
    profile: UserProfile | null
    isLoading: boolean
    error: string | null
    isUpdating: boolean
  }
}
```

## 🔐 Authentication

The authentication system includes:
- User registration and login
- JWT token management
- Protected routes
- Form validation
- Error handling

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🎯 Key Features

### Course Management
- Course browsing with filters
- Course search functionality
- Course detail pages with curriculum
- Course enrollment system

### Learning Experience
- Video lesson player
- Progress tracking
- Course navigation
- Lesson completion tracking

### User Experience
- Modern, intuitive interface
- Smooth animations and transitions
- Loading states and error handling
- Mobile-first responsive design

## 🔄 API Integration

The application is designed to integrate with a Laravel backend API. Current implementation uses mock data, but the structure is ready for real API integration.

### API Endpoints (Planned)
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/courses` - Get course list
- `GET /api/courses/{id}` - Get course details
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
1. Connect your repository to Vercel
2. Configure build settings
3. Deploy automatically on push

### Deploy to Netlify
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact:
- Email: support@edulearn.com
- Documentation: [Link to documentation]

## 🔮 Future Enhancements

- [ ] Real-time notifications
- [ ] Discussion forums
- [ ] Live streaming capabilities
- [ ] Advanced analytics
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Payment integration
- [ ] Certificate generation
- [ ] Social learning features

---

Built with ❤️ using React, TypeScript, and TailwindCSS
