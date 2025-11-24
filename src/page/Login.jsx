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
  const [showPassword, setShowPassword] = useState(false);
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

      const { idToken } = firebaseResult.data;

      const response = await authService.firebaseLogin({
        idToken,
        roleId: 5,
      });

      if (response.success) {
        const usuario = response.data.usuario;

        if (response.data.token) {
          localStorage.setItem("userToken", response.data.token);
        }
        localStorage.setItem("user", JSON.stringify(usuario));

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
    <div className="w-full max-w-md">
      <h1 className="text-3xl md:text-4xl font-semibold mb-4 text-center text-black">
        Iniciar sesión
      </h1>

      <button
        onClick={handleGoogleLogin}
        className="w-full py-2.5 mb-4 rounded-input border-2 border-neutral-1 bg-light text-black flex items-center justify-center gap-2 hover:bg-card transition font-sans text-text-base"
        disabled={loading}
      >
        <img 
          src="https://www.svgrepo.com/show/475656/google-color.svg" 
          className="w-5 h-5" 
          alt="Google"
        />
        Iniciar con Google
      </button>

      <div className="text-center text-text-sm text-neutral-2 mb-4">
        o con correo
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-text-sm md:text-text-base font-semibold text-black mb-1">
            Correo electrónico
          </label>
          <input
            type="email"
            placeholder="nombre@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded-input font-sans text-text-sm md:text-text-base border-2 border-neutral-1 bg-light focus:border-primary transition-colors focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-text-sm md:text-text-base font-semibold text-black mb-1">
            Contraseña
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="w-full px-3 py-2 rounded-input font-sans text-text-sm md:text-text-base border-2 border-neutral-1 bg-light focus:border-primary transition-colors pr-10 focus:outline-none"
              required
            />
            <IconButton
              icon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              variant="ghost"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary text-light font-bold rounded-full hover:opacity-90 transition font-sans text-text-base"
          >
            {loading ? "Cargando..." : "Entrar"}
          </button>
        </div>
      </form>

      {msg && (
        <div className={`mt-3 p-2 rounded-input text-xs md:text-text-sm font-semibold ${
          msg.includes("correcto") 
            ? "bg-green-50 text-primary border border-primary"
            : "bg-red-50 text-error border border-error"
        }`}>
          {msg}
        </div>
      )}

      <div className="mt-4 text-center text-text-sm text-neutral-2">
        ¿No tienes cuenta? Ve a registro.
      </div>
    </div>
  );
};

export default Login;