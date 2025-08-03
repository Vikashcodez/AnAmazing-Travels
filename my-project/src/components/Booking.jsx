import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, User, Phone, Mail, MapPin as Address, CreditCard, ArrowLeft, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Import your AuthContext
import axios from 'axios';

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth(); // Use AuthContext
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [confirmation, setConfirmation] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [packageDetails, setPackageDetails] = useState({});

  useEffect(() => {
    // Wait for auth loading to complete
    if (authLoading) return;

    // Check if user is logged in using AuthContext
    if (!user) {
      navigate('/login');
      return;
    }

    // Get package details from navigation state
    if (location.state?.packageDetails) {
      setPackageDetails(location.state.packageDetails);
      setUserDetails(user); // Use user from AuthContext
    } else {
      // If no state, redirect back to packages
      navigate('/packages');
    }
  }, [user, authLoading, location, navigate]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setCurrentStep(2);
  };

  const handleConfirmation = (confirmed) => {
    setConfirmation(confirmed);
    if (!confirmed) {
      navigate('/packages');
    } else {
      setCurrentStep(3);
    }
  };

  const handleBookPackage = async () => {
  setLoading(true);
  try {
    // Get the token from localStorage (or however you store it)
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Authentication required. Please log in again.');
      navigate('/login');
      return;
    }

    const bookingData = {
      packageId: packageDetails._id,
      packageName: packageDetails.packageName,
      price: packageDetails.price,
      numberOfDays: packageDetails.numberOfDays,
      numberOfNights: packageDetails.numberOfNights,
      travelDate: selectedDate,
      userDetails: {
        username: user.username || 'Not provided',
        email: user.email || 'Not provided',
        phone: user.phone || 'Not provided',
        address: user.address || 'Not provided'
      },
      numberOfPeople: 1,
      specialRequests: ''
    };

    console.log('Sending booking data:', bookingData);
    console.log('Using token:', token ? 'Token exists' : 'No token');

    // Make the request with proper headers and full URL
    const response = await axios.post('http://localhost:5000/api/bookings', bookingData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.success) {
      alert('Booking successful! Your booking ID is: ' + response.data.data._id);
      navigate('/my-bookings');
    } else {
      alert('Booking failed: ' + response.data.message);
    }
  } catch (error) {
    console.error('Error creating booking:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    
    if (error.response?.status === 401) {
      alert('Authentication failed. Please log in again.');
      navigate('/login');
    } else {
      alert('Booking failed: ' + (error.response?.data?.message || 'Please try again.'));
    }
  } finally {
    setLoading(false);
  }
};

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  // Show loading if package details not loaded
  if (!packageDetails.packageName) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/packages')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Packages
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Book Your Package</h1>
            <div></div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Package Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Package Summary</h3>
              
              <div className="mb-4">
                <img
                  src={`http://localhost:5000/${packageDetails.thumbnail?.replace(/\\/g, '/')}`}
                  alt={packageDetails.packageName}
                  className="w-full h-48 object-cover rounded-xl"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop';
                  }}
                />
              </div>

              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                {packageDetails.packageName}
              </h4>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar size={16} className="mr-2 text-blue-500" />
                  <span>{packageDetails.numberOfDays} Days / {packageDetails.numberOfNights} Nights</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin size={16} className="mr-2 text-blue-500" />
                  <span>Multiple Destinations</span>
                </div>
                {selectedDate && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock size={16} className="mr-2 text-green-500" />
                    <span>Travel Date: {new Date(selectedDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">Total Price</span>
                  <span className="text-2xl font-bold text-green-600">
                    ₹{packageDetails.price?.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Per person</p>
              </div>
            </div>
          </div>

          {/* Booking Steps */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Progress Steps */}
              <div className="flex items-center mb-8">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {currentStep > 1 ? <Check size={16} /> : '1'}
                </div>
                <div className={`flex-1 h-1 mx-4 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {currentStep > 2 ? <Check size={16} /> : '2'}
                </div>
                <div className={`flex-1 h-1 mx-4 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {currentStep > 3 ? <Check size={16} /> : '3'}
                </div>
              </div>

              {/* Step 1: Select Date */}
              {currentStep === 1 && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Select Your Travel Date</h3>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Choose your preferred travel start date
                    </label>
                    <input
                      type="date"
                      min={getTomorrowDate()}
                      value={selectedDate}
                      onChange={(e) => handleDateSelect(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Please select a date at least 1 day from today for booking confirmation.
                  </p>
                </div>
              )}

              {/* Step 2: Confirm Package */}
              {currentStep === 2 && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Confirm Your Package</h3>
                  
                  {/* User Details */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Your Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                        <User size={20} className="text-blue-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Name</p>
                          <p className="font-medium text-gray-800">{user.username || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                        <Mail size={20} className="text-blue-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium text-gray-800">{user.email || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                        <Phone size={20} className="text-blue-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium text-gray-800">{user.phone || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                        <Address size={20} className="text-blue-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="font-medium text-gray-800">{user.address || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Package Confirmation */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Package Details</h4>
                    <div className="bg-blue-50 p-6 rounded-xl">
                      <h5 className="font-semibold text-gray-800 mb-2">{packageDetails.packageName}</h5>
                      <p className="text-gray-600 mb-4">{packageDetails.shortDescription}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Duration</p>
                          <p className="font-medium">{packageDetails.numberOfDays}D/{packageDetails.numberOfNights}N</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Travel Date</p>
                          <p className="font-medium">{new Date(selectedDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Price</p>
                          <p className="font-medium">₹{packageDetails.price?.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Status</p>
                          <p className="font-medium text-orange-600">Pending Payment</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-lg text-gray-700 mb-6">Are you satisfied with this package selection?</p>
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => handleConfirmation(false)}
                        className="px-8 py-3 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300 transition-colors flex items-center"
                      >
                        <X size={20} className="mr-2" />
                        No, Go Back
                      </button>
                      <button
                        onClick={() => handleConfirmation(true)}
                        className="px-8 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center"
                      >
                        <Check size={20} className="mr-2" />
                        Yes, Continue
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Final Booking */}
              {currentStep === 3 && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Booking</h3>
                  
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
                    <div className="flex items-center mb-4">
                      <Check size={24} className="text-green-600 mr-3" />
                      <h4 className="text-lg font-semibold text-green-800">Ready to Book!</h4>
                    </div>
                    <p className="text-green-700">
                      Your package details have been confirmed. Click the button below to complete your booking.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl mb-8">
                    <div className="flex items-center mb-4">
                      <CreditCard size={20} className="text-blue-500 mr-3" />
                      <h4 className="font-semibold text-gray-800">Payment Information</h4>
                    </div>
                    <p className="text-gray-600">
                      Payment status will be set to <span className="font-medium text-orange-600">Pending</span> initially. 
                      You will receive payment instructions via email after booking confirmation.
                    </p>
                  </div>

                  <div className="text-center">
                    <button
                      onClick={handleBookPackage}
                      disabled={loading}
                      className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        'Book Package'
                      )}
                    </button>
                    <p className="text-sm text-gray-500 mt-4">
                      By clicking "Book Package", you agree to our terms and conditions.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;