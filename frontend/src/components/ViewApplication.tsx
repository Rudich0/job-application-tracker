import type { Application } from '../types';
import { StatusBadge } from './ui/StatusBadge';
import { format } from 'date-fns';

interface ViewApplicationProps {
  app: Application;
  onEdit: () => void;
}

export function ViewApplication({ app, onEdit }: ViewApplicationProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{app.company_name}</h3>
          <p className="text-gray-600 mt-0.5">{app.job_title}</p>
        </div>
        <StatusBadge status={app.status} />
      </div>

      <div className="grid grid-cols-2 gap-3 py-4 border-y border-gray-100">
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Job Type</p>
          <p className="mt-1 text-sm font-medium text-gray-700">{app.job_type}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Applied Date</p>
          <p className="mt-1 text-sm font-medium text-gray-700">
            {format(new Date(app.applied_date), 'MMMM d, yyyy')}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Added</p>
          <p className="mt-1 text-sm text-gray-700">
            {format(new Date(app.created_at), 'MMM d, yyyy')}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Last Updated</p>
          <p className="mt-1 text-sm text-gray-700">
            {format(new Date(app.updated_at), 'MMM d, yyyy')}
          </p>
        </div>
      </div>

      {app.notes && (
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1.5">Notes</p>
          <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 leading-relaxed">{app.notes}</p>
        </div>
      )}

      <button
        onClick={onEdit}
        className="w-full py-2.5 rounded-lg bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
      >
        Edit Application
      </button>
    </div>
  );
}
