import React, { useState } from 'react'

interface PaymentMethod {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  isPopular?: boolean
  formFields: {
    [key: string]: {
      type: string
      placeholder: string
      required: boolean
      label: string
    }
  }
}

interface PaymentMethodCardProps {
  method: PaymentMethod
  isSelected: boolean
  onSelect: (methodId: string) => void
  formData: { [key: string]: string }
  onFormChange: (field: string, value: string) => void
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  method,
  isSelected,
  onSelect,
  formData,
  onFormChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSelect = () => {
    onSelect(method.id)
    setIsExpanded(true)
  }

  const handleFormChange = (field: string, value: string) => {
    onFormChange(field, value)
  }

  return (
    <div className={`border rounded-xl transition-all duration-300 ${
      isSelected 
        ? 'border-emerald-500 bg-emerald-50 shadow-md' 
        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
    }`}>
      {/* Payment Method Header */}
      <div 
        className="p-4 cursor-pointer"
        onClick={handleSelect}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isSelected ? 'bg-emerald-100' : 'bg-gray-100'
            }`}>
              {method.icon}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900">{method.name}</h3>
                {method.isPopular && (
                  <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">
                    Popular
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">{method.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              isSelected 
                ? 'border-emerald-500 bg-emerald-500' 
                : 'border-gray-300'
            }`}>
              {isSelected && (
                <div className="w-2 h-2 bg-white rounded-full"></div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Inline Form */}
      <div className={`overflow-hidden transition-all duration-300 ${
        isSelected && isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-4 pb-4 border-t border-gray-100">
          <div className="pt-4 space-y-4">
            {Object.entries(method.formFields).map(([fieldKey, field]) => (
              <div key={fieldKey}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                  type={field.type}
                  value={formData[fieldKey] || ''}
                  onChange={(e) => handleFormChange(fieldKey, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-900 placeholder-gray-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentMethodCard
