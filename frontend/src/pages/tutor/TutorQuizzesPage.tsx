import React, { useState } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Play,
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
  lessonTitle: string;
  courseTitle: string;
  status: 'draft' | 'published' | 'archived';
  questions: number;
  passingScore: number;
  maxAttempts: number;
  timeLimit: number;
  isRequired: boolean;
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

  // Mock data
  const quizzes: Quiz[] = [
    {
      id: '1',
      title: 'Goal Setting Fundamentals Quiz',
      description: 'Test your understanding of goal setting principles and techniques',
      lessonTitle: 'Introduction to Goal Setting',
      courseTitle: 'Goal Setting Masterclass',
      status: 'published',
      questions: 5,
      passingScore: 70,
      maxAttempts: 3,
      timeLimit: 10,
      isRequired: true,
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
      lessonTitle: 'What is Focus and Why It Matters',
      courseTitle: 'Focus and Concentration Boost',
      status: 'published',
      questions: 8,
      passingScore: 75,
      maxAttempts: 2,
      timeLimit: 15,
      isRequired: true,
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
      lessonTitle: 'Understanding Time vs Energy',
      courseTitle: 'Time Management Mastery',
      status: 'draft',
      questions: 6,
      passingScore: 80,
      maxAttempts: 3,
      timeLimit: 12,
      isRequired: false,
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
      lessonTitle: 'Lists and Keys',
      courseTitle: 'React Development Mastery',
      status: 'published',
      questions: 10,
      passingScore: 70,
      maxAttempts: 5,
      timeLimit: 20,
      isRequired: true,
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
      lessonTitle: 'What is Design Thinking?',
      courseTitle: 'Design Thinking for Innovation',
      status: 'archived',
      questions: 7,
      passingScore: 75,
      maxAttempts: 2,
      timeLimit: 15,
      isRequired: true,
      isActive: false,
      attempts: 450,
      averageScore: 81.2,
      completionRate: 92.3,
      createdAt: '2023-12-01',
      lastUpdated: '2023-12-15',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop'
    }
  ];

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.lessonTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Quizzes</h1>
            <p className="text-gray-600 mt-1">Create, edit, and manage quizzes for your lessons.</p>
          </div>
          <button 
            onClick={handleCreateQuiz}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Quiz</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Quizzes</p>
              <p className="text-2xl font-bold text-gray-900">{quizzes.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Attempts</p>
              <p className="text-2xl font-bold text-gray-900">
                {quizzes.reduce((sum, quiz) => sum + quiz.attempts, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {quizzes.filter(q => q.averageScore > 0).length > 0 
                  ? (quizzes.filter(q => q.averageScore > 0).reduce((sum, quiz) => sum + quiz.averageScore, 0) / quizzes.filter(q => q.averageScore > 0).length).toFixed(1)
                  : '0.0'
                }%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="score">Highest Score</option>
              <option value="attempts">Most Attempts</option>
            </select>

            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuizzes.map((quiz) => (
          <div key={quiz.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Quiz Thumbnail */}
            <div className="relative aspect-video overflow-hidden group">
              {quiz.thumbnail ? (
                <img 
                  src={quiz.thumbnail} 
                  alt={quiz.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-blue-400" />
                </div>
              )}
              
              {/* Status Badge */}
              <div className="absolute top-3 left-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(quiz.status)}`}>
                  {getStatusIcon(quiz.status)}
                  <span>{getStatusText(quiz.status)}</span>
                </span>
              </div>

              {/* Actions Menu */}
              <div className="absolute top-3 right-3">
                <button className="p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full">
                  <MoreVertical className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* Play Button Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3">
                  <Play className="w-6 h-6 text-gray-800 ml-1" />
                </button>
              </div>
            </div>

            {/* Quiz Content */}
            <div className="p-4">
              {/* Title */}
              <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
                {quiz.title}
              </h3>

              {/* Course & Lesson Info */}
              <div className="text-sm text-gray-600 mb-2">
                <p className="font-medium">{quiz.courseTitle}</p>
                <p className="text-xs">{quiz.lessonTitle}</p>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {quiz.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <BookOpen className="w-4 h-4 mr-1" />
                  <span>{quiz.questions} questions</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Target className="w-4 h-4 mr-1" />
                  <span>{quiz.passingScore}% pass</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{quiz.attempts.toLocaleString()} attempts</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{quiz.timeLimit} min</span>
                </div>
              </div>

              {/* Performance Stats */}
              {quiz.attempts > 0 && (
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>Avg Score: {quiz.averageScore.toFixed(1)}%</span>
                  <span>Completion: {quiz.completionRate.toFixed(1)}%</span>
                </div>
              )}

              {/* Required/Optional */}
              <div className="flex items-center justify-between mb-4">
                <span className={`text-sm font-medium ${
                  quiz.isRequired ? 'text-red-600' : 'text-gray-700'
                }`}>
                  {quiz.isRequired ? 'Required' : 'Optional'}
                </span>
                <span className="text-sm text-gray-700">
                  Updated {new Date(quiz.lastUpdated).toLocaleDateString()}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleEditQuiz(quiz)}
                  className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  <Edit className="w-4 h-4 inline mr-1" />
                  Edit
                </button>
                <button 
                  onClick={() => handlePreviewQuizFromList(quiz)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  <Eye className="w-4 h-4 inline mr-1" />
                  Preview
                </button>
                <button 
                  onClick={() => handleDeleteQuiz(quiz)}
                  className="bg-red-100 text-red-600 py-2 px-3 rounded-lg hover:bg-red-200 transition-colors"
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
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <BookOpen className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No quizzes found
          </h3>
          <p className="text-gray-600">
            {searchTerm 
              ? `No quizzes match "${searchTerm}". Try a different search term.`
              : 'No quizzes available at the moment.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default TutorQuizzesPage