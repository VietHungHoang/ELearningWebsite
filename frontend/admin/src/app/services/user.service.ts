import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Tutor, TutorDetail, Student, StudentDetail, InstructorRequest, InstructorRequestDetail, PaginatedResponse, InstructorRequestBackend, mapBackendToInstructorRequest } from '../types/index';

export type { Tutor, TutorDetail, Student, StudentDetail, InstructorRequest, InstructorRequestDetail } from '../types/index';
export type Instructor = TutorDetail;
export type InstructorListItem = Tutor;


@Injectable({
    providedIn: 'root'
})
export class UserService {
    private instructorsSubject = new BehaviorSubject<Tutor[]>([]);
    public instructors$ = this.instructorsSubject.asObservable();

    private studentsSubject = new BehaviorSubject<Student[]>([]);
    public students$ = this.studentsSubject.asObservable();

    private instructorRequestsSubject = new BehaviorSubject<InstructorRequest[]>([]);
    public instructorRequests$ = this.instructorRequestsSubject.asObservable();

    // Cache full TutorResponse data từ API list để dùng cho detail
    private tutorsFullDataCache = new Map<string, any>();

    // Cache full StudentResponse data từ API list để dùng cho detail
    private studentsFullDataCache = new Map<string, any>();

    // Cache data để dùng làm mock
    private mockTutors: Tutor[] = [];
    private mockTutorsDetail: TutorDetail[] = [];
    private mockStudents: Student[] = [];
    private mockStudentsDetail: StudentDetail[] = [];
    private mockInstructorRequests: InstructorRequest[] = [];
    private mockInstructorRequestsDetail: InstructorRequestDetail[] = [];

    constructor(private apiService: ApiService) {
        this.loadMockData();
    }

