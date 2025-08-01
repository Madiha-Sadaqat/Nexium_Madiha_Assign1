"use client";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import NeuralBackground from "@/components/NeuralBackground";
import { FiFileText, FiDownload, FiSave, FiSun, FiMoon, FiHome, FiEdit, FiPrinter, FiLogOut, FiClock } from "react-icons/fi";
import Link from "next/link";
import { generateResumePDF, generateResumeDOCX } from "@/lib/resume-generator";
//import { saveResume } from "@/lib/resume-storage";
import { DarkModeContext } from "../DarkModeProvider";



// Add types for generatedResume and related state
interface ExperienceOut {
  role: string;
  company: string;
  duration: string;
  responsibilities: string;
  achievements?: string;
}
interface EducationOut {
  degree: string;
  institution: string;
  year: string;
  gpa?: string;
  honors: string;
}
interface SkillsOut {
  technical: string[];
  soft: string[];
  languages: string[];
  certifications: string[];
}

interface ResumeContent {
  name: string;
  email: string;
  phone: string;
  address?: string;
  linkedin: string;
  portfolio?: string;
  summary: string;
  skills: SkillsOut;
  experience: ExperienceOut[];
  education: EducationOut[];
}
interface GeneratedResume {
  title: string;
  date: string;
  content: ResumeContent;
}

