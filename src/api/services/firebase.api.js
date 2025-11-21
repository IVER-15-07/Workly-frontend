import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebaseConfig.jsx';

const TIMEOUT_MS = 20000;

function withTimeout(promise, ms = TIMEOUT_MS) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("tiempo agotado")), ms)
  );
  return Promise.race([promise, timeout]);
}

export const firebaseAuthService = {

  async loginWithGoogle() {
    try {
      const result = await withTimeout(signInWithPopup(auth, googleProvider));
      const usuario = result.user;
      const idToken = await usuario.getIdToken();

      return {
        success: true,
        data: {
          idToken,
          uid: usuario.uid,
          email: usuario.email,
          displayName: usuario.displayName,
          photoURL: usuario.photoURL
        }
      };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  // Cerrar sesión
  async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw new Error('Error al cerrar sesión de Firebase');
    }
  },

  // Obtener usuario actual
  getCurrentUser() {
    return auth.currentUser;
  },

  //  Saber si está autenticado
  isAuthenticated() {
    return !!auth.currentUser;
  },

  //  Mensajes de error personalizados
  getErrorMessage(errorCode) {
    const errorMessages = {
      'auth/popup-closed-by-user': 'Ventana cerrada por el usuario',
      'auth/popup-blocked': 'Popup bloqueado por el navegador',
      'auth/cancelled-popup-request': 'Solicitud de popup cancelada',
      'auth/account-exists-with-different-credential': 'Ya existe una cuenta con este email',
      'auth/user-cancelled': 'Usuario canceló la operación',
      'auth/network-request-failed': 'Error de conexión de red',
      'auth/too-many-requests': 'Demasiados intentos, intenta más tarde'
    };

    return errorMessages[errorCode] || 'Error de autenticación con Google';
  }
};
