import { useEffect, useState, useRef } from "react";
import IconButton from "../components/button/IconButton.jsx";
import TextButton from "../components/button/TextButton.jsx";
import TextIconButton from "../components/button/TextIconButton.jsx";
import { FiSend } from "react-icons/fi";

const Chat = () => {
  const [me, setMe] = useState(1);
  const [other, setOther] = useState(2);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  // helper para generar ids locales
  const createId = () => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
    return String(Date.now()) + "-" + Math.random().toString(36).slice(2);
  };

  // Simula crear o unirse a una conversación en el frontend
  function handleGetOrCreateConversation() {
    const conv = {
      id: `local-${createId()}`,
      titulo: "# Proyectos",
      members: [me, other],
    };
    setConversation(conv);
    // Opcional: cargar mensajes de ejemplo
    setMessages([
      { id: createId(), remitenteId: other, contenido: "Hola! Este es un chat simulado.", creadoEn: Date.now() - 1000 * 60 * 10 },
      { id: createId(), remitenteId: me, contenido: "Perfecto, funciona localmente.", creadoEn: Date.now() - 1000 * 60 * 5 },
    ]);
  }

  function handleSend() {
    if (!conversation) return alert("Primero crea/únete a la conversación (botón Crear/Unir conversación)");
    if (!text.trim()) return;

    const msg = {
      id: createId(),
      remitenteId: Number(me),
      contenido: text.trim(),
      creadoEn: Date.now(),
    };
    setMessages((prev) => [...prev, msg]);
    setText("");
  }
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen p-4 max-w-4xl mx-auto">
      <div className="mb-4 flex gap-2 items-center">
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

      <div ref={containerRef} className="flex-1 overflow-auto mb-3 p-4 rounded shadow" style={{ backgroundColor: 'rgba(255,255,255,0.35)' }}>
        {messages.length === 0 ? (
          <div className="text-gray-500">Sin mensajes</div>
        ) : (
          <div className="space-y-4">
            {messages.map((m) => {
              const isMe = m.remitenteId === me;
              return (
                <div key={m.id} className={`flex items-end ${isMe ? 'justify-end' : 'justify-start'}`}>
                  {!isMe && (
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm text-white">{String(m.remitenteId)}</div>
                    </div>
                  )}

                  <div className={`max-w-[70%] ${isMe ? 'text-right' : 'text-left'}`}>
                    <div className="flex items-baseline justify-between mb-1">
                      <div className="text-sm text-gray-600">{isMe ? 'Tú' : `User ${m.remitenteId}`}</div>
                      <div className="text-xs text-gray-400 ml-2">{new Date(m.creadoEn).toLocaleTimeString()}</div>
                    </div>
                    <div className={`${isMe ? 'bg-green-100 ml-auto' : 'bg-white'} inline-block rounded px-4 py-2 shadow`}>{m.contenido}</div>
                  </div>

                  {isMe && (
                    <div className="flex-shrink-0 ml-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm text-white">ME</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-2 bg-white p-3 rounded shadow flex items-center gap-3"style={{ backgroundColor: 'rgba(255,255,255,0.35)' }}>
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder={conversation ? `Escribe un mensaje en ${conversation.titulo || '#Conver'}` : 'Escribe un mensaje...'}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <IconButton onClick={handleSend} icon={<FiSend />} aria-label="Enviar mensaje" />
      </div>
    </div>
  );
}

export default Chat