import PropTypes from 'prop-types';
import ChatItem from './ChatItem';

const DirectSection = ({ directs = [], onSelect, selectedChatId }) => {
  return (
    <div>
      <div className="px-3 py-2">
        <div className="flex items-center justify-between">
          <h3 className="text-text-base font-semibold text-neutral-2">Mensajes directos</h3>
          <span className="text-text-sm text-neutral-2">{directs.length}</span>
        </div>
      </div>

      <div className="px-1">
        {directs.length === 0 ? (
          <div className="py-4 text-center text-text-sm text-neutral-2">Sin conversaciones</div>
        ) : (
          <ul className="space-y-1">
            {directs.map((d) => (
              <li key={d.id}>
                <ChatItem chat={d} onSelect={onSelect} selected={d.conversacionId === selectedChatId} size="md" />
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
