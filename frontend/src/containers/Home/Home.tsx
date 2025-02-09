import { useEffect, useRef, useState } from 'react';
import { IMessages } from '../../types';
import Messages from '../../components/Messages/Messages.tsx';
import MessagesForm from "../../components/MessagesForm/MessagesForm.tsx";
import {useAppSelector} from "../../app/hooks.ts";
import {selectUser} from "../../store/slices/usersSlice.ts";

const Home = () => {
  const ws = useRef<WebSocket | null>(null);
  const user = useAppSelector(selectUser);

  const[message, setMessage] = useState<IMessages[]>([]);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8000/chat');

    ws.current.onmessage = (e) =>{
      const decodedMessage = JSON.parse(e.data);
      console.log('Received message:', decodedMessage);

      if(decodedMessage.type === 'SEND_MESSAGE'){
        setMessage((prevState) => [...prevState, decodedMessage.payload]);
      }else if(decodedMessage.type === 'INCOMING_MESSAGE'){
        setMessage(decodedMessage.payload);
      }
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };

  }, []);

  const sendMessage = (text: string) => {
    if (ws.current) {
      ws.current.send(JSON.stringify({
        type: 'SEND_MESSAGE',
        payload: {
          user: user,
          message: text
        }
      }));
    }
  };

  return (
    <div>
      <MessagesForm onSendMessage={sendMessage}/>
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