import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import toast from "react-hot-toast";
import connectSocket from "../socket/socket";

const socket = connectSocket
export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  /*
  Check if token already exists
  */
  useEffect(() => {

    const token = sessionStorage.getItem("token");

    if (token) {

      try {

        const payload = JSON.parse(atob(token.split(".")[1]));

        const isExpired = payload.exp * 1000 < Date.now();

        if (!isExpired) {
          navigate("/leads");
        } else {
          sessionStorage.removeItem("token");
        }

      } catch {
        sessionStorage.removeItem("token");
      }

    }

  }, [navigate]);

  const validateForm = () => {

    if (!email || !password) {
      toast.error("Email and password are required");
      return false;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return false;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {

      const res = await API.post("/auth/login", {
        email,
        password
      });

      login(res.data);

      socket.auth = {
  token: res.data.token
};

socket.connect();

      toast.success("Login successful");

      navigate("/");

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Login failed"
      );

    } finally {
      setLoading(false);
    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">

      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md animate-fadeIn">

        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          CRM Login
        </h2>

        <p className="text-gray-500 text-center mb-6">
          Sign in to manage your leads
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* Email */}

          <input
            type="email"
            placeholder="Email address"
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password */}

          <div className="relative">

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              className="absolute right-3 top-3 text-sm text-gray-500"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? "Hide" : "Show"}
            </button>

          </div>

          {/* Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition transform hover:-translate-y-0.5 disabled:opacity-50"
          >

            {loading ? (
              <span className="flex justify-center items-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                Logging in...
              </span>
            ) : (
              "Login"
            )}

          </button>

          <p className="text-center text-sm text-gray-600 mt-4">

            Don't have an account?

            <Link
              to="/register"
              className="text-blue-600 ml-1 hover:underline "
            >
              Register
            </Link>

          </p>

        </form>

      </div>

    </div>

  );

}