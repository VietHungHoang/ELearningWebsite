import React, { useEffect, useState } from 'react';
import { HiCheckCircle } from 'react-icons/hi';

interface CourseSuccessModalProps {
  isOpen: boolean;
  onNavigate: () => void;
}

const CourseSuccessModal: React.FC<CourseSuccessModalProps> = ({ isOpen, onNavigate }) => {
    const [shouldRender, setShouldRender] = useState(isOpen);

    useEffect(() => {
        if (isOpen) setShouldRender(true);
        else {
            const timer = setTimeout(() => setShouldRender(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!shouldRender) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'bg-black/50 opacity-100' : 'opacity-0'}`}>
            <div className={`bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 text-center transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                <div className="mx-auto w-16 h-16">
                    <HiCheckCircle className="w-16 h-16 text-green-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mt-5">Course Published Successfully!</h2>
                <p className="text-gray-500 mt-2 text-sm">
                    Your new course is now live and available for students to enroll.
                </p>
                <button 
                    onClick={onNavigate}
                    className="mt-6 w-full px-5 py-3 text-sm font-semibold bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43]"
                >
                    Go to My Courses
                </button>
            </div>
        </div>
    );
};

export default CourseSuccessModal;