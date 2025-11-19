import { Routes, Route } from 'react-router-dom'
import Home from './layout/Home.jsx'
import ProtectedRoute from './layout/ProtectedRoute.jsx'
import VentanaChat from './layout/VentanaChat.jsx'
function App() {


  return (
    <Routes>


      <Route path="/" element={<Home />} />

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
