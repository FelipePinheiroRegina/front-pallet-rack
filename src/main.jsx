import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from './hooks/auth'
import { Routes } from './routes/index'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <Routes/>
    </AuthProvider>
  </StrictMode>
)
