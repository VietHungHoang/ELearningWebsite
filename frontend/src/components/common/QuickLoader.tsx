import React from 'react'

interface QuickLoaderProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'green' | 'blue' | 'gray'
  text?: string
  className?: string
}

const QuickLoader: React.FC<QuickLoaderProps> = ({
  size = 'md',
  color = 'green',
  text,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  const colorClasses = {
    green: 'border-green-500',
    blue: 'border-blue-500',
    gray: 'border-gray-500'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center space-y-2">
        <div className={`${sizeClasses[size]} border-2 border-transparent ${colorClasses[color]} rounded-full animate-spin`}></div>
        {text && (
          <p className={`text-gray-600 font-medium ${textSizeClasses[size]}`}>
            {text}
          </p>
        )}
      </div>
    </div>
  )
}

export default QuickLoader
