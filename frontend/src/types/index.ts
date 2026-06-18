export type JobType = 'Internship' | 'Full-time' | 'Part-time';
export type ApplicationStatus = 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';

export interface Application {
  id: string;
  company_name: string;
  job_title: string;
  job_type: JobType;
  status: ApplicationStatus;
  applied_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateApplicationDto {
  company_name: string;
  job_title: string;
  job_type: JobType;
  status: ApplicationStatus;
  applied_date: string;
  notes?: string;
}

export type UpdateApplicationDto = Partial<CreateApplicationDto>;

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ListApplicationsParams {
  status?: ApplicationStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export const JOB_TYPES: JobType[] = ['Internship', 'Full-time', 'Part-time'];
export const APPLICATION_STATUSES: ApplicationStatus[] = ['Applied', 'Interviewing', 'Offer', 'Rejected'];

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  Applied: '#3b82f6',
  Interviewing: '#f59e0b',
  Offer: '#10b981',
  Rejected: '#ef4444',
};
