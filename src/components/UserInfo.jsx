const UserInfo = ({ selectedChat = null, currentUserId = null }) => {
  const isGroup = selectedChat?.isGroup || selectedChat?.tipo === 'grupal';
  
  // Si hay un chat seleccionado (grupo o privado), mostrar info del chat
  if (selectedChat) {
    // Para grupos
    if (isGroup) {
    const participants = selectedChat.participantes || [];
    const participantUsers = participants
      .map(p => p.usuario || p)
      .filter(u => u && u.id !== currentUserId);
    
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

            {/* Integrantes */}
            <div className="w-full">
              <p className="text-text-sm font-semibold text-neutral-2 mb-3">
                Integrantes ({participantUsers.length})
              </p>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {participantUsers.map((participant, idx) => (
                  <div key={participant.id || idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-1">
                    <div className="w-10 h-10 rounded-full bg-primary text-light flex items-center justify-center text-text-sm font-semibold">
                      {(participant.nombre || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-text-base font-medium text-black">{participant.nombre || `Usuario ${participant.id}`}</p>
                      {participant.email && (
                        <p className="text-text-sm text-neutral-2">{participant.email}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
    }
    
    // Para chats privados - mostrar info del otro usuario
    const participants = selectedChat.participantes || [];
    const otherUser = participants
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