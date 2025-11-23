import { io } from "socket.io-client";

const URL = import.meta.env.VITE_API_WS || "http://localhost:3000";
export const socket = io(URL, {
  autoConnect: false,
  transports: ["websocket"],
});

// ...existing code...
export function onConversationHistory(cb) {
  socket.on("historialConversacion", cb);
}
export function onReceiveMessage(cb) {
  socket.on("recibirMensaje", cb);
}
export function onError(cb) {
  socket.on("errorMensaje", cb);
  socket.on("errorMessage", cb);
}

// Nuevos eventos / helpers para estados y participantes
export function onEstadoMensaje(cb) {
  socket.on("estadoMensaje", cb);
}
export function onParticipanteUnido(cb) {
  socket.on("participanteUnido", cb);
}
export function onParticipanteActivo(cb) {
  socket.on("participanteActivo", cb);
}

// Off helpers para limpiar listeners (incluidos nuevos)
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
export function offEstadoMensaje(cb) {
  socket.off("estadoMensaje", cb);
}
export function offParticipanteUnido(cb) {
  socket.off("participanteUnido", cb);
}
export function offParticipanteActivo(cb) {
  socket.off("participanteActivo", cb);
}
// ...existing code...