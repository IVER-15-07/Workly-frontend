const UserInfo = ({ user = { nombre: 'Usuario_123', email: 'usuario@gmail.com', avatarUrl: null } }) => {
  return (
    <div className="w-full max-w-xs text-center">
      <div className="w-40 h-40 rounded-full overflow-hidden mx-auto bg-white mb-4">
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-gray-600">{(user.nombre || 'U').slice(0, 1)}</div>
        )}
      </div>

      <h3 className="text-lg font-semibold">{user.nombre}</h3>
      <p className="text-sm text-gray-500 mb-6">{user.email}</p>

      <div className="mt-auto w-full">
        <button type="button" className="w-full py-2 bg-gray-800 text-white rounded-full">Cerrar Sesión</button>
      </div>
    </div>
  );
};

export default UserInfo;
