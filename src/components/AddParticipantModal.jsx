import { useState, useMemo } from 'react';
import { FiX, FiUserPlus } from 'react-icons/fi';

const AddParticipantModal = ({ isOpen, onClose, onAdd, allUsers = [], currentParticipants = [], currentUserId }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrar usuarios que ya están en el grupo
  const availableUsers = useMemo(() => {
    const participantIds = currentParticipants.map(p => p.id);
    return allUsers.filter(user => 
      !participantIds.includes(user.id) && user.id !== currentUserId
    );
  }, [allUsers, currentParticipants, currentUserId]);

  // Filtrar por búsqueda
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return availableUsers;
    const query = searchQuery.toLowerCase();
    return availableUsers.filter(user => 
      user.nombre?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query)
    );
  }, [availableUsers, searchQuery]);

  const toggleUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAdd = () => {
    if (selectedUsers.length === 0) return;
    onAdd(selectedUsers);
    setSelectedUsers([]);
    setSearchQuery('');
  };

  const handleClose = () => {
    setSelectedUsers([]);
    setSearchQuery('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 backdrop-blur-md" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-light rounded-card shadow-lg w-full max-w-md max-h-[80vh] flex flex-col font-sans">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-1">
          <div className="flex items-center gap-2">
            <FiUserPlus size={24} className="text-primary" />
            <h2 className="text-text-lg font-semibold text-black">
              Agregar participantes
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-neutral-1 rounded-button transition-colors"
          >
            <FiX size={20} className="text-neutral-2" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-neutral-1">
          <input
            type="text"
            placeholder="Buscar usuarios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-neutral-1 rounded-input text-text-base text-black placeholder-neutral-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-neutral-2">
              {availableUsers.length === 0 
                ? 'Todos los usuarios ya están en el grupo'
                : 'No se encontraron usuarios'
              }
            </div>
          ) : (
            <div className="space-y-2">
              {filteredUsers.map((user) => {
                const isSelected = selectedUsers.includes(user.id);
                return (
                  <button
                    key={user.id}
                    onClick={() => toggleUser(user.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-button transition-all ${
                      isSelected 
                        ? 'bg-primary text-light' 
                        : 'hover:bg-neutral-1'
                    }`}
                  >
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-text-sm font-semibold ${
                        isSelected ? 'bg-light text-primary' : 'bg-primary text-light'
                      }`}
                    >
                      {(user.nombre || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`text-text-base font-medium ${isSelected ? 'text-light' : 'text-black'}`}>
                        {user.nombre}
                      </p>
                      {user.email && (
                        <p className={`text-text-sm ${isSelected ? 'text-light/80' : 'text-neutral-2'}`}>
                          {user.email}
                        </p>
                      )}
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-light flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-1 flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 bg-neutral-1 text-black rounded-button hover:bg-neutral-2 transition-colors text-text-base font-semibold"
          >
            Cancelar
          </button>
          <button
            onClick={handleAdd}
            disabled={selectedUsers.length === 0}
            className="flex-1 px-4 py-2 bg-primary text-light rounded-button hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-text-base font-semibold"
          >
            Agregar ({selectedUsers.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddParticipantModal;
