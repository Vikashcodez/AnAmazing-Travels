import React, { useState } from 'react';
import { Edit2, Trash2, Video } from 'lucide-react';

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
                {/* Vlog card content... */}
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

export default VlogList;