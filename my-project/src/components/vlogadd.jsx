import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2, Eye, Package, Save, X, Upload, Bold, Italic, List, Users, Video } from 'lucide-react';
import axios from 'axios';

// Mock API functions for packages (replace with your actual API calls)
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
                      src={vlog.thumbnail}
                      alt={vlog.title}
                      className="w-full h-full object-cover"
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

      {/* Delete Confirmation Modal */}
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
                      src={pkg.thumbnail}
                      alt={pkg.packageName}
                      className="w-full h-full object-cover"
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

      {/* Delete Confirmation Modal */}
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
      if (response.success) {
        setVlogs(response.data);
      }
    } catch (error) {
      console.error('Error loading vlogs:', error);
    } finally {
      setVlogLoading(false);
    }
  };

  const handleAddVlog = async (formData) => {
    try {
      const response = await vlogAPI.createVlog(formData);
      if (response.success) {
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

  const handleEditClick = (packageItem) => {
    setEditingPackage(packageItem);
    setCurrentView('packages-edit');
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
                    You have admin access to manage users, packages, vlogs and system settings.
                  </p>
                </div>

                {/* Navigation Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;