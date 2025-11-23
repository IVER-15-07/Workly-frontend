import PropTypes from 'prop-types';
import ChatItem from './ChatItem';

const GroupSection = ({ groups = [], onSelect, selectedChatId }) => {
  return (
    <div>
      <div className="px-3 py-2">
        <div className="flex items-center justify-between">
          <h3 className="text-text-base font-semibold text-neutral-2">Grupos</h3>
          <div className="flex items-center gap-2">
            <span className="text-text-sm text-neutral-2">{groups.length}</span>
            <button
              type="button"
              aria-label="Crear grupo"
              onClick={() => onSelect?.({ action: 'create' })}
              className="w-7 h-7 flex items-center justify-center rounded-[10px] bg-secondary text-black hover:opacity-80 transition-opacity text-lg font-bold"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="px-1">
        {groups.length === 0 ? (
          <div className="py-4 text-center text-text-sm text-neutral-2">Sin grupos</div>
        ) : (
          <ul className="space-y-1">
            {groups.map((g) => (
              <li key={g.id}>
                <ChatItem chat={g} onSelect={onSelect} selected={g.id === selectedChatId} size="md" />
              </li>
            ))}
          </ul>
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
