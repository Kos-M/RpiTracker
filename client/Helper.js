const exec = require('child_process').exec;
const moment = require('moment');

class Helper {

	static async Logger(msg) {
		let now = new Date();
		if (typeof msg == "object") {
			console.dir(JSON.stringify(msg))
		} else {
			console.log('[ ' + now.toLocaleTimeString() + " ] " + msg)
		}
	}

	static execCute(command) {
		return new Promise(function (resolve, reject) {
			try {
				exec(command, function (error, stdout, stderr) {
					if (stderr) reject(stderr)
					if (error) reject(error)
					resolve(stdout)
				})
			} catch (e) {
				reject(e)
			}
		})
	}

	static printConnectionStats(n) {
		Helper.Logger("Maintain connection since:" + moment(n).fromNow())
	}


}

module.exports = exports = Helper;