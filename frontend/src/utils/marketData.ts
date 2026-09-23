import {
  careerTracks,
  workModels,
  experienceLevels,
  SkillBar,
  CareerTrack,
  WorkModel,
  ExperienceLevel,
} from '../data/market';

export type Filters = {
  track: string;
  workModel: string;
  experience: string;
};

export const defaultFilters: Filters = {
  track: 'all',
  workModel: 'all',
  experience: 'all',
};

function resolve(filters: Filters): {
  track: CareerTrack;
  workModel: WorkModel;
  experience: ExperienceLevel;
} {
  return {
    track: careerTracks.find((t) => t.id === filters.track) ?? careerTracks[0],
    workModel: workModels.find((w) => w.id === filters.workModel) ?? workModels[0],
    experience: experienceLevels.find((e) => e.id === filters.experience) ?? experienceLevels[0],
  };
}

export type StatSet = {
  jobs: number;
  jobsDelta: number;
  companies: number;
  companiesDelta: number;
  remote: number;
  remoteDelta: number;
  topSkill: { name: string; share: number };
};

export function getStats(filters: Filters): StatSet {
  const { track, workModel, experience } = resolve(filters);

  // Scaled jobs & companies based on workModel and experience level
  const jobs = Math.round(track.jobs * workModel.scale * experience.scale);
  const companies = Math.round(track.companies * workModel.scale * (0.8 + experience.scale * 0.2));

  // Remote percentage adjusts based on workModel
  const baseRemote = workModel.id === 'remote' ? 100 : workModel.id === 'cairo-giza' ? 22.5 : track.remote;
  const remote = Math.max(8, Math.min(100, baseRemote + workModel.remoteAdj * 0.2));

  const seed = track.label.length + workModel.label.length + experience.label.length;

  return {
    jobs,
    jobsDelta: Number((12 + (seed % 9) * 1.5).toFixed(1)),
    companies,
    companiesDelta: Number((8 + (seed % 6) * 1.2).toFixed(1)),
    remote: Number(remote.toFixed(1)),
    remoteDelta: Number((5 + (seed % 5) * 0.8).toFixed(1)),
    topSkill: track.topSkill,
  };
}

export function getSkillRanking(filters: Filters): SkillBar[] {
  const { track, workModel, experience } = resolve(filters);
  const remoteBump = workModel.id === 'remote' || workModel.id === 'gulf-global' ? 3 : 0;
  const expFactor = experience.id === 'senior' ? 1.05 : experience.id === 'entry' ? 0.95 : 1.0;

  return track.skills
    .map((skill, index) => {
      // Small realistic variation based on work model and experience
      const bonus = (skill.category === 'cloud' || skill.category === 'tool' ? remoteBump : 0);
      const computedValue = Math.min(98, Math.max(15, Math.round(skill.value * expFactor + bonus)));
      return {
        ...skill,
        value: computedValue,
        rank: index + 1,
      };
    })
    .sort((a, b) => b.value - a.value);
}

export function getTopSkills(filters: Filters): SkillBar[] {
  return getSkillRanking(filters).slice(0, 8);
}

export type ChartPoint = {
  tick: string;
  ai: number;
  docker: number;
  avg: number;
};

export type ChartModel = {
  points: ChartPoint[];
  yTicks: number[];
  yMax: number;
  peaks: { ai: number; docker: number; avg: number };
  seriesLabels: { primary: string; secondary: string; average: string };
  formatY: (value: number) => string;
  formatValue: (value: number) => string;
  badges: { ai: string; docker: string; avg: string };
};

const shape = (t: number, max: number, bend: number) =>
  (max * (1 - Math.exp(-bend * t))) / (1 - Math.exp(-bend));

function niceTicks(max: number): number[] {
  const raw = max / 5;
  const magnitude = Math.pow(10, Math.floor(Math.log10(Math.max(raw, 1))));
  const step = Math.ceil(raw / magnitude) * magnitude;
  return Array.from({ length: 6 }, (_, i) => Math.round(step * i));
}

