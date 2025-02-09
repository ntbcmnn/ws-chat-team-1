import { useEffect, useRef, useState } from 'react';
import { IMessages } from '../../types';
import Messages from '../../components/Messages/Messages.tsx';
import { useAppSelector } from '../../app/hooks.ts';
import { selectUser } from '../../store/slices/usersSlice.ts';
import MessagesForm from '../../components/MessagesForm/MessagesForm.tsx';
import Loader from '../../components/UI/Loader/Loader.tsx';


const Home = () => {
  const ws = useRef<WebSocket | null>(null);
  const user = useAppSelector(selectUser);

  const[message, setMessage] = useState<IMessages[]>([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8000/chat');

    ws.current.onmessage = (e) =>{
      const decodedMessage = JSON.parse(e.data);

      if(decodedMessage.type === 'SEND_MESSAGE'){
        setMessage((prevState) => [decodedMessage.payload, ...prevState]);
      }else if(decodedMessage.type === 'INCOMING_MESSAGE'){
        setMessage(decodedMessage.payload);
      }
      setLoading(false);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };

  }, []);

  const sendMessage = (text: string) => {
    if (ws.current) {
      setLoading(true);
      ws.current.send(JSON.stringify({
        type: 'SEND_MESSAGE',
        payload: {
          user: user,
          message: text,
          date: new Date().toISOString(),
        }
      }));
    }
  };


  return (
    <div>
      <MessagesForm onSendMessage={sendMessage}/>
      {loading ? (
        <Loader />
      ):
        <>
          {message.map(msg => (
              <Messages
                key={msg._id}
                displayName = {msg.user?.displayName || 'Unknown User'}
                message={msg.message}
                date={msg.date}
              />
            ))}
        </>
      }
    </div>
  );
};

export default Home;