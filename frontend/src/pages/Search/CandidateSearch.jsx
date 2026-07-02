import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './style/Search.module.scss';
import useJobs from '../../hooks/useJobs';
import useSearch from '../../hooks/useSearch';
import Select from '../../components/Select/Select';
import SearchBox from '../../components/SearchBox/SearchBox';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Table from '../../components/Table/Table';
import Chip from '../../components/Chip/Chip';
import { NotificationContext } from '../../contexts/NotificationContext';
import { FiSliders } from 'react-icons/fi';

export const CandidateSearch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { jobs, fetchJobs } = useJobs();
  const { results, loading, runSemanticSearch, runHybridSearch } = useSearch();
  const { showWarning, showError } = useContext(NotificationContext);

  const [selectedJobId, setSelectedJobId] = useState(location.state?.jobId || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [skillsFilter, setSkillsFilter] = useState('');
  const [searchType, setSearchType] = useState('hybrid'); // 'semantic', 'hybrid'

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!selectedJobId) {
      showWarning('Please select a job description to search against.');
      return;
    }

    const filters = {};
    if (experienceFilter) filters.experienceYears = parseInt(experienceFilter);
    if (locationFilter) filters.location = locationFilter;
    if (skillsFilter) {
      filters.skills = skillsFilter.split(',').map((s) => s.trim()).filter(Boolean);
    }

    try {
      if (searchType === 'semantic') {
        await runSemanticSearch({
          jobId: selectedJobId,
          topK: 20,
          filters,
        });
      } else {
        await runHybridSearch({
          jobId: selectedJobId,
          topK: 20,
          filters,
        });
      }
    } catch (err) {
      showError(err.message || 'Search execution failed');
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setExperienceFilter('');
    setLocationFilter('');
    setSkillsFilter('');
  };

  const headers = [
    { key: 'rank', label: 'Rank' },
    { key: 'name', label: 'Candidate' },
    { key: 'score', label: 'Match Score' },
    { key: 'details', label: 'Seniority & Experience' },
    { key: 'location', label: 'Location' },
    { key: 'skills', label: 'Top Skills' },
    { key: 'actions', label: 'Action' },
  ];

  return (
    <div>
      <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--text)' }}>Candidate Semantic Search</h3>

      <div className={styles.searchHeader}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <Select
              label="1. Target Job Description Context"
              placeholder="Choose active job..."
              options={jobs.map((j) => ({ value: j.id, label: j.title }))}
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
            />
          </div>
          <div>
            <Select
              label="Search Method"
              placeholder=""
              options={[
                { value: 'hybrid', label: 'Hybrid AI Ranked' },
                { value: 'semantic', label: 'Fast Semantic Only' },
              ]}
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            />
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col gap-4">
          <SearchBox
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={handleClear}
            placeholder="Type search terms or natural language query (e.g. React developers with AWS experience)..."
          />

          <div className={styles.filtersRow}>
            <Input
              label="Min Experience (Years)"
              type="number"
              placeholder="e.g. 5"
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
            />
            <Input
              label="Location Filter"
              placeholder="e.g. San Francisco"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
            <Input
              label="Skills (Comma-separated)"
              placeholder="e.g. Python, AWS, Docker"
              value={skillsFilter}
              onChange={(e) => setSkillsFilter(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <Button variant="secondary" onClick={handleClear}>
              Reset Filters
            </Button>
            <Button type="submit" loading={loading}>
              Run Semantic Search
            </Button>
          </div>
        </form>
      </div>

      <div className="mt-8">
        <h4 className="font-semibold text-lg mb-4" style={{ color: 'var(--text)' }}>Search Results Pool</h4>
        <Table
          headers={headers}
          data={results}
          loading={loading}
          emptyMessage="No search results. Select a job context and click Search."
          renderRow={(candidate, index) => {
            const score = candidate.scores?.overallScore || candidate.overallScore || candidate.semanticScore || 0;
            const displayScore = score <= 1 ? Math.round(score * 100) : Math.round(score);

            return (
              <tr key={candidate.candidateId} className="border-b border-border hover:bg-background/20" style={{ borderBottom: '1px solid var(--border)' }}>
                <td className="px-5 py-4 font-bold text-text-muted" style={{ color: 'var(--text-muted)' }}>
                  #{candidate.rank}
                </td>
                <td className="px-5 py-4">
                  <div className="font-semibold text-text" style={{ color: 'var(--text)' }}>{candidate.name}</div>
                  <div className="text-xs text-text-muted" style={{ color: 'var(--text-muted)' }}>{candidate.email}</div>
                </td>
                <td className="px-5 py-4">
                  <span className={styles.scoreBadge}>
                    {displayScore}% Match
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="text-sm font-semibold capitalize text-text" style={{ color: 'var(--text)' }}>
                    {candidate.seniorityLevel || 'Mid-Level'}
                  </div>
                  <div className="text-xs text-text-muted" style={{ color: 'var(--text-muted)' }}>
                    {candidate.totalExperienceYears || 0} years experience
                  </div>
                </td>
                <td className="px-5 py-4 text-text-muted" style={{ color: 'var(--text-muted)' }}>
                  {candidate.location || 'Not Specified'}
                </td>
                <td className="px-5 py-4">
                  <div className={styles.skillsContainer}>
                    {candidate.topSkills?.slice(0, 3).map((skill) => (
                      <Chip key={skill} label={skill} className="text-xs" />
                    ))}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <Button
                    size="sm"
                    variant="outline"
                    icon={FiSliders}
                    onClick={() =>
                      navigate(`/recruiter/candidates/${candidate.candidateId}`, {
                        state: { jobId: selectedJobId },
                      })
                    }
                  >
                    View Details
                  </Button>
                </td>
              </tr>
            );
          }}
        />
      </div>
    </div>
  );
};

export default CandidateSearch;
