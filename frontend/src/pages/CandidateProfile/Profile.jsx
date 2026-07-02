import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useAuth from '../../hooks/useAuth';
import useCandidate from '../../hooks/useCandidate';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { NotificationContext } from '../../contexts/NotificationContext';
import styles from './style/Profile.module.scss';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  linkedinUrl: z.string().url('Please enter a valid LinkedIn URL').or(z.string().length(0)).optional().nullable(),
});

export const Profile = () => {
  const { candidateProfile, setCandidateProfile } = useAuth();
  const { updateProfile, loading } = useCandidate();
  const { showSuccess, showError } = useContext(NotificationContext);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      location: '',
      linkedinUrl: '',
    },
  });

  useEffect(() => {
    if (candidateProfile) {
      reset({
        firstName: candidateProfile.firstName || '',
        lastName: candidateProfile.lastName || '',
        phone: candidateProfile.phone || '',
        location: candidateProfile.location || '',
        linkedinUrl: candidateProfile.linkedinUrl || '',
      });
    }
  }, [candidateProfile, reset]);

  const onSubmit = async (data) => {
    // If linkedinUrl is empty string, convert to null
    const payload = { ...data };
    if (!payload.linkedinUrl) payload.linkedinUrl = null;
    if (!payload.phone) payload.phone = null;
    if (!payload.location) payload.location = null;

    try {
      const response = await updateProfile(payload);
      setCandidateProfile(response.data);
      showSuccess('Profile details synced successfully!');
    } catch (err) {
      showError(err.response?.data?.message || err.message || 'Failed to update profile details.');
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--text)' }}>Profile Details</h3>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.row}>
          <Input
            label="First Name"
            name="firstName"
            placeholder="First Name"
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <Input
            label="Last Name"
            name="lastName"
            placeholder="Last Name"
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>
        <div className={styles.row}>
          <Input
            label="Phone Number"
            name="phone"
            placeholder="Phone Number"
            error={errors.phone?.message}
            {...register('phone')}
          />
          <Input
            label="Location (City, Country)"
            name="location"
            placeholder="e.g. Chicago, IL"
            error={errors.location?.message}
            {...register('location')}
          />
        </div>
        <Input
          label="LinkedIn Profile URL"
          name="linkedinUrl"
          placeholder="https://linkedin.com/in/username"
          error={errors.linkedinUrl?.message}
          {...register('linkedinUrl')}
        />
        <div className={styles.actionRow}>
          <Button type="submit" loading={loading}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
