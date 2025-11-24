import { useState, useEffect } from 'react';
import { FiUserPlus, FiUserMinus } from 'react-icons/fi';
import AddParticipantModal from './AddParticipantModal';
import { conversationService } from '../api/services/conversation.api';

const UserInfo = ({ selectedChat = null, currentUserId = null, allUsers = [], onParticipantsUpdate = () => {} }) => {
  const isGroup = selectedChat?.isGroup || selectedChat?.tipo === 'grupal';
  const [showAddModal, setShowAddModal] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar participantes usando el servicio optimizado
  useEffect(() => {
    const loadParticipants = async () => {
      if (!isGroup || !selectedChat?.conversacionId) {
        setParticipants([]);
        return;
      }

      setLoading(true);
      try {
        const response = await conversationService.listarParticipantes(selectedChat.conversacionId);
        const participantsList = (response?.data ?? response) || [];
        setParticipants(participantsList);
      } catch {
        // Fallback a los participantes del chat seleccionado
        const fallbackParticipants = selectedChat?.participantes || [];
        setParticipants(fallbackParticipants);
      } finally {
        setLoading(false);
      }
    };

    loadParticipants();
  }, [selectedChat?.conversacionId, selectedChat?.participantes, isGroup]);

  // Agregar participantes al grupo
  const handleAddParticipants = async (userIds) => {
    if (!selectedChat?.conversacionId) return;

    try {
      await Promise.all(
        userIds.map(userId => 
          conversationService.agregarParticipanteAGrupo(selectedChat.conversacionId, userId)
        )
      );
      
      setShowAddModal(false);
      
      // Recargar participantes usando el servicio
      const response = await conversationService.listarParticipantes(selectedChat.conversacionId);
      const participantsList = (response?.data ?? response) || [];
      setParticipants(participantsList);
      
      onParticipantsUpdate();
    } catch {
      alert('No se pudieron agregar los participantes. Intenta de nuevo.');
    }
  };

  // Eliminar participante del grupo
  const handleRemoveParticipant = async (userId) => {
    if (!selectedChat?.conversacionId) return;

    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este participante del grupo?');
    if (!confirmDelete) return;

    try {
      await conversationService.eliminarParticipanteDeGrupo(selectedChat.conversacionId, userId);
      
      // Recargar participantes usando el servicio
      const response = await conversationService.listarParticipantes(selectedChat.conversacionId);
      const participantsList = (response?.data ?? response) || [];
      setParticipants(participantsList);
      
      onParticipantsUpdate();
    } catch {
      alert('No se pudo eliminar el participante. Intenta de nuevo.');
    }
  };
  
  // Determinar si el usuario actual es el creador del grupo
  const isGroupCreator = () => {
    if (!isGroup) {
      return false;
    }
    
    // Si el chat tiene creadorId (grupos recién creados), usarlo
    if (selectedChat?.creadorId) {
      return selectedChat.creadorId === currentUserId;
    }
    
    // Fallback: usar la lógica de primera persona que se unió
    if (!participants || participants.length === 0) {
      return false;
    }
    
    const sortedParticipants = [...participants].sort((a, b) => {
      const dateA = new Date(a.unidoEn || a.creadoEn);
      const dateB = new Date(b.unidoEn || b.creadoEn);
      return dateA - dateB;
    });
    
    const creator = sortedParticipants[0];
    const creatorId = creator?.usuarioId || creator?.usuario?.id;
    return creatorId === currentUserId;
  };

  // Si hay un chat seleccionado (grupo o privado), mostrar info del chat
  if (selectedChat) {
    // Para grupos
    if (isGroup) {
    const participantUsers = participants
      .map(p => p.usuario || p)
      .filter(u => u && u.id !== currentUserId);
    
    const canManageParticipants = isGroupCreator();
    
    return (
      <div className="w-full h-screen flex flex-col items-center justify-start p-4 bg-transparent">
        <div className="w-full rounded-xl p-4" style={{ backgroundColor: 'rgba(255,255,255,0.86)', backdropFilter: 'blur(6px)' }}>
          {/* Encabezado */}
          <div className="pt-2 pb-3">
            <p className="text-text-lg font-semibold text-black text-center">INFORMACIÓN DEL GRUPO</p>
          </div>

          {/* Contenido principal */}
          <div className="flex-1 flex flex-col items-start justify-start pt-2 w-full">
            {/* Nombre del grupo */}
            <div className="w-full mb-6">
              <p className="text-text-sm font-semibold text-neutral-2 mb-1">Nombre</p>
              <h3 className="text-text-lg font-bold text-black">{selectedChat.titulo || 'Sin nombre'}</h3>
            </div>

            {/* Botón agregar participante - solo para el creador */}
            {canManageParticipants && (
              <div className="w-full mb-4">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-light rounded-button hover:opacity-90 transition-opacity"
                >
                  <FiUserPlus size={20} />
                  <span className="text-text-base font-semibold">Agregar participantes</span>
                </button>
              </div>
            )}

            {/* Integrantes */}
            <div className="w-full">
              <p className="text-text-sm font-semibold text-neutral-2 mb-3">
                Integrantes ({participantUsers.length})
                {loading && <span className="text-text-xs ml-2">(Cargando...)</span>}
              </p>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {participantUsers.map((participant, idx) => (
                  <div key={participant.id || idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-1">
                    <div className="w-10 h-10 rounded-full bg-primary text-light flex items-center justify-center text-text-sm font-semibold">
                      {(participant.nombre || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-text-base font-medium text-black truncate">{participant.nombre || `Usuario ${participant.id}`}</p>
                      {participant.email && (
                        <p className="text-text-sm text-neutral-2 truncate">{participant.email}</p>
                      )}
                    </div>
                    {/* Botón eliminar - solo para el creador */}
                    {canManageParticipants && (
                      <button
                        onClick={() => handleRemoveParticipant(participant.id)}
                        className="p-2 hover:bg-red-100 rounded-button transition-colors text-error"
                        title="Eliminar del grupo"
                      >
                        <FiUserMinus size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal agregar participantes */}
        <AddParticipantModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddParticipants}
          allUsers={allUsers}
          currentParticipants={participants.map(p => p.usuario || p)}
          currentUserId={currentUserId}
        />
      </div>
    );
    }
    
    // Para chats privados - mostrar info del otro usuario
    // Puede venir como 'participante' (singular) o 'participantes' (plural)
    const otherUser = selectedChat.participante || 
                     (selectedChat.participantes || [])
                       .map(p => p.usuario || p)
                       .find(u => u && u.id !== currentUserId);
    
    // Si encontramos al otro usuario, mostrarlo
    if (otherUser) {
      return (
        <div className="w-full h-screen flex flex-col items-center justify-start p-4 bg-transparent">
          <div className="w-full rounded-xl p-4" style={{ backgroundColor: 'rgba(255,255,255,0.86)', backdropFilter: 'blur(6px)' }}>
            {/* Encabezado */}
            <div className="pt-2 pb-3">
              <p className="text-text-lg font-semibold text-black text-center">INFORMACIÓN DEL CONTACTO</p>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 flex flex-col items-center justify-start pt-2">
              <div className="w-40 h-40 rounded-full overflow-hidden bg-primary mb-4 flex items-center justify-center">
                {otherUser.avatarUrl ? (
                  <img src={otherUser.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl text-light font-bold">
                    {(otherUser.nombre || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <h3 className="text-text-lg font-semibold text-black mb-1">{otherUser.nombre}</h3>
              <p className="text-text-base text-neutral-2">{otherUser.email}</p>
              
              {/* Información adicional */}
              <div className="w-full mt-6 pt-6 border-t border-neutral-1">
                <div className="space-y-3">
                  <div>
                    <p className="text-text-sm font-semibold text-neutral-2 mb-1">Estado</p>
                    <p className="text-text-base text-black">Activo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
  
  // Vista por defecto - sin chat seleccionado
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center p-4 bg-transparent">
      <div className="w-full rounded-xl p-6 text-center" style={{ backgroundColor: 'rgba(255,255,255,0.86)', backdropFilter: 'blur(6px)' }}>
        <p className="text-text-base text-neutral-2">Selecciona un chat para ver la información</p>
      </div>
    </div>
  );
};

export default UserInfo;