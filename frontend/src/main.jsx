import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import MainContext from './context/MainContext.jsx'
import { ToastContainer } from 'react-toastify'
import { GoogleOAuthProvider } from '@react-oauth/google'

const CLIENT_ID = import.meta.env.VITE_GOOGLEAUTH_CLIENT;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <BrowserRouter>
        <Provider store={store}>
          <MainContext>
            <ToastContainer />
            <App />
          </MainContext>
        </Provider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
)
