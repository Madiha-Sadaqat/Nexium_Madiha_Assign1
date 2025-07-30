"use client";
import { useContext, useState, useEffect } from "react";
import { DarkModeContext } from "../DarkModeProvider";
import { useRouter } from "next/navigation";
import NeuralBackground from "@/components/NeuralBackground";
import { FiFileText, FiTrash2, FiEye, FiClock, FiSun, FiMoon, FiHome, FiLogOut } from "react-icons/fi";
import Link from "next/link";

interface ResumeHistory {
  id: string;
  title: string;
  date: string;
  resume_text?: string;
}

export default function HistoryPage() {
  const { darkMode, setDarkMode } = useContext(DarkModeContext) as { darkMode: boolean, setDarkMode: (v: boolean) => void };
  const router = useRouter();
  const [resumeHistory, setResumeHistory] = useState<ResumeHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  // Fetch resume history from API
  useEffect(() => {
    const fetchResumeHistory = async () => {
      try {
        setLoading(true);
        // For now, using a temporary user ID - replace with actual user ID from auth
        const user_id = 'temp-user-id';
        
        const response = await fetch(`/api/getResumes?user_id=${user_id}`);
        const result = await response.json();
        
        if (result.success) {
          // Combine and format data from both databases
          const formattedHistory: ResumeHistory[] = [];
          
          // Add Supabase resumes
          if (result.supabase_resumes) {
            result.supabase_resumes.forEach((resume: any) => {
              try {
                const resumeData = JSON.parse(resume.resume_text);
                formattedHistory.push({
                  id: resume.id,
                  title: resumeData.title || 'Untitled Resume',
                  date: new Date(resume.created_at).toLocaleDateString(),
                  resume_text: resume.resume_text
                });
              } catch (e) {
                console.error('Error parsing resume data:', e);
              }
            });
          }
          
          // Add MongoDB resumes (avoid duplicates)
          if (result.mongo_resumes) {
            result.mongo_resumes.forEach((resume: any) => {
              try {
                const resumeData = JSON.parse(resume.resume_text);
                // Check if this resume is already in the list
                const exists = formattedHistory.find(h => h.title === resumeData.title);
                if (!exists) {
                  formattedHistory.push({
                    id: resume._id,
                    title: resumeData.title || 'Untitled Resume',
                    date: new Date(resume.created_at).toLocaleDateString(),
                    resume_text: resume.resume_text
                  });
                }
              } catch (e) {
                console.error('Error parsing resume data:', e);
              }
            });
          }
          
          setResumeHistory(formattedHistory);
        } else {
          setError('Failed to fetch resume history');
        }
      } catch (error) {
        console.error('Error fetching resume history:', error);
        setError('Failed to load resume history');
      } finally {
        setLoading(false);
      }
    };

    fetchResumeHistory();
  }, []);

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
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">Loading resume history...</p>
                </div>
              ) : error ? (
                <div className="p-8 text-center">
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Retry
                  </button>
                </div>
              ) : resumeHistory.length === 0 ? (
                <div className="p-8 text-center">
                  <FiFileText className="text-4xl text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No resume history found</p>
                  <Link 
                    href="/resume-input"
                    className="mt-2 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Create Your First Resume
                  </Link>
                </div>
              ) : (
                resumeHistory.map((resume) => (
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
                        <button 
                          onClick={() => {
                            if (resume.resume_text) {
                              localStorage.setItem('currentResume', resume.resume_text);
                              router.push('/output-page');
                            }
                          }}
                          className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                        >
                          <FiEye className="text-lg" />
                        </button>
                        <button className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                          <FiTrash2 className="text-lg" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
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