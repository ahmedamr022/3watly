import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@/lib/supabase/server';
import { requireUser } from '@/lib/auth/requireUser';
import { CopilotRequestSchema } from '@/lib/copilot/schemas';
import { checkRateLimit } from '@/lib/copilot/rate-limit';
import { buildCopilotContext } from '@/lib/copilot/context-builder';
import { buildSystemPrompt } from '@/lib/copilot/prompt';
import { parseCopilotAIResponse } from '@/lib/copilot/response-parser';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json().catch(() => ({}));
    const parseResult = CopilotRequestSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const body = parseResult.data;
    const userMessage = (body.message || body.text || '').trim();
    const attachment = body.attachment;

    if (!userMessage && !attachment) {
      return NextResponse.json(
        { error: 'Message content or attachment is required.' },
        { status: 400 }
      );
    }

    // 1. Rate Limiting Check
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'anon';
    const rateLimit = checkRateLimit(ip, 30, 5 * 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: 'rate_limit_exceeded',
          message: 'تم تجاوز الحد المسموح من الرسائل مؤقتاً. يرجى الانتظار دقيقة والمحاولة مجدداً.',
        },
        { status: 429 }
      );
    }

    // 2. Resolve Authenticated User (gracefully fall back to guest if unauthenticated)
    const { user } = await requireUser();
    const effectiveUserId = user?.id || body.userId || (typeof body.user?.id === 'string' ? body.user.id : 'guest-user');
    const supabase = await createClient();

    const userName: string =
      body.user?.fullName ||
      body.user?.name ||
      user?.email?.split('@')[0] ||
      'المستخدم';

    let effectiveUserMessage = userMessage;
    if (attachment) {
      const attachContent = body.attachmentText || body.attachmentData?.rawText || body.activeCv?.rawText;
      const snippet = attachContent 
        ? `\n\n[محتوى ونصوص الملف المرفق «${attachment}»]:\n"""\n${attachContent.slice(0, 8000)}\n"""`
        : `\n\n[الملف المرفق: «${attachment}»]`;

      effectiveUserMessage = userMessage 
        ? `${userMessage}\n${snippet}`
        : `يرجى مراجعة وتحليل سيرتي الذاتية والملف المرفق بالتفصيل: «${attachment}»\n${snippet}`;
    }

    // 3. Build Rich Context (Deterministic Job Ranking, User CV, Skills)
    const context = await buildCopilotContext(supabase, effectiveUserId, userName, rawBody);
    const systemInstruction = buildSystemPrompt(context);

    // 4. Save User Message to DB
    if (supabase && effectiveUserId && !effectiveUserId.startsWith('guest')) {
      try {
        await supabase.from('copilot_messages').insert({
          user_id: effectiveUserId,
          role: 'user',
          content: effectiveUserMessage,
        });
      } catch (e) {
        console.warn('Could not save user message:', e);
      }
    }

    // 5. Generate AI Response via Gemini
    const apiKey = process.env.GEMINI_API_KEY;
    let rawOutputText = '';

    if (apiKey) {
      const candidateModels = ['gemini-3.6-flash', 'gemini-3.7-flash'];
      const ai = new GoogleGenAI({ apiKey });

      for (const model of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: [{ role: 'user', parts: [{ text: effectiveUserMessage }] }],
            config: {
              systemInstruction,
              temperature: 0.6,
            },
          });
          if (response.text) {
            rawOutputText = response.text;
            break;
          }
        } catch (modelErr: unknown) {
          const errMsg = modelErr instanceof Error ? modelErr.message : String(modelErr);
          console.warn(`Gemini model ${model} call notice:`, errMsg);
        }
      }
    }

    // 6. If no API key or call failed, use intelligent contextual response
    if (!rawOutputText) {
      const topJob = context.topRankedJobs[0];
      const hasJobAdvice = topJob
        ? `\n\n📌 **أقرب فرصة مطابقة لمهاراتك حالياً:**\n- وظيفة **${topJob.title}** في **${topJob.company}** بنسبة تطابق **${topJob.matchScore}%**.\n- المهارات المتوافقة: ${topJob.matchingSkills.join(', ') || 'أساسيات المجال'}.\n- المهارات المقترحة للتطوير: ${topJob.missingSkills.join(', ') || 'أدوات السحاب والنشر'}.`
        : '';

      if (context.attachedDocumentText) {
        rawOutputText =
          `أهلاً بك يا ${userName}! قمت بمراجعة وقراءة الملف المرفق **«${context.attachmentName || 'السيرة الذاتية'}»** بنجاح 📄.\n\n` +
          (context.userSkills.length > 0 
            ? `✅ **المهارات والتقنيات المرصودة في ملفك:** ${context.userSkills.slice(0, 8).join('، ')}.\n\n` 
            : '') +
          `📊 **أهم توصيات الـ ATS لسوق العمل:**\n` +
          `1. **هيكل السيرة الذاتية (ATS Structure):** تأكد من استخدام نسق العمود الواحد (Single-Column) وتبويب واضح للأقسام (Summary, Experience, Projects, Skills, Education).\n` +
          `2. **قياس الأثر الكمي (Quantified Impact):** احرص على أن تبدأ كل نقطة بفعل قيادي قوي يتبعه رقم محدد، مثل: "Built an automated ETL pipeline processing 50K+ daily records".\n` +
          `3. **الربط مع سوق العمل:** ملفك يظهر مهارات واعدة تؤهلك لمسار **${context.targetRole}**، مع فرص جيدة في الشركات التقنية.` +
          hasJobAdvice;
      } else {
        rawOutputText =
          `أهلاً بك يا ${userName}! يسعدني مساعدتك في تطوير مسارك المهني كـ **${context.targetRole}** في السوق المصري.\n\n` +
          `💡 **أبرز التوصيات العملية:**\n` +
          `1. **تطوير المهارات المطلوبة:** ركز على المهارات العملية والمشاريع الواقعية المرفوعة على GitHub.\n` +
          `2. **تحسين السيرة الذاتية (ATS):** تأكد من صياغة الإنجازات بنسب مئوية وأرقام محددة (Quantifiable Impact).\n` +
          `3. **التقديم المباشر:** تابع باستمرار الشواغر الجديدة في الشركات التقنية الرائدة في القاهرة والإسكندرية.` +
          hasJobAdvice;
      }
    }

    // 7. Parse & Validate into Structured CopilotResponse
    const structuredResponse = parseCopilotAIResponse(rawOutputText, context.targetRole);

    // 8. Save Assistant Response to DB
    if (supabase && effectiveUserId && !effectiveUserId.startsWith('guest')) {
      try {
        await supabase.from('copilot_messages').insert({
          user_id: effectiveUserId,
          role: 'assistant',
          content: structuredResponse.message,
        });
      } catch (dbErr) {
        console.warn('Failed to save assistant response in DB:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      data: structuredResponse,
    });
  } catch (err: unknown) {
    console.error('Error in /api/copilot/chat:', err);
    return NextResponse.json({ error: 'Failed to process Career Copilot request.' }, { status: 500 });
  }
}
