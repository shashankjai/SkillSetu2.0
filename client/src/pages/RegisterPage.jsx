import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Field validation
    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password.trim() || password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name,
          email,
          password,
        }
      );
      
      setSuccessMessage("Registration successful! Please log in.");
      
      // Clear the fields after successful registration
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      
      // Auto redirect after 2 seconds
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed. Please try again.");
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
              className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-400 rounded-xl flex items-center justify-center shadow-lg"
            >
              <FiUser className="text-white text-xl" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
              SkillSetu
            </h1>
          </div>
          <p className="text-gray-400 italic">Start Your Learning Journey Today</p>
        </motion.div>

        {/* Register Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Animated Gradient Border */}
          <div className="relative p-0.5">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-400/20 to-purple-500/20 rounded-2xl" />
            <div className="relative bg-gray-800/95 rounded-2xl p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
                <p className="text-gray-400 text-sm">Join our community of learners</p>
              </div>

              {/* Success Message */}
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-green-900/30 border border-green-800/50 rounded-lg"
                >
                  <p className="text-green-300 text-sm flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    {successMessage}
                  </p>
                </motion.div>
              )}

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
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <FiUser className="text-purple-400" />
                    Full Name
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (error === "Please enter your full name.") setError("");
                      }}
                      className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 group-hover:border-gray-600"
                      placeholder="John Doe"
                    />
                    <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-hover:text-purple-400 transition-colors" />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <FiMail className="text-purple-400" />
                    Email Address
                  </label>
                  <div className="relative group">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error === "Please enter a valid email address.") setError("");
                      }}
                      className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 group-hover:border-gray-600"
                      placeholder="you@example.com"
                    />
                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-hover:text-purple-400 transition-colors" />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <FiLock className="text-purple-400" />
                    Password
                  </label>
                  <div className="relative group">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error === "Password must be at least 6 characters long.") setError("");
                      }}
                      className="w-full pl-10 pr-12 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 group-hover:border-gray-600"
                      placeholder="••••••••"
                    />
                    <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-hover:text-purple-400 transition-colors" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-400 transition-colors"
                    >
                      {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <FiLock className="text-purple-400" />
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (error === "Passwords do not match!") setError("");
                      }}
                      className="w-full pl-10 pr-12 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 group-hover:border-gray-600"
                      placeholder="••••••••"
                    />
                    <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-hover:text-purple-400 transition-colors" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-400 transition-colors"
                    >
                      {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                    </button>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 w-4 h-4 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-400">
                    I agree to the{" "}
                    <a href="/terms" className="text-purple-400 hover:text-purple-300">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-purple-400 hover:text-purple-300">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                {/* Register Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <FiArrowRight />
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
                  <span className="px-3 bg-gray-800 text-gray-400">Already have an account?</span>
                </div>
              </div>

              {/* Login Link */}
              <div className="text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-800 hover:border-gray-600 hover:text-white transition-all duration-300 group"
                >
                  <FiMail className="group-hover:text-blue-400 transition-colors" />
                  Sign In to Existing Account
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
            Secure registration • Your data is protected
          </p>
        </motion.div>

        {/* Floating Particles Background */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400/20 rounded-full"
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

export default RegisterPage;