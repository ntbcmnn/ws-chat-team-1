import {WebSocket} from 'ws';
import {Types} from "mongoose";

export interface UserFields {
    username: string;
    password: string;
    token: string;
    role: string;
    displayName: string;
    googleID?: string;
    avatar?: string;
}

export interface Messages {
    _id: Types.ObjectId;
    message: string;
    user: Types.ObjectId;
    date: Types.Date;
}

export interface ClientInfo {
    ws: WebSocket;
    userId: string;
}

export interface LoginMessage {
    type: "LOGIN";
    payload: string;
}

export interface SendMessage {
    type: "SEND_MESSAGE";
    payload: {
        user: string;
        message: string;
        date: Date;
    };
}

export interface DeleteMessage {
    type: "DELETE_MESSAGE";
    payload: string
}

export interface OnlineUsers{
    _id: string;
    displayName: string;
}