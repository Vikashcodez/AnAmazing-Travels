import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2, Eye, Package, Save, X, Upload, Bold, Italic, List, Users, Video, Calendar, MapPin, Star, Bed, Wind } from 'lucide-react';
import axios from 'axios';

// Mock API functions for packages
const packageAPI = {
  getAllPackages: async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/packages');
      return response.data;
    } catch (error) {
      console.error('Error fetching packages:', error);
      return { success: false, data: [] };
    }
  },
  createPackage: async (formData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/packages', formData);
      return response.data;
    } catch (error) {
      console.error('Error creating package:', error);
      return { success: false };
    }
  },
  updatePackage: async (id, formData) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/packages/${id}`, formData);
      return response.data;
    } catch (error) {
      console.error('Error updating package:', error);
      return { success: false };
    }
  },
  deletePackage: async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/packages/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting package:', error);
      return { success: false };
    }
  }
};

// Vlog API functions
const vlogAPI = {
  getAllVlogs: async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/vlogs');
      return response.data;
    } catch (error) {
      console.error('Error fetching vlogs:', error);
      return { success: false, data: [] };
    }
  },
  createVlog: async (formData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/vlogs', formData);
      return response.data;
    } catch (error) {
      console.error('Error creating vlog:', error);
      return { success: false };
    }
  },
  updateVlog: async (id, formData) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/vlogs/${id}`, formData);
      return response.data;
    } catch (error) {
      console.error('Error updating vlog:', error);
      return { success: false };
    }
  },
  deleteVlog: async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/vlogs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting vlog:', error);
      return { success: false };
    }
  }
};

// Location API functions
const locationAPI = {
  getAllLocations: async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/destinations');
      return response.data;
    } catch (error) {
      console.error('Error fetching locations:', error);
      return { success: false, data: [] };
    }
  },
  createLocation: async (formData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/destinations', formData);
      return response.data;
    } catch (error) {
      console.error('Error creating location:', error);
      return { success: false };
    }
  },
  updateLocation: async (id, formData) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/destinations/${id}`, formData);
      return response.data;
    } catch (error) {
      console.error('Error updating location:', error);
      return { success: false };
    }
  },
  deleteLocation: async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/destinations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting location:', error);
      return { success: false };
    }
  }
};

// Enquiry API functions
const enquiryAPI = {
  getAllEnquiries: async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/enquiries');
      console.log("Raw API response:", response.data);

      // Extract enquiries from the correct field
      return {
        success: true,
        data: Array.isArray(response.data.enquiries) ? response.data.enquiries : []
      };
    } catch (error) {
      console.error('Error fetching enquiries:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch enquiries',
        data: []
      };
    }
  },
  deleteEnquiry: async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/enquiries/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting enquiry:', error);
      throw error;
    }
  }
};

// Booking API functions
const bookingAPI = {
  getAllBookings: async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get('http://localhost:5000/api/bookings/admin/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Map the backend data to frontend expected format
      const bookings = response.data.data.map(booking => ({
        ...booking,
        status: booking.bookingStatus || 'pending',
        package: booking.packageId ? {
          packageName: booking.packageId.packageName,
          thumbnail: booking.packageId.thumbnail
        } : null,
        user: booking.userId ? {
          name: booking.userId.username,
          email: booking.userId.email
        } : null
      }));

      return {
        success: true,
        data: bookings
      };
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch bookings',
        data: []
      };
    }
  },

  updateBookingStatus: async (id, status) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.put(
        `http://localhost:5000/api/bookings/admin/${id}/status`,
        { status },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  },

  updatePaymentStatus: async (id, paymentStatus) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.put(
        `http://localhost:5000/api/bookings/admin/${id}/payment`,
        { paymentStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  },

  deleteBooking: async (id) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.delete(
        `http://localhost:5000/api/bookings/admin/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  }
};

// Hotel API functions
const hotelAPI = {
  getAllHotels: async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/hotels');
      return response.data;
    } catch (error) {
      console.error('Error fetching hotels:', error);
      return { success: false, data: [] };
    }
  },
  createHotel: async (formData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/hotels', formData);
      return response.data;
    } catch (error) {
      console.error('Error creating hotel:', error);
      return { success: false };
    }
  },
  updateHotel: async (id, formData) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/hotels/${id}`, formData);
      return response.data;
    } catch (error) {
      console.error('Error updating hotel:', error);
      return { success: false };
    }
  },
  deleteHotel: async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/hotels/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting hotel:', error);
      return { success: false };
    }
  },
  deleteRoom: async (hotelId, roomId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/hotels/${hotelId}/rooms/${roomId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting room:', error);
      return { success: false };
    }
  }
};
//Gallery Api
const galleryAPI = {
  getAllGalleryItems: async (page = 1, limit = 12, type = 'all') => {
    try {
      const typeParam = type !== 'all' ? `&type=${type}` : '';
      const response = await axios.get(`http://localhost:5000/api/gallery?page=${page}&limit=${limit}${typeParam}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching gallery:', error);
      return { success: false, data: [], totalPages: 1 };
    }
  },
  uploadGalleryItems: async (formData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/gallery/upload', formData);
      return response.data;
    } catch (error) {
      console.error('Error uploading gallery items:', error);
      return { success: false };
    }
  },
  updateGalleryItem: async (id, title) => {
    try {
      const response = await axios.put(`http://localhost: 5000/api/gallery/${id}`, { title });
      return response.data;
    } catch (error) {
      console.error('Error updating gallery item:', error);
      return { success: false };
    }
  },
  deleteGalleryItem: async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/gallery/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      return { success: false };
    }
  }
};

// Rich Text Editor Component
const RichTextEditor = ({ value, onChange, placeholder = "Enter detailed description..." }) => {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isList, setIsList] = useState(false);

  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    const editor = document.getElementById('rich-editor');
    if (editor) {
      onChange(editor.innerHTML);
    }
  };

  const handleKeyUp = () => {
    const editor = document.getElementById('rich-editor');
    if (editor) {
      onChange(editor.innerHTML);
      setIsBold(document.queryCommandState('bold'));
      setIsItalic(document.queryCommandState('italic'));
      setIsList(document.queryCommandState('insertUnorderedList'));
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex gap-2 p-2 bg-gray-50 border-b">
        <button
          type="button"
          onClick={() => applyFormat('bold')}
          className={`p-2 rounded hover:bg-gray-200 ${isBold ? 'bg-gray-300' : ''}`}
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => applyFormat('italic')}
          className={`p-2 rounded hover:bg-gray-200 ${isItalic ? 'bg-gray-300' : ''}`}
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => applyFormat('insertUnorderedList')}
          className={`p-2 rounded hover:bg-gray-200 ${isList ? 'bg-gray-300' : ''}`}
        >
          <List size={16} />
        </button>
      </div>
      <div
        id="rich-editor"
        contentEditable
        className="p-3 min-h-32 outline-none"
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={handleKeyUp}
        onKeyUp={handleKeyUp}
        style={{ minHeight: '120px' }}
        placeholder={placeholder}
      />
    </div>
  );
};

