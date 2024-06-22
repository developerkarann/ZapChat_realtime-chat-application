import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { CssBaseline } from '@mui/material'
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'
import store from './redux/store.js'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <React.StrictMode>
      <HelmetProvider>
        <CssBaseline />
        <div onContextMenu={(e) => e.preventDefault()}>
          <App />
        </div>
      </HelmetProvider>
    </React.StrictMode>
  </Provider>
)
