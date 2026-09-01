"use client";

/**
 * Prints or exports the CV as a genuine 100% Vector Text PDF with:
 * - 100% Selectable and copyable text (not rasterized pixels/image)
 * - 100% Clickable hyperlinks (LinkedIn, GitHub, Portfolio, Demo)
 * - 100% ATS-compliant clean formatting
 * - Zero website chrome, zero URL footers, and clean candidate name
 */
export function exportCvToPdf(elementId: string = 'cv-paper-root', fileName: string = 'Resume.pdf'): void {
  const element = document.getElementById(elementId);
  if (!element) {
    window.print();
    return;
  }

  // Remove existing print iframe if any
  const existingIframe = document.getElementById('cv-print-isolated-iframe');
  if (existingIframe) {
    document.body.removeChild(existingIframe);
  }

  const iframe = document.createElement('iframe');
  iframe.id = 'cv-print-isolated-iframe';
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = 'none';
  iframe.style.zIndex = '-9999';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    window.print();
    return;
  }

  // Collect active Tailwind styles and fonts
  let styleTags = '';
  document.querySelectorAll('style, link[rel="stylesheet"]').forEach((tag) => {
    styleTags += tag.outerHTML;
  });

  // Extract clean clone content
  const clone = element.cloneNode(true) as HTMLElement;
  clone.id = 'cv-paper-print-target';
  
  // Clean dark classes from clone for pure print contrast
  clone.classList.remove('dark', 'shadow-2xl', 'border');
  const allChildren = clone.querySelectorAll('*');
  allChildren.forEach((child) => {
    const el = child as HTMLElement;
    const darkClasses: string[] = [];
    el.classList.forEach((c) => {
      if (c.startsWith('dark:')) darkClasses.push(c);
    });
    darkClasses.forEach((c) => el.classList.remove(c));
  });

  const docTitle = fileName.replace(/\.pdf$/i, '').trim() || 'Resume';

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html lang="en" dir="ltr">
      <head>
        <meta charset="utf-8" />
        <title>${docTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        ${styleTags}
        <style>
          @page {
            size: A4 portrait;
            margin: 10mm 14mm 10mm 14mm;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            box-sizing: border-box;
          }
          html, body {
            background: #ffffff !important;
            color: #0f172a !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: auto !important;
            font-family: Georgia, "Times New Roman", serif;
            direction: ltr !important;
            text-align: left !important;
          }
          a {
            color: #1d4ed8 !important;
            text-decoration: none !important;
          }
          a:hover {
            text-decoration: underline !important;
          }
          article, #cv-paper-print-target {
            max-width: 100% !important;
            width: 100% !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            background: #ffffff !important;
            color: #0f172a !important;
          }
          header {
            border-color: #cbd5e1 !important;
          }
          [class*="border-b"] {
            border-color: #cbd5e1 !important;
          }
          [class*="text-blue"] {
            color: #1d4ed8 !important;
          }
          [class*="text-slate-900"] {
            color: #0f172a !important;
          }
          [class*="text-slate-800"] {
            color: #1e293b !important;
          }
          [class*="text-slate-700"] {
            color: #334155 !important;
          }
          [class*="text-slate-600"] {
            color: #475569 !important;
          }
          [class*="text-slate-500"] {
            color: #64748b !important;
          }
          [class*="bg-blue"] {
            background-color: #2563eb !important;
          }
        </style>
      </head>
      <body class="light">
        ${clone.outerHTML}
      </body>
    </html>
  `);
  doc.close();

  iframe.contentWindow?.focus();
  setTimeout(() => {
    iframe.contentWindow?.print();
  }, 250);
}
