import { useEffect, useRef, useState } from 'react';
import { IMessages } from '../../types';
import Messages from '../../components/Messages/Messages.tsx';

const Home = () => {
  const ws = useRef<WebSocket | null>(null);

  const[message, setMessage] = useState<IMessages[]>([]);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8000/chat');

    ws.current.onmessage = (e) =>{
      const decodedMessage = JSON.parse(e.data);
      console.log('Received message:', decodedMessage);

      if(decodedMessage.type === 'SEND_MESSAGE'){
        setMessage((prevState) => [...prevState, decodedMessage.payload]);
      }else if(decodedMessage.type === 'IN_COMING_MESSAGE'){
        setMessage(decodedMessage.payload);
      }
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };

  }, []);

  return (
    <div>
      {message.length === 0 ? (
        <p>No messages</p>
      ) : (
        message.map(msg => (
          <Messages
            key={msg._id}
            displayName = {msg.user?.displayName || 'Unknown User'}
            message={msg.message}
            date={msg.date}
          />
        ))
      )}
    </div>
  );
};

export default Home;