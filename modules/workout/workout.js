Module.register("workout", {
	getDom () {
		const wrapper = document.createElement("div");
		wrapper.className = "workout";

		const button = document.createElement("button");
		button.className = "workout-button";
		button.type = "button";
		button.textContent = "💪 Start Workout";
		button.addEventListener("click", () => this.sendSocketNotification("OPEN_WORKOUT"));

		const hint = document.createElement("div");
		hint.className = "workout-hint dimmed";
		hint.textContent = 'Say "Start my workout"';

		wrapper.append(button, hint);
		return wrapper;
	},

	getStyles () {
		return ["workout.css"];
	},

	notificationReceived (notification) {
		if (notification === "START_WORKOUT") {
			this.sendSocketNotification("OPEN_WORKOUT");
		}
	}
});
