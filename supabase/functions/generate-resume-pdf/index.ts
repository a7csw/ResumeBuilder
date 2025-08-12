import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization')!;
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify user authentication
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabaseClient.auth.getUser(token);
    if (!user) throw new Error('Unauthorized');

    // Check if user has paid plan
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('has_paid_plan')
      .eq('user_id', user.id)
      .single();

    if (!profile?.has_paid_plan) {
      return new Response(JSON.stringify({ 
        error: 'Payment required',
        message: 'Please upgrade to a paid plan to export resumes as PDF.' 
      }), {
        status: 402,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { resumeData, templateId } = await req.json();

    // Generate HTML content for PDF
    const htmlContent = generateResumeHTML(resumeData, templateId);

    // Here you would integrate with a PDF generation service
    // For now, we'll return the HTML content that can be used with jsPDF on the frontend
    return new Response(JSON.stringify({ 
      htmlContent,
      message: 'Resume HTML generated successfully. PDF generation will be handled on the frontend.'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-resume-pdf function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateResumeHTML(resumeData: any, templateId: string): string {
  const { personalInfo, summary, experience, education, skills, projects, certifications } = resumeData;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; color: #333; }
        .header { text-align: center; margin-bottom: 30px; }
        .name { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
        .contact { font-size: 14px; color: #666; }
        .section { margin-bottom: 25px; }
        .section-title { font-size: 18px; font-weight: bold; border-bottom: 2px solid #333; padding-bottom: 5px; margin-bottom: 15px; }
        .job { margin-bottom: 15px; }
        .job-title { font-weight: bold; }
        .company { font-style: italic; }
        .date { float: right; color: #666; }
        .skills-list { display: flex; flex-wrap: wrap; gap: 10px; }
        .skill { background: #f0f0f0; padding: 5px 10px; border-radius: 15px; font-size: 14px; }
        ul { padding-left: 20px; }
        li { margin-bottom: 5px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="name">${personalInfo?.firstName || ''} ${personalInfo?.lastName || ''}</div>
        <div class="contact">
          ${personalInfo?.email || ''} | ${personalInfo?.phone || ''} | ${personalInfo?.location || ''}
          ${personalInfo?.linkedin ? ` | LinkedIn: ${personalInfo.linkedin}` : ''}
          ${personalInfo?.website ? ` | ${personalInfo.website}` : ''}
        </div>
      </div>

      ${summary ? `
        <div class="section">
          <div class="section-title">Professional Summary</div>
          <p>${summary}</p>
        </div>
      ` : ''}

      ${experience?.length ? `
        <div class="section">
          <div class="section-title">Experience</div>
          ${experience.map((exp: any) => `
            <div class="job">
              <div class="job-title">${exp.title}</div>
              <div class="company">${exp.company} <span class="date">${exp.startDate} - ${exp.endDate || 'Present'}</span></div>
              <div style="clear: both;"></div>
              <p>${exp.description}</p>
              ${exp.achievements?.length ? `
                <ul>
                  ${exp.achievements.map((achievement: string) => `<li>${achievement}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${education?.length ? `
        <div class="section">
          <div class="section-title">Education</div>
          ${education.map((edu: any) => `
            <div class="job">
              <div class="job-title">${edu.degree}</div>
              <div class="company">${edu.school} <span class="date">${edu.graduationDate}</span></div>
              <div style="clear: both;"></div>
              ${edu.gpa ? `<p>GPA: ${edu.gpa}</p>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${skills?.length ? `
        <div class="section">
          <div class="section-title">Skills</div>
          <div class="skills-list">
            ${skills.map((skill: string) => `<span class="skill">${skill}</span>`).join('')}
          </div>
        </div>
      ` : ''}

      ${projects?.length ? `
        <div class="section">
          <div class="section-title">Projects</div>
          ${projects.map((project: any) => `
            <div class="job">
              <div class="job-title">${project.name}</div>
              <div class="company">${project.technologies} <span class="date">${project.date}</span></div>
              <div style="clear: both;"></div>
              <p>${project.description}</p>
              ${project.link ? `<p>Link: ${project.link}</p>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${certifications?.length ? `
        <div class="section">
          <div class="section-title">Certifications</div>
          ${certifications.map((cert: any) => `
            <div class="job">
              <div class="job-title">${cert.name}</div>
              <div class="company">${cert.issuer} <span class="date">${cert.date}</span></div>
              <div style="clear: both;"></div>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </body>
    </html>
  `;
}