import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./style/Ranking.module.scss";
import useJobs from "../../hooks/useJobs";
import useRanking from "../../hooks/useRanking";
import Select from "../../components/Select/Select";
import Button from "../../components/Button/Button";
import Card from "../../components/Card/Card";
import Table from "../../components/Table/Table";
import Drawer from "../../components/Drawer/Drawer";
import Chip from "../../components/Chip/Chip";
import Loader from "../../components/Loader/Loader";
import Badge from "../../components/Badge/Badge";
import { NotificationContext } from "../../contexts/NotificationContext";
import { FiHelpCircle, FiCpu } from "react-icons/fi";

export const CandidateRanking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { jobs, fetchJobs } = useJobs();
  const {
    rankings,
    loading,
    explainLoading,
    explanation,
    getRankings,
    generateNewRankings,
    explainRanking,
    setExplanation,
  } = useRanking();
  const { showSuccess, showWarning, showError } =
    useContext(NotificationContext);

  const [selectedJobId, setSelectedJobId] = useState(
    location.state?.jobId || "",
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeCandidate, setActiveCandidate] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    if (selectedJobId) {
      getRankings(selectedJobId);
    }
  }, [selectedJobId, getRankings]);

  const handleGenerateMatching = async () => {
    if (!selectedJobId) {
      showWarning("Please select a target job context.");
      return;
    }

    try {
      await generateNewRankings({
        jobId: selectedJobId,
        topK: 20,
        withExplanation: false,
      });
      showSuccess("Match rankings generated successfully!");
    } catch (err) {
      showError(
        err.response?.data?.message ||
          err.message ||
          "Matching engine execution failed.",
      );
    }
  };

  const handleExplainClick = async (candidate) => {
    setActiveCandidate(candidate);
    setDrawerOpen(true);
    try {
      await explainRanking({
        candidateId: candidate.candidateId,
        jobId: selectedJobId,
      });
    } catch (err) {
      showError("Failed to fetch recommendation breakdown explanation.");
    }
  };

  const headers = [
    { key: "rank", label: "Rank" },
    { key: "name", label: "Candidate" },
    { key: "score", label: "Match Index" },
    { key: "semantic", label: "Semantic" },
    { key: "skills", label: "Skills" },
    { key: "experience", label: "Experience" },
    { key: "quality", label: "Resume Format" },
    { key: "actions", label: "Actions" },
  ];

  const pct = (val) => {
    if (val === undefined || val === null) return "N/A";
    const normalizedVal = val > 1 ? val / 100 : val;
    return `${Math.round(normalizedVal * 100)}%`;
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-6" style={{ color: "var(--text)" }}>
        Candidate Semantic Match Ranking
      </h3>

      <div className={styles.headerBox}>
        <div className={styles.selectorWrapper}>
          <Select
            label="Select Job Description Context"
            placeholder="Choose active listing..."
            options={jobs.map((j) => ({ value: j.id, label: j.title }))}
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
          />
        </div>
        <div>
          <Button
            onClick={handleGenerateMatching}
            loading={loading}
            icon={FiCpu}
            disabled={!selectedJobId}
          >
            Compute Semantic Rankings
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <h4
          className="font-semibold text-lg mb-4"
          style={{ color: "var(--text)" }}
        >
          Top Ranked Matches
        </h4>
        <Table
          headers={headers}
          data={rankings}
          loading={loading}
          emptyMessage="No computed match index rankings found for this job. Select a job context and click Compute Semantic Rankings."
          renderRow={(item, idx) => {
            const rawOverallScore =
              item.overallScore || item.scores?.overallScore || 0;
            const overallScore = rawOverallScore > 1 ? rawOverallScore / 100 : rawOverallScore;
            const semanticScore =
              item.scores?.semanticScore !== undefined
                ? item.scores.semanticScore
                : item.semanticScore;
            const skillsScore =
              item.scores?.skillsScore !== undefined
                ? item.scores.skillsScore
                : item.skillsScore;
            const experienceScore =
              item.scores?.experienceScore !== undefined
                ? item.scores.experienceScore
                : item.experienceScore;
            const resumeQuality =
              item.scores?.resumeQuality !== undefined
                ? item.scores.resumeQuality
                : item.resumeQuality;

            return (
              <tr
                key={item.candidateId}
                className="border-b border-border hover:bg-background/20"
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                <td
                  className="px-5 py-4 font-bold text-text-muted"
                  style={{ color: "var(--text-muted)" }}
                >
                  #{item.rank}
                </td>
                <td className="px-5 py-4">
                  <div
                    className="font-semibold text-text"
                    style={{ color: "var(--text)" }}
                  >
                    {item.name}
                  </div>
                  <div
                    className="text-xs text-text-muted"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {item.email}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <Badge
                    variant={
                      overallScore >= 0.8
                        ? "success"
                        : overallScore >= 0.6
                          ? "info"
                          : "warning"
                    }
                  >
                    {pct(overallScore)} Match
                  </Badge>
                </td>
                <td
                  className="px-5 py-4 text-text-muted"
                  style={{ color: "var(--text-muted)" }}
                >
                  {pct(semanticScore)}
                </td>
                <td
                  className="px-5 py-4 text-text-muted"
                  style={{ color: "var(--text-muted)" }}
                >
                  {pct(skillsScore)}
                </td>
                <td
                  className="px-5 py-4 text-text-muted"
                  style={{ color: "var(--text-muted)" }}
                >
                  {pct(experienceScore)}
                </td>
                <td
                  className="px-5 py-4 text-text-muted"
                  style={{ color: "var(--text-muted)" }}
                >
                  {pct(resumeQuality)}
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      icon={FiHelpCircle}
                      onClick={() => handleExplainClick(item)}
                    >
                      Explain
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        navigate(`/recruiter/candidates/${item.candidateId}`, {
                          state: { jobId: selectedJobId },
                        })
                      }
                    >
                      Profile
                    </Button>
                  </div>
                </td>
              </tr>
            );
          }}
        />
      </div>

      {/* AI Explanation Drawer */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setExplanation(null);
        }}
        title={`AI Recommendation Explanation: ${activeCandidate?.name || ""}`}
      >
        {explainLoading ? (
          <Loader text="Generating Gemini semantic explainability scorecard..." />
        ) : !explanation ? (
          <div
            className="text-center text-text-muted py-8"
            style={{ color: "var(--text-muted)" }}
          >
            Failed to load AI Match explanation.
          </div>
        ) : (
          <div className={styles.explanationSection}>
            <div className={styles.scoreList}>
              <div className={styles.scoreItem}>
                <div className={styles.scoreTitle}>Overall Index</div>
                <div
                  className={styles.scoreVal}
                  style={{ color: "var(--primary)" }}
                >
                  {pct(
                    explanation.overallScore || activeCandidate?.overallScore,
                  )}
                </div>
              </div>
              <div className={styles.scoreItem}>
                <div className={styles.scoreTitle}>Fit Level</div>
                <div
                  className={styles.scoreVal}
                  style={{ color: "var(--success)" }}
                >
                  {(() => {
                    const rawScore = explanation.overallScore || activeCandidate?.overallScore || 0;
                    const score = rawScore > 1 ? rawScore / 100 : rawScore;
                    return score >= 0.8 ? "Strong" : score >= 0.6 ? "Moderate" : "Review";
                  })()}
                </div>
              </div>
            </div>

            <div className={`${styles.sectionBox} ${styles.reason}`}>
              <h5
                className={styles.sectionTitle}
                style={{ color: "var(--primary)" }}
              >
                Recommendation Summary
              </h5>
              <p
                className="text-sm m-0 leading-relaxed"
                style={{ color: "var(--text)" }}
              >
                {explanation.recommendationReason || explanation.reason}
              </p>
            </div>

            <div className={`${styles.sectionBox} ${styles.strengths}`}>
              <h5
                className={styles.sectionTitle}
                style={{ color: "var(--success)" }}
              >
                Core Strengths
              </h5>
              <ul
                className="list-disc pl-5 text-sm flex flex-col gap-1.5"
                style={{ color: "var(--text)" }}
              >
                {explanation.strengths?.map((str, idx) => (
                  <li key={idx}>{str}</li>
                ))}
              </ul>
            </div>

            <div className={`${styles.sectionBox} ${styles.weaknesses}`}>
              <h5
                className={styles.sectionTitle}
                style={{ color: "var(--error)" }}
              >
                Areas of Improvement / Weaknesses
              </h5>
              <ul
                className="list-disc pl-5 text-sm flex flex-col gap-1.5"
                style={{ color: "var(--text)" }}
              >
                {explanation.weaknesses?.map((wk, idx) => (
                  <li key={idx}>{wk}</li>
                ))}
              </ul>
            </div>

            <div
              className={`${styles.sectionBox} ${styles.reason}`}
              style={{ borderLeft: "4px solid var(--secondary)" }}
            >
              <h5
                className={styles.sectionTitle}
                style={{ color: "var(--secondary)" }}
              >
                Missing Competencies
              </h5>
              {!explanation.missingSkills ||
              explanation.missingSkills.length === 0 ? (
                <p
                  className="text-sm m-0 text-success font-semibold"
                  style={{ color: "var(--success)" }}
                >
                  No missing required skillsets detected. Perfect match overlap!
                </p>
              ) : (
                <div className={styles.skillsGrid}>
                  {explanation.missingSkills?.map((skill, idx) => (
                    <Chip
                      key={idx}
                      label={skill}
                      style={{
                        backgroundColor: "rgba(220, 38, 38, 0.1)",
                        color: "var(--error)",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default CandidateRanking;
