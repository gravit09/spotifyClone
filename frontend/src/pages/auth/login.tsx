import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { LoginCredentials } from "../../types/auth";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, role } = useAuth();

  useEffect(() => {
    if (isAuthenticated && role) {
      navigate("/dashboard");
    } else if (isAuthenticated && !role) {
      navigate("/home");
    }
  }, [isAuthenticated, role]);

  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        credentials
      );
      if (response.data.success) {
        const token = response.data.token;
        const role = response.data.role;
        if (role == "admin") {
          login(token, true);
        } else {
          login(token, false);
        }
        if (response.data.role == "admin") {
          navigate("/dashboard");
        } else {
          navigate("/home");
        }
      } else {
        setError("Invalid Credentials");
        console.error("Login failed");
      }
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-zinc-900 p-8 rounded-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Sign in to your account
          </h2>
        </div>
        {error && (
          <div className="bg-red-500 text-white p-3 rounded-md text-center">
            {error}
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-700 bg-zinc-800 text-white placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Email address"
                value={credentials.email}
                onChange={(e) =>
                  setCredentials({ ...credentials, email: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-700 bg-zinc-800 text-white placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
              />
            </div>
          </div>
          <p className="text-white">
            Don't have an Account?{" "}
            <Link to="/signup">
              <span className="text-blue">Signup</span>
            </Link>
          </p>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-green-500 hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
