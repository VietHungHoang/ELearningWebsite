import React, { useState } from 'react'
import { quizApi } from '../../services/quizApi'

const ApiTest: React.FC = () => {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testApi = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🧪 Testing API...')
      
      // Test 1: Health check
      console.log('1. Testing health endpoint...')
      const healthResponse = await fetch('http://localhost:8081/actuator/health')
      console.log('Health status:', healthResponse.status)
      
      // Test 2: Quiz API
      console.log('2. Testing quiz API...')
      const quizzes = await quizApi.getQuizzesByTutorId('tutor-1')
      console.log('Quizzes received:', quizzes)
      
      setResult({
        health: healthResponse.status,
        quizzes: quizzes,
        timestamp: new Date().toISOString()
      })
      
    } catch (err: any) {
      console.error('❌ API Test Error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">API Test Component</h2>
      
      <button
        onClick={testApi}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test API'}
      </button>
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {result && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <h3 className="font-bold">Test Results:</h3>
          <pre className="mt-2 text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

export default ApiTest
