import React, { useState } from 'react'
import { CreditCard, Smartphone, Globe, Building2, Shield, Zap } from 'lucide-react'
import PaymentMethodCard from './PaymentMethodCard'

interface PaymentMethodsSectionProps {
  selectedMethod: string
  onMethodSelect: (methodId: string) => void
  formData: { [key: string]: string }
  onFormChange: (field: string, value: string) => void
}

const PaymentMethodsSection: React.FC<PaymentMethodsSectionProps> = ({
  selectedMethod,
  onMethodSelect,
  formData,
  onFormChange
}) => {
  const paymentMethods = [
    {
      id: 'visa',
      name: 'Visa',
      icon: <CreditCard className="w-5 h-5 text-blue-600" />,
      description: 'Pay with your Visa card',
      isPopular: true,
      formFields: {
        cardNumber: {
          type: 'text',
          placeholder: '1234 5678 9012 3456',
          required: true,
          label: 'Card Number'
        },
        expiryDate: {
          type: 'text',
          placeholder: 'MM/YY',
          required: true,
          label: 'Expiry Date'
        },
        cvv: {
          type: 'text',
          placeholder: '123',
          required: true,
          label: 'CVV'
        },
        cardholderName: {
          type: 'text',
          placeholder: 'John Doe',
          required: true,
          label: 'Cardholder Name'
        }
      }
    },
    {
      id: 'mastercard',
      name: 'Mastercard',
      icon: <CreditCard className="w-5 h-5 text-red-600" />,
      description: 'Pay with your Mastercard',
      isPopular: true,
      formFields: {
        cardNumber: {
          type: 'text',
          placeholder: '1234 5678 9012 3456',
          required: true,
          label: 'Card Number'
        },
        expiryDate: {
          type: 'text',
          placeholder: 'MM/YY',
          required: true,
          label: 'Expiry Date'
        },
        cvv: {
          type: 'text',
          placeholder: '123',
          required: true,
          label: 'CVV'
        },
        cardholderName: {
          type: 'text',
          placeholder: 'John Doe',
          required: true,
          label: 'Cardholder Name'
        }
      }
    },
    {
      id: 'momo',
      name: 'MoMo',
      icon: <Smartphone className="w-5 h-5 text-pink-600" />,
      description: 'Pay with MoMo wallet',
      isPopular: true,
      formFields: {
        phoneNumber: {
          type: 'tel',
          placeholder: '0123 456 789',
          required: true,
          label: 'Phone Number'
        },
        otp: {
          type: 'text',
          placeholder: 'Enter OTP',
          required: true,
          label: 'OTP Code'
        }
      }
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: <Globe className="w-5 h-5 text-blue-500" />,
      description: 'Pay with PayPal account',
      formFields: {
        email: {
          type: 'email',
          placeholder: 'your@email.com',
          required: true,
          label: 'PayPal Email'
        },
        password: {
          type: 'password',
          placeholder: 'Enter password',
          required: true,
          label: 'PayPal Password'
        }
      }
    },
    {
      id: 'stripe',
      name: 'Stripe',
      icon: <Building2 className="w-5 h-5 text-purple-600" />,
      description: 'Secure payment with Stripe',
      formFields: {
        cardNumber: {
          type: 'text',
          placeholder: '1234 5678 9012 3456',
          required: true,
          label: 'Card Number'
        },
        expiryDate: {
          type: 'text',
          placeholder: 'MM/YY',
          required: true,
          label: 'Expiry Date'
        },
        cvv: {
          type: 'text',
          placeholder: '123',
          required: true,
          label: 'CVV'
        },
        cardholderName: {
          type: 'text',
          placeholder: 'John Doe',
          required: true,
          label: 'Cardholder Name'
        }
      }
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      icon: <Building2 className="w-5 h-5 text-green-600" />,
      description: 'Direct bank transfer',
      formFields: {
        bankName: {
          type: 'text',
          placeholder: 'Vietcombank',
          required: true,
          label: 'Bank Name'
        },
        accountNumber: {
          type: 'text',
          placeholder: '1234567890',
          required: true,
          label: 'Account Number'
        },
        accountHolder: {
          type: 'text',
          placeholder: 'John Doe',
          required: true,
          label: 'Account Holder Name'
        }
      }
    }
  ]

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center space-x-2 mb-6">
        <Shield className="w-5 h-5 text-emerald-600" />
        <h2 className="text-xl font-semibold text-gray-900">Payment Methods</h2>
      </div>
      
      <p className="text-gray-600 text-sm mb-6">
        Choose your preferred payment method. All transactions are secure and encrypted.
      </p>

      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <PaymentMethodCard
            key={method.id}
            method={method}
            isSelected={selectedMethod === method.id}
            onSelect={onMethodSelect}
            formData={formData}
            onFormChange={onFormChange}
          />
        ))}
      </div>

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-gray-500 mt-0.5" />
          <div>
            <p className="text-sm text-gray-600">
              <strong>Secure Payment:</strong> Your payment information is encrypted and processed securely. 
              We never store your payment details on our servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentMethodsSection
