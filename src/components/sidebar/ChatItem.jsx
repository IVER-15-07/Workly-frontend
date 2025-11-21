import PropTypes from 'prop-types';

const ChatItem = ({ chat, onSelect, selectedChatId, compact = false }) => {
  const title = chat.titulo || chat.nombre || `Chat ${chat.id}`;
  const last = chat.lastMessage?.contenido ?? '';
  const time = chat.lastMessage?.creadoEn ? new Date(chat.lastMessage.creadoEn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
  const selected = chat.id === selectedChatId;

  return (
    <button
      type="button"
      onClick={() => onSelect?.(chat)}
      className={`w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-gray-50 ${selected ? 'bg-gray-100' : ''}`}
      aria-pressed={selected}
      aria-label={`Abrir ${title}`}
    >
      <div className={`${compact ? 'w-10 h-10 rounded-full' : 'w-12 h-12 rounded-md'} bg-gray-200 flex items-center justify-center overflow-hidden`}>
        {chat.avatarUrl ? (
          <img src={chat.avatarUrl} alt={`${title} avatar`} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-700 font-medium">{String(title).slice(0, 1).toUpperCase()}</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-gray-800 truncate">{title}</div>
          <div className="text-xs text-gray-400 ml-2">{time}</div>
        </div>
        <div className="text-xs text-gray-500 truncate mt-1">{last}</div>
      </div>
    </button>
  );
};

ChatItem.propTypes = {
  chat: PropTypes.object.isRequired,
  onSelect: PropTypes.func,
  selectedChatId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  compact: PropTypes.bool,
};

export default ChatItem;
