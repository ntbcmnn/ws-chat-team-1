import {useEffect, useRef, useState} from 'react';
import {IMessages} from '../../types';
import Messages from '../../components/Messages/Messages.tsx';
import MessagesForm from "../../components/MessagesForm/MessagesForm.tsx";
import {useAppSelector} from "../../app/hooks.ts";
import {selectUser} from "../../store/slices/usersSlice.ts";
import OnlineUsers from '../../components/OnlineUsers/OnlineUsers.tsx';

const Home = () => {
    const ws = useRef<WebSocket | null>(null);
    const user = useAppSelector(selectUser);
    const [message, setMessage] = useState<IMessages[]>([]);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8000/chat');

        ws.current.onmessage = (e) => {
            const decodedMessage = JSON.parse(e.data);

            if (decodedMessage.type === 'SEND_MESSAGE') {
                setMessage((prevState) => [decodedMessage.payload, ...prevState]);
            } else if (decodedMessage.type === 'INCOMING_MESSAGE') {
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
                    message: text,
                    date: new Date().toISOString(),
                }
            }));
        }
    };

    return (
        <div className="d-flex justify-content-center gap-4">
            <div className="w-50">
                <OnlineUsers/>
            </div>
            <div className="w-75">
                <MessagesForm onSendMessage={sendMessage}/>
                {message.length === 0 ? (
                    <h3 className="text-center">No messages</h3>
                ) : (
                    message.map(msg => (
                        <Messages
                            key={msg._id}
                            displayName={msg.user.displayName}
                            message={msg.message}
                            date={msg.date}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default Home;