import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import { FiX } from 'react-icons/fi';

const GroupCreateModal = ({ isOpen, onClose, onCreate, users = [], currentUser }) => {
  const [name, setName] = useState('');
  const [selected, setSelected] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const nameRef = useRef(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setName('');
        setSelected(currentUser ? [currentUser.id] : []);
        setIsCreating(false);
        nameRef.current?.focus();
      }, 0);
    }
  }, [isOpen, currentUser]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    if (isOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggle = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isCreating) return; // Prevenir doble click
    if (!name.trim()) return alert('El nombre del grupo es requerido');
    if (selected.length < 2) return alert('Selecciona al menos 2 integrantes para crear un grupo');

    setIsCreating(true);
    try {
      await onCreate({ titulo: name.trim(), integrantes: selected });
    } catch {
      setIsCreating(false);
    }
  };

  const availableUsers = users.filter(u => u.id !== currentUser?.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" aria-modal="true" role="dialog">
      <div className="absolute inset-0 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-lg mx-4 bg-light rounded-card shadow-xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-display-sm font-bold text-neutral-2">Crear Grupo</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-1 transition-colors text-neutral-2"
            aria-label="Cerrar"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Nombre del grupo */}
          <div className="mb-5">
            <label className="block text-text-sm font-semibold mb-2 text-neutral-2">
              Nombre del grupo
            </label>
            <input
              ref={nameRef}
              type="text"
              className="w-full px-3 py-2.5 border border-neutral-1 rounded-input text-text-base text-black focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Equipo de Desarrollo"
              aria-label="Nombre del grupo"
              disabled={isCreating}
            />
          </div>

          {/* Lista de usuarios */}
          <div className="mb-6">
            <label className="block text-text-sm font-semibold mb-2 text-neutral-2">
              Seleccionar integrantes ({selected.length} seleccionados)
            </label>
            <div className="max-h-60 overflow-y-auto border border-neutral-1 rounded-input p-3 bg-white">
              {availableUsers.length === 0 ? (
                <div className="text-text-sm text-neutral-2 text-center py-4">
                  No hay usuarios disponibles
                </div>
              ) : (
                <div className="space-y-2">
                  {availableUsers.map((u) => (
                    <label
                      key={u.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-1 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selected.includes(u.id)}
                        onChange={() => toggle(u.id)}
                        className="w-4 h-4 text-primary border-neutral-1 rounded focus:ring-primary focus:ring-2"
                        disabled={isCreating}
                      />
                      <span className="text-text-base text-black">
                        {u.nombre || u.name || `Usuario ${u.id}`}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-text-base font-medium text-neutral-2 hover:bg-neutral-1 rounded-button transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isCreating}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-text-base font-medium bg-primary text-light rounded-button hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isCreating}
            >
              {isCreating ? 'Creando...' : 'Crear Grupo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

GroupCreateModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onCreate: PropTypes.func,
  users: PropTypes.array,
  currentUser: PropTypes.object,
};

export default GroupCreateModal;
