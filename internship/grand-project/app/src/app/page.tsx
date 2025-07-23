"use client";
import { useState, useEffect } from "react";
import { FiMail, FiSend, FiFileText, FiUser, FiLogIn, FiSun, FiMoon, FiHome, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(savedMode ? JSON.parse(savedMode) : systemPrefersDark);
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setTimeout(() => {
      setLoading(false);
      setMessage("Magic link sent! Check your inbox to access your resume dashboard.");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Professional Navbar */}
      <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200/80 dark:border-gray-700/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <FiFileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">ResumeTailor</span>
            </div>

            <div className="flex items-center space-x-6">
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? (
                  <FiSun className="h-5 w-5 text-yellow-300" />
                ) : (
                  <FiMoon className="h-5 w-5 text-gray-700" />
                )}
              </button>

              {/* Navigation Links */}
              <div className="hidden md:flex items-center space-x-8">
                <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center transition-colors">
                  <FiHome className="mr-1" /> Home
                </Link>
                <Link href="/features" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Features
                </Link>
                <Link href="/templates" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Templates
                </Link>
              </div>

              {/* Auth Buttons */}
              <div className="flex items-center space-x-4">
                <Link href="/login" className="px-4 py-2 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-800 transition-colors flex items-center">
                  <FiLogIn className="mr-1" /> Login
                </Link>
                <Link href="/signup" className="px-4 py-2 rounded-lg bg-indigo-600 dark:bg-indigo-700 text-white hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Now with dark mode variants */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-grow flex items-center justify-center p-4"
      >
        <div className="w-full max-w-md">
          <div className="bg-white/90 dark:bg-gray-800/90 p-10 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 backdrop-blur-lg">
            {/* ... rest of your existing content with dark: variants ... */}
            <div className="text-center mb-10">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 mb-6 shadow-lg"
              >
                <FiUser className="h-8 w-8 text-white" />
              </motion.div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Access Your Resume Dashboard</h1>
              <p className="text-gray-600/90 dark:text-gray-400 font-medium">Sign in to customize and download your tailored resume</p>
            </div>

            {/* Form with dark mode styles */}
            <form onSubmit={handleMagicLink} className="space-y-7">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700/90 dark:text-gray-300 mb-2">
                  Professional Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-indigo-500/80 dark:text-indigo-400/90" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="block w-full pl-11 pr-4 py-3.5 border border-gray-200/80 dark:border-gray-600/80 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/50 dark:focus:ring-indigo-500/50 focus:border-transparent transition-all duration-300 bg-white/70 dark:bg-gray-700/70 text-gray-800 dark:text-gray-200 placeholder-gray-400/70 dark:placeholder-gray-400/50"
                    placeholder="your@professional.email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <motion.div whileTap={{ scale: 0.98 }}>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-md text-base font-medium text-white bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400/30 transition-all duration-300 ${
                    loading ? "opacity-90" : ""
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending Access Link...
                    </>
                  ) : (
                    <>
                      Continue to Dashboard <FiArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </motion.div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}