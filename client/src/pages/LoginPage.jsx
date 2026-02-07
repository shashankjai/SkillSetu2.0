import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../redux/slices/authSlice";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FiMail, FiLock, FiUser } from "react-icons/fi";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineArrowRight } from "react-icons/ai";
import { motion } from "framer-motion";
import { jwtDecode } from 'jwt-decode';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Field validation
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password.trim()) {
      setError("Password is required.");
      return;
    }

    // API call
    dispatch(loginStart());
    setIsLoading(true);
    
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const token = response.data.token;
      const decoded = jwtDecode(token);
      const role = decoded?.user?.role || 'user';

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({
        name: response.data.name,
        email: response.data.email,
        _id: response.data.id,
        role: role
      }));

      dispatch(loginSuccess(token));

      // Redirect based on role
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }

    } catch (err) {
      const errorMessage = err.response?.data?.msg || "Invalid credentials. Please try again.";
      dispatch(loginFailure(errorMessage));
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo Header */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 mb-3">
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg"
            >
              <FiUser className="text-white text-xl" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              SkillSetu
            </h1>
          </div>
          <p className="text-gray-400 italic">Connect. Learn. Grow Together.</p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Animated Gradient Border */}
          <div className="relative p-0.5">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-cyan-400/20 to-blue-500/20 rounded-2xl" />
            <div className="relative bg-gray-800/95 rounded-2xl p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-gray-400 text-sm">Sign in to continue your journey</p>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mb-4 p-3 bg-red-900/30 border border-red-800/50 rounded-lg"
                >
                  <p className="text-red-300 text-sm flex items-center gap-2">
                    <span className="text-red-400">⚠</span>
                    {error}
                  </p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <FiMail className="text-blue-400" />
                    Email Address
                  </label>
                  <div className="relative group">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 group-hover:border-gray-600"
                      placeholder="you@example.com"
                    />
                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-hover:text-blue-400 transition-colors" />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <FiLock className="text-blue-400" />
                    Password
                  </label>
                  <div className="relative group">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 group-hover:border-gray-600"
                      placeholder="••••••••"
                    />
                    <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-hover:text-blue-400 transition-colors" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-400 transition-colors"
                    >
                      {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                    </button>
                  </div>
                </div>

                {/* Login Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <AiOutlineArrowRight />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-gray-800 text-gray-400">New to SkillSetu?</span>
                </div>
              </div>

              {/* Register Link */}
              <div className="text-center">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-800 hover:border-gray-600 hover:text-white transition-all duration-300 group"
                >
                  <FiUser className="group-hover:text-purple-400 transition-colors" />
                  Create an Account
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center"
        >
          <p className="text-gray-500 text-sm">
            By signing in, you agree to our{" "}
            <a href="/terms" className="text-blue-400 hover:text-blue-300">
              Terms
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-blue-400 hover:text-blue-300">
              Privacy Policy
            </a>
          </p>
        </motion.div>

        {/* Floating Particles Background */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/20 rounded-full"
              initial={{
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%",
                scale: 0,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;