import React from 'react';
import './Notification.css';

function Notification({ message, type, onClose }) {
  const className = `notification ${type}`;

  return (
    <div className={className}>
      <p>{message}</p>
      {onClose && (
        <button onClick={onClose} className="close-button">
          &times;
        </button>
      )}
    </div>
  );
}

export default Notification;