import { useState, useRef, useEffect } from 'react'

const ExploreCourses = () => {
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const carouselRef = useRef(null)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const courses = [
    {
      id: 1,
      category: 'Productivity',
      title: 'Effective Networking: Build Meaningful Connections',
      instructor: {
        name: 'Steven Ford',
        avatar: '/media/homepage/Steven Ford.png'
      },
      lessons: 9,
      language: 'English',
      duration: '9 m',
      price: 258.00,
      originalPrice: null,
      image: '/media/homepage/homepage-laptop.png',
      featured: false
    },
    {
      id: 2,
      category: 'Productivity',
      title: 'Continuous Learning: Embrace Lifelong Education',
      instructor: {
        name: 'Anthony Shao',
        avatar: '/media/homepage/Anthony Shao.png'
      },
      lessons: 9,
      language: 'English',
      duration: '9 m',
      price: 112.14,
      originalPrice: 176.00,
      image: '/media/homepage/talents-img.png',
      featured: true
    },
    {
      id: 3,
      category: 'Productivity',
      title: 'Innovation and Creativity: Think Outside the Box',
      instructor: {
        name: 'Anthony Shao',
        avatar: '/media/homepage/Anthony Shao.png'
      },
      lessons: 9,
      language: 'English',
      duration: '9 m',
      price: 309.00,
      originalPrice: null,
      image: '/media/homepage/homepage-laptop.png',
      featured: false
    },
    {
      id: 4,
      category: 'Productivity',
      title: 'Goal Setting Masterclass: Achieve Your Dreams',
      instructor: {
        name: 'Steven Ford',
        avatar: '/media/homepage/Steven Ford.png'
      },
      lessons: 9,
      language: 'English',
      duration: '8 m',
      price: 134.46,
      originalPrice: 166.00,
      image: '/media/homepage/talents-img.png',
      featured: true
    },
    {
      id: 5,
      category: 'Business',
      title: 'Strategic Planning: Build Your Business Foundation',
      instructor: {
        name: 'Emma Wilson',
        avatar: '/media/homepage/Anthony Shao.png'
      },
      lessons: 12,
      language: 'English',
      duration: '12 m',
      price: 189.00,
      originalPrice: null,
      image: '/media/homepage/homepage-laptop.png',
      featured: false
    },
    {
      id: 6,
      category: 'Technology',
      title: 'AI Fundamentals: Understanding Machine Learning',
      instructor: {
        name: 'David Chen',
        avatar: '/media/homepage/Steven Ford.png'
      },
      lessons: 15,
      language: 'English',
      duration: '15 m',
      price: 299.00,
      originalPrice: 399.00,
      image: '/media/homepage/talents-img.png',
      featured: true
    }
  ]

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || isDragging) return

    const interval = setInterval(() => {
      handleNext()
    }, 4000) // Reduced from 5000ms to 4000ms for smoother experience

    return () => clearInterval(interval)
  }, [currentIndex, isAutoPlaying, isDragging])

  const handleMouseDown = (e) => {
    setIsDragging(true)
    setIsAutoPlaying(false)
    setStartX(e.pageX - carouselRef.current.offsetLeft)
    setScrollLeft(carouselRef.current.scrollLeft)
    carouselRef.current.style.cursor = 'grabbing'
  }

  const handleTouchStart = (e) => {
    setIsDragging(true)
    setIsAutoPlaying(false)
    setStartX(e.touches[0].pageX - carouselRef.current.offsetLeft)
    setScrollLeft(carouselRef.current.scrollLeft)
  }

  const handleMouseUp = () => {
    if (!isDragging) return
    setIsDragging(false)
    carouselRef.current.style.cursor = 'grab'
    
    // Snap to nearest card
    const cardWidth = 320 // Approximate card width including gap
    const scrollPosition = carouselRef.current.scrollLeft
    const nearestCard = Math.round(scrollPosition / cardWidth)
    
    carouselRef.current.scrollTo({
      left: nearestCard * cardWidth,
      behavior: 'smooth'
    })
    
    setCurrentIndex(nearestCard)
    setTimeout(() => setIsAutoPlaying(true), 2000) // Reduced delay for smoother experience
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - carouselRef.current.offsetLeft
    const walk = (x - startX) * 1.5 // Scroll speed multiplier
    carouselRef.current.scrollLeft = scrollLeft - walk
  }

  const handleTouchMove = (e) => {
    if (!isDragging) return
    const x = e.touches[0].pageX - carouselRef.current.offsetLeft
    const walk = (x - startX) * 1.5
    carouselRef.current.scrollLeft = scrollLeft - walk
  }

  const handlePrevious = () => {
    setIsAutoPlaying(false)
    const newIndex = Math.max(0, currentIndex - 1)
    setCurrentIndex(newIndex)
    carouselRef.current.scrollTo({
      left: newIndex * 320, // Adjusted for better spacing
      behavior: 'smooth'
    })
    setTimeout(() => setIsAutoPlaying(true), 2000) // Reduced delay for smoother experience
  }

  const handleNext = () => {
    const maxIndex = Math.max(0, courses.length - 3) // Show 3 cards at a time for better visibility
    const newIndex = Math.min(maxIndex, currentIndex + 1)
    setCurrentIndex(newIndex)
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: newIndex * 320, // Adjusted for better spacing
        behavior: 'smooth'
      })
    }
  }

  const goToSlide = (index) => {
    setIsAutoPlaying(false)
    setCurrentIndex(index)
    carouselRef.current.scrollTo({
      left: index * 320, // Adjusted for better spacing
      behavior: 'smooth'
    })
    setTimeout(() => setIsAutoPlaying(true), 2000) // Reduced delay for smoother experience
  }

  return (
    <section className="py-20 bg-[#faf8f5] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="h-px w-12 bg-gray-300"></div>
            <span className="mx-4 text-gray-600 text-sm font-medium">Explore Our Courses</span>
            <div className="h-px w-12 bg-gray-300"></div>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Achieve More with Expert-Guided Courses
          </h2>
          <p className="max-w-3xl mx-auto text-gray-600 text-lg">
            Discover top-quality courses designed to enhance your skills, boost your career, and help you
            achieve your learning goals. Learn from industry experts at your own pace.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Carousel */}
          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide cursor-grab select-none"
            style={{ 
              scrollBehavior: isDragging ? 'auto' : 'smooth',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
              WebkitScrollbar: { display: 'none' }
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleMouseUp}
            onTouchMove={handleTouchMove}
          >
            {courses.map((course) => (
              <div
                key={course.id}
                className="flex-shrink-0 w-80 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105"
                style={{ userSelect: 'none' }}
              >
                {/* Course Image */}
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    draggable="false"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full">
                    <span className="text-xs font-medium text-gray-700">{course.category}</span>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 text-lg mb-3 line-clamp-2">
                    {course.title}
                  </h3>

                  {/* Instructor */}
                  <div className="flex items-center mb-4">
                    <img
                      src={course.instructor.avatar}
                      alt={course.instructor.name}
                      className="w-8 h-8 rounded-full mr-2"
                      draggable="false"
                    />
                    <span className="text-sm text-gray-600">{course.instructor.name}</span>
                  </div>

                  {/* Course Meta */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      {course.lessons} Lessons
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                      </svg>
                      {course.language}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {course.duration}
                    </span>
                  </div>

                  {/* Price and Enroll */}
                  <div className="flex items-center justify-between">
                    <div>
                      {course.originalPrice ? (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 line-through text-sm">
                            ${course.originalPrice.toFixed(2)}
                          </span>
                          <span className="text-2xl font-bold text-gray-900">
                            ${course.price.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-2xl font-bold text-gray-900">
                          ${course.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <button className="px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors">
                      Enroll
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrevious}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
              currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 hover:shadow-xl'
            }`}
            disabled={currentIndex === 0}
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleNext}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
              currentIndex >= courses.length - 3 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 hover:shadow-xl'
            }`}
            disabled={currentIndex >= courses.length - 3}
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: Math.max(1, courses.length - 2) }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-500 ${
                index === currentIndex
                  ? 'w-8 h-2 bg-[#065A46] rounded-full shadow-lg'
                  : 'w-2 h-2 bg-gray-300 rounded-full hover:bg-[#065A46] hover:scale-125'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ExploreCourses
