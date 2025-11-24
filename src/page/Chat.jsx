// ...existing code...
import { useEffect, useState, useRef } from "react";
import { FiSend } from 'react-icons/fi';
import {
  connect,
  joinConversation,
  sendMessage,
  onConversationHistory,
  onReceiveMessage,
  onError,
  offConversationHistory,
  offReceiveMessage,
  offError,
} from "../api/socket";
import { conversationService } from "../api/services/conversation.api";

const Chat = ({ selectedChat = null, onMessageSent }) => {
  const [me] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.id || 1;
    } catch {
      return 1;
    }
  });
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const prevChatIdRef = useRef(null);

  const containerRef = useRef(null);

  useEffect(() => {
    // Conectar socket una sola vez
    connect();

    // Configurar listeners
    const handleHistory = (hist) => {
      setMessages(hist || []);
    };

    const handleReceive = (msg) => {
      setMessages((prev) => {
        // evitar duplicados por ack + broadcast
        if (prev.some(p => p.id && msg.id && p.id === msg.id)) return prev;
        return [...prev, msg];
      });
    };

    const handleError = () => {
      // Error silencioso
    };

    onConversationHistory(handleHistory);
    onReceiveMessage(handleReceive);
    onError(handleError);

    return () => {
      // Solo limpiar listeners, NO desconectar el socket
      // El socket debe permanecer conectado para recibir mensajes de otros chats
      offConversationHistory(handleHistory);
      offReceiveMessage(handleReceive);
      offError(handleError);
    };
  }, []);

  // when selectedChat changes, load messages and join its conversation
  useEffect(() => {
    const currentChatId = selectedChat?.id;
    
    // Si el chat cambió, cargar mensajes
    if (currentChatId !== prevChatIdRef.current) {
      prevChatIdRef.current = currentChatId;
      
      if (!selectedChat) {
        // Usar setTimeout para evitar setState síncrono
        const timer = setTimeout(() => setMessages([]), 0);
        return () => clearTimeout(timer);
      }

      (async () => {
        try {
          // Cargar mensajes
          const response = await conversationService.getMessages(selectedChat.id);
          const msgs = response?.data ?? response;
          setMessages(Array.isArray(msgs) ? msgs : []);

          // Unirse a la room
          joinConversation(selectedChat.id, me);
        } catch {
          setMessages([]);
        }
      })();
    }
  }, [selectedChat, me]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  function handleSend() {
    if (!selectedChat) return alert("Primero crea/únete a la conversación");
    if (!text.trim()) return;

    const payload = {
      contenido: text.trim(),
      remitenteId: Number(me),
      conversacionId: Number(selectedChat.id),
    };

    // usar ack para recibir el mensaje guardado por el servidor
    sendMessage(payload, (resp) => {
      if (!resp) return;
      if (resp.success && resp.mensaje) {
        const saved = resp.mensaje;
        setMessages((prev) => {
          if (prev.some(p => p.id && saved.id && p.id === saved.id)) return prev;
          return [...prev, saved];
        });
        
        // Notificar al padre para actualizar el lastMessage en la lista de chats
        if (onMessageSent) {
          onMessageSent(selectedChat.id, {
            contenido: saved.contenido,
            creadoEn: saved.creadoEn,
            remitente: saved.remitente
          });
        }
      }
    });

    setText("");
  }

  // Get participants for group chat
  const participants = selectedChat?.participantes || [];
  const isGroupChat = selectedChat?.isGroup || selectedChat?.tipo === 'grupal';
  const participantUsers = participants
    .map(p => p.usuario || p)
    .filter(u => u && u.id !== me);
  
  const displayedParticipants = participantUsers.slice(0, 3);
  const remainingCount = participantUsers.length - 3;

  return (
    <div className="flex flex-col h-screen p-4 text-black">
      {/* Header */}
      <div className="mb-3 pb-3 border-b border-neutral-1">
        <div className="flex items-center justify-between">
          <h2 className="text-text-lg font-semibold m-0">
            {selectedChat?.titulo || selectedChat?.nombre || 'Selecciona un chat'}
          </h2>
          
          {/* Group participants - Right side */}
          {isGroupChat && participantUsers.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {displayedParticipants.map((user, idx) => (
                  <div
                    key={user.id || idx}
                    className="w-7 h-7 rounded-full bg-primary text-light flex items-center justify-center text-text-xs font-semibold border-2 border-light ring-1 ring-neutral-1"
                    title={user.nombre || `Usuario ${user.id}`}
                  >
                    {(user.nombre || 'U').charAt(0).toUpperCase()}
                  </div>
                ))}
                {remainingCount > 0 && (
                  <div className="w-7 h-7 rounded-full bg-neutral-1 text-neutral-2 flex items-center justify-center text-text-xs font-semibold border-2 border-light">
                    +{remainingCount}
                  </div>
                )}
              </div>
              <span className="text-text-sm text-neutral-2 font-medium">
                {participantUsers.length} Miembros
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Messages panel */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto mb-3 px-2 py-3"
      >
        {messages.length === 0 ? (
          <div className="text-center text-neutral-2 text-text-sm mt-10">Sin mensajes</div>
        ) : (
          <div className="space-y-3">
            {messages.map((m, idx) => {
              const isMe = m.remitenteId === me;
              return (
                <div key={m.id ?? `msg-${idx}`} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-[75%]">
                    {!isMe && (
                      <div className="text-text-sm font-semibold mb-1 pl-2">
                        {m.remitente?.nombre || `User ${m.remitenteId}`}
                      </div>
                    )}
                    <div
                      className={`px-3.5 py-2 text-text-sm ${
                        isMe 
                          ? 'bg-primary text-light rounded-[10px]' 
                          : 'bg-light text-black border border-neutral-1 rounded-[10px]'
                      }`}
                    >
                      {m.contenido}
                    </div>
                    <div className={`text-[11px] text-neutral-2 mt-0.5 ${isMe ? 'text-right' : 'text-left pl-2'}`}>
                      {m.creadoEn ? new Date(m.creadoEn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      
      <div className="mt-2 pt-3 border-t border-neutral-1">
        <div className="flex items-center gap-2">
          <input
            className="flex-1 px-4 py-2.5 border border-neutral-1 rounded-input text-text-sm bg-light focus:outline-none focus:border-primary"
            placeholder="Escribe un mensaje..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            className="w-10 h-10 bg-primary text-light rounded-chip flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
            aria-label="Enviar mensaje"
          >
            <FiSend size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
// ...existing code...