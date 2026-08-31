import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const userMessage: string = (body.message || body.text || '').trim();
    const attachment: string | undefined = body.attachment;

    if (!userMessage && !attachment) {
      return NextResponse.json(
        { error: 'Message content or attachment is required.' },
        { status: 400 }
      );
    }

    const effectiveUserMessage = userMessage || `Review my CV: ${attachment}`;

    // -----------------------------------------------------------------------
    // Step 1 — Resolve User (Supports Supabase Auth, Local Social, & Guest)
    // -----------------------------------------------------------------------
    const supabase = await createClient();
    let authUser: { id: string; email?: string } | null = null;

    if (supabase) {
      try {
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          authUser = data.user;
        }
      } catch (e) {
        console.warn('Supabase auth session check notice:', e);
      }
    }

    const effectiveUserId: string =
      authUser?.id ||
      body.userId ||
      (body.user?.id ? String(body.user.id) : null) ||
      (body.user?.email ? `user_${body.user.email.replace(/[^a-zA-Z0-9]/g, '_')}` : 'guest_user');

    const userName: string =
      body.user?.fullName ||
      body.user?.name ||
      authUser?.email?.split('@')[0] ||
      'المستخدم';

    // -----------------------------------------------------------------------
    // Step 2 — Retrieve the user's latest CV
    // -----------------------------------------------------------------------
    let cvContext = '';
    if (supabase && effectiveUserId && !effectiveUserId.startsWith('guest')) {
      try {
        const { data: cvDoc } = await supabase
          .from('cv_documents')
          .select('*')
          .eq('user_id', effectiveUserId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (cvDoc) {
          cvContext = `
[User CV Information]
- Target Role: ${cvDoc.target_role || 'Not specified'}
- Extracted Skills: ${Array.isArray(cvDoc.parsed_skills) ? cvDoc.parsed_skills.join(', ') : 'None extracted'}
- Summary: ${cvDoc.summary || 'None'}
- ATS Compliance Score: ${cvDoc.ats_score ? `${cvDoc.ats_score}/100` : 'N/A'}
- Experience Summary: ${cvDoc.experiences ? JSON.stringify(cvDoc.experiences).slice(0, 800) : 'None'}
- Education: ${cvDoc.education ? JSON.stringify(cvDoc.education).slice(0, 400) : 'None'}
- Raw CV Snippet: ${cvDoc.raw_text ? cvDoc.raw_text.slice(0, 1000) : 'None'}
`;
        }
      } catch (e) {
        console.warn('Could not fetch cv_documents for copilot:', e);
      }
    }

    // -----------------------------------------------------------------------
    // Step 3 — Retrieve user profile
    // -----------------------------------------------------------------------
    let profileContext = '';
    let targetRole = body.user?.targetRole || 'Data Analyst';
    let userSkills: string[] = [];

    if (supabase && effectiveUserId && !effectiveUserId.startsWith('guest')) {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', effectiveUserId)
          .maybeSingle();

        if (profile) {
          targetRole = profile.target_role || targetRole;
          userSkills = Array.isArray(profile.skills) ? profile.skills : [];
          profileContext = `
[User Profile Information]
- Full Name: ${profile.full_name || userName}
- Target Role: ${targetRole}
- Target Industry: ${profile.target_industry || 'Technology'}
- Experience Years: ${profile.experience_years ?? 1}
- Preferred Locations: ${Array.isArray(profile.preferred_locations) ? profile.preferred_locations.join(', ') : 'Cairo, Egypt'}
- Skills in Profile: ${userSkills.length > 0 ? userSkills.join(', ') : 'None specified'}
`;
        }
      } catch (e) {
        console.warn('Could not fetch profile for copilot:', e);
      }
    }

    // -----------------------------------------------------------------------
    // Step 4 — Retrieve relevant jobs from Supabase
    // -----------------------------------------------------------------------
    let jobsContext = '';
    if (supabase) {
      try {
        const { data: liveJobs } = await supabase
          .from('jobs')
          .select('id, title, company, location, work_type, is_remote, required_skills, salary_range, apply_url')
          .order('posted_at', { ascending: false })
          .limit(10);

        if (liveJobs && liveJobs.length > 0) {
          jobsContext = `
[Current Live Egyptian Market Jobs from Database]
${liveJobs
  .map(
    (j, i) =>
      `${i + 1}. Title: "${j.title}" | Company: "${j.company}" | Location: "${j.location}" | Work Type: "${j.work_type}" | Remote: ${j.is_remote ? 'Yes' : 'No'} | Skills: [${Array.isArray(j.required_skills) ? j.required_skills.join(', ') : ''}] | URL: ${j.apply_url}`
  )
  .join('\n')}
`;
        } else {
          jobsContext = `[Current Live Egyptian Market Jobs]: Curated roles available in Egypt across Vodafone, Fawry, CIB, Instabug, Swvl, Paymob, Breadfast.`;
        }
      } catch (e) {
        console.warn('Could not fetch jobs for copilot:', e);
      }
    }

    // -----------------------------------------------------------------------
    // Step 5 — Save user message to database
    // -----------------------------------------------------------------------
    if (supabase && effectiveUserId && !effectiveUserId.startsWith('guest')) {
      try {
        await supabase.from('copilot_messages').insert({
          user_id: effectiveUserId,
          role: 'user',
          content: effectiveUserMessage,
        });
      } catch (e) {
        console.warn('Could not save user message in copilot_messages:', e);
      }
    }

    // -----------------------------------------------------------------------
    // Step 6 — Construct System Prompt
    // -----------------------------------------------------------------------
    const systemInstruction = `You are 3watly Career Copilot (المساعد المهني الذكي لمنصة عواطلي), an expert AI career advisor specialized in the Egyptian tech and corporate job market.

You help Egyptian job seekers improve their careers using their actual CV, skills, experience, target role, and current Egyptian job-market data.

User Profile:
${profileContext || `Name: ${userName}, Target Role: ${targetRole}`}

User CV Context:
${cvContext || 'No CV uploaded yet'}

Current Live Egyptian Market Jobs:
${jobsContext}

Your core guidelines:
- Analyze the user's career and skills objectively, practically, and encouragingly.
- Tailor all advice to Egypt (Cairo, Giza, Alexandria, Smart Village, New Cairo, and remote Egyptian/Gulf tech work).
- Recommend suitable jobs strictly from the provided Egyptian jobs data when relevant.
- Compare the user's skills against real market requirements.
- Help refine CV bullet points with strong action verbs and quantified impact (e.g., "Increased sales by 20%").
- Prepare candidates for technical and behavioral interviews in Egypt.
- If the user writes in Arabic, answer in clear, professional, encouraging Egyptian Arabic (لهجة مصرية مهنية واضحة وسلسة).
- If the user writes in English, answer in fluent, structured English.
- Use clean Markdown formatting with headers, bullet points, and bold text.
`;

    // -----------------------------------------------------------------------
    // Step 7 — Stream Response
    // -----------------------------------------------------------------------
    const apiKey = process.env.GEMINI_API_KEY;

    // Stream generator helper
    const makeStreamResponse = (generator: () => AsyncGenerator<string, void, unknown>) => {
      const encoder = new TextEncoder();
      let fullAssistantText = '';

      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of generator()) {
              if (chunk) {
                fullAssistantText += chunk;
                controller.enqueue(encoder.encode(chunk));
              }
            }
          } catch (streamErr) {
            console.error('Error during streaming:', streamErr);
          } finally {
            controller.close();
            if (fullAssistantText.trim() && supabase && effectiveUserId && !effectiveUserId.startsWith('guest')) {
              try {
                await supabase.from('copilot_messages').insert({
                  user_id: effectiveUserId,
                  role: 'assistant',
                  content: fullAssistantText,
                });
              } catch (dbErr) {
                console.warn('Failed to save assistant response in copilot_messages:', dbErr);
              }
            }
          }
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    };

    // If no API key, use rich career advice stream
    if (!apiKey) {
      async function* fallbackGenerator() {
        const text =
          `أهلاً بك يا ${userName}! أنا **3watly Career Copilot** المساعد المهني الذكي لمنصة عواطلي.\n\n` +
          `💡 **نصائح أساسية لتطوير مسارك المهني في السوق المصري (${targetRole}):**\n` +
          `1. **المهارات الأكثر طلباً حالياً:** تأكد من إبراز مهاراتك الأساسية في مشاريع حقيقية على GitHub أو Portfolio.\n` +
          `2. **السيرة الذاتية و ATS:** ركز على صياغة الإنجازات بالأرقام والنسب المئوية، واستخدم كلمات مفتاحية مطابقة لمتطلبات وظائف الشركات الكبرى (مثل فودافون، فوري، CIB).\n` +
          `3. **التواصل المهني:** احرص على تحديث ملفك في LinkedIn والتفاعل مع مسؤولي التوظيف في مصر والخليج.\n\n` +
          `كيف يمكنني مساعدتك اليوم؟ يمكنك سؤالي عن تحسين سيرتك الذاتية، الاستعداد لمقابلة عمل، أو ترشيح وظائف مناسبة لك.`;

        const words = text.split(' ');
        for (const word of words) {
          yield word + ' ';
          await new Promise((r) => setTimeout(r, 20));
        }
      }

      return makeStreamResponse(fallbackGenerator);
    }

    // Call Gemini with Google GenAI SDK
    const ai = new GoogleGenAI({ apiKey });

    async function* geminiGenerator() {
      try {
        const responseStream = await ai.models.generateContentStream({
          model: 'gemini-3.6-flash',
          contents: [{ role: 'user', parts: [{ text: effectiveUserMessage }] }],
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        for await (const chunk of responseStream) {
          if (chunk.text) {
            yield chunk.text;
          }
        }
      } catch (geminiErr: any) {
        console.warn('Gemini 3.6 Flash stream error, using fallback advice:', geminiErr);
        const fallbackMsg =
          `أهلاً بك يا ${userName}! يسعدني مساعدتك في تطوير مسارك المهني كـ **${targetRole}** في السوق المصري.\n\n` +
          `💡 **أبرز التوصيات المهنية:**\n` +
          `- ركز على إتقان المهارات التقنية الأكثر طلباً حالياً في مصر.\n` +
          `- احرص على أن تكون سيرتك الذاتية متوافقة مع أنظمة فحص الـ ATS وتركز على إنجازاتك بالأرقام.\n` +
          `- تصفح قسم الوظائف في منصة عواطلي للتقديم على أحدث الفرص في فودافون، فوري، والبنك التجاري الدولي.\n\n` +
          `يرجى إعادة إرسال سؤالك وسأجيبك بالتفصيل!`;

        const words = fallbackMsg.split(' ');
        for (const word of words) {
          yield word + ' ';
          await new Promise((r) => setTimeout(r, 20));
        }
      }
    }

    return makeStreamResponse(geminiGenerator);
  } catch (err: unknown) {
    console.error('Error in /api/copilot/chat:', err);
    const message = err instanceof Error ? err.message : 'Failed to process Career Copilot request.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
