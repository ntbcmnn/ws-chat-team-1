import React from 'react';
import dayjs from 'dayjs';
import {useAppSelector } from '../../app/hooks.ts';
import { selectUser } from '../../store/slices/usersSlice.ts';

interface MessageProps {
  displayName: string;
  message: string;
  date: string;
  _id: string;
  onDelete: (id: string) => void;
}

const Messages: React.FC<MessageProps> = ({_id, displayName, message, date, onDelete}) => {
  const formatDate = dayjs(date).format('DD/MM/YYYY');
  const formatTime = dayjs(date).format('HH:mm:ss');
  const user = useAppSelector(selectUser);

  return (
    <div className="container my-4">
      <div className="card">
        <div className="card-body" style={{position: 'relative'}}>
          <div className="d-flex justify-content-between">
            <strong>{displayName}</strong>
          </div>
          <div className="mt-2 mb-5">
            <p>{message}</p>
          </div>
          {user?.role === 'moderator' && (
            <div className="mt-2 mb-5">
              <button className="btn btn-primary" onClick={() => onDelete(_id)}>Delete</button>
            </div>
          )}
          <div style={{position: 'absolute', bottom: '10px', left: '10px'}}>
            <small className="text-muted">{formatDate}</small>
          </div>
          <div style={{position: 'absolute', bottom: '10px', right: '10px'}}>
            <small className="text-muted">{formatTime}</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;