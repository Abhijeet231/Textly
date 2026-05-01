import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {ToastContainer, Zoom} from "react-toastify"
import { RouterProvider } from 'react-router-dom'
import router from './routes/AppRouter.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />

<RouterProvider router={router}/>
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
  </StrictMode>,
)
