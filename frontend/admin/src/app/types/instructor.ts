
export interface Tutor {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  rating: number;
  countryCode?: string;
  currentSessionFee?: number;
}


export interface TutorDetail extends Tutor {
  avatarUrl: string;
  timezone?: string;
  gender?: 'MALE' | 'FEMALE' | 'NOT SPECIFIED';
  languages: TutorLanguage[];
  totalHours?: number; // FE-only, set null if BE doesn't provide
  submittedDate?: string; // FE-only, set null if BE doesn't provide
  initialPrice?: number;
  headline?: string;
  introduction?: string;
  totalStudents?: number;
  totalReviews?: number;
  subjects?: TutorSubject[];
  instructorLevel?: string[]; // FE-only, set null if BE doesn't provide
  experience?: number; // FE-only, set null if BE doesn't provide
  certifications?: Certification[];
  classes?: TutorClass[]; // FE-only, set null if BE doesn't provide
  availableSchedule?: { [key: string]: string[] }; // FE-only
  isVerified?: boolean;
  videoUrl?: string;
  videoThumbnailUrl?: string; // FE-only
  currentSessionFee?: number;
  socialLinks?: TutorSocial[];
  careerEntries?: CareerEntry[];
  availabilities?: TutorAvailability[]; // FE-only

  // BE-only fields (not displayed in UI but available for use)
  bookedSessionsCount?: number;
  reviews?: TutorReview[];
  zoomConnected?: boolean;
  originalSessionFee?: number;
  subjectIds?: string[]; // Raw subject IDs from BE
}
export interface TutorLanguage {
  languageCode: string;
  isNative: boolean;
}

export interface TutorReview {
  studentId: string;
  rating: number;
  comment?: string;
}

export interface TutorSubject {
  categoryId: string;
  subjectName: string;
}

export interface Certification {
  id: string;
  name: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  issuingOrganization: string;
}

export interface CareerEntry {
  id: string;
  type: 'EDUCATION' | 'EXPERIENCE';
  title: string;
  institution: string;
  startDate: string;
  endDate?: string;
  location?: string;
  description?: string;
}
export interface TutorSocial {
  id: string;
  platform: string; // facebook, instagram, linkedin
  url: string;
}

export interface TutorAvailability {
  id: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday ...
  startTime: string; // 'HH:mm'
  endTime: string;   // 'HH:mm'
  effectiveStartDate: string;
  effectiveEndDate?: string;
  status: 'AVAILABLE' | 'DELETED';
}

export interface TutorClass {
  id: string;
  title: string;
  rating: number;
  enrollmentCount: number;
  pricePerHour?: number;
  classType?: string;
}
// Backward compatibility - keep old names for existing code
export type tutor = Tutor;
export type tutorDetail = TutorDetail;
