import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ProductsProvider } from './hooks/useProducts.tsx';

createRoot(document.getElementById('root')!).render(
  <ProductsProvider>
    <App />
  </ProductsProvider>
);
