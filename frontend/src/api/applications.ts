import axios from 'axios';
import type {
  Application,
  CreateApplicationDto,
  UpdateApplicationDto,
  PaginatedResponse,
  ListApplicationsParams,
} from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.errors?.[0]?.msg ??
      err.response?.data?.error ??
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  },
);

export const applicationsApi = {
  list: (params?: ListApplicationsParams) =>
    api.get<PaginatedResponse<Application>>('/applications', { params }).then((r) => r.data),

  get: (id: string) =>
    api.get<Application>(`/applications/${id}`).then((r) => r.data),

  create: (dto: CreateApplicationDto) =>
    api.post<Application>('/applications', dto).then((r) => r.data),

  update: (id: string, dto: UpdateApplicationDto) =>
    api.patch<Application>(`/applications/${id}`, dto).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/applications/${id}`).then((r) => r.data),
};
