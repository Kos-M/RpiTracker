const WebSocket = require('ws');
function connect() {
	const ws = new WebSocket('ws:///localhost:8080');
	ws.on('ping', heartbeat);
	ws.on('open', function open() {
    	heartbeat();
    	ws.send('connecting');
	});
	ws.on('close', function close() {
	console.log('disconnected from server.');
	clearTimeout(this.pingTimeout);
    setTimeout(() => {
    	connect();
  	}, 5000);
	});
	ws.on('error', function (e) {
		 console.log(e.code+" "+e.address + " port:"+e.port);
	});
	ws.on('message', function incoming(data) {
 		console.log(data);
	});
function heartbeat() {
  clearTimeout(this.pingTimeout);
  console.log("ping")
  this.pingTimeout = setTimeout(() => {
    ws.terminate();
  }, 10000 + 4000);
}
}


connect();