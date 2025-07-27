"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import NeuralBackground from "@/components/NeuralBackground";
import { FiFileText, FiDownload, FiSave, FiSun, FiMoon, FiHome, FiEdit, FiShare2, FiPrinter, FiX } from "react-icons/fi";
import Link from "next/link";
import { generateResumePDF, generateResumeDOCX } from "@/lib/resume-generator";
//import { saveResume } from "@/lib/resume-storage";

export default function AIOutputPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
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

  // Get resume data from localStorage
  const [generatedResume, setGeneratedResume] = useState({
    title: "",
    date: new Date().toLocaleDateString(),
    content: {
      name: "",
      email: "",
      phone: "",
      linkedin: "",
      summary: "",
      skills: [] as string[],
      experience: [] as Array<{
        role: string;
        company: string;
        duration: string;
        responsibilities: string;
      }>,
      education: [] as Array<{
        degree: string;
        institution: string;
        year: string;
        honors: string;
      }>
    }
  });

  useEffect(() => {
    const savedResume = localStorage.getItem('currentResume');
    if (savedResume) {
      setGeneratedResume(JSON.parse(savedResume));
    }
  }, []);

  const handleDownload = async (type: 'pdf' | 'docx') => {
    setIsGenerating(true);
    try {
      if (type === 'pdf') {
        await generateResumePDF(generatedResume);
      } else {
        await generateResumeDOCX(generatedResume);
      }
      setShowDownloadOptions(false);
    } catch (error) {
      console.error("Download failed:", error);
      alert('Failed to generate document');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    try {
      // Save to localStorage (replace with your database save logic)
      localStorage.setItem('currentResume', JSON.stringify(generatedResume));
      alert('Resume saved successfully!');
    } catch (error) {
      console.error("Save failed:", error);
      alert('Failed to save resume');
    }
  };

  const handleEdit = () => {
    // Transform data back to input form structure
    const formData = {
      personal: {
        fullName: generatedResume.content.name,
        email: generatedResume.content.email,
        phone: generatedResume.content.phone,
        linkedin: generatedResume.content.linkedin
      },
      experience: generatedResume.content.experience.map(exp => ({
        jobTitle: exp.role,
        company: exp.company,
        responsibilities: exp.responsibilities,
        startYear: exp.duration?.split(' - ')[0] || '',
        endYear: exp.duration?.split(' - ')[1] || ''
      })),
      education: generatedResume.content.education.map(edu => ({
        degree: edu.degree,
        institution: edu.institution,
        year: edu.year,
        honors: edu.honors,
        gpa: ''
      })),
      skills: {
        technical: generatedResume.content.skills.join(', '),
        soft: '',
        languages: '',
        certifications: ''
      },
      target: {
        jobTitle: generatedResume.title,
        additionalPreferences: generatedResume.content.summary,
        industry: '',
        salaryExpectation: '',
        locationPreference: '',
        workType: '',
      }
    };

    localStorage.setItem('resumeDraft', JSON.stringify(formData));
    router.push('/resume-input');
  };

  const handleShare = (platform: string) => {
    const message = `Check out my resume: ${generatedResume.title}`;
    const url = window.location.href;
    
    switch(platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(message + ' ' + url)}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(message)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message + ' ' + url)}`);
        break;
      default:
        if (navigator.share) {
          navigator.share({
            title: 'My Resume',
            text: message,
            url: url
          });
        } else {
          navigator.clipboard.writeText(`${message}\n${url}`);
          alert('Link copied to clipboard!');
        }
    }
    setShowShareOptions(false);
  };

  const handlePrint = () => {
    window.print();
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
              <Link
                href="/dashboard/"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-gray-700"
              >
                <FiHome className="mr-1" /> Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden">
            {/* Resume Header */}
            <div className="p-8 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  <span className="text-indigo-600 dark:text-indigo-400">Tailored</span> Resume
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Generated for: {generatedResume.title || "Your Professional Title"} • {generatedResume.date}
                </p>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <button 
                    onClick={() => setShowDownloadOptions(!showDownloadOptions)}
                    disabled={isGenerating}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 text-white rounded-lg transition-colors w-full"
                  >
                    {isGenerating ? (
                      <span className="animate-pulse">Generating...</span>
                    ) : (
                      <>
                        <FiDownload /> Download
                      </>
                    )}
                  </button>
                  
                  {showDownloadOptions && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-600">
                      <button
                        onClick={() => handleDownload('pdf')}
                        className="block w-full text-left px-4 py-2 text-gray-800 dark:text-white hover:bg-indigo-100 dark:hover:bg-indigo-800"
                      >
                        Download as PDF
                      </button>
                      <button
                        onClick={() => handleDownload('docx')}
                        className="block w-full text-left px-4 py-2 text-gray-800 dark:text-white hover:bg-indigo-100 dark:hover:bg-indigo-800"
                      >
                        Download as Word
                      </button>
                    </div>
                  )}
                </div>
                <button 
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors flex-1 sm:flex-none"
                >
                  <FiSave /> Save
                </button>
              </div>
            </div>

            {/* Resume Content */}
            <div className="p-8">
              <div className="max-w-3xl mx-auto">
                {/* Resume Preview */}
                <div className="bg-white dark:bg-gray-700 rounded-xl shadow-md p-8 border border-gray-200 dark:border-gray-600">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {generatedResume.content.name || "Your Name"}
                    </h2>
                    <p className="text-indigo-600 dark:text-indigo-400">
                      {generatedResume.title || "Professional Title"}
                    </p>
                    {(generatedResume.content.email || generatedResume.content.phone || generatedResume.content.linkedin) && (
                      <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mt-2 text-sm text-gray-600 dark:text-gray-300">
                        {generatedResume.content.email && <span>{generatedResume.content.email}</span>}
                        {generatedResume.content.phone && <span>{generatedResume.content.phone}</span>}
                        {generatedResume.content.linkedin && (
                          <a 
                            href={generatedResume.content.linkedin.startsWith('http') ? generatedResume.content.linkedin : `https://${generatedResume.content.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            LinkedIn
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Summary */}
                  {generatedResume.content.summary && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2 mb-3">
                        SUMMARY
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                        {generatedResume.content.summary}
                      </p>
                    </div>
                  )}

                  {/* Skills */}
                  {generatedResume.content.skills?.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2 mb-3">
                        SKILLS
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {generatedResume.content.skills.map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Experience */}
                  {generatedResume.content.experience?.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2 mb-3">
                        PROFESSIONAL EXPERIENCE
                      </h3>
                      {generatedResume.content.experience.map((exp, index) => (
                        <div key={index} className="mb-6">
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <h4 className="font-medium text-gray-900 dark:text-white">{exp.role}</h4>
                            {exp.duration && (
                              <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                                {exp.duration}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 dark:text-gray-400">
                            {exp.company}
                          </p>
                          {exp.responsibilities && (
                            <ul className="mt-2 list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                              {exp.responsibilities.split('\n').filter(Boolean).map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Education */}
                  {generatedResume.content.education?.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2 mb-3">
                        EDUCATION
                      </h3>
                      {generatedResume.content.education.map((edu, index) => (
                        <div key={index} className="mb-4">
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <h4 className="font-medium text-gray-900 dark:text-white">{edu.degree}</h4>
                            {edu.year && (
                              <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                                {edu.year}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 dark:text-gray-400">
                            {edu.institution}
                          </p>
                          {edu.honors && (
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                              {edu.honors}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <button 
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors"
                  >
                    <FiEdit /> Edit Resume
                  </button>
                  
                  <div className="relative">
                    <button 
                      onClick={() => setShowShareOptions(!showShareOptions)}
                      className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors"
                    >
                      <FiShare2 /> Share
                    </button>
                    
                    {showShareOptions && (
                      <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-600">
                        <button
                          onClick={() => handleShare('whatsapp')}
                          className="block w-full text-left px-4 py-2 text-gray-800 dark:text-white hover:bg-indigo-100 dark:hover:bg-indigo-800"
                        >
                          WhatsApp
                        </button>
                        <button
                          onClick={() => handleShare('linkedin')}
                          className="block w-full text-left px-4 py-2 text-gray-800 dark:text-white hover:bg-indigo-100 dark:hover:bg-indigo-800"
                        >
                          LinkedIn
                        </button>
                        <button
                          onClick={() => handleShare('twitter')}
                          className="block w-full text-left px-4 py-2 text-gray-800 dark:text-white hover:bg-indigo-100 dark:hover:bg-indigo-800"
                        >
                          Twitter
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <button 
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors"
                  >
                    <FiPrinter /> Print
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Close dropdowns when clicking outside */}
      {(showDownloadOptions || showShareOptions) && (
        <div 
          className="fixed inset-0 z-0"
          onClick={() => {
            setShowDownloadOptions(false);
            setShowShareOptions(false);
          }}
        />
      )}
    </div>
  );
}

