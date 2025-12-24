import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { LernenLogo } from '../../../components/LernenLogo';
import { HiCloudUpload, HiDocumentText } from 'react-icons/hi';
import { tutorService } from '../../../services/tutorService';
import pdfParseService from '../../../lib/pdfParseService';
import imageOcrService from '../../../lib/imageOcrService';

const TutorResumeInputPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log('TutorResumeInputPage mounted');
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    const isImage = imageOcrService.validateImage(selectedFile);
    const isPdf = pdfParseService.validatePdf(selectedFile);

    if (!isImage && !isPdf) {
      setError('Please select a valid PDF or image file (JPG, PNG, TIFF, etc.)');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (selectedFile.size > maxSize) {
      setError('File size must be less than 10MB');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // Auto-extract text from file
      let text = '';
      
      if (selectedFile.type === 'application/pdf') {
        console.log('📄 [DEBUG] Processing PDF file:', selectedFile.name);
        text = await pdfParseService.extractTextFromPdf(selectedFile);
        console.log('✅ [DEBUG] PDF text extracted successfully. Length:', text.length);
        console.log('📝 [DEBUG] Extracted text preview (first 200 chars):', text.substring(0, 200));
      } else {
        console.log('🖼️ [DEBUG] Processing image file:', selectedFile.name, 'Type:', selectedFile.type);
        text = await imageOcrService.extractTextFromImage(selectedFile);
        console.log('✅ [DEBUG] Image OCR completed successfully. Length:', text.length);
        console.log('📝 [DEBUG] Extracted text preview (first 200 chars):', text.substring(0, 200));
      }

      if (!text || text.trim().length === 0) {
        throw new Error('No text could be extracted from the file. Please try manual input.');
      }

      console.log('✅ [DEBUG] Text extraction completed. Total characters:', text.length);

      // Get tutor ID from localStorage
      const tutorOnboardingData = localStorage.getItem('tutor_onboarding_data');
      if (!tutorOnboardingData) {
        throw new Error('Tutor onboarding data not found. Please try signing up again.');
      }

      const tutorData = JSON.parse(tutorOnboardingData);
      const tutorId = tutorData.id;

      if (!tutorId) {
        throw new Error('Tutor ID not found. Please try signing up again.');
      }

      console.log('👤 [DEBUG] Tutor ID from localStorage:', tutorId);

      // Auto-submit to backend
      console.log('📤 [DEBUG] Submitting extracted text to backend...');
      console.log('📝 [DEBUG] Text length:', text.length);
      console.log('📝 [DEBUG] Text preview (first 200 chars):', text.substring(0, 200));
      
      const response = await tutorService.submitResumeText(tutorId, text);

      console.log('📥 [DEBUG] Backend response:', response);

      if (response.success) {
        console.log('✅ [DEBUG] Resume submitted successfully, navigating to onboarding');
        navigate('/onboarding/tutor?step=1');
      } else {
        console.error('❌ [DEBUG] Backend returned error:', response.message);
        setError(response.message || 'Failed to submit resume');
        setLoading(false);
      }
    } catch (err) {
      console.error('❌ [DEBUG] Error processing file:', err);
      setError(err instanceof Error ? err.message : 'Failed to process file');
      setLoading(false);
    }
  };


  return (
    <AuthLayout>
      <main className="relative w-full max-w-5xl mx-auto mt-8 mb-8 bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome to Lernen!</h1>
              <p className="text-sm text-gray-500 mt-1">Let's get started by adding your resume</p>
            </div>
            <div className="text-right w-24">
              <LernenLogo />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-8 py-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Option Selection */}
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                How would you like to add your resume?
              </h2>
              <p className="text-gray-600 text-sm">
                Choose one of the options below to get started
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Upload Option */}
              <button
                onClick={() => {
                  // Auto-trigger file input when upload option is selected
                  fileInputRef.current?.click();
                }}
                className="group relative p-8 border-2 border-gray-200 rounded-xl hover:border-[#0b6459] hover:shadow-lg transition-all duration-200 bg-white"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#0b6459]/10 flex items-center justify-center group-hover:bg-[#0b6459]/20 transition-colors">
                    <HiCloudUpload className="w-8 h-8 text-[#0b6459]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Upload File</h3>
                    <p className="text-sm text-gray-600">
                      Upload PDF or image file (JPG, PNG, TIFF)
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      We'll extract text automatically using OCR
                    </p>
                  </div>
                </div>
              </button>

              {/* Manual Input Option */}
              <button
                onClick={() => {
                  console.log('📝 [DEBUG] Manual option selected, navigating to onboarding');
                  navigate('/onboarding/tutor?step=1');
                }}
                className="group relative p-8 border-2 border-gray-200 rounded-xl hover:border-[#0b6459] hover:shadow-lg transition-all duration-200 bg-white"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#0b6459]/10 flex items-center justify-center group-hover:bg-[#0b6459]/20 transition-colors">
                    <HiDocumentText className="w-8 h-8 text-[#0b6459]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Enter Manually</h3>
                    <p className="text-sm text-gray-600">
                      Type or paste your resume content
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Copy and paste from your existing resume
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Hidden file input - auto-triggered when upload option is selected */}
          <input
            id="file-upload"
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.tiff,.bmp,.webp"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Loading overlay - centered on screen */}
          {loading && (
            <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
              <div className="bg-white rounded-lg shadow-2xl px-8 py-6 flex flex-col items-center border border-gray-200 pointer-events-auto">
                <svg className="animate-spin h-12 w-12 text-[#0b6459] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-700 font-medium">Waiting for process...</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </AuthLayout>
  );
};

export default TutorResumeInputPage;

