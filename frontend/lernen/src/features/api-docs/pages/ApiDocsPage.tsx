import React from 'react';

interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  requestBody?: string;
  responseBody?: string;
  example?: string;
}

const ApiDocsPage: React.FC = () => {
  const apiEndpoints: ApiEndpoint[] = [
    {
      method: 'GET',
      path: '/tutors/filter-data',
      description: 'Lấy dữ liệu bộ lọc cho tutor search (timezones, languages, categories)',
      responseBody: `{
  "timezones": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Việt Nam",
      "offset": "+07:00"
    }
  ],
  "languages": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "English",
      "code": "en"
    }
  ],
  "categories": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "name": "Primary school (Grade 1 to 5)"
    }
  ]
}`,
      example: 'GET /tutors/filter-data'
    },
    {
      method: 'GET',
      path: '/subcategories?categoryId={id}',
      description: 'Lấy danh sách subcategories theo category ID',
      responseBody: `[
  {
    "id": "550e8400-e29b-41d4-a716-446655440003",
    "categoryId": "550e8400-e29b-41d4-a716-446655440002",
    "name": "Toán"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440004",
    "categoryId": "550e8400-e29b-41d4-a716-446655440002",
    "name": "Vật lý"
  }
]`,
      example: 'GET /subcategories?categoryId=550e8400-e29b-41d4-a716-446655440002'
    },
    {
      method: 'POST',
      path: '/tutors/search',
      description: 'Tìm kiếm tutors với các bộ lọc (languages: ngôn ngữ của tutor, timezone: múi giờ)',
      requestBody: `{
  "category": "Mathematics",
  "subcategories": ["Algebra", "Geometry"],
  "languages": ["Vietnam", "Singapore"],
  "minFee": 20,
  "maxFee": 150,
  "sortBy": "rating",
  "timezone": "English",
  "keyword": "experienced",
  "sessionType": "online",
  "page": 1,
  "limit": 10
}`,
      responseBody: `{
  "content": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440005",
      "name": "John Smith",
      "avatarUrl": "https://example.com/avatar.jpg",
      "isVerified": true,
      "specialization": "Mathematics Expert",
      "nationalityCode": "US",
      "currentSessionFee": 35.00,
      "currency": "USD",
      "averageRating": 4.8,
      "reviewCount": 25,
      "languages": ["English", "Spanish"],
      "categoryIds": ["550e8400-e29b-41d4-a716-446655440002"],
      "teachesInGroups": true,
      "maxGroupMembers": 8,
      "videoUrl": "https://example.com/video.mp4",
      "bio": "Experienced mathematics tutor with 10+ years of teaching experience. I specialize in making complex mathematical concepts accessible and enjoyable for students of all levels.",
      "studentCount": 127,
      "bookedSessionsCount": 234
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "offset": 0,
    "paged": true
  },
  "totalPages": 5,
  "totalElements": 50,
  "last": false,
  "first": true,
  "numberOfElements": 10,
  "size": 10,
  "number": 0,
  "empty": false
}`,
      example: 'POST /tutors/search'
    }
  ];

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'POST':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PUT':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'DELETE':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            API Documentation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive documentation for all API endpoints used in the E-Learning platform.
            This documentation covers the latest API implementations including tutor search,
            filtering, and data retrieval functionalities.
          </p>
        </div>

        {/* Tutor Fields Description */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tutor Object Fields</h2>
          <p className="text-gray-700 mb-6">
            The Tutor object contains the following fields:
          </p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li><strong>id</strong> (string): Unique identifier for the tutor</li>
            <li><strong>name</strong> (string): Full name of the tutor</li>
            <li><strong>avatarUrl</strong> (string): URL to the tutor's profile picture</li>
            <li><strong>isVerified</strong> (boolean): Whether the tutor is verified</li>
            <li><strong>specialization</strong> (string): Tutor's area of expertise</li>
            <li><strong>nationalityCode</strong> (string): ISO country code of tutor's nationality</li>
            <li><strong>currentSessionFee</strong> (number): Current fee per session in specified currency</li>
            <li><strong>currency</strong> (string): Currency code (e.g., "USD", "EUR")</li>
            <li><strong>averageRating</strong> (number): Average rating from 1-5</li>
            <li><strong>reviewCount</strong> (number): Total number of reviews</li>
            <li><strong>languages</strong> (string[]): Array of languages the tutor speaks</li>
            <li><strong>categoryIds</strong> (string[]): Array of category IDs the tutor teaches</li>
            <li><strong>teachesInGroups</strong> (boolean): Whether tutor offers group sessions</li>
            <li><strong>maxGroupMembers</strong> (number): Maximum number of students in group sessions</li>
            <li><strong>videoUrl</strong> (string): URL to tutor's introduction video</li>
            <li><strong>bio</strong> (string): Tutor's biography/description</li>
            <li><strong>studentCount</strong> (number): Number of students the tutor has taught</li>
            <li><strong>bookedSessionsCount</strong> (number): Total number of booked sessions by this tutor</li>
          </ul>
        </div>

        {/* API Endpoints */}
        <div className="space-y-8">
          {apiEndpoints.map((endpoint, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              {/* Endpoint Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getMethodColor(endpoint.method)}`}>
                    {endpoint.method}
                  </span>
                  <code className="text-lg font-mono text-gray-900 bg-gray-100 px-3 py-1 rounded">
                    {endpoint.path}
                  </code>
                </div>
              </div>

              {/* Endpoint Content */}
              <div className="p-6">
                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700">{endpoint.description}</p>
                </div>

                {/* Example */}
                {endpoint.example && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Example Request</h3>
                    <div className="bg-gray-100 rounded-lg p-4">
                      <code className="text-sm text-gray-800 font-mono">
                        {endpoint.example}
                      </code>
                    </div>
                  </div>
                )}

                {/* Request Body */}
                {endpoint.requestBody && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Request Body</h3>
                    <div className="bg-gray-100 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm text-gray-800 font-mono whitespace-pre-wrap">
                        {endpoint.requestBody}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Response Body */}
                {endpoint.responseBody && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Response Body</h3>
                    <div className="bg-gray-100 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm text-gray-800 font-mono whitespace-pre-wrap">
                        {endpoint.responseBody}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Need Help?
            </h3>
            <p className="text-blue-700">
              This documentation covers the latest API implementations. For questions or support,
              please contact the development team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDocsPage;