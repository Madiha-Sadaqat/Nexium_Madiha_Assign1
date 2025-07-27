import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

export const generateResumePDF = async (resumeData: any) => {
  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    
    // Embed fonts
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    // Add a new page
    const page = pdfDoc.addPage([600, 800]);
    
    // Set document metadata
    pdfDoc.setTitle(`${resumeData.content.name || 'My'} Resume`);
    pdfDoc.setAuthor(resumeData.content.name || '');
    
    // Draw header
    page.drawText(resumeData.content.name || 'JOHN DOE', {
      x: 50,
      y: 750,
      size: 24,
      font,
      color: rgb(0.2, 0.2, 0.2),
    });
    
    page.drawText(resumeData.title.split('-')[0]?.trim() || 'Senior UX Designer', {
      x: 50,
      y: 720,
      size: 16,
      font,
      color: rgb(0.3, 0.3, 0.8),
    });
    
    // Draw summary section
    page.drawText('SUMMARY', {
      x: 50,
      y: 680,
      size: 14,
      font,
      color: rgb(0.2, 0.2, 0.2),
    });
    
    page.drawText(resumeData.content.summary, {
      x: 50,
      y: 660,
      size: 12,
      font,
      color: rgb(0.3, 0.3, 0.3),
      maxWidth: 500,
    });
    
    // Draw skills section
    page.drawText('SKILLS', {
      x: 50,
      y: 620,
      size: 14,
      font,
      color: rgb(0.2, 0.2, 0.2),
    });
    
    let skillsY = 600;
    resumeData.content.skills.forEach((skill: string) => {
      page.drawText(`• ${skill}`, {
        x: 50,
        y: skillsY,
        size: 12,
        font,
        color: rgb(0.3, 0.3, 0.3),
      });
      skillsY -= 20;
    });
    
    // Draw experience section
    page.drawText('EXPERIENCE', {
      x: 50,
      y: skillsY - 20,
      size: 14,
      font,
      color: rgb(0.2, 0.2, 0.2),
    });
    
    let expY = skillsY - 40;
    resumeData.content.experience.forEach((exp: any) => {
      page.drawText(`${exp.role}`, {
        x: 50,
        y: expY,
        size: 12,
        font,
        color: rgb(0.2, 0.2, 0.2),
      });
      
      page.drawText(`${exp.company} • ${exp.duration}`, {
        x: 50,
        y: expY - 15,
        size: 10,
        font,
        color: rgb(0.4, 0.4, 0.4),
      });
      
      expY -= 40;
    });
    
    // Serialize the PDF
    const pdfBytes = await pdfDoc.save();
    
    // Create download
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
    // Create document
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
                text: resumeData.title.split('-')[0]?.trim() || 'Senior UX Designer',
                color: '4472C4',
                size: 22
              })
            ]
          }),
          new Paragraph({ text: '' }),
          
          // Summary
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: 'SUMMARY', bold: true })]
          }),
          new Paragraph({
            children: [new TextRun({ text: resumeData.content.summary })]
          }),
          new Paragraph({ text: '' }),
          
          // Skills
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: 'SKILLS', bold: true })]
          }),
          new Paragraph({
            children: resumeData.content.skills.map((skill: string) => 
              new TextRun({ text: `• ${skill}`, break: 1 })
            )
          }),
          new Paragraph({ text: '' }),
          
          // Experience
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: 'EXPERIENCE', bold: true })]
          }),
          ...resumeData.content.experience.flatMap((exp: any) => [
            new Paragraph({
              children: [
                new TextRun({
                  text: exp.role,
                  bold: true
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `${exp.company} • ${exp.duration}`,
                  italics: true
                })
              ]
            }),
            new Paragraph({ text: '' })
          ])
        ]
      }]
    });
    
    // Generate the Word document
    const buffer = await Packer.toBuffer(doc);
    
    // Create download
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