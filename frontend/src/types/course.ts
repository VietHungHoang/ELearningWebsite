export interface BasicCreationCourse {
  title: string;
  category: string;
  level: string;
}


// Category interface
export interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string; // icon key/name - backend returns key, frontend maps to actual icon
}

export interface StepCardProps {
  step: number;
  title: string;
  description: string;
}

export interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}