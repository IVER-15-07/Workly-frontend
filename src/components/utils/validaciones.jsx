

export const validaciones = {
  nombre: (valor) => {
    if (!valor.trim()) return "El nombre es requerido";
    if (valor.length < 2) return "Mínimo 2 caracteres";
    if (valor.length > 50) return "Máximo 50 caracteres";
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor))
      return "Solo letras permitidas";
    return null;
  },

  email: (valor) => {
    if (!valor.trim()) return "El correo es requerido";
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(valor)) return "Correo inválido";
    return null;
  },

  contrasena: (valor) => {
    if (!valor) return "La contraseña es requerida";
    if (valor.length < 8) return "Mínimo 8 caracteres";
    if (!/[A-Z]/.test(valor)) return "Debe tener mayúscula";
    if (!/[0-9]/.test(valor)) return "Debe tener número";
    if (!/[!@#$%^&*]/.test(valor)) return "Debe tener carácter especial (!@#$%^&*)";
    return null;
  },

  confirmarContrasena: (contrasena, confirmar) => {
    if (!confirmar) return "Confirma la contraseña";
    if (contrasena !== confirmar) return "Las contraseñas no coinciden";
    return null;
  },
};

export default validaciones;