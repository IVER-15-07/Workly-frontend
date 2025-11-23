import PropTypes from 'prop-types';
import { useTheme } from 'styled-components';

const ChatItem = ({
  chat = {},
  onSelect,
  selected = false,
  size = 'md', // 'sm' | 'md' | 'lg'
}) => {
  const theme = useTheme?.() || {};
  const fontFamily = theme.typography?.fontFamily || 'sans-serif';

  const title = chat.titulo || chat.nombre || chat.title || `Chat ${chat.id}`;
  const subtitle = chat.lastMessage?.contenido ?? '';
  const time = chat.lastMessage?.creadoEn ? new Date(chat.lastMessage.creadoEn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
  const avatarUrl = chat.avatarUrl;
  const online = chat.online;
  const badgeCount = chat.unread ?? chat.count ?? chat.unreadCount ?? 0;

  const sizes = {
    sm: { avatar: 'w-8 h-8', pad: 'px-2 py-2', titleSize: theme.typography?.text?.small?.fontSize },
    md: { avatar: 'w-9 h-9', pad: 'px-3 py-2', titleSize: theme.typography?.text?.small?.fontSize },
    lg: { avatar: 'w-10 h-10', pad: 'px-3 py-2', titleSize: theme.typography?.text?.medium?.fontSize },
  };

  const s = sizes[size] || sizes.md;

  return (
    <button
      type="button"
      onClick={() => onSelect?.(chat)}
      className={`w-full text-left flex items-center gap-2 transition-all duration-200 ${s.pad} ${
        selected 
          ? 'bg-primary text-light' 
          : 'hover:bg-neutral-1'
      }`}
      style={{ borderRadius: theme.shapes?.buttonNormal }}
      aria-pressed={selected}
      aria-label={`Abrir ${title}`}
    >
      <div className={`relative flex-shrink-0 ${s.avatar} rounded-full overflow-hidden flex items-center justify-center`} style={{ background: theme.colors?.card }}>
        {avatarUrl ? (
          <img src={avatarUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <span style={{ fontFamily, fontWeight: 700, color: '#0b0b0b' }}>{String(title).slice(0, 1).toUpperCase()}</span>
        )}
        {online && <span className="absolute right-0 bottom-0 w-3 h-3 rounded-full" style={{ background: '#36D07B', border: `2px solid ${theme.colors?.light}` }} />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <div className="truncate" style={{ fontFamily, fontSize: s.titleSize, fontWeight: 600 }}>{title}</div>
          <div className="ml-2" style={{ fontSize: '11px', color: selected ? theme.colors?.light : theme.colors?.neutral2, opacity: selected ? 0.8 : 1 }}>{time}</div>
        </div>
        {subtitle && <div className="truncate" style={{ fontSize: theme.typography?.text?.small?.fontSize, color: selected ? theme.colors?.light : theme.colors?.neutral2, opacity: selected ? 0.8 : 1 }}>{subtitle}</div>}
      </div>

      {badgeCount > 0 && (
        <span
          className={`inline-flex items-center justify-center ${badgeCount > 9 ? 'px-2.5' : 'px-2'} h-6 rounded-full ml-2`}
          style={{
            background: theme.colors?.primary || '#547792',
            color: theme.colors?.light || '#fff',
            fontFamily,
            fontSize: theme.typography?.text?.small?.fontSize,
            fontWeight: 600,
          }}
        >
          {badgeCount > 9 ? `+${badgeCount}` : badgeCount}
        </span>
      )}
    </button>
  );
};

ChatItem.propTypes = {
  chat: PropTypes.object,
  onSelect: PropTypes.func,
  selected: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  
};

export default ChatItem;
