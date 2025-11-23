import { Routes, Route } from 'react-router-dom'
import Home from './layout/Home.jsx'
import ProtectedRoute from './layout/ProtectedRoute.jsx'
import VentanaChat from './layout/VentanaChat.jsx'
import Login from './page/Login.jsx'
import Registro from './page/Registro.jsx'



function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Home />} />
      <Route
        path="/chat/*"
        element={
          <ProtectedRoute>
            <VentanaChat />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