    private loadMockData(): void {
        // Mock data đầy đủ (TutorDetail) - dùng cho getTutorDetail()
        const mockTutorsDetail: TutorDetail[] = [
            {
                id: '550e8400-e29b-41d4-a716-446655440001',
                name: 'Nguyễn Văn Hùng',
                email: 'nguyen.van.hung@example.com',

                avatarUrl: 'images/users/user6.jpg',
                countryCode: 'US',
                joinDate: '15 Jan 2023',
                totalStudents: 1000,
                rating: 4.7,
                experience: 12,
                timezone: 'America/New_York',
                languages: [
                    { languageCode: 'en', isNative: true },
                    { languageCode: 'es', isNative: false },
                    { languageCode: 'fr', isNative: false },
                    { languageCode: 'de', isNative: false }
                ],
                subjects: [
                    { categoryId: 'tech', subjectName: 'Công nghệ' },
                    { categoryId: 'cyber', subjectName: 'An ninh mạng' },
                    { categoryId: 'cloud', subjectName: 'Điện toán đám mây' },
                    { categoryId: 'network', subjectName: 'Mạng máy tính' }
                ],
                instructorLevel: ['PRO', 'MST'],
                isVerified: true,
                currentSessionFee: 75,
                classes: [
                    { id: '550e8400-e29b-41d4-a716-446655440101', title: 'An ninh mạng Nâng cao Cơ bản', enrollmentCount: 245, rating: 4.8, pricePerHour: 50, classType: 'ONE_ON_ONE' },
                    { id: '550e8400-e29b-41d4-a716-446655440102', title: 'Kiểm thử Xâm nhập Mạng', enrollmentCount: 189, rating: 4.7, pricePerHour: 60, classType: 'SMALL_GROUP' },
                    { id: '550e8400-e29b-41d4-a716-446655440103', title: 'Bảo mật Đám mây cho Doanh nghiệp', enrollmentCount: 156, rating: 4.9, pricePerHour: 75, classType: 'LARGE_GROUP' },
                    { id: '550e8400-e29b-41d4-a716-446655440104', title: 'Mật mã học Cơ bản', enrollmentCount: 312, rating: 4.6, pricePerHour: 45, classType: 'ONE_ON_ONE' },
                    { id: '550e8400-e29b-41d4-a716-446655440105', title: 'Chiến lược Phản ứng Sự cố', enrollmentCount: 98, rating: 4.5, pricePerHour: 65, classType: 'SMALL_GROUP' }
                ],
                certifications: [
                    { id: 'cert-550e8400-e29b-41d4-a716-446655440001', name: 'CISSP Certificate', issuingOrganization: 'ISC2', issueDate: '2022-01-15', expirationDate: '2025-01-15', credentialId: 'CISSP-20220115-001', credentialUrl: 'https://example.com/files/cissp_cert.pdf' },
                    { id: 'cert-550e8400-e29b-41d4-a716-446655440002', name: 'CEH Certificate', issuingOrganization: 'EC-Council', issueDate: '2021-06-20', expirationDate: '2024-06-20', credentialId: 'CEH-20210620-002', credentialUrl: 'https://example.com/files/ceh_cert.pdf' },
                    { id: 'cert-550e8400-e29b-41d4-a716-446655440003', name: 'CompTIA Security+ Certificate', issuingOrganization: 'CompTIA', issueDate: '2020-12-10', expirationDate: '2023-12-10', credentialId: 'SEC+-20201210-003', credentialUrl: 'https://example.com/files/comptia_security_cert.pdf' }
                ],
                totalReviews: 2847,
                totalHours: 45,
                headline: 'Chuyên gia An ninh mạng | Chứng chỉ CISSP & CEH | Hơn 12 năm Kinh nghiệm',
                introduction: 'Xin chào! Tôi là Nguyễn Văn Hùng, một chuyên gia an ninh mạng đầy đam mê với hơn 12 năm kinh nghiệm trong lĩnh vực này.',
                videoUrl: 'https://media-cdn.example.com/videos/oliver-intro.mp4',
                videoThumbnailUrl: 'https://media-cdn.example.com/thumbnails/oliver-intro.jpg',
                socialLinks: [
                    { id: 'social-oliver-1', platform: 'linkedin', url: 'https://linkedin.com/in/oliver-khan' },
                    { id: 'social-oliver-2', platform: 'twitter', url: 'https://twitter.com/oliverkhan' },
                    { id: 'social-oliver-3', platform: 'github', url: 'https://github.com/oliverkhan' }
                ],
                careerEntries: [
                    { id: 'career-oliver-1', type: 'EDUCATION', title: 'Master of Science in Cybersecurity', institution: 'Stanford University', startDate: '2009-09', endDate: '2011-05', location: 'Stanford, CA', description: 'Specialized in network security and cryptography' },
                    { id: 'career-oliver-2', type: 'EDUCATION', title: 'Bachelor of Science in Computer Science', institution: 'MIT', startDate: '2005-09', endDate: '2009-05', location: 'Cambridge, MA', description: 'Strong foundation in computer systems and security fundamentals' },
                    { id: 'career-oliver-3', type: 'EXPERIENCE', title: 'Senior Security Architect', institution: 'Google Cloud', startDate: '2018-06', endDate: '', location: 'Mountain View, CA', description: 'Led security architecture for enterprise clients, implemented zero-trust security models' },
                    { id: 'career-oliver-4', type: 'EXPERIENCE', title: 'Security Engineer', institution: 'Cisco Systems', startDate: '2014-01', endDate: '2018-05', location: 'San Jose, CA', description: 'Designed and implemented network security solutions for Fortune 500 companies' },
                    { id: 'career-oliver-5', type: 'EXPERIENCE', title: 'Junior Security Analyst', institution: 'IBM', startDate: '2011-07', endDate: '2013-12', location: 'Armonk, NY', description: 'Monitored security threats and conducted vulnerability assessments' }
                ],
                availableSchedule: {
                    monday: ['09:00 AM - 11:00 AM', '02:00 PM - 04:00 PM'],
                    tuesday: ['10:00 AM - 12:00 PM', '03:00 PM - 05:00 PM'],
                    wednesday: ['09:00 AM - 11:00 AM'],
                    thursday: ['02:00 PM - 04:00 PM', '06:00 PM - 08:00 PM'],
                    friday: ['09:00 AM - 12:00 PM'],
                    saturday: ['10:00 AM - 01:00 PM'],
                    sunday: []
                }
            },
            {
                id: '550e8400-e29b-41d4-a716-446655440002',
                name: 'Trần Thị Lan',
                email: 'tran.thi.lan@example.com',
                avatarUrl: 'images/users/user7.jpg',
                countryCode: 'CA',

                joinDate: '20 Mar 2023',
                totalStudents: 1200,
                rating: 4.75,
                experience: 10,
                timezone: 'UTC-5',
                languages: [
                    { languageCode: 'en', isNative: true },
                    { languageCode: 'fr', isNative: true },
                    { languageCode: 'es', isNative: false }
                ],
                subjects: [
                    { categoryId: 'tech', subjectName: 'Công nghệ' },
                    { categoryId: 'python', subjectName: 'Python' },
                    { categoryId: 'data', subjectName: 'Khoa học Dữ liệu' },
                    { categoryId: 'ml', subjectName: 'Học máy' },
                    { categoryId: 'web', subjectName: 'Phát triển Web' }
                ],
                instructorLevel: ['PRO', 'SNR'],
                isVerified: true,
                currentSessionFee: 70,
                classes: [
                    { id: '550e8400-e29b-41d4-a716-446655440201', title: 'Python cho Khoa học Dữ liệu', enrollmentCount: 567, rating: 4.9, pricePerHour: 55, classType: 'LARGE_GROUP' },
                    { id: '550e8400-e29b-41d4-a716-446655440202', title: 'Phát triển Web Full Stack', enrollmentCount: 423, rating: 4.8, pricePerHour: 65, classType: 'LARGE_GROUP' },
                    { id: '550e8400-e29b-41d4-a716-446655440203', title: 'Django REST Framework', enrollmentCount: 234, rating: 4.7, pricePerHour: 60, classType: 'SMALL_GROUP' },
                    { id: '550e8400-e29b-41d4-a716-446655440204', title: 'Học máy với Python', enrollmentCount: 345, rating: 4.8, pricePerHour: 70, classType: 'LARGE_GROUP' },
                    { id: '550e8400-e29b-41d4-a716-446655440205', title: 'Thiết kế Cơ sở dữ liệu', enrollmentCount: 289, rating: 4.6, pricePerHour: 55, classType: 'SMALL_GROUP' },
                    { id: '550e8400-e29b-41d4-a716-446655440206', title: 'Phát triển FastAPI Hiện đại', enrollmentCount: 167, rating: 4.7, pricePerHour: 60, classType: 'SMALL_GROUP' },
                    { id: '550e8400-e29b-41d4-a716-446655440207', title: 'Kiểm thử trong Python', enrollmentCount: 198, rating: 4.5, pricePerHour: 50, classType: 'ONE_ON_ONE' },
                    { id: '550e8400-e29b-41d4-a716-446655440208', title: 'Docker & Kubernetes', enrollmentCount: 276, rating: 4.8, pricePerHour: 75, classType: 'SMALL_GROUP' }
                ],

                totalReviews: 4156,
                totalHours: 72,
                headline: 'Python & Full Stack Developer | Chuyên gia Học máy | Hơn 10 năm trong Công nghệ',
                introduction: 'Xin chào! Tôi là Trần Thị Lan, một nhà phát triển full-stack và người đam mê học máy với một thập kỷ kinh nghiệm trong ngành công nghệ.',
                videoUrl: 'https://media-cdn.example.com/videos/ava-intro.mp4',
                videoThumbnailUrl: 'https://media-cdn.example.com/thumbnails/ava-intro.jpg',
                socialLinks: [
                    { id: 'social-ava-1', platform: 'linkedin', url: 'https://linkedin.com/in/ava-cooper' },
                    { id: 'social-ava-2', platform: 'github', url: 'https://github.com/avacooper' },
                    { id: 'social-ava-3', platform: 'twitter', url: 'https://twitter.com/avacooper' },
                    { id: 'social-ava-4', platform: 'instagram', url: 'https://instagram.com/avacooper' }
                ],
                careerEntries: [
                    { id: 'career-ava-1', type: 'EDUCATION', title: 'Master of Science in Data Science', institution: 'UC Berkeley', startDate: '2014-09', endDate: '2016-05', location: 'Berkeley, CA', description: 'Advanced machine learning and statistical analysis' },
                    { id: 'career-ava-2', type: 'EDUCATION', title: 'Bachelor of Science in Mathematics', institution: 'Toronto University', startDate: '2010-09', endDate: '2014-05', location: 'Toronto, Canada', description: 'Strong mathematical foundation for data science' },
                    { id: 'career-ava-3', type: 'EXPERIENCE', title: 'Lead Data Scientist', institution: 'Meta (Facebook)', startDate: '2018-03', endDate: '', location: 'Menlo Park, CA', description: 'Led ML teams for recommendation algorithms and user engagement features' },
                    { id: 'career-ava-4', type: 'EXPERIENCE', title: 'Data Scientist', institution: 'Airbnb', startDate: '2016-07', endDate: '2018-02', location: 'San Francisco, CA', description: 'Built predictive models for pricing and demand forecasting' },
                    { id: 'career-ava-5', type: 'EXPERIENCE', title: 'Junior Data Analyst', institution: 'Deloitte', startDate: '2014-06', endDate: '2016-06', location: 'Toronto, Canada', description: 'Data analysis for consulting projects and business intelligence' }
                ],
                availableSchedule: {
                    monday: ['08:00 AM - 10:00 AM'],
                    tuesday: ['02:00 PM - 05:00 PM'],
                    wednesday: ['10:00 AM - 12:00 PM', '04:00 PM - 06:00 PM'],
                    thursday: ['08:00 AM - 10:00 AM', '01:00 PM - 03:00 PM'],
                    friday: ['10:00 AM - 01:00 PM'],
                    saturday: ['09:00 AM - 11:00 AM', '02:00 PM - 04:00 PM'],
                    sunday: ['03:00 PM - 05:00 PM']
                }
            },
            {
                id: '550e8400-e29b-41d4-a716-446655440003',
                name: 'Lê Minh Tuấn',
                email: 'le.minh.tuan@example.com',
                avatarUrl: 'images/users/user8.jpg',
                countryCode: 'GB',
                joinDate: '10 May 2023',
                totalStudents: 890,
                rating: 4.65,
                experience: 8,
                timezone: 'UTC-5',
                languages: [{ languageCode: 'en', isNative: true }],
                subjects: [{ categoryId: 'tech', subjectName: 'Công nghệ' }],
                instructorLevel: ['PRO'],
                isVerified: true,
                currentSessionFee: 60,
                classes: [
                    { id: '550e8400-e29b-41d4-a716-446655440301', title: 'Tiếp thị Số Cơ bản', enrollmentCount: 421, rating: 4.7, pricePerHour: 45, classType: 'LARGE_GROUP' },
                    { id: '550e8400-e29b-41d4-a716-446655440302', title: 'Thành thạo SEO 2024', enrollmentCount: 356, rating: 4.8, pricePerHour: 55, classType: 'LARGE_GROUP' },
                    { id: '550e8400-e29b-41d4-a716-446655440303', title: 'Chiến lược Mạng xã hội', enrollmentCount: 234, rating: 4.6, pricePerHour: 50, classType: 'SMALL_GROUP' },
                    { id: '550e8400-e29b-41d4-a716-446655440304', title: 'Tiếp thị Nội dung Xuất sắc', enrollmentCount: 278, rating: 4.7, pricePerHour: 52, classType: 'LARGE_GROUP' },
                    { id: '550e8400-e29b-41d4-a716-446655440305', title: 'Tự động hóa Chiến dịch Email', enrollmentCount: 145, rating: 4.5, pricePerHour: 48, classType: 'SMALL_GROUP' },
                    { id: '550e8400-e29b-41d4-a716-446655440306', title: 'Phân tích & Theo dõi ROI', enrollmentCount: 189, rating: 4.6, pricePerHour: 60, classType: 'ONE_ON_ONE' }
                ],

                certifications: [
                    { id: 'cert-550e8400-e29b-41d4-a716-446655440004', name: 'Google Analytics Certificate', issuingOrganization: 'Google', issueDate: '2023-03-10', expirationDate: '2026-03-10', credentialId: 'GA-20230310-004', credentialUrl: 'https://example.com/files/google_analytics_cert.pdf' },
                    { id: 'cert-550e8400-e29b-41d4-a716-446655440005', name: 'HubSpot Inbound Certificate', issuingOrganization: 'HubSpot', issueDate: '2022-11-15', expirationDate: '2025-11-15', credentialId: 'HubSpot-20221115-005', credentialUrl: 'https://example.com/files/hubspot_cert.pdf' },
                    { id: 'cert-550e8400-e29b-41d4-a716-446655440006', name: 'Facebook Blueprint Certificate', issuingOrganization: 'Facebook', issueDate: '2022-08-20', expirationDate: '2024-08-20', credentialId: 'FB-20220820-006', credentialUrl: 'https://example.com/files/facebook_blueprint_cert.pdf' }
                ],
                totalReviews: 3923,
                totalHours: 38,
                headline: 'Chuyên gia Tiếp thị Số | Chứng chỉ Google & HubSpot | Chuyên gia SEO & Nội dung',
                introduction: 'Xin chào! Tôi là Lê Minh Tuấn, một chiến lược gia tiếp thị số với kinh nghiệm sâu rộng về SEO, tiếp thị nội dung và quảng cáo mạng xã hội.',
                videoUrl: 'https://media-cdn.example.com/videos/james-intro.mp4',
                videoThumbnailUrl: 'https://media-cdn.example.com/thumbnails/james-intro.jpg',
                socialLinks: [
                    { id: 'social-james-1', platform: 'linkedin', url: 'https://linkedin.com/in/james-wilson' },
                    { id: 'social-james-2', platform: 'twitter', url: 'https://twitter.com/jameswilson' },
                    { id: 'social-james-3', platform: 'facebook', url: 'https://facebook.com/jameswilson' }
                ],
                careerEntries: [
                    { id: 'career-james-1', type: 'EDUCATION', title: 'Bachelor of Science in Business Administration', institution: 'London School of Economics', startDate: '2011-09', endDate: '2015-05', location: 'London, UK', description: 'Focus on entrepreneurship and business strategy' },
                    { id: 'career-james-2', type: 'EDUCATION', title: 'Diploma in Business Management', institution: 'Oxford Brookes University', startDate: '2009-09', endDate: '2011-06', location: 'Oxford, UK', description: 'Foundation in business management principles' },
                    { id: 'career-james-3', type: 'EXPERIENCE', title: 'Business Development Manager', institution: 'Unilever', startDate: '2018-01', endDate: '', location: 'London, UK', description: 'Strategic business partnerships and market expansion' },
                    { id: 'career-james-4', type: 'EXPERIENCE', title: 'Marketing Manager', institution: 'Tesco', startDate: '2015-07', endDate: '2017-12', location: 'London, UK', description: 'Digital marketing campaigns and customer engagement' },
                    { id: 'career-james-5', type: 'EXPERIENCE', title: 'Business Analyst', institution: 'Accenture', startDate: '2015-01', endDate: '2015-06', location: 'London, UK', description: 'Business process improvement and consulting' }
                ],
            },
            {
                id: '550e8400-e29b-41d4-a716-446655440004',
                name: 'Phạm Thị Mai',
                email: 'pham.thi.mai@example.com',
                avatarUrl: 'images/users/user9.jpg',
                countryCode: 'AU',
                joinDate: '25 Jun 2023',
                totalStudents: 650,
                rating: 4.77,
                experience: 6,
                timezone: 'UTC-5',
                languages: [{ languageCode: 'en', isNative: true }],
                subjects: [{ categoryId: 'tech', subjectName: 'Công nghệ' }],
                instructorLevel: ['PRO'],
                isVerified: true,
                currentSessionFee: 65,
                classes: [
                    { id: '550e8400-e29b-41d4-a716-446655440401', title: 'Thành thạo React.js', enrollmentCount: 523, rating: 4.9, pricePerHour: 65, classType: 'LARGE_GROUP' },
                    { id: '550e8400-e29b-41d4-a716-446655440402', title: 'Hướng dẫn Toàn diện Vue.js', enrollmentCount: 267, rating: 4.7, pricePerHour: 60, classType: 'LARGE_GROUP' },
                    { id: '550e8400-e29b-41d4-a716-446655440403', title: 'Angular Mẫu Nâng cao', enrollmentCount: 198, rating: 4.8, pricePerHour: 62, classType: 'SMALL_GROUP' },
                    { id: '550e8400-e29b-41d4-a716-446655440404', title: 'Thành thạo TypeScript', enrollmentCount: 412, rating: 4.8, pricePerHour: 60, classType: 'LARGE_GROUP' },
                    { id: '550e8400-e29b-41d4-a716-446655440405', title: 'CSS Grid & Flexbox', enrollmentCount: 634, rating: 4.7, pricePerHour: 50, classType: 'LARGE_GROUP' },
                    { id: '550e8400-e29b-41d4-a716-446655440406', title: 'Tối ưu Hiệu suất Web', enrollmentCount: 234, rating: 4.6, pricePerHour: 55, classType: 'SMALL_GROUP' },
                    { id: '550e8400-e29b-41d4-a716-446655440407', title: 'Nguyên tắc Thiết kế Đáp ứng', enrollmentCount: 345, rating: 4.7, pricePerHour: 50, classType: 'LARGE_GROUP' }
                ],
                certifications: [
                    { id: 'cert-550e8400-e29b-41d4-a716-446655440010', name: 'Google Cloud Engineer Certificate', issuingOrganization: 'Google Cloud', issueDate: '2023-05-12', expirationDate: '2026-05-12', credentialId: 'GCE-20230512-010', credentialUrl: 'https://example.com/files/google_cloud_engineer_cert.pdf' },
                    { id: 'cert-550e8400-e29b-41d4-a716-446655440011', name: 'Scrum Master Certificate', issuingOrganization: 'Scrum Alliance', issueDate: '2022-09-08', expirationDate: '2025-09-08', credentialId: 'CSPO-20220908-011', credentialUrl: 'https://example.com/files/scrum_master_cert.pdf' },
                    { id: 'cert-550e8400-e29b-41d4-a716-446655440012', name: 'AWS Developer Associate Certificate', issuingOrganization: 'Amazon Web Services', issueDate: '2023-02-14', expirationDate: '2025-02-14', credentialId: 'AWS-DA-20230214-012', credentialUrl: 'https://example.com/files/aws_developer_cert.pdf' }
                ],
                totalReviews: 3421,
                totalHours: 54,
                headline: 'Chuyên gia Frontend | Chuyên gia React, Vue & Angular | Tối ưu Hiệu suất Web',
                introduction: 'Xin chào! Tôi là Phạm Thị Mai, một nhà phát triển frontend đầy đam mê với 9 năm kinh nghiệm xây dựng các ứng dụng web đẹp và hiệu suất cao.',
                videoUrl: 'https://media-cdn.example.com/videos/emma-intro.mp4',
                videoThumbnailUrl: 'https://media-cdn.example.com/thumbnails/emma-intro.jpg',
                socialLinks: [
                    { id: 'social-emma-1', platform: 'linkedin', url: 'https://linkedin.com/in/emma-davis' },
                    { id: 'social-emma-2', platform: 'github', url: 'https://github.com/emmadavis' },
                    { id: 'social-emma-3', platform: 'twitter', url: 'https://twitter.com/emmadavis' }
                ],
                careerEntries: [
                    { id: 'career-emma-1', type: 'EDUCATION', title: 'Master of Science in Computer Science', institution: 'University of Melbourne', startDate: '2016-02', endDate: '2018-11', location: 'Melbourne, Australia', description: 'Specialized in front-end technologies and UX design' },
                    { id: 'career-emma-2', type: 'EDUCATION', title: 'Bachelor of Science in Information Technology', institution: 'Monash University', startDate: '2012-02', endDate: '2016-11', location: 'Melbourne, Australia', description: 'Core IT fundamentals and web development' },
                    { id: 'career-emma-3', type: 'EXPERIENCE', title: 'Senior Frontend Engineer', institution: 'GitHub', startDate: '2019-05', endDate: '', location: 'San Francisco, CA', description: 'Led frontend architecture for GitHub\'s web platform' },
                    { id: 'career-emma-4', type: 'EXPERIENCE', title: 'Frontend Developer', institution: 'Spotify', startDate: '2018-12', endDate: '2019-04', location: 'Stockholm, Sweden', description: 'Developed interactive web features for music streaming platform' },
                    { id: 'career-emma-5', type: 'EXPERIENCE', title: 'Junior Web Developer', institution: 'NAB', startDate: '2017-01', endDate: '2018-11', location: 'Melbourne, Australia', description: 'Built internal web applications for banking operations' }
                ],
            },
            {
                id: '550e8400-e29b-41d4-a716-446655440005',
                name: 'Hoàng Văn Quang',
                email: 'hoang.van.quang@example.com',
                avatarUrl: 'images/users/user10.jpg',
                countryCode: 'US',
                joinDate: '12 May 2023',
                totalStudents: 1066,
                rating: 4.83,
                experience: 11,
                timezone: 'UTC-5',
                languages: [{ languageCode: 'en', isNative: true }],
                subjects: [{ categoryId: 'tech', subjectName: 'Công nghệ' }],
                instructorLevel: ['PRO'],
                isVerified: true,
                currentSessionFee: 70,
                classes: [
                    { id: '550e8400-e29b-41d4-a716-446655440501', title: 'Tìm hiểu Sâu về React Hooks', enrollmentCount: 389, rating: 4.9, pricePerHour: 70, classType: 'LARGE_GROUP' },
                    { id: '550e8400-e29b-41d4-a716-446655440502', title: 'Quản lý State với Redux', enrollmentCount: 276, rating: 4.8, pricePerHour: 65, classType: 'LARGE_GROUP' },
                    { id: '550e8400-e29b-41d4-a716-446655440503', title: 'Next.js Full Stack', enrollmentCount: 234, rating: 4.9, pricePerHour: 75, classType: 'SMALL_GROUP' },
                    { id: '550e8400-e29b-41d4-a716-446655440504', title: 'React Testing Library', enrollmentCount: 167, rating: 4.7, pricePerHour: 60, classType: 'SMALL_GROUP' }
                ],
                certifications: [
                    { id: 'cert-550e8400-e29b-41d4-a716-446655440013', name: 'React Advanced Certificate', issuingOrganization: 'Udemy', issueDate: '2023-04-18', expirationDate: '2026-04-18', credentialId: 'REACT-ADV-20230418-013', credentialUrl: 'https://example.com/files/react_advanced_cert.pdf' },
                    { id: 'cert-550e8400-e29b-41d4-a716-446655440014', name: 'JavaScript Expert Certificate', issuingOrganization: 'Coursera', issueDate: '2023-01-22', expirationDate: '2026-01-22', credentialId: 'JS-EXP-20230122-014', credentialUrl: 'https://example.com/files/javascript_expert_cert.pdf' },
                    { id: 'cert-550e8400-e29b-41d4-a716-446655440015', name: 'Redux Specialist Certificate', issuingOrganization: 'Pluralsight', issueDate: '2022-10-30', expirationDate: '2025-10-30', credentialId: 'REDUX-20221030-015', credentialUrl: 'https://example.com/files/redux_specialist_cert.pdf' }
                ],
                totalReviews: 2156,
                totalHours: 42,
                headline: 'Bậc thầy React | Quản lý State & Mẫu Nâng cao | Hơn 11 năm Kinh nghiệm Phát triển',
                introduction: 'Xin chào! Tôi là Hoàng Văn Quang, một chuyên gia React với hơn 11 năm kinh nghiệm trong phát triển frontend.',
                videoUrl: 'https://media-cdn.example.com/videos/michael-intro.mp4',
                videoThumbnailUrl: 'https://media-cdn.example.com/thumbnails/michael-intro.jpg',
                socialLinks: [
                    { id: 'social-michael-1', platform: 'linkedin', url: 'https://linkedin.com/in/michael-brown' },
                    { id: 'social-michael-2', platform: 'github', url: 'https://github.com/michaelbrown' },
                    { id: 'social-michael-3', platform: 'twitter', url: 'https://twitter.com/michaelbrown' },
                    { id: 'social-michael-4', platform: 'instagram', url: 'https://instagram.com/michaelbrown' }
                ],
                careerEntries: [
                    { id: 'career-michael-1', type: 'EDUCATION', title: 'Master of Science in Computer Science', institution: 'Carnegie Mellon University', startDate: '2010-09', endDate: '2012-05', location: 'Pittsburgh, PA', description: 'Advanced software engineering and distributed systems' },
                    { id: 'career-michael-2', type: 'EDUCATION', title: 'Bachelor of Science in Computer Science', institution: 'University of Washington', startDate: '2006-09', endDate: '2010-05', location: 'Seattle, WA', description: 'Solid foundation in computer science and mathematics' },
                    { id: 'career-michael-3', type: 'EXPERIENCE', title: 'Principal Engineer', institution: 'Netflix', startDate: '2018-09', endDate: '', location: 'Los Gatos, CA', description: 'Led React infrastructure and streaming platform optimization' },
                    { id: 'career-michael-4', type: 'EXPERIENCE', title: 'Senior Software Engineer', institution: 'Facebook', startDate: '2015-06', endDate: '2018-08', location: 'Menlo Park, CA', description: 'Contributed to React and React Native frameworks' },
                    { id: 'career-michael-5', type: 'EXPERIENCE', title: 'Software Engineer', institution: 'Google', startDate: '2012-07', endDate: '2015-05', location: 'Mountain View, CA', description: 'Worked on JavaScript engines and web performance' }
                ],
            }
        ];

        // Extract Tutor list (field cơ bản) từ TutorDetail
        const mockTutorsList: Tutor[] = mockTutorsDetail.map(tutor => ({
            id: tutor.id,
            name: tutor.name,
            countryCode: tutor.countryCode,
            email: tutor.email,
            joinDate: tutor.joinDate,
            rating: tutor.rating,

        }));

        const mockStudents: Student[] = [
            {
                id: '550e8400-e29b-41d4-a716-446655441001',
                fullname: 'Sarah Johnson',
                email: 'sarah.j@example.com',
                phone: '+1 (555) 123-4567',
                joinDate: '01 Feb 2023'
            },
            {
                id: '550e8400-e29b-41d4-a716-446655441002',
                fullname: 'Robert Taylor',
                email: 'robert.t@example.com',
                phone: '+1 (555) 234-5678',
                joinDate: '15 Feb 2023'
            },
            {
                id: '550e8400-e29b-41d4-a716-446655441003',
                fullname: 'Lisa Anderson',
                email: 'lisa.a@example.com',
                phone: '+1 (555) 345-6789',
                joinDate: '20 Feb 2023'
            },
            {
                id: '550e8400-e29b-41d4-a716-446655441004',
                fullname: 'David Martinez',
                email: 'david.m@example.com',
                phone: '+1 (555) 456-7890',
                joinDate: '25 Feb 2023'
            },
            {
                id: '550e8400-e29b-41d4-a716-446655441005',
                fullname: 'Jennifer Lee',
                email: 'jennifer.l@example.com',
                phone: '+1 (555) 567-8901',
                joinDate: '01 Mar 2023'
            },
            {
                id: '550e8400-e29b-41d4-a716-446655441006',
                fullname: 'Chris Thompson',
                email: 'chris.t@example.com',
                phone: '+1 (555) 678-9012',
                joinDate: '10 Mar 2023'
            }
        ];

        const mockStudentsDetail: StudentDetail[] = [
            {
                id: '550e8400-e29b-41d4-a716-446655441001',
                fullname: 'Sarah Johnson',
                email: 'sarah.j@example.com',
                phone: '+1 (555) 123-4567',
                avatar: 'images/users/user11.jpg',
                joinDate: '01 Feb 2023',
                bio: 'Passionate web developer with a focus on modern frontend frameworks and responsive design.',
                dateOfBirth: '1995-04-15',
                address: '123 Main Street',
                city: 'San Francisco',
                country: 'United States',
                learningGoals: 'Master advanced React patterns and build scalable web applications',
                strengths: 'Quick learner, strong problem-solving skills, attention to detail',
                weaknesses: 'Need to improve backend development skills',
                classes: [
                    { id: '550e8400-e29b-41d4-a716-446655440401', className: 'React.js Mastery', tutor: 'Emma Davis', enrolledDate: '15 Jan 2024', type: '1-1', price: 119 },
                    { id: '550e8400-e29b-41d4-a716-446655440405', className: 'CSS Grid & Flexbox', tutor: 'Emma Davis', enrolledDate: '22 Jan 2024', type: '1-n', price: 59 },
                    { id: '550e8400-e29b-41d4-a716-446655440407', className: 'Responsive Design Principles', tutor: 'Emma Davis', enrolledDate: '01 Feb 2024', type: '1-n', price: 69 }
                ]
            },
            {
                id: '550e8400-e29b-41d4-a716-446655441002',
                fullname: 'Robert Taylor',
                email: 'robert.t@example.com',
                phone: '+1 (555) 234-5678',
                avatar: 'images/users/user12.jpg',
                joinDate: '15 Feb 2023',
                bio: 'Data science enthusiast exploring machine learning and Python development.',
                dateOfBirth: '1992-08-22',
                address: '456 Oak Avenue',
                city: 'New York',
                country: 'United States',
                learningGoals: 'Become proficient in machine learning and data analysis',
                strengths: 'Analytical thinking, mathematical background, dedicated learner',
                weaknesses: 'Limited experience with deep learning frameworks',
                classes: [
                    { id: '550e8400-e29b-41d4-a716-446655440201', className: 'Python for Data Science', tutor: 'Ava Cooper', enrolledDate: '05 Dec 2023', type: '1-n', price: 89 },
                    { id: '550e8400-e29b-41d4-a716-446655440204', className: 'Machine Learning with Python', tutor: 'Ava Cooper', enrolledDate: '12 Dec 2023', type: '1-n', price: 129 },
                    { id: '550e8400-e29b-41d4-a716-446655440205', className: 'Database Design', tutor: 'Ava Cooper', enrolledDate: '18 Dec 2023', type: '1-n', price: 79 },
                    { id: '550e8400-e29b-41d4-a716-446655440301', className: 'Digital Marketing Fundamentals', tutor: 'James Wilson', enrolledDate: '02 Jan 2024', type: '1-n', price: 79 },
                    { id: '550e8400-e29b-41d4-a716-446655440304', className: 'Content Marketing Excellence', tutor: 'James Wilson', enrolledDate: '15 Jan 2024', type: '1-n', price: 79 }
                ]
            },
            {
                id: '550e8400-e29b-41d4-a716-446655441003',
                fullname: 'Lisa Anderson',
                email: 'lisa.a@example.com',
                phone: '+1 (555) 345-6789',
                avatar: 'images/users/user13.jpg',
                joinDate: '20 Feb 2023',
                bio: 'DevOps engineer looking to enhance containerization and deployment skills.',
                dateOfBirth: '1990-11-30',
                address: '789 Pine Road',
                city: 'Seattle',
                country: 'United States',
                learningGoals: 'Master Docker, Kubernetes, and modern deployment strategies',
                strengths: 'Strong technical foundation, team collaboration',
                weaknesses: 'Need more hands-on experience with cloud platforms',
                classes: [
                    { id: '550e8400-e29b-41d4-a716-446655440208', className: 'Docker & Kubernetes', tutor: 'Ava Cooper', enrolledDate: '10 Jan 2024', type: '1-n', price: 119 },
                    { id: '550e8400-e29b-41d4-a716-446655440406', className: 'Web Performance Optimization', tutor: 'Emma Davis', enrolledDate: '28 Jan 2024', type: '1-1', price: 99 }
                ]
            },
            {
                id: '550e8400-e29b-41d4-a716-446655441004',
                fullname: 'David Martinez',
                email: 'david.m@example.com',
                phone: '+1 (555) 456-7890',
                avatar: 'images/users/user14.jpg',
                joinDate: '25 Feb 2023',
                bio: 'Full-stack developer expanding knowledge in modern frameworks and TypeScript.',
                dateOfBirth: '1993-06-18',
                address: '321 Elm Street',
                city: 'Austin',
                country: 'United States',
                learningGoals: 'Build end-to-end applications with modern tech stack',
                strengths: 'Versatile skill set, good understanding of software architecture',
                weaknesses: 'Need to improve frontend testing practices',
                classes: [
                    { id: '550e8400-e29b-41d4-a716-446655440202', className: 'Full Stack Web Development', tutor: 'Ava Cooper', enrolledDate: '08 Dec 2023', type: '1-n', price: 139 },
                    { id: '550e8400-e29b-41d4-a716-446655440203', className: 'Django REST Framework', tutor: 'Ava Cooper', enrolledDate: '15 Dec 2023', type: '1-n', price: 99 },
                    { id: '550e8400-e29b-41d4-a716-446655440403', className: 'Angular Advanced Patterns', tutor: 'Emma Davis', enrolledDate: '22 Dec 2023', type: '1-1', price: 129 },
                    { id: '550e8400-e29b-41d4-a716-446655440404', className: 'TypeScript Mastery', tutor: 'Emma Davis', enrolledDate: '29 Dec 2023', type: '1-n', price: 89 }
                ]
            },
            {
                id: '550e8400-e29b-41d4-a716-446655441005',
                fullname: 'Jennifer Lee',
                email: 'jennifer.l@example.com',
                phone: '+1 (555) 567-8901',
                avatar: 'images/users/user15.jpg',
                joinDate: '01 Mar 2023',
                bio: 'Software engineer passionate about cybersecurity and modern web technologies.',
                dateOfBirth: '1991-03-25',
                address: '654 Maple Drive',
                city: 'Boston',
                country: 'United States',
                learningGoals: 'Combine security expertise with full-stack development skills',
                strengths: 'Strong security mindset, comprehensive technical knowledge',
                weaknesses: 'Could improve UI/UX design skills',
                classes: [
                    { id: '550e8400-e29b-41d4-a716-446655440101', className: 'Advanced Cybersecurity Fundamentals', tutor: 'Oliver Khan', enrolledDate: '01 Oct 2023', type: '1-1', price: 99 },
                    { id: '550e8400-e29b-41d4-a716-446655440302', className: 'SEO Mastery 2024', tutor: 'James Wilson', enrolledDate: '08 Oct 2023', type: '1-n', price: 99 },
                    { id: '550e8400-e29b-41d4-a716-446655440303', className: 'Social Media Strategy', tutor: 'James Wilson', enrolledDate: '20 Oct 2023', type: '1-n', price: 89 },
                    { id: '550e8400-e29b-41d4-a716-446655440501', className: 'React Hooks Deep Dive', tutor: 'Michael Brown', enrolledDate: '01 Nov 2023', type: '1-1', price: 109 },
                    { id: '550e8400-e29b-41d4-a716-446655440502', className: 'State Management with Redux', tutor: 'Michael Brown', enrolledDate: '15 Nov 2023', type: '1-n', price: 99 },
                    { id: '550e8400-e29b-41d4-a716-446655440503', className: 'Next.js Full Stack', tutor: 'Michael Brown', enrolledDate: '01 Dec 2023', type: '1-n', price: 129 }
                ]
            },
            {
                id: '550e8400-e29b-41d4-a716-446655441006',
                fullname: 'Chris Thompson',
                email: 'chris.t@example.com',
                phone: '+1 (555) 678-9012',
                avatar: 'images/users/user16.jpg',
                joinDate: '10 Mar 2023',
                bio: 'Junior developer eager to learn modern development practices and frameworks.',
                dateOfBirth: '1997-09-12',
                address: '987 Birch Lane',
                city: 'Portland',
                country: 'United States',
                learningGoals: 'Build solid foundation in web development and testing',
                strengths: 'Enthusiastic, quick to adapt, good communication',
                weaknesses: 'Limited professional experience, need more practice',
                classes: [
                    { id: '550e8400-e29b-41d4-a716-446655440102', className: 'Network Penetration Testing', tutor: 'Oliver Khan', enrolledDate: '18 Feb 2024', type: '1-n', price: 129 },
                    { id: '550e8400-e29b-41d4-a716-446655440206', className: 'FastAPI Modern Development', tutor: 'Ava Cooper', enrolledDate: '25 Feb 2024', type: '1-n', price: 109 },
                    { id: '550e8400-e29b-41d4-a716-446655440504', className: 'React Testing Library', tutor: 'Michael Brown', enrolledDate: '03 Mar 2024', type: '1-1', price: 79 }
                ]
            }
        ];

        const mockInstructorRequests: InstructorRequest[] = [
            {
                id: '550e8400-e29b-41d4-a716-446655442001',
                name: 'Nguyễn Văn Hùng',
                experience: 12,
                languages: [
                    { languageCode: 'en', isNative: true },
                    { languageCode: 'es', isNative: false },
                    { languageCode: 'fr', isNative: false },
                    { languageCode: 'de', isNative: false }
                ],
                subjectIds: ['1.1', '1.3', '2.1'],
                certifications: [
                    { id: 'cert-001', name: 'CISSP Certificate', issuingOrganization: 'ISC2', issueDate: '2022-01-15', expirationDate: '2025-01-15', credentialId: 'CISSP-001', credentialUrl: 'https://example.com/cert1.pdf' },
                    { id: 'cert-002', name: 'CEH Certificate', issuingOrganization: 'EC-Council', issueDate: '2021-06-20', credentialId: 'CEH-002', credentialUrl: 'https://example.com/cert2.pdf' },
                    { id: 'cert-003', name: 'AWS Solutions Architect', issuingOrganization: 'Amazon Web Services', issueDate: '2023-05-12', expirationDate: '2026-05-12', credentialId: 'AWS-SA-001', credentialUrl: 'https://example.com/aws-cert.pdf' }
                ],
                careerEntries: [
                    { id: 'career-1', type: 'EDUCATION', title: 'Thạc sĩ Khoa học An ninh mạng', institution: 'Đại học Stanford', startDate: '2009-09', endDate: '2011-05', location: 'Stanford, CA', description: 'Chuyên sâu về bảo mật mạng và mật mã học' },
                    { id: 'career-2', type: 'EDUCATION', title: 'Cử nhân Khoa học Máy tính', institution: 'MIT', startDate: '2005-09', endDate: '2009-05', location: 'Cambridge, MA' },
                    { id: 'career-3', type: 'EXPERIENCE', title: 'Kiến trúc sư Bảo mật Cấp cao', institution: 'Google Cloud', startDate: '2018-06', endDate: '', location: 'Mountain View, CA', description: 'Dẫn dắt kiến trúc bảo mật cho giải pháp đám mây doanh nghiệp' },
                    { id: 'career-4', type: 'EXPERIENCE', title: 'Kỹ sư Bảo mật', institution: 'Cisco Systems', startDate: '2014-01', endDate: '2018-05', location: 'San Jose, CA', description: 'Thiết kế giải pháp bảo mật mạng cho các công ty Fortune 500' }
                ],
                requestStatus: 'PENDING',
                submittedAt: '2024-11-28T09:30:00Z'
            },
            {
                id: '550e8400-e29b-41d4-a716-446655442002',
                name: 'Trần Thị Lan',
                experience: 8,
                languages: [
                    { languageCode: 'en', isNative: true },
                    { languageCode: 'es', isNative: false }
                ],
                subjectIds: ['3.1', '3.2'],
                certifications: [
                    { id: 'cert-004', name: 'Google Analytics Professional', issuingOrganization: 'Google', issueDate: '2023-03-10', credentialId: 'GA-003', credentialUrl: 'https://example.com/cert3.pdf' },
                    { id: 'cert-005', name: 'Facebook Blueprint Certification', issuingOrganization: 'Meta', issueDate: '2023-07-22', credentialId: 'FB-BP-002' }
                ],
                careerEntries: [
                    { id: 'career-5', type: 'EDUCATION', title: 'MBA Tiếp thị', institution: 'Trường Kinh doanh Harvard', startDate: '2014-09', endDate: '2016-05', location: 'Boston, MA', description: 'Tập trung vào tiếp thị số và hành vi người tiêu dùng' },
                    { id: 'career-6', type: 'EXPERIENCE', title: 'Quản lý Tiếp thị Số', institution: 'Adobe Inc.', startDate: '2019-03', endDate: '', location: 'San Francisco, CA', description: 'Quản lý chiến dịch tiếp thị số toàn cầu cho sản phẩm Creative Cloud' }
                ],
                requestStatus: 'PENDING',
                submittedAt: '2024-11-29T14:15:00Z'
            },
            {
                id: '550e8400-e29b-41d4-a716-446655442003',
                name: 'Lê Minh Tuấn',
                experience: 15,
                languages: [
                    { languageCode: 'zh', isNative: true },
                    { languageCode: 'en', isNative: false },
                    { languageCode: 'ja', isNative: false }
                ],
                subjectIds: ['1.1', '2.1', '2.2'],
                certifications: [
                    { id: 'cert-006', name: 'TensorFlow Developer Certificate', issuingOrganization: 'Google', issueDate: '2022-11-05', credentialId: 'TF-DEV-006' },
                    { id: 'cert-007', name: 'Deep Learning Specialization', issuingOrganization: 'Coursera/deeplearning.ai', issueDate: '2021-08-15', credentialId: 'DL-SPEC-007', credentialUrl: 'https://example.com/dl-cert.pdf' },
                    { id: 'cert-008', name: 'AWS Machine Learning Specialty', issuingOrganization: 'Amazon Web Services', issueDate: '2023-02-20', expirationDate: '2026-02-20', credentialId: 'AWS-ML-008' }
                ],
                careerEntries: [
                    { id: 'career-7', type: 'EDUCATION', title: 'Tiến sĩ Khoa học Máy tính', institution: 'Đại học Thanh Hoa', startDate: '2005-09', endDate: '2009-06', location: 'Bắc Kinh, Trung Quốc', description: 'Nghiên cứu về học máy và mạng nơ-ron' },
                    { id: 'career-8', type: 'EXPERIENCE', title: 'Nhà khoa học Nghiên cứu AI', institution: 'Microsoft Research', startDate: '2015-07', endDate: '', location: 'Redmond, WA', description: 'Dẫn dắt nghiên cứu về mô hình ngôn ngữ lớn và thị giác máy tính' },
                    { id: 'career-9', type: 'EXPERIENCE', title: 'Kỹ sư ML Cấp cao', institution: 'Baidu', startDate: '2009-07', endDate: '2015-06', location: 'Bắc Kinh, Trung Quốc', description: 'Phát triển hệ thống đề xuất và mô hình NLP' }
                ],
                requestStatus: 'REQUEST_CHANGES',
                submittedAt: '2024-11-25T10:00:00Z'
            },
            {
                id: '550e8400-e29b-41d4-a716-446655442004',
                name: 'Phạm Thị Mai',
                experience: 6,
                languages: [
                    { languageCode: 'es', isNative: true },
                    { languageCode: 'en', isNative: false },
                    { languageCode: 'pt', isNative: false }
                ],
                subjectIds: ['4.2', '4.3'],
                certifications: [
                    { id: 'cert-009', name: 'DELE C2 Certificate', issuingOrganization: 'Instituto Cervantes', issueDate: '2018-06-30', credentialId: 'DELE-C2-009', credentialUrl: 'https://example.com/dele-cert.pdf' },
                    { id: 'cert-010', name: 'Teaching Spanish as Foreign Language', issuingOrganization: 'University of Barcelona', issueDate: '2019-12-15', credentialId: 'ELE-010' }
                ],
                careerEntries: [
                    { id: 'career-10', type: 'EDUCATION', title: 'Thạc sĩ Ngôn ngữ học Tây Ban Nha', institution: 'Đại học Complutense Madrid', startDate: '2016-09', endDate: '2018-06', location: 'Madrid, Tây Ban Nha' },
                    { id: 'career-11', type: 'EXPERIENCE', title: 'Giảng viên Tiếng Tây Ban Nha', institution: 'Học viện Ngôn ngữ Quốc tế', startDate: '2019-01', endDate: '', location: 'Barcelona, Tây Ban Nha', description: 'Dạy tiếng Tây Ban Nha cho sinh viên quốc tế và chuyên gia kinh doanh' }
                ],
                requestStatus: 'PENDING',
                submittedAt: '2024-12-01T08:45:00Z'
            },
            {
                id: '550e8400-e29b-41d4-a716-446655442005',
                name: 'Hoàng Văn Quang',
                experience: 10,
                languages: [
                    { languageCode: 'en', isNative: true },
                    { languageCode: 'fr', isNative: false }
                ],
                subjectIds: ['3.2'],
                certifications: [
                    { id: 'cert-011', name: 'CFA Level III', issuingOrganization: 'CFA Institute', issueDate: '2020-09-01', credentialId: 'CFA-L3-011', credentialUrl: 'https://example.com/cfa-cert.pdf' },
                    { id: 'cert-012', name: 'CPA License', issuingOrganization: 'AICPA', issueDate: '2018-05-20', credentialId: 'CPA-012' }
                ],
                careerEntries: [
                    { id: 'career-12', type: 'EDUCATION', title: 'MBA Tài chính', institution: 'Trường Wharton, Đại học Pennsylvania', startDate: '2012-09', endDate: '2014-05', location: 'Philadelphia, PA' },
                    { id: 'career-13', type: 'EXPERIENCE', title: 'Chuyên viên Ngân hàng Đầu tư', institution: 'Goldman Sachs', startDate: '2014-07', endDate: '', location: 'New York, NY', description: 'Tư vấn về M&A và huy động vốn cho các công ty Fortune 500' }
                ],
                requestStatus: 'APPROVED',
                submittedAt: '2024-11-20T11:20:00Z'
            },
            {
                id: '550e8400-e29b-41d4-a716-446655442006',
                name: 'Vũ Thị Hương',
                experience: 7,
                languages: [
                    { languageCode: 'ja', isNative: true },
                    { languageCode: 'en', isNative: false },
                    { languageCode: 'ko', isNative: false }
                ],
                subjectIds: ['5.1'],
                certifications: [
                    { id: 'cert-013', name: 'Adobe Certified Expert', issuingOrganization: 'Adobe', issueDate: '2021-04-10', credentialId: 'ACE-013', credentialUrl: 'https://example.com/adobe-cert.pdf' },
                    { id: 'cert-014', name: 'Google UX Design Certificate', issuingOrganization: 'Google', issueDate: '2022-09-25', credentialId: 'GUX-014' }
                ],
                careerEntries: [
                    { id: 'career-14', type: 'EDUCATION', title: 'Cử nhân Thiết kế Thị giác', institution: 'Đại học Nghệ thuật Tokyo', startDate: '2013-04', endDate: '2017-03', location: 'Tokyo, Nhật Bản' },
                    { id: 'career-15', type: 'EXPERIENCE', title: 'Nhà thiết kế UX Cấp cao', institution: 'Sony Interactive Entertainment', startDate: '2020-04', endDate: '', location: 'Tokyo, Nhật Bản', description: 'Thiết kế trải nghiệm người dùng cho sản phẩm PlayStation' }
                ],
                requestStatus: 'REJECTED',
                submittedAt: '2024-11-18T16:30:00Z'
            }
        ];

        const mockInstructorRequestsDetail: InstructorRequestDetail[] = mockInstructorRequests.map(req => ({
            ...req,
            email: req.id === '550e8400-e29b-41d4-a716-446655442001' ? 'nguyen.van.hung@example.com' :
                req.id === '550e8400-e29b-41d4-a716-446655442002' ? 'tran.thi.lan@example.com' :
                    req.id === '550e8400-e29b-41d4-a716-446655442003' ? 'le.minh.tuan@example.com' :
                        req.id === '550e8400-e29b-41d4-a716-446655442004' ? 'pham.thi.mai@example.com' :
                            req.id === '550e8400-e29b-41d4-a716-446655442005' ? 'hoang.van.quang@example.com' :
                                'vu.thi.huong@example.com',
            avatarUrl: 'images/users/user6.jpg',
            countryCode: req.id === '550e8400-e29b-41d4-a716-446655442001' ? 'US' :
                req.id === '550e8400-e29b-41d4-a716-446655442002' ? 'US' :
                    req.id === '550e8400-e29b-41d4-a716-446655442003' ? 'CN' :
                        req.id === '550e8400-e29b-41d4-a716-446655442004' ? 'ES' :
                            req.id === '550e8400-e29b-41d4-a716-446655442005' ? 'US' : 'JP',
            gender: 'Male',
            instructorLevel: [],
            initialPrice: (req.experience || 0) > 10 ? 75 : (req.experience || 0) > 7 ? 60 : 50,
            timezone: 'America/New_York',
            headline: `Chuyên gia với ${(req.experience || 0)}+ năm Kinh nghiệm`,
            introduction: `Xin chào! Tôi là ${req.name}, một giảng viên tận tâm với ${(req.experience || 0)}+ năm kinh nghiệm chuyên môn. Tôi chuyên giảng dạy với trọng tâm vào ứng dụng thực tế và các tình huống thực tế.`,
            videoUrl: 'https://media-cdn.example.com/videos/intro.mp4',
            videoThumbnailUrl: 'https://media-cdn.example.com/thumbnails/intro.jpg',
            socialLinks: [
                { id: `social-${req.id}-1`, platform: 'linkedin', url: `https://linkedin.com/in/${req.name.toLowerCase().replace(' ', '-')}` },
                { id: `social-${req.id}-2`, platform: 'twitter', url: `https://twitter.com/${req.name.toLowerCase().replace(' ', '')}` }
            ],
            availableSchedule: {
                monday: ['09:00 AM - 11:00 AM', '02:00 PM - 04:00 PM'],
                tuesday: ['10:00 AM - 12:00 PM', '03:00 PM - 05:00 PM'],
                wednesday: ['09:00 AM - 11:00 AM', '01:00 PM - 03:00 PM'],
                thursday: ['02:00 PM - 04:00 PM', '06:00 PM - 08:00 PM'],
                friday: ['09:00 AM - 12:00 PM'],
                saturday: ['10:00 AM - 01:00 PM'],
                sunday: []
            },
            availabilities: [
                { id: `avail-${req.id}-1`, dayOfWeek: 1, startTime: '09:00', endTime: '11:00', effectiveStartDate: '2024-01-01', status: 'AVAILABLE' },
                { id: `avail-${req.id}-2`, dayOfWeek: 1, startTime: '14:00', endTime: '16:00', effectiveStartDate: '2024-01-01', status: 'AVAILABLE' },
                { id: `avail-${req.id}-3`, dayOfWeek: 2, startTime: '10:00', endTime: '12:00', effectiveStartDate: '2024-01-01', status: 'AVAILABLE' }
            ],
            reason: req.id === '550e8400-e29b-41d4-a716-446655442002' ? 'Cần bổ sung thông tin chứng chỉ và cập nhật ảnh đại diện rõ nét hơn.' : undefined,
            reviewedBy: req.id === '550e8400-e29b-41d4-a716-446655442002' ? 'Quản trị viên Nguyễn Văn A' : undefined,
            reviewedAt: req.id === '550e8400-e29b-41d4-a716-446655442002' ? '2024-12-05T10:30:00' : undefined
        }));

        this.instructorsSubject.next(mockTutorsList);
        this.studentsSubject.next(mockStudents);
        this.instructorRequestsSubject.next(mockInstructorRequests);

        // Lưu mock data để dùng làm fallback khi API lỗi
        this.mockTutors = mockTutorsList;
        this.mockTutorsDetail = mockTutorsDetail;
        this.mockStudents = mockStudents;
        this.mockStudentsDetail = mockStudentsDetail;
        this.mockInstructorRequests = mockInstructorRequests;
        this.mockInstructorRequestsDetail = mockInstructorRequestsDetail;
    }

