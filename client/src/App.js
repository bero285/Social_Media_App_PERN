import { Login } from "./pages/login/Login";
import "./style.scss";
import { Register } from "./pages/register/Register";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import { NavBar } from "./components/navBar/NavBar";
import { LeftBar } from "./components/leftBar/LeftBar";
import { RightBar } from "./components/rightBar/RightBar";
import { Home } from "./pages/home/Home";
import { Profile } from "./pages/profile/Profile";
import { useContext, useEffect } from "react";
import { DarkModeContext } from "./context/DarkModeContext";
import { AuthContext } from "./context/authContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  // const currentUser = true;
  const queryClient = new QueryClient();
  const { darkMode } = useContext(DarkModeContext);
  const { currentUser, login } = useContext(AuthContext);
  const Layout = () => {
    return (
      <QueryClientProvider client={queryClient}>
        <div className={`${darkMode ? "theme-dark" : "theme-light"}`}>
          <NavBar />
          <div style={{ display: "flex" }}>
            <LeftBar />
            <div style={{ flex: 6 }}>
              <Outlet />
            </div>
            <RightBar />
          </div>
        </div>
      </QueryClientProvider>
    );
  };

  const ProtectedRoutes = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoutes>
          <Layout />
        </ProtectedRoutes>
      ),
      children: [
        { path: "/", element: <Home /> },
        { path: "/profile/:id", element: <Profile /> },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ]);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
