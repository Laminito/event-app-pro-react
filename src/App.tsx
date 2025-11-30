import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EventListPage from './pages/EventListPage';
import EventDetailsPage from './pages/EventDetailsPage';
import CheckoutPage from './pages/CheckoutPage';
import TicketPage from './pages/TicketPage';
import OrganizerDashboard from './pages/OrganizerDashboard';
import OrganizerEventsPage from './pages/OrganizerEventsPage';
import CreateEventPage from './pages/CreateEventPage';
import ScannerPage from './pages/ScannerPage';
import ProfilePage from './pages/ProfilePage';
import PurchaseHistoryPage from './pages/PurchaseHistoryPage';
import OrganizerTicketsPage from './pages/OrganizerTicketsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import BlogListPage from './pages/BlogListPage';
import BlogDetailsPage from './pages/BlogDetailsPage';
import SettingsPage from './pages/SettingsPage';
import LegalPage from './pages/LegalPage';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventListPage />} />
        <Route path="/events/:id" element={<EventDetailsPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/ticket" element={<TicketPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/purchase-history" element={<PurchaseHistoryPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/blog" element={<BlogListPage />} />
        <Route path="/blog/:id" element={<BlogDetailsPage />} />
        <Route path="/legal" element={<LegalPage />} />

        {/* Organizer Routes */}
        <Route path="/organizer" element={<OrganizerDashboard />} />
        <Route path="/organizer/events" element={<OrganizerEventsPage />} />
        <Route path="/organizer/events/create" element={<CreateEventPage />} />
        <Route path="/organizer/tickets" element={<OrganizerTicketsPage />} />
        <Route path="/organizer/scanner" element={<ScannerPage />} />
        <Route path="/organizer/analytics" element={<AnalyticsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
