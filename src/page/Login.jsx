
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../api/services/auth.api";
import { firebaseAuthService } from "../api/services/firebase.api";
import { Button } from '../components/button/Button';
import { IconButton } from "../components/button/IconButton";
import { Eye, EyeOff } from "lucide-react";
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
     <div className="hidden md:flex flex-col items-center rounded-card justify-center bg-transparent h-170">
      <div className="w-full h-full bg-transparent shadow rounded-lg p-6">
      <h1 className="text-5xl size my-18  font-semibold mb-4 text-center">Iniciar sesión</h1>

        <button
          onClick={handleGoogleLogin}
          className="w-170 py-2 mb-10 my-10 rounded border border-gray-400 bg-grey-100 text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-100 transition mx-auto"
          disabled={loading}
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5 " />
          Iniciar con Google
        </button>

        <div className="text-center text-sm text-gray-500 mb-4">o con correo</div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 my-4 py-2 rounded-inputMedium font-sans text-base border-2 transition-colors pr-12"

            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            className="w-full px-3 my-4 py-2 rounded-inputMedium font-sans text-base border-2 transition-colors pr-12"
            required
          />
          
          <button
            type="submit"
            variant="primary"
            size="medium"
            disabled={loading}
            className="w-[280px] py-2 my-8 bg-[#547792] text-white font-bold rounded-full mx-auto block"
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

