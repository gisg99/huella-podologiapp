import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { readBootTheme } from './app/theme.jsx';

// Aplica el tema guardado antes del render para evitar parpadeo.
const boot = readBootTheme();
if (boot) document.documentElement.setAttribute('data-theme', boot);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
