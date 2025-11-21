
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDaclMBudjiXZb6GrA2jQG84vRZ6dRgK54",
  authDomain: "sis-colab.firebaseapp.com",
  projectId: "sis-colab",
  storageBucket: "sis-colab.firebasestorage.app",
  messagingSenderId: "121339306314",
  appId: "1:121339306314:web:8236c055fd363edea061b3",
  measurementId: "G-NLTMWP2WMQ"
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
  console.log("Firebase cliente inicializado");
} else {
  console.log("Firebase cliente ya inicializado");
}

export const auth = getAuth();

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export default firebaseConfig;