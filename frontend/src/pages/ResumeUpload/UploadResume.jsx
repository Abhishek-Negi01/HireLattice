import React, { useContext, useState } from 'react';
import styles from './style/Upload.module.scss';
import useResumeUpload from '../../hooks/useResumeUpload';
import UploadBox from '../../components/UploadBox/UploadBox';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import Badge from '../../components/Badge/Badge';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import { NotificationContext } from '../../contexts/NotificationContext';
import { FiCheckCircle, FiAlertCircle, FiClock, FiFileText } from 'react-icons/fi';

export const UploadResume = () => {
  const [activeTab, setActiveTab] = useState('bulk'); // 'bulk', 'zip', 'single'
  const { showSuccess, showError, showWarning } = useContext(NotificationContext);
  const {
    loading,
    error,
    uploadProgress,
    uploadQueue,
    bulkResult,
    uploadRecruiterSingle,
    uploadRecruiterBulk,
    uploadRecruiterZip,
    resetQueue,
  } = useResumeUpload();

  const [candidateId, setCandidateId] = useState('');
  const [singleFile, setSingleFile] = useState(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    resetQueue();
    setCandidateId('');
    setSingleFile(null);
  };

  const handleBulkUpload = async (files) => {
    try {
      const result = await uploadRecruiterBulk(files);
      showSuccess(`Bulk upload completed! Passed: ${result.passed}, Failed: ${result.failed}`);
    } catch (err) {
      showError(err.message || 'Failed to upload bulk resumes');
    }
  };

  const handleZipUpload = async (file) => {
    try {
      const result = await uploadRecruiterZip(file);
      showSuccess(`ZIP uploaded and processed!`);
    } catch (err) {
      showError(err.message || 'ZIP upload failed');
    }
  };

  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    if (!singleFile) {
      showWarning('Please drop or select a resume file first.');
      return;
    }
    if (!candidateId.trim()) {
      showWarning('Candidate ID is required to link this resume.');
      return;
    }

    try {
      await uploadRecruiterSingle(singleFile, candidateId.trim());
      showSuccess('Resume uploaded and processed successfully.');
      setSingleFile(null);
      setCandidateId('');
    } catch (err) {
      showError(err.response?.data?.message || err.message || 'Failed to upload resume.');
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--text)' }}>Resume Ingestion Pipeline</h3>

      <div className={styles.tabs}>
        <button
          onClick={() => handleTabChange('bulk')}
          className={`${styles.tab} ${activeTab === 'bulk' ? styles.active : ''}`}
        >
          Bulk Resumes
        </button>
        <button
          onClick={() => handleTabChange('zip')}
          className={`${styles.tab} ${activeTab === 'zip' ? styles.active : ''}`}
        >
          ZIP Archive
        </button>
        <button
          onClick={() => handleTabChange('single')}
          className={`${styles.tab} ${activeTab === 'single' ? styles.active : ''}`}
        >
          Single Resume
        </button>
      </div>

      <div className={styles.uploadContainer}>
        {activeTab === 'bulk' && (
          <div>
            <UploadBox
              multiple
              onFilesSelected={handleBulkUpload}
              disabled={loading}
              maxSizeMsg="15MB each"
            />

            {loading && uploadProgress < 100 && (
              <div className="mt-6">
                <div className="flex justify-between text-sm text-text-muted mb-2" style={{ color: 'var(--text-muted)' }}>
                  <span>Uploading files to backend pipeline...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <ProgressBar progress={uploadProgress} />
              </div>
            )}

            {uploadQueue.length > 0 && (
              <div className={styles.queueList}>
                <h4 className="font-semibold text-sm mb-2" style={{ color: 'var(--text)' }}>Upload Queue & Processing Status</h4>
                {uploadQueue.map((item, index) => (
                  <div
                    key={index}
                    className={`${styles.queueItem} ${styles[item.status]}`}
                  >
                    <div className="flex items-center gap-3">
                      <FiFileText className="text-xl text-text-muted" style={{ color: 'var(--text-muted)' }} />
                      <div>
                        <div className={styles.fileName}>{item.name}</div>
                        {item.error && (
                          <div className="text-xs text-red-500 mt-0.5" style={{ color: 'var(--error)' }}>{item.error}</div>
                        )}
                      </div>
                    </div>
                    <div className={styles.fileStatus}>
                      {item.status === 'success' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <FiCheckCircle style={{ color: 'var(--success)' }} />
                          <Badge variant="success">Parsed & Indexed</Badge>
                        </div>
                      )}
                      {item.status === 'duplicate' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <FiAlertCircle style={{ color: 'var(--warning)' }} />
                          <Badge variant="warning">Duplicate Skipped</Badge>
                        </div>
                      )}
                      {item.status === 'failed' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <FiAlertCircle style={{ color: 'var(--error)' }} />
                          <Badge variant="error">Failed</Badge>
                        </div>
                      )}
                      {item.status === 'uploading' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <FiClock style={{ color: 'var(--primary)' }} />
                          <Badge variant="info">Processing ({item.progress}%)</Badge>
                        </div>
                      )}
                      {item.status === 'pending' && <Badge variant="neutral">Pending</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'zip' && (
          <div>
            <UploadBox
              accept=".zip"
              multiple={false}
              onFilesSelected={handleZipUpload}
              disabled={loading}
              maxSizeMsg="15MB ZIP"
            />

            {loading && (
              <div className="mt-6">
                <div className="flex justify-between text-sm text-text-muted mb-2" style={{ color: 'var(--text-muted)' }}>
                  <span>Parsing ZIP contents & extracting resumes...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <ProgressBar progress={uploadProgress} />
              </div>
            )}

            {bulkResult && (
              <div className="mt-6">
                <Card title="ZIP Extraction Summary" variant="success">
                  <div className="grid grid-cols-3 gap-4 text-center mt-2">
                    <div className="border-r border-border" style={{ borderRight: '1px solid var(--border)' }}>
                      <div className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{bulkResult.totalProcessed || bulkResult.results?.length || 0}</div>
                      <div className="text-xs text-text-muted" style={{ color: 'var(--text-muted)' }}>Total Extracted</div>
                    </div>
                    <div className="border-r border-border" style={{ borderRight: '1px solid var(--border)' }}>
                      <div className="text-2xl font-bold text-success" style={{ color: 'var(--success)' }}>{bulkResult.passed || bulkResult.results?.filter(r => r.success).length || 0}</div>
                      <div className="text-xs text-text-muted" style={{ color: 'var(--text-muted)' }}>Passed</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-error" style={{ color: 'var(--error)' }}>{bulkResult.failed || bulkResult.results?.filter(r => !r.success).length || 0}</div>
                      <div className="text-xs text-text-muted" style={{ color: 'var(--text-muted)' }}>Failed</div>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}

        {activeTab === 'single' && (
          <form onSubmit={handleSingleSubmit} className="flex flex-col gap-6 max-w-xl">
            <Input
              label="Candidate ID"
              name="candidateId"
              placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
              value={candidateId}
              onChange={(e) => setCandidateId(e.target.value)}
              required
            />

            <div>
              <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text)' }}>Resume File</label>
              {singleFile ? (
                <div className="border rounded-lg p-4 bg-background flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-3">
                    <FiFileText className="text-xl" style={{ color: 'var(--primary)' }} />
                    <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{singleFile.name}</span>
                  </div>
                  <Button size="sm" variant="secondary" onClick={() => setSingleFile(null)}>
                    Remove
                  </Button>
                </div>
              ) : (
                <UploadBox
                  multiple={false}
                  onFilesSelected={(file) => setSingleFile(file)}
                  disabled={loading}
                />
              )}
            </div>

            {loading && (
              <div>
                <div className="flex justify-between text-sm text-text-muted mb-2" style={{ color: 'var(--text-muted)' }}>
                  <span>Uploading & running preprocessing AI pipeline...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <ProgressBar progress={uploadProgress} />
              </div>
            )}

            <div>
              <Button type="submit" loading={loading} disabled={!singleFile || !candidateId.trim()}>
                Ingest & Process Resume
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UploadResume;