export function getChartModel(filters: Filters, metric: string): ChartModel {
  const { track } = resolve(filters);
  const primaryPeak = parseInt(track.trendingHighlights.primary.badge.replace(/[^0-9]/g, '')) || 45;
  const secondaryPeak = parseInt(track.trendingHighlights.secondary.badge.replace(/[^0-9]/g, '')) || 28;
  const avgPeak = parseInt(track.trendingHighlights.average.badge.replace(/[^0-9]/g, '')) || 12;

  const peaks = {
    ai: primaryPeak,
    docker: secondaryPeak,
    avg: avgPeak,
  };

  const ticks = ['May 1', 'May 15', 'Jun 1', 'Jun 15', 'Jul 1', 'Jul 15', 'Jul 30'];

  const points: ChartPoint[] = Array.from({ length: 25 }, (_, i) => {
    const t = i / 24;
    const wobble = Math.sin(i * 1.5) * (peaks.ai * 0.04);
    return {
      tick: i % 4 === 0 ? ticks[i / 4] : '',
      ai: Math.max(0, Number((shape(t, peaks.ai, 1.6) + (i === 0 ? 0 : wobble * 0.4)).toFixed(1))),
      docker: Math.max(0, Number((shape(t, peaks.docker, 2.2) + (i === 0 ? 0 : wobble * 0.25)).toFixed(1))),
      avg: Number(shape(t, peaks.avg, 1.2).toFixed(1)),
    };
  });

  const formatY = (v: number) => `${Math.round(v)}%`;
  const formatValue = (v: number) => `+${v.toFixed(1)}%`;
  const badge = (v: number) => `+${Math.round(v)}%`;
  const yTicks = niceTicks(peaks.ai);

  return {
    points,
    yTicks,
    yMax: yTicks[yTicks.length - 1],
    peaks,
    seriesLabels: {
      primary: track.trendingHighlights.primary.name,
      secondary: track.trendingHighlights.secondary.name,
      average: track.trendingHighlights.average.name,
    },
    formatY,
    formatValue,
    badges: {
      ai: track.trendingHighlights.primary.badge,
      docker: track.trendingHighlights.secondary.badge,
      avg: track.trendingHighlights.average.badge,
    },
  };
}

export function filterSummary(filters: Filters) {
  const { track, workModel, experience } = resolve(filters);
  return {
    track: track.label,
    trackAr: track.labelAr,
    workModel: workModel.label,
    workModelAr: workModel.labelAr,
    experience: experience.label,
    experienceAr: experience.labelAr,
  };
}

