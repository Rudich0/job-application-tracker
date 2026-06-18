import { useState, useCallback } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import type { Application, ApplicationStatus, CreateApplicationDto } from './types';
import { APPLICATION_STATUSES } from './types';
import { applicationsApi } from './api/applications';
import { useApplications } from './hooks/useApplications';
import { ApplicationRow } from './components/ApplicationRow';
import { ApplicationForm } from './components/forms/ApplicationForm';
import { ViewApplication } from './components/ViewApplication';
import { Modal } from './components/ui/Modal';
import { ConfirmDialog } from './components/ui/ConfirmDialog';

type ModalMode = 'add' | 'edit' | 'view' | null;

const STATUS_FILTER_LABELS: Record<string, string> = {
  '': 'All',
  Applied: 'Applied',
  Interviewing: 'Interviewing',
  Offer: 'Offer',
  Rejected: 'Rejected',
};

export default function App() {
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | ''>('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Application | null>(null);
  const [searchTimer, setSearchTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const { data, loading, error, refetch } = useApplications({
    status: statusFilter || undefined,
    search: debouncedSearch || undefined,
    page,
    limit: 20,
  });

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    if (searchTimer) clearTimeout(searchTimer);
    const timer = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 400);
    setSearchTimer(timer);
  }, [searchTimer]);

  const handleStatusFilter = (s: ApplicationStatus | '') => {
    setStatusFilter(s);
    setPage(1);
  };

  const openAdd = () => {
    setSelectedApp(null);
    setModalMode('add');
  };
  const openView = (app: Application) => { setSelectedApp(app); setModalMode('view'); };
  const openEdit = (app: Application) => { setSelectedApp(app); setModalMode('edit'); };
  const closeModal = () => { setModalMode(null); setSelectedApp(null); };

  const handleCreate = async (dto: CreateApplicationDto) => {
    try {
      await applicationsApi.create(dto);
      toast.success('Application added!');
      closeModal();
      refetch();
    } catch (e) {
      toast.error((e as Error).message);
      throw e;
    }
  };

  const handleUpdate = async (dto: CreateApplicationDto) => {
    if (!selectedApp) return;
    try {
      await applicationsApi.update(selectedApp.id, dto);
      toast.success('Application updated!');
      closeModal();
      refetch();
    } catch (e) {
      toast.error((e as Error).message);
      throw e;
    }
  };

  const confirmDelete = (app: Application) => setDeleteTarget(app);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await applicationsApi.delete(deleteTarget.id);
      toast.success('Application deleted');
      setDeleteTarget(null);
      refetch();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const applications = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="font-semibold text-gray-900 text-sm">JobTracker</span>
          </div>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Application
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Page title + stats */}
        <div className="mb-5">
          <h1 className="text-xl font-bold text-gray-900">Applications</h1>
          {!loading && (
            <p className="text-sm text-gray-500 mt-0.5">
              {total === 0 ? 'No applications yet' : `${total} application${total !== 1 ? 's' : ''} total`}
            </p>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search company or job title…"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Status filter pills */}
          <div className="flex gap-1.5 flex-wrap">
            {(['', ...APPLICATION_STATUSES] as (ApplicationStatus | '')[]).map((s) => (
              <button
                key={s || 'all'}
                onClick={() => handleStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                  statusFilter === s
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {STATUS_FILTER_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-400">Loading applications…</p>
            </div>
          ) : error ? (
            <div className="py-16 flex flex-col items-center justify-center gap-2 text-center px-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-700">Failed to load applications</p>
              <p className="text-xs text-gray-400">{error}</p>
              <button onClick={refetch} className="mt-1 text-xs text-indigo-600 hover:underline">Try again</button>
            </div>
          ) : applications.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center gap-2 text-center px-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-700">
                {debouncedSearch || statusFilter ? 'No applications match your filters' : 'No applications yet'}
              </p>
              <p className="text-xs text-gray-400">
                {debouncedSearch || statusFilter ? 'Try adjusting your search or filter.' : 'Add your first application to get started.'}
              </p>
              {!debouncedSearch && !statusFilter && (
                <button
                  onClick={openAdd}
                  className="mt-2 text-xs font-medium text-indigo-600 hover:underline"
                >
                  Add Application
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-100">
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Company / Role</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Type</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Applied</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {applications.map((app) => (
                    <ApplicationRow
                      key={app.id}
                      app={app}
                      onView={openView}
                      onEdit={openEdit}
                      onDelete={confirmDelete}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Add modal */}
      <Modal open={modalMode === 'add'} title="Add Application" onClose={closeModal}>
        <ApplicationForm onSubmit={handleCreate} onCancel={closeModal} submitLabel="Add Application" />
      </Modal>

      {/* Edit modal */}
      <Modal open={modalMode === 'edit'} title="Edit Application" onClose={closeModal}>
        {selectedApp && (
          <ApplicationForm
            initial={selectedApp}
            onSubmit={handleUpdate}
            onCancel={closeModal}
            submitLabel="Save Changes"
          />
        )}
      </Modal>

      {/* View modal */}
      <Modal open={modalMode === 'view'} title="Application Details" onClose={closeModal}>
        {selectedApp && (
          <ViewApplication
            app={selectedApp}
            onEdit={() => { openEdit(selectedApp); }}
          />
        )}
      </Modal>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Application"
        message={deleteTarget ? `Remove the application to ${deleteTarget.company_name} for ${deleteTarget.job_title}? This cannot be undone.` : ''}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
