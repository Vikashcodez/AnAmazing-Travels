import React, { useState, useEffect } from 'react';
import { X, Upload, Save } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

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
    setFormData(prev => ({ ...prev, [name]: value }));
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
      Object.keys(formData).forEach(key => submitData.append(key, formData[key]));
      if (thumbnail) submitData.append('thumbnail', thumbnail);
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
        <button onClick={onCancel} className="p-2 text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Form fields */}
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

          {/* Other form fields... */}
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

export default PackageForm;