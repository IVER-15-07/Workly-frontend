import TextButton from './button/TextButton';
import typography from '../theme/typography';

const UserInfo = ({ user = { nombre: 'Usuario_123', email: 'usuario@gmail.com', avatarUrl: null }, onLogout }) => {
  return (
    <div className="w-full h-screen flex flex-col">
      {/* Encabezado */}
      <div className="pt-6 pb-4">
        <p style = {typography.text.large} className="text-xl font-semibold text-gray-800 text-center">INFORMACIÓN DEL USUARIO</p>
      </div>
      
      {/* Contenido principal */}
      <div className="flex-1 flex flex-col items-center justify-start pt-4">
        <div className="w-55 h-55 rounded-full overflow-hidden bg-white mb-4">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="avatar" className="w-40 h-40 object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl text-gray-600">
              {(user.nombre || 'U').slice(0, 1)}
            </div>
          )}
        </div>

        <h3 style = {typography.text.large} className="text-xl font-semibold text-gray-800 mb-1">{user.nombre}</h3>
        <p style = {typography.text.medium} className="text-sm text-gray-500">{user.email}</p>
      </div>

      {/* Botón en la parte inferior */}
      <div className="w-full flex justify-center pb-8">
        <TextButton
          text="Cerrar Sesión"
          bgColor="#1f2937"
          textColor="#ffffff"
          shape="9999px"
          onClick={onLogout}
          style={typography.button.boldMedium}
        />
      </div>
    </div>
  );
};

export default UserInfo;