interface ErrorScreenProps {
  error: string
  slug?: string
  onBackToCourses: () => void
}

const ErrorScreen = ({ error, slug, onBackToCourses }: ErrorScreenProps) => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <div className="text-6xl mb-4">📚</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        {slug && <p className="text-sm text-gray-500 mb-4">Slug: {slug}</p>}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Please check the course URL or go back to browse available courses.</p>
        </div>
        <button
          onClick={onBackToCourses}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Back to Courses
        </button>
      </div>
    </div>
  )
}

export default ErrorScreen
