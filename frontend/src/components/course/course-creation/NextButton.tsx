interface NextButtonProps {
  onNext: () => void;
  disabled?: boolean;
  label?: string; // default "Tiếp theo"
}

const NextButton: React.FC<NextButtonProps> = ({
  onNext,
  disabled = false,
  label = "Tiếp theo",
}) => (
  <button
    onClick={onNext}
    disabled={disabled}
    className="px-8 py-3 bg-[#065A46] text-white rounded-xl font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-[#054A3A] transition-colors flex items-center cursor-pointer"
  >
    {label}
    <svg
      className="w-4 h-4 ml-2"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  </button>
);

export default NextButton;
