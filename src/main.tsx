import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './_lib/redux/store.ts'
import { AuthProvider } from './_components/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
          <App />
      </AuthProvider>
    </Provider>
  </StrictMode>

)
