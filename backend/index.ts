import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import {WebSocket} from 'ws';
import usersRouter from './routers/users';
import config from "./config";
import mongoose from "mongoose";

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

router.ws('/chat', (ws, req) => {
    connectedClients.push(ws);
    console.log('Client connected. Client total: ' + connectedClients.length);

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


app.listen(port, () => {
    console.log(`Server started on ${port} port`);
});