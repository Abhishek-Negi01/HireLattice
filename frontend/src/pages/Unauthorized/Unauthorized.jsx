import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import { FiAlertTriangle } from 'react-icons/fi';

export const Unauthorized = () => {
  return (
    <div className="max-w-md mx-auto py-16 px-6 text-center">
      <Card className="flex flex-col items-center">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <FiAlertTriangle className="text-5xl mb-4" style={{ color: 'var(--error)', fontSize: '3rem' }} />
          <h3 className="font-bold text-xl mb-2" style={{ color: 'var(--text)' }}>403 - Unauthorized Access</h3>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            You do not have the required permissions to view this resource. Please make sure you are signed in with the correct role.
          </p>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Unauthorized;
