import type { ApiResponse, Location, Language, Tutor, TutorSearchFilters, PaginatedResponse, Category, Subcategory, FilterData, TutorProfile, UpdateTutorProfileRequest, UploadFileResponse, EducationItem, ExperienceItem, CertificationItem } from '../types/api';
import apiService from './apiService';

// Mock data fallback
const mockTimezones: Location[] = [
  { id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Việt Nam', offset: '+07:00' },
  { id: 'b2c3d4e5-f6a7-8901-bcde-f23456789012', name: 'United States (Eastern)', offset: '-05:00' },
  { id: 'c3d4e5f6-a7b8-9012-cdef-345678901234', name: 'Singapore', offset: '+08:00' },
  { id: 'd4e5f6a7-b8c9-0123-def0-456789012345', name: 'Japan', offset: '+09:00' },
  { id: 'e5f6a7b8-c9d0-1234-ef01-567890123456', name: 'Korea', offset: '+09:00' },
  { id: 'f6a7b8c9-d0e1-2345-f012-678901234567', name: 'Thailand', offset: '+07:00' },
  { id: 'a7b8c9d0-e1f2-3456-0123-789012345678', name: 'Australia (Sydney)', offset: '+10:00' },
  { id: 'b8c9d0e1-f2a3-4567-1234-890123456789', name: 'Canada (Eastern)', offset: '-05:00' },
  { id: 'c9d0e1f2-a3b4-5678-2345-901234567890', name: 'United Kingdom', offset: '+00:00' }
];

const mockLanguages: Language[] = [
  { id: 'd0e1f2a3-b4c5-6789-3456-012345678901', name: 'English', code: 'en' },
  { id: 'e1f2a3b4-c5d6-7890-4567-123456789012', name: 'Vietnamese', code: 'vi' },
  { id: 'f2a3b4c5-d6e7-8901-5678-234567890123', name: 'Japanese', code: 'ja' }
];

const mockCategories: Category[] = [
  { id: 'a3b4c5d6-e7f8-9012-6789-345678901234', name: 'Primary school (Grade 1 to 5)' },
  { id: 'b4c5d6e7-f8a9-0123-7890-456789012345', name: 'Middle School (Grades 6-8)' },
  { id: 'c5d6e7f8-a9b0-1234-8901-567890123456', name: 'High School (Grades 9-10)' },
  { id: 'd6e7f8a9-b0c1-2345-9012-678901234567', name: 'Intermediate (Grades 11-12)' },
  { id: 'e7f8a9b0-c1d2-3456-0123-789012345678', name: "Undergraduate (Bachelor's Degree)" },
  { id: 'f8a9b0c1-d2e3-4567-1234-890123456789', name: "Graduate (Masters degree)" }
];

const mockSubcategories: Subcategory[] = [
  { id: 'a9b0c1d2-e3f4-5678-2345-901234567890', categoryId: 'a3b4c5d6-e7f8-9012-6789-345678901234', name: 'Toán' },
  { id: 'b0c1d2e3-f4a5-6789-3456-012345678901', categoryId: 'a3b4c5d6-e7f8-9012-6789-345678901234', name: 'Vật lý' },
  { id: 'c1d2e3f4-a5b6-7890-4567-123456789012', categoryId: 'a3b4c5d6-e7f8-9012-6789-345678901234', name: 'Hóa học' },
  { id: 'd2e3f4a5-b6c7-8901-5678-234567890123', categoryId: 'a3b4c5d6-e7f8-9012-6789-345678901234', name: 'Sinh học' },
  { id: 'e3f4a5b6-c7d8-9012-6789-345678901234', categoryId: 'a3b4c5d6-e7f8-9012-6789-345678901234', name: 'Văn học' },
  { id: 'f4a5b6c7-d8e9-0123-7890-456789012345', categoryId: 'a3b4c5d6-e7f8-9012-6789-345678901234', name: 'Lịch sử' },
  { id: 'a5b6c7d8-e9f0-1234-8901-567890123456', categoryId: 'a3b4c5d6-e7f8-9012-6789-345678901234', name: 'Địa lý' },
  { id: 'b6c7d8e9-f0a1-2345-9012-678901234567', categoryId: 'a3b4c5d6-e7f8-9012-6789-345678901234', name: 'Giáo dục công dân' },
  { id: 'c7d8e9f0-a1b2-3456-0123-789012345678', categoryId: 'a3b4c5d6-e7f8-9012-6789-345678901234', name: 'Tiếng Anh' }
];

const mockTutors: Tutor[] = [
  {
    id: 'd8e9f0a1-b2c3-4567-1234-890123456789',
    name: 'Cynthia Hunter',
    avatarUrl: 'https://picsum.photos/seed/cynthia/80/80',
    isVerified: true,
    specialization: 'Empowering Students with Customized Learning Support',
    nationalityCode: 'US',
    currentSessionFee: 40.00,
    currency: 'USD',
    averageRating: 5.0,
    reviewCount: 1,
    languages: [{ code: 'EN', level: 'Native' }, { code: 'ES', level: 'Conversational' }],
    categoryIds: ['550e8400-e29b-41d4-a716-446655440002'],
    teachesInGroups: true,
    maxGroupMembers: 5,
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    videoThumbnailUrl: 'https://picsum.photos/seed/video1/400/225',
    bio: 'Hi! I am Cynthia Hunter, a dedicated and experienced tutor with a passion for helping students excel in their academic pursuits. With expertise across a variety of subjects, including mathematics, science, and language arts, I create engaging and personalized learning experiences that cater to each student\'s unique needs and learning style.',
    studentCount: 45,
    sessionDurationMinutes: 120,
    bookedSessionsCount: 156,
    socials: [
      { id: '1', url: 'https://facebook.com/cynthia', platform: 'facebook' },
      { id: '2', url: 'https://twitter.com/cynthia', platform: 'twitter' },
      { id: '3', url: 'https://linkedin.com/in/cynthia', platform: 'linkedin' },
      { id: '4', url: 'https://instagram.com/cynthia', platform: 'instagram' }
    ],
    subjects: [
      { id: '1', name: 'C++', categoryId: 'a3b4c5d6-e7f8-9012-6789-345678901234' },
      { id: '2', name: 'Java', categoryId: 'a3b4c5d6-e7f8-9012-6789-345678901234' },
      { id: '3', name: 'Databases', categoryId: 'a3b4c5d6-e7f8-9012-6789-345678901234' }
    ],
    hasTrialSession: false
  },
  {
    id: 'e9f0a1b2-c3d4-5678-2345-901234567890',
    name: 'Antony Clara',
    avatarUrl: 'https://picsum.photos/seed/antony/80/80',
    isVerified: true,
    specialization: 'Unlocking Potential Through Customized Academic Guidance',
    nationalityCode: 'GB',
    currentSessionFee: 20.00,
    currency: 'GBP',
    averageRating: 5.0,
    reviewCount: 2,
    languages: [{ code: 'EN', level: 'Native' }],
    categoryIds: ['550e8400-e29b-41d4-a716-446655440002'],
    teachesInGroups: false,
    maxGroupMembers: 1,
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    videoThumbnailUrl: 'https://picsum.photos/seed/video2/400/225',
    bio: 'Hello! My name is Antony Clara, and I\'m a passionate tutor dedicated to helping students unlock their full academic potential. With a strong focus on creating engaging learning environments, I specialize in mathematics and science education, helping students build confidence and achieve their academic goals.',
    studentCount: 23,
    sessionDurationMinutes: 90,
    bookedSessionsCount: 89,
    socials: [
      { id: '5', url: 'https://facebook.com/antony', platform: 'facebook' },
      { id: '6', url: 'https://linkedin.com/in/antony', platform: 'linkedin' }
    ],
    subjects: [
      { id: '4', name: 'Python', categoryId: 'a3b4c5d6-e7f8-9012-6789-345678901234' },
      { id: '5', name: 'Web Development', categoryId: 'a3b4c5d6-e7f8-9012-6789-345678901234' }
    ],
    hasTrialSession: true
  },
  {
    id: 'f0a1b2c3-d4e5-6789-3456-012345678901',
    name: 'John Smith',
    avatarUrl: 'https://picsum.photos/seed/john/80/80',
    isVerified: true,
    specialization: 'Mathematics Excellence Through Interactive Learning',
    nationalityCode: 'US',
    currentSessionFee: 35.00,
    currency: 'USD',
    averageRating: 4.8,
    reviewCount: 15,
    languages: [{ code: 'EN', level: 'Native' }, { code: 'ES', level: 'Fluent' }],
    categoryIds: ['550e8400-e29b-41d4-a716-446655440002'],
    teachesInGroups: true,
    maxGroupMembers: 8,
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    videoThumbnailUrl: 'https://picsum.photos/seed/video3/400/225',
    bio: 'Experienced mathematics tutor with 10+ years of teaching experience. I specialize in making complex mathematical concepts accessible and enjoyable for students of all levels. My approach combines traditional teaching methods with modern technology to create an engaging learning experience.',
    studentCount: 127,
    sessionDurationMinutes: 60,
    bookedSessionsCount: 234,
    socials: [
      { id: '7', url: 'https://twitter.com/johnsmith', platform: 'x' },
      { id: '8', url: 'https://instagram.com/johnsmith', platform: 'instagram' }
    ],
    subjects: [
      { id: '6', name: 'Calculus', categoryId: 'a3b4c5d6-e7f8-9012-6789-345678901234' },
      { id: '7', name: 'Algebra', categoryId: 'a3b4c5d6-e7f8-9012-6789-345678901234' }
    ],
    hasTrialSession: false
  },
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    name: 'Sarah Johnson',
    avatarUrl: 'https://picsum.photos/seed/sarah/80/80',
    isVerified: true,
    specialization: 'Science Education Specialist',
    nationalityCode: 'CA',
    currentSessionFee: 45.00,
    currency: 'CAD',
    averageRating: 4.9,
    reviewCount: 8,
    languages: [{ code: 'EN', level: 'Native' }, { code: 'FR', level: 'Fluent' }],
    categoryIds: ['550e8400-e29b-41d4-a716-446655440002'],
    teachesInGroups: false,
    maxGroupMembers: 1,
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    videoThumbnailUrl: 'https://picsum.photos/seed/video4/400/225',
    bio: 'Passionate about making science accessible and exciting for all students. With a background in biology and chemistry, I help students develop a deep understanding of scientific concepts while fostering curiosity and critical thinking skills. I believe in hands-on learning and real-world applications.',
    studentCount: 89,
    sessionDurationMinutes: 75,
    bookedSessionsCount: 178,
    socials: [
      { id: '9', url: 'https://facebook.com/sarahj', platform: 'facebook' }
    ],
    subjects: [
      { id: '8', name: 'Biology', categoryId: 'a3b4c5d6-e7f8-9012-6789-345678901234' },
      { id: '9', name: 'Chemistry', categoryId: 'a3b4c5d6-e7f8-9012-6789-345678901234' }
    ],
    hasTrialSession: true
  },
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-f23456789012',
    name: 'Michael Chen',
    avatarUrl: 'https://picsum.photos/seed/michael/80/80',
    isVerified: false,
    specialization: 'Language Learning Expert',
    nationalityCode: 'CN',
    currentSessionFee: 30.00,
    currency: 'USD',
    averageRating: 4.7,
    reviewCount: 22,
    languages: [{ code: 'EN', level: 'Fluent' }, { code: 'ZH', level: 'Native' }, { code: 'JA', level: 'Intermediate' }],
    categoryIds: ['550e8400-e29b-41d4-a716-446655440002'],
    teachesInGroups: true,
    maxGroupMembers: 10,
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    videoThumbnailUrl: 'https://picsum.photos/seed/video5/400/225',
    bio: 'Native speaker with extensive experience teaching multiple languages. I specialize in immersive language learning techniques that help students achieve fluency quickly and naturally. My teaching philosophy emphasizes cultural understanding alongside linguistic proficiency.',
    studentCount: 156,
    sessionDurationMinutes: 45,
    bookedSessionsCount: 312,
    socials: [
      { id: '10', url: 'https://linkedin.com/in/michaelchen', platform: 'linkedin' },
      { id: '11', url: 'https://youtube.com/michaelchen', platform: 'youtube' }
    ],
    subjects: [
      { id: '10', name: 'English', categoryId: 'a3b4c5d6-e7f8-9012-6789-345678901234' },
      { id: '11', name: 'Mandarin', categoryId: 'a3b4c5d6-e7f8-9012-6789-345678901234' },
      { id: '12', name: 'Japanese', categoryId: 'a3b4c5d6-e7f8-9012-6789-345678901234' }
    ],
    hasTrialSession: false
  }
];