export default function AIOutputPage() {
  const { darkMode, setDarkMode } = useContext(DarkModeContext) as { darkMode: boolean, setDarkMode: (v: boolean) => void };
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  // Get resume data from localStorage
  const [generatedResume, setGeneratedResume] = useState<GeneratedResume>({
    title: "",
    date: new Date().toLocaleDateString(),
    content: {
      name: "",
      email: "",
      phone: "",
      address: "",
      linkedin: "",
      portfolio: "",
      summary: "",
      skills: { technical: [], soft: [], languages: [], certifications: [] },
      experience: [],
      education: []
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
    const savedResume = localStorage.getItem('currentResume');
    if (savedResume) {
      setGeneratedResume(JSON.parse(savedResume));
      }
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
      if (typeof window !== 'undefined') {
      // Save to localStorage (replace with your database save logic)
      localStorage.setItem('currentResume', JSON.stringify(generatedResume));
      }
      alert('Resume saved successfully!');
    } catch (error) {
      console.error("Save failed:", error);
      alert('Failed to save resume');
    }
  };

 const handleEdit = () => {
  // Transform the generated resume data back to the input form format
  const formData = {
    personal: {
      fullName: generatedResume.content.name || "",
      email: generatedResume.content.email || "",
      phone: generatedResume.content.phone || "",
      address: generatedResume.content.address || "",
      linkedin: generatedResume.content.linkedin || "",
      portfolio: generatedResume.content.portfolio || ""
    },
    experience: generatedResume.content.experience?.map((exp) => ({
      jobTitle: exp.role || "",
      company: exp.company || "",
      duration: exp.duration || "",
      responsibilities: exp.responsibilities || "",
      achievements: exp.achievements || ""
    })) || [],
    education: generatedResume.content.education?.map((edu) => ({
      degree: edu.degree || "",
      institution: edu.institution || "",
      year: edu.year || "",
      gpa: edu.gpa || "",
      honors: edu.honors || ""
    })) || [],
    skills: {
      technical: generatedResume.content.skills?.technical?.join(', ') || "",
      soft: generatedResume.content.skills?.soft?.join(', ') || "",
      languages: generatedResume.content.skills?.languages?.join(', ') || "",
      certifications: generatedResume.content.skills?.certifications?.join(', ') || ""
    }
  };

  // Save the transformed data to localStorage
  if (typeof window !== 'undefined') {
    console.log('Saving resume draft to localStorage:', formData);
    localStorage.setItem('resumeDraft', JSON.stringify(formData));
  }
  
  // Redirect to the input page
  router.push('/resume-input');
};

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
    window.print();
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/'); // Redirect to login page (src/app/page.tsx)
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
              <Link
                href="/history/"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-gray-700"
              >
                <FiClock className="mr-1" /> History
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
  {/* Header with Target Job Title */}
  <div className="text-center mb-8">
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
      {generatedResume.content.name || "Your Name"}
    </h2>
    <p className="text-indigo-600 dark:text-indigo-400 font-medium">
              {generatedResume.title || "Professional Resume"}
    </p>
    <div className="flex flex-wrap justify-center gap-4 mt-2">
      {generatedResume.content.email && (
        <span className="text-gray-600 dark:text-gray-300">
          {generatedResume.content.email}
        </span>
      )}
      {generatedResume.content.phone && (
        <span className="text-gray-600 dark:text-gray-300">
          {generatedResume.content.phone}
        </span>
      )}
      {generatedResume.content.linkedin && (
        <a 
          href={generatedResume.content.linkedin.startsWith('http') ? 
                generatedResume.content.linkedin : 
                `https://${generatedResume.content.linkedin}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          LinkedIn
        </a>
      )}
      {generatedResume.content.portfolio && (
        <a 
          href={generatedResume.content.portfolio.startsWith('http') ? 
                generatedResume.content.portfolio : 
                `https://${generatedResume.content.portfolio}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Portfolio
        </a>
      )}
    </div>
  </div>



  {/* Professional Summary */}
  {generatedResume.content.summary && (
    <div className="mb-8 rounded-xl p-6 bg-white dark:bg-gray-800">
      <h3 className="text-lg font-semibold border-b border-gray-300 dark:border-gray-600 pb-1 mb-3 text-gray-900 dark:text-white">
        PROFESSIONAL SUMMARY
      </h3>
      <p className="whitespace-pre-line text-gray-900 dark:text-white">{generatedResume.content.summary}</p>
    </div>
  )}

  {/* Skills Sections */}
  <div className="mb-8">
    <h3 className="text-lg font-semibold border-b border-gray-300 dark:border-gray-600 pb-1 mb-3 text-gray-900 dark:text-white">
      SKILLS
    </h3>
    <div className="rounded-xl p-6 bg-white dark:bg-gray-800">
    {/* Technical Skills */}
    {generatedResume.content.skills?.technical?.length > 0 && (
      <div className="mb-4">
          <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Technical:</h4>
        <div className="flex flex-wrap gap-2">
          {generatedResume.content.skills.technical.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-gradient-to-r from-indigo-400 to-purple-400 text-white dark:from-indigo-600 dark:to-purple-700 rounded-full text-sm font-medium">
              {skill}
            </span>
          ))}
        </div>
      </div>
    )}
    {/* Soft Skills */}
    {generatedResume.content.skills?.soft?.length > 0 && (
      <div className="mb-4">
          <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Soft Skills:</h4>
        <div className="flex flex-wrap gap-2">
          {generatedResume.content.skills.soft.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-gradient-to-r from-indigo-400 to-purple-400 text-white dark:from-indigo-600 dark:to-purple-700 rounded-full text-sm font-medium">
              {skill}
            </span>
          ))}
        </div>
      </div>
    )}
    {/* Languages */}
    {generatedResume.content.skills?.languages?.length > 0 && (
      <div className="mb-4">
          <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Languages:</h4>
        <div className="flex flex-wrap gap-2">
          {generatedResume.content.skills.languages.map((language, index) => (
              <span key={index} className="px-3 py-1 bg-gradient-to-r from-indigo-400 to-purple-400 text-white dark:from-indigo-600 dark:to-purple-700 rounded-full text-sm font-medium">
              {language}
            </span>
          ))}
        </div>
      </div>
    )}
    {/* Certifications */}
    {generatedResume.content.skills?.certifications?.length > 0 && (
      <div>
          <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Certifications:</h4>
        <ul className="list-disc list-inside pl-4">
          {generatedResume.content.skills.certifications.map((cert, index) => (
              <li key={index} className="inline-block mb-1">
                <span className="px-3 py-1 bg-gradient-to-r from-indigo-400 to-purple-400 text-white dark:from-indigo-600 dark:to-purple-700 rounded-full text-sm font-medium">
                  {cert}
                </span>
              </li>
          ))}
        </ul>
      </div>
    )}
  </div>
  </div>
  {/* Work Experience */}
  <div className="mb-8 rounded-xl p-6 bg-white dark:bg-gray-800">
    <h3 className="text-lg font-semibold border-b border-gray-300 dark:border-gray-600 pb-1 mb-3 text-gray-900 dark:text-white">
      PROFESSIONAL EXPERIENCE
    </h3>
    {generatedResume.content.experience?.map((exp, index) => (
      <div key={index} className="mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <h4 className="font-medium text-gray-900 dark:text-white">{exp.role}</h4>
          <span className="text-gray-600 dark:text-gray-400">{exp.duration}</span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 italic">{exp.company}</p>
        {exp.responsibilities && (
          <div className="mt-2">
            <h5 className="font-medium text-gray-900 dark:text-white">Responsibilities:</h5>
            <ul className="list-disc list-inside pl-4 space-y-1">
              {exp.responsibilities.split('\n').filter(Boolean).map((item, i) => (
                <li key={i} className="text-gray-900 dark:text-white">{item}</li>
              ))}
            </ul>
          </div>
        )}
        {exp.achievements && (
          <div className="mt-2">
            <h5 className="font-medium text-gray-900 dark:text-white">Key Achievements:</h5>
            <ul className="list-disc list-inside pl-4 space-y-1">
              {exp.achievements.split('\n').filter(Boolean).map((item, i) => (
                <li key={`achievement-${i}`} className="text-gray-900 dark:text-white">{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    ))}
  </div>
  {/* Education */}
  <div className="mb-8 rounded-xl p-6 bg-white dark:bg-gray-800">
    <h3 className="text-lg font-semibold border-b border-gray-300 dark:border-gray-600 pb-1 mb-3 text-gray-900 dark:text-white">
      EDUCATION
    </h3>
    {generatedResume.content.education?.map((edu, index) => (
      <div key={index} className="mb-4">
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <h4 className="font-medium text-gray-900 dark:text-white">{edu.degree}</h4>
          <span className="text-gray-600 dark:text-gray-400">{edu.year}</span>
        </div>
        <p className="italic text-gray-900 dark:text-white">{edu.institution}</p>
        <div className="mt-1">
          {edu.gpa && <span className="mr-4 text-gray-900 dark:text-white">GPA: {edu.gpa}</span>}
          {edu.honors && <span className="text-gray-900 dark:text-white">Honors: {edu.honors}</span>}
        </div>
      </div>
    ))}
  </div>
</div>

{/* Close dropdowns when clicking outside */}
{showDownloadOptions && (
  <div 
    className="fixed inset-0 z-0"
    onClick={() => {
      setShowDownloadOptions(false);
    }}
  />
)}

{/* Action Buttons */}
<div className="mt-8 flex flex-wrap justify-center gap-4">
  <button 
    onClick={handleEdit}
    className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors"
  >
    <FiEdit /> Edit Resume
  </button>
  
  <Link
    href="/history/"
    className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors"
  >
    <FiClock /> View History
  </Link>
  
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
    </div>
  );
}

