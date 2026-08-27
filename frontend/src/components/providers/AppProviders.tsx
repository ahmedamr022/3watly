"use client";

import React from "react";
import { Toaster } from "sonner";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CVProvider } from "@/contexts/CVContext";
import { SkillPlanProvider } from "@/contexts/SkillPlanContext";
import { ChatProvider } from "@/contexts/ChatContext";
import { OnboardingProvider } from "@/contexts/OnboardingContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <OnboardingProvider>
          <CVProvider>
            <SkillPlanProvider>
              <ChatProvider>
                {children}
                <Toaster
                  position="bottom-right"
                  richColors
                  closeButton
                  className="no-print"
                  toastOptions={{ duration: 3200 }}
                />
              </ChatProvider>
            </SkillPlanProvider>
          </CVProvider>
        </OnboardingProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

