const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const { send } = require("process");

const io = new Server(server, {
	cors: {
		origin: "*",
	},
});

const arduinoAdressPort = "/dev/tty.usbmodem11201";

async function main() {
	await checkSerialPortList();
	const port = new SerialPort({
		path: arduinoAdressPort,
		baudRate: 115200,
	});

	const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));
	init();

	function init() {
		app.get("/", (req, res) => {
			res.sendStatus(200);
		});

		server.listen(3000, () => {
			console.log("listening on *:4001");
		});

		port.on("open", () => {
			console.log("PORT OPEN");
			setupSocketListeners();

			parseSerialPortMessages();
		});
	}

	async function checkSerialPortList() {
		let list = await SerialPort.list();
		console.log("list of connected devices", list);
	}

	function setupSocketListeners() {
		console.log("setupSocketListeners");
		io.on("connection", (socket) => {
			socket.on("reset", (e) => {
				console.log(e);
			});

			socket.on("setNewTarget", (e) => {
				console.log(e);
				sendMessageToSerialPort("setNewTarget", e.value);
			});
		});
	}

	// Send message to serial port

	function sendMessageToSerialPort(command, value) {
		let id = 1;
		let message = command + ":" + id + ":" + value + "\n";
		console.log(message);

		port.write(message, function (err) {
			if (err) {
				return console.log("Error on write: ", err.message);
			}
		});
	}

	// recevoir des message du serial port

	function parseSerialPortMessages() {
		console.log("parseSerialPortMessages");
		if (!parser) {
			console.error("Parser is not defined or initialized.");
			return;
		}

		parser.on("data", (data) => {
			if (!data) {
				console.error("No data received.");
				return;
			}
			console.log("parse from serial port : " + data);
			let datas = data.trim().split(":");
			let command = datas[0];
			// switch (command) {
			// 	case "joystick":
			// 		io.emit(command, { id: datas[1], value: datas[2] });
			// 		break;
			// 	case "pushButton":
			// 		io.emit(command, { id: datas[1], value: datas[2] });
			// 		break;
			// }
		});
	}
}

main();
