import React from 'react';
import { parsedCvByRole, roleProfiles } from '../data/roleProfiles';
import type { ParsedCv, ParseStatus, RoleId, RoleProfile, UploadedFile } from '../types/onboarding';

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

export function OnboardingProvider({ children }: {children: React.ReactNode;}) {
  const [role, setRole] = React.useState<RoleId | null>(null);
  const [experience, setExperience] = React.useState('Fresh Graduate');
  const [locations, setLocations] = React.useState<string[]>(['Cairo', 'Giza', 'Remote in Egypt']);
  const [file, setFile] = React.useState<UploadedFile | null>(null);
  const [status, setStatus] = React.useState<ParseStatus>('idle');
  const [progress, setProgress] = React.useState(0);
  const [checksRevealed, setChecksRevealed] = React.useState(0);
  const [skillsAdded, setSkillsAdded] = React.useState(0);
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
  }, [clearTimers]);

  const uploadFile = React.useCallback(
    (next: UploadedFile) => {
      clearTimers();
      setFile(next);
      setStatus('uploading');
      setProgress(0);
      setChecksRevealed(0);
      setSkillsAdded(0);

      timers.current.push(
        window.setTimeout(() => {
          setStatus('parsing');
        }, 450)
      );

      const activeRole = roleRef.current;
      const totalSkills = activeRole ? parsedCvByRole[activeRole].detectedSkills.length : 8;
      const tick = 60;
      let elapsed = 0;
      const interval = window.setInterval(() => {
        elapsed += tick;
        const ratio = Math.min(elapsed / PARSE_DURATION, 1);
        setProgress(Math.round(ratio * 100));
        setSkillsAdded(Math.round(ratio * totalSkills));
        if (ratio >= 1) window.clearInterval(interval);
      }, tick);
      timers.current.push(interval as unknown as number);

      CHECK_DELAYS.forEach((delay, index) => {
        timers.current.push(
          window.setTimeout(() => setChecksRevealed(index + 1), delay)
        );
      });

      timers.current.push(
        window.setTimeout(() => {
          setStatus('complete');
          setProgress(100);
          setSkillsAdded(totalSkills);
        }, PARSE_DURATION)
      );
    },
    [clearTimers]
  );

  /**
   * Switching the target role invalidates any finished analysis, so an
   * already-uploaded CV is re-parsed against the new role instead of showing
   * results that belong to the previous one.
   */
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
    setLocations(['Cairo', 'Giza', 'Remote in Egypt']);
    removeFile();
  }, [clearTimers, removeFile]);

  const value = React.useMemo<OnboardingState>(
    () => ({
      role,
      experience,
      locations,
      file,
      status,
      progress,
      checksRevealed,
      parsedCv: role && status === 'complete' ? parsedCvByRole[role] : null,
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
    skillsAdded,
    selectRole,
    toggleLocation,
    uploadFile,
    removeFile,
    reset]

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