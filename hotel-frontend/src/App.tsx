import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/AdminDashboard';
import GuestDashboard from './pages/GuestDashboard';
import GuestRoomList from './pages/GuestRoomList';
import GuestBookings from './pages/GuestBookings';
import BookingSuccess from './pages/BookingSuccess';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<AuthPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
       <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Guest Protected Routes */}
        <Route
          path="/guest-dashboard"
          element={
            <ProtectedRoute role="guest">
              <GuestDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guest-rooms"
          element={
            <ProtectedRoute role="guest">
              <GuestRoomList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guest-bookings"
          element={
            <ProtectedRoute role="guest">
              <GuestBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking-success"
          element={
            <ProtectedRoute role="guest">
              <BookingSuccess />
            </ProtectedRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