    /**
     * Get list of approved tutors (for instructor-list page)
     * Calls /tutors API - returns TutorResponse from backend
     */
    getTutor(): Observable<Tutor[]> {
        // Gọi API /tutors - lấy danh sách gia sư đã được duyệt
        return this.apiService.get<PaginatedResponse<any>>('/tutors').pipe(
            map(response => {
                // ✅ ƯU TIÊN: Xử lý data thật từ API
                if (response.success && response.data && response.data.content) {
                    // Lưu full data vào cache để dùng cho detail
                    response.data.content.forEach((item: any) => {
                        if (item.id) {
                            this.tutorsFullDataCache.set(item.id, item);
                        }
                    });
                    
                    // Map BE TutorResponse to FE Tutor format
                    const tutors: Tutor[] = response.data.content.map((item: any) =>
                        this.mapTutorResponseToTutor(item)
                    );
                    this.instructorsSubject.next(tutors);
                    return tutors;
                }
                // ⚠️ FALLBACK: Chỉ khi API trả về success=false
                console.warn('[UserService] API failed for approved tutors:', response.message);
                return this.instructorsSubject.value.length > 0
                    ? this.instructorsSubject.value
                    : this.mockTutors;
            }),
            catchError(error => {
                // ⚠️ FALLBACK: Chỉ khi API throw exception (network error, timeout)
                console.error('[UserService] API error for approved tutors, returning mock data:', error);
                return of(this.instructorsSubject.value.length > 0
                    ? this.instructorsSubject.value
                    : this.mockTutors);
            })
        );
    }

