// ...existing code...
import { io } from "socket.io-client";

const URL = "http://localhost:3000"; // quitar espacio inicial
export const socket = io(URL, {
  autoConnect: false,
  transports: ["websocket"],
});

// helpers
export function connect() {
  if (!socket.connected) socket.connect();
}

export function disconnect() {
  if (socket.connected) socket.disconnect();
}

export function joinConversation(conversacionId, userId) {
  if (!socket.connected) socket.connect();
  socket.emit("joinConversation", { conversacionId, userId });
}

export function sendMessage(payload) {
  socket.emit("sendMessage", payload);
}

export function onConversationHistory(cb) {
  socket.on("conversationHistory", cb);
}

export function onReceiveMessage(cb) {
  socket.on("receiveMessage", cb);
}

export function onError(cb) {
  socket.on("errorMessage", cb);
}
// ...existing code...