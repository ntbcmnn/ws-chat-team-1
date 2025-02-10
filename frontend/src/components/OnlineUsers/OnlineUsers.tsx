import {useEffect, useRef, useState} from 'react';
import {useAppSelector} from '../../app/hooks.ts';
import {selectUser} from '../../store/slices/usersSlice.ts';
import { IOnlineUser } from '../../types';

const OnlineUsers = () => {
  const [olineUsers, setOlineUsers] = useState<IOnlineUser[]>([]);
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
                  setOlineUsers(data.payload);
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
    }, [user?.displayName]);

    return (
        <div className="rounded-3 p-4 bg-primary-subtle">
            <h3 className="text-center mb-3">Users online</h3>
            <div className="d-flex flex-column align-items-center">
                {olineUsers.length > 0 ?
                  olineUsers.map((user, index) => (
                        <div key={index} className="d-flex align-items-center py-2 gap-2">
                            <p className="m-0 p-0 online-user">{user.displayName}</p>
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