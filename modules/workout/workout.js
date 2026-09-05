const WORKOUT_URL = "https://www.youtube.com/watch?v=YOUR_WORKOUT_VIDEO_ID";

Module.register("workout", {
	getDom () {
		return document.createElement("div");
	},

	notificationReceived (notification) {
		if (notification === "START_WORKOUT") {
			this.sendSocketNotification("OPEN_WORKOUT", WORKOUT_URL);
		}
	}
});
