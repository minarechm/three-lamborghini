import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Leva } from 'leva';

document.title="Lamborghini Showcase"
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <App />
    <Leva hidden/>
  </>
);
