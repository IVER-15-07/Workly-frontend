import ChatItem from './ChatItem';
import PropTypes from 'prop-types';

const GroupSection = ({ groups = [], onSelect, selectedChatId }) => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-4 pt-2 pb-2 flex items-center justify-between">
        <div className="text-xs font-semibold text-gray-500">GRUPOS</div>
        <div className="text-xs text-gray-400">{groups.length}</div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {groups.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-500">No hay grupos.</div>
        ) : (
          groups.map((g) => <ChatItem key={g.id} chat={g} onSelect={onSelect} selectedChatId={selectedChatId} />)
        )}
      </div>
    </div>
  );
};

GroupSection.propTypes = {
  groups: PropTypes.array,
  onSelect: PropTypes.func,
  selectedChatId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default GroupSection;
