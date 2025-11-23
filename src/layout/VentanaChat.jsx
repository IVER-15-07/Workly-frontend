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

  const [selectedChat, setSelectedChat] = useState(null);

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
      
      // Add isGroup flag if not present
      const groupChat = {
        ...newGroup,
        isGroup: true,
        unread: 0,
        lastMessage: newGroup.mensajes?.[newGroup.mensajes.length - 1] || { contenido: '', creadoEn: Date.now() }
      };
      
      setChats((prev) => [groupChat, ...(prev || [])]);
      setSelectedChat(groupChat);
      setShowGroupModal(false);
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
          <Sidebar currentUser={currentUser} chats={chats} selectedChatId={selectedChat?.id ?? null} onSelect={handleSelect} onNewChat={handleNewChat} />
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
          <UserInfo user={currentUser} selectedChat={selectedChat} currentUserId={currentUser?.id} />
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
