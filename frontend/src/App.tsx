import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashBoard from "./pages/admin/DashBoard";
import ProtectedRoute from "./context/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";
import Home from "./pages/user/home";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/home",
      element: <Home />,
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <DashBoard />
        </ProtectedRoute>
      ),
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
