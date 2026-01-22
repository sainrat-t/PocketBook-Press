import jsPDF from 'jspdf';
import { BookData, FontOption } from '../types';

// Constants for Pocket Book Format (110mm x 180mm)
const PAGE_WIDTH = 110;
const PAGE_HEIGHT = 180;
const MARGIN_TOP = 20;
const MARGIN_BOTTOM = 20;
const MARGIN_OUTER = 15;
const MARGIN_INNER = 20; // Gutter for binding
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_OUTER - MARGIN_INNER;

export const generateCoverPDF = (data: BookData, font: FontOption) => {
  // Create a document for the cover. 
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [PAGE_WIDTH, PAGE_HEIGHT]
  });

  // --- PAGE 1: FRONT COVER ---
  
  // Background
  doc.setFillColor(250, 250, 250);
  doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, 'F');

  // Decorative Frame
  doc.setDrawColor(50, 50, 50);
  doc.setLineWidth(1);
  doc.rect(10, 10, PAGE_WIDTH - 20, PAGE_HEIGHT - 20, 'S');

  // Title
  doc.setFont(font, "bold");
  doc.setFontSize(24);
  const titleLines = doc.splitTextToSize(data.title.toUpperCase(), PAGE_WIDTH - 40);
  doc.text(titleLines, PAGE_WIDTH / 2, 60, { align: 'center' });

  // Subtitle
  if (data.subtitle) {
    doc.setFont(font, "italic");
    doc.setFontSize(14);
    doc.setTextColor(80, 80, 80);
    const subLines = doc.splitTextToSize(data.subtitle, PAGE_WIDTH - 40);
    doc.text(subLines, PAGE_WIDTH / 2, 90, { align: 'center' });
  }

  // Author (Mock if not present, or generic)
  doc.setFont(font, "normal");
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("Auteur Inconnu", PAGE_WIDTH / 2, 150, { align: 'center' });


  // --- PAGE 2: BACK COVER ---
  doc.addPage();
  
  // Background
  doc.setFillColor(245, 245, 245);
  doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, 'F');

  // Synopsis / Blurb (using first chapter snippet or generic text)
  doc.setFont(font, "normal");
  doc.setFontSize(10);
  const blurb = data.chapters.length > 0 
    ? `Extrait: "${data.chapters[0].content.substring(0, 300)}..."` 
    : "Résumé du livre...";
  
  const blurbLines = doc.splitTextToSize(blurb, PAGE_WIDTH - 40);
  doc.text(blurbLines, 20, 50);

  // Barcode Placeholder
  doc.setFillColor(255, 255, 255);
  doc.rect(PAGE_WIDTH / 2 - 15, 140, 30, 15, 'F');
  doc.setFontSize(8);
  doc.text("ISBN 000-0-00-000000-0", PAGE_WIDTH / 2, 158, { align: 'center' });

  doc.save(`${sanitizeFilename(data.title)}_couverture.pdf`);
};

export const generateBodyPDF = (data: BookData, font: FontOption) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [PAGE_WIDTH, PAGE_HEIGHT]
  });

  doc.setFont(font, "normal");
  
  let pageNumber = 1;
  let cursorY = MARGIN_TOP;

  // Helper to check page break
  const checkPageBreak = (heightNeeded: number) => {
    if (cursorY + heightNeeded > PAGE_HEIGHT - MARGIN_BOTTOM) {
      doc.addPage();
      pageNumber++;
      cursorY = MARGIN_TOP;
      return true;
    }
    return false;
  };

  // --- TITLE PAGE ---
  doc.setFontSize(18);
  doc.setFont(font, "bold");
  doc.text(data.title, PAGE_WIDTH / 2, PAGE_HEIGHT / 3, { align: 'center' });
  
  if (data.subtitle) {
    doc.setFontSize(12);
    doc.setFont(font, "italic");
    doc.text(data.subtitle, PAGE_WIDTH / 2, (PAGE_HEIGHT / 3) + 15, { align: 'center' });
  }
  
  // Break after title page
  doc.addPage();
  pageNumber++;
  cursorY = MARGIN_TOP;

  // --- CHAPTERS ---
  data.chapters.forEach((chapter, index) => {
    // Start chapter on new page
    if (index > 0) {
      doc.addPage();
      pageNumber++;
      cursorY = MARGIN_TOP;
    }

    // Chapter Title formatting: "1. Title"
    doc.setFont(font, "bold");
    doc.setFontSize(16);
    // Push title down a bit
    cursorY += 20; 
    
    const chapterDisplayTitle = `${index + 1}. ${chapter.title}`;
    const titleLines = doc.splitTextToSize(chapterDisplayTitle, CONTENT_WIDTH);
    doc.text(titleLines, getMarginLeft(pageNumber), cursorY);
    cursorY += (titleLines.length * 7) + 10; // Line height + gap

    // Chapter Content
    doc.setFont(font, "normal");
    doc.setFontSize(11);
    
    // Split content by paragraphs (double newline)
    const paragraphs = chapter.content.split(/\n\n/);

    paragraphs.forEach((para) => {
      // Indent first line of paragraph
      const indent = "      ";
      const cleanPara = indent + para.replace(/\n/g, ' '); // Remove single newlines within paragraph
      
      const lines = doc.splitTextToSize(cleanPara, CONTENT_WIDTH);
      const lineHeight = 5; // mm

      lines.forEach((line: string) => {
        checkPageBreak(lineHeight);
        doc.text(line, getMarginLeft(pageNumber), cursorY);
        cursorY += lineHeight;
      });

      // Space after paragraph
      cursorY += 2;
    });
  });

  // --- ADD PAGE NUMBERS ---
  const totalPages = doc.getNumberOfPages();
  doc.setFont(font, "normal");
  doc.setFontSize(9);
  
  for (let i = 2; i <= totalPages; i++) { // Skip title page (1)
    doc.setPage(i);
    // Page numbers usually centered or outer edge. Let's center.
    doc.text(String(i), PAGE_WIDTH / 2, PAGE_HEIGHT - 10, { align: 'center' });
  }

  doc.save(`${sanitizeFilename(data.title)}_corps.pdf`);
};

// Helper for margins based on odd/even pages (Mirror margins)
// Odd pages = Right side (Recto) -> Inner margin is Left
// Even pages = Left side (Verso) -> Inner margin is Right
const getMarginLeft = (pageLength: number) => {
  const isOdd = pageLength % 2 !== 0;
  return isOdd ? MARGIN_INNER : MARGIN_OUTER;
};

const sanitizeFilename = (name: string) => {
  return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
};
