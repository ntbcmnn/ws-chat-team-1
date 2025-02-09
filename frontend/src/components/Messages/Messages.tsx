import React from 'react';

interface MessageProps {
  user: string;
  message: string;
  date: string;
}

const Messages: React.FC<MessageProps> = ({ user, message, date }) => {
  return (
    <div className="container my-4">
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between">
            <strong>{user}</strong>
          </div>
          <div className="mt-2">
            <p>{message}</p>
          </div>
          <div className="d-flex justify-content-end mt-2">
            <small className="text-muted">{date}</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
