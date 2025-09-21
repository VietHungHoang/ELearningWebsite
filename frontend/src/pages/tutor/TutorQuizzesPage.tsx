import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  BookOpen,
  Users,
  Clock,
  Target,
  TrendingUp,
  BarChart3,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import QuizBuilder from '../../components/tutor/quiz/QuizBuilder'
import type { SectionQuiz } from '../../types/quiz'
import { quizApi } from '../../services/quizApi'
import ApiTest from '../../components/debug/ApiTest'

interface Quiz {
  id: string;
  title: string;
  description: string;
  sectionTitle: string;
  courseTitle: string;
  courseId: string;
  sectionId: string;
  status: 'draft' | 'published' | 'archived';
  questions: number;
  passingScore: number;
  timeLimit?: number;
  isActive: boolean;
  attempts: number;
  averageScore: number;
  completionRate: number;
  createdAt: string;
  lastUpdated: string;
  thumbnail?: string;
}

// Mock courses data
const mockCourses = [
  {
    id: 'course-1',
    title: 'Goal Setting Mastery',
    sections: [
      { id: 'section-1', title: 'Introduction to Goal Setting' },
      { id: 'goal-section-2', title: 'Setting and Achieving Your Goals' },
      { id: 'goal-section-3', title: 'Advanced Goal Achievement Strategies' }
    ]
  },
  {
    id: 'course-2',
    title: 'Focus and Concentration',
    sections: [
      { id: 'section-1', title: 'Focus Fundamentals' },
      { id: 'focus-section-2', title: 'Advanced Focus Techniques and Deep Work' }
    ]
  },
  {
    id: 'course-3',
    title: 'Time Management',
    sections: [
      { id: 'section-1', title: 'Time Management Fundamentals' },
      { id: 'time-section-2', title: 'Advanced Time Management Strategies' }
    ]
  },
  {
    id: 'course-4',
    title: 'React Development',
    sections: [
      { id: 'section-1', title: 'React Fundamentals' },
      { id: 'react-section-2', title: 'Advanced React Patterns and State Management' }
    ]
  },
  {
    id: 'course-5',
    title: 'Design Thinking',
    sections: [
      { id: 'section-1', title: 'Design Thinking Fundamentals' },
      { id: 'design-section-2', title: 'Advanced Design Thinking and Implementation' }
    ]
  },
  {
    id: 'course-6',
    title: 'Business Strategy',
    sections: [
      { id: 'section-1', title: 'Business Strategy Fundamentals' },
      { id: 'business-section-2', title: 'Advanced Strategic Planning and Execution' }
    ]
  }
]

const TutorQuizzesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [showQuizBuilder, setShowQuizBuilder] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<SectionQuiz | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load quizzes from API
  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚀 Loading quizzes...');
      
      // Mock tutor ID - in real app, this would come from auth context
      const tutorId = 'tutor-1';
      console.log('👤 Tutor ID:', tutorId);
      
      const quizDtos = await quizApi.getQuizzesByTutorId(tutorId);
      console.log('📚 Quiz DTOs received:', quizDtos);
      
      // Convert QuizDto to Quiz format for display
      const convertedQuizzes: Quiz[] = quizDtos.map(quizDto => ({
        id: quizDto.id || '',
        title: quizDto.title,
        description: quizDto.description || '',
        sectionTitle: getSectionTitle(quizDto.sectionId),
        courseTitle: getCourseTitle(quizDto.courseId),
        courseId: quizDto.courseId,
        sectionId: quizDto.sectionId,
        status: quizDto.isActive ? 'published' : 'draft',
        questions: quizDto.questions?.length || 0,
        passingScore: quizDto.passingScore,
        timeLimit: quizDto.timeLimit,
        isActive: quizDto.isActive,
        attempts: 0, // TODO: Get from quiz attempts API
        averageScore: 0, // TODO: Get from quiz attempts API
        completionRate: 0, // TODO: Get from quiz attempts API
        createdAt: quizDto.createdAt ? new Date(quizDto.createdAt).toISOString().split('T')[0] : '',
        lastUpdated: quizDto.updatedAt ? new Date(quizDto.updatedAt).toISOString().split('T')[0] : '',
        thumbnail: undefined
      }));
      
      console.log('✅ Converted quizzes:', convertedQuizzes);
      setQuizzes(convertedQuizzes);
    } catch (err: any) {
      console.error('❌ Error loading quizzes:', err);
      
      // More detailed error message
      let errorMessage = 'Failed to load quizzes. Please try again.';
      
      if (err.response) {
        // Server responded with error status
        errorMessage = `Server error: ${err.response.status} - ${err.response.statusText}`;
        console.error('Server response:', err.response.data);
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = 'Cannot connect to server. Please check if backend is running.';
        console.error('No response received:', err.request);
      } else {
        // Something else happened
        errorMessage = `Error: ${err.message}`;
        console.error('Error message:', err.message);
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions to get course and section titles
  const getCourseTitle = (courseId: string): string => {
    const course = mockCourses.find(c => c.id === courseId);
    return course?.title || 'Unknown Course';
  };

  const getSectionTitle = (sectionId: string): string => {
    for (const course of mockCourses) {
      const section = course.sections.find(s => s.id === sectionId);
      if (section) return section.title;
    }
    return 'Unknown Section';
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.sectionTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.courseTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || quiz.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return 'Published';
      case 'draft':
        return 'Draft';
      case 'archived':
        return 'Archived';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="w-4 h-4" />;
      case 'draft':
        return <AlertCircle className="w-4 h-4" />;
      case 'archived':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleCreateQuiz = () => {
    setEditingQuiz(null);
    setShowQuizBuilder(true);
  };

  const handleEditQuiz = (quiz: Quiz) => {
    // Convert Quiz to SectionQuiz format for editing
    const sectionQuiz: SectionQuiz = {
      id: quiz.id,
      sectionId: 'section-1',
      courseId: 'course-1',
      tutorId: 'tutor-1',
      title: quiz.title,
      description: quiz.description,
      questions: [],
      passingScore: quiz.passingScore,
      timeLimit: quiz.timeLimit,
      isActive: quiz.isActive,
      createdAt: new Date(quiz.createdAt),
      updatedAt: new Date(quiz.lastUpdated)
    };
    setEditingQuiz(sectionQuiz);
    setShowQuizBuilder(true);
  };

  const handleSaveQuiz = async (quiz: SectionQuiz) => {
    try {
      console.log('Saving quiz:', quiz);
      
      // Find course and section info
      const course = mockCourses.find(c => c.id === quiz.courseId);
      const section = course?.sections.find(s => s.id === quiz.sectionId);
      
      if (!course || !section) {
        console.error('Course or section not found');
        setError('Course or section not found');
        return;
      }

      // Check if editing existing quiz or creating new one
      const existingIndex = quizzes.findIndex(q => q.id === quiz.id);
      
      if (existingIndex >= 0) {
        // Update existing quiz
        const updateData = {
          sectionId: quiz.sectionId,
          courseId: quiz.courseId,
          tutorId: quiz.tutorId,
          title: quiz.title,
          description: quiz.description,
          passingScore: quiz.passingScore,
          timeLimit: quiz.timeLimit,
          isActive: quiz.isActive
        };
        
        console.log('🔄 Updating quiz with data:', updateData);
        const updatedQuizDto = await quizApi.updateQuiz(quiz.id, updateData);
        
        // Convert to display format and update local state
        const updatedQuiz: Quiz = {
          id: updatedQuizDto.id || quiz.id,
          title: updatedQuizDto.title,
          description: updatedQuizDto.description || '',
          sectionTitle: section.title,
          courseTitle: course.title,
          courseId: updatedQuizDto.courseId,
          sectionId: updatedQuizDto.sectionId,
          status: updatedQuizDto.isActive ? 'published' : 'draft',
          questions: quiz.questions.length,
          passingScore: updatedQuizDto.passingScore,
          timeLimit: updatedQuizDto.timeLimit,
          isActive: updatedQuizDto.isActive,
          attempts: quizzes[existingIndex].attempts, // Keep existing attempts
          averageScore: quizzes[existingIndex].averageScore, // Keep existing score
          completionRate: quizzes[existingIndex].completionRate, // Keep existing rate
          createdAt: quizzes[existingIndex].createdAt, // Keep original date
          lastUpdated: new Date().toISOString().split('T')[0],
          thumbnail: undefined
        };
        
        const updatedQuizzes = [...quizzes];
        updatedQuizzes[existingIndex] = updatedQuiz;
        setQuizzes(updatedQuizzes);
      } else {
        // Create new quiz
        const createData = {
          sectionId: quiz.sectionId,
          courseId: quiz.courseId,
          tutorId: 'tutor-1', // Mock tutor ID
          title: quiz.title,
          description: quiz.description,
          passingScore: quiz.passingScore,
          timeLimit: quiz.timeLimit,
          isActive: quiz.isActive
        };
        
        const createdQuizDto = await quizApi.createQuiz(createData);
        
        // Update quiz ID in the quiz object for questions
        quiz.id = createdQuizDto.id || '';
        
        // Convert to display format and add to local state
        const newQuiz: Quiz = {
          id: createdQuizDto.id || '',
          title: createdQuizDto.title,
          description: createdQuizDto.description || '',
          sectionTitle: section.title,
          courseTitle: course.title,
          courseId: createdQuizDto.courseId,
          sectionId: createdQuizDto.sectionId,
          status: createdQuizDto.isActive ? 'published' : 'draft',
          questions: quiz.questions.length,
          passingScore: createdQuizDto.passingScore,
          timeLimit: createdQuizDto.timeLimit,
          isActive: createdQuizDto.isActive,
          attempts: 0,
          averageScore: 0,
          completionRate: 0,
          createdAt: new Date().toISOString().split('T')[0],
          lastUpdated: new Date().toISOString().split('T')[0],
          thumbnail: undefined
        };
        
        setQuizzes(prevQuizzes => [...prevQuizzes, newQuiz]);
      }
      
      // Close quiz builder after creating quiz
      setShowQuizBuilder(false);
      setEditingQuiz(null);
      setError(null);
    } catch (err) {
      console.error('Error saving quiz:', err);
      setError('Failed to save quiz. Please try again.');
    }
  };

  const handlePreviewQuiz = (quiz: SectionQuiz) => {
    console.log('Previewing quiz:', quiz);
  };

  const handlePreviewQuizFromList = (quiz: Quiz) => {
    // Convert Quiz to SectionQuiz format for preview
    const sectionQuiz: SectionQuiz = {
      id: quiz.id,
      sectionId: 'section-1',
      courseId: 'course-1',
      tutorId: 'tutor-1',
      title: quiz.title,
      description: quiz.description,
      questions: [],
      passingScore: quiz.passingScore,
      timeLimit: quiz.timeLimit,
      isActive: quiz.isActive,
      createdAt: new Date(quiz.createdAt),
      updatedAt: new Date(quiz.lastUpdated)
    };
    handlePreviewQuiz(sectionQuiz);
  };

  const handleDeleteQuiz = async (quiz: Quiz) => {
    try {
      console.log('Deleting quiz:', quiz);
      await quizApi.deleteQuiz(quiz.id);
      setQuizzes(prevQuizzes => prevQuizzes.filter(q => q.id !== quiz.id));
      setError(null);
    } catch (err) {
      console.error('Error deleting quiz:', err);
      setError('Failed to delete quiz. Please try again.');
    }
  };

  const handleCancelQuiz = () => {
    setShowQuizBuilder(false);
    setEditingQuiz(null);
  };

  if (showQuizBuilder) {
    return (
      <QuizBuilder
        courses={mockCourses}
        initialQuiz={editingQuiz || undefined}
        onSave={handleSaveQuiz}
        onPreview={handlePreviewQuiz}
        onCancel={handleCancelQuiz}
      />
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading quizzes...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quiz Management</h1>
            <p className="text-gray-600 mt-2">Create, edit, and manage section-based quizzes for your courses.</p>
          </div>
          <button 
            onClick={handleCreateQuiz}
            className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            <span className="font-semibold">Create New Quiz</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
            <p className="text-red-800">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Debug API Test */}
      <ApiTest />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-500 rounded-xl shadow-sm">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-blue-700">Total Quizzes</p>
              <p className="text-3xl font-bold text-blue-900">{quizzes.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-500 rounded-xl shadow-sm">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-green-700">Total Attempts</p>
              <p className="text-3xl font-bold text-green-900">
                {quizzes.reduce((sum, quiz) => sum + quiz.attempts, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm border border-purple-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-purple-500 rounded-xl shadow-sm">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-purple-700">Avg Score</p>
              <p className="text-3xl font-bold text-purple-900">
                {quizzes.filter(q => q.averageScore > 0).length > 0 
                  ? (quizzes.filter(q => q.averageScore > 0).reduce((sum, quiz) => sum + quiz.averageScore, 0) / quizzes.filter(q => q.averageScore > 0).length).toFixed(1)
                  : '0.0'
                }%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-sm border border-orange-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-orange-500 rounded-xl shadow-sm">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-orange-700">Completion Rate</p>
              <p className="text-3xl font-bold text-orange-900">
                {quizzes.filter(q => q.completionRate > 0).length > 0 
                  ? (quizzes.filter(q => q.completionRate > 0).reduce((sum, quiz) => sum + quiz.completionRate, 0) / quizzes.filter(q => q.completionRate > 0).length).toFixed(1)
                  : '0.0'
                }%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between space-y-4 xl:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search quizzes by title, description, course, or section..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white shadow-sm hover:shadow-md transition-shadow"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="score">Highest Score</option>
              <option value="attempts">Most Attempts</option>
            </select>

            <button className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 shadow-sm hover:shadow-md transition-all flex items-center justify-center">
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredQuizzes.map((quiz) => (
          <div key={quiz.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
            {/* Quiz Header */}
            <div className="relative">
              {/* Background Pattern */}
              <div className="h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-x-12"></div>
                
                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1.5 shadow-sm ${getStatusColor(quiz.status)}`}>
                    {getStatusIcon(quiz.status)}
                    <span>{getStatusText(quiz.status)}</span>
                  </span>
                </div>

                {/* Active Status */}
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    quiz.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {quiz.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Quiz Icon */}
                <div className="absolute bottom-3 right-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              {/* Course & Section Info */}
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{quiz.courseTitle}</p>
                    <p className="text-xs text-gray-600 truncate">{quiz.sectionTitle}</p>
                  </div>
                  <div className="ml-2 flex-shrink-0">
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quiz Content */}
            <div className="p-6">
              {/* Title */}
              <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {quiz.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {quiz.description}
              </p>

              {/* Quiz Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center text-blue-600 mb-1">
                    <BookOpen className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Questions</span>
                  </div>
                  <p className="text-xl font-bold text-blue-900">{quiz.questions}</p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="flex items-center text-green-600 mb-1">
                    <Target className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Pass Score</span>
                  </div>
                  <p className="text-xl font-bold text-green-900">{quiz.passingScore}%</p>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="flex items-center text-purple-600 mb-1">
                    <Users className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Attempts</span>
                  </div>
                  <p className="text-xl font-bold text-purple-900">{quiz.attempts.toLocaleString()}</p>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-3">
                  <div className="flex items-center text-orange-600 mb-1">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Time Limit</span>
                  </div>
                  <p className="text-xl font-bold text-orange-900">{quiz.timeLimit || '∞'} min</p>
                </div>
              </div>

              {/* Performance Metrics */}
              {quiz.attempts > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Performance</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{quiz.averageScore.toFixed(1)}%</p>
                      <p className="text-xs text-gray-600">Average Score</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{quiz.completionRate.toFixed(1)}%</p>
                      <p className="text-xs text-gray-600">Completion Rate</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Last Updated */}
              <div className="text-xs text-gray-500 mb-4">
                Last updated: {new Date(quiz.lastUpdated).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleEditQuiz(quiz)}
                  className="flex-1 bg-green-600 text-white py-2.5 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold flex items-center justify-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button 
                  onClick={() => handlePreviewQuizFromList(quiz)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold flex items-center justify-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </button>
                <button 
                  onClick={() => handleDeleteQuiz(quiz)}
                  className="bg-red-100 text-red-600 py-2.5 px-3 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredQuizzes.length === 0 && (
        <div className="text-center py-16">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 max-w-md mx-auto">
            <div className="text-gray-400 mb-6">
              <BookOpen className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {searchTerm ? 'No quizzes found' : 'No quizzes yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? `No quizzes match "${searchTerm}". Try a different search term or clear the filter.`
                : 'Create your first quiz to get started with section-based assessments.'
              }
            </p>
            {!searchTerm && (
              <button 
                onClick={handleCreateQuiz}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center space-x-2 mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" />
                <span className="font-semibold">Create Your First Quiz</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorQuizzesPage