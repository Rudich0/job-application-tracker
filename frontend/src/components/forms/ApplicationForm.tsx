import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Application, CreateApplicationDto } from '../../types';
import { JOB_TYPES, APPLICATION_STATUSES } from '../../types';

interface ApplicationFormProps {
  initial?: Partial<Application>;
  onSubmit: (data: CreateApplicationDto) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

interface FormErrors {
  company_name?: string;
  job_title?: string;
  applied_date?: string;
}

const today = new Date().toISOString().split('T')[0];

export function ApplicationForm({ initial, onSubmit, onCancel, submitLabel = 'Save' }: ApplicationFormProps) {
  const [form, setForm] = useState<CreateApplicationDto>({
    company_name: initial?.company_name ?? '',
    job_title: initial?.job_title ?? '',
    job_type: initial?.job_type ?? 'Internship',
    status: initial?.status ?? 'Applied',
    applied_date: initial?.applied_date?.split('T')[0] ?? today,
    notes: initial?.notes ?? '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (form.company_name.trim().length < 2) e.company_name = 'Company name must be at least 2 characters';
    if (!form.job_title.trim()) e.job_title = 'Job title is required';
    if (!form.applied_date) e.applied_date = 'Applied date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setSubmitting(false);
    }
  };

  const field = (key: keyof CreateApplicationDto, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (key in errors) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const inputCls = (err?: string) =>
    `w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
      err ? 'border-red-400' : 'border-gray-300'
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Company Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.company_name}
          onChange={(e) => field('company_name', e.target.value)}
          placeholder="e.g. Anthropic"
          className={inputCls(errors.company_name)}
        />
        {errors.company_name && <p className="mt-1 text-xs text-red-500">{errors.company_name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Job Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.job_title}
          onChange={(e) => field('job_title', e.target.value)}
          placeholder="e.g. Software Engineer Intern"
          className={inputCls(errors.job_title)}
        />
        {errors.job_title && <p className="mt-1 text-xs text-red-500">{errors.job_title}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Type <span className="text-red-500">*</span></label>
          <select value={form.job_type} onChange={(e) => field('job_type', e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
            {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Status <span className="text-red-500">*</span></label>
          <select value={form.status} onChange={(e) => field('status', e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
            {APPLICATION_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Applied Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={form.applied_date}
          onChange={(e) => field('applied_date', e.target.value)}
          max={today}
          className={inputCls(errors.applied_date)}
        />
        {errors.applied_date && <p className="mt-1 text-xs text-red-500">{errors.applied_date}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Notes <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={form.notes}
          onChange={(e) => field('notes', e.target.value)}
          placeholder="Add any notes about this application..."
          rows={3}
          className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
      </div>

      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={submitting} className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors">
          {submitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
