const express = require('express')
const app = express()
const server = require('http').createServer(app);
const WebSocket = require('ws');

const wss = new WebSocket.Server({ server:server });

var clients = new Map();

wss.on('connection', (ws) => {
    console.log('A new client Connected!');

    var sessionID = null;

    ws.on('message', (message) => {

        var data = JSON.parse(message);
        console.log(data);


    });
});

app.get('/', (req, res) => res.send('Hello World!'));

server.listen(3000, () => console.log(`Lisening on port :3000`));