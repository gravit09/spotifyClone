import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Music, PlayCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

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
