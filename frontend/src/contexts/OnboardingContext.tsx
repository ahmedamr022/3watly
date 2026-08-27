"use client";

import React from 'react';
import { parsedCvByRole, roleProfiles } from '../data/roleProfiles';
import type { ParsedCv, ParseStatus, RoleId, RoleProfile, UploadedFile } from '../types/onboarding';
import { useAuth } from './AuthContext';
import { extractNameFromFilename } from '../utils/formatName';
import { ApiService } from '../services/api';

interface OnboardingState {
  role: RoleId | null;
  experience: string;
  locations: string[];
  file: UploadedFile | null;
  status: ParseStatus;
  progress: number;
  checksRevealed: number;
  parsedCv: ParsedCv | null;
  profile: RoleProfile | null;
  skillsAdded: number;
  selectRole: (role: RoleId) => void;
  setExperience: (level: string) => void;
  toggleLocation: (location: string) => void;
  uploadFile: (file: UploadedFile) => void;
  removeFile: () => void;
  reset: () => void;
}

const OnboardingContext = React.createContext<OnboardingState | null>(null);

const CHECK_DELAYS = [1100, 2100, 3100];
const PARSE_DURATION = 4200;

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const { user, updateFullName } = useAuth();
  const [role, setRole] = React.useState<RoleId | null>(null);
  const [experience, setExperience] = React.useState('Fresh Graduate');
  const [locations, setLocations] = React.useState<string[]>(['cairo', 'giza', 'remote-egypt']);
  const [file, setFile] = React.useState<UploadedFile | null>(null);
  const [status, setStatus] = React.useState<ParseStatus>('idle');
  const [progress, setProgress] = React.useState(0);
  const [checksRevealed, setChecksRevealed] = React.useState(0);
  const [skillsAdded, setSkillsAdded] = React.useState(0);
  const [customParsedCv, setCustomParsedCv] = React.useState<ParsedCv | null>(null);
  const timers = React.useRef<number[]>([]);
  const roleRef = React.useRef<RoleId | null>(null);

  React.useEffect(() => {
    roleRef.current = role;
  }, [role]);

  const clearTimers = React.useCallback(() => {
    timers.current.forEach((id) => {
      window.clearTimeout(id);
      window.clearInterval(id);
    });
    timers.current = [];
  }, []);

  React.useEffect(() => clearTimers, [clearTimers]);

  const toggleLocation = React.useCallback((location: string) => {
    setLocations((prev) =>
      prev.includes(location) ? prev.filter((item) => item !== location) : [...prev, location]
    );
  }, []);

  const removeFile = React.useCallback(() => {
    clearTimers();
    setFile(null);
    setStatus('idle');
    setProgress(0);
    setChecksRevealed(0);
    setSkillsAdded(0);
    setCustomParsedCv(null);
  }, [clearTimers]);

  const uploadFile = React.useCallback(
    (nextFile: UploadedFile) => {
      clearTimers();
      setFile(nextFile);
      setStatus('parsing');
      setProgress(8);
      setChecksRevealed(0);
      setSkillsAdded(0);

      // 1. Extract name from filename or user auth profile
      const extractedFromName = extractNameFromFilename(nextFile.name);
      if (extractedFromName && (!user?.fullName || user.fullName === '3WATLY User' || user.fullName === 'مستخدم عواطلي')) {
        updateFullName(extractedFromName);
      }

      // 2. Try sending file to FastAPI Backend
      if ((nextFile as any).file || (nextFile as any).rawFile) {
        const formData = new FormData();
        formData.append('file', (nextFile as any).file || (nextFile as any).rawFile);
        ApiService.analyzeCv(formData).then((res) => {
          if (res && res.skills) {
            console.log('Live backend CV parsed successfully:', res);
          }
        }).catch(() => {});
      }

      const intervalId = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 92) {
            window.clearInterval(intervalId);
            return 92;
          }
          return prev + Math.floor(Math.random() * 9) + 4;
        });
      }, 220);
      timers.current.push(intervalId);

      CHECK_DELAYS.forEach((delay, index) => {
        const timerId = window.setTimeout(() => {
          setChecksRevealed(index + 1);
        }, delay);
        timers.current.push(timerId);
      });

      const finishTimer = window.setTimeout(() => {
        window.clearInterval(intervalId);
        setProgress(100);
        setStatus('complete');
        setChecksRevealed(3);
      }, PARSE_DURATION);
      timers.current.push(finishTimer);
    },
    [clearTimers, user, updateFullName]
  );

  const selectRole = React.useCallback(
    (next: RoleId) => {
      const changed = roleRef.current !== next;
      roleRef.current = next;
      setRole(next);
      if (changed && file) uploadFile(file);
    },
    [file, uploadFile]
  );

  const reset = React.useCallback(() => {
    clearTimers();
    setRole(null);
    setExperience('Fresh Graduate');
    setLocations(['cairo', 'giza', 'remote-egypt']);
    removeFile();
  }, [clearTimers, removeFile]);

  // Derive dynamic parsed CV with REAL user name and email
  const currentFullName = user?.fullName
    ? user.fullName.toUpperCase()
    : file?.name
    ? (extractNameFromFilename(file.name)?.toUpperCase() || 'AHMED AMR')
    : 'AHMED AMR';

  const currentEmail = user?.email || (currentFullName ? `${currentFullName.toLowerCase().replace(/\s+/g, '.')}@email.com` : 'ahmed.amr@email.com');

  const baseCv = role && status === 'complete' && parsedCvByRole[role] ? parsedCvByRole[role] : null;
  const parsedCv: ParsedCv | null = baseCv
    ? {
        ...baseCv,
        fullName: currentFullName,
        email: currentEmail
      }
    : null;

  const value = React.useMemo<OnboardingState>(
    () => ({
      role,
      experience,
      locations,
      file,
      status,
      progress,
      checksRevealed,
      parsedCv,
      profile: role && status === 'complete' ? roleProfiles[role] : null,
      skillsAdded,
      selectRole,
      setExperience,
      toggleLocation,
      uploadFile,
      removeFile,
      reset
    }),
    [
      role,
      experience,
      locations,
      file,
      status,
      progress,
      checksRevealed,
      parsedCv,
      skillsAdded,
      selectRole,
      toggleLocation,
      uploadFile,
      removeFile,
      reset
    ]
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const context = React.useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used inside an OnboardingProvider');
  }
  return context;
}
