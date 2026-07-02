import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styles from './style/Details.module.scss';
import useCandidate from '../../hooks/useCandidate';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import Chip from '../../components/Chip/Chip';
import Badge from '../../components/Badge/Badge';
import Loader from '../../components/Loader/Loader';
import { FiMail, FiPhone, FiMapPin, FiLinkedin, FiCalendar, FiArrowLeft } from 'react-icons/fi';

export const CandidateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchCandidateById, loading, error } = useCandidate();
  const [profileData, setProfileData] = useState(null);
  const [activeTab, setActiveTab] = useState('experience');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchCandidateById(id);
        setProfileData(data);
      } catch (err) {
        console.error('Failed to load candidate details:', err);
      }
    };
    loadProfile();
  }, [id, fetchCandidateById]);

  if (loading) {
    return <Loader text="Retrieving candidate's AI structured profile..." fullscreen />;
  }

  if (error || !profileData) {
    return (
      <div className="text-center py-12">
        <h4 className="font-bold text-lg text-text mb-4" style={{ color: 'var(--text)' }}>Failed to Load Candidate Profile</h4>
        <p className="text-text-muted mb-6" style={{ color: 'var(--text-muted)' }}>{error || 'Profile not found.'}</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const candidate = profileData.candidate || profileData;
  const aiProfile = profileData.aiProfile || {};

  const name = aiProfile.name || `${candidate.firstName} ${candidate.lastName}`;
  const email = aiProfile.email || candidate.email;
  const phone = aiProfile.phone || candidate.phone;
  const locationStr = aiProfile.location || candidate.location;
  const linkedinUrl = aiProfile.linkedinUrl || candidate.linkedinUrl;

  return (
    <div>
      <div className="mb-6">
        <Button
          variant="secondary"
          icon={FiArrowLeft}
          onClick={() => {
            if (location.state?.jobId) {
              navigate('/recruiter/ranking', { state: { jobId: location.state.jobId } });
            } else {
              navigate(-1);
            }
          }}
        >
          Back
        </Button>
      </div>

      <div className={styles.detailsHeader}>
        <div>
          <h2 className={styles.name}>{name}</h2>
          <div className="flex gap-2 items-center mt-2 flex-wrap">
            <Badge variant="info">
              {aiProfile.seniorityLevel || 'Mid-Level'} Seniority
            </Badge>
            <Badge variant="success">
              {aiProfile.totalExperienceYears || 0} Years Experience
            </Badge>
            {aiProfile.parsingModel && (
              <Badge variant="neutral">
                AI Parsed via {aiProfile.parsingModel}
              </Badge>
            )}
          </div>

          <div className={styles.contactGrid}>
            {email && (
              <div className={styles.contactItem}>
                <FiMail />
                <a href={`mailto:${email}`}>{email}</a>
              </div>
            )}
            {phone && (
              <div className={styles.contactItem}>
                <FiPhone />
                <span>{phone}</span>
              </div>
            )}
            {locationStr && (
              <div className={styles.contactItem}>
                <FiMapPin />
                <span>{locationStr}</span>
              </div>
            )}
            {linkedinUrl && (
              <div className={styles.contactItem}>
                <FiLinkedin />
                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
                  LinkedIn Profile
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.leftCol}>
          <Card title="AI Profile Summary">
            <p className="text-sm leading-relaxed mb-0" style={{ color: 'var(--text-muted)' }}>
              {aiProfile.summary || 'No professional summary extracted.'}
            </p>
          </Card>

          <Card title="Skills Inventory">
            <h5 className="text-xs font-semibold uppercase text-text-muted mb-2" style={{ color: 'var(--text-muted)' }}>
              Top Competencies
            </h5>
            <div className="flex flex-wrap gap-2 mb-4">
              {aiProfile.topSkills?.map((skill) => (
                <Chip key={skill} label={skill} active />
              ))}
            </div>

            <h5 className="text-xs font-semibold uppercase text-text-muted mb-2" style={{ color: 'var(--text-muted)' }}>
              All Skills
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {aiProfile.skills?.map((skill) => (
                <Chip key={skill} label={skill} className="text-xs" />
              ))}
            </div>
          </Card>

          {aiProfile.languages && aiProfile.languages.length > 0 && (
            <Card title="Languages">
              <div className="flex flex-wrap gap-2">
                {aiProfile.languages.map((l) => (
                  <Chip key={l} label={l} />
                ))}
              </div>
            </Card>
          )}

          {aiProfile.certifications && aiProfile.certifications.length > 0 && (
            <Card title="Certifications">
              <ul className="list-disc pl-5 text-sm flex flex-col gap-1 text-text-muted" style={{ color: 'var(--text-muted)' }}>
                {aiProfile.certifications.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        <div className={styles.rightCol}>
          <div className="flex gap-4 border-b border-border pb-3 mb-6" style={{ borderBottom: '1px solid var(--border)' }}>
            <button
              onClick={() => setActiveTab('experience')}
              className={`font-semibold text-sm pb-1 border-b-2 ${activeTab === 'experience' ? 'border-primary text-primary' : 'border-transparent text-text-muted'}`}
              style={{
                color: activeTab === 'experience' ? 'var(--primary)' : 'var(--text-muted)',
                borderBottomColor: activeTab === 'experience' ? 'var(--primary)' : 'transparent',
              }}
            >
              Work Experience
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`font-semibold text-sm pb-1 border-b-2 ${activeTab === 'projects' ? 'border-primary text-primary' : 'border-transparent text-text-muted'}`}
              style={{
                color: activeTab === 'projects' ? 'var(--primary)' : 'var(--text-muted)',
                borderBottomColor: activeTab === 'projects' ? 'var(--primary)' : 'transparent',
              }}
            >
              Projects
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={`font-semibold text-sm pb-1 border-b-2 ${activeTab === 'education' ? 'border-primary text-primary' : 'border-transparent text-text-muted'}`}
              style={{
                color: activeTab === 'education' ? 'var(--primary)' : 'var(--text-muted)',
                borderBottomColor: activeTab === 'education' ? 'var(--primary)' : 'transparent',
              }}
            >
              Education
            </button>
          </div>

          {activeTab === 'experience' && (
            <div>
              {!aiProfile.experience || aiProfile.experience.length === 0 ? (
                <p className="text-center text-text-muted py-6" style={{ color: 'var(--text-muted)' }}>No work experience parsed.</p>
              ) : (
                <div className={styles.timeline}>
                  {aiProfile.experience.map((exp, index) => (
                    <div key={index} className={styles.timelineItem}>
                      <h5 className={styles.timelineTitle}>
                        {exp.title} &mdash; <span className="text-primary" style={{ color: 'var(--primary)' }}>{exp.company}</span>
                      </h5>
                      <div className={styles.timelineSubtitle}>
                        <FiCalendar className="inline mr-1" />
                        <span>{exp.startDate} &mdash; {exp.current ? 'Present' : exp.endDate}</span>
                      </div>
                      <p className={styles.timelineDesc}>{exp.description}</p>
                      {exp.skills && exp.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {exp.skills.map((s) => (
                            <Chip key={s} label={s} className="text-xs" />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="flex flex-col gap-6">
              {!aiProfile.projects || aiProfile.projects.length === 0 ? (
                <p className="text-center text-text-muted py-6" style={{ color: 'var(--text-muted)' }}>No projects parsed.</p>
              ) : (
                aiProfile.projects.map((proj, idx) => (
                  <div key={idx} className="border-b border-border pb-4 last:border-b-0" style={{ borderBottom: '1px solid var(--border)' }}>
                    <div className="flex justify-between items-start">
                      <h5 className="font-semibold text-base" style={{ color: 'var(--text)' }}>{proj.name}</h5>
                      {proj.url && (
                        <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline font-semibold" style={{ color: 'var(--primary)' }}>
                          View Link
                        </a>
                      )}
                    </div>
                    <p className="text-sm text-text-muted mt-2 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      {proj.description}
                    </p>
                    {proj.techStack && proj.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {proj.techStack.map((tech) => (
                          <Chip key={tech} label={tech} className="text-xs" />
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'education' && (
            <div className="flex flex-col gap-6">
              {!aiProfile.education || aiProfile.education.length === 0 ? (
                <p className="text-center text-text-muted py-6" style={{ color: 'var(--text-muted)' }}>No education records parsed.</p>
              ) : (
                aiProfile.education.map((edu, idx) => (
                  <div key={idx} className="flex gap-4 items-start border-b border-border pb-4 last:border-b-0" style={{ borderBottom: '1px solid var(--border)' }}>
                    <div className="flex-1">
                      <h5 className="font-semibold text-base" style={{ color: 'var(--text)' }}>
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </h5>
                      <div className="text-xs text-text-muted mt-1" style={{ color: 'var(--text-muted)' }}>
                        {edu.institution} &bull; {edu.startYear && `${edu.startYear} - `}{edu.endYear || 'Present'}
                      </div>
                      {edu.gpa && (
                        <div className="text-xs text-text font-semibold mt-2" style={{ color: 'var(--text)' }}>
                          GPA: {edu.gpa}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateDetails;
