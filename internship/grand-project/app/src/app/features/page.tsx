"use client";
import { useState, useEffect } from "react";
import { FiFileText, FiMoon, FiSun, FiHome, FiUser, FiAward, FiBriefcase, FiEdit3, FiZap, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";
import Link from "next/link";
import NeuralBackground from "@/components/NeuralBackground";

export default function FeaturesPage() {
  const [darkMode, setDarkMode] = useState(false);

  // Dark mode initialization
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(savedMode ? JSON.parse(savedMode) : systemPrefersDark);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const features = [
    {
      icon: <FiZap className="w-8 h-8" />,
      title: "AI-Powered Resume Generation",
      description: "Simply provide your job description and experience, and our AI will craft a perfectly tailored resume that highlights your most relevant qualifications.",
      benefits: [
        "Automatically matches keywords",
        "Optimizes for applicant tracking systems",
        "Creates multiple versions for different roles"
      ]
    },
    {
      icon: <FiEdit3 className="w-8 h-8" />,
      title: "Smart Content Suggestions",
      description: "Get intelligent recommendations for improving your resume content based on industry standards and the specific job you're targeting.",
      benefits: [
        "Action verb suggestions",
        "Achievement-oriented phrasing",
        "Quantifiable impact highlighting"
      ]
    },
    {
      icon: <FiBriefcase className="w-8 h-8" />,
      title: "Job Description Analyzer",
      description: "Our system parses job descriptions to identify the most important skills and requirements to emphasize in your application.",
      benefits: [
        "Key skill extraction",
        "Priority requirement detection",
        "Competency gap analysis"
      ]
    },
    {
      icon: <FiAward className="w-8 h-8" />,
      title: "ATS Optimization",
      description: "Ensure your resume passes through Applicant Tracking Systems with our built-in optimization tools and real-time feedback.",
      benefits: [
        "Formatting compliance checks",
        "Keyword density analysis",
        "Readability scoring"
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      <NeuralBackground darkMode={darkMode} />
      
      <div className="relative z-10">
        {/* Navbar */}
        <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200/80 dark:border-gray-700/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="flex-shrink-0 flex items-center">
                  <FiFileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">ResumeGenius</span>
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
                >
                  {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
                </button>
                <Link
                  href="/"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-gray-700"
                >
                  <FiHome className="mr-1" /> Home
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Features Content */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="py-12 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <motion.h1 
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl"
              >
                Powerful Resume Features
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mt-5 max-w-xl mx-auto text-xl text-gray-500 dark:text-gray-400"
              >
                Transform your job search with our intelligent resume tools
              </motion.p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-200"
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 mr-4">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {feature.description}
                    </p>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
                    <Link
                      href="/"
                      className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
                    >
                      Try it now
                      <FiArrowRight className="ml-2" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-16 bg-indigo-50 dark:bg-gray-800 rounded-2xl p-8 text-center"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to transform your resume?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                Join thousands of professionals who landed their dream jobs with our AI-powered resume builder.
              </p>
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 bg-indigo-600 dark:bg-indigo-700 text-white text-lg font-medium rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors"
              >
                Get Started Now
                <FiArrowRight className="ml-2" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}