import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Provider } from './components/ui/provider.jsx'
import { AuthProvider } from './contexts/AuthProvider.jsx'
import { Toaster } from './components/ui/toaster.jsx'
import './index.css'

async function enableMocking () {
  if (import.meta.env.VITE_ENABLE_MOCKING !== 'true') {
    return
  }

  const { worker } = await import('./mocks/browser')

  return worker.start()
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <Provider>
        <AuthProvider>
          <App/>
          <Toaster/>
        </AuthProvider>
      </Provider>
    </StrictMode>
  )
})