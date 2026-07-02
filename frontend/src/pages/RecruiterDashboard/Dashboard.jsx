import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './style/Dashboard.module.scss';
import { FiBriefcase, FiUploadCloud } from 'react-icons/fi';
import axiosInstance from '../../apis/axios';
import useJobs from '../../hooks/useJobs';
import Card from '../../components/Card/Card';
import Loader from '../../components/Loader/Loader';

export const Dashboard = () => {
  const { jobs, loading: jobsLoading, fetchJobs } = useJobs();
  const [aiStatus, setAiStatus] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  useEffect(() => {
    fetchJobs();

    const fetchAiStatus = async () => {
      try {
        const response = await axiosInstance.get('/ai/status');
        setAiStatus(response.data.status);
      } catch (err) {
        console.error('Failed to fetch AI status:', err);
      } finally {
        setLoadingStatus(false);
      }
    };
    fetchAiStatus();
  }, [fetchJobs]);

  return (
    <div>
      <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--text)' }}>Recruiter Dashboard</h3>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <FiBriefcase className={styles.statIcon} />
          <div>
            <div className={styles.statVal}>{jobsLoading ? '...' : jobs.length}</div>
            <div className={styles.statLabel}>Active Jobs</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <FiUploadCloud className={styles.statIcon} style={{ color: 'var(--secondary)' }} />
          <div>
            <div className={styles.statVal}>Search Pool</div>
            <div className={styles.statLabel}>AI Preprocessed</div>
          </div>
        </div>
      </div>

      {/* AI Services Status */}
      <div className={styles.healthContainer}>
        <h4 className="font-semibold animate-pulse" style={{ color: 'var(--text)' }}>External Services Health</h4>
        <p className="text-xs text-text-muted" style={{ color: 'var(--text-muted)' }}>
          Validates that AI API endpoints are reachable.
        </p>
        {loadingStatus ? (
          <Loader text="Querying service endpoints..." />
        ) : (
          <div className={styles.healthGrid}>
            <div className={styles.healthIndicator}>
              <div className={`${styles.dot} ${aiStatus?.gemini ? styles.online : styles.offline}`} />
              <span>Gemini 2.0 (Primary)</span>
            </div>
            <div className={styles.healthIndicator}>
              <div className={`${styles.dot} ${aiStatus?.groq ? styles.online : styles.offline}`} />
              <span>Groq Llama 3 (Fallback)</span>
            </div>
            <div className={styles.healthIndicator}>
              <div className={`${styles.dot} ${aiStatus?.qdrant ? styles.online : styles.offline}`} />
              <span>Qdrant (Vector DB)</span>
            </div>
          </div>
        )}
      </div>

      {/* Active Jobs Grid */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-lg" style={{ color: 'var(--text)' }}>Recent Job Listings</h4>
          <Link to="/recruiter/jobs/create" className="text-sm font-semibold text-primary hover:underline" style={{ color: 'var(--primary)' }}>
            + Create New Job
          </Link>
        </div>
        {jobsLoading ? (
          <Loader text="Fetching listings..." />
        ) : jobs.length === 0 ? (
          <Card>
            <p className="text-center text-text-muted py-6" style={{ color: 'var(--text-muted)' }}>
              No job postings yet. Get started by creating your first post.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.slice(0, 3).map((job) => (
              <Card key={job.id} title={job.title} subtitle={job.department || 'General'}>
                <p className="text-sm text-text-muted line-clamp-3 mb-4" style={{ color: 'var(--text-muted)' }}>
                  {job.description}
                </p>
                <div className="flex justify-between items-center text-xs text-text-muted mt-4 pt-4 border-t border-border" style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  <span>{job.location || 'Remote'}</span>
                  <Link to={`/recruiter/ranking`} state={{ jobId: job.id }} className="text-primary hover:underline font-semibold" style={{ color: 'var(--primary)' }}>
                    View Rankings
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
