/**
 * 3WATLY Strict Job Localization & Content Sanitizer
 * Preserves the employer's real job content while ensuring clean, readable presentation.
 */

export function containsArabic(text?: string | null): boolean {
  if (!text) return false;
  return /[\u0600-\u06FF]/.test(text);
}

export function cleanText(text?: string | null): string {
  if (!text) return '';
  return text
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Ensures the English Job Overview contains real job overview text.
 */
export function cleanEnglishOverview(
  title?: string,
  company?: string,
  location?: string,
  rawDesc?: string | null
): string {
  const cleanComp = (company || 'a leading company').replace(/\s*-\s*(?:Egypt|Cairo|Giza)$/i, '').trim();
  const cleanLoc = location || 'Cairo, Egypt';
  const cleanTitle = title || 'Professional';

  if (rawDesc && rawDesc.trim().length > 15) {
    const trimmed = cleanText(rawDesc);
    if (trimmed.length > 20) return trimmed;
  }

  return `A great opportunity for a ${cleanTitle} position at ${cleanComp} in ${cleanLoc}. The role provides a professional environment focused on modern technologies, impactful projects, and continuous career growth.`;
}

/**
 * Ensures the Arabic Job Overview contains real job overview text.
 */
export function cleanArabicOverview(
  titleAr?: string,
  companyAr?: string,
  locationAr?: string,
  rawDescAr?: string | null
): string {
  const cleanComp = (companyAr || 'شركة رائدة').replace(/\s*-\s*(?:مصر|القاهرة|الجيزة)$/i, '').trim();
  const cleanLoc = locationAr || 'القاهرة، مصر';
  const cleanTitle = titleAr || 'متخصص';

  // Always prefer the employer's real description
  if (rawDescAr && rawDescAr.trim().length > 15) {
    const trimmed = cleanText(rawDescAr);
    if (trimmed.length > 20) return trimmed;
  }

  return `فرصة عمل متميزة لمنصب ${cleanTitle} في شركة ${cleanComp} في ${cleanLoc}. توفر الوظيفة بيئة عمل متطورة تركز على أحدث التقنيات، والمشاريع المؤثرة، والنمو المهني المستمر.`;
}

export function extractListItemsFromText(input?: string | string[] | null): string[] {
  if (!input) return [];
  const text = Array.isArray(input) ? input.join('\n') : input;
  if (!text.trim()) return [];

  // 1. If contains <li>
  if (/<li[^>]*>/i.test(text)) {
    const matches = [...text.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)];
    const items = matches
      .map(m => cleanText(m[1]))
      .filter(s => s.length > 5 && !/^(?:key responsibilities|requirements|about|role overview|what we're looking for)$/i.test(s));
    if (items.length > 0) return items;
  }

  // 2. If contains <p>
  if (/<p[^>]*>/i.test(text)) {
    const matches = [...text.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)];
    const items = matches
      .map(m => cleanText(m[1]))
      .filter(s => s.length > 10 && !/^(?:key responsibilities|responsibilities|requirements|qualifications|about|role overview|essential|preferred|what we're looking for|job requirements)$/i.test(s));
    if (items.length > 0) return items;
  }

  // 3. Fallback: split on newlines, bullets, or periods followed by uppercase
  return text
    .replace(/<[^>]+>/g, '\n')
    .split(/\n|•|\.(?=\s[A-Z]|$)/)
    .map(s => cleanText(s))
    .filter(s => s.length > 5 && !/^(?:key responsibilities|responsibilities|requirements|qualifications)$/i.test(s));
}

export function partitionResponsibilitiesAndRequirements(rawReq?: string | null, rawDesc?: string | null): {
  responsibilities: string[];
  requirements: string[];
} {
  const combined = `${rawDesc || ''}\n${rawReq || ''}`;
  if (!combined.trim()) return { responsibilities: [], requirements: [] };

  // Look for section divider like "Requirements" or "Qualifications"
  const reqIdx = combined.search(/<strong>\s*(?:Requirements|Qualifications|Job Requirements|المتطلبات|شروط الوظيفة)\s*<\/strong>|(?:\bRequirements\b|\bQualifications\b)/i);

  let respPart = combined;
  let reqPart = rawReq || '';

  if (reqIdx !== -1) {
    respPart = combined.slice(0, reqIdx);
    reqPart = combined.slice(reqIdx);
  }

  const respItems = extractListItemsFromText(respPart);
  const reqItems = extractListItemsFromText(reqPart);

  return {
    responsibilities: respItems.length > 0 ? respItems : extractListItemsFromText(combined).slice(0, 6),
    requirements: reqItems.length > 0 ? reqItems : extractListItemsFromText(combined).slice(6),
  };
}

/**
 * Ensures English Key Responsibilities contain real bullet points.
 */
export function cleanEnglishResponsibilities(
  title?: string,
  rawLines?: string | string[] | null,
  skills?: string[]
): string[] {
  const cleanTitle = title || 'the role';
  const extracted = extractListItemsFromText(rawLines);
  const cleaned = extracted.filter(line => line.length > 5);

  if (cleaned.length >= 2) {
    return cleaned.slice(0, 12);
  }

  const primarySkill = skills && skills.length > 0 ? skills[0] : null;

  return [
    `Execute core ${cleanTitle} duties and deliver high-impact business outcomes.`,
    primarySkill
      ? `Utilize ${primarySkill} and modern analytical/technical workflows.`
      : `Apply modern analytical and technical methodologies to solve business challenges.`,
    `Collaborate closely with cross-functional teams and stakeholders.`,
    `Prepare structured documentation, actionable reports, and presentations.`,
    `Continuously improve operational workflows, quality standards, and productivity.`
  ];
}

/**
 * Ensures Arabic Key Responsibilities contain real bullet points.
 */
export function cleanArabicResponsibilities(
  titleAr?: string,
  rawLinesAr?: string | string[] | null,
  skills?: string[]
): string[] {
  const cleanTitle = titleAr || 'الوظيفة';
  const extracted = extractListItemsFromText(rawLinesAr);
  const cleaned = extracted.filter(line => line.length > 5);

  // Always prefer the employer's real responsibilities
  if (cleaned.length >= 2) {
    return cleaned.slice(0, 12);
  }

  const primarySkill = skills && skills.length > 0 ? skills[0] : null;

  return [
    `تنفيذ المهام والمسؤوليات الأساسية لمنصب ${cleanTitle} وتحقيق المستهدفات المطلوبة.`,
    primarySkill
      ? `توظيف أدوات وتقنيات ${primarySkill} وأفضل الممارسات المهنية المعتمدة.`
      : `تطبيق المنهجيات والتقنيات الحديثة لحل المشكلات ورفع كفاءة العمل.`,
    `التعاون الفعّال مع مختلف الفرق وأصحاب المصلحة بالشركة.`,
    `إعداد التقارير الدورية وتقديم نتائج العمل بدقة ووضوح للإدارة.`,
    `المساهمة في تحسين بيئة العمل ومتابعة أحدث المعايير المهنية.`
  ];
}

/**
 * Ensures English Requirements contain real bullet points.
 */
export function cleanEnglishRequirements(
  title?: string,
  rawLines?: string | string[] | null,
  skills?: string[]
): string[] {
  const extracted = extractListItemsFromText(rawLines);
  const cleaned = extracted.filter(line => line.length > 5);

  if (cleaned.length >= 2) {
    return cleaned.slice(0, 12);
  }

  const reqSkillsList = (skills || []).slice(0, 4);

  return [
    reqSkillsList.length > 0
      ? `Solid practical knowledge of relevant tools and technologies: ${reqSkillsList.join(', ')}.`
      : `Strong knowledge of relevant tools, systems, and technical methodologies.`,
    `Previous hands-on experience in the same or a closely related field.`,
    `Strong analytical, critical-thinking, and problem-solving abilities.`,
    `Excellent verbal and written communication and teamwork skills.`,
    `Bachelor's degree in a relevant discipline or equivalent practical background.`
  ];
}

/**
 * Ensures Arabic Requirements contain real bullet points.
 */
export function cleanArabicRequirements(
  titleAr?: string,
  rawLinesAr?: string | string[] | null,
  skills?: string[]
): string[] {
  const extracted = extractListItemsFromText(rawLinesAr);
  const cleaned = extracted.filter(line => line.length > 5);

  // Always prefer the employer's real requirements
  if (cleaned.length >= 2) {
    return cleaned.slice(0, 12);
  }

  const reqSkillsList = (skills || []).slice(0, 4);

  return [
    reqSkillsList.length > 0
      ? `إتقان ومعرفة عملية قوية بالمهارات والأدوات الأساسية: ${reqSkillsList.join('، ')}.`
      : `معرفة متقدمة بالأدوات والتقنيات والممارسات المرتبطة بمجال العمل.`,
    `خبرة عملية سابقة في نفس التخصص أو في مجال ذي صلة.`,
    `مهارات تحليلية وتفكير نقدي وقدرة عالية على حل المشكلات.`,
    `مهارات تواصل شفهي وكتابي ممتازة والقدرة على العمل ضمن فريق.`,
    `مؤهل جامعي مناسب في التخصص أو ما يعادله من خبرة عملية.`
  ];
}

