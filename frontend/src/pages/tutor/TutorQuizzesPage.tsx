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

  // Mock data
  const initialQuizzes: Quiz[] = [
    {
      id: '1',
      title: 'Goal Setting Fundamentals Quiz',
      description: 'Test your understanding of goal setting principles and techniques',
      sectionTitle: 'Introduction to Goal Setting',
      courseTitle: 'Goal Setting Masterclass',
      courseId: 'course-1',
      sectionId: 'section-1',
      status: 'published',
      questions: 5,
      passingScore: 70,
      timeLimit: 10,
      isActive: true,
      attempts: 1250,
      averageScore: 78.5,
      completionRate: 85.2,
      createdAt: '2024-01-15',
      lastUpdated: '2024-01-20',
      thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=450&fit=crop'
    },
    {
      id: '2',
      title: 'Focus and Concentration Quiz',
      description: 'Test your knowledge of focus techniques and concentration methods',
      sectionTitle: 'Focus Fundamentals',
      courseTitle: 'Focus and Concentration Boost',
      courseId: 'course-2',
      sectionId: 'section-1',
      status: 'published',
      questions: 8,
      passingScore: 75,
      timeLimit: 15,
      isActive: true,
      attempts: 890,
      averageScore: 82.3,
      completionRate: 91.5,
      createdAt: '2024-01-10',
      lastUpdated: '2024-01-18',
      thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop'
    },
    {
      id: '3',
      title: 'Time Management Basics Quiz',
      description: 'Test your understanding of time management concepts and tools',
      sectionTitle: 'Time Management Fundamentals',
      courseTitle: 'Time Management Mastery',
      courseId: 'course-3',
      sectionId: 'section-1',
      status: 'draft',
      questions: 6,
      passingScore: 80,
      timeLimit: 12,
      isActive: false,
      attempts: 0,
      averageScore: 0,
      completionRate: 0,
      createdAt: '2024-01-25',
      lastUpdated: '2024-01-25',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop'
    },
    {
      id: '4',
      title: 'React Fundamentals Quiz',
      description: 'Test your knowledge of React basics and component lifecycle',
      sectionTitle: 'React Fundamentals',
      courseTitle: 'React Development Mastery',
      courseId: 'course-4',
      sectionId: 'section-1',
      status: 'published',
      questions: 10,
      passingScore: 70,
      timeLimit: 20,
      isActive: true,
      attempts: 2100,
      averageScore: 76.8,
      completionRate: 88.7,
      createdAt: '2024-01-08',
      lastUpdated: '2024-01-22',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop'
    },
    {
      id: '5',
      title: 'Design Thinking Process Quiz',
      description: 'Test your understanding of design thinking methodology',
      sectionTitle: 'Design Thinking Fundamentals',
      courseTitle: 'Design Thinking for Innovation',
      courseId: 'course-5',
      sectionId: 'section-1',
      status: 'archived',
      questions: 7,
      passingScore: 75,
      timeLimit: 15,
      isActive: false,
      attempts: 450,
      averageScore: 81.2,
      completionRate: 92.3,
      createdAt: '2023-12-01',
      lastUpdated: '2023-12-15',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop'
    }
  ];

  // Initialize quizzes on component mount
  useEffect(() => {
    setQuizzes(initialQuizzes);
  }, []);

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

  const handleSaveQuiz = (quiz: SectionQuiz) => {
    console.log('Saving quiz:', quiz);
    
    // Find course and section info
    const course = mockCourses.find(c => c.id === quiz.courseId);
    const section = course?.sections.find(s => s.id === quiz.sectionId);
    
    if (!course || !section) {
      console.error('Course or section not found');
      return;
    }

    // Convert SectionQuiz to Quiz format
    const newQuiz: Quiz = {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description || '',
      sectionTitle: section.title,
      courseTitle: course.title,
      courseId: quiz.courseId,
      sectionId: quiz.sectionId,
      status: 'published',
      questions: quiz.questions.length,
      passingScore: quiz.passingScore,
      timeLimit: quiz.timeLimit,
      isActive: quiz.isActive,
      attempts: 0,
      averageScore: 0,
      completionRate: 0,
      createdAt: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      thumbnail: undefined
    };

    // Check if editing existing quiz or creating new one
    const existingIndex = quizzes.findIndex(q => q.id === quiz.id);
    
    if (existingIndex >= 0) {
      // Update existing quiz
      const updatedQuizzes = [...quizzes];
      updatedQuizzes[existingIndex] = newQuiz;
      setQuizzes(updatedQuizzes);
    } else {
      // Add new quiz
      setQuizzes(prevQuizzes => [...prevQuizzes, newQuiz]);
    }
    
    setShowQuizBuilder(false);
    setEditingQuiz(null);
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

  const handleDeleteQuiz = (quiz: Quiz) => {
    console.log('Deleting quiz:', quiz);
    setQuizzes(prevQuizzes => prevQuizzes.filter(q => q.id !== quiz.id));
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