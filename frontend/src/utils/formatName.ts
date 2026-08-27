/**
 * Formats user full name into First Name + Second Name Initial with dot.
 * Example: "Ahmed Amr" -> "Ahmed A." / "أحمد ع."
 */
export function formatTopbarName(fullName?: string | null, isAr: boolean = false): string {
  if (!fullName || !fullName.trim()) {
    return isAr ? "أحمد ع." : "Ahmed A.";
  }

  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0];
  }

  const firstName = parts[0];
  const secondInitial = parts[1].charAt(0);
  
  return `${firstName} ${secondInitial}.`;
}

export function extractNameFromFilename(filename?: string): string | null {
  if (!filename) return null;
  // Clean extension
  const clean = filename.replace(/\.[^/.]+$/, "");
  // Replace underscores and dashes with spaces
  const spaced = clean.replace(/[_-]+/g, " ");
  // Remove common resume keywords
  const nameOnly = spaced.replace(/\b(cv|resume|resume_en|cv_ar|pdf|docx|final|updated|v\d+)\b/gi, "").trim();
  
  if (nameOnly.length >= 3) {
    // Capitalize words
    return nameOnly
      .split(/\s+/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  }
  return null;
}