    /**
     * Map BE TutorResponse to FE Tutor interface
     * Only map necessary fields: name, email, rating, countryCode, currentSessionFee, avatarUrl
     */
    private mapTutorResponseToTutor(backend: any): Tutor {
        return {
            id: backend.id || '',
            name: backend.fullName || '',
            email: backend.email || '',
            joinDate: backend.createdAt || backend.updatedAt || '', // Keep for backward compatibility
            rating: backend.averageRating || 0,
            countryCode: backend.countryCode || undefined,
            currentSessionFee: backend.currentSessionFee || undefined
        };
    }

    getTutorDetail(id: string): Observable<TutorDetail | undefined> {
        // Lấy từ cache full data (đã lưu từ API list)
        const fullData = this.tutorsFullDataCache.get(id);
        
        if (fullData) {
            // Map từ full TutorResponse sang TutorDetail với đầy đủ thông tin
            return of(this.mapTutorResponseToDetail(fullData));
        }
        
        // Nếu không có trong cache, thử lấy từ danh sách hiện tại
        const currentInstructors = this.instructorsSubject.value;
        const tutor = currentInstructors.find(t => t.id === id);
        
        if (tutor) {
            // Map từ Tutor sang TutorDetail với các trường cơ bản
            const tutorDetail: TutorDetail = {
                ...tutor,
                // TutorDetail specific fields - set defaults
                avatarUrl: '',
                timezone: undefined,
                gender: undefined,
                languages: [],
                totalHours: undefined,
                submittedDate: undefined,
                initialPrice: undefined,
                headline: undefined,
                introduction: undefined,
                totalStudents: undefined,
                totalReviews: undefined,
                subjects: [],
                instructorLevel: undefined,
                experience: undefined,
                certifications: [],
                classes: undefined,
                availableSchedule: undefined,
                isVerified: undefined,
                videoUrl: undefined,
                videoThumbnailUrl: undefined,
                socialLinks: [],
                careerEntries: [],
                availabilities: undefined,
                bookedSessionsCount: undefined,
                reviews: undefined,
                zoomConnected: undefined,
                originalSessionFee: undefined
            };
            return of(tutorDetail);
        }
        
        // Nếu không tìm thấy, thử lấy từ mock data
        const mockData = this.mockTutorsDetail.find((i: TutorDetail) => i.id === id);
        if (mockData) {
            console.warn(`[UserService] Tutor ${id} not found in cache, using mock data`);
            return of(mockData);
        }
        
        console.warn(`[UserService] Tutor ${id} not found`);
        return of(undefined);
    }

