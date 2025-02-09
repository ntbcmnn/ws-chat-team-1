import { useEffect, useRef, useState } from 'react';
import { WebSocket } from 'vite';
import { IMessages, ISendMessage } from '../../types';
import Messages from '../../components/Messages/Messages.tsx';

const Home = () => {
  const ws = useRef<WebSocket | null>(null);

  const[message, setMessage] = useState<IMessages[]>([]);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8000/chat');

    ws.current.onmessage = (e) =>{
      const decodedMessage = JSON.parse(e.data) as ISendMessage;

      if(decodedMessage.type === 'SEND_MESSAGE'){
        setMessage((prevState) => [...prevState, decodedMessage.payload]);
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
      {message.map(msg => (
        <Messages
          key={msg._id}
          user = {msg.user.displayName}
          message={msg.message}
          date={msg.date}
        />
      ))}

    </div>
  );
};

export default Home;