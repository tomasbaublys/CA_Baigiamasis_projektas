import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router';
import { UsersProvider } from './components/contexts/UsersContext.tsx';
import { QuestionsProvider } from './components/contexts/QuestionsContext.tsx';

createRoot(document.getElementById('root') as HTMLDivElement).render(
  <UsersProvider>
    <BrowserRouter>
      <QuestionsProvider>
        <App />
      </QuestionsProvider>
    </BrowserRouter>
  </UsersProvider>
);