// Các định nghĩa dùng chung cho User

// 1. Trạng thái Hồ sơ (Phục vụ quy trình Vetting 3 Tab)
export type ProfileStatus =
  | 'pending_approval'    // Mới / Nộp lại -> Hiện ở Tab 1 (Cần duyệt)
  | 'pending'             // Alias
  | 'changes_requested'   // Admin yêu cầu sửa -> Hiện ở Tab 2 (Đang chờ)
  | 'edit_requested'      // Alias
  | 'approved'            // Đã duyệt -> Hiện ở Tab 3 (Lịch sử/Public)
  | 'rejected';           // Từ chối -> Hiện ở Tab 3 (Lịch sử)

// 2. Cấp độ Gia sư (Admin đánh giá dựa trên Thâm niên & Học vị)
export type InstructorLevel =
  | 'Beginner'      // Under 1 year
  | 'beginner'
  | 'Intermediate'  // 1-3 years
  | 'intermediate'
  | 'Senior'        // Over 3 years
  | 'senior'
  | 'Master'        // Master's Degree
  | 'master'
  | 'Doctor'        // PhD Degree
  | 'doctor'
  | 'expert';       // Alias

// 3. Cấu trúc File (Dùng cho Avatar, CV, Chứng chỉ)
export interface Attachment {
  id: string;
  fileName: string;     // VD: "CV_NguyenVanA.pdf"
  fileUrl: string;      // URL từ S3/Cloudinary
  fileSize?: number;    // bytes
  uploadDate: string;   // ISO Date
  isVerified?: boolean; // Admin đã kiểm tra file này chưa
}

// 4. Cấu trúc Chuyên môn (Mapping Category -> Subject)
export interface TutorSpecialization {
  categoryId: string;   // ID Danh mục cha (VD: "cat_it")
  categoryName: string; // Tên hiển thị (VD: "Lập trình & CNTT")
  subjectId: string;    // ID Môn học con (VD: "subj_python")
  subjectName: string;  // Tên hiển thị (VD: "Python")
  tags?: string[];      // VD: ["Django", "ReactJS"] - Kỹ năng ngách
}

// 5. Cấu trúc Lớp học (Dùng chung)
export interface Class {
  id: string;
  title: string;
  description: string;
  price: number;
  studentsEnrolled: number;
  rating: number;
  instructor_name?: string;
}
