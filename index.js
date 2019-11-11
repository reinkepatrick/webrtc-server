const io = require('socket.io')();

io.on('connection', client => {});

io.listen(3000);