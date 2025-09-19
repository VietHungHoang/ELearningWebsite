// Debug utility for testing courses
import { courseApi } from '../services/api'
import { sampleCourses } from '../data/course-sample-data'

export const debugCourses = {
  // Disable API errors for debugging
  disableErrors: () => {
    if (typeof window !== 'undefined') {
      (window as any).disableApiErrors = true
      console.log('✅ API errors disabled for debugging')
    }
  },

  // Enable API errors
  enableErrors: () => {
    if (typeof window !== 'undefined') {
      (window as any).disableApiErrors = false
      console.log('✅ API errors enabled')
    }
  },

  // List all available courses
  listCourses: () => {
    console.log('📚 Available courses:')
    Object.entries(sampleCourses).forEach(([slug, course], index) => {
      console.log(`${index + 1}. "${slug}" -> "${course.title}"`)
    })
    return Object.keys(sampleCourses)
  },

  // Test a specific course
  testCourse: async (slug: string) => {
    console.log(`🧪 Testing course: "${slug}"`)
    
    try {
      // Test direct access
      const directCourse = sampleCourses[slug]
      if (directCourse) {
        console.log('✅ Direct access works:', directCourse.title)
      } else {
        console.log('❌ Direct access failed')
        return false
      }

      // Test API call
      const response = await courseApi.getCourseBySlug(slug)
      if (response.success && response.data) {
        console.log('✅ API call works:', response.data.title)
        return true
      } else {
        console.log('❌ API call failed:', response.message)
        return false
      }
    } catch (error) {
      console.log('❌ Error:', error instanceof Error ? error.message : 'Unknown error')
      return false
    }
  },

  // Test all courses
  testAllCourses: async () => {
    console.log('🧪 Testing all courses...')
    const slugs = Object.keys(sampleCourses)
    const results = []

    for (const slug of slugs) {
      const success = await debugCourses.testCourse(slug)
      results.push({ slug, success })
    }

    const successCount = results.filter(r => r.success).length
    const failCount = results.filter(r => !r.success).length

    console.log(`\n📊 Results: ${successCount} passed, ${failCount} failed`)
    
    if (failCount > 0) {
      console.log('❌ Failed courses:')
      results.filter(r => !r.success).forEach(r => {
        console.log(`  - "${r.slug}"`)
      })
    }

    return results
  },

  // Check for common issues
  checkIssues: () => {
    console.log('🔍 Checking for common issues...')
    
    const slugs = Object.keys(sampleCourses)
    const issues = []

    // Check for missing courses
    slugs.forEach(slug => {
      const course = sampleCourses[slug]
      if (!course) {
        issues.push(`Missing course for slug: ${slug}`)
      } else if (!course.title) {
        issues.push(`Missing title for slug: ${slug}`)
      } else if (!course.slug) {
        issues.push(`Missing slug property for key: ${slug}`)
      } else if (course.slug !== slug) {
        issues.push(`Slug mismatch: key="${slug}" vs course.slug="${course.slug}"`)
      }
    })

    // Check for duplicate slugs
    const courseSlugs = Object.values(sampleCourses).map(c => c.slug)
    const uniqueSlugs = new Set(courseSlugs)
    if (courseSlugs.length !== uniqueSlugs.size) {
      issues.push('Duplicate slugs found')
    }

    if (issues.length === 0) {
      console.log('✅ No issues found')
    } else {
      console.log('❌ Issues found:')
      issues.forEach(issue => console.log(`  - ${issue}`))
    }

    return issues
  }
}

// Make available in browser console
if (typeof window !== 'undefined') {
  (window as any).debugCourses = debugCourses
  console.log('🔧 Debug tools available:')
  console.log('- debugCourses.disableErrors() - Disable API errors')
  console.log('- debugCourses.listCourses() - List all courses')
  console.log('- debugCourses.testCourse("slug") - Test specific course')
  console.log('- debugCourses.testAllCourses() - Test all courses')
  console.log('- debugCourses.checkIssues() - Check for common issues')
}
