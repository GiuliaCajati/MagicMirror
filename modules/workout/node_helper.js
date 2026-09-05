const { execFile } = require("node:child_process");
const NodeHelper = require("node_helper");
const Log = require("logger");

function openInBrowser (url) {
	if (process.platform === "darwin") {
		return execFile("open", [url]);
	}

	if (process.platform === "win32") {
		return execFile("cmd", ["/c", "start", "", url]);
	}

	return execFile("xdg-open", [url]);
}

module.exports = NodeHelper.create({
	socketNotificationReceived (notification, url) {
		if (notification !== "OPEN_WORKOUT") return;

		openInBrowser(url).on("error", (error) => {
			Log.error(`Could not open workout URL: ${error.message}`);
		});
	}
});
