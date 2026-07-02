import React, { useContext, useEffect, useState } from 'react';
import styles from './style/Resume.module.scss';
import useResumeUpload from '../../hooks/useResumeUpload';
import * as resumeApi from '../../apis/resume.api';
import UploadBox from '../../components/UploadBox/UploadBox';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import Badge from '../../components/Badge/Badge';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import { NotificationContext } from '../../contexts/NotificationContext';
import { FiFileText, FiTrash2 } from 'react-icons/fi';

export const ResumeUpload = () => {
  const { showSuccess, showError } = useContext(NotificationContext);
  const { loading, uploadProgress, uploadCandidate } = useResumeUpload();
  const [activeResume, setActiveResume] = useState(null);
  const [loadLoading, setLoadLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchActiveResume = async () => {
    try {
      const response = await resumeApi.getMyResume();
      setActiveResume(response.data.resume);
    } catch (err) {
      if (err.response?.status === 404) {
        setActiveResume(null);
      } else {
        showError('Failed to load active resume details.');
      }
    } finally {
      setLoadLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveResume();
  }, []);

  const handleUpload = async (file) => {
    try {
      await uploadCandidate(file);
      showSuccess('Resume uploaded and preprocessed successfully!');
      fetchActiveResume();
    } catch (err) {
      showError(err.message || 'Upload failed');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await resumeApi.deleteResume(deleteId);
      showSuccess('Resume deleted successfully.');
      setActiveResume(null);
      setDeleteId(null);
    } catch (err) {
      showError(err.response?.data?.message || err.message || 'Failed to delete resume.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h3 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Manage Resume</h3>

      {loadLoading ? (
        <Card>Loading resume details...</Card>
      ) : activeResume ? (
        <Card title="Active CV / Resume">
          <div className={styles.activeResumeBox}>
            <div className="flex items-center gap-3">
              <FiFileText className="text-3xl text-primary" style={{ color: 'var(--primary)', fontSize: '2rem' }} />
              <div>
                <div className="font-semibold text-text" style={{ color: 'var(--text)' }}>
                  {activeResume.originalFileName || 'resume.pdf'}
                </div>
                <div className="text-xs text-text-muted mt-1" style={{ color: 'var(--text-muted)' }}>
                  Uploaded: {new Date(activeResume.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={activeResume.status === 'INDEXED' ? 'success' : 'info'}>
                {activeResume.status}
              </Badge>
              <Button
                variant="secondary"
                icon={FiTrash2}
                onClick={() => setDeleteId(activeResume.id)}
                style={{ color: 'var(--error)', borderColor: 'var(--border)' }}
              >
                Delete
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className={styles.uploadSection}>
          <h4 className="font-semibold text-sm mb-4" style={{ color: 'var(--text)' }}>Upload Active Resume</h4>
          <UploadBox
            multiple={false}
            onFilesSelected={handleUpload}
            disabled={loading}
          />
          {loading && (
            <div className="mt-6">
              <div className="flex justify-between text-sm text-text-muted mb-2" style={{ color: 'var(--text-muted)' }}>
                <span>Processing & running AI matching pipeline...</span>
                <span>{uploadProgress}%</span>
              </div>
              <ProgressBar progress={uploadProgress} />
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Resume?"
        message="This will delete your active resume and remove your vector matching score metadata. This action is permanent."
        loading={deleteLoading}
      />
    </div>
  );
};

export default ResumeUpload;
