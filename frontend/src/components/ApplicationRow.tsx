import type { Application } from '../types';
import { StatusBadge } from './ui/StatusBadge';
import { format } from 'date-fns';

interface ApplicationRowProps {
  app: Application;
  onView: (app: Application) => void;
  onEdit: (app: Application) => void;
  onDelete: (app: Application) => void;
}

export function ApplicationRow({ app, onView, onEdit, onDelete }: ApplicationRowProps) {
  const formattedDate = format(new Date(app.applied_date), 'MMM d, yyyy');

  return (
    <tr className="group hover:bg-indigo-50/30 transition-colors">
      <td className="px-4 py-3.5">
        <div className="font-medium text-gray-900 text-sm">{app.company_name}</div>
        <div className="text-xs text-gray-500 mt-0.5">{app.job_title}</div>
      </td>
      <td className="px-4 py-3.5 hidden md:table-cell">
        <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
          {app.job_type}
        </span>
      </td>
      <td className="px-4 py-3.5">
        <StatusBadge status={app.status} />
      </td>
      <td className="px-4 py-3.5 hidden sm:table-cell text-sm text-gray-600">
        {formattedDate}
      </td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-1 justify-end">
          <button onClick={() => onView(app)} title="View" className="p-1.5 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button onClick={() => onEdit(app)} title="Edit" className="p-1.5 rounded-md text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button onClick={() => onDelete(app)} title="Delete" className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
}
