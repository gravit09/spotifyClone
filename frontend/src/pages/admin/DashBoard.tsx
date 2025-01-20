import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Music, PlayCircle, Loader } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !role) {
      navigate("/");
    }
  }, [isAuthenticated, role, navigate]);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={() => logout()}
            className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-green-500 hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Total Users</p>
                <p className="text-2xl font-bold">{0}</p>
              </div>
              <Users className="h-10 w-10 text-green-500" />
            </div>
          </div>

          <div className="bg-zinc-900 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Total Songs</p>
                <p className="text-2xl font-bold">{0}</p>
              </div>
              <Music className="h-10 w-10 text-green-500" />
            </div>
          </div>

          <div className="bg-zinc-900 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Total Plays</p>
                <p className="text-2xl font-bold">{0}</p>
              </div>
              <PlayCircle className="h-10 w-10 text-green-500" />
            </div>
          </div>
        </div>

        <div className="mt-8 bg-zinc-900 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="bg-zinc-800 rounded-lg p-4">
            <p className="text-gray-400">No recent activity to display</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
