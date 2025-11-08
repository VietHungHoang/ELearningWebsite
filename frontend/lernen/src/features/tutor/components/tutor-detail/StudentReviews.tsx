import React, { useState } from 'react';
import { FiStar, FiCheckCircle } from 'react-icons/fi';

const mockReviews = [
    {
        id: 1,
        name: 'Louis J',
        avatar: 'https://picsum.photos/seed/louis/48/48',
        verified: true,
        date: 'Aug 29, 2024',
        rating: 5,
        text: "Cynthia Hunter is a fantastic English tutor who brings clarity and passion to her teaching. Her lessons are engaging and tailored to each student's needs, making complex concepts easy to understand. She is patient, encouraging, and creates a supportive learning environment. I highly recommend her to anyone looking to improve their English skills."
    }
];

const totalReviews = mockReviews.length;
const averageRating = totalReviews > 0 ? mockReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews : 0;
const ratingDistribution = {
    5: mockReviews.filter(r => r.rating === 5).length,
    4: mockReviews.filter(r => r.rating === 4).length,
    3: mockReviews.filter(r => r.rating === 3).length,
    2: mockReviews.filter(r => r.rating === 2).length,
    1: mockReviews.filter(r => r.rating === 1).length,
};


const RatingSummary: React.FC = () => (
    <div className="bg-[#f9f3eb] rounded-2xl p-6 h-full">
        <div className="flex items-center gap-3">
            <p className="text-5xl font-bold text-gray-800">{averageRating.toFixed(1)}</p>
            <div>
                <div className="flex">
                    {[...Array(5)].map((_, i) => <FiStar key={i} className="w-5 h-5 text-yellow-400 fill-current" />)}
                </div>
                <p className="text-sm text-gray-600 mt-1">Based on {totalReviews} rating</p>
            </div>
        </div>
        <div className="border-t border-gray-300/70 my-4"></div>
        <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(star => {
                const count = ratingDistribution[star as keyof typeof ratingDistribution];
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                    <div key={star} className="flex items-center gap-3 text-sm">
                        <p className="font-medium text-gray-700 w-8">{star.toFixed(1)}</p>
                        <div className="flex-grow bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                        </div>
                        <p className="text-gray-500 w-4 text-right">{count}</p>
                    </div>
                );
            })}
        </div>
    </div>
);

const ReviewCard: React.FC<{ review: typeof mockReviews[0] }> = ({ review }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const canTruncate = review.text.length > 200;
    const displayText = isExpanded ? review.text : `${review.text.substring(0, 200)}${canTruncate ? '...' : ''}`;

    return (
        <div>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                        <div className="flex items-center gap-2">
                            <p className="font-bold text-gray-800">{review.name}</p>
                            {review.verified && <FiCheckCircle className="w-4 h-4 text-green-500" />}
                        </div>
                        <p className="text-sm text-gray-500">{review.date}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                     {[...Array(5)].map((_, i) => <FiStar key={i} className="w-4 h-4 text-yellow-400 fill-current" />)}
                    <span className="text-sm font-bold ml-1">{review.rating.toFixed(1)}/5.0</span>
                </div>
            </div>
            <p className="mt-4 text-gray-600 leading-relaxed">
                {displayText}
                {canTruncate && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="ml-1 text-sm font-semibold text-[#0b6459] underline hover:text-[#084c43]"
                    >
                        {isExpanded ? 'Show less' : 'Show more'}
                    </button>
                )}
            </p>
        </div>
    );
};


const StudentReviews: React.FC = () => {
    return (
        <div className="py-8">
            <h2 className="text-2xl font-bold text-gray-800">Student Reviews</h2>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-1">
                    <RatingSummary />
                </div>
                <div className="lg:col-span-2 space-y-8">
                    {mockReviews.map(review => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentReviews;