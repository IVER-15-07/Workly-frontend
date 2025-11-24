import PropTypes from 'prop-types';
import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import ChatItem from './ChatItem';
import NewChatModal from '../NewChatModal';
import { conversationService } from '../../api/services/conversation.api';

const DirectSection = ({ directs = [], availableUsers = [], onSelect, selectedChatId, currentUserId }) => {
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  
  // Handler para crear conversación con un usuario nuevo
  const handleUserSelect = async (user) => {
    try {
      const res = await conversationService.createOrGetConversation({
        userAId: currentUserId,
        userBId: user.id,
        titulo: user.nombre
      });
      const conv = res?.data ?? res;

      // Cargar mensajes si existen
      let messages = [];
      if (conv?.id) {
        try {
          const msgsResponse = await conversationService.getMessages(conv.id);
          const msgs = msgsResponse?.data ?? msgsResponse;
          messages = Array.isArray(msgs) ? msgs : [];
        } catch {
          // Error silencioso
        }
      }

      const directChat = {
        ...conv,
        id: conv.id,
        conversacionId: conv.id,
        isGroup: false,
        titulo: user.nombre,
        nombre: user.nombre,
        messages: messages,
        lastMessage: messages.length > 0 ? messages[messages.length - 1] : null,
        participante: user
      };

      onSelect?.(directChat);
    } catch {
      alert('No se pudo abrir la conversación. Intenta de nuevo.');
    }
  };

  return (
    <div>
      <div className="px-3 py-2">
        <div className="flex items-center justify-between">
          <h3 className="text-text-base font-semibold text-neutral-2">Mensajes directos</h3>
          <div className="flex items-center gap-2">
            <span className="text-text-sm text-neutral-2">{directs.length}</span>
            <button
              onClick={() => setShowNewChatModal(true)}
              className="p-1 hover:bg-neutral-1 rounded-button transition-colors"
              title="Nuevo chat"
            >
              <FiPlus size={18} className="text-neutral-2" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-1">
        {directs.length === 0 ? (
          <div className="py-4 text-center text-text-sm text-neutral-2">
            No hay conversaciones. Haz clic en + para iniciar un chat.
          </div>
        ) : (
          <ul className="space-y-1">
            {directs.map((d) => (
              <li key={`conv-${d.id}`}>
                <ChatItem chat={d} onSelect={onSelect} selected={d.conversacionId === selectedChatId} size="md" />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal para nuevo chat */}
      <NewChatModal
        isOpen={showNewChatModal}
        onClose={() => setShowNewChatModal(false)}
        availableUsers={availableUsers}
        onSelectUser={handleUserSelect}
        currentUserId={currentUserId}
      />
    </div>
  );
};

DirectSection.propTypes = {
  directs: PropTypes.array,
  onSelect: PropTypes.func,
  selectedChatId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default DirectSection;
