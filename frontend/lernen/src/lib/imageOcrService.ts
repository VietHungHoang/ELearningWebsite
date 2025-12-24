/**
 * Image OCR Service
 * 
 * Service for extracting text from images using OCR (Tesseract)
 * Supports common image formats: JPG, PNG, TIFF, etc.
 * Uses Tesseract.js to process OCR in the frontend
 */

import Tesseract from 'tesseract.js';

export interface ImageOcrResult {
  text: string;
  success: boolean;
  error?: string;
  confidence?: number;
}

/**
 * Extract text from image using OCR
 * 
 * @param file - Image file to process
 * @returns Extracted text string
 */
export const imageOcrService = {
  /**
   * Extract text from image file using OCR
   * 
   * @param file - Image file
   * @param languages - Language codes (e.g., 'eng', 'vie', 'eng+vie')
   * @returns Extracted text string
   */
  extractTextFromImage: async (file: File, languages: string = 'eng+vie'): Promise<string> => {
    try {
      // Perform OCR using Tesseract.js
      const { data: { text } } = await Tesseract.recognize(
        file,
        languages, // Language codes (e.g., 'eng+vie')
        {
          logger: (m) => {
            // Optional: log progress
            if (m.status === 'recognizing text') {
              console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
            }
          }
        }
      );

      if (!text || text.trim().length === 0) {
        throw new Error('No text could be extracted from the image.');
      }

      return text.trim();
    } catch (error) {
      console.error('Image OCR Error:', error);
      throw error instanceof Error ? error : new Error('Failed to extract text from image');
    }
  },

  /**
   * Validate image file
   * 
   * @param file - File to validate
   * @returns true if valid image
   */
  validateImage: (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/tiff', 'image/bmp', 'image/webp'];
    return validTypes.includes(file.type) && file.size > 0;
  },

  /**
   * Get supported image formats
   * 
   * @returns Array of supported MIME types
   */
  getSupportedFormats: (): string[] => {
    return ['image/jpeg', 'image/jpg', 'image/png', 'image/tiff', 'image/bmp', 'image/webp'];
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

export default imageOcrService;

