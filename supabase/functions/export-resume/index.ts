import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const log = (msg: string, details?: any) => {
  console.log(`[EXPORT-RESUME] ${msg}`, details ?? "");
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    // Check user plan
    const { data: planData } = await supabase
      .from("user_plans")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .maybeSingle();

    if (!planData || !planData.is_active) {
      throw new Error("Active plan required for export");
    }

    // Check plan allows export
    if (!['basic', 'ai', 'pro'].includes(planData.plan_type)) {
      throw new Error("Your plan does not support export");
    }

    const { resumeData, templateId, exportType } = await req.json();
    
    if (!resumeData || !templateId || !exportType) {
      throw new Error("Missing required fields");
    }

    if (!['pdf', 'docx'].includes(exportType)) {
      throw new Error("Invalid export type");
    }

    log("Processing export", { 
      userId: user.id, 
      templateId, 
      exportType,
      planType: planData.plan_type 
    });

    // Mark first export for refund policy
    if (!planData.first_export_at) {
      await supabase
        .from("user_plans")
        .update({ 
          first_export_at: new Date().toISOString(),
          can_refund: false // No refunds after first export
        })
        .eq("id", planData.id);
    }

    // Generate HTML content for the resume
    const htmlContent = generateResumeHTML(resumeData, templateId);
    
    // Create a simple hash for audit purposes
    const encoder = new TextEncoder();
    const data = encoder.encode(htmlContent + user.id + new Date().toISOString());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const fileHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Log the export
    await supabase.from("export_logs").insert({
      user_id: user.id,
      plan_type: planData.plan_type,
      template_id: templateId,
      export_type: exportType,
      file_hash: fileHash,
      file_size: htmlContent.length,
      metadata: {
        timestamp: new Date().toISOString(),
        template_id: templateId,
        export_type: exportType
      }
    });

    // Update resume export count
    if (resumeData.id) {
      await supabase
        .from("Resumes")
        .update({ 
          is_exported: true,
          export_count: resumeData.export_count ? resumeData.export_count + 1 : 1
        })
        .eq("id", resumeData.id);
    }

    log("Export completed", { 
      userId: user.id, 
      templateId, 
      exportType,
      fileHash: fileHash.substring(0, 8) + "..." 
    });

    return new Response(JSON.stringify({ 
      htmlContent,
      fileHash,
      exportType,
      message: "Export generated successfully"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log("ERROR", message);
    
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

function generateResumeHTML(resumeData: any, templateId: string): string {
  const {
    personalInfo = {},
    summary = "",
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    research = [],
    awards = [],
    languages = [],
    volunteer = []
  } = resumeData;

  // Template-specific styling
  const templateStyles = {
    classic: `
      body { font-family: 'Times New Roman', serif; color: #333; line-height: 1.6; }
      .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 1rem; }
      .section { margin: 1.5rem 0; }
      .section-title { font-size: 1.2rem; font-weight: bold; border-bottom: 1px solid #666; padding-bottom: 0.25rem; margin-bottom: 0.75rem; }
    `,
    modern: `
      body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #2c3e50; line-height: 1.5; }
      .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; text-align: center; }
      .section { margin: 1.5rem 0; }
      .section-title { font-size: 1.1rem; font-weight: 600; color: #667eea; margin-bottom: 0.75rem; }
    `,
    minimal: `
      body { font-family: 'Arial', sans-serif; color: #444; line-height: 1.5; }
      .header { text-align: left; margin-bottom: 2rem; }
      .section { margin: 1.25rem 0; }
      .section-title { font-size: 1rem; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem; }
    `,
    creative: `
      body { font-family: 'Georgia', serif; color: #2c2c2c; line-height: 1.6; }
      .header { background: #f8f9fa; padding: 1.5rem; border-left: 4px solid #e74c3c; }
      .section { margin: 1.5rem 0; }
      .section-title { font-size: 1.1rem; color: #e74c3c; font-weight: bold; margin-bottom: 0.75rem; }
    `,
    technical: `
      body { font-family: 'Courier New', monospace; color: #333; line-height: 1.5; }
      .header { border: 2px solid #333; padding: 1rem; margin-bottom: 1rem; }
      .section { margin: 1.25rem 0; }
      .section-title { font-size: 1rem; font-weight: bold; background: #f4f4f4; padding: 0.25rem 0.5rem; margin-bottom: 0.5rem; }
    `
  };

  const style = templateStyles[templateId as keyof typeof templateStyles] || templateStyles.classic;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.firstName || ''} ${personalInfo.lastName || ''} - Resume</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { max-width: 8.5in; margin: 0 auto; padding: 0.5in; background: white; }
        ${style}
        .contact-info { display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; margin-top: 0.5rem; }
        .experience-item, .education-item, .project-item { margin-bottom: 1rem; }
        .item-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.25rem; }
        .job-title, .degree { font-weight: bold; }
        .company, .school { font-style: italic; }
        .date { font-size: 0.9rem; color: #666; }
        .bullets { margin-left: 1rem; margin-top: 0.25rem; }
        .bullets li { margin-bottom: 0.125rem; }
        .skills-grid { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .skill-item { background: #f0f0f0; padding: 0.25rem 0.5rem; border-radius: 3px; font-size: 0.9rem; }
        .two-column { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        @media print { body { padding: 0; } }
        .watermark { position: fixed; bottom: 0.25in; right: 0.25in; font-size: 0.7rem; color: #ccc; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${personalInfo.firstName || ''} ${personalInfo.lastName || ''}</h1>
        <div class="contact-info">
            ${personalInfo.email ? `<span>${personalInfo.email}</span>` : ''}
            ${personalInfo.phone ? `<span>${personalInfo.phone}</span>` : ''}
            ${personalInfo.location ? `<span>${personalInfo.location}</span>` : ''}
            ${personalInfo.linkedin ? `<span>${personalInfo.linkedin}</span>` : ''}
            ${personalInfo.website ? `<span>${personalInfo.website}</span>` : ''}
        </div>
    </div>

    ${summary ? `
    <div class="section">
        <div class="section-title">Professional Summary</div>
        <p>${summary}</p>
    </div>
    ` : ''}

    ${experience.length > 0 ? `
    <div class="section">
        <div class="section-title">Professional Experience</div>
        ${experience.map((exp: any) => `
        <div class="experience-item">
            <div class="item-header">
                <div>
                    <div class="job-title">${exp.title || ''}</div>
                    <div class="company">${exp.company || ''}</div>
                </div>
                <div class="date">${exp.startDate || ''} - ${exp.endDate || 'Present'}</div>
            </div>
            ${exp.description ? `<p>${exp.description}</p>` : ''}
            ${exp.achievements && exp.achievements.length > 0 ? `
            <ul class="bullets">
                ${exp.achievements.map((achievement: string) => `<li>${achievement}</li>`).join('')}
            </ul>
            ` : ''}
        </div>
        `).join('')}
    </div>
    ` : ''}

    ${education.length > 0 ? `
    <div class="section">
        <div class="section-title">Education</div>
        ${education.map((edu: any) => `
        <div class="education-item">
            <div class="item-header">
                <div>
                    <div class="degree">${edu.degree || ''}</div>
                    <div class="school">${edu.school || ''}</div>
                </div>
                <div class="date">${edu.year || ''}</div>
            </div>
            ${edu.gpa ? `<p>GPA: ${edu.gpa}</p>` : ''}
        </div>
        `).join('')}
    </div>
    ` : ''}

    ${skills.length > 0 ? `
    <div class="section">
        <div class="section-title">Skills</div>
        <div class="skills-grid">
            ${skills.map((skill: string) => `<span class="skill-item">${skill}</span>`).join('')}
        </div>
    </div>
    ` : ''}

    ${projects.length > 0 ? `
    <div class="section">
        <div class="section-title">Projects</div>
        ${projects.map((project: any) => `
        <div class="project-item">
            <div class="item-header">
                <div>
                    <div class="job-title">${project.name || ''}</div>
                    ${project.technologies ? `<div class="company">${project.technologies}</div>` : ''}
                </div>
                <div class="date">${project.date || ''}</div>
            </div>
            ${project.description ? `<p>${project.description}</p>` : ''}
            ${project.link ? `<p>Link: ${project.link}</p>` : ''}
        </div>
        `).join('')}
    </div>
    ` : ''}

    ${certifications.length > 0 ? `
    <div class="section">
        <div class="section-title">Certifications</div>
        ${certifications.map((cert: any) => `
        <div class="experience-item">
            <div class="item-header">
                <div>
                    <div class="job-title">${cert.name || ''}</div>
                    <div class="company">${cert.issuer || ''}</div>
                </div>
                <div class="date">${cert.date || ''}</div>
            </div>
        </div>
        `).join('')}
    </div>
    ` : ''}

    <div class="watermark">Generated by ResumeBuilder</div>
</body>
</html>
  `;
}