    /**
     * Map BE TutorResponse to FE TutorDetail interface
     * - Fields FE has but BE doesn't → set to undefined
     * - Fields BE has but FE doesn't → added to interface but not displayed in UI
     * - Field name differences → properly mapped
     */
    private mapTutorResponseToDetail(beResponse: any): TutorDetail {
        // Map languageCodes từ BE format { code, isNative } sang FE format { languageCode, isNative }
        const languages = (beResponse.languageCodes || []).map((lang: any) => ({
            languageCode: lang.code || lang.languageCode || '',
            isNative: lang.isNative || false
        }));

        return {
            // From Tutor base interface
            id: beResponse.id,
            name: beResponse.fullName || '', // BE: fullName → FE: name
            email: beResponse.email || '',
            joinDate: beResponse.createdAt || beResponse.updatedAt || '', // Use createdAt from backend
            rating: beResponse.averageRating || 0, // BE: averageRating → FE: rating
            countryCode: beResponse.countryCode,

            // TutorDetail specific fields
            avatarUrl: beResponse.avatarUrl || '', // Map avatarUrl để hiển thị ảnh
            timezone: beResponse.timezone,
            gender: undefined, // FE-only
            languages: languages, // Map từ BE languageCodes sang FE languages format
            totalHours: undefined, // FE-only
            submittedDate: undefined, // FE-only
            initialPrice: beResponse.originalSessionFee, // BE: originalSessionFee → FE: initialPrice
            headline: beResponse.headline || undefined, // Map headline cho phần Thông tin bổ sung
            introduction: beResponse.introduction || undefined, // Map introduction cho phần Thông tin bổ sung
            totalStudents: beResponse.studentCount || 0, // BE: studentCount → FE: totalStudents
            totalReviews: beResponse.reviews?.length || 0, // Calculate from reviews array
            subjects: [], // Need to lookup by subjectIds
            subjectIds: beResponse.subjectIds || [], // Store raw IDs for lookup
            instructorLevel: undefined, // FE-only
            experience: undefined, // FE-only
            certifications: beResponse.certificates || [], // BE: certificates → FE: certifications
            classes: undefined, // FE-only
            availableSchedule: undefined, // FE-only
            isVerified: beResponse.isVerified || false,
            videoUrl: beResponse.videoUrl || undefined, // Map videoUrl cho phần Thông tin bổ sung
            videoThumbnailUrl: undefined, // FE-only
            currentSessionFee: beResponse.currentSessionFee,
            socialLinks: beResponse.socialLinks || [], // Map socialLinks cho phần Thông tin bổ sung
            careerEntries: [
                ...(beResponse.educations || []),
                ...(beResponse.experiences || [])
            ], // Merge BE educations + experiences → FE careerEntries
            availabilities: undefined, // FE-only

            // BE-only fields (stored but not displayed in UI)
            bookedSessionsCount: beResponse.bookedSessionsCount,
            reviews: beResponse.reviews,
            zoomConnected: beResponse.zoomConnected,
            originalSessionFee: beResponse.originalSessionFee
        };
    }

