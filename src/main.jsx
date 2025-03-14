import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { LoaderProvider } from './services/loaderModalService.jsx';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoaderProvider>
      <App />
    </LoaderProvider>
  </StrictMode>,
)
