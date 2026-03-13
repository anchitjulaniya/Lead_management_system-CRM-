import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Leads from "./pages/Leads";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from './pages/Home'
import Navbar from "./components/Navbar";
import NotFound from "./components/NotFound";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path='/' element={<Home />} />

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

        <Route path="*" element={<NotFound />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;