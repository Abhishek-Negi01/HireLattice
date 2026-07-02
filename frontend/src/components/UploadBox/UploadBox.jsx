import React, { useRef, useState } from 'react';
import styles from './style/UploadBox.module.scss';
import { FiUploadCloud } from 'react-icons/fi';

export const UploadBox = ({
  onFilesSelected,
  accept = '.pdf,.docx,.zip',
  multiple = false,
  disabled = false,
  className = '',
  maxSizeMsg = '15MB limit',
}) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (multiple) {
        onFilesSelected(e.dataTransfer.files);
      } else {
        onFilesSelected(e.dataTransfer.files[0]);
      }
    }
  };

  const handleFileChange = (e) => {
    if (disabled) return;

    if (e.target.files && e.target.files.length > 0) {
      if (multiple) {
        onFilesSelected(e.target.files);
      } else {
        onFilesSelected(e.target.files[0]);
      }
    }
  };

  const handleClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`
        ${styles.uploadZone}
        ${dragActive ? styles.active : ''}
        ${disabled ? styles.disabled : ''}
        ${className}
      `}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handleFileChange}
        className={styles.fileInput}
      />
      <FiUploadCloud className={styles.uploadIcon} />
      <div className={styles.title}>
        Drag & drop files here, or <span className={styles.browseLink}>browse</span>
      </div>
      <div className={styles.subtitle}>
        Supports PDF, DOCX, and ZIP formats (up to {maxSizeMsg})
      </div>
    </div>
  );
};

export default UploadBox;