    getStudents(page: number = 0, size: number = 1000): Observable<Student[]> {
        // Gọi API /students - lấy danh sách học sinh với pagination
        // Mặc định lấy page=0, size=1000 để lấy tất cả (backend dùng 0-based page)
        return this.apiService.get<PaginatedResponse<any>>('/students', { page, size }).pipe(
            map(response => {
                // ✅ ƯU TIÊN: Xử lý data thật từ API
                if (response.success && response.data && response.data.content) {
                    // Lưu full data vào cache để dùng cho detail
                    response.data.content.forEach((item: any) => {
                        if (item.id) {
                            this.studentsFullDataCache.set(item.id, item);
                        }
                    });
                    
                    // Map BE StudentResponse to FE Student format
                    const students: Student[] = response.data.content.map((item: any) =>
                        this.mapStudentResponseToStudent(item)
                    );
                    this.studentsSubject.next(students);
                    return students;
                }
                // ⚠️ FALLBACK: Chỉ khi API trả về success=false
                console.warn('[UserService] API failed for students:', response.message);
                return this.studentsSubject.value.length > 0
                    ? this.studentsSubject.value
                    : this.mockStudents;
            }),
            catchError(error => {
                // ⚠️ FALLBACK: Chỉ khi API throw exception (network error, timeout)
                console.error('[UserService] API error for students, returning mock data:', error);
                return of(this.studentsSubject.value.length > 0
                    ? this.studentsSubject.value
                    : this.mockStudents);
            })
        );
    }

