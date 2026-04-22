import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { RegistrationPage } from './pages/auth/RegistrationPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { ResourcesPage } from './pages/resources/ResourcesPage';
import { ResourceDetailPage } from './pages/resources/ResourceDetailPage';
import { ResourceFormPage } from './pages/resources/ResourceFormPage';
import { BookingsPage } from './pages/bookings/BookingsPage';
import { BookingDetailPage } from './pages/bookings/BookingDetailPage';
import { NewBookingPage } from './pages/bookings/NewBookingPage';
import { TicketsPage } from './pages/tickets/TicketsPage';
import { TicketDetailPage } from './pages/tickets/TicketDetailPage';
import { NewTicketPage } from './pages/tickets/NewTicketPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { UsersPage } from './pages/admin/UsersPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { useAuth } from './hooks/useAuth';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

const AdminRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth();
  
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              
              <Route path="resources" element={<ResourcesPage />} />
              <Route path="resources/new" element={<AdminRoute><ResourceFormPage /></AdminRoute>} />
              <Route path="resources/:id" element={<ResourceDetailPage />} />
              <Route path="resources/:id/edit" element={<AdminRoute><ResourceFormPage /></AdminRoute>} />
              
              <Route path="bookings" element={<BookingsPage />} />
              <Route path="bookings/new" element={<NewBookingPage />} />
              <Route path="bookings/:id" element={<BookingDetailPage />} />
              
              <Route path="tickets" element={<TicketsPage />} />
              <Route path="tickets/new" element={<NewTicketPage />} />
              <Route path="tickets/:id" element={<TicketDetailPage />} />
              
              <Route path="notifications" element={<NotificationsPage />} />
              
              <Route path="admin/users" element={<AdminRoute><UsersPage /></AdminRoute>} />
              
              <Route path="*" element={<NotFoundPage />} />
            </Route>
            
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App
