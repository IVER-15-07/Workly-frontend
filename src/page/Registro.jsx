import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../api/services/auth.api";

const Registro = () => {

    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);
    const navigate = useNavigate();

    async function handleRegister(e) {
        e.preventDefault();
        setLoading(true);
        setMsg(null);
        try {
            const nuevo = await authService.register({ nombre, email, contrasena });
            setMsg("Registro exitoso.");
            setTimeout(() => navigate("/"), 1000); // redirige al login
            return nuevo;
        } catch (err) {
            setMsg(err.message || "Error al registrar usuario");
            return null;
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Crear cuenta</h2>

                <form onSubmit={handleRegister} className="space-y-3">
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
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
                        className="w-full py-2 bg-green-600 text-white rounded"
                    >
                        {loading ? "Creando..." : "Crear cuenta"}
                    </button>
                </form>

                {msg && <div className="mt-4 text-sm text-red-600">{msg}</div>}

                <div className="mt-4 text-sm text-gray-500">
                    ¿Ya tienes cuenta?{" "}
                    <button className="text-blue-600 underline" onClick={() => navigate("/")}>
                        Inicia sesión
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Registro
