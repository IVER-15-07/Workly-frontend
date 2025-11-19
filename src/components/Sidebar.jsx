import { useMemo, useState } from "react";

const Sidebar = ({
  currentUser = { id: 1, nombre: "Usuario", avatarUrl: null },
  chats = [],
  selectedChatId = null,
  onSelect = () => {},
  onNewChat = () => {},
}) => {

    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return chats;
        return chats.filter((c) => {
            const title = (c.titulo || c.nombre || "").toString().toLowerCase();
            const last = (c.lastMessage?.contenido || "").toString().toLowerCase();
            return title.includes(q) || last.includes(q);
        });
    }, [chats, query]);

    function fmtTime(ts) {
        if (!ts) return "";
        try {
            return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        } catch {
            return "";
        }
    }
    return (
        <aside className="w-80 min-w-[18rem] h-screen border-r bg-white flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-md bg-gray-200 flex items-center justify-center overflow-hidden">
                        {currentUser.avatarUrl ? (
                            <img src={currentUser.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-gray-700 font-semibold">{(currentUser.nombre || "U").slice(0, 1).toUpperCase()}</span>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-sm text-gray-800">{currentUser.nombre || "Sin nombre"}</span>
                        <span className="text-xs text-gray-500">En línea</span>
                    </div>
                </div>

                <button
                    onClick={onNewChat}
                    aria-label="Nuevo chat"
                    className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800"
                >
                    +
                </button>
            </div>

            {/* Search */}
            <div className="px-4 pb-3">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar o empezar chat"
                    className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
                />
            </div>

            {/* Chats list */}
            <div className="flex-1 overflow-y-auto">
                {filtered.length === 0 ? (
                    <div className="p-6 text-center text-sm text-gray-500">No hay chats. Crea uno nuevo.</div>
                ) : (
                    filtered.map((c) => {
                        const title = c.titulo || c.nombre || `Chat ${c.id}`;
                        const last = c.lastMessage?.contenido ?? "";
                        const time = fmtTime(c.lastMessage?.creadoEn);
                        const selected = c.id === selectedChatId;
                        return (
                            <button
                                key={c.id}
                                onClick={() => onSelect(c)}
                                className={`w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-gray-50 ${selected ? "bg-gray-100" : ""
                                    }`}
                            >
                                <div className="w-12 h-12 rounded-md bg-gray-200 flex items-center justify-center overflow-hidden">
                                    {c.avatarUrl ? (
                                        <img src={c.avatarUrl} alt="a" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-gray-700 font-medium">{String(title).slice(0, 1).toUpperCase()}</span>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm font-medium text-gray-800 truncate">{title}</div>
                                        <div className="text-xs text-gray-400 ml-2">{time}</div>
                                    </div>
                                    <div className="text-xs text-gray-500 truncate mt-1">{last}</div>
                                </div>
                            </button>
                        );
                    })
                )}
            </div>
        </aside>
    )
}

export default Sidebar
