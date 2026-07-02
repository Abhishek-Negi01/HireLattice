import React from 'react';
import Card from '../../components/Card/Card';

export const About = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <Card title="About HireLattice">
        <p className="mb-4 text-text-muted" style={{ color: 'var(--text-muted)' }}>
          HireLattice is an enterprise-grade AI recruiting platform designed to streamline candidate sourcing and vetting.
        </p>
        <p className="mb-4 text-text-muted" style={{ color: 'var(--text-muted)' }}>
          Built using a hybrid scoring model, the platform embeds job descriptions and candidate resumes into multidimensional vector spaces, computing cosines to extract true competency overlap rather than reliance on exact keywords.
        </p>
        <h4 className="font-semibold text-lg mb-2 mt-6" style={{ color: 'var(--text)' }}>Core Pipeline Stages:</h4>
        <ul className="list-disc pl-5 mb-4 text-text-muted flex flex-col gap-2" style={{ color: 'var(--text-muted)' }}>
          <li><strong>Preprocessing:</strong> Formats extracted PDF/Docx texts, normalizes dates/skills/degrees, and hashes files to prevent duplicate submissions.</li>
          <li><strong>Indexing:</strong> Generates vector embeddings for storage in Qdrant, syncing profiles inside PostgreSQL and MongoDB databases.</li>
          <li><strong>Matching & Scores:</strong> Uses hybrid weights (semantic, skills, experience, projects, resume format, behavioral markers) to compute overall rank indices.</li>
          <li><strong>Explainability:</strong> Renders natural language reports outlining the exact rationale behind every candidate placement.</li>
        </ul>
      </Card>
    </div>
  );
};

export default About;
