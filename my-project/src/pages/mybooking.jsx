import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, CreditCard, User, Package, ArrowLeft, Eye, X as Cancel } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Import your AuthContext
import axios from 'axios';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth(); // Use AuthContext

  useEffect(() => {
    // Wait for auth loading to complete
    if (authLoading) return;

    // Check if user is logged in
    if (!user) {
      navigate('/login');
      return;
    }

    fetchBookings();
  }, [user, authLoading, navigate]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      
      // Use axios since it's already configured in AuthContext
      const response = await axios.get('/bookings/my-bookings');
      
      if (response.data.success) {
        setBookings(response.data.data);
      } else {
        console.error('Error fetching bookings:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // If unauthorized, redirect to login
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
    document.body.style.overflow = 'unset';
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const response = await axios.put(`/bookings/${bookingId}`, {
        bookingStatus: 'cancelled'
      });
      
      if (response.data.success) {
        alert('Booking cancelled successfully');
        fetchBookings(); // Refresh the list
        closeModal();
      } else {
        alert('Error cancelling booking: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Error cancelling booking: ' + (error.response?.data?.message || 'Please try again.'));
    }
  };

  // Show loading while auth is being checked or bookings are loading
  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  // If not logged in, show nothing (redirect will happen in useEffect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/packages')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Packages
            </button>
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <div className="text-sm text-gray-600">
              Welcome, {user.username}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {bookings.length === 0 ? (
          <div className="text-center py-16">
            <Package size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">No Bookings Found</h3>
            <p className="text-gray-500 mb-6">You haven't made any bookings yet.</p>
            <button
              onClick={() => navigate('/packages')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Browse Packages
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Booking Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-900 truncate pr-2">
                      {booking.packageName}
                    </h3>
                    <div className="flex flex-col space-y-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.bookingStatus)}`}>
                        {booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                        {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2 text-blue-500" />
                      <span>{booking.numberOfDays}D / {booking.numberOfNights}N</span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={16} className="mr-2 text-green-500" />
                      <span>Travel: {new Date(booking.travelDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <CreditCard size={16} className="mr-2 text-purple-500" />
                      <span>₹{booking.totalAmount?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Booking Footer */}
                <div className="p-6">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      <p>Booked on</p>
                      <p className="font-medium text-gray-700">
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openModal(booking)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
                      >
                        <Eye size={16} className="mr-1" />
                        View
                      </button>
                      {booking.bookingStatus === 'confirmed' && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center"
                        >
                          <Cancel size={16} className="mr-1" />
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
              onClick={closeModal}
            ></div>

            <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl">
              <div className="relative">
                <button
                  onClick={closeModal}
                  className="absolute top-6 right-6 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg z-10 transition-all duration-200"
                >
                  <Cancel size={20} />
                </button>

                <div className="p-8">
                  {/* Modal Header */}
                  <div className="mb-8">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-3xl font-bold text-gray-900">
                        Booking Details
                      </h2>
                      <div className="flex space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedBooking.bookingStatus)}`}>
                          {selectedBooking.bookingStatus.charAt(0).toUpperCase() + selectedBooking.bookingStatus.slice(1)}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(selectedBooking.paymentStatus)}`}>
                          {selectedBooking.paymentStatus.charAt(0).toUpperCase() + selectedBooking.paymentStatus.slice(1)}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600">Booking ID: {selectedBooking._id}</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Package Information */}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">Package Information</h3>
                      <div className="bg-blue-50 p-6 rounded-xl space-y-4">
                        <h4 className="text-lg font-semibold text-gray-800">
                          {selectedBooking.packageName}
                        </h4>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Duration</p>
                            <p className="font-medium">{selectedBooking.numberOfDays} Days / {selectedBooking.numberOfNights} Nights</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Price per person</p>
                            <p className="font-medium">₹{selectedBooking.price?.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Number of people</p>
                            <p className="font-medium">{selectedBooking.numberOfPeople || 1}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Total amount</p>
                            <p className="font-medium text-green-600">₹{selectedBooking.totalAmount?.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Booking Information */}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">Booking Information</h3>
                      <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                        <div className="grid grid-cols-1 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Travel Date</p>
                            <p className="font-medium">{new Date(selectedBooking.travelDate).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Booking Date</p>
                            <p className="font-medium">{new Date(selectedBooking.bookingDate).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Payment Status</p>
                            <p className={`font-medium ${selectedBooking.paymentStatus === 'paid' ? 'text-green-600' : selectedBooking.paymentStatus === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>
                              {selectedBooking.paymentStatus.charAt(0).toUpperCase() + selectedBooking.paymentStatus.slice(1)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Booking Status</p>
                            <p className={`font-medium ${selectedBooking.bookingStatus === 'confirmed' ? 'text-green-600' : selectedBooking.bookingStatus === 'cancelled' ? 'text-red-600' : 'text-blue-600'}`}>
                              {selectedBooking.bookingStatus.charAt(0).toUpperCase() + selectedBooking.bookingStatus.slice(1)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Customer Details</h3>
                    <div className="bg-green-50 p-6 rounded-xl">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <User size={20} className="text-green-600 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="font-medium text-gray-800">{selectedBooking.userDetails?.username}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Package size={20} className="text-green-600 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium text-gray-800">{selectedBooking.userDetails?.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Clock size={20} className="text-green-600 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-medium text-gray-800">{selectedBooking.userDetails?.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <MapPin size={20} className="text-green-600 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Address</p>
                            <p className="font-medium text-gray-800">{selectedBooking.userDetails?.address || 'Not provided'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  {selectedBooking.specialRequests && (
                    <div className="mt-8">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">Special Requests</h3>
                      <div className="bg-yellow-50 p-6 rounded-xl">
                        <p className="text-gray-700">{selectedBooking.specialRequests}</p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-8 flex justify-end space-x-4">
                    {selectedBooking.bookingStatus === 'confirmed' && (
                      <button
                        onClick={() => handleCancelBooking(selectedBooking._id)}
                        className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors flex items-center"
                      >
                        <Cancel size={20} className="mr-2" />
                        Cancel Booking
                      </button>
                    )}
                    <button
                      onClick={closeModal}
                      className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;