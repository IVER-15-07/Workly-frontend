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
    sm: { avatar: 'w-8 h-8', pad: 'px-3 py-2', titleSize: theme.typography?.text?.small?.fontSize || '14px' },
    md: { avatar: 'w-10 h-10', pad: 'px-4 py-3', titleSize: theme.typography?.text?.medium?.fontSize || '16px' },
    lg: { avatar: 'w-12 h-12', pad: 'px-4 py-3', titleSize: theme.typography?.text?.large?.fontSize || '20px' },
  };

  const s = sizes[size] || sizes.md;

  return (
    <button
      type="button"
      onClick={() => onSelect?.(chat)}
      className={`w-full text-left flex items-center gap-3 transition-colors duration-150 ${s.pad}`}
      style={selected ? { backgroundColor: theme.colors?.primary, color: theme.colors?.light, borderRadius: theme.shapes?.buttonRadius || '12px' } : undefined}
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
        <div className="flex items-center justify-between">
          <div className="truncate" style={{ fontFamily, fontSize: s.titleSize, fontWeight: 600 }}>{title}</div>
          <div className="ml-2 text-xs" style={{ color: theme.colors?.neutral2 }}>{time}</div>
        </div>
        {subtitle && <div className="truncate mt-1 text-sm" style={{ color: theme.colors?.neutral2 }}>{subtitle}</div>}
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
