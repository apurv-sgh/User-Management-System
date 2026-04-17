import React from 'react';
import styles from '../styles/Pagination.module.css';

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  loading = false,
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className={styles.pagination}>
      <button
        className={styles.btn}
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1 || loading}
      >
        « First
      </button>
      <button
        className={styles.btn}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
      >
        ‹ Previous
      </button>

      {currentPage > Math.ceil(5 / 2) && totalPages > 5 && (
        <span className={styles.ellipsis}>...</span>
      )}

      {getPageNumbers().map((page) => (
        <button
          key={page}
          className={`${styles.btn} ${currentPage === page ? styles.active : ''}`}
          onClick={() => onPageChange(page)}
          disabled={loading}
        >
          {page}
        </button>
      ))}

      {currentPage < totalPages - Math.floor(5 / 2) && totalPages > 5 && (
        <span className={styles.ellipsis}>...</span>
      )}

      <button
        className={styles.btn}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || loading}
      >
        Next ›
      </button>
      <button
        className={styles.btn}
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages || loading}
      >
        Last »
      </button>

      <span className={styles.info}>
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
};
