// Success Response
export interface SuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Error response
export interface ErrorResponse<T> {
  success: boolean;
  message: string;
  error_code: string;
  details: T;
}
// Meta type
interface Meta {
  page_no: number;
  page_size: number;
  limit: number;
  has_next: boolean;
  has_previous: boolean;
  total: number;
  filtered_total: number;
}
// Paginated response
export interface PaginatedResponse<T> {
  meta: Meta;
  data: T;
}
