import { useState } from "react";
import Login from "../page/Login.jsx";
import Registro from "../page/Registro.jsx";
import { Button } from '../components/button/Button';
import logo from "../assets/logo.png";

const Home = () => {
     const [mode, setMode] = useState("login"); // "login" | "register"
  return (
    <div className="flex items-center justify-center p-4 bg-gradient-to-r from-primary to-secondary">
      <div className="w-full shadow items-center overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Lado informativo */}
        <div className="hidden md:flex flex-col items-center rounded-card justify-center  bg-card h-170">
          <img src={logo} alt="Workly Logo" className="w-80 h-80 " />
          <h2 className="text-display-xl font-bold text-neutral-2">Workly</h2>
          <div className="m-1 mt-12 flex gap-4">
            <Button
              variant={mode === 'login' ? 'primary' : 'ghost'}
              size="medium"
              onClick={() => setMode('login')}
              className={mode === 'login' ? '' : 'border-2 border-primary'}
              borderRadius="rounded-none"
            >
              Iniciar sesión
            </Button>
            <Button
              variant={mode === 'register' ? 'primary' : 'ghost'}
              size="medium"
              onClick={() => setMode('register')}
              className={mode === 'register' ? '' : 'border-2 border-primary'}
              borderRadius="rounded-none"
              opacity="47"
              hoverBg="hover:bg-neutral-1"
              hoverText="hover:text-primary"
            >
              Registrarse
            </Button>
          </div>
        </div>

        {/* Lado forms */}
        <div className="p-8">
          {/* Botones móvil */}
          <div className="flex gap-3 mb-6 md:hidden">
            <Button
              variant={mode === 'login' ? 'primary' : 'secondary'}
              size="medium"
              onClick={() => setMode('login')}
              className="flex-1"
            >
              Iniciar sesión
            </Button>
            <Button
              variant={mode === 'register' ? 'primary' : 'secondary'}
              size="medium"
              onClick={() => setMode('register')}
              className="flex-1"
              borderRadius="rounded-none"
            >
              Registrarse
            </Button>
          </div>

          {/* Contenido dinámico */}
          <div className="items-center p-6 justify-center">
            {mode === 'login' ? <Login /> : <Registro />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
