"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiFileText, FiMoon, FiSun, FiArrowRight, FiCheck, FiUser } from "react-icons/fi";
import { motion } from "framer-motion";
import NeuralBackground from "@/components/NeuralBackground";

export default function AuthTemplatesPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const router = useRouter();

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

  const handleTemplateSelect = (templateId: number) => {
    setSelectedTemplate(templateId);
    router.push(`/input?template=${templateId}`);
  };

  const templates = [
    {
      id: 1,
      name: "Modern Professional",
      category: "Corporate",
      description: "Clean layout with balanced sections for traditional industries",
      bestFor: "Finance, Law, Healthcare",
      image: "/templates/modern-professional.png"
    },
    {
      id: 2,
      name: "Creative Minimalist",
      category: "Design",
      description: "Elegant typography with ample white space for creative professionals",
      bestFor: "Designers, Artists, Writers",
      image: "/templates/creative-minimalist.png"
    },
    {
      id: 3,
      name: "Tech Innovator",
      category: "Technology",
      description: "Modern layout with tech-focused sections like projects and skills",
      bestFor: "Developers, Engineers, IT",
      image: "/templates/tech-innovator.png"
    },
    {
      id: 4,
      name: "Academic Scholar",
      category: "Education",
      description: "Structured format emphasizing publications and research",
      bestFor: "Researchers, Academics, Students",
      image: "/templates/academic-scholar.png"
    },
    {
      id: 5,
      name: "Executive",
      category: "Leadership",
      description: "Bold design with emphasis on leadership experience",
      bestFor: "Executives, Managers, Directors",
      image: "/templates/executive.png"
    },
    {
      id: 6,
      name: "Startup Visionary",
      category: "Entrepreneurship",
      description: "Dynamic layout highlighting projects and achievements",
      bestFor: "Founders, Entrepreneurs, Consultants",
      image: "/templates/startup-visionary.png"
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
                <FiFileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Resume</span>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
                >
                  {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
                </button>
                <div className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  <FiUser className="mr-1" /> Dashboard
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Templates Content */}
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
                Choose Your Template
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mt-5 max-w-xl mx-auto text-xl text-gray-500 dark:text-gray-400"
              >
                Select a design to start customizing
              </motion.p>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5 }}
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border-2 ${
                    selectedTemplate === template.id 
                      ? 'border-indigo-500 dark:border-indigo-400' 
                      : 'border-transparent'
                  } transition-all duration-200`}
                >
                  {/* Template Preview Image */}
                  <div className="h-48 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                    {template.image ? (
                      <img 
                        src={template.image} 
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FiFileText className="w-16 h-16" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {template.name}
                      </h3>
                      {selectedTemplate === template.id && (
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900">
                          <FiCheck className="text-indigo-600 dark:text-indigo-300" />
                        </div>
                      )}
                    </div>
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                        {template.category}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                      {template.description}
                    </p>
                    <div className="mt-4">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Best for: {template.bestFor}
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4">
                    <button
                      onClick={() => handleTemplateSelect(template.id)}
                      className={`w-full flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium ${
                        selectedTemplate === template.id
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                          : 'text-indigo-600 bg-white hover:bg-gray-100 dark:text-indigo-400 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      {selectedTemplate === template.id ? 'Selected' : 'Select Template'}
                      {selectedTemplate === template.id && (
                        <FiCheck className="ml-2" />
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}