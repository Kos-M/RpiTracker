/**
 * Author : Kos-M
 * Email : t13droid@gmail.com
 * Date : 11/3/2020
 * Description: This is websocket client ,implement to run in any raspberry pi
 * in order to get info about os , running programms and general purpose controlling.
 */
const WebSocket = require('ws');
const exec = require('child_process').exec;
const moment = require('moment');
const Protocol = require('./protocol');
const SERVER = "ws:///localhost:8080";
const RECONECT_TIMEOUT = 5000;
const KEEP_ALIVE = 12000;
const printConnectionStats_Interval = 60000;
const crypto = require('crypto'), hash = crypto.getHashes();
var ID = null;
var now = new Date();




setInterval(printConnectionStats, printConnectionStats_Interval);
const execCute = function (command) {
	return new Promise(function (resolve, reject) {
		try {
			exec(command, function (error, stdout, stderr) {
				if (error) reject(error)
				resolve(stdout)
			})
		} catch (e) {
			reject(e)
		}
	})
}

async function connect() {

	ID = await execCute("hostname -I | awk '{print $1}'").then((result, error) => {
		if (error) console.log(error)
		let host = result;
		execCute("uname  -nmsr").then((result, error) => {
			if (error) console.log(error)
			let identity = host.concat(result)
			ID = crypto.createHash('sha1').update(identity).digest('hex');
		})

	})
	const ws = new WebSocket(SERVER);
	ws.on('error', function (e) {
		console.log(e.code + " " + e.address + " port:" + e.port);
	});
	ws.on('ping', heartbeat);
	ws.on('open', function open() {
		let ans = { "msg": `${Protocol.Connecting}`, "id": ID }
		ws.send(JSON.stringify(ans))
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
			case Protocol.GET_UP_TIME:
				execCute("uptime -s").then((result, error) => {
					if (error) console.log(error)
					let x = { "msg": `${Protocol.ANS_UPTIME}`, "value": result }
					ws.send(JSON.stringify(x))
				})
				break;
			case Protocol.GET_OS:
				execCute(" uname  -nmsr").then((result, error) => {
					if (error) console.log(error)
					let y = { "msg": `${Protocol.ANS_OS}`, "value": result }
					ws.send(JSON.stringify(y))
				})
				break;
			case Protocol.GET_HOST_NAME:
				execCute("hostname").then((result, error) => {
					if (error) console.log(error)
					let z = { "msg": `${Protocol.ANS_HOST_NAME}`, "value": result }
					ws.send(JSON.stringify(z))
				})
				break;
			case Protocol.DO_REBOOT:
				exec("reboot now", await execCB);
				break;
			case Protocol.DO_SHUTDOWN:
				ans = await exec("shtudown now", await execCB);
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


}
async function printConnectionStats() {
	console.log("Maintain connection since:" + moment(now).fromNow())
}
connect();