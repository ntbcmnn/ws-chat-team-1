import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import usersRouter from './routers/users';
import config from "./config";
import mongoose from "mongoose";
import {ClientInfo, LoginMessage, Messages, SendMessage} from "./types";
import {Message} from "./models/Message";

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

    ws.on('message', async (message) => {
        try {
            const decodedMessage = JSON.parse(message.toString()) as IncomingMessage;
            if (decodedMessage.type === "LOGIN") {
                const username = decodedMessage.payload;

                const client = connectedClients.find(client => client.ws === ws);

                if (client) {
                    client.username = username;
                }

                const userList = connectedClients
                    .map(client => client.username)
                    .filter(name => name !== "");

                connectedClients.forEach(client => {
                    client.ws.send(JSON.stringify({
                        type: 'USER_LIST_UPDATE',
                        payload: userList
                    }));
                });
            }

            if (decodedMessage.type === "SEND_MESSAGE") {
                const newMessage = new Message({
                    user: decodedMessage.payload.user,
                    message: decodedMessage.payload.message,
                });

                await newMessage.save();
                const response = {type: "SEND_MESSAGE", payload: newMessage};

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
            connectedClients.splice(index, 1);
        }

        const userList = connectedClients
            .map(client => client.username)
            .filter(name => name !== "");

        connectedClients.forEach(client => {
            client.ws.send(JSON.stringify({
                type: 'USER_LIST_UPDATE',
                payload: userList
            }));
        });

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
