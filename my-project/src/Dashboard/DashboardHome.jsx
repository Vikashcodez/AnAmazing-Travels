import React from 'react';
import { Users, Package, Video, Plus, Eye } from 'lucide-react';

const DashboardHome = ({ user, fetchUsers, loading, setCurrentView }) => {
  return (
    <>
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Welcome, {user?.name}!
        </h2>
        <p className="text-gray-600 mb-6">
          You have admin access to manage users, packages, vlogs and system settings.
        </p>
      </div>

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
              onClick={() => setCurrentView('packages-list')}
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
              onClick={() => setCurrentView('vlogs-list')}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded transition-colors flex items-center gap-2 justify-center"
            >
              <Eye size={16} />
              View Vlogs
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardHome;