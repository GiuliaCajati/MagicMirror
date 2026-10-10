const WORKOUT_URL = "https://www.youtube.com/watch?v=pNqrkGnkUWc";

Module.register("workout", {
	getDom () {
		const hint = document.createElement("div");
		hint.className = "workout-hint dimmed";
		hint.textContent = 'Say "Start my workout"';
		return hint;
	},

	notificationReceived (notification) {
		if (notification === "START_WORKOUT") {
			this.sendSocketNotification("OPEN_WORKOUT", WORKOUT_URL);
		}
	}
});
