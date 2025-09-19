interface MobileMenuButtonProps {
  isOpen: boolean
  onToggle: () => void
}

const MobileMenuButton = ({ isOpen, onToggle }: MobileMenuButtonProps) => {
  return (
    <button
      aria-label="Toggle menu"
      className="md:hidden p-2 -mr-2"
      onClick={onToggle}
    >
      <div className="w-6 h-6 relative">
        <span
          className={`absolute left-0 top-[7px] w-6 h-0.5 bg-gray-700 transition-transform ${
            isOpen ? 'rotate-45' : ''
          }`}
        />
        <span
          className={`absolute left-0 top-[7px] w-6 h-0.5 bg-gray-700 transition-transform ${
            isOpen ? '-rotate-45' : 'translate-y-2'
          }`}
        />
      </div>
    </button>
  )
}

export default MobileMenuButton
