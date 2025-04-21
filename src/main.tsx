import ReactDOM from 'react-dom/client';
import App from './App.js';
import './index.css';
import { StrictMode } from 'react';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

ReactDOM.createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);