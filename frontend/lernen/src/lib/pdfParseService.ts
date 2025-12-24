/**
 * PDF Parse Service
 * 
 * Service for extracting text from text-based PDF files
 * Uses pdfjs-dist (PDF.js) library - designed for browser
 */

import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker - use local worker file
// @ts-ignore - pdfjs-dist worker import
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
}

export interface PdfParseResult {
  text: string;
  success: boolean;
  error?: string;
  pages?: number;
  metadata?: {
    title?: string;
    author?: string;
    subject?: string;
  };
}

/**
 * Extract text from text-based PDF
 * This service works with PDFs that have text layers
 * 
 * @param file - PDF file to parse
 * @returns Extracted text string
 */
export const pdfParseService = {
  /**
   * Extract text from PDF file
   * 
   * @param file - PDF file
   * @returns Extracted text string
   */
  extractTextFromPdf: async (file: File): Promise<string> => {
    try {
      // Convert File to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Load PDF document using PDF.js
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdfDocument = await loadingTask.promise;

      // Extract text from all pages
      let fullText = '';
      const numPages = pdfDocument.numPages;

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdfDocument.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        // Combine all text items from the page
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        
        fullText += pageText + '\n';
      }

      if (!fullText || fullText.trim().length === 0) {
        throw new Error('No text could be extracted from PDF. The PDF might be scanned (image-based).');
      }

      return fullText.trim();
    } catch (error) {
      console.error('PDF Parse Error:', error);
      throw error instanceof Error ? error : new Error('Failed to parse PDF');
    }
  },

  /**
   * Validate PDF file
   * 
   * @param file - File to validate
   * @returns true if valid PDF
   */
  validatePdf: (file: File): boolean => {
    return file.type === 'application/pdf' && file.size > 0;
  },

  /**
   * Get file size in readable format
   * 
   * @param bytes - File size in bytes
   * @returns Formatted string
   */
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  },
};

export default pdfParseService;

