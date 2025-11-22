
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../api/services/auth.api";
import { firebaseAuthService } from "../api/services/firebase.api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();


  const handleGoogleLogin = async () => {
    setLoading(true);
    setMsg(null);

    try {
      const firebaseResult = await firebaseAuthService.loginWithGoogle();

      if (!firebaseResult.success) {
        setMsg(firebaseResult.message || "Error con Google");
        return;
      }

      // Lo que Firebase devuelve
      const { idToken } = firebaseResult.data;

      // Enviar al backend
      const response = await authService.firebaseLogin({
        idToken,
        // Si necesitas asignar rol fijo, defínelo:
        roleId: 5, // por ejemplo usuario normal
      });

      if (response.success) {
        const usuario = response.data.usuario;

        // Guardar si deseas
        if (response.data.token) {
          localStorage.setItem("userToken", response.data.token);
        }
        localStorage.setItem("user", JSON.stringify(usuario));

        // Redirección simple
        navigate("/chat");
      }
    } catch (err) {
      setMsg(err?.message || "Error con Google");
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const res = await authService.login({ email, contrasena });

      const data = res?.data ?? res;
      const token = data?.data?.token;
      const usuario = data?.data?.usuario;

      if (token) localStorage.setItem("userToken", token);
      if (usuario) localStorage.setItem("user", JSON.stringify(usuario));

      setMsg("Inicio de sesión correcto");

      setTimeout(() => navigate("/chat"), 400);
    } catch (err) {
      setMsg(err?.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white shadow rounded-lg p-6 ">
        <h1 className="text-2xl font-semibold mb-4">Iniciar sesión</h1>


        <button
          onClick={handleGoogleLogin}
          className="w-full py-2 mb-4 rounded border border-gray-200 bg-white text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-100 transition"
          disabled={loading}
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" />
          Iniciar con Google
        </button>

        <div className="text-center text-sm text-gray-400 mb-4">o con correo</div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-gray-800 text-white rounded"
          >
            {loading ? "Cargando..." : "Entrar"}
          </button>
        </form>

        {msg && <div className="mt-4 text-sm text-red-600">{msg}</div>}

        <div className="mt-6 text-center text-sm text-gray-500">
          ¿No tienes cuenta? Ve a registro.
        </div>
      </div>
    </div>
  );
};

export default Login;

