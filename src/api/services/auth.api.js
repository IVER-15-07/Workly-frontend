
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

    async firebaseLogin(payload) {
        try {  
            const body = typeof payload === "string" ? { idToken: payload } : (payload || {});
            const { data } = await axiosInstance.post('/api/auth/login-firebase', body);
            if (data?.success) {
                const { token, usuario } = data.data;
                if (token) {
                    localStorage.setItem('userToken', token);
                    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${ token }`;
                }
                if (usuario) localStorage.setItem('user', JSON.stringify(usuario));
            }
            return data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al iniciar sesión con Firebase');
        }
    },
    
    isAuthenticated() {
        return !!localStorage.getItem('userToken');
    },

    logout() {
        localStorage.removeItem('userToken');
        localStorage.removeItem('user');
    },


    // Obtener usuario actual
    obtenerUsuarioActual() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};  