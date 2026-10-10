Module.register("workout", {
	overlay: null,
	escapeHandler: null,

	getDom () {
		const wrapper = document.createElement("div");
		wrapper.className = "workout";

		const button = document.createElement("button");
		button.className = "workout-button";
		button.type = "button";
		button.textContent = "💪 Start Workout";
		button.addEventListener("click", () => this.openOverlay());

		const hint = document.createElement("div");
		hint.className = "workout-hint dimmed";
		hint.textContent = 'Say "Start my workout"';

		wrapper.append(button, hint);
		return wrapper;
	},

	getStyles () {
		return ["workout.css"];
	},

	openOverlay () {
		if (this.overlay?.isConnected) return;

		const overlay = document.createElement("div");
		overlay.className = "workout-overlay";
		overlay.setAttribute("role", "dialog");
		overlay.setAttribute("aria-modal", "true");
		overlay.setAttribute("aria-label", "Workout video");

		const toolbar = document.createElement("div");
		toolbar.className = "workout-overlay-toolbar";

		const backButton = document.createElement("button");
		backButton.className = "workout-overlay-button";
		backButton.type = "button";
		backButton.textContent = "✕ Back to Mirror";
		backButton.addEventListener("click", () => this.closeOverlay());

		const fullScreenButton = document.createElement("button");
		fullScreenButton.className = "workout-overlay-button";
		fullScreenButton.type = "button";
		fullScreenButton.textContent = "Full Screen";

		const browserButton = document.createElement("button");
		browserButton.className = "workout-overlay-button";
		browserButton.type = "button";
		browserButton.textContent = "Open in Browser";
		browserButton.addEventListener("click", () => {
			this.closeOverlay();
			this.sendSocketNotification("OPEN_WORKOUT");
		});

		const actions = document.createElement("div");
		actions.className = "workout-overlay-actions";
		actions.append(fullScreenButton, browserButton);
		toolbar.append(backButton, actions);

		const player = document.createElement("div");
		player.className = "workout-overlay-player";

		const iframe = document.createElement("iframe");
		iframe.src = "https://www.youtube.com/embed/pNqrkGnkUWc?autoplay=1&controls=1";
		iframe.title = "Workout video";
		iframe.allow = "autoplay; encrypted-media; fullscreen; picture-in-picture";
		iframe.allowFullscreen = true;
		iframe.referrerPolicy = "strict-origin-when-cross-origin";
		player.appendChild(iframe);

		fullScreenButton.addEventListener("click", () => {
			if (iframe.requestFullscreen) {
				iframe.requestFullscreen().catch((error) => {
					Log.error(`Could not enter workout video fullscreen: ${error.message}`);
				});
			}
		});

		overlay.append(toolbar, player);
		document.body.appendChild(overlay);
		this.overlay = overlay;

		this.escapeHandler = (event) => {
			if (event.key === "Escape") this.closeOverlay();
		};
		window.addEventListener("keydown", this.escapeHandler);
		backButton.focus();
	},

	closeOverlay () {
		if (!this.overlay) return;

		if (document.fullscreenElement && this.overlay.contains(document.fullscreenElement)) {
			document.exitFullscreen().catch(() => {});
		}

		this.overlay.remove();
		this.overlay = null;
		window.removeEventListener("keydown", this.escapeHandler);
		this.escapeHandler = null;
	},

	notificationReceived (notification) {
		if (notification === "START_WORKOUT") {
			this.openOverlay();
		}
	}
});
