import React, { useContext, useState } from "react";
import styles from "./style/Upload.module.scss";
import useResumeUpload from "../../hooks/useResumeUpload";
import UploadBox from "../../components/UploadBox/UploadBox";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import Badge from "../../components/Badge/Badge";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Card from "../../components/Card/Card";
import { NotificationContext } from "../../contexts/NotificationContext";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiFileText,
} from "react-icons/fi";

export const UploadResume = () => {
  const [activeTab, setActiveTab] = useState("bulk"); // 'bulk', 'zip', 'single', 'dataset'
  const { showSuccess, showError, showWarning } =
    useContext(NotificationContext);
  const {
    loading,
    error,
    uploadProgress,
    uploadQueue,
    bulkResult,
    uploadRecruiterSingle,
    uploadRecruiterBulk,
    uploadRecruiterZip,
    uploadRecruiterDataset,
    resetQueue,
  } = useResumeUpload();

  const [candidateId, setCandidateId] = useState("");
  const [singleFile, setSingleFile] = useState(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    resetQueue();
    setCandidateId("");
    setSingleFile(null);
  };

  const handleBulkUpload = async (files) => {
    try {
      const result = await uploadRecruiterBulk(files);
      showSuccess(
        `Bulk upload completed! Passed: ${result.passed}, Failed: ${result.failed}`,
      );
    } catch (err) {
      showError(err.message || "Failed to upload bulk resumes");
    }
  };

  const handleZipUpload = async (file) => {
    try {
      await uploadRecruiterZip(file);
      showSuccess("ZIP uploaded and processed!");
    } catch (err) {
      showError(err.message || "ZIP upload failed");
    }
  };

  const handleDatasetUpload = async (file) => {
    try {
      const result = await uploadRecruiterDataset(file);
      showSuccess(
        `Dataset uploaded! Passed: ${result.passed}, Failed: ${result.failed}`,
      );
    } catch (err) {
      showError(err.message || "Dataset upload failed");
    }
  };

  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    if (!singleFile) {
      showWarning("Please drop or select a resume file first.");
      return;
    }
    if (!candidateId.trim()) {
      showWarning("Candidate ID is required to link this resume.");
      return;
    }
    try {
      await uploadRecruiterSingle(singleFile, candidateId.trim());
      showSuccess("Resume uploaded and processed successfully.");
      setSingleFile(null);
      setCandidateId("");
    } catch (err) {
      showError(
        err.response?.data?.message ||
          err.message ||
          "Failed to upload resume.",
      );
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-6" style={{ color: "var(--text)" }}>
        Resume Ingestion Pipeline
      </h3>

      <div className={styles.tabs}>
        {["bulk", "zip", "single", "dataset"].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`${styles.tab} ${activeTab === tab ? styles.active : ""}`}
          >
            {tab === "bulk" && "Bulk Resumes"}
            {tab === "zip" && "ZIP Archive"}
            {tab === "single" && "Single Resume"}
            {tab === "dataset" && "CSV Dataset"}
          </button>
        ))}
      </div>

      <div className={styles.uploadContainer}>
        {activeTab === "bulk" && (
          <div>
            <UploadBox
              multiple
              onFilesSelected={handleBulkUpload}
              disabled={loading}
              maxSizeMsg="15MB each"
            />
            {loading && uploadProgress < 100 && (
              <div className="mt-6">
                <div
                  className="flex justify-between text-sm mb-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  <span>Uploading files to backend pipeline...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <ProgressBar progress={uploadProgress} />
              </div>
            )}
            {uploadQueue.length > 0 && (
              <div className={styles.queueList}>
                <h4
                  className="font-semibold text-sm mb-2"
                  style={{ color: "var(--text)" }}
                >
                  Upload Queue & Processing Status
                </h4>
                {uploadQueue.map((item, index) => (
                  <div
                    key={index}
                    className={`${styles.queueItem} ${styles[item.status]}`}
                  >
                    <div className="flex items-center gap-3">
                      <FiFileText
                        className="text-xl"
                        style={{ color: "var(--text-muted)" }}
                      />
                      <div>
                        <div className={styles.fileName}>{item.name}</div>
                        {item.error && (
                          <div
                            className="text-xs mt-0.5"
                            style={{ color: "var(--error)" }}
                          >
                            {item.error}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={styles.fileStatus}>
                      {item.status === "success" && (
                        <>
                          <FiCheckCircle style={{ color: "var(--success)" }} />
                          <Badge variant="success">Parsed & Indexed</Badge>
                        </>
                      )}
                      {item.status === "duplicate" && (
                        <>
                          <FiAlertCircle style={{ color: "var(--warning)" }} />
                          <Badge variant="warning">Duplicate Skipped</Badge>
                        </>
                      )}
                      {item.status === "failed" && (
                        <>
                          <FiAlertCircle style={{ color: "var(--error)" }} />
                          <Badge variant="error">Failed</Badge>
                        </>
                      )}
                      {item.status === "uploading" && (
                        <>
                          <FiClock style={{ color: "var(--primary)" }} />
                          <Badge variant="info">
                            Processing ({item.progress}%)
                          </Badge>
                        </>
                      )}
                      {item.status === "pending" && (
                        <Badge variant="neutral">Pending</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "zip" && (
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
                <div
                  className="flex justify-between text-sm mb-2"
                  style={{ color: "var(--text-muted)" }}
                >
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
                    <div style={{ borderRight: "1px solid var(--border)" }}>
                      <div
                        className="text-2xl font-bold"
                        style={{ color: "var(--text)" }}
                      >
                        {bulkResult.total || 0}
                      </div>
                      <div
                        className="text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Total
                      </div>
                    </div>
                    <div style={{ borderRight: "1px solid var(--border)" }}>
                      <div
                        className="text-2xl font-bold"
                        style={{ color: "var(--success)" }}
                      >
                        {bulkResult.passed || 0}
                      </div>
                      <div
                        className="text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Passed
                      </div>
                    </div>
                    <div>
                      <div
                        className="text-2xl font-bold"
                        style={{ color: "var(--error)" }}
                      >
                        {bulkResult.failed || 0}
                      </div>
                      <div
                        className="text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Failed
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}

        {activeTab === "single" && (
          <form
            onSubmit={handleSingleSubmit}
            className="flex flex-col gap-6 max-w-xl"
          >
            <Input
              label="Candidate ID"
              name="candidateId"
              placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
              value={candidateId}
              onChange={(e) => setCandidateId(e.target.value)}
              required
            />
            <div>
              <label
                className="text-sm font-medium mb-1.5 block"
                style={{ color: "var(--text)" }}
              >
                Resume File
              </label>
              {singleFile ? (
                <div
                  className="border rounded-lg p-4 flex items-center justify-between"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="flex items-center gap-3">
                    <FiFileText
                      className="text-xl"
                      style={{ color: "var(--primary)" }}
                    />
                    <span
                      className="font-semibold text-sm"
                      style={{ color: "var(--text)" }}
                    >
                      {singleFile.name}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setSingleFile(null)}
                  >
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
                <div
                  className="flex justify-between text-sm mb-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  <span>Uploading & running preprocessing AI pipeline...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <ProgressBar progress={uploadProgress} />
              </div>
            )}
            <Button
              type="submit"
              loading={loading}
              disabled={!singleFile || !candidateId.trim()}
            >
              Ingest & Process Resume
            </Button>
          </form>
        )}

        {activeTab === "dataset" && (
          <div>
            <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
              Upload a CSV file with columns:{" "}
              <code>
                Name, Email, Phone, University, Graduation_Year,
                Years_Experience, Job_Role, Skills, Resume_Text
              </code>
            </p>
            <UploadBox
              accept=".csv"
              multiple={false}
              onFilesSelected={handleDatasetUpload}
              disabled={loading}
              maxSizeMsg="20MB CSV"
            />
            {loading && (
              <div className="mt-6">
                <div
                  className="flex justify-between text-sm mb-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  <span>Processing CSV dataset rows...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <ProgressBar progress={uploadProgress} />
              </div>
            )}
            {bulkResult && (
              <div className="mt-6">
                <Card title="Dataset Upload Summary" variant="success">
                  <div className="grid grid-cols-3 gap-4 text-center mt-2">
                    <div style={{ borderRight: "1px solid var(--border)" }}>
                      <div
                        className="text-2xl font-bold"
                        style={{ color: "var(--text)" }}
                      >
                        {bulkResult.total || 0}
                      </div>
                      <div
                        className="text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Total Rows
                      </div>
                    </div>
                    <div style={{ borderRight: "1px solid var(--border)" }}>
                      <div
                        className="text-2xl font-bold"
                        style={{ color: "var(--success)" }}
                      >
                        {bulkResult.passed || 0}
                      </div>
                      <div
                        className="text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Imported
                      </div>
                    </div>
                    <div>
                      <div
                        className="text-2xl font-bold"
                        style={{ color: "var(--error)" }}
                      >
                        {bulkResult.failed || 0}
                      </div>
                      <div
                        className="text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Failed
                      </div>
                    </div>
                  </div>
                  {bulkResult.results?.filter((r) => !r.success).length > 0 && (
                    <div className="mt-4">
                      <p
                        className="text-xs font-semibold mb-2"
                        style={{ color: "var(--text)" }}
                      >
                        Failed Rows:
                      </p>
                      {bulkResult.results
                        .filter((r) => !r.success)
                        .map((r, i) => (
                          <div
                            key={i}
                            className="text-xs mb-1"
                            style={{ color: "var(--error)" }}
                          >
                            {r.name} ({r.email}): {r.reason}
                          </div>
                        ))}
                    </div>
                  )}
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadResume;
