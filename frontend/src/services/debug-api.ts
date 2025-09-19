// Debug API service to check course data
import { sampleCourses } from '../data/course-sample-data'

export const debugApiService = {
  // List all available course slugs
  listAllSlugs: () => {
    console.log('🔍 Available course slugs:')
    Object.keys(sampleCourses).forEach((slug, index) => {
      const course = sampleCourses[slug]
      console.log(`${index + 1}. "${slug}" -> "${course.title}"`)
    })
    return Object.keys(sampleCourses)
  },

  // Check if a specific slug exists
  checkSlug: (slug: string) => {
    console.log(`🔍 Checking slug: "${slug}"`)
    const course = sampleCourses[slug]
    if (course) {
      console.log('✅ Course found:', course.title)
      return true
    } else {
      console.log('❌ Course not found')
      console.log('Available slugs:', Object.keys(sampleCourses))
      return false
    }
  },

  // Test API service with different slugs
  testApiService: async () => {
    console.log('🧪 Testing API Service...')
    
    const slugs = Object.keys(sampleCourses)
    console.log(`Found ${slugs.length} courses`)
    
    for (const slug of slugs) {
      try {
        console.log(`\nTesting slug: "${slug}"`)
        const course = sampleCourses[slug]
        console.log(`✅ Direct access works: ${course.title}`)
      } catch (error) {
        console.log(`❌ Error with slug "${slug}":`, error)
      }
    }
  },

  // Check for common issues
  checkCommonIssues: () => {
    console.log('🔍 Checking for common issues...')
    
    // Check for undefined/null courses
    Object.entries(sampleCourses).forEach(([slug, course]) => {
      if (!course) {
        console.log(`❌ Course is null/undefined for slug: "${slug}"`)
      } else if (!course.title) {
        console.log(`❌ Course title is missing for slug: "${slug}"`)
      } else if (!course.slug) {
        console.log(`❌ Course slug is missing for slug: "${slug}"`)
      } else if (course.slug !== slug) {
        console.log(`❌ Slug mismatch: key="${slug}" vs course.slug="${course.slug}"`)
      }
    })
    
    // Check for duplicate slugs
    const slugs = Object.values(sampleCourses).map(course => course.slug)
    const uniqueSlugs = new Set(slugs)
    if (slugs.length !== uniqueSlugs.size) {
      console.log('❌ Duplicate slugs found!')
    } else {
      console.log('✅ No duplicate slugs')
    }
    
    console.log('✅ Common issues check completed')
  }
}

// Make available in browser console
if (typeof window !== 'undefined') {
  (window as any).debugApi = debugApiService
  console.log('🔧 Debug API available:')
  console.log('- debugApi.listAllSlugs() - List all course slugs')
  console.log('- debugApi.checkSlug("slug") - Check specific slug')
  console.log('- debugApi.testApiService() - Test all slugs')
  console.log('- debugApi.checkCommonIssues() - Check for common issues')
}
