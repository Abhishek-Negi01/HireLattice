import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import { FiHelpCircle } from 'react-icons/fi';

export const NotFound = () => {
  return (
    <div className="max-w-md mx-auto py-16 px-6 text-center">
      <Card className="flex flex-col items-center">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <FiHelpCircle className="text-5xl mb-4" style={{ color: 'var(--primary)', fontSize: '3rem' }} />
          <h3 className="font-bold text-xl mb-2" style={{ color: 'var(--text)' }}>404 - Page Not Found</h3>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            The page you are looking for does not exist or has been moved.
          </p>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;