    /**
     * Map BE StudentResponse to FE Student interface
     * Only map necessary fields: id, email, fullname, joinDate
     */
    private mapStudentResponseToStudent(backend: any): Student {
        return {
            id: backend.id || '',
            email: backend.email || '',
            fullname: backend.fullName || '', // BE: fullName → FE: fullname
            phone: undefined, // FE-only, not in BE
            joinDate: backend.createdAt || backend.updatedAt || '', // Use createdAt from backend
            enrollmentCount: undefined // FE-only, not in BE
        };
    }

    getStudentDetail(id: string): Observable<StudentDetail | undefined> {
        // Lấy từ cache full data (đã lưu từ API list)
        const fullData = this.studentsFullDataCache.get(id);
        
        if (fullData) {
            // Map từ full StudentResponse sang StudentDetail với đầy đủ thông tin
            return of(this.mapStudentResponseToDetail(fullData));
        }
        
        // Nếu không có trong cache, thử lấy từ danh sách hiện tại
        const currentStudents = this.studentsSubject.value;
        const student = currentStudents.find(s => s.id === id);
        
        if (student) {
            // Map từ Student sang StudentDetail với các trường cơ bản
            const studentDetail: StudentDetail = {
                ...student,
                // StudentDetail specific fields - set defaults
                avatar: undefined,
                bio: undefined,
                dateOfBirth: undefined,
                address: undefined,
                city: undefined,
                country: undefined,
                learningGoals: undefined,
                strengths: undefined,
                weaknesses: undefined,
                classes: []
            };
            return of(studentDetail);
        }
        
        // Nếu không tìm thấy, thử lấy từ mock data
        const mockData = this.mockStudentsDetail.find((s: StudentDetail) => s.id === id);
        if (mockData) {
            console.warn(`[UserService] Student ${id} not found in cache, using mock data`);
            return of(mockData);
        }
        
        console.warn(`[UserService] Student ${id} not found`);
        return of(undefined);
    }

    /**
     * Map BE StudentResponse to FE StudentDetail interface
     */
    private mapStudentResponseToDetail(beResponse: any): StudentDetail {
        return {
            // From Student base interface
            id: beResponse.id,
            email: beResponse.email || '',
            fullname: beResponse.fullName || '', // BE: fullName → FE: fullname
            phone: undefined, // FE-only, not in BE
            joinDate: beResponse.createdAt || beResponse.updatedAt || '', // Use createdAt from backend
            enrollmentCount: undefined, // FE-only, not in BE

            // StudentDetail specific fields
            avatar: beResponse.avatarUrl || undefined, // BE: avatarUrl → FE: avatar
            bio: beResponse.bio || undefined,
            dateOfBirth: beResponse.dateOfBirth ? beResponse.dateOfBirth.toString() : undefined,
            address: beResponse.address || undefined,
            city: beResponse.city || undefined,
            country: beResponse.country || undefined,
            learningGoals: beResponse.learningGoals || undefined,
            strengths: undefined, // FE-only
            weaknesses: undefined, // FE-only
            classes: [] // FE-only, need to fetch separately
        };
    }

    /**
     * Get mock instructor requests with pagination and filters
     * @param params Query parameters: status, subject, search, page, size
     * @returns PaginatedResponse<InstructorRequest>
     */
    private getMockInstructorRequests(params?: {
        status?: string;
        subject?: string;
        search?: string;
        page?: number;
        size?: number;
    }): PaginatedResponse<InstructorRequest> {
        let filtered = [...this.mockInstructorRequests];

        // Filter by status
        if (params?.status && params.status !== 'all') {
            const status = params.status;
            if (status === 'new') {
                filtered = filtered.filter(req => req.requestStatus === 'PENDING');
            } else if (status === 'edited') {
                filtered = filtered.filter(req => req.requestStatus === 'REQUEST_CHANGES');
            } else {
                filtered = filtered.filter(req => req.requestStatus === status.toUpperCase());
            }
        }

        // Filter by subject
        if (params?.subject && params.subject !== 'all') {
            // For mock data, skip subject filtering since we don't have subject names here
            // In real implementation, this would filter by subject names
        }

        // Filter by search term
        if (params?.search && params.search.trim()) {
            const searchLower = params.search.toLowerCase().trim();
            filtered = filtered.filter(req =>
                req.name.toLowerCase().includes(searchLower)
                // Subject search removed for mock data simplicity
            );
        }

        // Pagination
        const page = params?.page ?? 0;
        const size = params?.size ?? 5;
        const startIndex = page * size;
        const endIndex = startIndex + size;
        const paginatedContent = filtered.slice(startIndex, endIndex);
        const totalElements = filtered.length;
        const totalPages = Math.ceil(totalElements / size);

        return {
            content: paginatedContent,
            pageable: {
                pageNumber: page,
                pageSize: size,
                offset: startIndex,
                paged: true
            },
            totalPages: totalPages,
            totalElements: totalElements,
            last: page >= totalPages - 1,
            first: page === 0,
            numberOfElements: paginatedContent.length,
            size: size,
            number: page,
            empty: paginatedContent.length === 0
        };
    }

    /**
     * Get instructor requests with pagination and filters
     * @param params Query parameters: status, subject, search, page, size
     * @returns Observable of PaginatedResponse<InstructorRequest>
     */
    getInstructorRequests(params?: {
        status?: string;
        subject?: string;
        search?: string;
        page?: number;
        size?: number;
    }): Observable<PaginatedResponse<InstructorRequest>> {
        // Build query params
        const queryParams: any = {};
        if (params?.status && params.status !== 'all') queryParams.status = params.status;
        if (params?.subject && params.subject !== 'all') queryParams.subject = params.subject;
        if (params?.search) queryParams.search = params.search;
        if (params?.page !== undefined) queryParams.page = params.page;
        if (params?.size !== undefined) queryParams.size = params.size;

        // Gọi API thực - apiService.get() trả về ApiResponse<PaginatedResponse<InstructorRequestBackend>>
        return this.apiService.get<PaginatedResponse<InstructorRequestBackend>>('/tutors/requests', queryParams).pipe(
            map(response => {
                // Nếu API thành công → dùng dữ liệu API và map sang format frontend
                if (response.success && response.data) {
                    // Map backend response to frontend format
                    const mappedContent = response.data.content.map(mapBackendToInstructorRequest);
                    const mappedResponse: PaginatedResponse<InstructorRequest> = {
                        ...response.data,
                        content: mappedContent
                    };

                    // Update subject with mapped content array
                    this.instructorRequestsSubject.next(mappedContent);
                    return mappedResponse;
                }
                // Nếu API lỗi → trả về mock data
                console.warn('[UserService] API failed for instructor requests:', response.message);
                return this.getMockInstructorRequests(params);
            }),
            catchError(error => {
                // Nếu API throw error → trả về mock data
                console.warn('[UserService] API error for instructor requests:', error);
                return of(this.getMockInstructorRequests(params));
            })
        );
    }



    getInstructorRequestDetailObservable(requestId: string): Observable<InstructorRequestDetail | undefined> {
        // Thử lấy từ API - apiService.get() trả về ApiResponse<InstructorRequestDetail>
        return this.apiService.get<InstructorRequestDetail>(`/tutors/requests/${requestId}`).pipe(
            map(response => {
                // ✅ ƯU TIÊN: Xử lý data thật từ API
                if (response.success && response.data) {
                    return response.data;
                }
                // ⚠️ FALLBACK: Chỉ khi API trả về success=false
                const mockData = this.mockInstructorRequestsDetail.find(req => req.id === requestId);
                console.warn(`[UserService] API failed for instructor request detail ${requestId}:`, response.message);
                return mockData;
            }),
            catchError(error => {
                // ⚠️ FALLBACK: Chỉ khi API throw exception (network error, timeout)
                console.error(`[UserService] API error for instructor request detail ${requestId}:`, error);
                const mockData = this.mockInstructorRequestsDetail.find(req => req.id === requestId);
                return of(mockData);
            })
        );
    }

    /**
     * Lấy instructor request detail kết nối với TutorDetail đầy đủ từ API
     * Giống như hàm getTutorDetail() nhưng trả về Observable<InstructorRequest>
     * với instructor field là TutorDetail đầy đủ từ API
     */
    // getInstructorRequestDetailWithTutorData(instructorId: string): Observable<InstructorRequest | undefined> {
    //     // Lấy instructor request từ mock data
    //     const instructorRequest = this.getInstructorRequestDetail(instructorId);

    //     if (!instructorRequest) {
    //         return of(undefined);
    //     }

    //     // Call API để lấy tutor detail đầy đủ
    //     return this.apiService.get<TutorDetail>(`/tutors/${instructorId}`).pipe(
    //         map(response => {
    //             // Nếu API thành công → merge với instructor request
    //             if (response.success && response.data) {
    //                 return {
    //                     ...instructorRequest,
    //                     instructor: response.data
    //                 } as InstructorRequest;
    //             }

    //             // Nếu API lỗi → dùng mock data fallback
    //             const mockData = this.mockTutorsDetail.find((i: TutorDetail) => i.id === instructorId);
    //             if (mockData) {
    //                 console.warn(`[UserService] API failed for tutor detail ${instructorId}:`, response.message);
    //                 return {
    //                     ...instructorRequest,
    //                     instructor: mockData
    //                 } as InstructorRequest;
    //             }

    //             // Nếu không có mock data → trả về request gốc
    //             return instructorRequest;
    //         })
    //     );
    // }

