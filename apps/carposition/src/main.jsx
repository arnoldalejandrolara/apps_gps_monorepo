import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from '@mi-monorepo/common/store';
// import { FullScreenProvider } from './hooks/useFullScreen.jsx'
import { MapViewProvider } from '@mi-monorepo/common/context';
import { configureApi } from '@mi-monorepo/common/services';

configureApi(import.meta.env.VITE_API_URL);

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <BrowserRouter>
      {/* <FullScreenProvider> */}
        <MapViewProvider>
        <App />
        </MapViewProvider>
      {/* </FullScreenProvider> */}
      </BrowserRouter>
    </Provider>
  
)
