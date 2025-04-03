import { createRoot } from 'react-dom/client'
import 'react-day-picker/dist/style.css';
import 'config/webService';
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import "utils/chartConfig";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </BrowserRouter>
)
