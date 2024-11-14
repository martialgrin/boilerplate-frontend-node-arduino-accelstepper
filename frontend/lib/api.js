import { io } from "socket.io-client";

export const api = () => {
	const socket = io("http://localhost:3000");
	socket.on("connect", () => {
		console.log(socket); // x8WIv7-mJelg7on_ALbx
	});

	function sendMessageToServer({ command, value }) {
		console.log(socket);
		socket.emit(command, {
			value,
		});
	}

	return {
		sendMessageToServer,
	};
};
