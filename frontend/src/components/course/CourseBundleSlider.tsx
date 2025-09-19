import React, { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import CourseBundleCard from './CourseBundleCard'

interface CourseBundleProps {
  id: string
  title: string
  description: string
  instructor: {
    name: string
    avatar: string
  }
  courseCount: number
  price: number
  originalPrice?: number
  duration: string
  thumbnail: string
  discount?: string
  badgeText?: string
}

interface CourseBundleSliderProps {
  bundles: CourseBundleProps[]
}

const CourseBundleSlider: React.FC<CourseBundleSliderProps> = ({ bundles }) => {
  const sliderRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScrollButtons = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  useEffect(() => {
    checkScrollButtons()
    const slider = sliderRef.current
    if (slider) {
      slider.addEventListener('scroll', checkScrollButtons)
      return () => slider.removeEventListener('scroll', checkScrollButtons)
    }
  }, [])

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: -320, // Width of card + margin
        behavior: 'smooth'
      })
    }
  }

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: 320, // Width of card + margin
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="relative">
      {/* Left Arrow */}
      {canScrollLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 hover:shadow-xl transition-all duration-200 -ml-4"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
      )}

      {/* Right Arrow */}
      {canScrollRight && (
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 hover:shadow-xl transition-all duration-200 -mr-4"
        >
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>
      )}

      {/* Slider Container */}
      <div
        ref={sliderRef}
        className="flex overflow-x-auto scrollbar-hide space-x-0 py-4"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        } as React.CSSProperties}
      >
        {bundles.map((bundle) => (
          <CourseBundleCard key={bundle.id} bundle={bundle} />
        ))}
      </div>
    </div>
  )
}

export default CourseBundleSlider
