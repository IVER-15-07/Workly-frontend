import { useEffect, useState, useRef } from "react";
import { FiSend } from 'react-icons/fi';
import { IconButton } from '../components/button/IconButton';
import { Button } from '../components/button/Button';
import { useTheme } from 'styled-components';
import {
  socket,
  connect,
  disconnect,
  joinConversation,
  sendMessage,
  onConversationHistory,
  onReceiveMessage,
  onError,
} from "../api/socket";
import { conversationService } from "../api/services/conversation.api";

const Chat = ({ selectedChat = null }) => {
  const theme = useTheme?.() || {};

  const [me, setMe] = useState(1);
  const [other, setOther] = useState(2);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const containerRef = useRef(null);

  // helper para generar ids locales
  const createId = () => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
    return String(Date.now()) + "-" + Math.random().toString(36).slice(2);
  };

  useEffect(() => {
    onConversationHistory((hist) => setMessages(hist || []));
    onReceiveMessage((msg) => setMessages((prev) => [...prev, msg]));
    onError((e) => console.error("WS error:", e));

    return () => {
      disconnect();
      if (socket && socket.off) {
        socket.off("conversationHistory");
        socket.off("receiveMessage");
        socket.off("errorMessage");
      }
    };
  }, []);

  // when selectedChat changes, load messages and join its conversation
  useEffect(() => {
    if (!selectedChat) return;
    setConversation(selectedChat);

    (async () => {
      try {
        const msgsResp = await conversationService.getMessages(selectedChat.id);
        const msgs = msgsResp?.data ?? msgsResp;
        if (Array.isArray(msgs)) setMessages(msgs);
      } catch (err) {
        console.debug('getMessages failed for selectedChat', err);
      }

      try { disconnect(); } catch { /* ignore */ }
      connect();
      joinConversation(selectedChat.id, me);
    })();
  }, [selectedChat, me]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleGetOrCreateConversation() {
    try {
      const resp = await conversationService.createOrGetConversation({ userAId: me, userBId: other, titulo: '# Proyectos' });
      const conv = resp?.data ?? resp;
      setConversation(conv);

      // try REST messages first (fallback), normalize response
      try {
        const msgsResp = await conversationService.getMessages(conv.id);
        const msgs = msgsResp?.data ?? msgsResp;
        if (Array.isArray(msgs)) setMessages(msgs);
      } catch (err) {
        // ignore - server may emit historial via socket
        console.debug('getMessages fallback failed', err);
      }

      // reconnect socket cleanly and join
      try { disconnect(); } catch { /* ignore */ }
      connect();
      joinConversation(conv.id, me);
    } catch (err) {
      console.error('Error creating/getting conversation', err);
      alert('No se pudo crear/obtener la conversación');
    }
  }

  function handleSend() {
    if (!conversation) return alert("Primero crea/únete a la conversación (botón Crear/Unir conversación)");
    if (!text.trim()) return;

    const payload = {
      contenido: text.trim(),
      remitenteId: Number(me),
      conversacionId: conversation.id,
    };

    // optimistic update
    const localMsg = { id: createId(), ...payload, creadoEn: Date.now() };
    setMessages((prev) => [...prev, localMsg]);
    setText("");

    try {
      sendMessage(payload);
    } catch (err) {
      console.error('sendMessage error', err);
    }
  }

  // derive theme values
  const fontFamily = theme.typography?.fontFamily || "sans-serif";
  const cardBg = theme.colors?.card || '#F6FAFD';
  const primary = theme.colors?.primary || '#547792';
  const light = theme.colors?.light || '#FFFFFF';
  const neutral1 = theme.colors?.neutral1 || '#E2E2E2';
  const neutral2 = theme.colors?.neutral2 || '#807979';
  const radius = theme.shapes?.cardRadius || '25px';

  return (
    <div className="flex flex-col h-screen p-6" style={{ fontFamily, color: '#0b0b0b' }}>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between" style={{ padding: '0 8px' }}>
        <div>
          <div style={{ fontSize: theme.typography?.display?.medium?.fontSize, fontWeight: theme.typography?.display?.medium?.fontWeight }}>{conversation?.titulo || conversation?.nombre || '# Chat'}</div>
          <div className="text-sm" style={{ color: neutral2 }}>{messages.length} mensajes</div>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm" style={{ color: neutral2 }}>
            Yo:
            <select
              value={me}
              onChange={(e) => setMe(Number(e.target.value))}
              className="ml-2 px-3 py-2 rounded-input"
              style={{ fontFamily, border: `1px solid ${neutral1}`, background: cardBg }}
            >
              <option value={1}>Alice (1)</option>
              <option value={2}>Bob (2)</option>
            </select>
          </label>

          <label className="text-sm" style={{ color: neutral2 }}>
            Otro:
            <select
              value={other}
              onChange={(e) => setOther(Number(e.target.value))}
              className="ml-2 px-3 py-2 rounded-input"
              style={{ fontFamily, border: `1px solid ${neutral1}`, background: cardBg }}
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
            Crear/Unir
          </Button>
        </div>
      </div>

      {/* Messages panel */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto mb-3 p-6"
        style={{ backgroundColor: cardBg, borderRadius: radius, border: `1px solid ${neutral1}` }}
      >
        {messages.length === 0 ? (
          <div style={{ color: neutral2, fontSize: theme.typography?.text?.medium?.fontSize }}>Sin mensajes</div>
        ) : (
          <div className="space-y-6">
            {messages.map((m, idx) => {
              const isMe = m.remitenteId === me;
              return (
                <div key={m.id ?? `msg-${idx}`} className={`flex items-end ${isMe ? 'justify-end' : 'justify-start'}`}>
                  {!isMe && (
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: neutral1, color: '#0b0b0b', fontWeight: 600 }}>
                        {String(m.remitenteId)}
                      </div>
                    </div>
                  )}

                  <div className={`max-w-[70%] ${isMe ? 'text-right' : 'text-left'}`}>
                    <div className="flex items-baseline justify-between mb-1">
                      <div style={{ fontSize: theme.typography?.text?.small?.fontSize, fontWeight: 600 }}>{isMe ? 'Tú' : `User ${m.remitenteId}`}</div>
                      <div style={{ fontSize: theme.typography?.text?.small?.fontSize, color: neutral2, marginLeft: 8 }}>{m.creadoEn ? new Date(m.creadoEn).toLocaleTimeString() : ''}</div>
                    </div>
                    <div
                      style={{
                        background: isMe ? primary : light,
                        color: isMe ? light : '#0b0b0b',
                        display: 'inline-block',
                        borderRadius: theme.shapes?.inputMedium || '12px',
                        padding: '10px 16px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                        border: `1px solid ${neutral1}`,
                      }}
                    >
                      {m.contenido}
                    </div>
                  </div>

                  {isMe && (
                    <div className="flex-shrink-0 ml-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: primary, color: light, fontWeight: 700 }}>
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

      {/* Input */}
      <div className="mt-2 p-4" style={{ background: cardBg, borderRadius: radius, border: `1px solid ${neutral1}` }}>
        <div className="flex items-center gap-3">
          <input
            className="flex-1"
            style={{
              border: `1px solid ${neutral1}`,
              borderRadius: theme.shapes?.inputMedium || '12px',
              padding: '10px 12px',
              fontSize: theme.typography?.text?.medium?.fontSize,
              fontFamily,
              background: theme.colors?.light,
            }}
            placeholder={conversation ? `Escribe un mensaje en ${conversation.titulo || '#Conver'}` : 'Escribe un mensaje...'}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <IconButton variant="primary" icon={<FiSend />} onClick={handleSend} aria-label="Enviar mensaje" />
        </div>
      </div>
    </div>
  );
}

export default Chat;