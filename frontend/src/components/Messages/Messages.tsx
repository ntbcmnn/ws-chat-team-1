import React from 'react';
import dayjs from 'dayjs';

interface MessageProps {
  displayName: string;
  message: string;
  date: string;
}

const Messages: React.FC<MessageProps> = ({ displayName, message, date }) => {
  const formatDate = dayjs(date).format('DD/MM/YYYY');
  const formatTime = dayjs(date).format('HH:mm:ss');

  return (
      <div className="container my-4">
        <div className="card">
          <div className="card-body" style={{ position: 'relative' }}>
            <div className="d-flex justify-content-between">
              <strong>{displayName}</strong>
            </div>
            <div className="mt-2 mb-5">
              <p>{message}</p>
            </div>
            <div style={{ position: 'absolute', bottom: '10px', left: '10px' }}>
              <small className="text-muted">{formatDate}</small>
            </div>
            <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
              <small className="text-muted">{formatTime}</small>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Messages;
