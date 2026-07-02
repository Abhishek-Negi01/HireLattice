import React from 'react';
import useAuth from '../../hooks/useAuth';
import Card from '../../components/Card/Card';
import { FiUser, FiShield, FiMail } from 'react-icons/fi';

export const Profile = () => {
  const { user, role, candidateProfile } = useAuth();

  return (
    <div className="max-w-2xl">
      <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--text)' }}>My Profile</h3>
      <Card>
        <div className="flex items-center gap-4 mb-6">
          <img
            src={user?.imageUrl}
            alt="Avatar"
            className="w-16 h-16 rounded-full border-2"
            style={{ borderColor: 'var(--primary)' }}
          />
          <div>
            <h4 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
              {user?.fullName || 'User'}
            </h4>
            <div className="text-xs uppercase font-semibold mt-1" style={{ color: 'var(--text-muted)' }}>
              System Role: {role}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 text-sm mt-4 pt-4 border-t" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3">
            <FiMail style={{ color: 'var(--text-muted)', fontSize: '1.25rem' }} />
            <div>
              <div className="font-semibold" style={{ color: 'var(--text)' }}>Email Address</div>
              <div style={{ color: 'var(--text-muted)' }}>
                {user?.primaryEmailAddress?.emailAddress}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FiShield style={{ color: 'var(--text-muted)', fontSize: '1.25rem' }} />
            <div>
              <div className="font-semibold" style={{ color: 'var(--text)' }}>Authentication Provider</div>
              <div style={{ color: 'var(--text-muted)' }}>
                Managed via Clerk React SDK
              </div>
            </div>
          </div>

          {role === 'candidate' && candidateProfile && (
            <div className="flex items-center gap-3">
              <FiUser style={{ color: 'var(--text-muted)', fontSize: '1.25rem' }} />
              <div>
                <div className="font-semibold" style={{ color: 'var(--text)' }}>Candidate DB Record ID</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {candidateProfile.id}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Profile;