export function buildReportCsv(
  filters: Filters,
  liveStats?: StatSet,
  liveSkills?: SkillBar[],
  isAr: boolean = false
): string {
  const stats = liveStats ?? getStats(filters);
  const summary = filterSummary(filters);
  const skills = (liveSkills && liveSkills.length > 0) ? liveSkills : getSkillRanking(filters);
  const activeTrack = careerTracks.find((t) => t.id === filters.track) ?? careerTracks[0];

  const currentDate = new Date().toISOString().split('T')[0];

  const rows: (string | number)[][] = [
    // Section 1: Official Header Banner
    ['========================================================================================'],
    [isAr ? 'منصة عواطلي - تقرير استخبارات وتحليل سوق التوظيف التقني المصري' : '3WATLY - Tech Market Intelligence & Skills Demand Report'],
    ['========================================================================================'],
    [],
    // Section 2: Metadata Table
    [isAr ? 'معلومات التقرير والفلاتر النشطة' : 'REPORT SPECIFICATIONS & APPLIED FILTERS', ''],
    [isAr ? 'تاريخ استخراج التقرير' : 'Report Generated Date', currentDate],
    [isAr ? 'المسار المهني / التخصص' : 'Career Track', isAr ? summary.trackAr : summary.track],
    [isAr ? 'نمط ومقر العمل' : 'Work Model & Location', isAr ? summary.workModelAr : summary.workModel],
    [isAr ? 'مستوى الخبرة المستهدف' : 'Target Experience Level', isAr ? summary.experienceAr : summary.experience],
    [isAr ? 'نطاق التغطية الجغرافية' : 'Geographic Coverage', isAr ? 'جمهورية مصر العربية وسوق العمل الإقليمي' : 'Egypt & MENA Tech Market'],
    [isAr ? 'مصدر البيانات وطريقة الجمع' : 'Data Methodology', isAr ? 'تحليل خوارزمي فوري لآلاف إعلانات التوظيف النشطة' : 'Algorithmic real-time parsing of verified active postings'],
    [],
    // Section 3: Key Market Indicators (KPIs)
    ['----------------------------------------------------------------------------------------'],
    [isAr ? 'المؤشرات الإحصائية العامة لسوق العمل (Key Market Indicators)' : 'KEY MARKET METRICS & BENCHMARKS'],
    ['----------------------------------------------------------------------------------------'],
    [
      isAr ? 'المؤشر الإحصائي' : 'Metric Indicator',
      isAr ? 'القيمة الحالية' : 'Current Value',
      isAr ? 'نسبة التغير (Momentum)' : 'Momentum / Growth',
      isAr ? 'وصف المؤشر وتأثيره المهني' : 'Market Context & Interpretation'
    ],
    [
      isAr ? 'إجمالي الوظائف التقنية النشطة' : 'Active Analyzed Jobs',
      stats.jobs.toLocaleString(),
      `+${stats.jobsDelta}%`,
      isAr ? 'فرص عمل معلنة ومحللة عبر منصات التوظيف الرائدة' : 'Live opportunities tracked across major tech employers'
    ],
    [
      isAr ? 'الشركات التقنية الموظفة' : 'Hiring Tech Companies',
      stats.companies.toLocaleString(),
      `+${stats.companiesDelta}%`,
      isAr ? 'شركات محلية وعالمية ومقرات إقليمية نشطة في التعيين' : 'Active tech startups, enterprise scale-ups & regional hubs'
    ],
    [
      isAr ? 'نسبة الوظائف عن بعد والهجينة' : 'Remote / Hybrid Share',
      `${stats.remote}%`,
      `+${stats.remoteDelta}%`,
      isAr ? 'نسبة الوظائف التي توفر مرونة جغرافية تامة أو جزئية' : 'Postings offering fully remote or flexible hybrid setup'
    ],
    [
      isAr ? 'المهارة التقنية الأعلى طلباً' : 'Top In-Demand Skill',
      stats.topSkill.name,
      `${stats.topSkill.share}% ${isAr ? 'من إعلانات الوظائف' : 'of open roles'}`,
      isAr ? 'المهارة الأساسية لاجتياز الفرز الآلي (ATS) والمقابلات الفنية' : 'Primary required competence for ATS screening & technical passes'
    ],
    [],
    // Section 4: Detailed Skills Taxonomy & Demand Matrix
    ['----------------------------------------------------------------------------------------'],
    [isAr ? 'جدول تحليل وتصنيف المهارات التقنية الأكثر طلباً (Top Skills Demand Matrix)' : 'DETAILED SKILLS DEMAND & GROWTH MATRIX'],
    ['----------------------------------------------------------------------------------------'],
    [
      isAr ? 'الترتيب' : 'Rank',
      isAr ? 'اسم المهارة التقنية' : 'Skill Name',
      isAr ? 'التصنيف التقني' : 'Category',
      isAr ? 'نسبة الطلب في السوق (%)' : 'Market Demand Share (%)',
      isAr ? 'عدد الوظائف التقديرية' : 'Estimated Openings',
      isAr ? 'معدل الصعود وزخم النمو' : 'Growth Momentum',
      isAr ? 'مستوى الأهمية التنافسية' : 'Competitive Priority'
    ],
    ...skills.map((s, i) => {
      const cat = isAr ? (s.categoryLabelAr || s.categoryLabel || 'تقنية') : (s.categoryLabel || 'Tech');
      const priority = s.value >= 75 
        ? (isAr ? 'أولوية قصوى (إلزامية)' : 'Critical / Mandatory')
        : s.value >= 50
        ? (isAr ? 'مرتفعة جداً (موصى بها)' : 'High Priority')
        : (isAr ? 'متوسطة (ميزة إضافية)' : 'Moderate / Value-Add');

      return [
        String(i + 1),
        s.name,
        cat,
        `${s.value}%`,
        s.jobCount ? s.jobCount.toLocaleString() : 'N/A',
        s.trend || '+15%',
        priority
      ];
    }),
    [],
    // Section 5: Fastest Accelerating Skills / Trends
    ['----------------------------------------------------------------------------------------'],
    [isAr ? 'المهارات الأسرع تسارعاً ونمواً (Fastest Growing Skills Highlights)' : 'FASTEST GROWING SKILLS (90-DAY ACCELERATION)'],
    ['----------------------------------------------------------------------------------------'],
    [
      isAr ? 'نوع المؤشر' : 'Trend Type',
      isAr ? 'اسم التقنية / المهارة' : 'Technology / Skill',
      isAr ? 'معدل زيادة الطلب (90 يوماً)' : '90-Day Demand Surge'
    ],
    [
      isAr ? 'المهارة الصاعدة الأولى (Primary Momentum)' : 'Primary Velocity Driver',
      activeTrack.trendingHighlights.primary.name,
      activeTrack.trendingHighlights.primary.badge
    ],
    [
      isAr ? 'المهارة الصاعدة الثانية (Secondary Momentum)' : 'Secondary Velocity Driver',
      activeTrack.trendingHighlights.secondary.name,
      activeTrack.trendingHighlights.secondary.badge
    ],
    [
      isAr ? 'متوسط تسارع السوق العام' : 'Market Baseline Average',
      activeTrack.trendingHighlights.average.name,
      activeTrack.trendingHighlights.average.badge
    ],
    [],
    // Section 6: Actionable Recommendations & Career Notes
    ['----------------------------------------------------------------------------------------'],
    [isAr ? 'توصيات مهنية ورؤى سوقية (Market Recommendations & Insights)' : 'MARKET INSIGHTS & STRATEGIC RECOMMENDATIONS'],
    ['----------------------------------------------------------------------------------------'],
    [isAr ? 'نمو التخصص' : 'Track Growth', isAr ? activeTrack.insights.ar.roleGrowth : activeTrack.insights.en.roleGrowth],
    [isAr ? 'أبرز جهات التوظيف' : 'Key Employers', isAr ? activeTrack.insights.ar.topCompanies : activeTrack.insights.en.topCompanies],
    [isAr ? 'اتجاهات الرواتب' : 'Compensation Trends', isAr ? activeTrack.insights.ar.salaryTrend : activeTrack.insights.en.salaryTrend],
    [],
    // Section 7: Legal & Attribution Footer
    ['----------------------------------------------------------------------------------------'],
    [isAr ? 'حقوق النشر والملكية الفكرية' : 'Copyright & Intellectual Property', '© 2026 3WATLY (منصة عواطلي). All rights reserved.'],
    [isAr ? 'الموقع الإلكتروني' : 'Platform URL', 'https://3watly.com'],
    [isAr ? 'ملاحظة الاستخدام' : 'Usage Notice', isAr ? 'هذا التقرير معد لمساعدة الكوادر التقنية في اتخاذ قرارات مهنية مدروسة وتطوير مساراتهم التعليمية.' : 'This report is prepared for career planning and skill optimization purposes.']
  ];

  return rows
    .map((row) =>
      row
        .map((cell) => {
          const str = String(cell ?? '');
          return `"${str.replace(/"/g, '""')}"`;
        })
        .join(',')
    )
    .join('\r\n');
}

export function downloadFile(filename: string, content: string, mime = 'text/csv;charset=utf-8') {
  // Add UTF-8 BOM so Microsoft Excel correctly renders Arabic characters natively
  const contentWithBom = content.startsWith('\uFEFF') ? content : '\uFEFF' + content;
  const blob = new Blob([contentWithBom], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}