export const tutorService = {
  searchTutors: async (filters: TutorSearchFilters): Promise<ApiResponse<PaginatedResponse<Tutor>>> => {
    try {
      const response = await apiService.get<PaginatedResponse<Tutor>>('/v1/public/search/tutors', filters as Record<string, unknown>);
      return {
        status: response.status,
        success: response.success,
        message: response.message,
        data: response.data
      };
    } catch (error) {
      console.warn('Failed to search tutors from API, using mock data:', error);

      // Simple filtering logic for mock data
      let filtered = [...mockTutors];

      if (filters.minFee !== undefined || filters.maxFee !== undefined) {
        filtered = filtered.filter(tutor => {
          const fee = tutor.currentSessionFee;
          const minOk = filters.minFee === undefined || fee >= filters.minFee;
          const maxOk = filters.maxFee === undefined || fee <= filters.maxFee;
          return minOk && maxOk;
        });
      }

      if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase();
        filtered = filtered.filter(tutor =>
          tutor.name.toLowerCase().includes(keyword) ||
          tutor.specialization.toLowerCase().includes(keyword) ||
          tutor.bio.toLowerCase().includes(keyword)
        );
      }

      // Pagination logic (Java Page<T> standard)
      const pageNumber = (filters.page || 1) - 1; // Convert to 0-based indexing
      const pageSize = filters.limit || 10;
      const totalElements = filtered.length;
      const totalPages = Math.ceil(totalElements / pageSize);
      const offset = pageNumber * pageSize;
      const startIndex = offset;
      const endIndex = startIndex + pageSize;
      const content = filtered.slice(startIndex, endIndex);

      return {
        status: 200,
        success: true,
        message: 'Tutors retrieved successfully (mock data)',
        data: {
          content, // Array of tutors
          pageable: {
            pageNumber, // 0-based page number
            pageSize,
            offset,
            paged: true
          },
          totalPages,
          totalElements,
          last: pageNumber === totalPages - 1,
          first: pageNumber === 0,
          numberOfElements: content.length,
          size: pageSize,
          number: pageNumber, // 0-based page number
          empty: content.length === 0
        }
      };
    }
  },

  getFilterData: async (): Promise<ApiResponse<FilterData>> => {
    return await apiService.get<FilterData>('/v1/public/common/tutor-filter');
  },

  getSubcategories: async (categoryId?: string): Promise<ApiResponse<Subcategory[]>> => {
    try {
      const url = categoryId ? `/subcategories?categoryId=${categoryId}` : '/subcategories';
      return await apiService.get<Subcategory[]>(url);
    } catch (error) {
      console.warn('Failed to fetch subcategories from API, using mock data:', error);
      const data = categoryId
        ? mockSubcategories.filter(sub => sub.categoryId === categoryId)
        : mockSubcategories;

      return {
        status: 200,
        success: true,
        message: 'Subcategories retrieved successfully (mock data)',
        data
      };
    }
  },

  // Profile Management APIs
  getTutorProfile: async (): Promise<ApiResponse<TutorProfile>> => {
    try {
      return await apiService.get<TutorProfile>('/api/v1/tutors/profile');
    } catch (error) {
      console.warn('Failed to fetch tutor profile from API, using mock data:', error);

      // Mock profile data
      const mockProfile: TutorProfile = {
        fullName: 'Sarah Chapman',
        email: 'student@amentotech.com',
        phone: '07123456789',
        gender: 'Female',
        country: 'Afghanistan',
        city: 'Kabul',
        nativeLanguage: { id: 'lang-001', name: 'Georgian', code: 'ka' },
        languages: [
          { id: 'lang-002', name: 'Dutch', code: 'nl' },
          { id: 'lang-003', name: 'English', code: 'en' }
        ],

        headline: 'Certified Math Tutor with 5 years of experience',
        subjects: [
          { id: 's1a2b3c4-d5e6-f7g8-h9i0-j1k2l3m4n5o6', name: 'Mathematics' },
          { id: 's2a3b4c5-d6e7-f8g9-h0i1-j2k3l4m5n6o7', name: 'Physics' }
        ],
        introduction: 'Hi! I am Sarah Chapman, a dedicated and experienced tutor with a passion for helping students excel in their academic pursuits.',

        avatarUrl: 'https://picsum.photos/seed/avatar/200/200',
        introductionVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',

        socialLinks: [
          { id: '1', platform: 'Facebook', url: 'https://facebook.com/sarah.chapman' },
          { id: '2', platform: 'LinkedIn', url: 'https://linkedin.com/in/sarah-chapman' }
        ],

        education: [
          {
            id: '1',
            title: 'Bachelor of Computer Science',
            institution: 'ABC University',
            startDate: '2015-09-01',
            endDate: '2019-06-30',
            location: 'Cacuaco, Angola',
            description: 'Focused on software development and cybersecurity, I build innovative software solutions and...'
          },
          {
            id: '2',
            title: 'Master of Information Technology',
            institution: 'XYZ Institute',
            startDate: '2020-09-01',
            endDate: '2022-06-30',
            location: 'West End, Anguilla',
            description: 'Specialized in advanced IT management and data analysis, I manage complex IT infrastructures and use...'
          }
        ],

        experience: [
          {
            id: '3',
            title: 'Lead Math Tutor',
            institution: 'Lernen Platform',
            startDate: '2022-01-01',
            endDate: undefined, // Ongoing
            location: 'Remote',
            description: 'Provide expert tutoring in advanced mathematics subjects, including calculus and algebra. Develop personalized learning plans that have improved student grades by an average of 25%.'
          }
        ],

        certifications: [
          {
            id: '4',
            name: 'Certified Educator',
            issuingOrganization: 'National Tutoring Association',
            issueDate: '2021-06-15',
            expirationDate: undefined, // No expiration
            credentialId: 'NTA-CE-2021-12345',
            credentialUrl: 'https://nta.org/verify/NTA-CE-2021-12345'
          }
        ]
      };

      return {
        status: 200,
        success: true,
        message: 'Tutor profile retrieved successfully (mock data)',
        data: mockProfile
      };
    }
  },

  updateTutorProfile: async (profileData: UpdateTutorProfileRequest): Promise<ApiResponse<TutorProfile>> => {
    try {
      return await apiService.put<TutorProfile>('/api/v1/tutors/profile', profileData);
    } catch (error) {
      console.warn('Failed to update tutor profile from API, simulating success:', error);

      // Simulate successful update by returning updated mock data
      return {
        status: 200,
        success: true,
        message: 'Tutor profile updated successfully',
        data: {
          fullName: profileData.fullName || 'Sarah Chapman',
          email: 'student@amentotech.com',
          phone: profileData.phone || '07123456789',
          gender: profileData.gender || 'Female',
          country: profileData.country || 'Afghanistan',
          city: profileData.city || 'Kabul',
          nativeLanguage: profileData.nativeLanguage || { id: 'lang-001', name: 'Georgian', code: 'ka' },
          languages: profileData.languages || [
            { id: 'lang-002', name: 'Dutch', code: 'nl' },
            { id: 'lang-003', name: 'English', code: 'en' }
          ],

          headline: profileData.headline || 'Certified Math Tutor with 5 years of experience',
          subjects: profileData.subjects || [
            { id: 's1a2b3c4-d5e6-f7g8-h9i0-j1k2l3m4n5o6', name: 'Mathematics' },
            { id: 's2a3b4c5-d6e7-f8g9-h0i1-j2k3l4m5n6o7', name: 'Physics' }
          ],
          introduction: profileData.introduction || 'Hi! I am Sarah Chapman, a dedicated and experienced tutor...',

          avatarUrl: 'https://picsum.photos/seed/avatar/200/200',
          introductionVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',

          socialLinks: profileData.socialLinks || [
            { id: '1', platform: 'Facebook', url: 'https://facebook.com/sarah.chapman' },
            { id: '2', platform: 'LinkedIn', url: 'https://linkedin.com/in/sarah-chapman' }
          ],

          education: profileData.education || [
            {
              id: '1',
              title: 'Bachelor of Computer Science',
              institution: 'ABC University',
              startDate: '2015-09-01',
              endDate: '2019-06-30',
              location: 'Cacuaco, Angola',
              description: 'Focused on software development and cybersecurity...'
            },
            {
              id: '2',
              title: 'Master of Information Technology',
              institution: 'XYZ Institute',
              startDate: '2020-09-01',
              endDate: '2022-06-30',
              location: 'West End, Anguilla',
              description: 'Specialized in advanced IT management...'
            }
          ],

          experience: profileData.experience || [
            {
              id: '3',
              title: 'Lead Math Tutor',
              institution: 'Lernen Platform',
              startDate: '2022-01-01',
              endDate: undefined,
              location: 'Remote',
              description: 'Provide expert tutoring...'
            }
          ],

          certifications: profileData.certifications || [
            {
              id: '4',
              name: 'Certified Educator',
              issuingOrganization: 'National Tutoring Association',
              issueDate: '2021-06-15',
              expirationDate: undefined,
              credentialId: 'NTA-CE-2021-12345',
              credentialUrl: 'https://nta.org/verify/NTA-CE-2021-12345'
            }
          ]
        }
      };
    }
  },

  uploadProfilePhoto: async (file: File): Promise<ApiResponse<UploadFileResponse>> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      return await apiService.post<UploadFileResponse>('/api/v1/tutors/profile/upload-photo', formData);
    } catch (error) {
      console.warn('Failed to upload profile photo from API, simulating success:', error);

      return {
        status: 200,
        success: true,
        message: 'Profile photo uploaded successfully',
        data: {
          fileUrl: `https://picsum.photos/seed/${file.name}/200/200`,
          fileName: file.name,
          fileSize: file.size
        }
      };
    }
  },

  uploadIntroductionVideo: async (file: File): Promise<ApiResponse<UploadFileResponse>> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      return await apiService.post<UploadFileResponse>('/api/v1/tutors/profile/upload-video', formData);
    } catch (error) {
      console.warn('Failed to upload introduction video from API, simulating success:', error);

      return {
        status: 200,
        success: true,
        message: 'Introduction video uploaded successfully',
        data: {
          fileUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          fileName: file.name,
          fileSize: file.size
        }
      };
    }
  },

  updateResumeHighlights: async (resumeData: { education?: EducationItem[], experience?: ExperienceItem[], certifications?: CertificationItem[] }): Promise<ApiResponse<{ education: EducationItem[], experience: ExperienceItem[], certifications: CertificationItem[] }>> => {
    try {
      return await apiService.put<{ education: EducationItem[], experience: ExperienceItem[], certifications: CertificationItem[] }>('/api/v1/tutors/profile/resume', resumeData);
    } catch (error) {
      console.warn('Failed to update resume highlights from API, simulating success:', error);

      return {
        status: 200,
        success: true,
        message: 'Resume highlights updated successfully',
        data: {
          education: resumeData.education || [],
          experience: resumeData.experience || [],
          certifications: resumeData.certifications || []
        }
      };
    }
  },

  // Onboarding API - Submit tutor onboarding data
  submitOnboarding: async (onboardingData: any): Promise<ApiResponse<{ message: string }>> => {
    try {
      // Call backend API to save onboarding data
      // Backend will save to DB with approved=false (pending admin approval)
      return await apiService.post<{ message: string }>('/api/v1/tutors/onboarding', onboardingData);
    } catch (error) {
      console.warn('Failed to submit onboarding to API, simulating success:', error);

      // Simulate successful submission
      return {
        status: 201,
        success: true,
        message: 'Onboarding data submitted successfully. Pending admin approval.',
        data: {
          message: 'Your tutor profile has been created and is pending admin review. You will be notified once approved.'
        }
      };
    }
  }
};

