import { useState } from 'react';
import { FiMapPin, FiStar, FiCompass, FiArrowRight } from 'react-icons/fi';
import { FaUmbrellaBeach, FaWater, FaMountain } from 'react-icons/fa';

const DestinationsPage = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);

  const regions = [
    {
      id: 'small-islands',
      title: 'Small Islands',
      description: 'Pristine beaches and untouched natural beauty',
      icon: <FaUmbrellaBeach className="text-3xl text-indigo-600" />,
      locations: [
        {
          name: 'Havelock Island',
          description: 'Famous for Radhanagar Beach, one of Asia\'s best beaches',
          image: '/havelock.jpg',
          highlights: ['Radhanagar Beach', 'Elephant Beach', 'Scuba Diving']
        },
        {
          name: 'Neil Island',
          description: 'Serene beaches with rich coral reefs',
          image: '/neil-island.jpg',
          highlights: ['Bharatpur Beach', 'Laxmanpur Beach', 'Natural Bridge']
        },
        {
          name: 'Ross Island',
          description: 'Historical ruins amidst lush greenery',
          image: '/ross-island.jpg',
          highlights: ['British Ruins', 'Peacock Sanctuary', 'Light & Sound Show']
        }
      ]
    },
    {
      id: 'south-andaman',
      title: 'South Andaman',
      description: 'Cultural landmarks and administrative hub',
      icon: <FiCompass className="text-3xl text-indigo-600" />,
      locations: [
        {
          name: 'Port Blair',
          description: 'Capital city with historical significance',
          image: '/port-blair.jpg',
          highlights: ['Cellular Jail', 'Anthropological Museum', 'Marina Park']
        },
        {
          name: 'Wandoor',
          description: 'Gateway to Mahatma Gandhi Marine National Park',
          image: '/wandoor.jpg',
          highlights: ['Jolly Buoy Island', 'Red Skin Island', 'Coral Reefs']
        },
        {
          name: 'Chidiya Tapu',
          description: 'Sunset point known for bird watching',
          image: '/chidiya-tapu.jpg',
          highlights: ['Munda Pahar Beach', 'Biological Park', 'Sunset Views']
        }
      ]
    },
    {
      id: 'north-andaman',
      title: 'North Andaman',
      description: 'Untouched wilderness and adventure',
      icon: <FaMountain className="text-3xl text-indigo-600" />,
      locations: [
        {
          name: 'Diglipur',
          description: 'Home to Saddle Peak and limestone caves',
          image: '/diglipur.jpg',
          highlights: ['Ross & Smith Islands', 'Mud Volcano', 'Kalipur Beach']
        },
        {
          name: 'Mayabunder',
          description: 'Known for its mangrove creeks and beaches',
          image: '/mayabunder.jpg',
          highlights: ['Avis Island', 'Karmatang Beach', 'German Jetty']
        },
        {
          name: 'Rangat',
          description: 'Picturesque beaches and waterfalls',
          image: '/rangat.jpg',
          highlights: ['Amkunj Beach', 'Cutbert Bay', 'Panchavati Hills']
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 py-20 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Explore <span className="text-indigo-600">Andaman</span> Destinations
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover the pristine beaches, rich marine life, and lush forests of these tropical islands
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {!selectedRegion ? (
          <>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Select a Region to Explore
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {regions.map((region) => (
                <div
                  key={region.id}
                  onClick={() => setSelectedRegion(region)}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <div className="p-8 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="bg-indigo-100 p-4 rounded-full">
                        {region.icon}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{region.title}</h3>
                    <p className="text-gray-600 mb-6">{region.description}</p>
                    <button className="inline-flex items-center text-indigo-600 font-medium">
                      View Locations <FiArrowRight className="ml-2" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-12">
            <div className="flex justify-between items-center">
              <button
                onClick={() => setSelectedRegion(null)}
                className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
              >
                <FiArrowRight className="transform rotate-180 mr-2" />
                Back to Regions
              </button>
              <h2 className="text-3xl font-bold text-gray-900">
                {selectedRegion.title} Destinations
              </h2>
              <div></div> {/* Empty div for spacing */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {selectedRegion.locations.map((location, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={location.image}
                      alt={location.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/fallback-image.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-2">
                      <FiMapPin className="text-indigo-600 mr-2" />
                      <h3 className="text-xl font-bold text-gray-800">{location.name}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{location.description}</p>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-800 flex items-center">
                        <FiStar className="text-yellow-500 mr-2" />
                        Highlights
                      </h4>
                      <ul className="space-y-1">
                        {location.highlights.map((highlight, i) => (
                          <li key={i} className="flex items-center text-gray-600">
                            <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-2"></span>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationsPage;