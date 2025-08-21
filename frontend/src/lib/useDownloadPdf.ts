import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { bypassPayments } from "./env";

export const useDownloadPdf = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const downloadPdf = async (resumeData: any, templateId: string) => {
    setIsDownloading(true);
    
    try {
      if (bypassPayments()) {
        // Test mode - use client-side fallback
        await generateClientSidePdf(resumeData);
        toast({
          title: "PDF Downloaded",
          description: "Your resume has been downloaded successfully (Test Mode).",
        });
      } else {
        // Production mode - use edge function
        const { data, error } = await supabase.functions.invoke('generate-resume-pdf', {
          body: { resumeData, templateId }
        });

        if (error) {
          if (error.message.includes('Payment required') || error.message.includes('402')) {
            toast({
              title: "Upgrade Required",
              description: "Please upgrade to a paid plan to download PDFs.",
              variant: "destructive",
            });
            return;
          }
          throw error;
        }

        if (data?.pdfUrl) {
          // Download from URL
          const link = document.createElement('a');
          link.href = data.pdfUrl;
          link.download = `${resumeData.personalInfo?.firstName || 'resume'}-${templateId}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          // Fallback to client-side generation
          await generateClientSidePdf(resumeData);
        }

        toast({
          title: "PDF Downloaded",
          description: "Your resume has been downloaded successfully.",
        });
      }
    } catch (error) {
      console.error('PDF download error:', error);
      
      // Fallback to client-side generation on any error
      try {
        await generateClientSidePdf(resumeData);
        toast({
          title: "PDF Downloaded",
          description: "Your resume has been downloaded (fallback mode).",
        });
      } catch (fallbackError) {
        console.error('Client-side PDF generation failed:', fallbackError);
        toast({
          title: "Download Failed",
          description: "Unable to generate PDF. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsDownloading(false);
    }
  };

  const generateClientSidePdf = async (resumeData: any) => {
    // Find the preview element
    const previewElement = document.querySelector('#template-preview') || 
                          document.querySelector('#resume-preview') || 
                          document.querySelector('[data-preview]');
    
    if (!previewElement) {
      throw new Error('Preview element not found');
    }

    const canvas = await html2canvas(previewElement as HTMLElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Download the PDF
    const fileName = `${resumeData.personalInfo?.firstName || 'resume'}-${Date.now()}.pdf`;
    pdf.save(fileName);
  };

  return { downloadPdf, isDownloading };
};