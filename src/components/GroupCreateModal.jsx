import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'styled-components';
import { Button } from './button/Button';
import { IconButton } from './button/IconButton';

const GroupCreateModal = ({ isOpen, onClose, onCreate, users = [], currentUser }) => {
  const theme = useTheme?.() || {};
  const [name, setName] = useState('');
  const [selected, setSelected] = useState([]);
  const nameRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setSelected(currentUser ? [currentUser.id] : []);
      setTimeout(() => nameRef.current?.focus(), 50);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert('El nombre del grupo es requerido');
    if (!selected.length) return alert('Selecciona al menos 1 integrante');

    onCreate({ titulo: name.trim(), integrantes: selected });
  };

  const modalBg = theme.colors?.light || '#ffffff';
  const overlayBg = 'rgba(0,0,0,0.45)';
  const inputRadius = theme.shapes?.inputMedium || '12px';
  const borderColor = theme.colors?.neutral1 || '#E2E2E2';
  const textColor = theme.colors?.neutral2 || '#807979';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" aria-modal="true" role="dialog">
      <div className="absolute inset-0" style={{ background: overlayBg }} onClick={onClose} />

      <div
        className="relative w-full max-w-xl mx-4"
        style={{ background: modalBg, borderRadius: theme.shapes?.cardRadius || '12px', boxShadow: '0 12px 30px rgba(2,6,23,0.2)', padding: 20, color: '#0b0b0b' }}
      >
        <div className="flex items-start justify-between mb-3">
          <h3 style={{ fontSize: theme.typography?.display?.small?.fontSize || '18px', fontWeight: 700 }}>Crear grupo</h3>
          <IconButton icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>} variant="ghost" onClick={onClose} aria-label="Cerrar" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" style={{ color: textColor }}>Nombre</label>
            <input
              ref={nameRef}
              className="w-full px-3 py-2"
              style={{ border: `1px solid ${borderColor}`, borderRadius: inputRadius, padding: '10px 12px', fontFamily: theme.typography?.fontFamily }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del grupo"
              aria-label="Nombre del grupo"
            />
          </div>

          <div className="mb-4">
            <div className="block text-sm font-medium mb-2" style={{ color: textColor }}>Integrantes</div>
            <div className="max-h-48 overflow-auto" style={{ border: `1px solid ${borderColor}`, borderRadius: inputRadius, padding: 10 }}>
              {users.length === 0 ? (
                <div className="text-sm" style={{ color: textColor }}>No hay usuarios disponibles</div>
              ) : (
                users.map((u) => (
                  <label key={u.id} className="flex items-center gap-2 mb-2" style={{ cursor: 'pointer' }}>
                    <input type="checkbox" checked={selected.includes(u.id)} onChange={() => toggle(u.id)} />
                    <span style={{ fontFamily: theme.typography?.fontFamily }}>{u.nombre || u.name || `User ${u.id}`}</span>
                  </label>
                ))
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="ghost" size="medium" onClick={onClose}>Cancelar</Button>
            <Button type="submit" variant="primary" size="medium">Crear</Button>
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
