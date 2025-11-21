import axiosInstance from "../../../helpers/axios-config";

export const authService = {
    async register(datosUsuario) {
        try {
            const response = await axiosInstance.post('/api/auth/registro', datosUsuario);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al registrar usuario');
        }
    },

    async login(credenciales) {
        try {
            const response = await axiosInstance.post('/api/auth/login', credenciales);

            if (response.data.success) {
                localStorage.setItem('userToken', response.data.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.data.usuario));
            }

            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
        }
    },

    isAuthenticated() {
        return !!localStorage.getItem('userToken');
    },
};  