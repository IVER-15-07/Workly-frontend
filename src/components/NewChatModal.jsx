import { useState, useMemo } from 'react';
import { FiX, FiSearch } from 'react-icons/fi';

const NewChatModal = ({ isOpen, onClose, availableUsers = [], onSelectUser, currentUserId }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar usuarios excluyendo al usuario actual
  const filteredUsers = useMemo(() => {
    return availableUsers.filter(user => {
      if (user.id === currentUserId) return false;
      if (!searchTerm.trim()) return true;
      
      const search = searchTerm.toLowerCase();
      return (
        user.nombre?.toLowerCase().includes(search) ||
        user.email?.toLowerCase().includes(search)
      );
    });
  }, [availableUsers, currentUserId, searchTerm]);

  const handleUserClick = (user) => {
    onSelectUser(user);
    onClose();
    setSearchTerm('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 backdrop-blur-md" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-light rounded-card shadow-xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-1">
          <h2 className="text-text-lg font-semibold text-black">Nuevo chat</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-1 rounded-button transition-colors"
          >
            <FiX size={20} className="text-neutral-2" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-neutral-1">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-2" size={18} />
            <input
              type="text"
              placeholder="Buscar usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-1 border-none rounded-input text-text-base text-black placeholder-neutral-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto p-2">
          {filteredUsers.length === 0 ? (
            <div className="py-8 text-center text-text-sm text-neutral-2">
              {searchTerm ? 'No se encontraron usuarios' : 'No hay usuarios disponibles'}
            </div>
          ) : (
            <ul className="space-y-1">
              {filteredUsers.map((user) => (
                <li key={user.id}>
                  <button
                    onClick={() => handleUserClick(user)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-1 transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary text-light flex items-center justify-center text-text-sm font-semibold flex-shrink-0">
                      {(user.nombre || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-text-base font-medium text-black truncate">
                        {user.nombre || `Usuario ${user.id}`}
                      </p>
                      {user.email && (
                        <p className="text-text-sm text-neutral-2 truncate">{user.email}</p>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;
