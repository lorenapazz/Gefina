import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const root = document.querySelector('div');

if (root !== null) {
    createRoot(root).render(<App />);
}