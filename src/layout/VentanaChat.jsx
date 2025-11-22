import { useTheme } from 'styled-components';
import { useState, useMemo } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import Chat from '../page/Chat.jsx';
import UserInfo from '../components/UserInfo.jsx';
import GroupCreateModal from '../components/GroupCreateModal.jsx';

const VentanaChat = () => {
  const theme = useTheme();
  // En entorno de desarrollo, prellenamos algunos chats de ejemplo
  const [chats, setChats] = useState(() => {
    const demo = [
      { id: 1, titulo: 'Proyectos', isGroup: true, unread: 5, lastMessage: { contenido: 'Revisar PR', creadoEn: Date.now() - 1000 * 60 * 60 } },
      { id: 2, titulo: 'Cafe de la tarde', isGroup: true, unread: 0, lastMessage: { contenido: 'Quedamos a las 16', creadoEn: Date.now() - 1000 * 60 * 30 } },
      { id: 3, titulo: 'Proyectos sin el jefe', isGroup: true, unread: 5, lastMessage: { contenido: 'Planificar sprint', creadoEn: Date.now() - 1000 * 60 * 60 * 24 } },
      // Direct messages
      { id: 101, nombre: 'Maria la del Barrio', isGroup: false, unread: 5, lastMessage: { contenido: '¿Vienes hoy?', creadoEn: Date.now() - 1000 * 60 * 20 }, online: true },
      { id: 102, nombre: 'Lucas Sinclair', isGroup: false, unread: 1, lastMessage: { contenido: 'OK, perfecto', creadoEn: Date.now() - 1000 * 60 * 60 }, online: false },
    ];

    return demo;
  });
  const [currentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || { id: 1, nombre: 'Usuario_123', email: 'usuario@gmail.com' };
    } catch {
      return { id: 1, nombre: 'Usuario_123', email: 'usuario@gmail.com' };
    }
  });

  const [showGroupModal, setShowGroupModal] = useState(false);

  const users = useMemo(() => {
    // derive a simple users list from direct chats plus current user
    const directs = chats.filter((c) => !c.isGroup).map((d) => ({ id: d.id, nombre: d.nombre }));
    const list = [];
    if (currentUser) list.push({ id: currentUser.id, nombre: currentUser.nombre });
    // avoid duplicates
    directs.forEach((u) => {
      if (!list.find((x) => x.id === u.id)) list.push(u);
    });
    return list;
  }, [chats, currentUser]);

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

  const handleCreateGroup = ({ titulo, integrantes }) => {
    const newGroup = {
      id: Date.now(),
      titulo,
      isGroup: true,
      unread: 0,
      integrantes,
      lastMessage: { contenido: '', creadoEn: Date.now() },
    };
    setChats((prev) => [newGroup, ...(prev || [])]);
    setShowGroupModal(false);
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
          <UserInfo user={currentUser} />
        </div>
      </aside>
      <GroupCreateModal
        isOpen={showGroupModal}
        onClose={() => setShowGroupModal(false)}
        onCreate={handleCreateGroup}
        users={users}
        currentUser={currentUser}
      />
    </div>
  );
};

export default VentanaChat;
