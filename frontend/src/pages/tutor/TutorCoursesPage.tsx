import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Play,
  Users,
  Clock,
  Star,
  TrendingUp,
  BarChart3
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  status: 'draft' | 'published' | 'archived';
  students: number;
  rating: number;
  price: number;
  duration: string;
  lessons: number;
  createdAt: string;
  lastUpdated: string;
  revenue: number;
  views: number;
}

const TutorCoursesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // Mock data
  const courses: Course[] = [
    {
      id: '1',
      title: 'React Development Mastery: From Zero to Hero',
      description: 'Master React development from the ground up. Learn modern React patterns, hooks, state management, and build real-world applications.',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop',
      status: 'published',
      students: 1250,
      rating: 4.8,
      price: 299,
      duration: '12h 30m',
      lessons: 25,
      createdAt: '2024-01-15',
      lastUpdated: '2024-01-20',
      revenue: 12500,
      views: 8500
    },
    {
      id: '2',
      title: 'Goal Setting Masterclass: Achieve Your Dreams',
      description: 'Learn the fundamentals of goal setting and achieve your dreams with this comprehensive masterclass.',
      thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=450&fit=crop',
      status: 'published',
      students: 890,
      rating: 4.7,
      price: 89,
      duration: '2h 30m',
      lessons: 8,
      createdAt: '2024-01-10',
      lastUpdated: '2024-01-18',
      revenue: 8900,
      views: 6200
    },
    {
      id: '3',
      title: 'Time Management Mastery: Get More Done',
      description: 'Learn proven time management techniques to maximize your productivity and achieve your goals efficiently.',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop',
      status: 'draft',
      students: 0,
      rating: 0,
      price: 95,
      duration: '2h 15m',
      lessons: 10,
      createdAt: '2024-01-25',
      lastUpdated: '2024-01-25',
      revenue: 0,
      views: 0
    },
    {
      id: '4',
      title: 'Design Thinking for Innovation',
      description: 'Learn the design thinking methodology to solve complex problems and create innovative solutions that users love.',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop',
      status: 'archived',
      students: 450,
      rating: 4.6,
      price: 199,
      duration: '3h 15m',
      lessons: 12,
      createdAt: '2023-12-01',
      lastUpdated: '2023-12-15',
      revenue: 4500,
      views: 3200
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Courses</h1>
            <p className="text-gray-600 mt-1">Create, edit, and manage your courses.</p>
          </div>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Create Course</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Play className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">
                {courses.reduce((sum, course) => sum + course.students, 0).toLocaleString()}
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
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ${courses.reduce((sum, course) => sum + course.revenue, 0).toLocaleString()}
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
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {courses.reduce((sum, course) => sum + course.views, 0).toLocaleString()}
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
              placeholder="Search courses..."
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
              <option value="revenue">Highest Revenue</option>
              <option value="students">Most Students</option>
            </select>

            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Course Thumbnail */}
            <div className="relative aspect-video overflow-hidden group">
              <img 
                src={course.thumbnail} 
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Status Badge */}
              <div className="absolute top-3 left-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                  {getStatusText(course.status)}
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

            {/* Course Content */}
            <div className="p-4">
              {/* Title */}
              <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
                {course.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {course.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{course.students.toLocaleString()} students</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="w-4 h-4 mr-1" />
                  <span>{course.rating > 0 ? course.rating.toFixed(1) : 'No rating'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Play className="w-4 h-4 mr-1" />
                  <span>{course.lessons} lessons</span>
                </div>
              </div>

              {/* Revenue and Views */}
              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <span>Revenue: ${course.revenue.toLocaleString()}</span>
                <span>Views: {course.views.toLocaleString()}</span>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-gray-900">${course.price}</span>
                <span className="text-sm text-gray-500">
                  Updated {new Date(course.lastUpdated).toLocaleDateString()}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                  <Edit className="w-4 h-4 inline mr-1" />
                  Edit
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                  <Eye className="w-4 h-4 inline mr-1" />
                  View
                </button>
                <button className="bg-red-100 text-red-600 py-2 px-3 rounded-lg hover:bg-red-200 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Play className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No courses found
          </h3>
          <p className="text-gray-600">
            {searchTerm 
              ? `No courses match "${searchTerm}". Try a different search term.`
              : 'No courses available at the moment.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default TutorCoursesPage;