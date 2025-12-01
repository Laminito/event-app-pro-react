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
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventListPage />} />
          <Route path="/events/:id" element={<EventDetailsPage />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/:id" element={<BlogDetailsPage />} />
          <Route path="/legal" element={<LegalPage />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected User Routes */}
          <Route path="/checkout" element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } />
          <Route path="/ticket" element={
            <ProtectedRoute>
              <TicketPage />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/purchase-history" element={
            <ProtectedRoute>
              <PurchaseHistoryPage />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } />

          {/* Protected Organizer Routes */}
          <Route path="/organizer" element={
            <ProtectedRoute requireOrganizer>
              <OrganizerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/organizer/events" element={
            <ProtectedRoute requireOrganizer>
              <OrganizerEventsPage />
            </ProtectedRoute>
          } />
          <Route path="/organizer/events/create" element={
            <ProtectedRoute requireOrganizer>
              <CreateEventPage />
            </ProtectedRoute>
          } />
          <Route path="/organizer/tickets" element={
            <ProtectedRoute requireOrganizer>
              <OrganizerTicketsPage />
            </ProtectedRoute>
          } />
          <Route path="/organizer/scanner" element={
            <ProtectedRoute requireOrganizer>
              <ScannerPage />
            </ProtectedRoute>
          } />
          <Route path="/organizer/analytics" element={
            <ProtectedRoute requireOrganizer>
              <AnalyticsPage />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
