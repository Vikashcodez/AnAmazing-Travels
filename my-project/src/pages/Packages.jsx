import React, { useState, useEffect } from 'react';
import { Package, Calendar, MapPin, X, ArrowRight, Clock, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import your AuthContext

const PackagesPage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth(); // Use AuthContext

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/packages');
        const data = await response.json();

        if (data.success) {
          setPackages(data.data);
        } else {
          console.error('API returned error:', data.message);
          setPackages([]);
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const openModal = (packageItem) => {
    setSelectedPackage(packageItem);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPackage(null);
    document.body.style.overflow = 'unset';
  };

  // Updated function to use AuthContext
  const handleBookNow = () => {
    // Check if user is logged in using AuthContext
    if (!user) {
      // Redirect to login page if not logged in
      navigate('/login');
      return;
    }

    // If logged in, redirect to booking page with package details
    navigate('/booking', { 
      state: { 
        packageDetails: selectedPackage,
        userDetails: user 
      } 
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading amazing packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Travel Packages
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our carefully curated travel packages for unforgettable experiences
          </p>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {packages.length === 0 ? (
          <div className="text-center py-16">
            <Package size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">No Packages Available</h3>
            <p className="text-gray-500">Check back later for amazing travel packages!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg._id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                onClick={() => openModal(pkg)}
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={`http://localhost:5000/${pkg.thumbnail.replace(/\\/g, '/')}`}
                    alt={pkg.packageName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/fallback-thumbnail.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {pkg.numberOfDays} Days
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {pkg.packageName}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {pkg.shortDescription}
                  </p>

                  {/* Package Details */}
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2 text-blue-500" />
                      <span>{pkg.numberOfDays}D / {pkg.numberOfNights}N</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-2 text-blue-500" />
                      <span>Multiple Cities</span>
                    </div>
                  </div>

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-sm text-gray-500">Starting from</p>
                      <p className="text-2xl font-bold text-green-600">₹{pkg.price?.toLocaleString()}</p>
                    </div>
                    <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center">
                      View Details
                      <ArrowRight size={16} className="ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Modal */}
      {showModal && selectedPackage && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
              onClick={closeModal}
            ></div>

            <div className="inline-block w-full max-w-6xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl">
              <div className="relative">
                <button
                  onClick={closeModal}
                  className="absolute top-6 right-6 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg z-10 transition-all duration-200"
                >
                  <X size={20} />
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Image Section */}
                  <div className="relative h-96 lg:h-full">
                    {selectedPackage.thumbnail ? (
                      <img
                        src={`http://localhost:5000/${selectedPackage.thumbnail.replace(/\\/g, '/')}`}
                        alt={selectedPackage.packageName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.log('Modal image failed to load:', selectedPackage.thumbnail);
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <Package size={64} className="text-gray-400" />
                        <span className="ml-2 text-gray-500">No Image Available</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  </div>

                  {/* Content Section */}
                  <div className="p-8 lg:p-12">
                    <div className="flex items-center mb-4">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        Popular Choice
                      </span>
                    </div>

                    <h2 className="text-4xl font-bold text-gray-900 mb-6">
                      {selectedPackage.packageName}
                    </h2>

                    {/* Quick Info Cards */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-blue-50 p-4 rounded-xl">
                        <div className="flex items-center mb-2">
                          <Calendar size={20} className="text-blue-600 mr-2" />
                          <span className="font-semibold text-gray-800">Duration</span>
                        </div>
                        <p className="text-gray-600">{selectedPackage.numberOfDays} Days / {selectedPackage.numberOfNights} Nights</p>
                      </div>

                      <div className="bg-green-50 p-4 rounded-xl">
                        <div className="flex items-center mb-2">
                          <MapPin size={20} className="text-green-600 mr-2" />
                          <span className="font-semibold text-gray-800">Destinations</span>
                        </div>
                        <p className="text-gray-600">Multiple Cities</p>
                      </div>
                    </div>

                    <div className="mb-8">
                      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Package Overview</h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">{selectedPackage.shortDescription}</p>
                      <div
                        className="text-gray-600 prose max-w-none leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: selectedPackage.detailedDescription }}
                      />
                    </div>

                    {/* Price and Booking Section */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Package Price</p>
                          <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                            ₹{selectedPackage.price?.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">Per person</p>
                        </div>
                        <div className="text-right">
                          <button 
                            onClick={handleBookNow}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 mb-2"
                          >
                            {user ? 'Book Now' : 'Login to Book'}
                          </button>
                          <p className="text-xs text-gray-500">Free cancellation available</p>
                        </div>
                      </div>
                    </div>
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

export default PackagesPage;