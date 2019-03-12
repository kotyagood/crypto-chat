var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const roster = [];

// Connection event
io.on('connection', (socket) => {
    console.log(`io.on.connection > ${JSON.stringify({ query: socket.handshake.query, id: socket.id })}`);

    const { nickName, key } = socket.handshake.query;
    const socketId = socket.id;

    // Nick and key are required
    if (!nickName || !key) {
        socket.disconnect(true);
        return;
    }

    // Looking for existing connections with the same key
    const rosterItem = roster.find((item) => item.key === key);

    if (rosterItem) {
        rosterItem.nickName = nickName;
        rosterItem.clients.push(socketId);
    } else {
        roster.push({
            key,
            nickName,
            clients: [socketId],
        });
    }

    console.log(`io.on.connection ? roster ${JSON.stringify({ roster })}`);
    io.emit('roster', roster);

    socket.on('message', ({ recepient, encryptedMsg, nonce }) => {
        console.log(`io.on.message ? ${JSON.stringify({ recepient, encryptedMsg, nonce })}`);

        const rosteItem = roster.find((item) => item.key === recepient);

        if (!rosteItem) {
            console.log(`io.on.message ! no recepient`);
            return;
        }

        rosteItem.clients.forEach((socketId) =>
            io.to(socketId).emit('message', { encryptedMsg, nonce, sender: key, senderNickName: nickName }));
    });

    socket.on('disconnect', () => {
        console.log(`io.on.disconnection ? ${JSON.stringify({ key, socketId })}`);

        const itemIndex = roster.findIndex((item) => item.key === key);
        const item = roster[itemIndex];

        const clientIndex = item.clients.indexOf(socketId);
        item.clients.splice(clientIndex, 1);

        if (item.clients.length == 0) {
            // No more connections with this key. Remove roster item.
            roster.splice(itemIndex, 1);
        }

        console.log(`io.on.disconnection ? roster ${JSON.stringify({ roster })}`);
        io.emit('roster', roster);
    })
});

const expressPort = process.env.EXPRESS_PORT || 3001;

http.listen(expressPort, function () {
    console.info(`Chat backend started.Listening on *: ${expressPort}`);
});