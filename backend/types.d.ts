import {WebSocket} from 'ws';

export interface UserFields {
    username: string;
    password: string;
    token: string;
    role: string;
    displayName: string;
    googleID?: string;
}

export interface ActiveConnections {
    [id: string]: WebSocket
}
