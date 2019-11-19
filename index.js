const io = require('socket.io')();

const getAllClients = () => {
    let allClients = [];
    Object.keys(clients).forEach((element, key, _array) => {
        allClients = _array;
    });

    return allClients;
}

let clients = {};

io.on('connection', client => {
    client.on('ready', data => {
        clients[client.id] = client;
        let allClients = getAllClients();

        io.emit('clients', {
            clients: allClients
        });
    });

    client.on('setDescription', (desc) => {
        client.broadcast.emit('remoteDescription', desc);
    });

    client.on('disconnect', () => { 
        console.log(client.id + ' disconnected!');
        delete clients[client.id];
        let allClients = getAllClients();

        io.emit('clients', {
            clients: allClients
        });
    });
});

io.listen(3000);