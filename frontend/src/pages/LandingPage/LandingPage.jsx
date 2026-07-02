import React from 'react';
import { Link } from 'react-router-dom';
import styles from './style/LandingPage.module.scss';
import { FiTrendingUp, FiEye, FiSearch } from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/Button/Button';

export const LandingPage = () => {
  const { isSignedIn, role } = useAuth();

  return (
    <div>
      <section className={styles.hero}>
        <h1 className={styles.title}>
          AI-Powered Candidate Intelligence & Semantic Recruitment
        </h1>
        <p className={styles.subtitle}>
          Stop matching keywords. HireLattice parses resumes and job descriptions semantically, ranking matches with explainable AI.
        </p>
        <div className={styles.ctaButtons}>
          {isSignedIn ? (
            <Link to={role === 'recruiter' ? '/recruiter' : '/candidate'}>
              <Button size="lg">Go to Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link to="/signup">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">Sign In</Button>
              </Link>
            </>
          )}
        </div>
      </section>

      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>Why HireLattice?</h2>
        <div className={styles.grid}>
          <div className={styles.featureCard}>
            <FiSearch className={styles.icon} />
            <h3>Semantic Search</h3>
            <p>
              Search your candidate pool using natural language queries. Retrieve matches based on experience relevance, project context, and overlapping skills.
            </p>
          </div>
          <div className={styles.featureCard}>
            <FiTrendingUp className={styles.icon} />
            <h3>Hybrid Ranking Engine</h3>
            <p>
              Rank profiles using an advanced scoring model combining semantic similarity, experience years, education pedigree, and resume formatting quality.
            </p>
          </div>
          <div className={styles.featureCard}>
            <FiEye className={styles.icon} />
            <h3>Explainable AI Match</h3>
            <p>
              Every ranking includes a detailed scorecard explaining why a candidate was selected, highlighting strengths, weaknesses, and missing skillsets.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
