import { useMemo, useState } from 'react';
import { useTheme } from 'styled-components';
import GroupSection from './utils/GroupSection';
import DirectSection from './utils/DirectSection';
import useDirects from '../hooks/useDirects';
import { conversationService } from '../api/services/conversation.api';

const Sidebar = ({ chats = [], selectedChatId = null, onSelect = () => { }}) => {
  const [query] = useState('');
  const { directs: directUsers, reload } = useDirects();

  const handleDirectSelect = async (user) => {
    try {
      const current = JSON.parse(localStorage.getItem('user')) || {};
      const currentUserId = current.id;
      if (!currentUserId) {
        console.error('Usuario actual no encontrado en localStorage');
        return;
      }

      // 1. Crear u obtener la conversación
      const res = await conversationService.createOrGetConversation({
        userAId: currentUserId,
        userBId: user.id,
        titulo: user.nombre
      });
      const conv = res?.data ?? res;
      
      // 2. Cargar mensajes históricos si existe la conversación
      let messages = [];
      if (conv?.id) {
        try {
          const msgsResponse = await conversationService.getMessages(conv.id);
          const msgs = msgsResponse?.data ?? msgsResponse;
          messages = Array.isArray(msgs) ? msgs : [];
        } catch (err) {
          console.warn('No se pudieron cargar mensajes:', err);
        }
      }
      
      // 3. Preparar chat con mensajes para enviar al componente Chat
      const directChat = { 
        ...conv, 
        isGroup: false,
        messages: messages,
        lastMessage: messages.length > 0 ? messages[messages.length - 1] : null
      };
      
      onSelect?.(directChat);
      reload();
    } catch (err) {
      console.error('Error abriendo conversación directa:', err);
      alert('No se pudo abrir la conversación. Intenta de nuevo.');
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return chats;
    return chats.filter((c) => {
      const title = (c.titulo || c.nombre || '').toString().toLowerCase();
      const last = (c.lastMessage?.contenido || '').toString().toLowerCase();
      return title.includes(q) || last.includes(q);
    });
  }, [chats, query]);

  const groups = filtered.filter((c) => c.isGroup);

  const theme = useTheme() || {};
  const headerFont = theme.typography?.display?.medium || { fontSize: '48px', fontWeight: 700, lineHeight: '56px' };

  return (
    <aside className="w-full h-full flex flex-col bg-transparent p-2">
      <div
        className="p-4 rounded-xl w-full h-full flex flex-col overflow-hidden"
        style={{
          backgroundColor: 'rgba(255,255,255,0.86)',
          backdropFilter: 'blur(6px)'
        }}
      >
        {/* Top title */}
        <div className="px-2 pt-2 pb-3">
          <div className="text-center text-neutral-2" style={{ fontFamily: theme.typography?.fontFamily, fontSize: headerFont.fontSize, fontWeight: headerFont.fontWeight, lineHeight: headerFont.lineHeight, color: theme.colors?.neutral2 }}>
            WORKLY
          </div>
          <div className="mt-3" style={{ borderTop: `1px solid ${theme.colors?.neutral1 || '#E2E2E2'}` }} />
        </div>

        {/* Sections: split vertically into Groups and Directs, each scrollable */}
        <div className="mt-4 flex-1 flex flex-col overflow-hidden">
          <div className="overflow-y-auto" style={{ maxHeight: '50%' }}>
            <GroupSection groups={groups} onSelect={onSelect} selectedChatId={selectedChatId} />
          </div>

          <div className="mt-2 border-t" style={{ borderColor: theme.colors?.neutral1 }} />

          <div className="flex-1 overflow-y-auto mt-2">
            <DirectSection directs={directUsers} onSelect={handleDirectSelect} selectedChatId={selectedChatId} />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
