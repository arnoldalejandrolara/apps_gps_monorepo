import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './store/index'
import { FullScreenProvider } from './hooks/useFullScreen.jsx'
import { MapaWebProvider } from './context/MapViewContext';

import { configureApi } from '@mi-monorepo/common/services';


configureApi(import.meta.env.VITE_API_URL);

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <BrowserRouter>
      <FullScreenProvider>
        <MapaWebProvider>
        <App />
        </MapaWebProvider>
      </FullScreenProvider>
      </BrowserRouter>
    </Provider>
  
)
