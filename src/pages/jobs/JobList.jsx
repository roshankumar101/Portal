import React, { useEffect, useState } from 'react';
import { subscribeJobs } from '../../services/jobs';
import { Link } from 'react-router-dom';

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    
    const unsubscribe = subscribeJobs((jobsData) => {
      setJobs(jobsData || []);
      setLoading(false);
    }, { status: 'active' });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  if (loading) return <div className="p-6">Loading jobs...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Job Openings</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <Link key={job.id} to={`/jobs/${job.id}`} className="border rounded p-4 hover:shadow">
            <h2 className="font-semibold">{job.title}</h2>
            <p className="text-sm text-gray-600">{job.company}</p>
            <p className="text-sm">CTC: {job.ctc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}


