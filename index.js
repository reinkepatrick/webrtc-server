const io = require('socket.io')();

io.on('connection', client => {
    console.log(client);
    client.on('disconnect', () => { console.log("Client disconneceted!") });
});

io.listen(3000);