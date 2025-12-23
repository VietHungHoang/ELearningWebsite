import React from 'react';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmButtonColor?: 'red' | 'blue' | 'green';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    title,
    message,
    confirmText,
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    confirmButtonColor = 'red'
}) => {
    const [shouldRender, setShouldRender] = React.useState(false);
    const [isAnimating, setIsAnimating] = React.useState(false);

    // Animation effect
    React.useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            // Delay để browser có thời gian render DOM trước khi trigger animation
            setTimeout(() => {
                setIsAnimating(true);
            }, 10);
        } else {
            setIsAnimating(false);
            const timer = setTimeout(() => {
                setShouldRender(false);
            }, 200);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!shouldRender) return null;

    const getConfirmButtonClasses = () => {
        switch (confirmButtonColor) {
            case 'red':
                return 'bg-red-600 text-white rounded-lg hover:bg-red-700';
            case 'blue':
                return 'bg-blue-600 text-white rounded-lg hover:bg-blue-700';
            case 'green':
                return 'bg-green-600 text-white rounded-lg hover:bg-green-700';
            default:
                return 'bg-red-600 text-white rounded-lg hover:bg-red-700';
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Background overlay */}
            <div
                className={`fixed inset-0 bg-black transition-opacity duration-200 ${isAnimating ? 'opacity-50' : 'opacity-0'}`}
                onClick={onCancel}
            />

            {/* Modal content */}
            <div
                className={`bg-white rounded-lg p-6 max-w-md w-full relative z-10 transition-all duration-200 ease-out ${isAnimating ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 ${getConfirmButtonClasses()} transition-colors`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;