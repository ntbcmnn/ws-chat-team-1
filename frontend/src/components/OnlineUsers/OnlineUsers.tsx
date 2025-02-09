import { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../app/hooks.ts';
import { selectUser } from '../../store/slices/usersSlice.ts';

const OnlineUsers = () => {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const ws = useRef<WebSocket | null>(null);
  const user = useAppSelector(selectUser);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8000/chat');

    ws.current.onopen = () => {
      ws.current?.send(JSON.stringify({
        type: 'LOGIN',
        payload: user?.displayName,
      }));
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'USER_LIST_UPDATE' && Array.isArray(data.payload)) {
          setOnlineUsers(data.payload);
        } else {
          console.log('Получено сообщение другого типа:', data);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  return (
    <div className="border rounded-3 w-25 p-4">
      <h3 className="text-center mb-5">Users online</h3>
      <div className="d-flex flex-column align-items-center">
        {onlineUsers.map((user, index) =>
          <div key={index} className="d-flex align-items-center pb-3 gap-2 border-bottom">
            <p className="m-0 p-0 online-user fw-bold">{user}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnlineUsers;