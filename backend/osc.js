const osc = require("osc");

const pathDevice = "/dev/tty.usbmodem1101";

const main = () => {
	const serialPort = new osc.SerialPort({
		devicePath: pathDevice,
		metadata: true,
		bitrate: 115200,
	});

	const init = () => {
		serialPort.open();
		serialPort.on("ready", initListeners);
	};

	const initListeners = () => {
		console.log("initListeners");
		serialPort.on("message", function (oscMsg) {
			console.log(oscMsg.address, oscMsg.args[0].value);
			// console.log("An OSC message was received!", oscMsg);
		});
		serialPort.on("error", (err) => {
			console.log(err);
			console.log("Serial port error: ", err.message);
		});

		serialPort.on("close", () => {
			console.log("Serial port closed");
		});

		setInterval(() => {
			sendMessage();
		}, 1000);
	};

	const sendMessage = () => {
		const message = {
			address: "/servo",
			args: [
				{
					type: "i",
					value: 1234,
				},
			],
		};

		serialPort.send(message, (err) => {
			if (err) {
				return console.log("Error on write: ", err.message);
			}
			console.log("Message sent");
		});
	};
	init();
};

main();
// Listen for the message event and map the OSC message to the synth.

// Create an OSC message
