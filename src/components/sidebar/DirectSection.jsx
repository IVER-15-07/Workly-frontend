import PropTypes from 'prop-types';
import { useTheme } from 'styled-components';
import ChatItem from './ChatItem';

const DirectSection = ({ directs = [], onSelect, selectedChatId }) => {
  const theme = useTheme?.() || {};
  const fontFamily = theme.typography?.fontFamily || 'sans-serif';
  const textMedium = theme.typography?.text?.medium || { fontSize: '16px', fontWeight: 400, lineHeight: '24px' };
  //const neutral1 = theme.colors?.neutral1 || '#E2E2E2';
  const neutral2 = theme.colors?.neutral2 || '#807979';
  //const badgeBg = theme.colors?.black || '#0b0b0b';

  return (
    <div>
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <div style={{ fontFamily, fontSize: textMedium.fontSize, fontWeight: 600, color: neutral2 }}>MENSAJES DIRECTOS</div>
        <div style={{ fontFamily, fontSize: textMedium.fontSize, color: neutral2 }}>{directs.length}</div>
      </div>

      <div className="overflow-y-auto px-2">
        {directs.length === 0 ? (
          <div className="p-6 text-center" style={{ color: neutral2 }}>No hay mensajes directos.</div>
        ) : (
          <ul className="space-y-3">
            {directs.map((d) => (
              <li key={d.id} className="relative">
                <ChatItem chat={d} onSelect={onSelect} selected={d.id === selectedChatId} size="lg" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

DirectSection.propTypes = {
  directs: PropTypes.array,
  onSelect: PropTypes.func,
  selectedChatId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default DirectSection;
