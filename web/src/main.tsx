import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { store } from './app/store';
import { fetchUserInfo } from './app/auth/authSlice';

store.dispatch(fetchUserInfo());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App/>
  </StrictMode>,
);
