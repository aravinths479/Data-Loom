import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ConnectionStatusAlert from './components/ConnectionStatusAlert';

import { AuthContextProvider } from './context/AuthContext'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
        <App />
        <ConnectionStatusAlert/>
    </AuthContextProvider>
  </React.StrictMode>
);