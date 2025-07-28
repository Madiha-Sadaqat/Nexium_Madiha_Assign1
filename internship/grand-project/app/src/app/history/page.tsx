"use client";
import { useContext } from "react";
import { DarkModeContext } from "../DarkModeProvider";
import { useRouter } from "next/navigation";
import NeuralBackground from "@/components/NeuralBackground";
import { FiFileText, FiTrash2, FiEye, FiClock, FiSun, FiMoon, FiHome, FiLogOut } from "react-icons/fi";
import Link from "next/link";

export default function HistoryPage() {
  const { darkMode, setDarkMode } = useContext(DarkModeContext) as { darkMode: boolean, setDarkMode: (v: boolean) => void };
  const router = useRouter();
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  // Sample resume history data
  const resumeHistory = [
    { id: 1, title: "Resume for Google", date: "2023-05-15" },
    { id: 2, title: "Resume for Amazon", date: "2023-04-22" },
    { id: 3, title: "Academic CV", date: "2023-03-10" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      <NeuralBackground darkMode={darkMode} />
      
      {/* Navbar - Now properly inside the return statement */}
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
              <Link
                href="/dashboard/"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-gray-700"
              >
                <FiHome className="mr-1" /> Home
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-colors ml-2"
                aria-label="Logout"
              >
                <FiLogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <FiClock className="text-indigo-600 dark:text-indigo-400" />
                Resume History
              </h1>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {resumeHistory.map((resume) => (
                <div key={resume.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <FiFileText className="text-indigo-600 dark:text-indigo-400 text-xl" />
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {resume.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Created on {resume.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors">
                        <FiEye className="text-lg" />
                      </button>
                      <button className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                        <FiTrash2 className="text-lg" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {resumeHistory.length === 0 && (
              <div className="p-12 text-center">
                <FiFileText className="mx-auto text-4xl text-gray-400 dark:text-gray-500 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No resume history yet. Create your first resume to get started.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}