import React from 'react';
import Alert from 'react-bootstrap/Alert';

function Notification({ message, type }) {
  return (
    <Alert variant={type}>
      {message}
    </Alert>
  );
}

export default Notification;