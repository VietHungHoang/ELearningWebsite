import React from 'react'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  path?: string
  active?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  icon?: React.ComponentType<{ className?: string }>
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, icon: Icon }) => {
  return (
    <div className="flex items-center space-x-2 text-sm text-gray-600">
      {Icon && <Icon className="w-4 h-4" />}
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item.active ? (
            <span className="text-gray-900 font-medium">{item.label}</span>
          ) : (
            <span>{item.label}</span>
          )}
          {index < items.length - 1 && (
            <ChevronRight className="w-3 h-3 text-gray-400" />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export default Breadcrumb
