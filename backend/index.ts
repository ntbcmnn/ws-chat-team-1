import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import usersRouter from './routers/users';
import config from "./config";
import mongoose from "mongoose";
import {ClientInfo, LoginMessage, Messages, OnlineUsers, SendMessage} from "./types";
import {Message} from "./models/Message";
import User from "./models/User";

const app = express();
expressWs(app);
const port = 8000;
app.use(cors());

app.use(express.json());
app.use(express.static('public'));

const router = express.Router();
app.use(router);
app.use("/users", usersRouter);

type IncomingMessage = LoginMessage | SendMessage;

const connectedClients: ClientInfo[] = [];
const onlineUser: OnlineUsers[] = []

router.ws('/chat', async (ws, req) => {
    connectedClients.push({ws, username: ""});
    console.log('Client connected. Client total: ' + connectedClients.length);

    const messages: Messages[] = await Message.find()
        .populate('user', 'displayName')
        .limit(30)
        .sort({_id: -1});

    ws.send(JSON.stringify({
        type: 'INCOMING_MESSAGE',
        payload: messages,
    }));

    ws.send(JSON.stringify({
        type: 'USER_LIST_UPDATE',
        payload: onlineUser
    }));

    ws.on('message', async (message) => {
        try {
            const decodedMessage = JSON.parse(message.toString()) as IncomingMessage;
            if (decodedMessage.type === "LOGIN") {
                const username = decodedMessage.payload;

                const client = connectedClients.find(client => client.ws === ws);

                if (client) {
                    client.username = username;
                }

                const existUser = onlineUser.find(user => user.displayName === username);

                if (!existUser) {
                    const user = await User.findOne({displayName: username});

                    if(user){
                        const newUser: OnlineUsers = {
                            _id: user._id.toString(),
                            displayName: user.displayName
                        }

                        onlineUser.push(newUser);
                    }
                }

                connectedClients.forEach(client =>{
                    client.ws.send(JSON.stringify({
                        type: 'USER_LIST_UPDATE',
                        payload: onlineUser
                    }))
                })
            }

            if (decodedMessage.type === "SEND_MESSAGE") {
                const newMessage = new Message({
                    user: decodedMessage.payload.user,
                    message: decodedMessage.payload.message,
                    date: new Date(),
                });
                await newMessage.save();

                const saveMsg = await Message.findById(newMessage._id).populate('user', 'displayName');

                const response = {type: "SEND_MESSAGE", payload: saveMsg};

                connectedClients.forEach(client => {
                    client.ws.send(JSON.stringify(response));
                });
            }
        } catch (error) {
            ws.send(JSON.stringify({error: "Invalid message format"}));
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');

        const index = connectedClients.findIndex(client => client.ws === ws);

        if (index !== -1) {
            const disconnectClient = connectedClients.splice(index,1)[0];

            const userIndex = onlineUser.findIndex(user => user._id === disconnectClient.username)

            if(userIndex !== -1){
                onlineUser.splice(userIndex, 1);
            }

            connectedClients.forEach(client => {
                client.ws.send(JSON.stringify({
                    type: 'USER_LIST_UPDATE',
                    payload: onlineUser
                }))
            })
        }

        console.log('Client total: ' + connectedClients.length);
    });
});

const run: () => Promise<void> = async () => {
    await mongoose.connect(config.db);

    app.listen(port, () => {
        console.log(`Listening on port http://localhost:${port}`);
    });
};

run().catch((err) => console.log(err));
