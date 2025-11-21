
import { useState } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import Chat from '../page/Chat.jsx';
import UserInfo from '../components/UserInfo.jsx';

const VentanaChat = () => {
  const [chats] = useState([]);
  const [currentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || { id: 1, nombre: 'Usuario_123', email: 'usuario@gmail.com' };
    } catch {
      return { id: 1, nombre: 'Usuario_123', email: 'usuario@gmail.com' };
    }
  });

  const handleSelect = (c) => {
    // placeholder: integrar con router / estado
    console.log('select chat', c);
  };

  const handleNewChat = () => {
    console.log('new chat');
  };

  return (
    <div className="h-screen min-h-screen flex bg-gray-50">
      {/* Left: Sidebar */}
      <aside className="w-96 min-w-[20rem] border-r bg-white hidden sm:flex flex-col">
        <Sidebar currentUser={currentUser} chats={chats} selectedChatId={null} onSelect={handleSelect} onNewChat={handleNewChat} />
      </aside>

      {/* Center: Chat */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 overflow-auto">
          <Chat />
        </div>
      </main>

      {/* Right: User info (hidden on small screens) */}
      <aside className="w-96 min-w-[20rem] border-l bg-gray-100 p-6 hidden lg:flex flex-col items-center">
        <UserInfo user={currentUser} />
      </aside>
    </div>
  );
};

export default VentanaChat;
