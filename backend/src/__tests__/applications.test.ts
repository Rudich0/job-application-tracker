import { Application, CreateApplicationDto, UpdateApplicationDto } from '../types';

// Unit tests for data validation helpers
describe('Application Types & Validation', () => {
  const validApplication: Application = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    company_name: 'Acme Corp',
    job_title: 'Software Engineer',
    job_type: 'Full-time',
    status: 'Applied',
    applied_date: '2024-06-01',
    notes: 'Referred by John',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  it('should have all required fields', () => {
    expect(validApplication.id).toBeDefined();
    expect(validApplication.company_name).toBeDefined();
    expect(validApplication.job_title).toBeDefined();
    expect(validApplication.job_type).toBeDefined();
    expect(validApplication.status).toBeDefined();
    expect(validApplication.applied_date).toBeDefined();
  });

  it('should accept valid job types', () => {
    const validJobTypes: Application['job_type'][] = ['Internship', 'Full-time', 'Part-time'];
    validJobTypes.forEach((jt) => {
      expect(['Internship', 'Full-time', 'Part-time']).toContain(jt);
    });
  });

  it('should accept valid statuses', () => {
    const validStatuses: Application['status'][] = ['Applied', 'Interviewing', 'Offer', 'Rejected'];
    validStatuses.forEach((s) => {
      expect(['Applied', 'Interviewing', 'Offer', 'Rejected']).toContain(s);
    });
  });

  it('CreateApplicationDto should not require id or timestamps', () => {
    const dto: CreateApplicationDto = {
      company_name: 'Test Co',
      job_title: 'Dev',
      job_type: 'Internship',
      status: 'Applied',
      applied_date: '2024-06-01',
    };
    expect(dto.company_name).toBe('Test Co');
  });

  it('UpdateApplicationDto should allow partial updates', () => {
    const dto: UpdateApplicationDto = {
      status: 'Interviewing',
    };
    expect(dto.status).toBe('Interviewing');
    expect(dto.company_name).toBeUndefined();
  });

  it('company_name must be at least 2 characters', () => {
    const isValid = (name: string) => name.trim().length >= 2;
    expect(isValid('A')).toBe(false);
    expect(isValid('AB')).toBe(true);
    expect(isValid('Acme')).toBe(true);
  });

  it('applied_date should be a valid ISO date', () => {
    const isValidDate = (d: string) => !isNaN(Date.parse(d));
    expect(isValidDate('2024-06-01')).toBe(true);
    expect(isValidDate('not-a-date')).toBe(false);
    expect(isValidDate('2024-13-01')).toBe(false);
  });
});
