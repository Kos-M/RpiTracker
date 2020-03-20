/**
 * Author : Kos-M
 * Email : t13droid@gmail.com
 * Date : 11/3/2020
 * Description: This is websocket client ,implement to run in any raspberry pi
 * in order to get info about os , running programms and general purpose controlling.
 */
const WebSocket = require('ws');
const exec = require('child_process').exec;
const Protocol = require('../protocol');
const crypto = require('crypto'), hash = crypto.getHashes();
const dotenv = require('dotenv');
const Helper = require('./Helper.js');
dotenv.config();

const SERVER = process.env.server || "localhost";
const PORT = process.env.port || 8080;
const RECONECT_TIMEOUT = process.env.reconnect_timeout || 30000;
const KEEP_ALIVE = process.env.socket_keep_alive || 15000;
const printConnectionStats_Interval = process.env.printConnectionStats_Interval;
const Logger = Helper.Logger;
const execCute = Helper.execCute;

var ID = null;
var conn_establish_ = null;
const printConnectionStats = function () { return Helper.printConnectionStats(conn_establish_) }
//setInterval(printConnectionStats, printConnectionStats_Interval);

async function connect() {
	ID = await execCute("hostname -I | awk '{print $1}'").then((result, error) => {
		if (error) Logger(error)
		let host = result;
		return execCute("uname  -nmsr").then((result, error) => {
			if (error) Logger(error)
			let identity = host.concat(result)
			return ID = crypto.createHash('sha1').update(identity).digest('hex');
		})
	})
	const ws = new WebSocket("ws://" + SERVER + ":" + PORT);
	ws.on('error', function (e) {
		Logger(e.code + " " + e.address + " port:" + e.port);
	});
	ws.on('ping', heartbeat);
	ws.on('open', function open() {
		let ans = { "msg": `${Protocol.Connecting}`, "id": ID }
		ws.send(JSON.stringify(ans))
	});
	ws.on('close', function close() {
		Logger('Disconnected from server.');
		ws.terminate();
		setTimeout(() => {
			connect();
		}, RECONECT_TIMEOUT);
		conn_establish_ = null;
	});

	async function process_command(command) {
		switch (command) {
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
			case Protocol.GET_HDD:
				execCute(" df -h / |  gawk -d  '{ print $2}';df -h / |  gawk -d  '{ print $3}';df -h / |  gawk -d  '{ print $4}';df -h / |  gawk -d  '{ print $5}'").then((result, error) => { // WIP
					if (error) Logger(error)
					result = result.split('\n')
					let obj = { "Size":result[1],"Used":result[3],"Available":result[5],"UsedPercent":result[7]}					
					let z = { "msg": `${Protocol.ANS_HDD}`, "value": obj }
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
				Logger("Received not a known command: " + command)
				break;
		}
	}
	ws.on('message', async function incoming(data) {
		let ans = JSON.parse(data);
		//Logger(ans)
		switch (ans.msg) {
			case "execute":
				process_command(ans.command)
				break;
			case Protocol.Connected:
				conn_establish_ = new Date();
				Logger("Connection with server ["+SERVER+":"+PORT+"] established.")
				heartbeat();
				break;
			default:
				Logger(ans);
				break;
		}
	});
	function heartbeat() { // ping keep_alive		
		process.stdout.write("○")
		clearTimeout(ws.pingTimeout);
		ws.pingTimeout = setTimeout(() => {
			ws.terminate();
		}, KEEP_ALIVE);

	}


}

connect();