import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthLayout from '../components/AuthLayout';
import { LernenLogo } from '../../../components/LernenLogo';
import { HiCloudUpload, HiDocumentText } from 'react-icons/hi';
import { tutorService } from '../../../services/tutorService';
import pdfParseService from '../../../lib/pdfParseService';
import imageOcrService from '../../../lib/imageOcrService';
import Toast from '../../../components/ui/Toast';
import BirdLoading from '../../../components/ui/BirdLoading';

const TutorResumeInputPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

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
      setToastMessage(t('auth.resumeInput.invalidFileType'));
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (selectedFile.size > maxSize) {
      setToastMessage(t('auth.resumeInput.fileTooLarge'));
      return;
    }

    setToastMessage(null);
    setLoading(true);
    
    // Create AbortController for cancellation
    abortControllerRef.current = new AbortController();

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
        throw new Error(t('auth.resumeInput.noTextExtracted'));
      }

      console.log('✅ [DEBUG] Text extraction completed. Total characters:', text.length);

      // Get tutor ID from localStorage
      const tutorOnboardingData = localStorage.getItem('tutor_onboarding_data');
      if (!tutorOnboardingData) {
        throw new Error(t('auth.resumeInput.tutorDataNotFound'));
      }

      const tutorData = JSON.parse(tutorOnboardingData);
      const tutorId = tutorData.id;

      if (!tutorId) {
        throw new Error(t('auth.resumeInput.tutorIdNotFound'));
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
        setToastMessage(response.message || t('auth.resumeInput.failedToSubmit'));
        setLoading(false);
      }
    } catch (err) {
      // Check if error is due to abort
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('🛑 [DEBUG] File processing cancelled by user');
        return;
      }
      console.error('❌ [DEBUG] Error processing file:', err);
      setToastMessage(err instanceof Error ? err.message : t('auth.resumeInput.failedToProcess'));
      setLoading(false);
    } finally {
      abortControllerRef.current = null;
    }
  };

  const handleCancel = () => {
    // Stop loading and reset state
    setLoading(false);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // Abort ongoing operations if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };


  return (
    <AuthLayout>
      {/* Toast notification */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="error"
          onClose={() => setToastMessage(null)}
        />
      )}
      <main className="relative w-full max-w-5xl mx-auto mt-8 mb-8 bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('auth.resumeInput.welcome')}</h1>
              <p className="text-sm text-gray-500 mt-1">{t('auth.resumeInput.subtitle')}</p>
            </div>
            <div className="text-right w-24">
              <LernenLogo />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-8 py-12 min-h-[450px]">
          {/* Option Selection */}
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {t('auth.resumeInput.howToAdd')}
              </h2>
              <p className="text-gray-600 text-sm">
                {t('auth.resumeInput.chooseOption')}
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
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{t('auth.resumeInput.uploadFile')}</h3>
                    <p className="text-sm text-gray-600">
                      {t('auth.resumeInput.uploadDescription')}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {t('auth.resumeInput.uploadNote')}
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
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{t('auth.resumeInput.enterManually')}</h3>
                    <p className="text-sm text-gray-600">
                      {t('auth.resumeInput.manualDescription')}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {t('auth.resumeInput.manualNote')}
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

          {/* Loading overlay - same style as checkout page */}
          {loading && (
            <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
              <div className="flex flex-col items-center">
                <BirdLoading
                  title={t('auth.resumeInput.processing')}
                  description={t('auth.resumeInput.pleaseWait')}
                  size="lg"
                />
                <button
                  onClick={handleCancel}
                  className="mt-8 px-6 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                >
                  {t('auth.resumeInput.cancel')}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </AuthLayout>
  );
};

export default TutorResumeInputPage;
