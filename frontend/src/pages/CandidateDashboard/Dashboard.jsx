import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import * as resumeApi from '../../apis/resume.api';
import Card from '../../components/Card/Card';
import Badge from '../../components/Badge/Badge';
import Chip from '../../components/Chip/Chip';
import Loader from '../../components/Loader/Loader';
import Button from '../../components/Button/Button';
import { FiFileText, FiAlertTriangle } from 'react-icons/fi';
import { NotificationContext } from '../../contexts/NotificationContext';

export const Dashboard = () => {
  const { user } = useAuth();
  const { showError } = useContext(NotificationContext);
  const [activeResume, setActiveResume] = useState(null);
  const [aiProfile, setAiProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResumeData = async () => {
      try {
        const response = await resumeApi.getMyResume();
        setActiveResume(response.data.resume);
        setAiProfile(response.data.aiProfile);
      } catch (err) {
        if (err.response?.status !== 404) {
          showError('Failed to fetch resume status.');
        }
      } finally {
        setLoading(false);
      }
    };
    loadResumeData();
  }, [showError]);

  if (loading) {
    return <Loader text="Loading candidate hub details..." />;
  }

  return (
    <div className="max-w-4xl">
      <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--text)' }}>
        Candidate Hub
      </h3>

      <Card title={`Welcome, ${user?.firstName || 'Candidate'}!`} className="mb-6">
        <p className="text-sm text-text-muted mb-0" style={{ color: 'var(--text-muted)' }}>
          Manage your active job applications, upload your resume, and check out your AI extracted professional summaries.
        </p>
      </Card>

      {!activeResume ? (
        <Card variant="warning" className="mb-6">
          <div className="flex items-center gap-3">
            <FiAlertTriangle className="text-3xl" style={{ color: 'var(--warning)', fontSize: '2rem' }} />
            <div>
              <h4 className="font-semibold text-base" style={{ color: 'var(--text)' }}>No Active Resume Uploaded</h4>
              <p className="text-xs text-text-muted mb-3" style={{ color: 'var(--text-muted)' }}>
                Upload your resume in PDF or DOCX format to index it in our semantic matching engine.
              </p>
              <Link to="/candidate/resume">
                <Button size="sm">Upload Now</Button>
              </Link>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="Active Resume" className="md:col-span-1">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <FiFileText className="text-2xl" style={{ color: 'var(--primary)', fontSize: '1.5rem' }} />
                <span className="font-semibold text-sm truncate" style={{ color: 'var(--text)', maxWidth: '150px' }}>
                  {activeResume.originalFileName || 'resume.pdf'}
                </span>
              </div>
              <div>
                <div className="text-xs text-text-muted mb-1" style={{ color: 'var(--text-muted)' }}>Pipeline Status</div>
                <Badge variant={activeResume.status === 'INDEXED' ? 'success' : activeResume.status === 'FAILED' ? 'error' : 'info'}>
                  {activeResume.status}
                </Badge>
              </div>
              <div className="text-xs text-text-muted border-t pt-4 mt-2" style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                Updated: {new Date(activeResume.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </Card>

          <Card title="AI Profile Summary" className="md:col-span-2">
            {aiProfile ? (
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <Badge variant="info">{aiProfile.seniorityLevel || 'Mid'} Level</Badge>
                  <Badge variant="success">{aiProfile.totalExperienceYears || 0} Yrs Exp</Badge>
                </div>
                <p className="text-sm text-text-muted leading-relaxed mb-0" style={{ color: 'var(--text-muted)' }}>
                  {aiProfile.summary || 'Profile summary parsed from resume.'}
                </p>
                <div>
                  <div className="text-xs font-semibold text-text mb-2" style={{ color: 'var(--text)' }}>Top Extracted Skills</div>
                  <div className="flex flex-wrap gap-1.5">
                    {aiProfile.topSkills?.slice(0, 5).map((skill) => (
                      <Chip key={skill} label={skill} className="text-xs" />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-text-muted py-4 mb-0" style={{ color: 'var(--text-muted)' }}>
                Resume is currently parsing. AI insights will appear here shortly.
              </p>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
