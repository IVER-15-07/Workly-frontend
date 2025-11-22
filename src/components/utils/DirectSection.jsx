import PropTypes from 'prop-types';
import { useTheme } from 'styled-components';
import ChatItem from './ChatItem';

const DirectSection = ({ directs = [], onSelect, selectedChatId }) => {
  const theme = useTheme?.() || {};
  const textMedium = theme.typography?.text?.medium || { fontSize: '16px', fontWeight: 400, lineHeight: '24px' };
  const textSmall = theme.typography?.text?.small || { fontSize: '14px', fontWeight: 400, lineHeight: '20px' };
  const neutral2 = theme.colors?.neutral2 || '#807979';
  const selectedBg = theme.colors?.primary || '#374151';

  // Tipografía desde theme
  const fontFamily = theme.typography?.fontFamily || 'sans-serif';

  return (
    <div>
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <div style={{ fontFamily, fontSize: textMedium.fontSize, fontWeight: 600, color: neutral2 }}>MENSAJES DIRECTOS</div>
          </div>
          
          <div className="flex items-center gap-2">
            <div style={{ fontFamily, fontSize: textSmall.fontSize, color: theme.colors?.neutral2 }}>{directs.length}</div>
          </div>
        </div>
      </div>

      <div className="px-2 pb-3">
        {directs.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-500">No hay mensajes directos.</div>
        ) : (
          <div className="pr-2">
            <ul className="space-y-2 relative">
              {directs.map((d) => (
                <li key={d.id} className="relative">
                  {/* left selected indicator */}
                  {d.id === selectedChatId && (
                    <span className="absolute left-2 top-2 bottom-2 w-1 rounded-r" style={{ backgroundColor: selectedBg }} />
                  )}

                  <div className="pl-3">
                    <ChatItem chat={d} onSelect={onSelect} selected={d.id === selectedChatId} size="md" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
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
