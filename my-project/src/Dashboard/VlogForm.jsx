import React, { useState, useEffect } from 'react';
import { X, Upload, Save } from 'lucide-react';

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
      if (formData.thumbnail) submitData.append('thumbnail', formData.thumbnail);
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
        <button onClick={onCancel} className="p-2 text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>

      {/* Form fields... */}

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
  );
};

export default VlogForm;