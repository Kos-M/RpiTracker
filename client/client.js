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
const RECONECT_TIMEOUT = 10000;
const KEEP_ALIVE = 15000;
const printConnectionStats_Interval = 180000;
const crypto = require('crypto'), hash = crypto.getHashes();
var ID = null;
var now = new Date();
var conn_establish_= null;


async function Logger(msg){
	now = new Date();
	if (typeof(msg) == "object"){
		console.log(typeof(msg))
		console.dir(  msg)
	}else{
		console.log('\n[ ' + now.toLocaleTimeString() + " ] "+msg)
	}
	
}

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
	ID = await execCute("hostname -I | awk '{print $1}'").then(  (result, error) => {
		if (error) Logger(error)
		let host = result;
	return	 execCute("uname  -nmsr").then((result, error) => {
			if (error) Logger(error)
			let identity = host.concat(result)
		return	ID = crypto.createHash('sha1').update(identity).digest('hex');
		})
	
	})
	const ws = new WebSocket(SERVER);
	ws.on('error', function (e) {
		Logger(e.code + " " + e.address + " port:" + e.port);
	});
	ws.on('ping', heartbeat);
	ws.on('open', function open() {
		let ans = { "msg": `${Protocol.Connecting}`, "id": ID }
		//Logger(ans)
		ws.send(JSON.stringify(ans))
		//heartbeat();
	});
	ws.on('close', function close() {
		Logger('Disconnected from server.');
		ws.terminate();
		setTimeout(() => {
			connect();
		}, RECONECT_TIMEOUT);
		conn_establish_= null;
	});

	ws.on('message', async function incoming(data) {
		let ans = JSON.parse(data);
		//Logger(ans)
		switch (ans.msg) {
			case Protocol.Connected:
				conn_establish_= new Date();
				Logger("Connection with server established.")
				heartbeat();
				break;
			case Protocol.GET_UP_TIME:
				execCute("uptime -s").then((result, error) => {
					if (error) Logger(error)
					let x = { "msg": `${Protocol.ANS_UPTIME}`, "value": result }
					ws.send(JSON.stringify(x))
				})
				break;
			case Protocol.GET_OS:
				execCute(" uname  -nmsr").then((result, error) => {
					if (error) Logger(error)
					let y = { "msg": `${Protocol.ANS_OS}`, "value": result }
					ws.send(JSON.stringify(y))
				})
				break;
			case Protocol.GET_HOST_NAME:
				execCute("hostname").then((result, error) => {
					if (error) Logger(error)
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
				Logger(" Received not known message :" + ans);
				break;
		}
	});
	function heartbeat() { // ping keep_alive		
		process.stdout.write("○")
		clearTimeout(ws.pingTimeout);
		ws.pingTimeout = setTimeout(() => {
			ws.terminate();
			Logger("Terminate Connection with server")
		}, KEEP_ALIVE);

	}


}
async function printConnectionStats() {
	Logger("Maintain connection since:" + moment(conn_establish_).fromNow())
}
connect();