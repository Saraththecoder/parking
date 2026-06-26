import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useApp } from './context/AppContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import UserLayout from './layouts/UserLayout';
import OwnerLayout from './layouts/OwnerLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

// Seeker/User Pages
import SeekerDashboard from './pages/seeker/Dashboard';
import SeekerSearch from './pages/seeker/Search';
import ParkingDetails from './pages/seeker/ParkingDetails';
import BookParking from './pages/seeker/BookParking';
import SeekerBookings from './pages/seeker/Bookings';
import SeekerWallet from './pages/seeker/Wallet';
import SeekerProfile from './pages/seeker/Profile';

// Owner Pages
import OwnerDashboard from './pages/owner/OwnerDashboard';
import AddSpace from './pages/owner/AddSpace';
import MySpaces from './pages/owner/MySpaces';
import OwnerBookings from './pages/owner/OwnerBookings';
import OwnerEarnings from './pages/owner/Earnings';
import OwnerProfile from './pages/owner/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import ParkingManagement from './pages/admin/ParkingManagement';
import BookingManagement from './pages/admin/BookingManagement';
import RevenueReports from './pages/admin/RevenueReports';

// Mock Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRole }) => {
  const { currentUser } = useApp();

  // If no user is logged in, redirect to login page
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If role is specified and mismatch, redirect to respective dashboard
  if (allowedRole && currentUser.role !== allowedRole) {
    // If admin is browsing, allow them access, else redirect
    if (currentUser.role === 'admin') {
      return children;
    }
    
    // Redirect to correct workspace
    if (currentUser.role === 'seeker') {
      return <Navigate to="/seeker/dashboard" replace />;
    } else if (currentUser.role === 'owner') {
      return <Navigate to="/owner/dashboard" replace />;
    }
  }

  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      {/* Toast notifications handler */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1E293B',
            color: '#F8FAFC',
            fontSize: '13px',
            fontWeight: '600',
            borderRadius: '12px',
          },
          success: {
            iconTheme: {
              primary: '#16A34A',
              secondary: '#F8FAFC',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#F8FAFC',
            },
          },
        }}
      />
      
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Seeker / Driver Panel Routes */}
        <Route
          path="/seeker"
          element={
            <ProtectedRoute allowedRole="seeker">
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<SeekerDashboard />} />
          <Route path="search" element={<SeekerSearch />} />
          <Route path="parking/:id" element={<ParkingDetails />} />
          <Route path="book/:id" element={<BookParking />} />
          <Route path="bookings" element={<SeekerBookings />} />
          <Route path="wallet" element={<SeekerWallet />} />
          <Route path="profile" element={<SeekerProfile />} />
        </Route>

        {/* Host / Owner Panel Routes */}
        <Route
          path="/owner"
          element={
            <ProtectedRoute allowedRole="owner">
              <OwnerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<OwnerDashboard />} />
          <Route path="add" element={<AddSpace />} />
          <Route path="spaces" element={<MySpaces />} />
          <Route path="bookings" element={<OwnerBookings />} />
          <Route path="earnings" element={<OwnerEarnings />} />
          <Route path="profile" element={<OwnerProfile />} />
        </Route>

        {/* Administrator Portal Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="spaces" element={<ParkingManagement />} />
          <Route path="bookings" element={<BookingManagement />} />
          <Route path="revenue" element={<RevenueReports />} />
        </Route>

        {/* Wildcard Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
