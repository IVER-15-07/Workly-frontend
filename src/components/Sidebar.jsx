import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import GroupSection from './utils/GroupSection';
import DirectSection from './utils/DirectSection';
import useDirects from '../hooks/useDirects';
import { conversationService } from '../api/services/conversation.api';

const Sidebar = ({ chats = [], selectedChatId = null, onSelect = () => { }, currentUser = null }) => {
  const navigate = useNavigate();
  const [query] = useState('');
  const { directs: directUsers } = useDirects();
  
  // Filtrar usuarios directos para excluir al usuario actual
  const currentUserId = useMemo(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.id;
    } catch {
      return null;
    }
  }, []);

  const filteredDirects = useMemo(() => {
    if (!currentUserId) return directUsers;
    return directUsers.filter(user => user.id !== currentUserId);
  }, [directUsers, currentUserId]);

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
        titulo: user.nombre, // Usar el nombre del usuario en lugar del título del backend
        nombre: user.nombre,
        messages: messages,
        lastMessage: messages.length > 0 ? messages[messages.length - 1] : null
      };

      // Actualizar el usuario con el conversacionId ANTES de seleccionar
      user.conversacionId = conv.id;
      
      onSelect?.(directChat);
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

  return (
    <aside className="w-full h-full flex flex-col p-2">
      <div className="p-3 bg-light rounded-card w-full h-full flex flex-col overflow-hidden">
        {/* Top title */}
        <div className="px-2 py-3 border-b border-neutral-1">
          <h1 className="text-display-md font-bold text-center text-neutral-2">WORKLY</h1>
        </div>

        {/* Sections */}
        <div className="flex-1 flex flex-col overflow-hidden mt-2">
          <div className="overflow-y-auto max-h-[50%]">
            <GroupSection groups={groups} onSelect={onSelect} selectedChatId={selectedChatId} />
          </div>

          <div className="border-t border-neutral-1 my-2" />

          <div className="flex-1 overflow-y-auto">
            <DirectSection directs={filteredDirects} onSelect={handleDirectSelect} selectedChatId={selectedChatId} />
          </div>
        </div>

        {/* User Profile Section */}
        <div className="border-t border-neutral-1 pt-3 mt-2">
          <div className="flex items-center gap-3 px-3 py-2">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-primary text-light flex items-center justify-center text-text-sm font-semibold flex-shrink-0">
              {(currentUser?.nombre || 'U').charAt(0).toUpperCase()}
            </div>
            
            {/* User Info */}
            <div className="flex-1 min-w-0">
              <p className="text-text-base font-semibold text-black truncate">
                {currentUser?.nombre || 'Tu Usuario'}
              </p>
              <p className="text-text-sm text-neutral-2">En línea</p>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => {
                localStorage.removeItem('user');
                localStorage.removeItem('userToken');
                localStorage.removeItem('token');
                navigate('/login');
              }}
              className="p-2 rounded-lg hover:bg-neutral-1 transition-colors text-neutral-2 hover:text-black"
              title="Cerrar sesión"
            >
              <FiLogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