export const getTutorSchedule = async (tutorId: string, includeBooked: boolean = false): Promise<any[]> => {
  try {
    const response = await apiService.get<any[]>(`/api/v1/tutors/${tutorId}/schedule?includeBooked=${includeBooked}`);
    return response.data;
  } catch (error) {
    console.warn('Failed to fetch tutor schedule from API, using mock data:', error);
    // Mock schedule data for current week (Nov 10-16, 2025)
    const mockSchedule: any[] = [
      {
        tutorId,
        availabilityId: 1,
        dayOfWeek: 1, // Monday (Nov 10)
        startTime: '09:00:00',
        endTime: '12:00:00',
        effectiveStartDate: '2025-11-10',
        effectiveEndDate: '2025-11-16',
        status: 'AVAILABLE'
      },
      {
        tutorId,
        availabilityId: 2,
        dayOfWeek: 2, // Tuesday (Nov 11)
        startTime: '10:00:00',
        endTime: '13:00:00',
        effectiveStartDate: '2025-11-10',
        effectiveEndDate: '2025-11-16',
        status: 'AVAILABLE'
      },
      {
        tutorId,
        availabilityId: 3,
        dayOfWeek: 3, // Wednesday (Nov 12)
        startTime: '14:00:00',
        endTime: '17:00:00',
        effectiveStartDate: '2025-11-10',
        effectiveEndDate: '2025-11-16',
        status: 'AVAILABLE'
      },
      {
        tutorId,
        availabilityId: 4,
        dayOfWeek: 4, // Thursday (Nov 13)
        startTime: '15:00:00',
        endTime: '18:00:00',
        effectiveStartDate: '2025-11-10',
        effectiveEndDate: '2025-11-16',
        status: 'AVAILABLE'
      },
      {
        tutorId,
        availabilityId: 5,
        dayOfWeek: 5, // Friday (Nov 14)
        startTime: '09:00:00',
        endTime: '12:00:00',
        effectiveStartDate: '2025-11-10',
        effectiveEndDate: '2025-11-16',
        status: 'AVAILABLE'
      }
    ];
    return mockSchedule;
  }
};
