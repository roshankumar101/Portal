import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { applyToJob, getJob } from '../../services/jobs';
import { useAuth } from '../../context/AuthContext';

export default function JobDetail() {
  const { jobId } = useParams();
  const { user, role } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyMsg, setApplyMsg] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getJob(jobId);
        setJob(data);
      } catch (e) {
        setError('Failed to load job');
      } finally {
        setLoading(false);
      }
    })();
  }, [jobId]);

  const onApply = async () => {
    if (!user) return setApplyMsg('Please sign in to apply.');
    if (role !== 'student') return setApplyMsg('Only students can apply.');
    setApplyMsg('');
    setApplyLoading(true);
    try {
      await applyToJob(jobId, user.uid, {});
      setApplyMsg('Application submitted.');
    } catch {
      setApplyMsg('Failed to apply.');
    } finally {
      setApplyLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error || !job) return <div className="p-6 text-red-600">{error || 'Job not found'}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{job.title}</h1>
      <p className="text-gray-700">{job.company}</p>
      <p className="mt-2">CTC: {job.ctc}</p>
      <p className="mt-2">Location: {job.location}</p>
      <p className="mt-4 whitespace-pre-wrap">{job.description}</p>
      <div className="mt-6">
        <button onClick={onApply} disabled={applyLoading} className="bg-black text-white px-4 py-2 rounded disabled:opacity-60">
          {applyLoading ? 'Applying...' : 'Apply now'}
        </button>
        {applyMsg && <p className="mt-2 text-sm">{applyMsg}</p>}
      </div>
    </div>
  );
}


