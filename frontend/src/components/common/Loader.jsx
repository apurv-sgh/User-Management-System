import React from 'react';

export const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="spinner flex-center">
      <div style={{ textAlign: 'center' }}>
        <div className="loader" style={{ marginBottom: '1rem' }}></div>
        <p className="text-muted">{message}</p>
      </div>
    </div>
  );
};
