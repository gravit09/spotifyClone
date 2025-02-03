import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, role, logout } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="flex items-center justify-between px-6 py-4 bg-gray-900">
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

      {/* Hero Section */}
      <div className="px-6 py-10 bg-gradient-to-b from-gray-900 to-black">
        <h1 className="text-4xl font-bold mb-4">Welcome to Spotify Clone</h1>
        <p className="text-gray-400 mb-6">
          Your favorite music, anytime, anywhere.
        </p>
        <button className="py-2 px-6 bg-green-500 text-sm rounded-full hover:bg-green-400">
          Discover Playlists
        </button>
      </div>

      {/* Main Content */}
      <main className="px-6 py-10 space-y-12">
        {/* Recently Played */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Recently Played</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition"
              >
                <div className="h-40 bg-gray-700 rounded mb-4"></div>
                <h3 className="text-lg font-semibold">
                  Song Title {index + 1}
                </h3>
                <p className="text-gray-400 text-sm">Artist Name</p>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Playlists */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Popular Playlists</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition"
              >
                <div className="h-40 bg-gray-700 rounded mb-4"></div>
                <h3 className="text-lg font-semibold">Playlist {index + 1}</h3>
                <p className="text-gray-400 text-sm">Description</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
