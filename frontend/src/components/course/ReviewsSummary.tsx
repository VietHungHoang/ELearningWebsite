import { Star } from 'lucide-react'
import ReviewCard from './ReviewCard'
import type { Review } from '../../data/course-sample'

interface ReviewsSummaryProps {
  reviews: Review[]
}

const ReviewsSummary = ({ reviews }: ReviewsSummaryProps) => {
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
  const totalReviews = reviews.length

  // Calculate rating breakdown
  const ratingBreakdown = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Rating Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-gray-900 mb-2">{averageRating.toFixed(1)}</div>
              <div className="flex justify-center mb-2">
                {renderStars(Math.round(averageRating))}
              </div>
              <div className="text-sm text-gray-600">Based on {totalReviews} ratings</div>
            </div>
            
            <div className="space-y-2">
              {Object.entries(ratingBreakdown).reverse().map(([rating, count]) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 w-6">{rating}.0</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#134E4A] h-2 rounded-full transition-all duration-300" 
                      style={{ width: count > 0 ? `${(count / totalReviews) * 100}%` : '0%' }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-4">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Review Cards */}
        <div className="lg:col-span-2 space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ReviewsSummary
