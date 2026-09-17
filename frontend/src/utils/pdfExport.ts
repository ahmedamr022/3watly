"use client";

import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import type { CVData, TemplateId } from '../types/cv';
import { generateDirectVectorPdf } from './vectorPdfGenerator';

/**
 * Directly downloads the CV as a clean high-fidelity PDF with:
 * - Exact active template layout (Single Column, Two Column, Compact, etc.)
 * - Official platform SVG icons (LinkedIn, GitHub, Portfolio, etc.)
 * - All certifications and customized platform names
 * - True-to-preview font family, margins, and hierarchy
 * - 100% Vector clickable hyperlinks embedded into the PDF coordinates
 */
export async function exportCvToPdf(
  elementId: string = 'cv-paper-root',
  fileName: string = 'Resume.pdf',
  cvData?: CVData,
  template?: TemplateId
): Promise<void> {
  const element = typeof document !== 'undefined' ? document.getElementById(elementId) : null;

  // Fallback to direct vector generator if DOM element is not mounted
  if (!element) {
    if (cvData) {
      generateDirectVectorPdf(cvData, { fileName, template });
      return;
    }
    throw new Error('CV element not found');
  }

  // Clone element into off-screen container matching A4 dimensions
  const clone = element.cloneNode(true) as HTMLElement;
  clone.id = 'cv-export-direct-clone';
  clone.style.width = '794px';
  clone.style.maxWidth = '794px';
  clone.style.backgroundColor = '#ffffff';
  clone.style.color = '#0f172a';
  clone.style.margin = '0';
  clone.style.boxShadow = 'none';
  clone.style.border = 'none';
  clone.style.borderRadius = '0';
  
  // Preserve template's font family
  const computedFont = element.style.fontFamily || window.getComputedStyle(element).fontFamily;
  if (computedFont) {
    clone.style.fontFamily = computedFont;
  }

  // Strip dark mode class overrides
  clone.classList.remove('dark', 'shadow-2xl', 'border', 'rounded-xl', 'rounded-2xl');
  const allChildren = clone.querySelectorAll('*');
  allChildren.forEach((child) => {
    const el = child as HTMLElement;
    const darkClasses: string[] = [];
    el.classList.forEach((c) => {
      if (c.startsWith('dark:')) darkClasses.push(c);
    });
    darkClasses.forEach((c) => el.classList.remove(c));

    if (el.tagName === 'H1' || el.tagName === 'H2') {
      el.style.color = '#0f172a';
    }

    // Force SVG icons to be solid black in export
    if (el.tagName.toLowerCase() === 'svg') {
      el.style.color = '#000000';
      el.style.fill = 'currentColor';
    }
  });

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '-99999px';
  container.style.left = '-99999px';
  container.style.width = '794px';
  container.style.backgroundColor = '#ffffff';
  container.style.zIndex = '-99999';
  container.appendChild(clone);
  document.body.appendChild(container);

  try {
    const imgData = await toPng(clone, {
      quality: 1.0,
      pixelRatio: 3.0,
      backgroundColor: '#ffffff',
      width: 794,
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pdfWidth = 210;
    const pdfHeight = 297;

    const img = new Image();
    img.src = imgData;
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    const naturalHeightMm = (img.height * pdfWidth) / img.width;

    const finalWidth = naturalHeightMm > pdfHeight ? (pdfHeight / naturalHeightMm) * pdfWidth : pdfWidth;
    const finalHeight = naturalHeightMm > pdfHeight ? pdfHeight : naturalHeightMm;
    const xOffset = (pdfWidth - finalWidth) / 2;

    pdf.addImage(imgData, 'PNG', xOffset, 0, finalWidth, finalHeight, undefined, 'FAST');

    // Embed genuine clickable vector links on top of the PDF coordinates
    const links = clone.querySelectorAll('a[href]');
    const cloneRect = clone.getBoundingClientRect();
    const scaleFactor = finalWidth / 794;

    links.forEach((linkNode) => {
      const a = linkNode as HTMLAnchorElement;
      const href = a.getAttribute('href');
      if (href && !href.startsWith('#')) {
        const linkRect = a.getBoundingClientRect();
        const linkX = xOffset + (linkRect.left - cloneRect.left) * scaleFactor;
        const linkY = (linkRect.top - cloneRect.top) * scaleFactor;
        const linkW = linkRect.width * scaleFactor;
        const linkH = linkRect.height * scaleFactor;

        pdf.link(linkX, linkY, linkW, linkH, { url: href });
      }
    });

    const cleanName = fileName.replace(/[/\\?%*:|"<>]/g, '_').trim() || 'Resume';
    pdf.save(cleanName.endsWith('.pdf') ? cleanName : `${cleanName}.pdf`);
  } catch (domExportErr) {
    console.warn('DOM-based PDF export encountered an issue, falling back to pure vector PDF:', domExportErr);
    if (cvData) {
      generateDirectVectorPdf(cvData, { fileName, template });
    } else {
      throw domExportErr;
    }
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}
