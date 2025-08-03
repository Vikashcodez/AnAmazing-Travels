import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import Packages from './pages/Packages';
import Enquiries from './pages/Enqry';
import MyBookingsPage from './components/Booking';
import MyBookingsPag from './pages/mybooking';
import About from './pages/About';
import Contact from './pages/Contact';
import Footer from './components/Footer';
import DestinationsPage from './pages/Destination';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
             <Route path="/packages" element={<Packages />} />
            <Route path="/blog" element={<Enquiries />} />
            <Route path='/booking' element={<MyBookingsPage />} />
            <Route path="/my-bookings" element={<MyBookingsPag />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/destinations" element={<DestinationsPage />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
          <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;  