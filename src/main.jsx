
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import theme from './theme'

createRoot(document.getElementById('root')).render(

  <BrowserRouter>
    <ThemeProvider theme={theme}>
    <App />
    </ThemeProvider>
  </BrowserRouter>

)
