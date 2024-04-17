const { io } = require("socket.io-client");

const socket = io("http://localhost:3000");

socket.on("connect", () => {
    console.log(socket.id);
});

socket.on("initialData", (data) => { console.log("Initial Data:", data) });

socket.on("updateData", (data) => { console.log("Updated Data:", data) });