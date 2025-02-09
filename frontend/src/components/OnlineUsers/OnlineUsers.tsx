import {useEffect, useRef, useState} from 'react';
import {useAppSelector} from '../../app/hooks.ts';
import {selectUser} from '../../store/slices/usersSlice.ts';

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
    }, [ws.current]);

    return (
        <div className="rounded-3 p-4 bg-primary-subtle">
            <h3 className="text-center mb-3">Users online</h3>
            <div className="d-flex flex-column align-items-center">
                {onlineUsers.length > 0 ?
                    onlineUsers.map((user, index) => (
                        <div key={index} className="d-flex align-items-center py-2 gap-2">
                            <p className="m-0 p-0 online-user">{user}</p>
                        </div>
                    ))
                    :
                    <p className="text-center">No users online</p>
                }
            </div>
        </div>
    );
};

export default OnlineUsers;