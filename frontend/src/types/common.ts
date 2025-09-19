// API Response wrapper interface matching Java backend
export interface ApiResponse<T> {
  status: number;
  data: T;
  message: string;
}
