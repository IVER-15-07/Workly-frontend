import { useState, useEffect, useCallback } from 'react';
import { conversationService } from '../api/services/conversation.api';

export default function useDirects() {
  const [directs, setDirects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await conversationService.listUsuarios();
      // Backend devuelve { success: true, data: usuarios }
      const users = res?.data ?? res;
      const mapped = (users || []).map((u) => ({
        id: u.id,
        nombre: u.nombre || u.email || `User ${u.id}`,
        avatarUrl: u.propfilePicture || null, // backend usa propfilePicture
        online: false, // backend no tiene campo online
        isGroup: false,
        lastMessage: null,
        email: u.email,
      }));
      setDirects(mapped);
    } catch (err) {
      console.error('Error loading users:', err);
      setError(err);
      setDirects([]); // Mantener array vacío en caso de error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { directs, loading, error, reload: load };
}