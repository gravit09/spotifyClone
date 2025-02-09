import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
export default function Topbar() {
  const navigate = useNavigate();
  const { isAuthenticated, role, logout } = useAuth();

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gray-900 text-white">
      <div className="text-2xl font-bold">Spotify</div>
      <nav className="flex space-x-4">
        <a href="#" className="text-sm hover:text-green-500">
          Home
        </a>
        <a href="#" className="text-sm hover:text-green-500">
          Search
        </a>
        <a href="#" className="text-sm hover:text-green-500">
          Your Library
        </a>
        {role && (
          <Link to="/dashboard" className="text-sm hover:text-green-500">
            Dashboard
          </Link>
        )}
      </nav>
      {isAuthenticated ? (
        <button
          onClick={() => logout()}
          className="py-2 px-4 bg-green-500 text-sm rounded-full hover:bg-green-400"
        >
          Logout
        </button>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="py-2 px-4 bg-green-500 text-sm rounded-full hover:bg-green-400"
        >
          Login
        </button>
      )}
    </header>
  );
}
