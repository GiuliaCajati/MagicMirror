const { execFile } = require("node:child_process");
const NodeHelper = require("node_helper");

const UPDATE_INTERVAL = 10 * 1000;

module.exports = NodeHelper.create({
	updateTimer: null,
	readInProgress: false,

	start () {
		this.readTemperature();
		this.updateTimer = setInterval(() => this.readTemperature(), UPDATE_INTERVAL);
	},

	socketNotificationReceived (notification) {
		if (notification === "GET_PI_TEMPERATURE") {
			this.readTemperature();
		}
	},

	readTemperature () {
		if (this.readInProgress) return;
		this.readInProgress = true;

		execFile("vcgencmd", ["measure_temp"], (error, stdout) => {
			this.readInProgress = false;

			const match = !error && stdout.match(/temp=(-?\d+(?:\.\d+)?)['’]?C/);
			const temperature = match ? Number(match[1]) : "unavailable";
			this.sendSocketNotification("PI_TEMPERATURE", temperature);
		});
	}
});
