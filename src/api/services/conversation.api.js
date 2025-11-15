import axiosInstance from "../../../helpers/axios-config";

export const conversationService = {
    async createOrGetConversation({ userAId, userBId, titulo }) {
        try {
            const response = await axiosInstance.post(`/api/chat/conversations/get-or-create`, {
                userAId,
                userBId,
                titulo
            });
            return response.data;
        } catch (error) {
            console.error("Error creating or getting conversation:", error);
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
};