import { useTheme } from 'styled-components';
import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import Chat from '../page/Chat.jsx';
import UserInfo from '../components/UserInfo.jsx';
import GroupCreateModal from '../components/GroupCreateModal.jsx';
import { conversationService } from '../api/services/conversation.api';

const VentanaChat = () => {
  const theme = useTheme();
  const [chats, setChats] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [currentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || { id: 1, nombre: 'Usuario_123', email: 'usuario@gmail.com' };
    } catch {
      return { id: 1, nombre: 'Usuario_123', email: 'usuario@gmail.com' };
    }
  });

  const [showGroupModal, setShowGroupModal] = useState(false);

  // Función auxiliar para formatear conversaciones
  const formatConversations = (privateChats, groupChats) => {
    // Filtrar solo chats privados que tienen mensajes
    const privateChatsWithMessages = privateChats.filter(chat => chat.ultimoMensaje);

    // Agrupar chats privados por participante (solo la conversación más reciente)
    const privateChatsMap = new Map();
    privateChatsWithMessages.forEach(chat => {
      const participantId = chat.participante?.id;
      if (!participantId) return;
      
      const existing = privateChatsMap.get(participantId);
      if (!existing || chat.conversacionId > existing.conversacionId) {
        privateChatsMap.set(participantId, chat);
      }
    });

    const formattedPrivateChats = Array.from(privateChatsMap.values()).map(chat => ({
      id: chat.conversacionId,
      conversacionId: chat.conversacionId,
      titulo: chat.participante?.nombre || chat.titulo,
      nombre: chat.participante?.nombre || chat.titulo,
      isGroup: false,
      participante: chat.participante,
      lastMessage: chat.ultimoMensaje,
      unread: 0
    }));

    const formattedGroupChats = groupChats.map(chat => ({
      id: chat.conversacionId,
      conversacionId: chat.conversacionId,
      titulo: chat.titulo,
      isGroup: true,
      participantes: chat.participantes,
      lastMessage: chat.ultimoMensaje,
      unread: 0
    }));

    // Combinar y eliminar duplicados por conversacionId
    const allConversations = [...formattedPrivateChats, ...formattedGroupChats];
    return allConversations.reduce((acc, current) => {
      const exists = acc.find(item => item.conversacionId === current.conversacionId);
      if (!exists) acc.push(current);
      return acc;
    }, []);
  };

  // Cargar lista de usuarios al iniciar
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await conversationService.listUsuarios();
        const usuarios = response?.data ?? response;
        if (Array.isArray(usuarios)) {
          setAllUsers(usuarios);
        }
      } catch {
        // Error silencioso
      }
    };
    loadUsers();
  }, []);

  // Cargar conversaciones existentes (privadas y grupales)
  useEffect(() => {
    const loadConversations = async () => {
      if (!currentUser?.id) return;

      try {
        const [privateResponse, groupResponse] = await Promise.all([
          conversationService.getListChatPrivado(currentUser.id),
          conversationService.getListChatGrupal(currentUser.id)
        ]);

        const privateChats = (privateResponse?.data ?? privateResponse) || [];
        const groupChats = (groupResponse?.data ?? groupResponse) || [];
        const uniqueConversations = formatConversations(privateChats, groupChats);

        setChats(uniqueConversations);
      } catch {
        // Error silencioso
      }
    };

    loadConversations();
  }, [currentUser?.id]);

  const [selectedChat, setSelectedChat] = useState(null);

  // Función para refrescar las conversaciones después de modificar participantes
  const refreshConversations = async () => {
    if (!currentUser?.id) return;

    try {
      const [privateResponse, groupResponse] = await Promise.all([
        conversationService.getListChatPrivado(currentUser.id),
        conversationService.getListChatGrupal(currentUser.id)
      ]);

      const privateChats = (privateResponse?.data ?? privateResponse) || [];
      const groupChats = (groupResponse?.data ?? groupResponse) || [];
      const uniqueConversations = formatConversations(privateChats, groupChats);

      setChats(uniqueConversations);

      // Actualizar el chat seleccionado con los nuevos datos
      if (selectedChat) {
        const updatedChat = uniqueConversations.find(c => c.conversacionId === selectedChat.conversacionId);
        if (updatedChat) {
          setSelectedChat(updatedChat);
        }
      }
    } catch {
      // Error silencioso
    }
  };

  const handleSelect = (c) => {
    if (c && c.action === 'create') {
      setShowGroupModal(true);
      return;
    }
    
    // Si es un chat nuevo (no está en la lista), agregarlo
    if (c && c.conversacionId) {
      const exists = chats.find(chat => chat.conversacionId === c.conversacionId);
      if (!exists) {
        const newChat = {
          id: c.conversacionId || c.id,
          conversacionId: c.conversacionId || c.id,
          titulo: c.titulo || c.nombre,
          nombre: c.nombre || c.titulo,
          isGroup: c.isGroup || false,
          participante: c.participante,
          participantes: c.participantes,
          lastMessage: c.lastMessage || null,
          unread: 0
        };
        setChats((prev) => [newChat, ...(prev || [])]);
      }
    }
    
    // Seleccionar chat para mostrar en la ventana central
    setSelectedChat(c);
  };

  // Función para actualizar el último mensaje de un chat
  const handleMessageSent = (conversacionId, newMessage) => {
    setChats((prevChats) => {
      return prevChats.map(chat => {
        if (chat.conversacionId === conversacionId) {
          return {
            ...chat,
            lastMessage: {
              contenido: newMessage.contenido,
              creadoEn: newMessage.creadoEn || new Date().toISOString(),
              remitente: newMessage.remitente
            }
          };
        }
        return chat;
      });
    });
  };

  const handleCreateGroup = async ({ titulo, integrantes }) => {
    try {
      const response = await conversationService.createConversacionGrupal({
        participantes: integrantes,
        titulo
      });
      const newGroup = response?.data ?? response;
      
      // Cargar los participantes del grupo recién creado
      let participantes = newGroup.participantes || [];
      if (newGroup.id && participantes.length === 0) {
        try {
          const participantesResponse = await conversationService.listarParticipantes(newGroup.id);
          participantes = (participantesResponse?.data ?? participantesResponse) || [];
        } catch {
          // Error silencioso
        }
      }
      
      const groupChat = {
        ...newGroup,
        id: newGroup.id,
        conversacionId: newGroup.id,
        isGroup: true,
        tipo: 'grupal',
        participantes: participantes,
        unread: 0,
        lastMessage: newGroup.mensajes?.[newGroup.mensajes.length - 1] || { contenido: '', creadoEn: Date.now() }
      };
      
      setChats((prev) => [groupChat, ...(prev || [])]);
      setSelectedChat(groupChat);
      setShowGroupModal(false);
    } catch {
      alert('No se pudo crear el grupo. Intenta de nuevo.');
    }
  };

  return (
    <div
      className="h-screen min-h-screen flex flex-col md:flex-row"
      style={{
        // Degradado diagonal entre color primario y secundario del theme
        background: `linear-gradient(75deg, ${theme?.colors?.primary || '#547792'} 0%, ${theme?.colors?.secondary || '#ECEFCA'} 100%)`
      }}
    >
      {/* Left: Sidebar */}
      {/* Left: Sidebar (visible on md+) */}
      <aside className="hidden md:flex md:flex-col md:w-80 lg:w-96 md:min-w-[16rem] bg-transparent">
          <div className="h-full w-full p-2">
          <Sidebar 
            currentUser={currentUser} 
            chats={chats} 
            selectedChatId={selectedChat?.id ?? null} 
            onSelect={handleSelect}
            allUsers={allUsers}
          />
        </div>
      </aside>

      {/* Center: Chat (flexible) */}
      <main className="flex-1 min-w-0">
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-auto">
            <Chat selectedChat={selectedChat} onMessageSent={handleMessageSent} />
          </div>
        </div>
      </main>

      {/* Right: User info (visible on md+) */}
      <aside className="hidden md:flex md:flex-col md:w-64 lg:w-80 xl:w-96 md:min-w-[16rem] bg-transparent">
        <div className="h-full w-full p-4 flex items-center">
          <UserInfo 
            user={currentUser} 
            selectedChat={selectedChat} 
            currentUserId={currentUser?.id}
            allUsers={allUsers}
            onParticipantsUpdate={refreshConversations}
          />
        </div>
      </aside>
      <GroupCreateModal
        isOpen={showGroupModal}
        onClose={() => setShowGroupModal(false)}
        onCreate={handleCreateGroup}
        users={allUsers}
        currentUser={currentUser}
      />
    </div>
  );
};

export default VentanaChat;
