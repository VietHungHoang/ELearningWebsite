import React from 'react'

interface Testimonial {
  id: number
  text: string
  name: string
  title: string
  profileImage: string
  companyIcon: string
  companyName: string
}

const TestimonialsSection: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      text: "We have tried several tutoring platforms, but none compare to Lernen. The tutors are top-notch, and the booking process is incredibly.",
      name: "Arlene M",
      title: "Agile District",
      profileImage: "/media/homepage/Anthony Shao.png",
      companyIcon: "A",
      companyName: "Agile District"
    },
    {
      id: 2,
      text: "Lernen has been a game-changer for our students. The variety of tutors and the ease of booking sessions make it a breeze for parents and students alike. Our students' grades have improved significantly since we started using this platform.",
      name: "Marvin M",
      title: "Tutoring Specialist",
      profileImage: "/media/homepage/Steven Ford.png",
      companyIcon: "L",
      companyName: "Learning Hub"
    },
    {
      id: 3,
      text: "Lernen is a fantastic resource for our students. The diverse range of tutors ensures that we can find the perfect match for each student's.",
      name: "Devon L",
      title: "Classroom Teacher",
      profileImage: "/media/homepage/Anthony Shao.png",
      companyIcon: "W",
      companyName: "Wisdom Academy"
    },
    {
      id: 4,
      text: "Lernen is a dependable and effective tool for our agency, offering knowledgeable and dedicated tutors.",
      name: "Ronald R",
      title: "Educational Consultant",
      profileImage: "/media/homepage/Steven Ford.png",
      companyIcon: "X",
      companyName: "Xero Education"
    },
    {
      id: 5,
      text: "We're delighted with Lernen its top-notch tutors and user-friendly platform have greatly boosted our students.",
      name: "Courtney H",
      title: "School Counselor",
      profileImage: "/media/homepage/Anthony Shao.png",
      companyIcon: "G",
      companyName: "Growth Learning"
    },
    {
      id: 6,
      text: "Our experience with Lernen has been outstanding. The platform is user-friendly, & the tutors are highly qualified.",
      name: "Darlene R",
      title: "Academic Advisor",
      profileImage: "/media/homepage/Steven Ford.png",
      companyIcon: "E",
      companyName: "EduTech Solutions"
    }
  ]

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className="w-4 h-4 text-yellow-400"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ))
  }

  const getCompanyIconColor = (companyIcon: string) => {
    const colors: { [key: string]: string } = {
      'A': 'bg-blue-500',
      'L': 'bg-blue-400',
      'W': 'bg-blue-500',
      'X': 'bg-blue-300',
      'G': 'bg-green-500',
      'E': 'bg-orange-500'
    }
    return colors[companyIcon] || 'bg-gray-500'
  }

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          {/* Subtitle */}
          <div className="flex items-center justify-center mb-4">
            <div className="h-px bg-[#065A46] flex-1 max-w-20"></div>
            <span className="px-4 text-[#065A46] text-sm font-medium">Real Feedback from Our Clients</span>
            <div className="h-px bg-[#065A46] flex-1 max-w-20"></div>
          </div>
          
          {/* Main Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            What Our Users Are Saying
          </h2>
          
          {/* Description */}
          <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto">
            Discover how Lernen is making a difference in the lives of students and educational institutions. Hear from our satisfied users.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Review Text */}
              <p className="text-gray-700 leading-relaxed mb-4 text-sm">
                "{testimonial.text}"
              </p>
              
              {/* Star Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {renderStars()}
              </div>
              
              {/* Reviewer Information */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Profile Picture */}
                  <img
                    src={testimonial.profileImage}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  
                  {/* Name and Title */}
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{testimonial.name}</h4>
                    <p className="text-gray-600 text-xs">{testimonial.title}</p>
                  </div>
                </div>
                
                {/* Company Icon */}
                <div className={`w-8 h-8 ${getCompanyIconColor(testimonial.companyIcon)} rounded-full flex items-center justify-center`}>
                  <span className="text-white font-bold text-xs">
                    {testimonial.companyIcon}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
