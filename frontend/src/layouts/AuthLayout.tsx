import { Outlet, useLocation } from 'react-router-dom'

const AuthLayout = () => {
  const location = useLocation()
  const isLoginPage = location.pathname === '/auth/login'

  if (isLoginPage) {
    return <Outlet />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout
