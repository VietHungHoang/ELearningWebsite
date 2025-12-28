import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { useAuth } from '../../../context/AuthContext';

interface QuizLayoutProps {
    children: React.ReactNode;
    showBackButton?: boolean;
    backPath?: string;
    title?: string;
    fullscreen?: boolean;
}

const QuizLayout: React.FC<QuizLayoutProps> = ({ 
    children, 
    showBackButton = true,
    backPath,
    title,
    fullscreen = false
}) => {
    const navigate = useNavigate();
    const { state } = useAuth();
    
    const isTutor = state.user?.role === 'tutor';
    const defaultBackPath = isTutor ? '/dashboard/quizzes' : '/dashboard/my-quizzes';
    const finalBackPath = backPath || defaultBackPath;

    if (fullscreen) {
        return (
            <div className="h-screen w-full bg-white">
                {children}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Simple Header */}
            {showBackButton && (
                <div className="bg-white border-b border-gray-200 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => navigate(finalBackPath)}
                                    className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <IoArrowBack className="w-5 h-5" />
                                    <span className="text-sm font-medium">Back</span>
                                </button>
                                {title && (
                                    <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {children}
            </main>
        </div>
    );
};

export default QuizLayout;

