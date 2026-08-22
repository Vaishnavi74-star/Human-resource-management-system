export type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type StatusType = 'success' | 'warning' | 'error' | 'info' | 'neutral';

export interface BaseProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