    // TEMPORARY: Approve without levels parameter
    // approveInstructorRequest(tutorId: string, levels: string[]): Observable<boolean> {
    approveInstructorRequest(tutorId: string): Observable<boolean> {
        // Gọi API thực để approve instructor request - KHÔNG GỬI LEVELS
        // return this.apiService.post<boolean>(`/tutors/${tutorId}/approve`, { levels }).pipe(
        return this.apiService.post<boolean>(`/tutors/approve/${tutorId}`, {}).pipe(
            map(response => {
                // ✅ ƯU TIÊN: Xử lý data thật từ API
                if (response.success) {
                    const currentRequests = this.instructorRequestsSubject.value;
                    const updatedRequests = currentRequests.map(request => {
                        if (request.id === tutorId) {
                            return {
                                ...request,
                                requestStatus: 'APPROVED' as const,
                                reviewedAt: new Date().toISOString()
                            };
                        }
                        return request;
                    });
                    this.instructorRequestsSubject.next(updatedRequests);
                    return true;
                }
                // ⚠️ FALLBACK: Chỉ khi API trả về success=false
                console.warn(`[UserService] API failed to approve request ${tutorId}:`, response.message);
                return false;
            }),
            catchError(error => {
                // ⚠️ FALLBACK: Chỉ khi API throw exception - cập nhật local để UI vẫn hoạt động
                console.error(`[UserService] API error approving request ${tutorId}:`, error);
                const currentRequests = this.instructorRequestsSubject.value;
                const updatedRequests = currentRequests.map(request => {
                    if (request.id === tutorId) {
                        return {
                            ...request,
                            requestStatus: 'APPROVED' as const,
                            reviewedAt: new Date().toISOString()
                        };
                    }
                    return request;
                });
                this.instructorRequestsSubject.next(updatedRequests);
                return of(false);
            })
        );
    }

    rejectInstructorRequest(tutorId: string, reason?: string): Observable<boolean> {
        // Gọi API thực để reject instructor request
        return this.apiService.post<boolean>(`/tutors/${tutorId}/reject`, { reason }).pipe(
            map(response => {
                // ✅ ƯU TIÊN: Xử lý data thật từ API
                if (response.success) {
                    const currentRequests = this.instructorRequestsSubject.value;
                    const updatedRequests = currentRequests.map(request => {
                        if (request.id === tutorId) {
                            return {
                                ...request,
                                requestStatus: 'REJECTED' as const,
                                reviewedAt: new Date().toISOString()
                            };
                        }
                        return request;
                    });
                    this.instructorRequestsSubject.next(updatedRequests);
                    return true;
                }
                // ⚠️ FALLBACK: Chỉ khi API trả về success=false
                console.warn(`[UserService] API failed to reject request ${tutorId}:`, response.message);
                return false;
            }),
            catchError(error => {
                // ⚠️ FALLBACK: Chỉ khi API throw exception - cập nhật local để UI vẫn hoạt động
                console.error(`[UserService] API error rejecting request ${tutorId}:`, error);
                const currentRequests = this.instructorRequestsSubject.value;
                const updatedRequests = currentRequests.map(request => {
                    if (request.id === tutorId) {
                        return {
                            ...request,
                            requestStatus: 'REJECTED' as const,
                            reviewedAt: new Date().toISOString()
                        };
                    }
                    return request;
                });
                this.instructorRequestsSubject.next(updatedRequests);
                return of(false);
            })
        );
    }

    requestEditInstructorRequest(tutorId: string, reason: string): Observable<boolean> {
        // Gọi API thực để request edit instructor request
        return this.apiService.post<boolean>(`/tutors/${tutorId}/request-edit`, { reason }).pipe(
            map(response => {
                // ✅ ƯU TIÊN: Xử lý data thật từ API
                if (response.success) {
                    const currentRequests = this.instructorRequestsSubject.value;
                    const updatedRequests = currentRequests.map(request => {
                        if (request.id === tutorId) {
                            return {
                                ...request,
                                editRequestReason: reason
                            };
                        }
                        return request;
                    });
                    this.instructorRequestsSubject.next(updatedRequests);
                    return true;
                }
                // ⚠️ FALLBACK: Chỉ khi API trả về success=false
                console.warn(`[UserService] API failed to request edit for request ${tutorId}:`, response.message);
                return false;
            }),
            catchError(error => {
                // ⚠️ FALLBACK: Chỉ khi API throw exception - cập nhật local để UI vẫn hoạt động
                console.error(`[UserService] API error requesting edit for request ${tutorId}:`, error);
                const currentRequests = this.instructorRequestsSubject.value;
                const updatedRequests = currentRequests.map(request => {
                    if (request.id === tutorId) {
                        return {
                            ...request,
                            editRequestReason: reason
                        };
                    }
                    return request;
                });
                this.instructorRequestsSubject.next(updatedRequests);
                return of(false);
            })
        );
    }



    /**
     * Cập nhật thông tin tutor
     * API Endpoint: PATCH /api/v1/admin/tutors/:id
     */
    updateInstructor(id: string, data: Partial<TutorDetail>): Observable<TutorDetail | null> {
        return this.apiService.patch<TutorDetail>(`/tutor/${id}`, data).pipe(
            map(response => {
                // ✅ ƯU TIÊN: Xử lý data thật từ API
                if (response.success && response.data) {
                    // Cập nhật mock data in-memory để fallback lần sau
                    const index = this.mockTutorsDetail.findIndex(t => t.id === id);
                    if (index !== -1) {
                        this.mockTutorsDetail[index] = response.data;
                    }
                    return response.data;
                }
                // ⚠️ FALLBACK: Chỉ khi API trả về success=false
                console.warn(`[UserService] API failed to update instructor ${id}:`, response.message);
                return null;
            }),
            catchError(error => {
                // ⚠️ FALLBACK: Chỉ khi API throw exception - cập nhật local để UI vẫn hoạt động
                console.error(`[UserService] API error updating instructor ${id}:`, error);
                const instructorIndex = this.mockTutorsDetail.findIndex(t => t.id === id);
                if (instructorIndex !== -1) {
                    this.mockTutorsDetail[instructorIndex] = { ...this.mockTutorsDetail[instructorIndex], ...data };
                    return of(this.mockTutorsDetail[instructorIndex]);
                }
                return of(null);
            })
        );
    }

    /**
     * Cập nhật thông tin student
     * API Endpoint: PATCH /api/v1/admin/students/:id
     */
    updateStudent(id: string, data: Partial<Student>): Observable<Student | null> {
        return this.apiService.patch<Student>(`/student/${id}`, data).pipe(
            map(response => {
                // ✅ ƯU TIÊN: Xử lý data thật từ API
                if (response.success && response.data) {
                    // Cập nhật mock data in-memory
                    const index = this.mockStudents.findIndex(s => s.id === id);
                    if (index !== -1) {
                        this.mockStudents[index] = response.data;
                    }
                    return response.data;
                }
                // ⚠️ FALLBACK: Chỉ khi API trả về success=false
                console.warn(`[UserService] API failed to update student ${id}:`, response.message);
                return null;
            }),
            catchError(error => {
                // ⚠️ FALLBACK: Chỉ khi API throw exception - cập nhật local để UI vẫn hoạt động
                console.error(`[UserService] API error updating student ${id}:`, error);
                const studentIndex = this.mockStudents.findIndex(s => s.id === id);
                if (studentIndex !== -1) {
                    this.mockStudents[studentIndex] = { ...this.mockStudents[studentIndex], ...data };
                    return of(this.mockStudents[studentIndex]);
                }
                return of(null);
            })
        );
    }

    /**
     * Delete instructor via API
     * API Endpoint: DELETE /api/v1/admin/tutors/:id
     */
    deleteInstructor(id: string): Observable<void> {
        // ✅ GỌI API TRƯỚC
        return this.apiService.delete<void>(`/tutors/${id}`).pipe(
            map(response => {
                if (response.success) {
                    // ✅ Cập nhật local state SAU KHI API thành công
                    const currentInstructors = this.instructorsSubject.value.filter(instructor => instructor.id !== id);
                    this.instructorsSubject.next(currentInstructors);
                    // Also remove from mock data cache
                    this.mockTutors = this.mockTutors.filter(t => t.id !== id);
                    this.mockTutorsDetail = this.mockTutorsDetail.filter(t => t.id !== id);
                }
            }),
            catchError(error => {
                // ⚠️ FALLBACK: Cập nhật local nếu API lỗi (để UI vẫn hoạt động)
                console.error('[UserService] Delete instructor API error:', error);
                const currentInstructors = this.instructorsSubject.value.filter(instructor => instructor.id !== id);
                this.instructorsSubject.next(currentInstructors);
                // Also remove from mock data cache
                this.mockTutors = this.mockTutors.filter(t => t.id !== id);
                this.mockTutorsDetail = this.mockTutorsDetail.filter(t => t.id !== id);
                return of(void 0);
            })
        );
    }

    addInstructor(instructor: TutorDetail): void {
        const currentInstructors = this.instructorsSubject.value;
        const existingInstructor = currentInstructors.find(inst => inst.id === instructor.id);
        if (!existingInstructor) {
            const updatedMockTutors = [...currentInstructors, instructor];
            this.instructorsSubject.next(updatedMockTutors as Tutor[]);
            this.mockTutorsDetail.push(instructor);
        }
    }

    /**
     * Delete student via API
     * API Endpoint: DELETE /api/v1/admin/students/:id
     */
    deleteStudent(id: string): Observable<void> {
        // ✅ GỌI API TRƯỚC
        return this.apiService.delete<void>(`/students/${id}`).pipe(
            map(response => {
                if (response.success) {
                    // ✅ Cập nhật local state SAU KHI API thành công
                    const currentStudents = this.studentsSubject.value.filter(student => student.id !== id);
                    this.studentsSubject.next(currentStudents);
                    // Also remove from mock data cache
                    this.mockStudents = this.mockStudents.filter(s => s.id !== id);
                    this.mockStudentsDetail = this.mockStudentsDetail.filter(s => s.id !== id);
                }
            }),
            catchError(error => {
                // ⚠️ FALLBACK: Cập nhật local nếu API lỗi (để UI vẫn hoạt động)
                console.error('[UserService] Delete student API error:', error);
                const currentStudents = this.studentsSubject.value.filter(student => student.id !== id);
                this.studentsSubject.next(currentStudents);
                // Also remove from mock data cache
                this.mockStudents = this.mockStudents.filter(s => s.id !== id);
                this.mockStudentsDetail = this.mockStudentsDetail.filter(s => s.id !== id);
                return of(void 0);
            })
        );
    }

    searchInstructors(searchTerm: string): Observable<Tutor[]> {
        return new Observable(subscriber => {
            this.instructors$.subscribe(instructors => {
                if (!searchTerm.trim()) {
                    subscriber.next(instructors);
                } else {
                    const searchLower = searchTerm.toLowerCase().trim();
                    const filteredInstructors = instructors.filter(instructor =>
                        instructor.name.toLowerCase().includes(searchLower)
                    );
                    subscriber.next(filteredInstructors);
                }
            });
        });
    }

    searchStudents(searchTerm: string): Observable<Student[]> {
        return new Observable(subscriber => {
            this.students$.subscribe(students => {
                if (!searchTerm.trim()) {
                    subscriber.next(students);
                } else {
                    const searchLower = searchTerm.toLowerCase().trim();
                    const filteredStudents = students.filter(student =>
                        student.fullname.toLowerCase().includes(searchLower) ||
                        student.email.toLowerCase().includes(searchLower)
                    );
                    subscriber.next(filteredStudents);
                }
            });
        });
    }
}





