const WebSocket = require('ws');
const exec = require('child_process').exec;
const moment = require('moment');
const Protocol = require('./protocol');
const SERVER = "ws:///localhost:8080";
const RECONECT_TIMEOUT = 10000;
const KEEP_ALIVE = 12000;

async function connect() {
	const ws = new WebSocket(SERVER);
	ws.on('error', function (e) {
		console.log(e.code + " " + e.address + " port:" + e.port);
	});
	ws.on('ping', heartbeat);
	ws.on('open', function open() {
		ws.send(Protocol.Connecting);
		heartbeat();
	});
	ws.on('close', function close() {
		console.log('disconnected from server.');
		ws.terminate();
		setTimeout(() => {
			connect();
		}, RECONECT_TIMEOUT);
	});

	ws.on('message', async function incoming(data) {

		switch (data) {
			case Protocol.Connected:
				now = new Date();
				console.log('[ ' + now.toLocaleTimeString() + " ] Connection with server established.")
				break;
			case Protocol.GetUpTime:
				let app = exec("uptime -p", await execCB);	
				break;		
			default:
			    now = new Date();
				console.log('[ ' + now.toLocaleTimeString() + " ] Received not known message :" + data);
				break;
		}
	});
	function heartbeat() { // ping keep_alive
		console.log("-")
		clearTimeout(ws.pingTimeout);
		ws.pingTimeout = setTimeout(() => {
			ws.terminate();
			console.log("Terminate Connection with server")
		}, KEEP_ALIVE);

	}
	async function execCB(error, stdout, stderr) {
		if (error) {
			console.error(`exec error: ${error}`);
			return;
		}
		ws.send(stdout)
	}
}


connect();