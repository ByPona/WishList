import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { CardsContextProvider } from './context/CardsContext.jsx'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CardsContextProvider>
    <App />
    </CardsContextProvider>
  </React.StrictMode>
)
