
import { io } from "socket.io-client";

const URL = import.meta.env.VITE_API_WS || "http://localhost:3000";
export const socket = io(URL, {
  autoConnect: false,
  transports: ["websocket"],
});

// Conectar / desconectar
export function connect() {
  if (!socket.connected) socket.connect();
}
export function disconnect() {
  if (socket.connected) socket.disconnect();
}

// Emisiones (client -> server)

export function joinConversation(conversacionId, userId) {
  if (!socket.connected) connect();
  socket.emit("joinConversacion", { conversacionId, userId });
}
export function leaveConversation(conversacionId) {
  if (!socket.connected) return;
  socket.emit("salirConversacion", { conversacionId });
}
export function sendMessage(payload, ack) {
  if (!socket.connected) connect();
  socket.emit("enviarMensaje", payload, ack);
}

// Registro de listeners (server -> client)

export function onConversationHistory(cb) {
  socket.on("historialConversacion", cb);
}
export function onReceiveMessage(cb) {
  socket.on("recibirMensaje", cb);
}
export function onError(cb) {
  socket.on("errorMensaje", cb);
  socket.on("errorMessage", cb); // por si el servidor usa ambos
}

// Off helpers para limpiar listeners
export function offConversationHistory(cb) {
  socket.off("historialConversacion", cb);
}
export function offReceiveMessage(cb) {
  socket.off("recibirMensaje", cb);
}
export function offError(cb) {
  socket.off("errorMensaje", cb);
  socket.off("errorMessage", cb);
}
