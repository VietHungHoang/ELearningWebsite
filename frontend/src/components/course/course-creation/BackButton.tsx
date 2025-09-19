interface BackButtonProps {
  onBack: () => void;
  label?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ onBack, label = "Quay lại" }) => (
  <button
    onClick={onBack}
    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center cursor-pointer"
  >
    <svg
      className="w-4 h-4 mr-2"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </svg>
    {label}
  </button>
);

export default BackButton;
