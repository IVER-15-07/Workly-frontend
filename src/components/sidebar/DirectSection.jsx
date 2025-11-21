import ChatItem from './ChatItem';
import PropTypes from 'prop-types';

const DirectSection = ({ directs = [], onSelect, selectedChatId }) => {
  return (
    <div className="border-t">
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <div className="text-xs font-semibold text-gray-500">MENSAJES DIRECTOS</div>
        <div className="text-xs text-gray-400">{directs.length}</div>
      </div>

      <div className="max-h-64 overflow-y-auto">
        {directs.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-500">No hay mensajes directos.</div>
        ) : (
          directs.map((d) => <ChatItem key={d.id} chat={d} onSelect={onSelect} selectedChatId={selectedChatId} compact />)
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
