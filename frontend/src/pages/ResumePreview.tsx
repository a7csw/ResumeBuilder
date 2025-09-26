import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import NavigationHeader from "@/components/NavigationHeader";
import { 
  Download, 
  Edit, 
  Share2, 
  Star, 
  Crown,
  FileText,
  Eye,
  ArrowLeft,
  CheckCircle2,
  Lock
} from "lucide-react";
import { useRevenueCat } from "@/hooks/useRevenueCat";
import { PaywallModal } from "@/components/premium/PaywallModal";
import { UpgradeBanner } from "@/components/premium/UpgradeBanner";

const ResumePreview = () => {
  const [downloadFormat, setDownloadFormat] = useState<"pdf" | "word">("pdf");
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const resumeRef = useRef<HTMLDivElement>(null);
  const { canAccessFeature, isPremium } = useRevenueCat();
  
  let { resumeData, selectedPlan = "free" } = location.state || {};

  // Try to get data from localStorage if not in navigation state
  if (!resumeData) {
    try {
      const savedData = localStorage.getItem('resumeFormData');
      if (savedData) {
        resumeData = JSON.parse(savedData);
      }
    } catch (error) {
      console.warn('Could not load form data from localStorage:', error);
    }
  }

  // Add error handling for missing data
  if (!resumeData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
        <NavigationHeader />
        <div className="container px-6 py-20 mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              No Resume Data Found
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              We couldn't find your resume data. Please try generating your resume again.
            </p>
            <Button onClick={() => navigate("/form-selection")}>
              Start Over
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { personalInfo, experiences, education, projects, skills, certificates = [], type } = resumeData;

  const handleDownload = async (format: "pdf" | "word") => {
    // Check if user can access PDF export (premium feature)
    if (format === "pdf" && !canAccessFeature("pdf_export")) {
      setShowPaywall(true);
      return;
    }

    try {
      setIsDownloading(true);
      
      if (format === "pdf") {
        // Use html2canvas and jsPDF for client-side PDF generation
        const html2canvas = (await import('html2canvas')).default;
        const jsPDF = (await import('jspdf')).default;
        
        const resumeElement = resumeRef.current;
        if (!resumeElement) {
          throw new Error("Resume element not found");
        }

        // Capture the resume as canvas
        const canvas = await html2canvas(resumeElement, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff'
        });

        // Create PDF
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        // Download the PDF
        const fileName = `${personalInfo.firstName || 'Resume'}_${personalInfo.lastName || 'NOVAECV'}.pdf`;
        pdf.save(fileName);
        
      } else if (format === "word") {
        // Generate Word document
        const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, WidthType, Table, TableRow, TableCell } = await import('docx');

        // Create Word document
        const doc = new Document({
          sections: [{
            properties: {},
            children: [
              // Header
              new Paragraph({
                text: `${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`,
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 }
              }),
              
              // Contact Info
              new Paragraph({
                children: [
                  new TextRun({ text: personalInfo.email || '', break: 1 }),
                  new TextRun({ text: personalInfo.phone || '', break: 1 }),
                  ...(personalInfo.location ? [new TextRun({ text: personalInfo.location, break: 1 })] : []),
                  ...(personalInfo.linkedin ? [new TextRun({ text: personalInfo.linkedin, break: 1 })] : [])
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 300 }
              }),

              // Summary
              ...(personalInfo.summary ? [
                new Paragraph({
                  text: "PROFESSIONAL SUMMARY",
                  heading: HeadingLevel.HEADING_2,
                  spacing: { after: 200 }
                }),
                new Paragraph({
                  text: personalInfo.summary,
                  spacing: { after: 300 }
                })
              ] : []),

              // Experience
              ...(experiences.length > 0 && experiences[0].title ? [
                new Paragraph({
                  text: "PROFESSIONAL EXPERIENCE",
                  heading: HeadingLevel.HEADING_2,
                  spacing: { after: 200 }
                }),
                ...experiences.map(exp => [
                  new Paragraph({
                    children: [
                      new TextRun({ text: exp.title, bold: true }),
                      new TextRun({ text: ` - ${exp.company}`, break: 1 }),
                      new TextRun({ text: `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`, break: 1 })
                    ],
                    spacing: { after: 100 }
                  }),
                  ...(exp.description ? [
                    new Paragraph({
                      text: exp.description,
                      spacing: { after: 200 }
                    })
                  ] : [])
                ]).flat()
              ] : []),

              // Education
              ...(education.length > 0 && education[0].degree ? [
                new Paragraph({
                  text: "EDUCATION",
                  heading: HeadingLevel.HEADING_2,
                  spacing: { after: 200 }
                }),
                ...education.map(edu => [
                  new Paragraph({
                    children: [
                      new TextRun({ text: edu.degree, bold: true }),
                      new TextRun({ text: ` - ${edu.school}`, break: 1 }),
                      new TextRun({ text: `${edu.startDate} - ${edu.endDate}`, break: 1 })
                    ],
                    spacing: { after: 100 }
                  }),
                  ...(edu.gpa ? [
                    new Paragraph({
                      text: `GPA: ${edu.gpa}`,
                      spacing: { after: 200 }
                    })
                  ] : [])
                ]).flat()
              ] : []),

              // Certificates
              ...(certificates && certificates.length > 0 && certificates[0].name ? [
                new Paragraph({
                  text: "CERTIFICATES",
                  heading: HeadingLevel.HEADING_2,
                  spacing: { after: 200 }
                }),
                ...certificates.map(cert => [
                  new Paragraph({
                    children: [
                      new TextRun({ text: cert.name, bold: true }),
                      new TextRun({ text: ` - ${cert.issuingOrganization}`, break: 1 }),
                      ...(cert.dateIssued ? [
                        new TextRun({ text: new Date(cert.dateIssued).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long' 
                        }), break: 1 })
                      ] : [])
                    ],
                    spacing: { after: 200 }
                  })
                ]).flat()
              ] : []),

              // Skills
              ...(skills.length > 0 ? [
                new Paragraph({
                  text: "SKILLS",
                  heading: HeadingLevel.HEADING_2,
                  spacing: { after: 200 }
                }),
                new Paragraph({
                  text: skills.map(skill => typeof skill === 'string' ? skill : skill.name).join(', '),
                  spacing: { after: 200 }
                })
              ] : [])
            ]
          }]
        });

        // Generate and download Word document
        const blob = await Packer.toBlob(doc);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${personalInfo.firstName || 'Resume'}_${personalInfo.lastName || 'NOVAECV'}.docx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/form/${type}`, { 
      state: { 
        editMode: true, 
        formData: resumeData 
      } 
    });
  };

  const MockResume = () => (
    <div className="bg-white p-4 sm:p-6 lg:p-8 shadow-lg max-w-4xl mx-auto" ref={resumeRef}>
      {/* Header */}
      <div className="border-b-2 border-slate-900 pb-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 break-words">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <div className="text-slate-600 space-y-1 text-sm sm:text-base">
          <p className="break-words">{personalInfo.email} • {personalInfo.phone}</p>
          {personalInfo.location && <p className="break-words">{personalInfo.location}</p>}
          {personalInfo.linkedin && <p className="break-words">{personalInfo.linkedin}</p>}
        </div>
      </div>

      {/* Professional Summary */}
      {personalInfo.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-2 border-b border-slate-300">
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-slate-700 leading-relaxed">
            {selectedPlan === "pro" 
              ? `${personalInfo.summary} Enhanced with AI optimization for maximum impact and keyword density.`
              : personalInfo.summary
            }
          </p>
        </div>
      )}

      {/* Experience */}
      {experiences.length > 0 && experiences[0].title && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-2 border-b border-slate-300">
            PROFESSIONAL EXPERIENCE
          </h2>
          {experiences.map((exp, index) => (
            <div key={exp.id} className="mb-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1 gap-1">
                <h3 className="text-lg font-semibold text-slate-900 break-words">
                  {exp.title}
                </h3>
                <span className="text-slate-600 text-sm whitespace-nowrap">
                  {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              <p className="text-slate-700 font-medium mb-2">
                {exp.company} • {exp.location}
              </p>
              {exp.description && (
                <p className="text-slate-700 leading-relaxed">
                  {selectedPlan === "pro" 
                    ? `${exp.description} [AI-Enhanced: Added industry-specific keywords and impact metrics]`
                    : exp.description
                  }
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && education[0].degree && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-2 border-b border-slate-300">
            EDUCATION
          </h2>
          {education.map((edu, index) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {edu.degree}
                  </h3>
                  <p className="text-slate-700">
                    {edu.school} • {edu.location}
                  </p>
                  {edu.gpa && (
                    <p className="text-slate-600">GPA: {edu.gpa}</p>
                  )}
                </div>
                <span className="text-slate-600 text-sm">
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certificates */}
      {certificates && certificates.length > 0 && certificates[0].name && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-2 border-b border-slate-300">
            CERTIFICATES
          </h2>
          {certificates.map((cert, index) => (
            <div key={cert.id} className="mb-3">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 break-words">
                    {cert.name}
                  </h3>
                  <p className="text-slate-700 font-medium">
                    {cert.issuingOrganization}
                  </p>
                </div>
                {cert.dateIssued && (
                  <span className="text-slate-600 text-sm whitespace-nowrap">
                    {new Date(cert.dateIssued).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long' 
                    })}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && projects[0].title && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-2 border-b border-slate-300">
            PROJECTS
          </h2>
          {projects.map((project, index) => (
            <div key={project.id} className="mb-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-1">
                {project.title}
              </h3>
              {project.description && (
                <p className="text-slate-700 leading-relaxed mb-2">
                  {project.description}
                </p>
              )}
              {project.technologies && (
                <p className="text-slate-600">
                  <strong>Technologies:</strong> {project.technologies}
                </p>
              )}
              {project.link && (
                <p className="text-slate-600">
                  <strong>Link:</strong> {project.link}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && skills[0] && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-2 border-b border-slate-300">
            SKILLS
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
              >
                {typeof skill === 'string' ? skill : skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Watermark for free plan */}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
      <NavigationHeader showBackButton={true} backTo="/resume-generated" />
      
      <div className="container px-3 sm:px-6 py-4 sm:py-8 mx-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4 animate-fade-in-up">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  Your Resume Preview
                </h1>
                                  <div className="flex items-center gap-2 mt-1">
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      selectedPlan === "pro" 
                        ? "bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}>
                      {selectedPlan === "pro" ? (
                        <>
                          <Crown className="w-3 h-3" />
                          Pro Plan
                        </>
                      ) : (
                        <>
                          <Star className="w-3 h-3" />
                          Free Plan
                        </>
                      )}
                    </div>
                    {selectedPlan === "pro" && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 rounded-full text-xs font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        AI Enhanced
                      </div>
                    )}
                  </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={handleEdit}
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                <Edit className="w-4 h-4" />
                Edit Resume
              </Button>
              
              <Button
                onClick={() => handleDownload(downloadFormat)}
                disabled={isDownloading}
                className="flex items-center gap-2 w-full sm:w-auto bg-gradient-to-r from-slate-700 via-gray-600 to-slate-600 hover:from-slate-800 hover:via-gray-700 hover:to-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                <Download className="w-4 h-4" />
                Download {downloadFormat.toUpperCase()}
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Upgrade Banner for Free Users */}
          {!isPremium && (
            <div className="mb-6">
              <UpgradeBanner 
                feature="PDF exports and premium templates"
                className="animate-fade-in-up delay-100"
                dismissible={true}
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Resume Preview */}
            <div className="lg:col-span-2">
              <Card className="p-0 overflow-hidden animate-fade-in-up delay-200">
                <MockResume />
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4 sm:space-y-6 animate-fade-in-up delay-400">
              {/* Download Options */}
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Download Options
                  </h3>
                  
                  <div className="space-y-3 mb-4">
                    <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors relative ${
                      canAccessFeature("pdf_export") 
                        ? "hover:bg-slate-50 dark:hover:bg-slate-800" 
                        : "opacity-75 cursor-not-allowed bg-gray-50 border-dashed"
                    }`}>
                      <input
                        type="radio"
                        name="format"
                        value="pdf"
                        checked={downloadFormat === "pdf"}
                        onChange={(e) => setDownloadFormat(e.target.value as "pdf")}
                        className="text-slate-600"
                        disabled={!canAccessFeature("pdf_export")}
                      />
                      {canAccessFeature("pdf_export") ? (
                      <FileText className="w-5 h-5 text-slate-500" />
                      ) : (
                        <Lock className="w-5 h-5 text-gray-400" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                        <p className="font-medium">PDF Format</p>
                          {!canAccessFeature("pdf_export") && (
                            <Crown className="w-4 h-4 text-yellow-500" />
                          )}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {canAccessFeature("pdf_export") 
                            ? "Best for applying online" 
                            : "Premium feature - Upgrade to unlock"
                          }
                        </p>
                      </div>
                    </label>
                    
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <input
                        type="radio"
                        name="format"
                        value="word"
                        checked={downloadFormat === "word"}
                        onChange={(e) => setDownloadFormat(e.target.value as "word")}
                        className="text-slate-600"
                      />
                      <FileText className="w-5 h-5 text-slate-500" />
                      <div>
                          <p className="font-medium">Word Format</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Easy to edit
                        </p>
                      </div>
                    </label>
                  </div>
                  
                  <Button
                    onClick={() => handleDownload(downloadFormat)}
                    disabled={isDownloading}
                    className="w-full bg-gradient-to-r from-slate-700 via-gray-600 to-slate-600 hover:from-slate-800 hover:via-gray-700 hover:to-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDownloading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                    <Download className="w-4 h-4 mr-2" />
                    Download {downloadFormat.toUpperCase()}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>



              {/* Actions */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Actions</h3>
                  
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      onClick={handleEdit}
                      className="w-full justify-start"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Resume
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => alert("Share functionality would be implemented here")}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Resume
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => navigate("/form-selection")}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Create New Resume
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Paywall Modal */}
      <PaywallModal
        open={showPaywall}
        onOpenChange={setShowPaywall}
        feature="PDF export"
        title="Upgrade to Export PDF"
        description="PDF export is a premium feature. Upgrade to Premium to download your resume as a PDF."
      />
    </div>
  );
};

export default ResumePreview;
