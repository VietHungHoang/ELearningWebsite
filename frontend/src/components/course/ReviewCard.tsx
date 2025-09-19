import { useState } from 'react'
import { Star } from 'lucide-react'
import type { Review } from '../../data/course-sample'

interface ReviewCardProps {
  review: Review
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  const [showMore, setShowMore] = useState(false)
  const maxLength = 200

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
      <div className="flex items-start gap-3">
        <img
          src={review.reviewerAvatar}
          alt={review.reviewerName}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-medium text-gray-900">{review.reviewerName}</h4>
            <div className="flex">
              {renderStars(review.rating)}
            </div>
            <span className="text-sm text-gray-500">{review.date}</span>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {showMore || review.review.length <= maxLength
              ? review.review
              : review.review.substring(0, maxLength) + '...'
            }
            {review.review.length > maxLength && (
              <button
                onClick={() => setShowMore(!showMore)}
                className="text-[#134E4A] hover:text-[#0F3A36] font-medium ml-1 transition-colors"
              >
                {showMore ? 'Show less' : 'Show more'}
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ReviewCard
