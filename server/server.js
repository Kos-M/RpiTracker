/**
 * Author : Kos-M
 * Date : 11/3/2020
 * Description: This is websocket server ,its supposed to run in a server with a domain , or a static ip
 * in order all clients can reach it .All connections are client initiated , server is here to gather all info.
 */
const WebSocket = require('ws');
const Protocol = require('./protocol');
const moment = require('moment');
//const exec = require('child_process').exec;
const PORT = 8080;
const KEEP_ALIVE = 10000;
const printConnections_Interval = 40000;

const wss = new WebSocket.Server({ port: PORT }, () => {
  console.log("Server initiated , listeninng on " + PORT)
});
setInterval(printConnections, printConnections_Interval);

function noop() { }
function heartbeat() { // pong
  this.isAlive = true;
  console.log("+")
}
wss.on('connection', function connection(ws, req) {
  ws.isAlive = true;
  ws.on('pong', heartbeat);
  ws.on('message', function incoming(message) {
    switch (message) {
      case Protocol.Connecting:
        let now = new Date();
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
        console.log('[ ' + now.toLocaleTimeString() + ' ] Client [%s] sends: %s ', ip, message + " " + moment(now).fromNow());
        ws.send(Protocol.Connected);   
        ws.send(Protocol.GetUpTime);      
        break;
        default:
          console.log(message)
    }
  });
});
const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) {
      console.log("terminate session")
      return ws.terminate();
    }

    ws.isAlive = false;
    ws.ping(noop);
  });
}, KEEP_ALIVE);

async function printConnections() {
  console.log("Connections:" + wss._server._connections)
}


