import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { AuthContext } from "../context/AuthContext";

const BASE_URL = "http://localhost:5000";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
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
      setError("Email and password are required");
      return false;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Invalid email format");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    return true;
  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    if (!validateForm()) return;

    setLoading(true);

    try {

      const res = await axios.post(`${BASE_URL}/auth/login`, {
        email,
        password
      });

      login(res.data);

      navigate("/leads");

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Login failed"
      );

    } finally {
      setLoading(false);
    }

  };


  return (

    <div className="flex items-center justify-center h-screen bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-96"
      >

        <h2 className="text-2xl mb-4 text-center">
          Login
        </h2>

        {error && (
          <p className="text-red-500 mb-3">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="bg-blue-500 text-white w-full p-2 rounded"
          disabled={loading}
        >

          {loading ? "Logging in..." : "Login"}

        </button>

      </form>

    </div>

  );

}