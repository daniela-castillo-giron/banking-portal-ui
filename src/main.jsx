import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import { LoaderProvider } from './services/loaderModalService.jsx';
import store from './store/store';
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <LoaderProvider>
        <App />
      </LoaderProvider>
    </Provider>
  </StrictMode>,
)