// Package Form Component
const PackageForm = ({ package: editPackage, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    packageName: '',
    shortDescription: '',
    numberOfDays: '',
    numberOfNights: '',
    price: '',
    detailedDescription: ''
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editPackage) {
      setFormData({
        packageName: editPackage.packageName || '',
        shortDescription: editPackage.shortDescription || '',
        numberOfDays: editPackage.numberOfDays || '',
        numberOfNights: editPackage.numberOfNights || '',
        price: editPackage.price || '',
        detailedDescription: editPackage.detailedDescription || ''
      });
      setThumbnailPreview(editPackage.thumbnail || '');
    }
  }, [editPackage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onload = (e) => setThumbnailPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!formData.packageName || !formData.shortDescription || !formData.numberOfDays ||
      !formData.numberOfNights || !formData.price || !formData.detailedDescription) {
      alert('Please fill in all required fields');
      return;
    }

    if (!editPackage && !thumbnail) {
      alert('Please upload a package thumbnail');
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });

      if (thumbnail) {
        submitData.append('thumbnail', thumbnail);
      }

      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {editPackage ? 'Edit Package' : 'Add New Package'}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Package Name *
            </label>
            <input
              type="text"
              name="packageName"
              value={formData.packageName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Package Thumbnail *
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
                id="thumbnail-upload"
              />
              <label
                htmlFor="thumbnail-upload"
                className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
              >
                <Upload size={16} />
                Upload Image
              </label>
              {thumbnailPreview && (
                <img
                  src={thumbnailPreview}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded-lg"
                />
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Days *
            </label>
            <input
              type="number"
              name="numberOfDays"
              value={formData.numberOfDays}
              onChange={handleInputChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Nights *
            </label>
            <input
              type="number"
              name="numberOfNights"
              value={formData.numberOfNights}
              onChange={handleInputChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (₹) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Short Description *
          </label>
          <textarea
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleInputChange}
            rows="3"
            maxLength="200"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <div className="text-sm text-gray-500 mt-1">
            {formData.shortDescription.length}/200 characters
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Detailed Description *
          </label>
          <RichTextEditor
            value={formData.detailedDescription}
            onChange={(value) => setFormData(prev => ({ ...prev, detailedDescription: value }))}
            placeholder="Enter complete package description with bullet points, formatting..."
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
          >
            <Save size={16} />
            {loading ? 'Saving...' : 'Save Package'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Vlog Form Component
const VlogForm = ({ vlog: editVlog, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnail: null,
    thumbnailPreview: '',
    isFeatured: false
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editVlog) {
      setFormData({
        title: editVlog.title || '',
        description: editVlog.description || '',
        videoUrl: editVlog.videoUrl || '',
        thumbnail: null,
        thumbnailPreview: editVlog.thumbnail || '',
        isFeatured: editVlog.isFeatured || false
      });
    }
  }, [editVlog]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        thumbnail: file
      }));
      const reader = new FileReader();
      reader.onload = (e) => setFormData(prev => ({
        ...prev,
        thumbnailPreview: e.target.result
      }));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.videoUrl) {
      alert('Please fill in all required fields');
      return;
    }

    if (!editVlog && !formData.thumbnail) {
      alert('Please upload a thumbnail');
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('videoUrl', formData.videoUrl);
      submitData.append('isFeatured', formData.isFeatured);

      if (formData.thumbnail) {
        submitData.append('thumbnail', formData.thumbnail);
      }

      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {editVlog ? 'Edit Vlog' : 'Add New Vlog'}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Video URL *
          </label>
          <input
            type="url"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="https://www.youtube.com/embed/..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thumbnail *
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="hidden"
              id="thumbnail-upload"
            />
            <label
              htmlFor="thumbnail-upload"
              className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
            >
              <Upload size={16} />
              Upload Thumbnail
            </label>
            {formData.thumbnailPreview && (
              <img
                src={formData.thumbnailPreview}
                alt="Preview"
                className="w-16 h-16 object-cover rounded-lg"
              />
            )}
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="isFeatured"
            checked={formData.isFeatured}
            onChange={handleInputChange}
            id="isFeatured"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-700">
            Featured Vlog
          </label>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
          >
            <Save size={16} />
            {loading ? 'Saving...' : 'Save Vlog'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Location Form Component
const LocationForm = ({ location: editLocation, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    destinationName: '',
    description: '',
    category: '',
    thumbnail: null
  });
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'south-andaman', label: 'South Andaman' },
    { value: 'north-andaman', label: 'North Andaman' },
    { value: 'middle-andaman', label: 'Middle Andaman' }
  ];

  useEffect(() => {
    if (editLocation) {
      setFormData({
        destinationName: editLocation.destinationName || '',
        description: editLocation.description || '',
        category: editLocation.category || '',
        thumbnail: null
      });
      setThumbnailPreview(editLocation.thumbnailUrl || '');
    }
  }, [editLocation]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        thumbnail: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!formData.destinationName || !formData.description || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }

    if (!editLocation && !formData.thumbnail) {
      alert('Please select a thumbnail image');
      return;
    }

    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append('destinationName', formData.destinationName);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('category', formData.category);

    if (formData.thumbnail) {
      formDataToSend.append('thumbnail', formData.thumbnail);
    }

    try {
      await onSubmit(formDataToSend);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {editLocation ? 'Edit Location' : 'Add New Location'}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Destination Name *
          </label>
          <input
            type="text"
            name="destinationName"
            value={formData.destinationName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Destination Thumbnail *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            {thumbnailPreview ? (
              <div className="relative">
                <img
                  src={thumbnailPreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setThumbnailPreview('');
                    setFormData(prev => ({ ...prev, thumbnail: null }));
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <label className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-500">
                    Upload thumbnail image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    required={!editLocation}
                  />
                </label>
                <p className="text-gray-500 text-sm mt-2">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
          >
            <Save size={16} />
            {loading ? 'Saving...' : editLocation ? 'Update Location' : 'Add Location'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Hotel Form Component
const HotelForm = ({ hotel: editHotel, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    hotelName: '',
    hotelLocation: '',
    locationLink: '',
    hotelAddress: '',
    description: '',
    hotelImage: null,
    rooms: []
  });

  const [roomForm, setRoomForm] = useState({
    roomType: 'normal',
    bedType: 'single',
    acType: 'AC',
    price: '',
    images: []
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (editHotel) {
      setFormData({
        hotelName: editHotel.hotelName || '',
        hotelLocation: editHotel.hotelLocation || '',
        locationLink: editHotel.locationLink || '',
        hotelAddress: editHotel.hotelAddress || '',
        description: editHotel.description || '',
        hotelImage: null,
        rooms: editHotel.rooms || []
      });
    }
  }, [editHotel]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleHotelFormChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRoomFormChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setRoomForm(prev => ({ ...prev, [name]: Array.from(files) }));
    } else {
      setRoomForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const addRoomToForm = () => {
    if (!roomForm.price || roomForm.images.length < 3) {
      showMessage('error', 'Please fill all room details and upload minimum 3 images');
      return;
    }

    setFormData(prev => ({
      ...prev,
      rooms: [...prev.rooms, { ...roomForm }]
    }));

    setRoomForm({
      roomType: 'normal',
      bedType: 'single',
      acType: 'AC',
      price: '',
      images: []
    });
    showMessage('success', 'Room added to hotel form');
  };

  const removeRoomFromForm = (index) => {
    setFormData(prev => ({
      ...prev,
      rooms: prev.rooms.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.hotelName || !formData.hotelLocation || !formData.locationLink ||
      !formData.hotelAddress || !formData.description) {
      showMessage('error', 'Please fill all hotel details');
      return;
    }

    if (!editHotel && !formData.hotelImage) {
      showMessage('error', 'Please upload hotel image');
      return;
    }

    if (formData.rooms.length === 0) {
      showMessage('error', 'Please add at least one room');
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('hotelName', formData.hotelName);
      formDataToSend.append('hotelLocation', formData.hotelLocation);
      formDataToSend.append('locationLink', formData.locationLink);
      formDataToSend.append('hotelAddress', formData.hotelAddress);
      formDataToSend.append('description', formData.description);

      if (formData.hotelImage) {
        formDataToSend.append('hotelImage', formData.hotelImage);
      }

      formDataToSend.append('rooms', JSON.stringify(formData.rooms.map(room => ({
        roomType: room.roomType,
        bedType: room.bedType,
        acType: room.acType,
        price: Number(room.price)
      }))));

      // Add room images
      formData.rooms.forEach(room => {
        room.images.forEach(image => {
          formDataToSend.append('roomImages', image);
        });
      });

      await onSubmit(formDataToSend);
    } catch (error) {
      console.error('Error submitting form:', error);
      showMessage('error', 'Error submitting form: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {editHotel ? 'Edit Hotel' : 'Add New Hotel'}
          </h1>
          <button
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Back
          </button>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Hotel Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hotel Name *</label>
                <input
                  type="text"
                  name="hotelName"
                  value={formData.hotelName}
                  onChange={handleHotelFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hotel Location *</label>
                <input
                  type="text"
                  name="hotelLocation"
                  value={formData.hotelLocation}
                  onChange={handleHotelFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location Link *</label>
                <input
                  type="url"
                  name="locationLink"
                  value={formData.locationLink}
                  onChange={handleHotelFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {editHotel ? 'Hotel Image (Leave blank to keep current)' : 'Hotel Image *'}
                </label>
                <input
                  type="file"
                  name="hotelImage"
                  accept="image/*"
                  onChange={handleHotelFormChange}
                  required={!editHotel}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Hotel Address *</label>
                <input
                  type="text"
                  name="hotelAddress"
                  value={formData.hotelAddress}
                  onChange={handleHotelFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleHotelFormChange}
                  required
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Room</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
                <select
                  name="roomType"
                  value={roomForm.roomType}
                  onChange={handleRoomFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="normal">Normal</option>
                  <option value="deluxe">Deluxe</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bed Type</label>
                <select
                  name="bedType"
                  value={roomForm.bedType}
                  onChange={handleRoomFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">AC Type</label>
                <select
                  name="acType"
                  value={roomForm.acType}
                  onChange={handleRoomFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="AC">AC</option>
                  <option value="Non-AC">Non-AC</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={roomForm.price}
                  onChange={handleRoomFormChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="md:col-span-2 lg:col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Room Images (minimum 3) *</label>
                <input
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleRoomFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={addRoomToForm}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Add Room to Hotel
              </button>
            </div>
          </div>

          {formData.rooms.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Added Rooms ({formData.rooms.length})</h2>
              <div className="space-y-4">
                {formData.rooms.map((room, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium capitalize">{room.roomType}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Bed className="h-4 w-4 text-blue-500" />
                        <span className="capitalize">{room.bedType}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Wind className="h-4 w-4 text-green-500" />
                        <span>{room.acType}</span>
                      </div>
                      <div className="font-bold text-green-600">₹{room.price}</div>
                      <div className="text-sm text-gray-500">{room.images.length} images</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeRoomFromForm(index)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
            >
              {isLoading ? (editHotel ? 'Updating Hotel...' : 'Creating Hotel...') : (editHotel ? 'Update Hotel' : 'Submit Hotel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Hotel List Component
const HotelList = ({ hotels, onEdit, onDelete, onViewRooms }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteHotelId, setDeleteHotelId] = useState(null);

  const handleDeleteClick = (id) => {
    setDeleteHotelId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteHotelId) {
      onDelete(deleteHotelId);
      setShowDeleteModal(false);
      setDeleteHotelId(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-800">All Hotels ({hotels.length})</h2>
      </div>

      <div className="p-6">
        {hotels.length === 0 ? (
          <div className="text-center py-8">
            <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No hotels found. Add your first hotel!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <div key={hotel._id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                  {hotel.hotelImage ? (
                    <img
                      src={`http://localhost:5000/uploads/${hotel.hotelImage}`}
                      alt={hotel.hotelName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <MapPin size={48} className="text-gray-400" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{hotel.hotelName}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{hotel.hotelLocation}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{hotel.description}</p>
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-sm text-gray-500">
                      {hotel.rooms.length} rooms
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <button
                      onClick={() => onEdit(hotel)}
                      className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => onViewRooms(hotel)}
                      className="flex items-center gap-1 px-3 py-1 text-green-600 hover:bg-green-50 rounded"
                    >
                      <Eye size={16} />
                      View Rooms
                    </button>
                    <button
                      onClick={() => handleDeleteClick(hotel._id)}
                      className="flex items-center gap-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this hotel? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Hotel Rooms Component
const HotelRooms = ({ hotel, onDeleteRoom, onAddRoom, onBack }) => {
  const [roomForm, setRoomForm] = useState({
    roomType: 'normal',
    bedType: 'single',
    acType: 'AC',
    price: '',
    images: []
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleRoomFormChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setRoomForm(prev => ({ ...prev, [name]: Array.from(files) }));
    } else {
      setRoomForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddRoom = async () => {
    if (!roomForm.price || roomForm.images.length < 3) {
      showMessage('error', 'Please fill all room details and upload minimum 3 images');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('roomType', roomForm.roomType);
      formData.append('bedType', roomForm.bedType);
      formData.append('acType', roomForm.acType);
      formData.append('price', roomForm.price);

      roomForm.images.forEach(image => {
        formData.append('roomImages', image);
      });

      await onAddRoom(hotel._id, formData);

      setRoomForm({
        roomType: 'normal',
        bedType: 'single',
        acType: 'AC',
        price: '',
        images: []
      });

      showMessage('success', 'Room added successfully');
    } catch (error) {
      console.error('Error adding room:', error);
      showMessage('error', 'Error adding room: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;

    try {
      await onDeleteRoom(hotel._id, roomId);
      showMessage('success', 'Room deleted successfully');
    } catch (error) {
      console.error('Error deleting room:', error);
      showMessage('error', 'Error deleting room: ' + error.message);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {hotel.hotelName} - Rooms ({hotel.rooms.length})
          </h2>
          <button
            onClick={onBack}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Back to Hotels
          </button>
        </div>
      </div>

      <div className="p-6">
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Room</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
              <select
                name="roomType"
                value={roomForm.roomType}
                onChange={handleRoomFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="normal">Normal</option>
                <option value="deluxe">Deluxe</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bed Type</label>
              <select
                name="bedType"
                value={roomForm.bedType}
                onChange={handleRoomFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="single">Single</option>
                <option value="double">Double</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">AC Type</label>
              <select
                name="acType"
                value={roomForm.acType}
                onChange={handleRoomFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="AC">AC</option>
                <option value="Non-AC">Non-AC</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={roomForm.price}
                onChange={handleRoomFormChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="md:col-span-2 lg:col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Room Images (minimum 3) *</label>
              <input
                type="file"
                name="images"
                accept="image/*"
                multiple
                onChange={handleRoomFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={handleAddRoom}
              disabled={isLoading}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
            >
              {isLoading ? 'Adding Room...' : 'Add Room'}
            </button>
          </div>
        </div>

        {hotel.rooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotel.rooms.map((room) => (
              <div key={room._id} className="border rounded-lg overflow-hidden">
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                  {room.images && room.images.length > 0 ? (
                    <img
                      src={`http://localhost:5000/uploads/${room.images[0]}`}
                      alt={`Room ${room.roomType}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Bed size={48} className="text-gray-400" />
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium capitalize">{room.roomType}</span>
                    </div>
                    <div className="font-bold text-green-600">₹{room.price}</div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <Bed className="h-4 w-4" />
                      <span className="capitalize">{room.bedType}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Wind className="h-4 w-4" />
                      <span>{room.acType}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-3">
                    {room.images?.length || 0} images
                  </div>
                  <button
                    onClick={() => handleDeleteRoom(room._id)}
                    className="w-full bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                  >
                    <Trash2 size={16} />
                    Delete Room
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Bed size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No rooms added yet. Add the first room above.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Vlog List Component
const VlogList = ({ vlogs, onEdit, onDelete }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteVlogId, setDeleteVlogId] = useState(null);

  const handleDeleteClick = (id) => {
    setDeleteVlogId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteVlogId) {
      onDelete(deleteVlogId);
      setShowDeleteModal(false);
      setDeleteVlogId(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-800">All Vlogs</h2>
      </div>

      <div className="p-6">
        {vlogs.length === 0 ? (
          <div className="text-center py-8">
            <Video size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No vlogs found. Add your first vlog!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vlogs.map((vlog) => (
              <div key={vlog._id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden relative">
                  {vlog.thumbnail ? (
                    <img
                      src={`http://localhost:5000/${vlog.thumbnail.replace(/\\/g, '/')}`}
                      alt={vlog.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/fallback-thumbnail.jpg";
                      }}
                    />
                  ) : (
                    <Video size={48} className="text-gray-400" />
                  )}

                  {vlog.isFeatured && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{vlog.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{vlog.description}</p>
                  <div className="flex justify-between">
                    <button
                      onClick={() => onEdit(vlog)}
                      className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(vlog._id)}
                      className="flex items-center gap-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this vlog? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Package List Component
const PackageList = ({ packages, onEdit, onDelete }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePackageId, setDeletePackageId] = useState(null);

  const handleDeleteClick = (id) => {
    setDeletePackageId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deletePackageId) {
      onDelete(deletePackageId);
      setShowDeleteModal(false);
      setDeletePackageId(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-800">All Packages</h2>
      </div>

      <div className="p-6">
        {packages.length === 0 ? (
          <div className="text-center py-8">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No packages found. Add your first package!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div key={pkg._id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                  {pkg.thumbnail ? (
                    <img
                      src={`http://localhost:5000/${pkg.thumbnail.replace(/\\/g, '/')}`}
                      alt={pkg.packageName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/fallback-thumbnail.jpg';
                      }}
                    />
                  ) : (
                    <Package size={48} className="text-gray-400" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{pkg.packageName}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{pkg.shortDescription}</p>
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-sm text-gray-500">
                      {pkg.numberOfDays} Days / {pkg.numberOfNights} Nights
                    </div>
                    <div className="font-bold text-green-600">₹{pkg.price}</div>
                  </div>
                  <div className="flex justify-between">
                    <button
                      onClick={() => onEdit(pkg)}
                      className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(pkg._id)}
                      className="flex items-center gap-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this package? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Location List Component
const LocationList = ({ locations, onEdit, onDelete }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLocationId, setDeleteLocationId] = useState(null);

  const handleDeleteClick = (id) => {
    setDeleteLocationId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteLocationId) {
      onDelete(deleteLocationId);
      setShowDeleteModal(false);
      setDeleteLocationId(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-800">All Locations ({locations.length})</h2>
      </div>

      <div className="p-6">
        {locations.length === 0 ? (
          <div className="text-center py-8">
            <Eye size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No locations found. Add your first location!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((location) => (
              <div key={location._id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                  {location.thumbnailUrl ? (
                    <img
                      src={`http://localhost:5000${location.thumbnailUrl}`}
                      alt={location.destinationName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Eye size={48} className="text-gray-400" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{location.destinationName}</h3>
                  <p className="text-sm text-blue-600 mb-2 capitalize">
                    {location.category.replace('-', ' ')}
                  </p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {location.description}
                  </p>
                  <div className="flex justify-between">
                    <button
                      onClick={() => onEdit(location)}
                      className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(location._id)}
                      className="flex items-center gap-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this location? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Enquiry List Component
const EnquiryList = ({ enquiries = [], onDelete }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteEnquiryId, setDeleteEnquiryId] = useState(null);

  // Convert enquiries to array if it's not already
  const enquiryList = Array.isArray(enquiries) ? enquiries : [];

  const handleDeleteClick = (id) => {
    setDeleteEnquiryId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteEnquiryId) {
      onDelete(deleteEnquiryId);
      setShowDeleteModal(false);
      setDeleteEnquiryId(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-800">
          All Enquiries ({enquiryList.length})
        </h2>
      </div>

      <div className="p-6">
        {enquiryList.length === 0 ? (
          <div className="text-center py-8">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No enquiries found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destinations</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Travel Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {enquiryList.map((enquiry) => (
                  <tr key={enquiry._id || Math.random()} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {enquiry.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {enquiry.email || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {enquiry.phone || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {Array.isArray(enquiry.destinations)
                        ? enquiry.destinations.join(', ')
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {enquiry.travelDate
                        ? new Date(enquiry.travelDate).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleDeleteClick(enquiry._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Enquiry"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this enquiry? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Booking List Component
const BookingList = ({ bookings, onStatusUpdate, onDelete }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteBookingId, setDeleteBookingId] = useState(null);
  const [loadingStatusUpdate, setLoadingStatusUpdate] = useState(null);

  const handleDeleteClick = (id) => {
    setDeleteBookingId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteBookingId) {
      onDelete(deleteBookingId);
      setShowDeleteModal(false);
      setDeleteBookingId(null);
    }
  };

  const handleStatusChange = async (id, status) => {
    setLoadingStatusUpdate(id);
    try {
      await onStatusUpdate(id, status);
    } catch (error) {
      console.error('Error updating status:', error);
      // You might want to show an error notification here
    } finally {
      setLoadingStatusUpdate(null);
    }
  };

  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';

    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate end date based on travelDate and numberOfDays
  const getEndDate = (travelDate, numberOfDays) => {
    if (!travelDate || !numberOfDays) return null;
    const date = new Date(travelDate);
    date.setDate(date.getDate() + (numberOfDays - 1));
    return date;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-800">All Bookings ({bookings.length})</h2>
      </div>

      <div className="p-6">
        {bookings.length === 0 ? (
          <div className="text-center py-8">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No bookings found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => {
                  const endDate = booking.endDate || getEndDate(booking.travelDate, booking.numberOfDays);
                  return (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {booking._id?.substring(18, 24) || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.user?.name || booking.userDetails?.username || 'N/A'}
                        <div className="text-xs text-gray-400">
                          {booking.user?.email || booking.userDetails?.email || ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.package?.packageName || booking.packageName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>From: {booking.travelDate ? new Date(booking.travelDate).toLocaleDateString() : 'N/A'}</div>
                        {endDate && (
                          <div>To: {new Date(endDate).toLocaleDateString()}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Adults: {booking.adults || booking.numberOfPeople || 0}<br />
                        Children: {booking.children || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{booking.totalAmount || booking.price || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {loadingStatusUpdate === booking._id ? (
                          <div className="animate-pulse">Updating...</div>
                        ) : (
                          <select
                            value={booking.status || 'pending'}
                            onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                            className={`${getStatusColor(booking.status)} text-sm font-medium px-2.5 py-0.5 rounded capitalize`}
                            disabled={loadingStatusUpdate === booking._id}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="completed">Completed</option>
                          </select>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleDeleteClick(booking._id)}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          title="Delete Booking"
                          disabled={loadingStatusUpdate === booking._id}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this booking? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
// Gallery Add View Component
const GalleryAddView = ({
  handleFileSelection,
  uploadFiles,
  updateFileTitle,
  removeFile,
  handleGalleryUpload,
  galleryLoading,
  setCurrentView
}) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-gray-800">Add Pictures & Videos</h2>
      <button
        onClick={() => setCurrentView('dashboard')}
        className="text-gray-500 hover:text-gray-700"
      >
        <X size={24} />
      </button>
    </div>

    <div className="mb-6">
      <label className="block w-full">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors">
          <Plus className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-lg text-gray-600">Click to select files or drag and drop</p>
          <p className="text-sm text-gray-500 mt-2">Supports images and videos (Max 50MB each)</p>
        </div>
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileSelection}
          className="hidden"
        />
      </label>
    </div>

    {uploadFiles.length > 0 && (
      <div className="space-y-4 mb-6">
        <h3 className="text-lg font-semibold">Selected Files ({uploadFiles.length})</h3>
        <div className="grid gap-4 max-h-96 overflow-y-auto">
          {uploadFiles.map((fileObj) => (
            <div key={fileObj.id} className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="flex-shrink-0">
                {fileObj.file.type.startsWith('image/') ? (
                  <img
                    src={fileObj.preview}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded"
                  />
                ) : (
                  <video
                    src={fileObj.preview}
                    className="w-16 h-16 object-cover rounded"
                    muted
                  />
                )}
              </div>
              <div className="flex-grow">
                <p className="font-medium text-gray-700">{fileObj.file.name}</p>
                <p className="text-sm text-gray-500">
                  {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <input
                  type="text"
                  placeholder="Enter title for this file"
                  value={fileObj.title}
                  onChange={(e) => updateFileTitle(fileObj.id, e.target.value)}
                  className="mt-2 w-full px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => removeFile(fileObj.id)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    )}

    {uploadFiles.length > 0 && (
      <button
        onClick={handleGalleryUpload}
        disabled={galleryLoading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
      >
        {galleryLoading ? 'Uploading...' : `Upload ${uploadFiles.length} File(s)`}
      </button>
    )}
  </div>
);

// Gallery View Component
const GalleryView = () => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-gray-800">Gallery Items</h2>
      <button
        onClick={() => setCurrentView('dashboard')}
        className="text-gray-500 hover:text-gray-700"
      >
        <X size={24} />
      </button>
    </div>

    <div className="flex gap-4 mb-6">
      <select
        value={galleryFilterType}
        onChange={(e) => {
          setGalleryFilterType(e.target.value);
          setCurrentGalleryPage(1);
          loadGalleryItems();
        }}
        className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">All Files</option>
        <option value="image">Images Only</option>
        <option value="video">Videos Only</option>
      </select>
    </div>

    {galleryLoading ? (
      <div className="text-center py-8">Loading...</div>
    ) : (
      <>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {galleryItems.map((item) => (
            <div key={item._id} className="border rounded-lg overflow-hidden">
              <div className="aspect-video bg-gray-100 relative">
                {item.fileType === 'image' ? (
                  <img
                    src={`http://localhost:5000/api/gallery/file/${item.fileName}`}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={`http://localhost:5000/api/gallery/file/${item.fileName}`}
                    className="w-full h-full object-cover"
                    controls
                  />
                )}
              </div>
              <div className="p-4">
                {editingGalleryItem === item._id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      defaultValue={item.title}
                      className="flex-grow px-2 py-1 border rounded"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleGalleryUpdate(item._id, e.target.value);
                        }
                      }}
                      id={`edit-${item._id}`}
                    />
                    <button
                      onClick={() => {
                        const input = document.getElementById(`edit-${item._id}`);
                        handleGalleryUpdate(item._id, input.value);
                      }}
                      className="text-green-600 hover:text-green-800"
                    >
                      <Save size={18} />
                    </button>
                    <button
                      onClick={() => setEditingGalleryItem(null)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-500 mb-3">
                      {item.fileType.toUpperCase()} • {(item.fileSize / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingGalleryItem(item._id)}
                        className="flex items-center gap-1 px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                      >
                        <Edit2 size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleGalleryDelete(item._id)}
                        className="flex items-center gap-1 px-3 py-1 text-red-600 border border-red-600 rounded hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {totalGalleryPages > 1 && (
          <div className="flex justify-center gap-2">
            {Array.from({ length: totalGalleryPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => {
                  setCurrentGalleryPage(page);
                  loadGalleryItems();
                }}
                className={`px-3 py-1 rounded ${currentGalleryPage === page
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </>
    )}
  </div>
);

// Main Admin Dashboard Component
const AdminDashboard = () => {
  const { user } = useAuth();

  // User management state
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUsers, setShowUsers] = useState(false);

  // Package management state
  const [currentView, setCurrentView] = useState('dashboard');
  const [packages, setPackages] = useState([]);
  const [editingPackage, setEditingPackage] = useState(null);
  const [packageLoading, setPackageLoading] = useState(false);

  // Vlog management state
  const [vlogs, setVlogs] = useState([]);
  const [editingVlog, setEditingVlog] = useState(null);
  const [vlogLoading, setVlogLoading] = useState(false);

  // Location management state
  const [locations, setLocations] = useState([]);
  const [editingLocation, setEditingLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

  // Hotel management state
  const [hotels, setHotels] = useState([]);
  const [editingHotel, setEditingHotel] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [hotelLoading, setHotelLoading] = useState(false);

  // Enquiry management state
  const [enquiries, setEnquiries] = useState([]);
  const [enquiryLoading, setEnquiryLoading] = useState(false);

  // Booking management state
  const [bookings, setBookings] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);

  //gallery mangement
  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [editingGalleryItem, setEditingGalleryItem] = useState(null);
  const [currentGalleryPage, setCurrentGalleryPage] = useState(1);
  const [totalGalleryPages, setTotalGalleryPages] = useState(1);
  const [galleryFilterType, setGalleryFilterType] = useState('all');



  // Existing user functionality
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/admin/users');
      setUsers(response.data.users);
      setCurrentView('users');
      setShowUsers(true);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  // Package management functions
  const loadPackages = async () => {
    setPackageLoading(true);
    try {
      const response = await packageAPI.getAllPackages();
      if (response.success) {
        setPackages(response.data);
      }
    } catch (error) {
      console.error('Error loading packages:', error);
    } finally {
      setPackageLoading(false);
    }
  };

  const handleAddPackage = async (formData) => {
    try {
      const response = await packageAPI.createPackage(formData);
      if (response.success) {
        await loadPackages();
        setCurrentView('packages-list');
        alert('Package added successfully!');
      } else {
        alert('Error adding package. Please try again.');
      }
    } catch (error) {
      console.error('Error adding package:', error);
      alert('Error adding package. Please try again.');
    }
  };

  const handleEditPackage = async (formData) => {
    try {
      const response = await packageAPI.updatePackage(editingPackage._id, formData);
      if (response.success) {
        await loadPackages();
        setCurrentView('packages-list');
        setEditingPackage(null);
        alert('Package updated successfully!');
      } else {
        alert('Error updating package. Please try again.');
      }
    } catch (error) {
      console.error('Error updating package:', error);
      alert('Error updating package. Please try again.');
    }
  };

  const handleDeletePackage = async (id) => {
    try {
      const response = await packageAPI.deletePackage(id);
      if (response.success) {
        await loadPackages();
        alert('Package deleted successfully!');
      } else {
        alert('Error deleting package. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting package:', error);
      alert('Error deleting package. Please try again.');
    }
  };

  // Vlog management functions
  const loadVlogs = async () => {
    setVlogLoading(true);
    try {
      const response = await vlogAPI.getAllVlogs();
      if (response.success && Array.isArray(response.data)) {
        setVlogs(response.data);
      } else if (Array.isArray(response)) {
        setVlogs(response);
      } else if (Array.isArray(response.data)) {
        setVlogs(response.data);
      } else {
        setVlogs([]);
        console.error('Unexpected response format:', response);
      }
    } catch (error) {
      console.error('Error loading vlogs:', error);
      setVlogs([]);
    } finally {
      setVlogLoading(false);
    }
  };

  const handleAddVlog = async (formData) => {
    try {
      const response = await vlogAPI.createVlog(formData);
      if (response.success || response._id || response.data) {
        await loadVlogs();
        setCurrentView('vlogs-list');
        alert('Vlog added successfully!');
      } else {
        alert('Error adding vlog. Please try again.');
      }
    } catch (error) {
      console.error('Error adding vlog:', error);
      alert('Error adding vlog. Please try again.');
    }
  };

  const handleEditVlog = async (formData) => {
    try {
      const response = await vlogAPI.updateVlog(editingVlog._id, formData);
      if (response.success) {
        await loadVlogs();
        setCurrentView('vlogs-list');
        setEditingVlog(null);
        alert('Vlog updated successfully!');
      } else {
        alert('Error updating vlog. Please try again.');
      }
    } catch (error) {
      console.error('Error updating vlog:', error);
      alert('Error updating vlog. Please try again.');
    }
  };

  const handleDeleteVlog = async (id) => {
    try {
      const response = await vlogAPI.deleteVlog(id);
      if (response.success) {
        await loadVlogs();
        alert('Vlog deleted successfully!');
      } else {
        alert('Error deleting vlog. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting vlog:', error);
      alert('Error deleting vlog. Please try again.');
    }
  };

  // Location management functions
  const loadLocations = async () => {
    setLocationLoading(true);
    try {
      const response = await locationAPI.getAllLocations();
      if (response.success) {
        setLocations(response.data);
      }
    } catch (error) {
      console.error('Error loading locations:', error);
    } finally {
      setLocationLoading(false);
    }
  };

  const handleAddLocation = async (formData) => {
    try {
      const response = await locationAPI.createLocation(formData);
      if (response.success) {
        await loadLocations();
        setCurrentView('locations-list');
        alert('Location added successfully!');
      } else {
        alert('Error adding location. Please try again.');
      }
    } catch (error) {
      console.error('Error adding location:', error);
      alert('Error adding location. Please try again.');
    }
  };

  const handleEditLocation = async (formData) => {
    try {
      const response = await locationAPI.updateLocation(editingLocation._id, formData);
      if (response.success) {
        await loadLocations();
        setCurrentView('locations-list');
        setEditingLocation(null);
        alert('Location updated successfully!');
      } else {
        alert('Error updating location. Please try again.');
      }
    } catch (error) {
      console.error('Error updating location:', error);
      alert('Error updating location. Please try again.');
    }
  };

  const handleDeleteLocation = async (id) => {
    try {
      const response = await locationAPI.deleteLocation(id);
      if (response.success) {
        await loadLocations();
        alert('Location deleted successfully!');
      } else {
        alert('Error deleting location. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting location:', error);
      alert('Error deleting location. Please try again.');
    }
  };

  // Hotel management functions
  const loadHotels = async () => {
    setHotelLoading(true);
    try {
      const response = await hotelAPI.getAllHotels();
      if (response.success) {
        setHotels(response.data);
      }
    } catch (error) {
      console.error('Error loading hotels:', error);
    } finally {
      setHotelLoading(false);
    }
  };

  const handleAddHotel = async (formData) => {
    try {
      const response = await hotelAPI.createHotel(formData);
      if (response.success) {
        await loadHotels();
        setCurrentView('hotels-list');
        alert('Hotel added successfully!');
      } else {
        alert('Error adding hotel. Please try again.');
      }
    } catch (error) {
      console.error('Error adding hotel:', error);
      alert('Error adding hotel. Please try again.');
    }
  };

  const handleEditHotel = async (formData) => {
    try {
      const response = await hotelAPI.updateHotel(editingHotel._id, formData);
      if (response.success) {
        await loadHotels();
        setCurrentView('hotels-list');
        setEditingHotel(null);
        alert('Hotel updated successfully!');
      } else {
        alert('Error updating hotel. Please try again.');
      }
    } catch (error) {
      console.error('Error updating hotel:', error);
      alert('Error updating hotel. Please try again.');
    }
  };

  const handleDeleteHotel = async (id) => {
    try {
      const response = await hotelAPI.deleteHotel(id);
      if (response.success) {
        await loadHotels();
        alert('Hotel deleted successfully!');
      } else {
        alert('Error deleting hotel. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting hotel:', error);
      alert('Error deleting hotel. Please try again.');
    }
  };

  const handleAddRoom = async (hotelId, formData) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/hotels/${hotelId}/rooms`, formData);
      if (response.data.success) {
        await loadHotels();
        // Update the selected hotel with the new room
        setSelectedHotel(response.data.data);
        alert('Room added successfully!');
      } else {
        alert('Error adding room. Please try again.');
      }
    } catch (error) {
      console.error('Error adding room:', error);
      alert('Error adding room. Please try again.');
    }
  };

  const handleDeleteRoom = async (hotelId, roomId) => {
    try {
      const response = await hotelAPI.deleteRoom(hotelId, roomId);
      if (response.success) {
        await loadHotels();
        // Update the selected hotel if it's the one we're viewing
        if (selectedHotel && selectedHotel._id === hotelId) {
          setSelectedHotel(response.data);
        }
        alert('Room deleted successfully!');
      } else {
        alert('Error deleting room. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting room:', error);
      alert('Error deleting room. Please try again.');
    }
  };

  // Enquiry management functions
  const loadEnquiries = async () => {
    setEnquiryLoading(true);
    try {
      const response = await enquiryAPI.getAllEnquiries();
      console.log("Processed response:", response);

      if (response.success) {
        if (response.data.length === 0) {
          console.warn("No enquiries found (empty array)");
        }
        setEnquiries(response.data);
      } else {
        console.error("API Error:", response.message);
        alert(response.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert('Failed to load enquiries');
    } finally {
      setEnquiryLoading(false);
    }
  };

  const handleDeleteEnquiry = async (id) => {
    try {
      const response = await enquiryAPI.deleteEnquiry(id);
      if (response.success) {
        await loadEnquiries();
        alert('Enquiry deleted successfully!');
      } else {
        alert('Error deleting enquiry. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting enquiry:', error);
      alert('Error deleting enquiry. Please try again.');
    }
  };

  // Gallery management functions 
  const loadGalleryItems = async () => {
    setGalleryLoading(true);
    try {
      const response = await galleryAPI.getAllGalleryItems(currentGalleryPage, 12, galleryFilterType);
      if (response.success) {
        setGalleryItems(response.data || []);
        setTotalGalleryPages(response.totalPages || 1);
      }
    } catch (error) {
      console.error('Error loading gallery items:', error);
    } finally {
      setGalleryLoading(false);
    }
  };

  const handleFileSelection = (event) => {
    const files = Array.from(event.target.files);
    const fileObjects = files.map((file, index) => ({
      id: Date.now() + index,
      file: file,
      title: '',
      preview: URL.createObjectURL(file)
    }));
    setUploadFiles(prev => [...prev, ...fileObjects]);
  };

  const updateFileTitle = (id, title) => {
    setUploadFiles(prev =>
      prev.map(file => file.id === id ? { ...file, title } : file)
    );
  };

  const removeFile = (id) => {
    setUploadFiles(prev => {
      const fileToRemove = prev.find(file => file.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(file => file.id !== id);
    });
  };

  const handleGalleryUpload = async () => {
    if (uploadFiles.length === 0) return;

    const formData = new FormData();

    uploadFiles.forEach((fileObj) => {
      formData.append('files', fileObj.file);
      formData.append('titles', fileObj.title || fileObj.file.name);
    });

    setGalleryLoading(true);
    try {
      const response = await galleryAPI.uploadGalleryItems(formData);
      if (response.success) {
        alert('Files uploaded successfully!');
        // Clean up preview URLs
        uploadFiles.forEach(fileObj => URL.revokeObjectURL(fileObj.preview));
        setUploadFiles([]);
        loadGalleryItems();
        setCurrentView('gallery-view');
      } else {
        alert(response.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    } finally {
      setGalleryLoading(false);
    }
  };

  const handleGalleryDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await galleryAPI.deleteGalleryItem(id);
      if (response.success) {
        alert('Item deleted successfully!');
        loadGalleryItems();
      } else {
        alert('Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Delete failed');
    }
  };

  const handleGalleryUpdate = async (id, title) => {
    try {
      const response = await galleryAPI.updateGalleryItem(id, title);
      if (response.success) {
        alert('Item updated successfully!');
        setEditingGalleryItem(null);
        loadGalleryItems();
      } else {
        alert('Update failed');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Update failed');
    }
  };



  // Booking management functions
  const loadBookings = async () => {
    setBookingLoading(true);
    try {
      const response = await bookingAPI.getAllBookings();
      if (response.success) {
        setBookings(response.data);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleUpdateBookingStatus = async (id, status) => {
    try {
      const response = await bookingAPI.updateBookingStatus(id, status);
      if (response.success) {
        await loadBookings();
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const handleDeleteBooking = async (id) => {
    try {
      const response = await bookingAPI.deleteBooking(id);
      if (response.success) {
        await loadBookings();
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  const handleShowEnquiries = () => {
    setCurrentView('enquiries-list');
    loadEnquiries();
  };

  const handleShowBookings = () => {
    setCurrentView('bookings-list');
    loadBookings();
  };

  const handleEditVlogClick = (vlog) => {
    setEditingVlog(vlog);
    setCurrentView('vlogs-edit');
  };

  const handleShowVlogs = () => {
    setCurrentView('vlogs-list');
    loadVlogs();
  };

  const handleShowPackages = () => {
    setCurrentView('packages-list');
    loadPackages();
  };

  const handleShowLocations = () => {
    setCurrentView('locations-list');
    loadLocations();
  };

  const handleShowHotels = () => {
    setCurrentView('hotels-list');
    loadHotels();
  };

  const handleEditClick = (packageItem) => {
    setEditingPackage(packageItem);
    setCurrentView('packages-edit');
  };

  const handleEditLocationClick = (location) => {
    setEditingLocation(location);
    setCurrentView('locations-edit');
  };

  const handleEditHotelClick = (hotel) => {
    setEditingHotel(hotel);
    setCurrentView('hotels-edit');
  };

  const handleViewHotelRooms = (hotel) => {
    setSelectedHotel(hotel);
    setCurrentView('hotel-rooms');
  };



  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Admin Dashboard
            </h1>

            {/* Dashboard Home View */}
            {currentView === 'dashboard' && (
              <>
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Welcome, {user?.name}!
                  </h2>
                  <p className="text-gray-600 mb-6">
                    You have admin access to manage users, packages, vlogs, locations, hotels, enquiries, bookings and system settings.
                  </p>
                </div>

                {/* Navigation Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {/* User Management Card */}
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <div className="flex items-center mb-4">
                      <Users size={24} className="text-blue-600 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-800">User Management</h3>
                    </div>
                    <p className="text-gray-600 mb-4">View and manage all registered users</p>
                    <button
                      onClick={fetchUsers}
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      <Users size={16} />
                      {loading ? 'Loading...' : 'Manage Users'}
                    </button>
                  </div>

                  {/* Package Management Card */}
                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <div className="flex items-center mb-4">
                      <Package size={24} className="text-green-600 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-800">Package Management</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Add, edit, and manage travel packages</p>
                    <div className="space-y-2">
                      <button
                        onClick={() => setCurrentView('packages-add')}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors flex items-center gap-2 justify-center"
                      >
                        <Plus size={16} />
                        Add Package
                      </button>
                      <button
                        onClick={handleShowPackages}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors flex items-center gap-2 justify-center"
                      >
                        <Eye size={16} />
                        View Packages
                      </button>
                    </div>
                  </div>

                  {/* Vlog Management Card */}
                  <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                    <div className="flex items-center mb-4">
                      <Video size={24} className="text-purple-600 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-800">Vlog Management</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Add, edit, and manage video blogs</p>
                    <div className="space-y-2">
                      <button
                        onClick={() => setCurrentView('vlogs-add')}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors flex items-center gap-2 justify-center"
                      >
                        <Plus size={16} />
                        Add Vlog
                      </button>
                      <button
                        onClick={handleShowVlogs}
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded transition-colors flex items-center gap-2 justify-center"
                      >
                        <Eye size={16} />
                        View Vlogs
                      </button>
                    </div>
                  </div>

                  {/* Location Management Card */}
                  <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                    <div className="flex items-center mb-4">
                      <Eye size={24} className="text-yellow-600 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-800">Location Management</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Add, edit, and manage popular destinations</p>
                    <div className="space-y-2">
                      <button
                        onClick={() => setCurrentView('locations-add')}
                        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded transition-colors flex items-center gap-2 justify-center"
                      >
                        <Plus size={16} />
                        Add Location
                      </button>
                      <button
                        onClick={handleShowLocations}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition-colors flex items-center gap-2 justify-center"
                      >
                        <Eye size={16} />
                        View Locations
                      </button>
                    </div>
                  </div>

                  {/* Hotel Management Card */}
                  <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
                    <div className="flex items-center mb-4">
                      <MapPin size={24} className="text-indigo-600 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-800">Hotel Management</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Add, edit, and manage hotels and rooms</p>
                    <div className="space-y-2">
                      <button
                        onClick={() => setCurrentView('hotels-add')}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors flex items-center gap-2 justify-center"
                      >
                        <Plus size={16} />
                        Add Hotel
                      </button>
                      <button
                        onClick={handleShowHotels}
                        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded transition-colors flex items-center gap-2 justify-center"
                      >
                        <Eye size={16} />
                        View Hotels
                      </button>
                    </div>
                  </div>

                  {/* Enquiry Management Card */}
                  <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                    <div className="flex items-center mb-4">
                      <Users size={24} className="text-orange-600 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-800">Enquiry Management</h3>
                    </div>
                    <p className="text-gray-600 mb-4">View and manage all travel enquiries</p>
                    <button
                      onClick={handleShowEnquiries}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded transition-colors flex items-center gap-2 justify-center"
                    >
                      <Eye size={16} />
                      View Enquiries
                    </button>
                  </div>

                  {/* Gallery Management Card */}
                  <div className="bg-teal-50 p-6 rounded-lg border border-teal-200">
                    <div className="flex items-center mb-4">
                      <Upload size={24} className="text-teal-600 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-800">Gallery Management</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Add and manage gallery images and videos</p>
                    <div className="space-y-2">
                      <button
                        onClick={() => setCurrentView('gallery-add')}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded transition-colors flex items-center gap-2 justify-center"
                      >
                        <Plus size={16} />
                        Add Media
                      </button>
                      <button
                        onClick={() => {
                          setCurrentView('gallery-view');
                          loadGalleryItems();
                        }}
                        className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded transition-colors flex items-center gap-2 justify-center"
                      >
                        <Eye size={16} />
                        View Gallery
                      </button>
                    </div>
                  </div>

                  {/* Booking Management Card */}
                  <div className="bg-pink-50 p-6 rounded-lg border border-pink-200">
                    <div className="flex items-center mb-4">
                      <Calendar size={24} className="text-pink-600 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-800">Booking Management</h3>
                    </div>
                    <p className="text-gray-600 mb-4">View and manage all travel bookings</p>
                    <button
                      onClick={handleShowBookings}
                      className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded transition-colors flex items-center gap-2 justify-center"
                    >
                      <Eye size={16} />
                      View Bookings
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Back to Dashboard Button (for non-dashboard views) */}
            {currentView !== 'dashboard' && (
              <div className="mb-6">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  ← Back to Dashboard
                </button>
              </div>
            )}

            {/* Users View */}
            {currentView === 'users' && showUsers && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  All Users ({users.length})
                </h3>

                {users.length === 0 ? (
                  <p className="text-gray-500">No users found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Age
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Gender
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Phone
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Address
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Joined
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                          <tr key={user._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {user.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.age}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                              {user.gender}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.phone}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                              {user.address}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Package Views */}
            {packageLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-xl text-gray-600">Loading packages...</div>
              </div>
            ) : (
              <>
                {currentView === 'packages-add' && (
                  <PackageForm
                    onSubmit={handleAddPackage}
                    onCancel={() => setCurrentView('dashboard')}
                  />
                )}

                {currentView === 'packages-edit' && (
                  <PackageForm
                    package={editingPackage}
                    onSubmit={handleEditPackage}
                    onCancel={() => setCurrentView('packages-list')}
                  />
                )}

                {currentView === 'packages-list' && (
                  <PackageList
                    packages={packages}
                    onEdit={handleEditClick}
                    onDelete={handleDeletePackage}
                  />
                )}
              </>
            )}

            {/* Vlog Views */}
            {vlogLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-xl text-gray-600">Loading vlogs...</div>
              </div>
            ) : (
              <>
                {currentView === 'vlogs-add' && (
                  <VlogForm
                    onSubmit={handleAddVlog}
                    onCancel={() => setCurrentView('dashboard')}
                  />
                )}

                {currentView === 'vlogs-edit' && (
                  <VlogForm
                    vlog={editingVlog}
                    onSubmit={handleEditVlog}
                    onCancel={() => setCurrentView('vlogs-list')}
                  />
                )}

                {currentView === 'vlogs-list' && (
                  <VlogList
                    vlogs={vlogs}
                    onEdit={handleEditVlogClick}
                    onDelete={handleDeleteVlog}
                  />
                )}
              </>
            )}

            {/* Location Views */}
            {locationLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-xl text-gray-600">Loading locations...</div>
              </div>
            ) : (
              <>
                {currentView === 'locations-add' && (
                  <LocationForm
                    onSubmit={handleAddLocation}
                    onCancel={() => setCurrentView('dashboard')}
                  />
                )}

                {currentView === 'locations-edit' && (
                  <LocationForm
                    location={editingLocation}
                    onSubmit={handleEditLocation}
                    onCancel={() => setCurrentView('locations-list')}
                  />
                )}

                {currentView === 'locations-list' && (
                  <LocationList
                    locations={locations}
                    onEdit={handleEditLocationClick}
                    onDelete={handleDeleteLocation}
                  />
                )}
              </>
            )}

            {/* Hotel Views */}
            {hotelLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-xl text-gray-600">Loading hotels...</div>
              </div>
            ) : (
              <>
                {currentView === 'hotels-add' && (
                  <HotelForm
                    onSubmit={handleAddHotel}
                    onCancel={() => setCurrentView('dashboard')}
                  />
                )}

                {currentView === 'hotels-edit' && (
                  <HotelForm
                    hotel={editingHotel}
                    onSubmit={handleEditHotel}
                    onCancel={() => setCurrentView('hotels-list')}
                  />
                )}

                {currentView === 'hotels-list' && (
                  <HotelList
                    hotels={hotels}
                    onEdit={handleEditHotelClick}
                    onDelete={handleDeleteHotel}
                    onViewRooms={handleViewHotelRooms}
                  />
                )}

                {currentView === 'hotel-rooms' && selectedHotel && (
                  <HotelRooms
                    hotel={selectedHotel}
                    onDeleteRoom={handleDeleteRoom}
                    onAddRoom={handleAddRoom}
                    onBack={() => setCurrentView('hotels-list')}
                  />
                )}
              </>
            )}


            {/* Enquiry Views */}
            {enquiryLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-xl text-gray-600">Loading enquiries...</div>
              </div>
            ) : (
              currentView === 'enquiries-list' && (
                <EnquiryList
                  enquiries={enquiries}
                  onDelete={handleDeleteEnquiry}
                />
              )
            )}


            {galleryLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-xl text-gray-600">Loading gallery...</div>
              </div>
            ) : (
              <>
               
                {currentView === 'gallery-add' && (
                  <GalleryAddView
                    handleFileSelection={handleFileSelection}
                    uploadFiles={uploadFiles}
                    updateFileTitle={updateFileTitle}
                    removeFile={removeFile}
                    handleGalleryUpload={handleGalleryUpload}
                    galleryLoading={galleryLoading}
                    setCurrentView={setCurrentView}
                  />
                )}
                {currentView === 'gallery-view' && <GalleryView />}
              </>
            )}

            {/* Booking Views */}
            {bookingLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-xl text-gray-600">Loading bookings...</div>
              </div>
            ) : (
              currentView === 'bookings-list' && (
                <BookingList
                  bookings={bookings}
                  onStatusUpdate={handleUpdateBookingStatus}
                  onDelete={handleDeleteBooking}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;