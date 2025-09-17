import React from 'react'
import { CreditCard, LogOut } from 'lucide-react'

interface WalletSectionProps {
  balance: number
  onWithdraw?: () => void
  onSignOut?: () => void
}

const WalletSection: React.FC<WalletSectionProps> = ({
  balance,
  onWithdraw,
  onSignOut
}) => {
  return (
    <>
      <div className="bg-gray-50 rounded-lg p-3 mb-3">
        <div className="flex items-center space-x-2 mb-2">
          <CreditCard className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Wallet Balance</span>
        </div>
        <div className="text-2xl font-bold text-gray-900 mb-2">
          ${balance.toFixed(2)}
        </div>
        <button 
          onClick={onWithdraw}
          className="w-full bg-green-600 text-white text-sm py-2 px-3 rounded-md hover:bg-green-700 transition-colors"
        >
          Withdraw Now
        </button>
      </div>
      
      {/* Sign Out */}
      <button 
        onClick={onSignOut}
        className="flex items-center space-x-2 w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign out</span>
      </button>
    </>
  )
}

export default WalletSection
