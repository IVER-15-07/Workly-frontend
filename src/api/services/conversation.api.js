
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
    },

    async agregarParticipanteAGrupo(conversacionId, usuarioId) {
        try {
            const response = await axiosInstance.post(`/api/chat/conversacion/${conversacionId}/participante/${usuarioId}`);
            return response.data;
        } catch (error) {
            console.error("Error adding participant to group:", error);
            throw error;
        }
    },

    async eliminarParticipanteDeGrupo(conversacionId, usuarioId) {
        try {
            const response = await axiosInstance.delete(`/api/chat/conversacion/${conversacionId}/participante/${usuarioId}`);
            return response.data;
        } catch (error) {
            console.error("Error removing participant from group:", error);
            throw error;
        }
    },

    async listarParticipantes(conversacionId) {
        try {
            const response = await axiosInstance.get(`/api/chat/conversacion/${conversacionId}/participantes`);
            return response.data;
        } catch (error) {
            console.error("Error listing participants:", error);
            throw error;
        }
    },
};