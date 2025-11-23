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

  // Cargar lista de usuarios al iniciar
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await conversationService.listUsuarios();
        const usuarios = response?.data ?? response;
        if (Array.isArray(usuarios)) {
          setAllUsers(usuarios);
        }
      } catch (error) {
        console.error('Error loading users:', error);
      }
    };
    loadUsers();
  }, []);

  // Cargar conversaciones existentes (privadas y grupales)
  useEffect(() => {
    const loadConversations = async () => {
      if (!currentUser?.id) return;

      try {
        // Cargar chats privados y grupales en paralelo
        const [privateResponse, groupResponse] = await Promise.all([
          conversationService.getListChatPrivado(currentUser.id),
          conversationService.getListChatGrupal(currentUser.id)
        ]);

        const privateChats = (privateResponse?.data ?? privateResponse) || [];
        const groupChats = (groupResponse?.data ?? groupResponse) || [];

        console.log('📦 Private chats del backend:', privateChats);
        console.log('📦 Group chats del backend:', groupChats);

        // Filtrar solo chats que tienen mensajes
        const privateChatsWithMessages = privateChats.filter(chat => chat.ultimoMensaje);

        // Formatear y agrupar chats privados por participante
        // Solo mostrar la conversación más reciente con cada persona
        const privateChatsMap = new Map();
        
        privateChatsWithMessages.forEach(chat => {
          const participantId = chat.participante?.id;
          if (!participantId) return;
          
          // Si no existe o esta conversación es más reciente, actualizar
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

        // Formatear grupos
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
        
        // Eliminar duplicados
        const uniqueConversations = allConversations.reduce((acc, current) => {
          const exists = acc.find(item => item.conversacionId === current.conversacionId);
          if (!exists) {
            acc.push(current);
          }
          return acc;
        }, []);

        setChats(uniqueConversations);
        
        console.log('✅ Conversaciones únicas cargadas:', uniqueConversations.length);
        console.log('📋 Conversaciones:', uniqueConversations);
      } catch (error) {
        console.error('Error loading conversations:', error);
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

      // Filtrar solo chats que tienen mensajes
      const privateChatsWithMessages = privateChats.filter(chat => chat.ultimoMensaje);

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

      const allConversations = [...formattedPrivateChats, ...formattedGroupChats];
      const uniqueConversations = allConversations.reduce((acc, current) => {
        const exists = acc.find(item => item.conversacionId === current.conversacionId);
        if (!exists) {
          acc.push(current);
        }
        return acc;
      }, []);

      setChats(uniqueConversations);

      // Actualizar el chat seleccionado con los nuevos datos
      if (selectedChat) {
        const updatedChat = uniqueConversations.find(c => c.conversacionId === selectedChat.conversacionId);
        if (updatedChat) {
          setSelectedChat(updatedChat);
        }
      }
    } catch (error) {
      console.error('Error refreshing conversations:', error);
    }
  };

  const handleSelect = (c) => {
    if (c && c.action === 'create') {
      setShowGroupModal(true);
      return;
    }
    // seleccionar chat para mostrar en la ventana central
    setSelectedChat(c);
  };

  const handleNewChat = () => {
    console.log('new chat');
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
        } catch (err) {
          console.warn('No se pudieron cargar participantes del grupo nuevo:', err);
        }
      }
      
      // Add isGroup flag if not present
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
      
      console.log('✅ Grupo creado con', participantes.length, 'participantes');
    } catch (error) {
      console.error('Error creating group:', error);
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
            onNewChat={handleNewChat}
            allUsers={allUsers}
          />
        </div>
      </aside>

      {/* Center: Chat (flexible) */}
      <main className="flex-1 min-w-0">
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-auto">
            <Chat selectedChat={selectedChat} />
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
