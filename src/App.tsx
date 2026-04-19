import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import NavigatePage from './pages/NavigatePage';
import Services from './pages/Services';
import Safety from './pages/Safety';
import AdminTwin from './pages/AdminTwin';
import ArrivalPage from './pages/ArrivalPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="navigate" element={<NavigatePage />} />
          <Route path="arrival" element={<ArrivalPage />} />
          <Route path="services" element={<Services />} />
          <Route path="safety" element={<Safety />} />
          <Route path="admin" element={<AdminTwin />} />
        </Route>
      </Routes>
    </Router>
  );
}
