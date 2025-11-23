
import axiosInstance from "../../../helpers/axios-config";

export const conversationService = {
    async listUsuarios() {
        try {
            const response = await axiosInstance.get(`/api/chat/usuarios`);
            return response.data;
        } catch (error) {
            console.error("Error listing users:", error);
            throw error;
        }
    },

    async createOrGetConversation({ userAId, userBId, titulo }) {
        try {
            const response = await axiosInstance.post(`/api/chat/conversacion/privada`, {
                participantes: [userAId, userBId],
                titulo
            });
            return response.data;
        } catch (error) {
            console.error("Error creating or getting conversation:", error);
            throw error;
        }
    },

    async createConversacionGrupal({ participantes, titulo }) {
        try {
            const response = await axiosInstance.post(`/api/chat/conversacion/grupal`, {
                participantes,
                titulo
            });
            return response.data;
        } catch (error) {
            console.error("Error creating group conversation:", error);
            throw error;
        }
    },  

    async getMessages(conversationId) {
        try {
            const response = await axiosInstance.get(`/api/chat/conversations/${conversationId}/messages`);
            return response.data;
        } catch (error) {
            console.error("Error getting messages:", error);
            throw error;
        }
    }

    // recupera los chart privados de un usuario mas el ultimo mensaje
    ,async getListChatPrivado(usuarioId) {
        try {
            const response = await axiosInstance.get(`/api/chat/conversaciones/usuario/${usuarioId}`);
            return response.data;
        } catch (error) {
            console.error("Error getting private chats:", error);
            throw error;
        }
    },

    // recupera los chart grupales de un usuario mas el ultimo mensaje 
    async getListChatGrupal(usuarioId) {
        try {
            const response = await axiosInstance.get(`/api/chat/conversaciones/grupo/${usuarioId}`);
            return response.data;
        } catch (error) {
            console.error("Error getting group chats:", error);
            throw error;
        }
    }
};