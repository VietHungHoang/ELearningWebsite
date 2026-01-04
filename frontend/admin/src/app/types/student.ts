export interface StudentClass {
  id: string;
  className: string;
  tutor: string;
  enrolledDate: string;
  type: '1-1' | '1-n';
  price: number;
}

export interface Student {
  id: string;
  email: string;
  fullname: string;
  phone?: string;
  joinDate: string;
  enrollmentCount?: number; // Số lớp đang theo học
}

export interface StudentDetail extends Student {
avatar?: string;
  bio?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  country?: string;
  learningGoals?: string;
  strengths?: string;
  weaknesses?: string;
  classes: StudentClass[];
}
