import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from './pages/Home'
import Navbar from "./components/Navbar";
import { lazy, Suspense } from "react";

const Leads = lazy(() => import("./pages/Leads"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const NotFound = lazy(() => import("./components/NotFound"));

function App() {

  return (

    <BrowserRouter>
      <Suspense fallback={
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
  </div>
}>
      <Routes>

        <Route path='/' element={
          <>
            <Navbar />
            <Home />
          </>
         } 
        />

        <Route path="/register" element={<Register />} />
        
        <Route path="/login" element={<Login />} />

        <Route
          path="/leads"
          element={
            <ProtectedRoute>
              <Navbar />
              <Leads />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Navbar />
              <Dashboard />
            </ProtectedRoute>
          }  
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Navbar />
              <UserProfile />
            </ProtectedRoute>
          }  
        />

        <Route path="*" element={<NotFound />} />

      </Routes>
    </Suspense>
    </BrowserRouter>
  );
}

export default App;