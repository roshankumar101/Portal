import React, { useEffect, useMemo, useState } from 'react';
import { listJobs, createJob, deleteJob, subscribeJobs, postJob } from '../../../services/jobs';
import { useAuth } from '../../../hooks/useAuth';
import { Plus, Loader, Trash2, Send } from 'lucide-react';

export default function ManageJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [postingJobs, setPostingJobs] = useState(new Set());
  const [form, setForm] = useState({
    jobTitle: '',
    location: '',
    jobType: 'Full-time',
    experienceLevel: 'Fresher',
    salary: 600000,
    applicationDeadline: '',
    skills: '', // comma separated
    eligibilityCriteria: '',
    isActive: true,
  });

  const canCreate = useMemo(() => {
    return form.jobTitle.trim() && form.location.trim() && form.applicationDeadline;
  }, [form]);

  const refresh = async () => {
    try {
      setLoading(true);
      const data = await listJobs();
      setJobs(data);
    } catch (e) {
      console.error('Failed to load jobs', e);
      alert('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeJobs((jobsList) => {
      setJobs(jobsList);
      setLoading(false);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handlePostJob = async (jobId) => {
    if (postingJobs.has(jobId)) return;
    
    try {
      setPostingJobs(prev => new Set([...prev, jobId]));
      await postJob(jobId);
      // Job will update via real-time subscription
    } catch (err) {
      console.error('Failed to post job:', err);
      alert('Failed to post job: ' + (err?.message || 'Unknown error'));
    } finally {
      setPostingJobs(prev => {
        const newSet = new Set(prev);
        newSet.delete(jobId);
        return newSet;
      });
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!user?.uid) {
      alert('You must be logged in as admin.');
      return;
    }
    if (!canCreate) return;

    try {
      setCreating(true);
      const payload = {
        jobTitle: form.jobTitle.trim(),
        location: form.location.trim(),
        jobType: form.jobType,
        experienceLevel: form.experienceLevel,
        salary: Number(form.salary) || 0,
        applicationDeadline: new Date(form.applicationDeadline).toISOString(),
        skills: form.skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        eligibilityCriteria: form.eligibilityCriteria.trim(),
        isActive: Boolean(form.isActive),
        postedDate: new Date().toISOString(),
      };
      await createJob(user.uid, payload);
      setForm({
        jobTitle: '',
        location: '',
        jobType: 'Full-time',
        experienceLevel: 'Fresher',
        salary: 600000,
        applicationDeadline: '',
        skills: '',
        eligibilityCriteria: '',
        isActive: true,
      });
      await refresh();
    } catch (e) {
      console.error('Failed to create job', e);
      alert('Failed to create job: ' + (e?.message || 'Unknown error'));
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!jobId) return;
    if (!confirm('Delete this job?')) return;
    try {
      await deleteJob(jobId);
      await refresh();
    } catch (e) {
      console.error('Failed to delete job', e);
      alert('Failed to delete job');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Manage Jobs</h2>
          <p className="text-sm text-slate-600">Create, list and manage job postings</p>
        </div>
      </div>

      {/* Create form */}
      <form onSubmit={handleCreate} className="bg-white border border-slate-200 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <input
          className="border rounded-md px-3 py-2 text-sm"
          placeholder="Job title"
          value={form.jobTitle}
          onChange={(e) => setForm((f) => ({ ...f, jobTitle: e.target.value }))}
        />
        <input
          className="border rounded-md px-3 py-2 text-sm"
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
        />
        <select
          className="border rounded-md px-3 py-2 text-sm"
          value={form.jobType}
          onChange={(e) => setForm((f) => ({ ...f, jobType: e.target.value }))}
        >
          <option>Full-time</option>
          <option>Internship</option>
          <option>Contract</option>
        </select>
        <select
          className="border rounded-md px-3 py-2 text-sm"
          value={form.experienceLevel}
          onChange={(e) => setForm((f) => ({ ...f, experienceLevel: e.target.value }))}
        >
          <option>Fresher</option>
          <option>Junior</option>
          <option>Mid</option>
          <option>Senior</option>
        </select>
        <input
          type="number"
          className="border rounded-md px-3 py-2 text-sm"
          placeholder="Salary (₹)"
          value={form.salary}
          onChange={(e) => setForm((f) => ({ ...f, salary: e.target.value }))}
        />
        <input
          type="date"
          className="border rounded-md px-3 py-2 text-sm"
          value={form.applicationDeadline}
          onChange={(e) => setForm((f) => ({ ...f, applicationDeadline: e.target.value }))}
        />
        <input
          className="border rounded-md px-3 py-2 text-sm md:col-span-2"
          placeholder="Skills (comma separated)"
          value={form.skills}
          onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))}
        />
        <input
          className="border rounded-md px-3 py-2 text-sm md:col-span-2"
          placeholder="Eligibility criteria"
          value={form.eligibilityCriteria}
          onChange={(e) => setForm((f) => ({ ...f, eligibilityCriteria: e.target.value }))}
        />
        <div className="flex items-center gap-2">
          <input
            id="isActive"
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
          />
          <label htmlFor="isActive" className="text-sm">Active</label>
        </div>
        <div className="md:col-span-1 lg:col-span-1">
          <button
            type="submit"
            disabled={!canCreate || creating}
            className={`w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm text-white ${
              !canCreate || creating ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {creating ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Create Job
          </button>
        </div>
      </form>

      {/* Jobs list */}
      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-semibold">Jobs ({jobs.length})</h3>
          {loading && (
            <div className="inline-flex items-center gap-2 text-sm text-slate-500">
              <Loader className="w-4 h-4 animate-spin" /> Loading
            </div>
          )}
        </div>
        <div className="divide-y">
          {jobs.length === 0 && !loading && (
            <div className="p-6 text-slate-500 text-sm">No jobs yet.</div>
          )}
          {jobs.map((job) => (
            <div key={job.id} className="p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="font-medium text-slate-900">{job.jobTitle || job.company}</div>
                  {job.status && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      job.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {job.status === 'active' ? 'Posted' : 'Draft'}
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-600">
                  {job.company ? job.company + ' • ' : ''}
                  {job.companyLocation || job.location} • {job.jobType} • {job.workMode}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {job.status === 'draft' && (
                  <button
                    onClick={() => handlePostJob(job.id)}
                    disabled={postingJobs.has(job.id)}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                      postingJobs.has(job.id)
                        ? 'bg-blue-200 text-blue-500 cursor-not-allowed'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                    }`}
                  >
                    {postingJobs.has(job.id) ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Post
                  </button>
                )}
                <button
                  onClick={() => handleDelete(job.id)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
