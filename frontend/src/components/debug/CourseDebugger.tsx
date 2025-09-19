import React, { useState } from 'react'
import { courseApi } from '../../services/api'
import { sampleCourses } from '../../data/course-sample-data'

const CourseDebugger: React.FC = () => {
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testAllCourses = async () => {
    setLoading(true)
    setResults([])
    
    addResult('🧪 Starting course debug test...')
    
    const slugs = Object.keys(sampleCourses)
    addResult(`📚 Found ${slugs.length} courses in data`)
    
    for (const slug of slugs) {
      try {
        addResult(`\n🔍 Testing slug: "${slug}"`)
        
        // Test direct access
        const directCourse = sampleCourses[slug]
        if (directCourse) {
          addResult(`✅ Direct access works: ${directCourse.title}`)
        } else {
          addResult(`❌ Direct access failed for: ${slug}`)
          continue
        }
        
        // Test API call
        try {
          const apiResponse = await courseApi.getCourseBySlug(slug)
          if (apiResponse.success && apiResponse.data) {
            addResult(`✅ API call works: ${apiResponse.data.title}`)
          } else {
            addResult(`❌ API call failed: ${apiResponse.message || 'Unknown error'}`)
          }
        } catch (error) {
          addResult(`❌ API call error: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
        
      } catch (error) {
        addResult(`❌ Error testing ${slug}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }
    
    addResult('\n🎉 Debug test completed!')
    setLoading(false)
  }

  const clearResults = () => {
    setResults([])
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Course Debugger</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Available Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(sampleCourses).map(([slug, course]) => (
              <div key={slug} className="border rounded p-3">
                <div className="font-medium text-sm text-gray-600">Slug:</div>
                <div className="font-mono text-xs bg-gray-100 p-1 rounded mb-2">{slug}</div>
                <div className="font-medium text-sm text-gray-600">Title:</div>
                <div className="text-sm">{course.title}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex space-x-4 mb-4">
            <button
              onClick={testAllCourses}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test All Courses'}
            </button>
            <button
              onClick={clearResults}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Clear Results
            </button>
          </div>
          
          <h3 className="text-lg font-semibold mb-4">Test Results</h3>
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
            {results.length === 0 ? (
              <div className="text-gray-500">Click "Test All Courses" to start debugging...</div>
            ) : (
              results.map((result, index) => (
                <div key={index} className="mb-1">{result}</div>
              ))
            )}
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Debug Instructions</h3>
          <ol className="text-sm text-yellow-700 space-y-1">
            <li>1. Click "Test All Courses" to run the debug test</li>
            <li>2. Check the console for detailed API logs</li>
            <li>3. Look for any courses that fail the API test</li>
            <li>4. Compare the slug format between data and URL</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default CourseDebugger
