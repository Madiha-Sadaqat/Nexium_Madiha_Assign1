"use client";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import NeuralBackground from "@/components/NeuralBackground";
import Link from "next/link";
import {
  FiUpload,
  FiHome,
  FiUser,
  FiBriefcase,
  FiBook,
  FiCode,
  FiTarget,
  FiMoon,
  FiSun,
  FiArrowRight,
  FiArrowLeft,
  FiFileText,
  FiLogOut,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { DarkModeContext } from "../DarkModeProvider";

// Constants for localStorage keys
const RESUME_DRAFT_KEY = 'resumeDraft';
const CURRENT_RESUME_KEY = 'currentResume';

// Add types for formData and related state
interface Experience {
  jobTitle: string;
  company: string;
  duration: string;
  responsibilities: string;
  achievements: string;
}
interface Education {
  degree: string;
  institution: string;
  year: string;
  gpa: string;
  honors: string;
}
interface Skills {
  technical: string;
  soft: string;
  languages: string;
  certifications: string;
}
interface Target {
  jobTitle: string;
  industry: string;
  salaryExpectation: string;
  locationPreference: string;
  workType: string;
  additionalPreferences: string;
}
interface Personal {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  portfolio: string;
}
interface FormData {
  personal: Personal;
  experience: Experience[];
  education: Education[];
  skills: Skills;
  target: Target;
}

export default function ResumeInputPage() {
  const { darkMode, setDarkMode } = useContext(DarkModeContext) as { darkMode: boolean, setDarkMode: (v: boolean) => void };
  const [activeSection, setActiveSection] = useState("personal");
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form with all fields
  const initialFormData = {
    personal: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      linkedin: "",
      portfolio: "",
    },
    experience: [
      {
        jobTitle: "",
        company: "",
        duration: "",
        responsibilities: "",
        achievements: "",
      },
    ],
    education: [
      {
        degree: "",
        institution: "",
        year: "",
        gpa: "",
        honors: "",
      },
    ],
    skills: {
      technical: "",
      soft: "",
      languages: "",
      certifications: "",
    },
    target: {
      jobTitle: "",
      industry: "",
      salaryExpectation: "",
      locationPreference: "",
      workType: "",
      additionalPreferences: "",
    },
  };

  // Load draft if exists
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedDraft = localStorage.getItem("resumeDraft");
      if (savedDraft) {
        setFormData(JSON.parse(savedDraft));
      }
    }
  }, []);

const [formData, setFormData] = useState<FormData>(() => {
  if (typeof window !== 'undefined') {
    try {
      const savedDraft = localStorage.getItem('resumeDraft');
      if (savedDraft) {
        const parsedData = JSON.parse(savedDraft);
        
        // Safely merge saved data with initial structure
        return {
          personal: { ...initialFormData.personal, ...(parsedData.personal || {}) },
          experience: parsedData.experience?.length 
            ? parsedData.experience.map((exp: any) => ({
                ...initialFormData.experience[0],
                ...exp
              }))
            : initialFormData.experience,
          education: parsedData.education?.length
            ? parsedData.education.map((edu: any) => ({
                ...initialFormData.education[0],
                ...edu
              }))
            : initialFormData.education,
          skills: { ...initialFormData.skills, ...(parsedData.skills || {}) },
          target: { ...initialFormData.target, ...(parsedData.target || {}) }
        };
      }
    } catch (error) {
      console.error('Error loading draft:', error);
      // If error occurs, return clean initial form
      return initialFormData;
    }
  }
  // Default case - return initial empty form
  return initialFormData;
});


  const sections = [
    { id: "personal", icon: FiUser, label: "Personal Info" },
    { id: "experience", icon: FiBriefcase, label: "Experience" },
    { id: "education", icon: FiBook, label: "Education" },
    { id: "skills", icon: FiCode, label: "Skills" },
    { id: "target", icon: FiTarget, label: "Target Job" },
  ];

  // Calculate completion percentage
  const completionPercentage = Math.round(
    (Object.values(formData).filter((section) =>
      Array.isArray(section)
        ? section.length > 0 &&
          section.every((exp) => Object.values(exp).some(Boolean))
        : Object.values(section).some(Boolean)
    ).length /
      sections.length) *
      100
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section: string,
    index?: number
  ) => {
    const { name, value } = e.target;

    if (index !== undefined) {
      setFormData((prev) => ({
        ...prev,
        [section]: prev[section as keyof typeof formData].map(
          (item: any, i: number) =>
            i === index ? { ...item, [name]: value } : item
        ),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof formData],
          [name]: value,
        },
      }));
    }
  };

  const addNewItem = (section: string) => {
    if (section === "experience") {
      setFormData((prev) => ({
        ...prev,
        experience: [
          ...prev.experience,
          {
            jobTitle: "",
            company: "",
            duration: "",
            responsibilities: "",
            achievements: "",
          },
        ],
      }));
    } else if (section === "education") {
      setFormData((prev) => ({
        ...prev,
        education: [
          ...prev.education,
          {
            degree: "",
            institution: "",
            year: "",
            gpa: "",
            honors: "",
          },
        ],
      }));
    }
  };

  const removeItem = (section: string, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section as keyof typeof formData].filter(
        (_: any, i: number) => i !== index
      ),
    }));
  };

 const handleSaveDraft = () => {
  setIsSaving(true);
  if (typeof window !== 'undefined') {
    // Save complete form data including all sections
    localStorage.setItem('resumeDraft', JSON.stringify({
      ...formData,
      lastSaved: new Date().toISOString() // Add timestamp for reference
    }));
  }
  setTimeout(() => {
    setIsSaving(false);
    // Optional: Replace with toast notification
    alert('Progress saved! You can return later to continue editing.');
  }, 500);
};

