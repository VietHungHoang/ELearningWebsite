import React from 'react';
import { AiOutlinePlayCircle } from 'react-icons/ai';
import { FiCheck } from 'react-icons/fi';

const tips = [
    'Filter your requirements',
    'Check qualifications and experience',
    'Read reviews and ratings',
    'Evaluate communication skills',
    'Check availability and flexibility',
];

const TipsSidebar: React.FC = () => {
    return (
        <div className="bg-[#f9f3eb] border border-[rgba(219,132,1,0.1)] rounded-2xl shadow-sm p-6 sticky top-8">
            <div className="relative rounded-lg overflow-hidden aspect-video">
                <img src="https://picsum.photos/seed/sidebar/400/225" alt="Tutoring tips" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                    <button className="w-14 h-14 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/50 transition-colors">
                        <AiOutlinePlayCircle className="text-2xl" />
                    </button>
                </div>
            </div>

            <h3 className="text-lg font-bold text-gray-800 mt-6">Tips to find the best Tutor</h3>
            <p className="text-sm text-gray-600 mt-2">
                Choosing the right tutor online requires careful consideration. Here are tips to help you make an informed decision.
            </p>

            <ul className="mt-4 space-y-3">
                {tips.map((tip, index) => (
                    <li key={index} className="flex items-start text-sm">
                        <div className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-green-500">
                           <FiCheck className="w-full h-full" />
                        </div>
                        <span className="text-gray-700">{tip}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TipsSidebar;