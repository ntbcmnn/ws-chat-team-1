import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import {WebSocket} from 'ws';
import usersRouter from './routers/users';
import config from "./config";
import mongoose from "mongoose";
import User from "./models/User";
import {Messages} from "./types";
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

const connectedClients: WebSocket[] = [];

interface IncomingMessage {
    type: string;
    payload: string;
}

router.ws('/chat', async (ws, req) => {
    connectedClients.push(ws);
    console.log('Client connected. Client total: ' + connectedClients.length);

    const messages : Messages[] = await Message.find().populate('user', 'displayName').limit(30).sort({ _id: -1 });

    ws.send(
        JSON.stringify({
            type: 'IN_COMING_MESSAGE',
            payload: messages,
        }),
    )
    ws.on('message', async (message) => {
        try {
            const decodedMessage = JSON.parse(message.toString());

            if (decodedMessage.type === "LOGIN") {
                const token = decodedMessage.payload;

                if (!token) {
                    ws.send(JSON.stringify({error: "Invalid token"}))
                    return;
                }

                const user = await User.findOne({token})
                connectedClients.forEach(clientWs => {
                    clientWs.send(JSON.stringify({
                        payload:{
                            username: user?.username
                        }
                    }))
                });
            }

            if(decodedMessage.type === "SEND_MESSAGE") {

                const newMessage = new Message({
                    user: decodedMessage.payload.user,
                    message: decodedMessage.payload.message,
                })
                await newMessage.save();

                const response = {type: "SEND_MESSAGE", payload: newMessage};

                connectedClients.forEach((clientWS) => {
                    clientWS.send(JSON.stringify(response))
                })
            }
        } catch (error) {
            ws.send(JSON.stringify({error: "Invalid message format"}))
        }
    });

    ws.on('close', () => {
        console.log('client disconnected');
        const index = connectedClients.indexOf(ws);
        connectedClients.splice(index, 1);
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

