const { execFile, spawn } = require("node:child_process");
const os = require("node:os");
const path = require("node:path");
const NodeHelper = require("node_helper");
const Log = require("logger");

const WORKOUT_URL = "https://www.youtube.com/watch?v=pNqrkGnkUWc";

function launchChromium () {
	const env = { ...process.env };
	if (!env.XDG_RUNTIME_DIR) env.XDG_RUNTIME_DIR = `/run/user/${process.getuid()}`;
	if (!env.WAYLAND_DISPLAY) env.WAYLAND_DISPLAY = "wayland-0";

	const args = [
		"--ozone-platform=wayland",
		"--no-proxy-server",
		`--user-data-dir=${path.join(os.homedir(), ".config", "magicmirror-workout-browser")}`,
		"--new-window",
		WORKOUT_URL
	];

	const launch = (executable) => {
		const browser = spawn(executable, args, {
			env,
			detached: true,
			stdio: "ignore",
			shell: false
		});

		browser.once("error", (error) => {
			if (executable === "chromium" && error.code === "ENOENT") {
				Log.log("Chromium not found; trying chromium-browser");
				launch("chromium-browser");
				return;
			}

			Log.error(`Could not launch ${executable}: ${error.message}`);
		});

		browser.once("exit", (code, signal) => {
			if (code !== 0) {
				Log.error(`${executable} exited with ${signal ? `signal ${signal}` : `code ${code}`}`);
			}
		});

		browser.unref();
	};

	launch("chromium");
}

module.exports = NodeHelper.create({
	socketNotificationReceived (notification) {
		if (notification !== "OPEN_WORKOUT") return;

		if (process.platform === "linux") {
			launchChromium();
			return;
		}

		const command = process.platform === "darwin" ? "open" : "cmd";
		const args = process.platform === "win32" ? ["/c", "start", "", WORKOUT_URL] : [WORKOUT_URL];

		execFile(command, args, (error) => {
			if (error) {
				Log.error(`Could not open workout URL with ${command}: ${error.message}`);
			}
		});
	}
});
