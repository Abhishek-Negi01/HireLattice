import React from 'react';
import Card from '../../components/Card/Card';

export const ResumeHistory = () => {
  return (
    <div>
      <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--text)' }}>Resume History</h3>
      <Card>
        <p className="text-sm text-text-muted mb-0" style={{ color: 'var(--text-muted)' }}>
          Only one active resume can be processed and indexed in the vector semantic matching model. Previous versions are archived automatically.
        </p>
      </Card>
    </div>
  );
};

export default ResumeHistory;
