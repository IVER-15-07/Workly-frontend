import { useEffect, useState } from "react";
import {  socket,
  connect,
  disconnect,
  joinConversation,
  sendMessage,
  onConversationHistory,
  onReceiveMessage,
  onError,
} from "../api/socket";
import { conversationService } from "../api/services/conversation.api";

const Chat = () => {
    const [me, setMe] = useState(1);
  const [other, setOther] = useState(2);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    // listeners
    onConversationHistory((hist) => setMessages(hist || []));
    onReceiveMessage((msg) => setMessages((m) => [...m, msg]));
    onError((e) => console.error("WS error:", e));

    return () => {
      disconnect();
      socket.off("conversationHistory");
      socket.off("receiveMessage");
      socket.off("errorMessage");
    };
  }, []);

  async function handleGetOrCreateConversation() {
    try {
      // 1. Crear u obtener la conversación
      const conv = await conversationService.createOrGetConversation({
        userAId: me,
        userBId: other,
        titulo: "Chat prueba",
      });

      setConversation(conv);

      // 2. Cargar mensajes históricos
      const msgs = await conversationService.getMessages(conv.id);
      setMessages(msgs || []);

      // 3. Reconectar socket limpio y unirse a la room
      disconnect();
      connect();
      joinConversation(conv.id, me);
    } catch (err) {
      console.error(err);
      alert("Error al crear/obtener conversación");
    }
  }

  function handleSend() {
    if (!conversation) return alert("Primero crea/únete a la conversación");
    if (!text.trim()) return;

    const payload = {
      contenido: text.trim(),
      remitenteId: Number(me),
      conversacionId: Number(conversation.id),
    };

    sendMessage(payload);
    setText("");
  }
  return (
     <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Workly - Chat demo</h1>

      <div className="mb-4 flex gap-2">
        <label>
          Yo:
          <select value={me} onChange={(e) => setMe(Number(e.target.value))} className="ml-2">
            <option value={1}>Alice (1)</option>
            <option value={2}>Bob (2)</option>
          </select>
        </label>

        <label>
          Otro:
          <select value={other} onChange={(e) => setOther(Number(e.target.value))} className="ml-2">
            <option value={1}>Alice (1)</option>
            <option value={2}>Bob (2)</option>
          </select>
        </label>

        <button
          onClick={handleGetOrCreateConversation}
          className="ml-4 px-3 py-1 bg-blue-600 text-white rounded"
        >
          Crear/Unir conversación
        </button>
      </div>

      <div className="mb-4">
        <strong>Conversación:</strong>{" "}
        {conversation ? conversation.id : "No unida"}
      </div>

      <div className="border p-3 h-64 overflow-auto mb-3 bg-white">
        {messages.length === 0 ? (
          <div className="text-gray-500">Sin mensajes</div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id || Math.random()}
              className={`mb-2 ${m.remitenteId === me ? "text-right" : "text-left"}`}
            >
              <div className="text-sm text-gray-600">User {m.remitenteId}</div>
              <div className="inline-block rounded px-3 py-1 bg-gray-100">{m.contenido}</div>
              <div className="text-xs text-gray-400">
                {new Date(m.creadoEn || Date.now()).toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border px-2 py-1"
          placeholder="Escribe un mensaje..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} className="px-3 py-1 bg-green-600 text-white rounded">
          Enviar
        </button>
      </div>
    </div>
  )
}

export default Chat