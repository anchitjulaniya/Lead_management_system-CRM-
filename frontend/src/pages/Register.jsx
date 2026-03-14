import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { registerUser } from "../services/authService";
import validateRegister from "../utils/validateRegister";

export default function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    const error = validateRegister(form);

    if (error) {
      toast.error(error);
      return;
    }

    setLoading(true);

    try {

      await registerUser({
        name: form.name,
        email: form.email,
        password: form.password
      });

      toast.success("Account created successfully");

      navigate("/login");

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Registration failed"
      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    const token = sessionStorage.getItem("token");

    if (token) {
      navigate("/");
    }

  }, [navigate]);

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">

      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">

        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Create Account
        </h2>

        <p className="text-gray-500 text-center mb-6">
          Register to start managing your leads
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <input
            name="name"
            type="text"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
          />

          {/* Email */}
          <input
            name="email"
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
          />

          {/* Password */}
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
          />

          {/* Confirm Password */}
          <input
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
          />

          {/* Show Password */}
          <div className="flex items-center gap-2 text-sm text-gray-600">

            <input
              type="checkbox"
              onChange={() => setShowPassword(!showPassword)}
            />

            Show password

          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition disabled:opacity-50"
          >

            {loading ? "Creating account..." : "Register"}

          </button>

          {/* Login link */}
          <p className="text-center text-sm text-gray-600">

            Already have an account?

            <Link
              to="/login"
              className="text-blue-600 ml-1 hover:underline"
            >
              Login
            </Link>

          </p>

        </form>

      </div>

    </div>

  );

}