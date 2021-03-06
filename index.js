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

    client.on('setDescription', data => {
        if (data.desc) {
            io.to(data.to).emit('remoteDescription', {
                from: client.id,
                desc: data.desc,
            });
        } else if (data.candidate) {
            io.to(data.to).emit('remoteDescription', {
                from: client.id,
                candidate: data.candidate,
            });
        }
    });

    client.on('call', data => {
        console.log(data);
        if (data.offer) {
            io.to(data.to).emit('call', {
                from: client.id,
                offer: data.offer
            });
        } else if (data.accepted !== undefined) {
            io.to(data.to).emit('call', {
                from: client.id,
                accepted: data.accepted
            });
        }
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