const handleTailorResume = async () => {
  setIsSaving(true);
  
  try {
    // Create resume data object
    const resumeData = {
      title: formData.target.jobTitle,
      date: new Date().toLocaleDateString(),
      content: {
        name: formData.personal.fullName,
        email: formData.personal.email,
        phone: formData.personal.phone,
        address: formData.personal.address,
        linkedin: formData.personal.linkedin,
        portfolio: formData.personal.portfolio,
        summary: formData.target.additionalPreferences,
        skills: {
          technical: formData.skills.technical.split(',').map(skill => skill.trim()),
          soft: formData.skills.soft.split(',').map(skill => skill.trim()),
          languages: formData.skills.languages.split(',').map(skill => skill.trim()),
          certifications: formData.skills.certifications.split(',').map(skill => skill.trim())
        },
        experience: formData.experience.map(exp => ({
          role: exp.jobTitle,
          company: exp.company,
          duration: exp.duration,
          responsibilities: exp.responsibilities,
          achievements: exp.achievements
        })),
        education: formData.education.map(edu => ({
          degree: edu.degree,
          institution: edu.institution,
          year: edu.year,
          gpa: edu.gpa,
          honors: edu.honors
        })),
        targetJob: {
          industry: formData.target.industry,
          salaryExpectation: formData.target.salaryExpectation,
          locationPreference: formData.target.locationPreference,
          workType: formData.target.workType
        }
      }
    };

    // Save to localStorage for immediate use
    if (typeof window !== 'undefined') {
      localStorage.setItem(CURRENT_RESUME_KEY, JSON.stringify(resumeData));
    }

    // Save to API (you'll need to get user_id from auth later)
    const user_id = 'temp-user-id'; // Replace with actual user ID from auth
    const resume_text = JSON.stringify(resumeData);
    
    const response = await fetch('/api/saveResume', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id,
        resume_text
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('Resume saved successfully:', result);
      // Store the resume ID for later use
      if (typeof window !== 'undefined') {
        localStorage.setItem('current_resume_id', result.supabase_id);
      }
    } else {
      console.error('Failed to save resume:', result.error);
    }

  } catch (error) {
    console.error('Error saving resume:', error);
  } finally {
    setIsSaving(false);
    router.push('/output-page');
  }
};

  function handleNext() {
    const currentIndex = sections.findIndex((s) => s.id === activeSection);
    if (currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handlePrevious() {
    const currentIndex = sections.findIndex((s) => s.id === activeSection);
    if (currentIndex > 0) {
      setActiveSection(sections[currentIndex - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function isSectionComplete(sectionId: string): boolean {
    const sectionData = formData[sectionId as keyof typeof formData];
    if (Array.isArray(sectionData)) {
      return (
        sectionData.length > 0 &&
        sectionData.every((item) =>
          Object.values(item).some((val) => Boolean(val))
        )
      );
    }
    return Object.values(sectionData).some((val) => Boolean(val));
  }

  const handleLogout = () => {
    localStorage.clear();
    router.push('/'); // Redirect to login page (src/app/page.tsx)
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case "personal":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                name="fullName"
                value={formData.personal.fullName || ""}
                onChange={(e) => handleInputChange(e, "personal")}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700/50 text-gray-900 dark:text-white"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={formData.personal.email || ""}
                onChange={(e) => handleInputChange(e, "personal")}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700/50 text-gray-900 dark:text-white"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone
              </label>
              <input
                name="phone"
                value={formData.personal.phone || ""}
                onChange={(e) => handleInputChange(e, "personal")}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700/50 text-gray-900 dark:text-white"
                placeholder="+92 300 1234567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                LinkedIn
              </label>
              <input
                name="linkedin"
                value={formData.personal.linkedin || ""}
                onChange={(e) => handleInputChange(e, "personal")}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700/50 text-gray-900 dark:text-white"
                placeholder="linkedin.com/in/yourprofile"
              />
            </div>
          </div>
        );

      case "experience":
        return (
          <div className="space-y-6">
            {formData.experience.map((exp, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Job Title
                    </label>
                    <input
                      name="jobTitle"
                      value={exp.jobTitle || ""}
                      onChange={(e) =>
                        handleInputChange(e, "experience", index)
                      }
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700/50 text-gray-900 dark:text-white"
                      placeholder="Software Engineer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Company
                    </label>
                    <input
                      name="company"
                      value={exp.company || ""}
                      onChange={(e) =>
                        handleInputChange(e, "experience", index)
                      }
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700/50 text-gray-900 dark:text-white"
                      placeholder="Google Inc."
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Responsibilities
                  </label>
                  <textarea
                    name="responsibilities"
                    value={exp.responsibilities || ""}
                    onChange={(e) => handleInputChange(e, "experience", index)}
                    className="w-full h-24 p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700/50 text-gray-900 dark:text-white"
                    placeholder="Describe your key responsibilities..."
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => removeItem("experience", index)}
                    className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                  >
                    Remove Experience
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={() => addNewItem("experience")}
              className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg"
            >
              + Add Another Experience
            </button>
          </div>
        );

      case "education":
        return (
          <div className="space-y-6">
            {formData.education.map((edu, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Degree
                    </label>
                    <select
                      name="degree"
                      value={edu.degree || ""}
                      onChange={(e) => handleInputChange(e, "education", index)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700/50 text-gray-900 dark:text-white"
                    >
                      <option value="">Select Degree</option>
                      <option value="High School">High School</option>
                      <option value="Associate">Associate</option>
                      <option value="Bachelor's">Bachelor's</option>
                      <option value="Master's">Master's</option>
                      <option value="PhD">PhD</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Institution
                    </label>
                    <input
                      name="institution"
                      value={edu.institution || ""}
                      onChange={(e) => handleInputChange(e, "education", index)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700/50 text-gray-900 dark:text-white"
                      placeholder="University of California"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Graduation Year
                    </label>
                    <input
                      name="year"
                      type="number"
                      min="1900"
                      max={new Date().getFullYear() + 5}
                      value={edu.year || ""}
                      onChange={(e) => handleInputChange(e, "education", index)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700/50 text-gray-900 dark:text-white"
                      placeholder="2020"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      CGPA 
                    </label>
                    <input
                      name="gpa"
                      type="number"
                      step="0.1"
                      min="0"
                      max="4"
                      value={edu.gpa || ""}
                      onChange={(e) => handleInputChange(e, "education", index)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700/50 text-gray-900 dark:text-white"
                      placeholder="3.5"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Honors/Awards (Optional)
                  </label>
                  <textarea
                    name="honors"
                    value={edu.honors || ""}
                    onChange={(e) => handleInputChange(e, "education", index)}
                    className="w-full h-20 p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700/50 text-gray-900 dark:text-white"
                    placeholder="Dean's List, Scholarships, etc."
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => removeItem("education", index)}
                    className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                  >
                    Remove Education
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={() => addNewItem("education")}
              className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg"
            >
              + Add Another Education
            </button>
          </div>
        );

      case "skills":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Technical Skills
              </label>
              <textarea
                name="technical"
                value={formData.skills.technical || ""}
                onChange={(e) => handleInputChange(e, "skills")}
                className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700/50 text-gray-900 dark:text-white"
                placeholder="JavaScript, React, Python, Machine Learning..."
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Separate skills with commas
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Soft Skills
              </label>
              <textarea
                name="soft"
                value={formData.skills.soft || ""}
                onChange={(e) => handleInputChange(e, "skills")}
                className="w-full h-24 p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700/50 text-gray-900 dark:text-white"
                placeholder="Leadership, Communication, Teamwork..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Languages
                </label>
                <input
                  name="languages"
                  value={formData.skills.languages || ""}
                  onChange={(e) => handleInputChange(e, "skills")}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700/50 text-gray-900 dark:text-white"
                  placeholder="English (Fluent), Spanish (Intermediate)..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Certifications
                </label>
                <input
                  name="certifications"
                  value={formData.skills.certifications || ""}
                  onChange={(e) => handleInputChange(e, "skills")}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700/50 text-gray-900 dark:text-white"
                  placeholder="AWS Certified, PMP, Google Analytics..."
                />
              </div>
            </div>
          </div>
        );

      case "target":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Desired Job Title
                </label>
                <input
                  name="jobTitle"
                  value={formData.target.jobTitle || ""}
                  onChange={(e) => handleInputChange(e, "target")}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700/50 text-gray-900 dark:text-white"
                  placeholder="Senior Software Engineer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Industry
                </label>
                <select
                  name="industry"
                  value={formData.target.industry || ""}
                  onChange={(e) => handleInputChange(e, "target")}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700/50 text-gray-900 dark:text-white"
                >
                  <option value="">Select Industry</option>
                  <option value="Technology">Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Salary Expectation
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500 dark:text-gray-400">
                    $
                  </span>
                  <input
                    name="salaryExpectation"
                    type="number"
                    value={formData.target.salaryExpectation || ""}
                    onChange={(e) => handleInputChange(e, "target")}
                    className="w-full pl-8 p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700/50 text-gray-900 dark:text-white"
                    placeholder="80000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location Preference
                </label>
                <select
                  name="locationPreference"
                  value={formData.target.locationPreference || ""}
                  onChange={(e) => handleInputChange(e, "target")}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700/50 text-gray-900 dark:text-white"
                >
                  <option value="">Select Preference</option>
                  <option value="On-site">On-site</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Work Type
                </label>
                <select
                  name="workType"
                  value={formData.target.workType || ""}
                  onChange={(e) => handleInputChange(e, "target")}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700/50 text-gray-900 dark:text-white"
                >
                  <option value="">Select Type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Additional Preferences (Optional)
              </label>
              <textarea
                name="additionalPreferences"
                value={formData.target.additionalPreferences || ""}
                onChange={(e) => handleInputChange(e, "target")}
                className="w-full h-24 p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700/50 text-gray-900 dark:text-white"
                placeholder="Company size, benefits, culture preferences..."
              />
            </div>
          </div>
        );
      default:
        return null;
    }
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
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">
                ResumeTailor
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label={
                  darkMode ? "Switch to light mode" : "Switch to dark mode"
                }
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

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 h-2.5">
        <div
          className="bg-indigo-600 h-2.5 transition-all duration-500"
          style={{ width: `${completionPercentage}%` }}
        ></div>
      </div>

      <div className="relative z-10 flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white p-8 pb-0">
              Resume Builder
            </h1>

            {/* Form Sections */}
            <div className="flex flex-col md:flex-row">
              {/* Sidebar Navigation */}
              <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center gap-3 w-full px-6 py-4 text-left transition-colors ${
                      activeSection === section.id
                        ? "bg-indigo-50 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300"
                    } ${
                      isSectionComplete(section.id)
                        ? "border-l-4 border-indigo-500"
                        : ""
                    }`}
                  >
                    <section.icon className="flex-shrink-0" />
                    <span>{section.label}</span>
                    {isSectionComplete(section.id) && (
                      <span className="ml-auto w-2 h-2 bg-green-500 rounded-full"></span>
                    )}
                  </button>
                ))}
              </div>

              {/* Active Section Content */}
              <div className="flex-1 p-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  {sections.find((s) => s.id === activeSection)?.label}
                </h2>

                {renderSectionContent()}

                <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                  <button
                    onClick={handlePrevious}
                    disabled={activeSection === sections[0].id}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    <FiArrowLeft /> Previous
                  </button>

                  <div className="flex gap-4">
                    <button
                      onClick={handleSaveDraft}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>Save Draft</>
                      )}
                    </button>

                    {activeSection !== sections[sections.length - 1].id ? (
                      <button
                        onClick={handleNext}
                        disabled={!isSectionComplete(activeSection) || isSaving}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 text-white rounded-lg transition-colors disabled:opacity-50"
                      >
                        Next <FiArrowRight />
                      </button>
                    ) : (
                      <button
                        onClick={handleTailorResume}
                        disabled={completionPercentage < 100 || isSaving}
                        className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg shadow-md transition-all disabled:opacity-50 flex items-center justify-center"
                      >
                        {isSaving ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          <>Tailor My Resume</>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}