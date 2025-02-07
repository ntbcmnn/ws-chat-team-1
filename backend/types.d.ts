import {WebSocket} from 'ws';
import {Types} from "mongoose";

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

export interface Messages{
    _id: Types.ObjectId;
    message: string;
    user: Types.ObjectId;
    date: Types.Date;
}
