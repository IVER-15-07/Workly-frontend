import { useMemo, useState } from 'react';
import GroupSection from './sidebar/GroupSection';
import DirectSection from './sidebar/DirectSection';

const Sidebar = ({ chats = [], selectedChatId = null, onSelect = () => { }}) => {
  const [query] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return chats;
    return chats.filter((c) => {
      const title = (c.titulo || c.nombre || '').toString().toLowerCase();
      const last = (c.lastMessage?.contenido || '').toString().toLowerCase();
      return title.includes(q) || last.includes(q);
    });
  }, [chats, query]);

  const groups = filtered.filter((c) => c.isGroup);
  const directs = filtered.filter((c) => !c.isGroup);

  return (
    <aside className="w-full h-full bg-white flex flex-col">
      
      {/* Sections */}
      <GroupSection groups={groups} onSelect={onSelect} selectedChatId={selectedChatId} />
      <DirectSection directs={directs} onSelect={onSelect} selectedChatId={selectedChatId} />
    </aside>
  );
};

export default Sidebar;
