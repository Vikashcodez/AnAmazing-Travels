import React, { useState, useEffect } from 'react';
import { Package, Calendar, MapPin, ArrowRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePackagesSection = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchFeaturedPackages = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/packages?featured=true&limit=3');
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

    fetchFeaturedPackages();
  }, []);

  const handleViewDetails = (packageId) => {
    navigate(`/packages/${packageId}`);
  };

  const handleBookNow = (pkg) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/booking', { state: { packageDetails: pkg } });
  };

  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            <span className="text-indigo-600">Featured</span> Travel Packages
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our most popular travel experiences curated just for you
          </p>
        </div>

        {/* Packages Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600">No Featured Packages</h3>
            <p className="text-gray-500">Check back later for amazing travel packages!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg._id}
                className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              >
                {/* Image with Badge */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={`http://localhost:5000/${pkg.thumbnail.replace(/\\/g, '/')}`}
                    alt={pkg.packageName}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/fallback-thumbnail.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  <div className="absolute top-4 right-4 flex items-center bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    <Star size={16} className="mr-1" />
                    Featured
                  </div>
                </div>

                {/* Package Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{pkg.packageName}</h3>
                    <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs font-semibold">
                      {pkg.numberOfDays}D/{pkg.numberOfNights}N
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">{pkg.shortDescription}</p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {pkg.highlights?.slice(0, 3).map((highlight, index) => (
                      <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        {highlight}
                      </span>
                    ))}
                  </div>

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-sm text-gray-500">Starting from</p>
                      <p className="text-xl font-bold text-indigo-600">₹{pkg.price?.toLocaleString()}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetails(pkg._id)}
                        className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => handleBookNow(pkg)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All CTA */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/packages')}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            View All Packages
            <ArrowRight size={20} className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePackagesSection;