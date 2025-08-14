import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Star, 
  ArrowLeft, 
  Bed, 
  Wind, 
  Wifi, 
  Car, 
  Coffee, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Users,
  Calendar,
  Phone,
  Mail
} from 'lucide-react';

const HotelFetch = () => {
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [currentRoomImageIndex, setCurrentRoomImageIndex] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE_URL = 'http://localhost:5000/api/hotels';

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await fetch(API_BASE_URL);
      const data = await response.json();
      
      if (data.success) {
        setHotels(data.data);
      } else {
        setError('Failed to fetch hotels');
      }
    } catch (error) {
      setError('Error connecting to server: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHotelClick = (hotel) => {
    setSelectedHotel(hotel);
    // Initialize room image indices
    const imageIndices = {};
    hotel.rooms.forEach((room, index) => {
      imageIndices[index] = 0;
    });
    setCurrentRoomImageIndex(imageIndices);
  };

  const handleBackToList = () => {
    setSelectedHotel(null);
    setCurrentRoomImageIndex({});
  };

  const nextRoomImage = (roomIndex) => {
    const room = selectedHotel.rooms[roomIndex];
    setCurrentRoomImageIndex(prev => ({
      ...prev,
      [roomIndex]: (prev[roomIndex] + 1) % room.images.length
    }));
  };

  const prevRoomImage = (roomIndex) => {
    const room = selectedHotel.rooms[roomIndex];
    setCurrentRoomImageIndex(prev => ({
      ...prev,
      [roomIndex]: prev[roomIndex] === 0 ? room.images.length - 1 : prev[roomIndex] - 1
    }));
  };

  const getRoomTypeIcon = (bedType) => {
    return bedType === 'single' ? <Users className="h-4 w-4" /> : <Bed className="h-4 w-4" />;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-3 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Hotels</h2>
          <p className="text-gray-600">Please wait while we fetch the best hotels for you...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
          <div className="text-red-500 mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">⚠️</span>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchHotels}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (selectedHotel) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button
                onClick={handleBackToList}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span className="font-medium">Back to Hotels</span>
              </button>
              <h1 className="text-xl font-semibold text-gray-900">{selectedHotel.hotelName}</h1>
              <div className="w-24"></div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hotel Hero Section */}
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-8">
            <div className="relative">
              <img
                src={`http://localhost:5000/uploads/${selectedHotel.hotelImage}`}
                alt={selectedHotel.hotelName}
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h1 className="text-4xl font-bold mb-2">{selectedHotel.hotelName}</h1>
                <div className="flex items-center text-lg">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{selectedHotel.hotelLocation}</span>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">About This Hotel</h2>
                  <p className="text-gray-700 leading-relaxed mb-6">{selectedHotel.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
                      <p className="text-gray-700">{selectedHotel.hotelAddress}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <h3 className="font-semibold text-gray-900 mb-2">Total Rooms</h3>
                      <p className="text-2xl font-bold text-blue-600">{selectedHotel.rooms.length}</p>
                    </div>
                  </div>

                  <a
                    href={selectedHotel.locationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Maps
                  </a>
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-2xl">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Hotel Amenities</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center text-gray-700">
                        <Wifi className="h-5 w-5 mr-3 text-blue-600" />
                        <span>Free WiFi</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Car className="h-5 w-5 mr-3 text-blue-600" />
                        <span>Parking</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Coffee className="h-5 w-5 mr-3 text-blue-600" />
                        <span>Restaurant</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Calendar className="h-5 w-5 mr-3 text-blue-600" />
                        <span>24/7 Service</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rooms Section */}
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Available Rooms</h2>
            
            {selectedHotel.rooms.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {selectedHotel.rooms.map((room, roomIndex) => (
                  <div key={room._id} className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Room Image Carousel */}
                    <div className="relative h-64">
                      <img
                        src={`http://localhost:5000/uploads/${room.images[currentRoomImageIndex[roomIndex] || 0]}`}
                        alt={`${room.roomType} room`}
                        className="w-full h-full object-cover"
                      />
                      
                      {room.images.length > 1 && (
                        <>
                          <button
                            onClick={() => prevRoomImage(roomIndex)}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                          >
                            <ChevronLeft className="h-4 w-4 text-gray-700" />
                          </button>
                          <button
                            onClick={() => nextRoomImage(roomIndex)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                          >
                            <ChevronRight className="h-4 w-4 text-gray-700" />
                          </button>
                        </>
                      )}
                      
                      {/* Image Counter */}
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-lg text-sm">
                        {(currentRoomImageIndex[roomIndex] || 0) + 1} / {room.images.length}
                      </div>

                      {/* Room Type Badge */}
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          room.roomType === 'deluxe' 
                            ? 'bg-gold-100 text-gold-800 border border-gold-200' 
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}>
                          {room.roomType === 'deluxe' ? '★ Deluxe' : 'Standard'}
                        </span>
                      </div>
                    </div>

                    {/* Room Details */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-900 capitalize">
                          {room.roomType} Room
                        </h3>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            {formatPrice(room.price)}
                          </div>
                          <div className="text-sm text-gray-500">per night</div>
                        </div>
                      </div>

                      {/* Room Features */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center text-gray-700">
                          {getRoomTypeIcon(room.bedType)}
                          <span className="ml-2 capitalize">{room.bedType} Bed</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Wind className={`h-4 w-4 mr-2 ${room.acType === 'AC' ? 'text-blue-500' : 'text-gray-400'}`} />
                          <span>{room.acType}</span>
                        </div>
                      </div>

                      {/* Room Amenities */}
                      <div className="bg-gray-50 p-4 rounded-xl mb-6">
                        <h4 className="font-medium text-gray-900 mb-2">Room Amenities</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                          <div>• Private Bathroom</div>
                          <div>• Flat-screen TV</div>
                          <div>• Room Service</div>
                          <div>• Daily Housekeeping</div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors font-medium">
                          Book Now
                        </button>
                        <button className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Bed className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-medium text-gray-600 mb-2">No Rooms Available</h3>
                <p className="text-gray-500">This hotel currently has no rooms listed.</p>
              </div>
            )}
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 mt-8 text-white">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Need Help with Your Booking?</h2>
              <p className="text-blue-100 mb-6">Our customer service team is available 24/7 to assist you</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+1234567890"
                  className="flex items-center justify-center bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl transition-colors"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Call Us: +91 12345 67890
                </a>
                <a
                  href="mailto:help@hotel.com"
                  className="flex items-center justify-center bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl transition-colors"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  Email: help@hotel.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Hotels List View
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Amazing Hotels</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find the perfect accommodation for your next trip. Choose from our curated selection of premium hotels.
            </p>
          </div>
        </div>
      </div>

      {/* Hotels Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {hotels.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {hotels.length} Hotel{hotels.length !== 1 ? 's' : ''} Available
              </h2>
              <div className="text-sm text-gray-500">
                Updated {new Date().toLocaleDateString()}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hotels.map((hotel) => (
                <div
                  key={hotel._id}
                  onClick={() => handleHotelClick(hotel)}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 hover:shadow-xl transition-all duration-300"
                >
                  {/* Hotel Image */}
                  <div className="relative h-64">
                    <img
                      src={`http://localhost:5000/uploads/${hotel.hotelImage}`}
                      alt={hotel.hotelName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    
                    {/* Rating Badge */}
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-medium text-gray-900">4.5</span>
                      </div>
                    </div>

                    {/* Room Count Badge */}
                    <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {hotel.rooms.length} Room{hotel.rooms.length !== 1 ? 's' : ''}
                    </div>
                  </div>

                  {/* Hotel Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{hotel.hotelName}</h3>
                    
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                      <span className="text-sm">{hotel.hotelLocation}</span>
                    </div>

                    <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
                      {hotel.description}
                    </p>

                    {/* Price Range */}
                    {hotel.rooms.length > 0 && (
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-gray-500">Starting from</div>
                        <div className="text-lg font-bold text-green-600">
                          {formatPrice(Math.min(...hotel.rooms.map(room => room.price)))}
                        </div>
                      </div>
                    )}

                    {/* View Details Button */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-500">
                        Added {new Date(hotel.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
                        View Details →
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <div className="text-gray-400 mb-6">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <MapPin className="h-12 w-12" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Hotels Found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any hotels at the moment. Please check back later or contact support.
              </p>
              <button
                onClick={fetchHotels}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                Refresh Hotels
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelFetch;