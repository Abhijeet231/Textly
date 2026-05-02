import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ToastContainer, Zoom } from "react-toastify"
import { RouterProvider } from 'react-router-dom'
import router from './routes/AppRouter.tsx'
import { AuthContextProvider } from './context/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={2500}
        transition={Zoom}
        closeOnClick
        draggable
        pauseOnHover
        newestOnTop
        hideProgressBar={false}
      />
    </AuthContextProvider>
  </StrictMode>
)