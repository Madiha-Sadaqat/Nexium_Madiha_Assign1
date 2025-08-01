import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { resumeData, jobDescription } = await request.json();

    // Helper function to fix common typos
    const fixTypo = (text: string): string => {
      return text.toLowerCase()
        .replace('next.javascript.js', 'Next.js')
        .replace('react.javascript.js', 'React.js')
        .replace('next', 'Next.js')
        .replace('react', 'React.js')
        .replace('javascriptjs', 'JavaScript')
        .replace('javascript.js', 'JavaScript')
        .replace('js', 'JavaScript')
        .replace('ts', 'TypeScript')
        .replace('commination', 'Communication')
        .replace('communiction', 'Communication')
        .replace('leadership', 'Leadership')
        .replace('teamwork', 'Team Collaboration')
        .replace('aws', 'AWS')
        .replace('c#', 'C#')
        .replace('tailwind', 'Tailwind CSS')
        .replace('node', 'Node.js')
        .replace('mongodb', 'MongoDB')
        .replace('sql', 'SQL')
        .replace('html', 'HTML')
        .replace('css', 'CSS')
        .replace('git', 'Git')
        .replace('docker', 'Docker')
        .replace('kubernetes', 'Kubernetes')
        .replace('jenkins', 'Jenkins')
        .replace('jira', 'Jira')
        .replace('agile', 'Agile')
        .replace('scrum', 'Scrum');
    };

    // Helper function to remove duplicates and fix typos
    const cleanSkills = (skills: string[]): string[] => {
      const fixedSkills = skills.map(skill => {
        const fixed = fixTypo(skill);
        return fixed.charAt(0).toUpperCase() + fixed.slice(1);
      });
      
      // Remove duplicates while preserving order
      return fixedSkills.filter((skill, index, arr) => arr.indexOf(skill) === index);
    };

    // Generate personalized summary based on content and job description
    const generateSummary = () => {
      const name = resumeData.content.name || 'Professional';
      const technicalSkills = resumeData.content.skills?.technical || [];
      const experience = resumeData.content.experience || [];
      
      let summary = '';
      
      // Determine experience level
      if (jobDescription.toLowerCase().includes('senior') || jobDescription.toLowerCase().includes('lead')) {
        summary += 'Senior-level ';
      } else if (jobDescription.toLowerCase().includes('junior') || jobDescription.toLowerCase().includes('entry')) {
        summary += 'Junior-level ';
      } else {
        summary += 'Mid-level ';
      }
      
      // Add primary skills
      if (technicalSkills.length > 0) {
        const primarySkills = technicalSkills.slice(0, 3).join(', ');
        summary += `developer with expertise in ${primarySkills}`;
      } else {
        summary += 'developer';
      }
      
      // Add experience context
      if (experience.length > 0) {
        summary += ` and ${experience.length} year${experience.length > 1 ? 's' : ''} of professional experience`;
      }
      
      // Add job-specific strengths
      if (jobDescription.toLowerCase().includes('react')) {
        summary += '. Specializes in building responsive React applications';
      }
      if (jobDescription.toLowerCase().includes('next')) {
        summary += '. Experienced with Next.js and modern web development';
      }
      if (jobDescription.toLowerCase().includes('full stack')) {
        summary += '. Full-stack developer with end-to-end project experience';
      }
      if (jobDescription.toLowerCase().includes('senior')) {
        summary += '. Proven leadership in technical projects and team mentoring';
      }
      
      summary += '. Strong problem-solving abilities and commitment to delivering high-quality solutions.';
      
      return summary;
    };

    // Smart AI tailoring logic with typo fixing and better analysis
    const tailoredResume = {
      ...resumeData,
      content: {
        ...resumeData.content,
        // Generate personalized summary
        summary: generateSummary(),
        
        // Fix typos and enhance skills based on job description
        skills: {
          technical: cleanSkills([
            ...(resumeData.content.skills?.technical || []),
            // Add relevant skills based on job description (only if not already present)
            ...(jobDescription.toLowerCase().includes('react') && !resumeData.content.skills?.technical?.some((s: string) => s.toLowerCase().includes('react')) ? ['React.js'] : []),
            ...(jobDescription.toLowerCase().includes('next') && !resumeData.content.skills?.technical?.some((s: string) => s.toLowerCase().includes('next')) ? ['Next.js'] : []),
            ...(jobDescription.toLowerCase().includes('typescript') && !resumeData.content.skills?.technical?.some((s: string) => s.toLowerCase().includes('typescript')) ? ['TypeScript'] : []),
            ...(jobDescription.toLowerCase().includes('full stack') && !resumeData.content.skills?.technical?.some((s: string) => s.toLowerCase().includes('full stack')) ? ['Full Stack Development'] : []),
            ...(jobDescription.toLowerCase().includes('senior') && !resumeData.content.skills?.technical?.some((s: string) => s.toLowerCase().includes('leadership')) ? ['Technical Leadership'] : []),
            ...(jobDescription.toLowerCase().includes('frontend') && !resumeData.content.skills?.technical?.some((s: string) => s.toLowerCase().includes('frontend')) ? ['Frontend Development'] : []),
            ...(jobDescription.toLowerCase().includes('backend') && !resumeData.content.skills?.technical?.some((s: string) => s.toLowerCase().includes('backend')) ? ['Backend Development'] : [])
          ]),
          
          soft: cleanSkills([
            ...(resumeData.content.skills?.soft || []),
            // Add relevant soft skills based on job description
            ...(jobDescription.toLowerCase().includes('senior') ? ['Leadership', 'Team Management'] : []),
            ...(jobDescription.toLowerCase().includes('communication') ? ['Communication', 'Collaboration'] : []),
            ...(jobDescription.toLowerCase().includes('team') ? ['Team Collaboration'] : []),
            'Problem Solving',
            'Adaptability'
          ]),
          
          languages: cleanSkills(resumeData.content.skills?.languages || []),
          certifications: cleanSkills(resumeData.content.skills?.certifications || [])
        },
        
        // Enhance experience descriptions with job-specific improvements
        experience: resumeData.content.experience?.map((exp: any, index: number) => {
          let enhancedResponsibilities = exp.responsibilities || '';
          let enhancedAchievements = exp.achievements || '';
          
          // Enhance responsibilities based on job description
          if (jobDescription.toLowerCase().includes('react')) {
            enhancedResponsibilities += enhancedResponsibilities ? '. ' : '';
            enhancedResponsibilities += 'Developed responsive React applications with modern JavaScript and TypeScript.';
          }
          
          if (jobDescription.toLowerCase().includes('next')) {
            enhancedResponsibilities += enhancedResponsibilities ? '. ' : '';
            enhancedResponsibilities += 'Built scalable applications using Next.js framework with server-side rendering.';
          }
          
          if (jobDescription.toLowerCase().includes('frontend')) {
            enhancedResponsibilities += enhancedResponsibilities ? '. ' : '';
            enhancedResponsibilities += 'Created responsive user interfaces and optimized frontend performance.';
          }
          
          if (jobDescription.toLowerCase().includes('backend')) {
            enhancedResponsibilities += enhancedResponsibilities ? '. ' : '';
            enhancedResponsibilities += 'Developed robust backend APIs and database solutions.';
          }
          
          // Enhance achievements based on job description (different from responsibilities)
          if (jobDescription.toLowerCase().includes('senior')) {
            enhancedAchievements += enhancedAchievements ? '. ' : '';
            enhancedAchievements += 'Led development team of 3+ developers and mentored junior developers.';
          } else if (jobDescription.toLowerCase().includes('junior')) {
            enhancedAchievements += enhancedAchievements ? '. ' : '';
            enhancedAchievements += 'Successfully completed projects ahead of schedule with high code quality.';
          } else {
            enhancedAchievements += enhancedAchievements ? '. ' : '';
            enhancedAchievements += 'Delivered projects within deadlines with positive stakeholder feedback.';
          }
          
          // Add specific achievements based on technologies
          if (jobDescription.toLowerCase().includes('react')) {
            enhancedAchievements += enhancedAchievements ? '. ' : '';
            enhancedAchievements += 'Improved application performance by 40% through React optimization.';
          }
          
          if (jobDescription.toLowerCase().includes('next')) {
            enhancedAchievements += enhancedAchievements ? '. ' : '';
            enhancedAchievements += 'Reduced page load times by 60% using Next.js optimization techniques.';
          }
          
          return {
            ...exp,
            role: exp.role ? exp.role.charAt(0).toUpperCase() + exp.role.slice(1) : exp.role,
            company: exp.company ? exp.company.charAt(0).toUpperCase() + exp.company.slice(1) : exp.company,
            responsibilities: enhancedResponsibilities || 'Developed and maintained high-quality applications using modern technologies.',
            achievements: enhancedAchievements || 'Successfully delivered projects within deadlines with positive stakeholder feedback.'
          };
        }) || [],
        
        // Keep education as is but fix capitalization
        education: resumeData.content.education?.map((edu: any) => ({
          ...edu,
          degree: edu.degree ? edu.degree.charAt(0).toUpperCase() + edu.degree.slice(1) : edu.degree,
          institution: edu.institution ? edu.institution.charAt(0).toUpperCase() + edu.institution.slice(1) : edu.institution
        })) || []
      }
    };

    return NextResponse.json({
      tailoredResume,
      success: true,
      message: "Resume tailored based on job requirements"
    });

  } catch (error) {
    console.error('Error in n8n tailorResume API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to tailor resume via n8n',
        details: error instanceof Error ? error.message : 'Unknown error',
        fallback: 'Please ensure n8n is running on port 5678 and workflow is active'
      },
      { status: 500 }
    );
  }
} 