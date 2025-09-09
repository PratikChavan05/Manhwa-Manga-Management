import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { UserData } from "./context/UserContext";
import { Loading } from "./components/Loading";
import Forgot from "./pages/Forgot";
import Reset from "./pages/Reset";
import OtpVerify from "./pages/OtpVerify";
import AddManga from "./pages/AddManga";
import Dashboard from "./pages/Home";
import MangaDetail from "./pages/MangaDetail";
import MangaList from "./pages/MangaList";
import Navbar from "./components/Navbar";

// Layout wrapper for authenticated pages
const AuthLayout = ({ children }) => (
  <>
    <Navbar />
    <div >{children}</div>
  </>
);

// Protect routes for logged-in users
const ProtectedRoute = ({ isAuth, children }) => {
  return isAuth ? children : <Navigate to="/login" replace />;
};

// Redirect logged-in users away from auth pages
const GuestRoute = ({ isAuth, children }) => {
  return !isAuth ? children : <Navigate to="/" replace />;
};

const App = () => {
  const { loading, isAuth } = UserData();

  if (loading) return <Loading />;

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <GuestRoute isAuth={isAuth}>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute isAuth={isAuth}>
              <Register />
            </GuestRoute>
          }
        />
        <Route
          path="/verify/:token"
          element={
            <GuestRoute isAuth={isAuth}>
              <OtpVerify />
            </GuestRoute>
          }
        />
        <Route
          path="/forgot"
          element={
            <GuestRoute isAuth={isAuth}>
              <Forgot />
            </GuestRoute>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <GuestRoute isAuth={isAuth}>
              <Reset />
            </GuestRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute isAuth={isAuth}>
              <AuthLayout>
                <Dashboard />
              </AuthLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/mangas"
          element={
            <ProtectedRoute isAuth={isAuth}>
              <AuthLayout>
                <MangaList />
              </AuthLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/mangas/add"
          element={
            <ProtectedRoute isAuth={isAuth}>
              <AuthLayout>
                <AddManga />
              </AuthLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/mangas/:id"
          element={
            <ProtectedRoute isAuth={isAuth}>
              <AuthLayout>
                <MangaDetail />
              </AuthLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/mangas/edit/:id"
          element={
            <ProtectedRoute isAuth={isAuth}>
              <AuthLayout>
                <AddManga />
              </AuthLayout>
            </ProtectedRoute>
          }
        />

        {/* 404 fallback */}
        <Route path="*" element={<div className="p-6 text-center text-red-500 text-lg">404 | Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
