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

export interface UpdateApplicationDto {
  company_name?: string;
  job_title?: string;
  job_type?: JobType;
  status?: ApplicationStatus;
  applied_date?: string;
  notes?: string;
}

export interface ListApplicationsQuery {
  status?: ApplicationStatus;
  search?: string;
  page?: string;
  limit?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
