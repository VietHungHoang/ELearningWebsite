import React from "react";
import { FaQuoteLeft } from "react-icons/fa";

export interface Testimonial {
    id: number;
    quote: string;
    name: string;
    role: string;
    avatar: string;
}

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({
    testimonial,
}) => (
    <div className="bg-white p-8 rounded-2xl shadow-sm flex flex-col h-full interactive-card">
        <div className="text-[#0b6459] w-10 h-10 mb-4 flex items-center justify-center">
            <FaQuoteLeft className="w-6 h-6" />
        </div>
        <p className="text-gray-600 italic flex-grow">"{testimonial.quote}"</p>
        <div className="flex items-center mt-6">
            <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full object-cover"
            />
            <div className="ml-4">
                <p className="font-bold text-gray-800">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
            </div>
        </div>
    </div>
);

export default TestimonialCard;
