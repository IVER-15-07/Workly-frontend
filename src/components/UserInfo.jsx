import { Button } from "../components/button/Button";

const UserInfo = ({ user = { nombre: 'Usuario_123', email: 'usuario@gmail.com', avatarUrl: null }, onLogout }) => {
  return (
    <div className="w-full h-screen flex flex-col">
      {/* Encabezado */}
      <div className="pt-6 pb-4">
        <p className="text-text-lg font-semibold text-black text-center">INFORMACIÓN DEL USUARIO</p>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col items-center justify-start pt-4">
        <div className="w-55 h-55 rounded-full overflow-hidden bg-light mb-4">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="avatar" className="w-40 h-40 object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl text-primary">
              {(user.nombre || 'U').slice(0, 1)}
            </div>
          )}
        </div>

        <h3 className="text-text-lg font-semibold text-black mb-1">{user.nombre}</h3>
        <p className="text-text-base text-neutral-2">{user.email}</p>
      </div>

      {/* Botón en la parte inferior */}
      <div className="w-full flex justify-center pb-8">
        <Button
          variant="danger"
          size="medium"
          onClick={onLogout}
          className="rounded-full"
        >Cerrar Sesión
        </Button>
      </div>
    </div>
  );
};

export default UserInfo;