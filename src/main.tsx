import ReactDOM from 'react-dom/client';
import App from './App.js';
import './index.css';
import { StrictMode } from 'react';
import { initializeMetaPixel } from './utils/metaPixel.js';

// Initialize Meta Pixel
initializeMetaPixel();

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

ReactDOM.createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);