import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

export const generateResumePDF = async (resumeData: any) => {
  try {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const page = pdfDoc.addPage([600, 800]);
    pdfDoc.setTitle(`${resumeData.content.name || 'My'} Resume`);
    pdfDoc.setAuthor(resumeData.content.name || '');

    let y = 750;
    const left = 50;
    const lineHeight = 18;
    const sectionGap = 28;

    // Header: Name
    page.drawText(resumeData.content.name || 'JOHN DOE', {
      x: left,
      y,
      size: 24,
      font,
      color: rgb(0.2, 0.2, 0.2),
    });
    y -= 30;
    // Title
    page.drawText(resumeData.title || '', {
      x: left,
      y,
      size: 16,
      font,
      color: rgb(0.3, 0.3, 0.8),
    });
    y -= lineHeight;
    // Contact Info
    const contact = [
      resumeData.content.email,
      resumeData.content.phone,
      resumeData.content.linkedin,
      resumeData.content.portfolio
    ].filter(Boolean).join(' | ');
    if (contact) {
      page.drawText(contact, {
        x: left,
        y,
        size: 10,
        font,
        color: rgb(0.2, 0.2, 0.2),
      });
      y -= lineHeight;
    }
    y -= 10;
    // Target Position
    if (resumeData.content.targetJob && (resumeData.content.targetJob.industry || resumeData.content.targetJob.workType || resumeData.content.targetJob.locationPreference)) {
      page.drawText('TARGET POSITION', { x: left, y, size: 13, font, color: rgb(0.2,0.2,0.2) });
      y -= lineHeight;
      if (resumeData.content.targetJob.industry) {
        page.drawText(`Industry: ${resumeData.content.targetJob.industry}`, { x: left, y, size: 11, font, color: rgb(0.2,0.2,0.2) });
        y -= lineHeight;
      }
      if (resumeData.content.targetJob.workType) {
        page.drawText(`Work Type: ${resumeData.content.targetJob.workType}`, { x: left, y, size: 11, font, color: rgb(0.2,0.2,0.2) });
        y -= lineHeight;
      }
      if (resumeData.content.targetJob.locationPreference) {
        page.drawText(`Location: ${resumeData.content.targetJob.locationPreference}`, { x: left, y, size: 11, font, color: rgb(0.2,0.2,0.2) });
        y -= lineHeight;
      }
      y -= 10;
    }
    // Professional Summary
    if (resumeData.content.summary) {
      page.drawText('PROFESSIONAL SUMMARY', { x: left, y, size: 13, font, color: rgb(0.2,0.2,0.2) });
      y -= lineHeight;
      page.drawText(resumeData.content.summary, { x: left, y, size: 11, font, color: rgb(0.2,0.2,0.2), maxWidth: 500 });
      y -= lineHeight * 2;
    }
    // Skills
    page.drawText('SKILLS', { x: left, y, size: 13, font, color: rgb(0.2,0.2,0.2) });
    y -= lineHeight;
    const skills = resumeData.content.skills;
    if (skills.technical?.length) {
      page.drawText('Technical:', { x: left, y, size: 11, font, color: rgb(0.2,0.2,0.2) });
      y -= lineHeight;
      skills.technical.forEach((skill: string) => {
        page.drawText(`• ${skill}`, { x: left + 20, y, size: 10, font, color: rgb(0.3,0.3,0.3) });
        y -= 14;
      });
    }
    if (skills.soft?.length) {
      page.drawText('Soft Skills:', { x: left, y, size: 11, font, color: rgb(0.2,0.2,0.2) });
      y -= lineHeight;
      skills.soft.forEach((skill: string) => {
        page.drawText(`• ${skill}`, { x: left + 20, y, size: 10, font, color: rgb(0.3,0.3,0.3) });
        y -= 14;
      });
    }
    if (skills.languages?.length) {
      page.drawText('Languages:', { x: left, y, size: 11, font, color: rgb(0.2,0.2,0.2) });
      y -= lineHeight;
      skills.languages.forEach((lang: string) => {
        page.drawText(`• ${lang}`, { x: left + 20, y, size: 10, font, color: rgb(0.3,0.3,0.3) });
        y -= 14;
      });
    }
    if (skills.certifications?.length) {
      page.drawText('Certifications:', { x: left, y, size: 11, font, color: rgb(0.2,0.2,0.2) });
      y -= lineHeight;
      skills.certifications.forEach((cert: string) => {
        page.drawText(`• ${cert}`, { x: left + 20, y, size: 10, font, color: rgb(0.3,0.3,0.3) });
        y -= 14;
      });
    }
    y -= 10;
    // Experience
    page.drawText('PROFESSIONAL EXPERIENCE', { x: left, y, size: 13, font, color: rgb(0.2,0.2,0.2) });
    y -= lineHeight;
    resumeData.content.experience.forEach((exp: any) => {
      page.drawText(exp.role, { x: left, y, size: 11, font, color: rgb(0.2,0.2,0.2) });
      y -= lineHeight;
      page.drawText(`${exp.company} • ${exp.duration}`, { x: left + 10, y, size: 10, font, color: rgb(0.4,0.4,0.4) });
      y -= lineHeight;
      if (exp.responsibilities) {
        page.drawText('Responsibilities:', { x: left + 10, y, size: 10, font, color: rgb(0.2,0.2,0.2) });
        y -= 14;
        exp.responsibilities.split('\n').forEach((item: string) => {
          if (item.trim()) {
            page.drawText(`- ${item.trim()}`, { x: left + 20, y, size: 10, font, color: rgb(0.3,0.3,0.3) });
            y -= 12;
          }
        });
      }
      if (exp.achievements) {
        page.drawText('Key Achievements:', { x: left + 10, y, size: 10, font, color: rgb(0.2,0.2,0.2) });
        y -= 14;
        exp.achievements.split('\n').forEach((item: string) => {
          if (item.trim()) {
            page.drawText(`- ${item.trim()}`, { x: left + 20, y, size: 10, font, color: rgb(0.3,0.3,0.3) });
            y -= 12;
          }
        });
      }
      y -= 8;
    });
    y -= 10;
    // Education
    page.drawText('EDUCATION', { x: left, y, size: 13, font, color: rgb(0.2,0.2,0.2) });
    y -= lineHeight;
    resumeData.content.education.forEach((edu: any) => {
      page.drawText(edu.degree, { x: left, y, size: 11, font, color: rgb(0.2,0.2,0.2) });
      y -= lineHeight;
      page.drawText(`${edu.institution} • ${edu.year}`, { x: left + 10, y, size: 10, font, color: rgb(0.4,0.4,0.4) });
      y -= lineHeight;
      if (edu.gpa) {
        page.drawText(`GPA: ${edu.gpa}`, { x: left + 10, y, size: 10, font, color: rgb(0.3,0.3,0.3) });
        y -= 12;
      }
      if (edu.honors) {
        page.drawText(`Honors: ${edu.honors}`, { x: left + 10, y, size: 10, font, color: rgb(0.3,0.3,0.3) });
        y -= 12;
      }
      y -= 8;
    });
    y -= 10;
    // Salary Expectation
    if (resumeData.content.targetJob?.salaryExpectation) {
      page.drawText(`Salary Expectation: $${resumeData.content.targetJob.salaryExpectation}`, { x: left, y, size: 11, font, color: rgb(0.2,0.2,0.2) });
      y -= lineHeight;
    }
    // Serialize the PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resumeData.content.name || 'resume'}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export const generateResumeDOCX = async (resumeData: any) => {
  try {
    const doc = new Document({
      title: `${resumeData.content.name || 'My'} Resume`,
      description: `Resume for ${resumeData.title}`,
      sections: [{
        properties: {},
        children: [
          // Header
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: resumeData.content.name || 'JOHN DOE',
                bold: true,
                size: 28
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: resumeData.title || '',
                color: '4472C4',
                size: 22
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: [
                  resumeData.content.email,
                  resumeData.content.phone,
                  resumeData.content.linkedin,
                  resumeData.content.portfolio
                ].filter(Boolean).join(' | '),
                size: 18
              })
            ]
          }),
          new Paragraph({ text: '' }),
          // Target Position
          ...(resumeData.content.targetJob && (resumeData.content.targetJob.industry || resumeData.content.targetJob.workType || resumeData.content.targetJob.locationPreference)
            ? [
                new Paragraph({
                  heading: HeadingLevel.HEADING_2,
                  children: [new TextRun({ text: 'TARGET POSITION', bold: true })]
                }),
                ...(resumeData.content.targetJob.industry ? [new Paragraph({ children: [new TextRun({ text: `Industry: ${resumeData.content.targetJob.industry}` })] })] : []),
                ...(resumeData.content.targetJob.workType ? [new Paragraph({ children: [new TextRun({ text: `Work Type: ${resumeData.content.targetJob.workType}` })] })] : []),
                ...(resumeData.content.targetJob.locationPreference ? [new Paragraph({ children: [new TextRun({ text: `Location: ${resumeData.content.targetJob.locationPreference}` })] })] : []),
                new Paragraph({ text: '' })
              ] : []),
          // Professional Summary
          ...(resumeData.content.summary ? [
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              children: [new TextRun({ text: 'PROFESSIONAL SUMMARY', bold: true })]
            }),
            new Paragraph({ children: [new TextRun({ text: resumeData.content.summary })] }),
            new Paragraph({ text: '' })
          ] : []),
          // Skills
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: 'SKILLS', bold: true })]
          }),
          ...(resumeData.content.skills.technical?.length ? [
            new Paragraph({ children: [new TextRun({ text: 'Technical:', bold: true })] }),
            ...resumeData.content.skills.technical.map((skill: string) => new Paragraph({ children: [new TextRun({ text: `• ${skill}` })] })),
          ] : []),
          ...(resumeData.content.skills.soft?.length ? [
            new Paragraph({ children: [new TextRun({ text: 'Soft Skills:', bold: true })] }),
            ...resumeData.content.skills.soft.map((skill: string) => new Paragraph({ children: [new TextRun({ text: `• ${skill}` })] })),
          ] : []),
          ...(resumeData.content.skills.languages?.length ? [
            new Paragraph({ children: [new TextRun({ text: 'Languages:', bold: true })] }),
            ...resumeData.content.skills.languages.map((lang: string) => new Paragraph({ children: [new TextRun({ text: `• ${lang}` })] })),
          ] : []),
          ...(resumeData.content.skills.certifications?.length ? [
            new Paragraph({ children: [new TextRun({ text: 'Certifications:', bold: true })] }),
            ...resumeData.content.skills.certifications.map((cert: string) => new Paragraph({ children: [new TextRun({ text: `• ${cert}` })] })),
          ] : []),
          new Paragraph({ text: '' }),
          // Experience
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: 'PROFESSIONAL EXPERIENCE', bold: true })]
          }),
          ...resumeData.content.experience.flatMap((exp: any) => [
            new Paragraph({ children: [new TextRun({ text: exp.role, bold: true })] }),
            new Paragraph({ children: [new TextRun({ text: `${exp.company} • ${exp.duration}`, italics: true })] }),
            ...(exp.responsibilities ? [
              new Paragraph({ children: [new TextRun({ text: 'Responsibilities:', bold: true })] }),
              ...exp.responsibilities.split('\n').map((item: string) => new Paragraph({ children: [new TextRun({ text: `- ${item.trim()}` })] })),
            ] : []),
            ...(exp.achievements ? [
              new Paragraph({ children: [new TextRun({ text: 'Key Achievements:', bold: true })] }),
              ...exp.achievements.split('\n').map((item: string) => new Paragraph({ children: [new TextRun({ text: `- ${item.trim()}` })] })),
            ] : []),
            new Paragraph({ text: '' })
          ]),
          // Education
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: 'EDUCATION', bold: true })]
          }),
          ...resumeData.content.education.flatMap((edu: any) => [
            new Paragraph({ children: [new TextRun({ text: edu.degree, bold: true })] }),
            new Paragraph({ children: [new TextRun({ text: `${edu.institution} • ${edu.year}`, italics: true })] }),
            ...(edu.gpa ? [new Paragraph({ children: [new TextRun({ text: `GPA: ${edu.gpa}` })] })] : []),
            ...(edu.honors ? [new Paragraph({ children: [new TextRun({ text: `Honors: ${edu.honors}` })] })] : []),
            new Paragraph({ text: '' })
          ]),
          // Salary Expectation
          ...(resumeData.content.targetJob?.salaryExpectation ? [
            new Paragraph({ children: [new TextRun({ text: `Salary Expectation: $${resumeData.content.targetJob.salaryExpectation}` })] })
          ] : [])
        ]
      }]
    });
    const buffer = await Packer.toBuffer(doc);
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resumeData.content.name || 'resume'}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Error generating Word document:', error);
    throw error;
  }
};