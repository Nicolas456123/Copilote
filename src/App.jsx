import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import AccueilPage from './pages/AccueilPage';
import HabitudesPage from './pages/HabitudesPage';
import ProjetsPage from './pages/ProjetsPage';
import FocusPage from './pages/FocusPage';
import JournalPage from './pages/JournalPage';
import PlusPage from './pages/PlusPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<AccueilPage />} />
          <Route path="habitudes" element={<HabitudesPage />} />
          <Route path="projets" element={<ProjetsPage />} />
          <Route path="focus" element={<FocusPage />} />
          <Route path="journal" element={<JournalPage />} />
          <Route path="plus" element={<PlusPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
