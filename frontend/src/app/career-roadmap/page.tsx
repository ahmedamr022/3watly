"use client";

import React, { useState } from "react";
import { DownloadIcon, TargetIcon } from "lucide-react";
import { toast } from "sonner";
import { useSkillPlan } from "@/contexts/SkillPlanContext";
import { PlanOverview } from "@/components/skills/PlanOverview";
import { PriorityList } from "@/components/skills/PriorityList";
import { FutureSkills } from "@/components/skills/FutureSkills";
import { CoveredSkills } from "@/components/skills/CoveredSkills";
import { CommitBanner } from "@/components/skills/CommitBanner";
import { PlanSummaryCard } from "@/components/skills/PlanSummaryCard";
import { ImpactCard } from "@/components/skills/ImpactCard";
import { ResourcesCard } from "@/components/skills/ResourcesCard";
import { HelpCard } from "@/components/skills/HelpCard";
import { TargetRoleModal } from "@/components/skills/TargetRoleModal";
import { ResourcesModal } from "@/components/skills/ResourcesModal";
import type { ResourceKind } from "@/types/skills";
import { AppShell } from "@/components/layout/AppShell";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SkillGapPage() {
  const { plan } = useSkillPlan();
  const { isAr } = useLanguage();
  const [targetOpen, setTargetOpen] = useState(false);
  const [resourceKind, setResourceKind] = useState<ResourceKind | "all" | null>(
    null
  );

  const downloadPlan = () => {
    toast.success(
      isAr
        ? "جاري فتح نافذة الطباعة — احفظ الخطة كملف PDF."
        : "Opening your print dialog — save the plan as PDF."
    );
    window.setTimeout(() => window.print(), 350);
  };

  return (
    <AppShell showSearch={false}>
      <div className="flex h-full min-h-0 flex-col -m-4 sm:-m-6 lg:-m-8 bg-slate-50">
        <header className="no-print flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 bg-white px-6 sm:px-8 py-5">
          <div>
            <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
              {isAr ? "تحليل فجوة المهارات (Skill Gap Analysis)" : "Skill Gap Analysis"}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {isAr
                ? `المهارات المطلوبة بين سيرتك الذاتية ووظائف ${plan.role.name} في سوق ${plan.role.city} — مرتبة، متسلسلة ومتابعة لحظياً.`
                : `The skills between your CV and the ${plan.role.name} roles you want in ${plan.role.city} — ranked, sequenced and tracked.`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setTargetOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition-colors duration-150 ease-smooth hover:bg-slate-50 cursor-pointer shadow-2xs"
            >
              <TargetIcon className="h-4 w-4 text-slate-500" aria-hidden="true" />
              {isAr ? "تغيير المسمى المستهدف" : "Change target role"}
            </button>
            <button
              type="button"
              onClick={downloadPlan}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 ease-smooth hover:bg-brand-700 cursor-pointer shadow-sm"
            >
              <DownloadIcon className="h-4 w-4" aria-hidden="true" />
              {isAr ? "تحميل الخطة PDF" : "Download plan"}
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-6 sm:p-8 scroll-slim">
          <div className="mx-auto flex max-w-[1320px] flex-col gap-6 xl:flex-row">
            <div className="flex min-w-0 flex-1 flex-col gap-6">
              <PlanOverview
                plan={plan}
                onChangeTarget={() => setTargetOpen(true)}
              />

              <PriorityList plan={plan} />
              <FutureSkills plan={plan} />
              <CoveredSkills plan={plan} />
              <CommitBanner plan={plan} />
            </div>

            <aside className="flex w-full shrink-0 flex-col gap-6 xl:w-[340px]">
              <PlanSummaryCard plan={plan} />
              <ImpactCard plan={plan} />
              <ResourcesCard onOpen={(kind) => setResourceKind(kind)} />
              <HelpCard roleName={plan.role.name} />
            </aside>
          </div>
        </div>

        <TargetRoleModal
          open={targetOpen}
          onClose={() => setTargetOpen(false)}
        />

        {resourceKind !== null && (
          <ResourcesModal
            open
            initialKind={resourceKind}
            skills={
              plan.priorities.length > 0
                ? [...plan.priorities, ...plan.future]
                : plan.future
            }
            onClose={() => setResourceKind(null)}
          />
        )}
      </div>
    </AppShell>
  );
}
