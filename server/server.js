const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 }, ()=> {
console.log("Server started")
});

function noop() {	}
function heartbeat() {
  this.isAlive = true;
//  console.log("pong")
}
wss.on('connection', function connection(ws , req ) {
	ws.isAlive = true;
    ws.on('pong', heartbeat);
    ws.on('message', function incoming(message) {
      switch (message){
          case "connecting":
              var ip = req.headers['x-forwarded-for'] ||   req.connection.remoteAddress ||  req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);     
              console.log('Client [%s] sends: %s', ip,message);
  //            ws.send('connected');              
              break;
 }
  });
});
const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false){
      console.log("terminate session")
        return ws.terminate();
        }

    ws.isAlive = false;
    ws.ping(noop);
  });
}, 10000);