import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../../store/hooks'

interface RoleBasedRedirectProps {
  children: React.ReactNode
  allowedRoles: string[]
}

const RoleBasedRedirect: React.FC<RoleBasedRedirectProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  if (!user || !allowedRoles.includes(user.role)) {
    // Redirect to 403 page if user doesn't have the right role
    return <Navigate to="/403" replace />
  }

  return <>{children}</>
}

export default RoleBasedRedirect
