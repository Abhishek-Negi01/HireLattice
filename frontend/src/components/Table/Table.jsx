import React from 'react';
import styles from './style/Table.module.scss';
import Loader from '../Loader/Loader';

export const Table = ({
  headers = [], // ['Name', 'Role', 'Status'] or [{ key, label }]
  data = [],
  renderRow, // function: (item, index) => <tr key={index}>...</tr>
  loading = false,
  emptyMessage = 'No data available',
  hoverable = true,
  className = '',
}) => {
  const isStringHeaders = headers.length > 0 && typeof headers[0] === 'string';

  return (
    <div className={`${styles.tableWrapper} ${className}`}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            {headers.map((h, i) => (
              <th key={i} className={styles.th}>
                {isStringHeaders ? h : h.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={headers.length} className="text-center py-4">
                <Loader text="Loading records..." />
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className={styles.emptyState}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => {
              if (renderRow) return renderRow(item, index);
              // Fallback default renderer
              return (
                <tr
                  key={index}
                  className={`${styles.tr} ${hoverable ? styles.hoverable : ''}`}
                >
                  {isStringHeaders
                    ? headers.map((h, i) => (
                        <td key={i} className={styles.td}>
                          {item[h.toLowerCase()]}
                        </td>
                      ))
                    : headers.map((h, i) => (
                        <td key={i} className={styles.td}>
                          {item[h.key]}
                        </td>
                      ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
