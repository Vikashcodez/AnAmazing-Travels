import React, { useState, useEffect } from 'react';
import { Play, Image, ChevronLeft, ChevronRight, X } from 'lucide-react';

const GalleryDisplayPage = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch gallery items
  const fetchGalleryItems = async () => {
    setLoading(true);
    try {
      const typeParam = filterType !== 'all' ? `&type=${filterType}` : '';
      const response = await fetch(`/api/gallery?page=${currentPage}&limit=20${typeParam}`);
      const data = await response.json();
      
      if (response.ok) {
        setGalleryItems(data.data || []);
        setFilteredItems(data.data || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, [currentPage, filterType]);

  // Navigate in lightbox
  const navigateLightbox = (direction) => {
    if (!selectedItem) return;
    
    const currentIndex = filteredItems.findIndex(item => item._id === selectedItem._id);
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredItems.length - 1;
    } else {
      newIndex = currentIndex < filteredItems.length - 1 ? currentIndex + 1 : 0;
    }
    
    setSelectedItem(filteredItems[newIndex]);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!selectedItem) return;
      
      if (e.key === 'ArrowLeft') {
        navigateLightbox('prev');
      } else if (e.key === 'ArrowRight') {
        navigateLightbox('next');
      } else if (e.key === 'Escape') {
        setSelectedItem(null);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedItem, filteredItems]);

  // Lightbox modal
  const renderLightbox = () => {
    if (!selectedItem) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
        <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
          {/* Close button */}
          <button
            onClick={() => setSelectedItem(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <X size={32} />
          </button>

          {/* Previous button */}
          <button
            onClick={() => navigateLightbox('prev')}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
          >
            <ChevronLeft size={48} />
          </button>

          {/* Next button */}
          <button
            onClick={() => navigateLightbox('next')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
          >
            <ChevronRight size={48} />
          </button>

          {/* Media content */}
          <div className="flex flex-col items-center max-h-full">
            {selectedItem.fileType === 'image' ? (
              <img
                src={`/api/gallery/file/${selectedItem.fileName}`}
                alt={selectedItem.title}
                className="max-h-[80vh] max-w-full object-contain"
              />
            ) : (
              <video
                src={`/api/gallery/file/${selectedItem.fileName}`}
                controls
                autoPlay
                className="max-h-[80vh] max-w-full"
              >
                Your browser does not support the video tag.
              </video>
            )}
            
            {/* Title */}
            <div className="mt-4 text-center">
              <h3 className="text-white text-xl font-semibold">{selectedItem.title}</h3>
              <p className="text-gray-300 text-sm mt-1">
                {selectedItem.fileType.toUpperCase()} • 
                {new Date(selectedItem.uploadDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center">Gallery</h1>
          <p className="text-gray-600 text-center mt-2">
            Explore our collection of images and videos
          </p>
        </div>
      </div>

      {/* Filter controls */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => setFilterType('all')}
            className={`px-6 py-2 rounded-full transition-colors ${
              filterType === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            All ({galleryItems.length})
          </button>
          <button
            onClick={() => setFilterType('image')}
            className={`flex items-center gap-2 px-6 py-2 rounded-full transition-colors ${
              filterType === 'image'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Image size={18} />
            Images
          </button>
          <button
            onClick={() => setFilterType('video')}
            className={`flex items-center gap-2 px-6 py-2 rounded-full transition-colors ${
              filterType === 'video'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Play size={18} />
            Videos
          </button>
        </div>
      </div>

      {/* Gallery grid */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              {filterType === 'all' ? (
                <Image size={64} className="mx-auto" />
              ) : filterType === 'image' ? (
                <Image size={64} className="mx-auto" />
              ) : (
                <Play size={64} className="mx-auto" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No {filterType === 'all' ? 'items' : filterType + 's'} found
            </h3>
            <p className="text-gray-500">
              {filterType === 'all' 
                ? 'The gallery is empty. Check back later!'
                : `No ${filterType}s have been uploaded yet.`
              }
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item._id}
                  className="group relative bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-200"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="aspect-square relative overflow-hidden">
                    {item.fileType === 'image' ? (
                      <img
                        src={`/api/gallery/file/${item.fileName}`}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <>
                        <video
                          src={`/api/gallery/file/${item.fileName}`}
                          className="w-full h-full object-cover"
                          muted
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                          <Play size={32} className="text-white opacity-80" />
                        </div>
                      </>
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                      <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {item.fileType === 'image' ? (
                          <Image size={24} />
                        ) : (
                          <Play size={24} />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Title */}
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(item.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => 
                    page === 1 || 
                    page === totalPages || 
                    (page >= currentPage - 2 && page <= currentPage + 2)
                  )
                  .map((page, index, array) => (
                    <React.Fragment key={page}>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="px-2 text-gray-500">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  ))
                }
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Lightbox */}
      {renderLightbox()}
    </div>
  );
};

export default GalleryDisplayPage;