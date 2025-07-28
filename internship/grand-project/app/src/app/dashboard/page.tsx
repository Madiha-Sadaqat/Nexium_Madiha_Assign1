"use client";
import { useContext } from "react";
import Link from "next/link";
import NeuralBackground from "@/components/NeuralBackground";
import { FiFileText, FiClock, FiPlus, FiSun, FiMoon, FiLogOut } from "react-icons/fi";
import { DarkModeContext } from "../DarkModeProvider";

export default function DashboardPage() {
  const { darkMode, setDarkMode } = useContext(DarkModeContext) as { darkMode: boolean, setDarkMode: (v: boolean) => void };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      <NeuralBackground darkMode={darkMode} />
      
 {/* Navbar */}
      <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200/80 dark:border-gray-700/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <FiFileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">ResumeTailor</span>
            </div>

            <div className="flex items-center space-x-4">
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
              <button
                onClick={handleLogout}
                className="p-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-colors ml-2"
                aria-label="Logout"
              >
                <FiLogOut className="h-5 w-5" />
              </button>
             {/* <Link href="/templates/auth_page" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    Templates
            </Link> */}
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome Back!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Ready to create your next perfect resume?
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Create New Resume Card */}
              <Link 
                href="/resume-input" 
                className="group border-2 border-dashed border-indigo-300 dark:border-indigo-500 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-2xl p-6 transition-all hover:shadow-lg"
              >
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/50 transition-colors">
                    <FiPlus className="text-indigo-600 dark:text-indigo-400 text-2xl" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Create New Resume
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    Start from scratch or upload existing resume
                  </p>
                </div>
              </Link>

              {/* View History Card */}
              <Link 
                href="/history" 
                className="group border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500 rounded-2xl p-6 transition-all hover:shadow-lg"
              >
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/50 transition-colors">
                    <FiClock className="text-indigo-600 dark:text-indigo-400 text-2xl" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    View My History
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    Access your previously created resumes
                  </p>
                </div>
              </Link>
            </div>

            {/* Recent Activity Section */}
            <div className="mt-12">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Recent Activity
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  Your recent resumes will appear here
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}