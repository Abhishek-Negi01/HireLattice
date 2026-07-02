import React, { useEffect, useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./style/Jobs.module.scss";
import useJobs from "../../hooks/useJobs";
import Button from "../../components/Button/Button";
import Card from "../../components/Card/Card";
import Loader from "../../components/Loader/Loader";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import { NotificationContext } from "../../contexts/NotificationContext";
import { FiArchive, FiSliders, FiSearch, FiBriefcase } from "react-icons/fi";

export const ManageJobs = () => {
  const { jobs, loading, fetchJobs, archiveJobDetails } = useJobs();
  const { showSuccess, showError } = useContext(NotificationContext);
  const navigate = useNavigate();

  const [archiveId, setArchiveId] = useState(null);
  const [archiveLoading, setArchiveLoading] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleArchiveConfirm = async () => {
    if (!archiveId) return;
    setArchiveLoading(true);
    try {
      await archiveJobDetails(archiveId);
      showSuccess("Job listing archived successfully");
      setArchiveId(null);
    } catch (err) {
      showError(
        err.response?.data?.message ||
          err.message ||
          "Failed to archive job listing",
      );
    } finally {
      setArchiveLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold" style={{ color: "var(--text)" }}>
          Manage Job Postings
        </h3>
        <Link to="/recruiter/jobs/create">
          <Button>+ Post New Job</Button>
        </Link>
      </div>

      {loading && jobs.length === 0 ? (
        <Loader text="Loading listings..." />
      ) : jobs.length === 0 ? (
        <Card className="text-center py-12">
          <FiBriefcase
            className="text-5xl text-text-muted mb-4 mx-auto"
            style={{ color: "var(--text-muted)", fontSize: "3rem" }}
          />
          <h4
            className="font-semibold text-lg mb-2"
            style={{ color: "var(--text)" }}
          >
            No Job Listings Found
          </h4>
          <p
            className="text-text-muted text-sm mb-6"
            style={{ color: "var(--text-muted)" }}
          >
            Post a job listing first to parse its descriptions and rank matched
            candidate resumes.
          </p>
          <Link to="/recruiter/jobs/create">
            <Button>Post First Job</Button>
          </Link>
        </Card>
      ) : (
        <div>
          {jobs.map((job) => (
            <div key={job.id} className={styles.jobCard}>
              <div className={styles.jobDetails}>
                <h4
                  className="font-semibold text-lg"
                  style={{ color: "var(--text)" }}
                >
                  {job.title}
                </h4>
                <div className={styles.jobMeta}>
                  <span>Department: {job.department || "General"}</span>
                  <span>&bull;</span>
                  <span>Location: {job.location || "Remote"}</span>
                  <span>&bull;</span>
                  <span className="capitalize">
                    Type: {job.employmentType || "Full-time"}
                  </span>
                </div>
                <p
                  className="text-sm text-text-muted mt-3 line-clamp-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  {job.description}
                </p>
              </div>
              <div className={styles.jobActions}>
                <Button
                  size="sm"
                  variant="primary"
                  icon={FiSliders}
                  onClick={() =>
                    navigate("/recruiter/ranking", { state: { jobId: job.id } })
                  }
                >
                  Rankings
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  icon={FiSearch}
                  onClick={() =>
                    navigate("/recruiter/search", { state: { jobId: job.id } })
                  }
                >
                  Search Pool
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  icon={FiArchive}
                  onClick={() => setArchiveId(job.id)}
                  style={{
                    color: "var(--error)",
                    borderColor: "var(--border)",
                  }}
                >
                  Archive
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!archiveId}
        onClose={() => setArchiveId(null)}
        onConfirm={handleArchiveConfirm}
        title="Archive Job Listing?"
        message="This will archive the job post. Ranked candidates list for this post will be deleted in the database."
        loading={archiveLoading}
      />
    </div>
  );
};

export default ManageJobs;
