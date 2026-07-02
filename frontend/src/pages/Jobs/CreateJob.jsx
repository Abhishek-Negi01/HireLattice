import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import styles from './style/Jobs.module.scss';
import useJobs from '../../hooks/useJobs';
import Input from '../../components/Input/Input';
import Textarea from '../../components/Textarea/Textarea';
import Select from '../../components/Select/Select';
import Button from '../../components/Button/Button';
import { NotificationContext } from '../../contexts/NotificationContext';

const jobSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  department: z.string().min(1, 'Department is required'),
  location: z.string().min(1, 'Location is required'),
  employmentType: z.enum(['full-time', 'part-time', 'contract', 'internship'], {
    errorMap: () => ({ message: 'Please select a valid employment type' }),
  }),
});

export const CreateJob = () => {
  const { createNewJob, loading } = useJobs();
  const { showSuccess, showError } = useContext(NotificationContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: '',
      description: '',
      department: '',
      location: '',
      employmentType: 'full-time',
    },
  });

  const onSubmit = async (data) => {
    try {
      await createNewJob(data);
      showSuccess('Job listing posted successfully!');
      navigate('/recruiter/jobs');
    } catch (err) {
      showError(err.response?.data?.message || err.message || 'Failed to post job listing');
    }
  };

  return (
    <div className="max-w-3xl">
      <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--text)' }}>Create Job Listing</h3>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <Input
          label="Job Title"
          name="title"
          placeholder="e.g. Senior Software Engineer"
          error={errors.title?.message}
          {...register('title')}
        />
        <div className={styles.row}>
          <Input
            label="Department"
            name="department"
            placeholder="e.g. Engineering"
            error={errors.department?.message}
            {...register('department')}
          />
          <Input
            label="Location"
            name="location"
            placeholder="e.g. San Francisco, CA (or Remote)"
            error={errors.location?.message}
            {...register('location')}
          />
        </div>
        <Select
          label="Employment Type"
          name="employmentType"
          options={[
            { value: 'full-time', label: 'Full-Time' },
            { value: 'part-time', label: 'Part-Time' },
            { value: 'contract', label: 'Contract' },
            { value: 'internship', label: 'Internship' },
          ]}
          error={errors.employmentType?.message}
          {...register('employmentType')}
        />
        <Textarea
          label="Job Description"
          name="description"
          placeholder="Outline roles, responsibilities, required skills, and benefits..."
          rows={6}
          error={errors.description?.message}
          {...register('description')}
        />
        <div className={styles.actionRow}>
          <Button variant="secondary" onClick={() => navigate('/recruiter/jobs')} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Post Job Listing
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateJob;
