import { useEffect, useState, useRef } from "react";
import { FiSend } from 'react-icons/fi';
import { IconButton } from '../components/button/IconButton';
import { Button } from '../components/button/Button';

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
        <label className="text-text-base text-black font-semibold">
          Yo:
          <select
            value={me}
            onChange={(e) => setMe(Number(e.target.value))}
            className="ml-2 px-3 py-2 rounded-input text-text-base text-black bg-card focus:outline-none focus:border-primary"
          >
            <option value={1}>Alice (1)</option>
            <option value={2}>Bob (2)</option>
          </select>
        </label>

        <label className="text-text-base text-black font-semibold">
          Otro:
          <select
            value={other}
            onChange={(e) => setOther(Number(e.target.value))}
            className="ml-2 px-3 py-2  rounded-input text-text-base text-black bg-card focus:outline-none focus:border-primary"
          >
            <option value={1}>Alice (1)</option>
            <option value={2}>Bob (2)</option>
          </select>
        </label>

        <Button
          variant="primary"
          size="medium"
          onClick={handleGetOrCreateConversation}
          className="ml-4"
        >
          Crear/Unir conversación
        </Button>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-auto mb-3 p-4 rounded-card  border-neutral-1" style={{ backgroundColor: 'rgba(255,255,255,0.35)' }}
      >
        {messages.length === 0 ? (
          <div className="text-neutral-2 text-text-base">Sin mensajes</div>
        ) : (
          <div className="space-y-4">
            {messages.map((m) => {
              const isMe = m.remitenteId === me;
              return (
                <div
                  key={m.id}
                  className={`flex items-end ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  {!isMe && (
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-10 h-10 rounded-full bg-neutral-1 flex items-center justify-center text-text-sm text-black font-semibold">
                        {String(m.remitenteId)}
                      </div>
                    </div>
                  )}

                  <div className={`max-w-[70%] ${isMe ? 'text-right' : 'text-left'}`}>
                    <div className="flex items-baseline justify-between mb-1">
                      <div className="text-text-sm text-black font-semibold">
                        {isMe ? 'Tú' : `User ${m.remitenteId}`}
                      </div>
                      <div className="text-text-sm text-neutral-2 ml-2">
                        {new Date(m.creadoEn).toLocaleTimeString()}
                      </div>
                    </div>
                    <div
                      className={`${
                        isMe
                          ? 'bg-primary text-light ml-auto'
                          : 'bg-light'
                      } inline-block rounded-input px-4 py-2 shadow border-2 border-neutral-1`}
                    >
                      {m.contenido}
                    </div>
                  </div>

                  {isMe && (
                    <div className="flex-shrink-0 ml-3">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-text-sm text-light font-bold">
                        ME
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-2 bg-card p-3 rounded-card   flex items-center gap-3" style={{ backgroundColor: 'rgba(255,255,255,0.35)' }}>
        <input
          className="flex-1 border-2 border-neutral-1 rounded-input px-3 py-2 text-text-base text-black bg-light placeholder-neutral-2 focus:outline-none focus:border-primary"
          placeholder={
            conversation
              ? `Escribe un mensaje en ${conversation.titulo || '#Conver'}`
              : 'Escribe un mensaje...'
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <IconButton
          variant="primary"
          icon={<FiSend />}
          onClick={handleSend}
          aria-label="Enviar mensaje"
        />
      </div>
    </div>
  );
}

export default Chat