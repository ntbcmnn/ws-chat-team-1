import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import {WebSocket} from 'ws';
import usersRouter from './routers/users';

const app = express();
expressWs(app);
const port = 8000;
app.use(cors());

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

app.listen(port, () => {
    console.log(`Server started on ${port} port`);
});