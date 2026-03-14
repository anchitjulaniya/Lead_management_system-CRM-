import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";

export default function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);


  const validateForm = () => {

    if (!name || !email || !password || !confirmPassword) {
      toast.error("All fields are required");
      return false;
    }

    if (name.length < 2) {
      toast.error("Name must be at least 2 characters");
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

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {

      await API.post("/auth/register", {
        name,
        email,
        password
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

  useEffect(()=>{
    const token = sessionStorage.getItem("token");
    if(token){
      navigate('/')
    }
  }, [])

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">

      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md animate-fadeIn">

        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Create Account
        </h2>

        <p className="text-gray-500 text-center mb-6">
          Register to start managing your leads
        </p>


        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* Name */}

          <input
            type="text"
            placeholder="Full name"
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />


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

          </div>


          {/* Confirm Password */}

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm password"
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
          />


          {/* Show Password */}

          <div className="flex items-center gap-2 text-sm text-gray-600">

            <input
              type="checkbox"
              onChange={() =>
                setShowPassword(!showPassword)
              }
            />

            Show password

          </div>


          {/* Submit */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition transform hover:-translate-y-0.5 disabled:opacity-50"
          >

            {loading ? (
              <span className="flex justify-center items-center gap-2">

                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>

                Creating account...

              </span>
            ) : (
              "Register"
            )}

          </button>


          {/* Login link */}

          <p className="text-center text-sm text-gray-600 mt-4">

            Already have an account?

            <Link
              to="/login"
              className="text-blue-600 ml-1 hover:underline hover:font-semibold"
            >
              Login
            </Link>

          </p>

        </form>

      </div>

    </div>

  );

}