import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../api/services/auth.api";
import { validaciones } from "../components/utils/validaciones";
import { IconButton } from "../components/button/IconButton";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../components/button/Button";

const Registro = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        contrasena: "",
        confirmarContrasena: "",
    });

    const [visibility, setVisibility] = useState({
        contrasena: false,
        confirmarContrasena: false,
    });

    const [errores, setErrores] = useState({});
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);

    const validarCampo = (campo, valor) => {
        let error = null;

        if (campo === "confirmarContrasena") {
            error = validaciones.confirmarContrasena(formData.contrasena, valor);
        } else {
            error = validaciones[campo]?.(valor);
        }

        setErrores((prev) => ({ ...prev, [campo]: error }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        validarCampo(name, value);
    };

    const validarFormulario = () => {
        const nuevosErrores = {
            nombre: validaciones.nombre(formData.nombre),
            email: validaciones.email(formData.email),
            contrasena: validaciones.contrasena(formData.contrasena),
            confirmarContrasena: validaciones.confirmarContrasena(
                formData.contrasena,
                formData.confirmarContrasena
            ),
        };

        setErrores(nuevosErrores);
        return Object.values(nuevosErrores).every((error) => error === null);
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!validarFormulario()) {
            setMsg(null);
            return;
        }

        setLoading(true);
        setMsg(null);

        try {
            await authService.register({
                nombre: formData.nombre,
                email: formData.email,
                contrasena: formData.contrasena,
            });

            setMsg({ tipo: "exito", texto: "Registro exitoso. Redirigiendo..." });
            setTimeout(() => navigate("/"), 1000);
        } catch (err) {
            setMsg({
                tipo: "error",
                texto: err.message || "Error al registrar usuario",
            });
        } finally {
            setLoading(false);
        }
    };

    const esValido =
        Object.values(formData).every((v) => v.trim()) &&
        Object.values(errores).every((e) => e === null);
    return (
        <div className="w-full max-w mb-8 mt-10">
            {/* Título */}
            <h1 className="text-display-md text-black mb-8 text-center font-sans">
                Crear cuenta
            </h1>
            <form onSubmit={handleRegister} className="space-y-6">
                <div>
                    <label className="block text-text-medium font-semibold text-black mb-2">
                        Nombre
                    </label>
                    <input
                        type="text"
                        name="nombre"
                        placeholder="Nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        onBlur={(e) => validarCampo("nombre", e.target.value)}
                        className={`w-full px-4 py-2 rounded-inputMedium font-sans text-base border-1 transition-colors ${errores.nombre
                            ? "border-error bg-red-50"
                            : "border-neutral-1 bg-card focus:border-primary"
                            } focus:outline-none`}
                    />
                    {errores.nombre && (
                        <p className="mt-1 text-text-small font-semibold text-error">
                            {errores.nombre}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-text-medium font-semibold text-black mb-2">
                        Correo electrónico
                    </label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Correo"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={(e) => validarCampo("email", e.target.value)}
                        className={`w-full px-4 py-2 rounded-inputMedium font-sans text-base border-2 transition-colors ${errores.email
                            ? "border-error bg-red-50"
                            : "border-neutral-1 bg-card focus:border-primary"
                            } focus:outline-none`}
                    />
                    {errores.email && (
                        <p className="mt-1 text-text-small font-semibold text-error">
                            {errores.email}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-text-medium font-semibold text-black mb-2">
                        Contraseña
                    </label>
                    <div className="relative">
                        <input
                            type={visibility.contrasena ? "text" : "password"}
                            name="contrasena"
                            placeholder="Contraseña"
                            value={formData.contrasena}
                            onChange={handleChange}
                            onBlur={(e) => validarCampo("contrasena", e.target.value)}
                            className={`w-full px-4 py-2 rounded-inputMedium font-sans text-base border-2 transition-colors pr-12 ${errores.contrasena
                                ? "border-error bg-red-50"
                                : "border-neutral-1 bg-card focus:border-primary"
                                } focus:outline-none`}
                        />
                        <IconButton
                            icon={visibility.contrasena ? <EyeOff size={20} /> : <Eye size={20} />}
                            variant="ghost"
                            onClick={() => setVisibility(prev => ({ ...prev, contrasena: !prev.contrasena }))}
                            className="absolute right-4 top-1/2 -translate-y-1/2"
                        />
                    </div>
                    {errores.contrasena && (
                        <p className="mt-1 text-text-small font-semibold text-error">
                            {errores.contrasena}
                        </p>
                    )}
                </div>

                {/* Campo Confirmar Contraseña */}
                <div>
                    <label className="block text-text-medium font-semibold text-black mb-2">
                        Confirmar contraseña
                    </label>
                    <div className="relative">
                        <input
                            type={visibility.confirmarContrasena ? "text" : "password"}
                            name="confirmarContrasena"
                            placeholder="Confirmar contraseña"
                            value={formData.confirmarContrasena}
                            onChange={handleChange}
                            onBlur={(e) =>
                                validarCampo("confirmarContrasena", e.target.value)
                            }
                            className={`w-full px-4 py-2 rounded-inputMedium font-sans text-base border-2 transition-colors pr-12 ${errores.confirmarContrasena
                                ? "border-error bg-red-50"
                                : "border-neutral-1 bg-card focus:border-primary"
                                } focus:outline-none`}
                        />
                        <IconButton
                            icon={visibility.contrasena ? <EyeOff size={20} /> : <Eye size={20} />}
                            variant="ghost"
                            onClick={() => setVisibility(prev => ({ ...prev, contrasena: !prev.contrasena }))}
                            className="absolute right-4 top-1/2 -translate-y-1/2"
                        />
                    </div>
                    {errores.confirmarContrasena && (
                        <p className="mt-1 text-text-small font-semibold text-error">
                            {errores.confirmarContrasena}
                        </p>
                    )}
                </div>
                <div className="justify-center flex ">
                    <Button type="submit" variant="primary" size="medium" disabled={loading || !esValido}
                    className="mx-auto block w-[300px] p-1" >
                        {loading ? "Creando..." : "Crear Cuenta"}
                    </Button>
                </div>

            </form>

            {msg && (
                <div
                    className={`mt-6 p-4 rounded-input text-text-small font-semibold ${msg.tipo === "error"
                        ? "bg-red-50 text-error border border-error"
                        : "bg-green-50 text-primary border border-primary"
                        }`}
                >
                    {msg.texto}
                </div>
            )}
        </div>
    )
}

export default Registro
