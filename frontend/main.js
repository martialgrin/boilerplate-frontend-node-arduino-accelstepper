import { api } from "./lib/api";
import "./style.css";

function main() {
	const socket = api();
	let target = 0;
	const labelSliderOne = document.querySelector("#input-one > #label");
	console.log(labelSliderOne);
	function init() {
		initListeners();
	}

	setInterval(() => {
		target = target + 1000;
		sendMessageToServer("setNewTarget", target);
	}, 2000);
	function initListeners() {
		const sliderInterval = document.getElementById("slider-interval");
		labelSliderOne.addEventListener("keypress", (ev) => {
			if (ev.key === "Enter") {
				const val = ev.target.value;
				sliderInterval.value = val;
				console.log(ev.target.value);
				sliderIntervalHandler({ target: { value: ev.target.value } });
			}
		});
		sliderInterval.addEventListener("change", sliderIntervalHandler);
	}
	function resetHandler(e) {
		socket.sendMessageToServer({ command: "reset", value: true });
	}

	function sendMessageToServer(command, value) {
		socket.sendMessageToServer({ command: command, value: value });
	}

	function sliderIntervalHandler(e) {
		const value = Math.floor(e.target.value);
		labelSliderOne.value = value;
		sendMessageToServer("setNewTarget", value);
	}

	sliderIntervalHandler({ target: { value: 0 } });

	init();
}

window.onload = () => {
	main();
};
