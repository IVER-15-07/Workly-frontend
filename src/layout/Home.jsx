import { useState } from "react";
import Login from "../page/login.jsx";
import Registro from "../page/registro.jsx";


const Home = () => {
     const [mode, setMode] = useState("login"); // "login" | "register"
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-4xl bg-white shadow rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Lado informativo */}
        <div className="hidden md:flex flex-col items-center justify-center p-8 bg-gray-100">
          <h2 className="text-2xl font-bold mb-2">Workly</h2>
          <p className="text-sm text-gray-600 text-center">
            Chat colaborativo. Inicia sesión con Google o con email.
          </p>
          <div className="mt-6 space-x-2">
            <button
              onClick={() => setMode("login")}
              className={`px-4 py-2 rounded ${mode === "login" ? "bg-gray-800 text-white" : "bg-white border"}`}
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => setMode("register")}
              className={`px-4 py-2 rounded ${mode === "register" ? "bg-gray-800 text-white" : "bg-white border"}`}
            >
              Registrarse
            </button>
          </div>
        </div>

        {/* Lado forms */}
        <div className="p-6">
          <div className="flex gap-2 mb-4 md:hidden">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2 rounded ${mode === "login" ? "bg-gray-800 text-white" : "bg-gray-100"}`}
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-2 rounded ${mode === "register" ? "bg-gray-800 text-white" : "bg-gray-100"}`}
            >
              Registrarse
            </button>
          </div>

          {mode === "login" ? <Login /> : <Registro />}
        </div>
      </div>
    </div>
  )
}

export default Home
