Module.register("pi-temperature", {
	temperature: null,

	start () {
		this.sendSocketNotification("GET_PI_TEMPERATURE");
	},

	getStyles () {
		return ["pi-temperature.css"];
	},

	socketNotificationReceived (notification, temperature) {
		if (notification !== "PI_TEMPERATURE") return;

		this.temperature = temperature;
		this.updateDom();
	},

	getDom () {
		const wrapper = document.createElement("div");
		wrapper.className = "pi-temperature normal medium";

		if (this.temperature === null) {
			wrapper.textContent = "Pi CPU: reading…";
			return wrapper;
		}

		if (this.temperature === "unavailable") {
			wrapper.textContent = "Pi CPU: unavailable";
			return wrapper;
		}

		let emoji;
		let message;
		if (this.temperature < 50) {
			emoji = "🧊";
			message = "Chillin’ like a Pi";
		} else if (this.temperature < 65) {
			emoji = "😎";
			message = "Just warming up";
		} else if (this.temperature < 75) {
			emoji = "🥵";
			message = "Who turned up the heat?";
		} else {
			emoji = "🔥";
			message = "I said MagicMirror, not air fryer!";
		}

		wrapper.textContent = `${emoji} ${this.temperature.toFixed(1)}°C · ${message}`;
		return wrapper;
	}
});
