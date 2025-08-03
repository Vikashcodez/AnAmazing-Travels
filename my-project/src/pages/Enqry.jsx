import { useState } from 'react';
import { FiSend, FiMapPin, FiCalendar, FiUsers, FiDollarSign, FiPlus, FiX } from 'react-icons/fi';

const TravelEnquiry = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    destinations: [''],
    travelDate: '',
    travelers: 1,
    budget: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDestinationChange = (index, value) => {
    const newDestinations = [...formData.destinations];
    newDestinations[index] = value;
    setFormData(prev => ({
      ...prev,
      destinations: newDestinations
    }));
  };

  const addDestination = () => {
    setFormData(prev => ({
      ...prev,
      destinations: [...prev.destinations, '']
    }));
  };

  const removeDestination = (index) => {
    if (formData.destinations.length > 1) {
      const newDestinations = formData.destinations.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        destinations: newDestinations
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const filteredDestinations = formData.destinations.filter(dest => dest.trim() !== '');
      const submitData = {
        ...formData,
        destinations: filteredDestinations
      };
      
      const response = await fetch('http://localhost:5000/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });
      
      if (response.ok) {
        alert('Enquiry submitted successfully!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          destinations: [''],
          travelDate: '',
          travelers: 1,
          budget: '',
          message: ''
        });
      } else {
        alert('Failed to submit enquiry. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const destinationOptions = [
    { value: '', label: 'Select Destination' },
    { value: 'havelock-island', label: 'Havelock Island, Andaman' },
    { value: 'radhanagar-beach', label: 'Radhanagar Beach, Andaman' },
    { value: 'ross-island', label: 'Ross Island, Andaman' },
    { value: 'cellular-jail', label: 'Cellular Jail, Port Blair' },
    { value: 'neil-island', label: 'Neil Island, Andaman' },
    { value: 'baratang-island', label: 'Baratang Island, Andaman' },
    { value: 'rangat', label: 'Rangat, Andaman' },
    { value: 'mayabunder', label: 'Mayabunder, Andaman' },
    { value: 'diglipur', label: 'Diglipur, Andaman' },
    { value: 'other', label: 'Other Location' }
  ];

  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="text-indigo-600">Plan Your Perfect</span> Andaman Getaway
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Let our travel experts craft a personalized itinerary for your dream vacation
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-stretch justify-center">
          {/* Information Card */}
          <div className="w-full lg:w-1/2">
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl shadow-lg overflow-hidden h-full flex flex-col border border-gray-100">
              <div className="p-10 flex-grow">
                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-sm">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Why Book With Us?</h3>
                  <p className="text-gray-600 mb-8">
                    With over a decade of experience in Andaman tourism, we create unforgettable experiences tailored to your preferences.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="bg-indigo-100 p-3 rounded-lg mr-4 flex-shrink-0">
                        <FiMapPin className="text-indigo-600 text-xl" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">Local Expertise</h4>
                        <p className="text-gray-600 text-sm">Insider knowledge of hidden gems and best spots</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-3 rounded-lg mr-4 flex-shrink-0">
                        <FiCalendar className="text-blue-600 text-xl" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">Flexible Planning</h4>
                        <p className="text-gray-600 text-sm">Customizable itineraries for your perfect trip</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-purple-100 p-3 rounded-lg mr-4 flex-shrink-0">
                        <FiUsers className="text-purple-600 text-xl" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">24/7 Support</h4>
                        <p className="text-gray-600 text-sm">Dedicated assistance throughout your journey</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-cyan-100 p-3 rounded-lg mr-4 flex-shrink-0">
                        <FiDollarSign className="text-cyan-600 text-xl" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">Best Value</h4>
                        <p className="text-gray-600 text-sm">Premium experiences at competitive prices</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enquiry Form */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full flex flex-col border border-gray-100">
              <div className="p-10 flex-grow">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Get a Custom Quote</h3>
                  <p className="text-gray-600">Fill in your details and we'll get back to you within 24 hours</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        required
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        required
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        required
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label htmlFor="travelers" className="block text-sm font-medium text-gray-700 mb-2">
                        Travelers
                      </label>
                      <input
                        type="number"
                        id="travelers"
                        name="travelers"
                        min="1"
                        value={formData.travelers}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Destinations
                    </label>
                    {formData.destinations.map((destination, index) => (
                      <div key={index} className="flex gap-3 mb-3">
                        <select
                          value={destination}
                          onChange={(e) => handleDestinationChange(index, e.target.value)}
                          className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          required={index === 0}
                        >
                          {destinationOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        {formData.destinations.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeDestination(index)}
                            className="px-3 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <FiX />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addDestination}
                      className="flex items-center text-indigo-600 hover:text-indigo-700 font-medium text-sm mt-2"
                    >
                      <FiPlus className="mr-1" /> Add Another Destination
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="travelDate" className="block text-sm font-medium text-gray-700 mb-2">
                        Travel Date
                      </label>
                      <input
                        type="date"
                        id="travelDate"
                        name="travelDate"
                        value={formData.travelDate}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                        Budget (per person)
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        required
                      >
                        <option value="">Select Budget</option>
                        <option value="15000-25000">₹15,000 - ₹25,000</option>
                        <option value="25000-40000">₹25,000 - ₹40,000</option>
                        <option value="40000-60000">₹40,000 - ₹60,000</option>
                        <option value="60000+">₹60,000+</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Special Requests
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      placeholder="Tell us about your dream vacation..."
                    ></textarea>
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center px-6 py-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-md hover:shadow-lg"
                    >
                      <FiSend className="mr-3" />
                      Submit Enquiry
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelEnquiry;