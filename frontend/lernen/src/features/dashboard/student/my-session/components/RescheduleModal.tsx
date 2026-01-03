import React, { useState, useEffect } from 'react';
import ModalLayout from '../../../../../components/ui/ModalLayout';
import type { Session } from '../../../../../types/class';
import commonUtils from '../../../../../utils/commonUtils';

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Session | null;
  onSubmit: (reason: string, newDateTime: string) => void;
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({
  isOpen,
  onClose,
  booking,
  onSubmit
}) => {
  const [reason, setReason] = useState('');
  const [newDateTime, setNewDateTime] = useState('');
  const [errors, setErrors] = useState<{ reason?: string; newDateTime?: string }>({});

  // Format datetime-local value from booking sessionDatetime
  const getInitialDateTime = () => {
    if (booking?.sessionDatetime) {
      // Convert UTC datetime from backend to local timezone
      const localDate = commonUtils.convertUTCToLocalDate(booking.sessionDatetime);
      // Convert to local datetime string for input type="datetime-local"
      const year = localDate.getFullYear();
      const month = String(localDate.getMonth() + 1).padStart(2, '0');
      const day = String(localDate.getDate()).padStart(2, '0');
      const hours = String(localDate.getHours()).padStart(2, '0');
      const minutes = String(localDate.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
    return '';
  };

  // Initialize form when modal opens
  useEffect(() => {
    if (isOpen && booking) {
      setNewDateTime(getInitialDateTime());
      setReason('');
      setErrors({});
    }
  }, [isOpen, booking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: { reason?: string; newDateTime?: string } = {};
    if (!reason.trim()) {
      newErrors.reason = 'Vui lòng nhập lý do đổi lịch';
    }
    if (!newDateTime) {
      newErrors.newDateTime = 'Vui lòng chọn thời gian muốn đổi';
    } else {
      const selectedDate = new Date(newDateTime);
      const now = new Date();
      if (selectedDate <= now) {
        newErrors.newDateTime = 'Thời gian đổi lịch phải sau thời gian hiện tại';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(reason, newDateTime);
    handleClose();
  };

  const handleClose = () => {
    setReason('');
    setNewDateTime('');
    setErrors({});
    onClose();
  };

  return (
    <ModalLayout isOpen={isOpen} onClose={handleClose} maxWidth="md" showCloseButton={false}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Xác nhận đổi lịch</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Reason Field */}
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
              Lý do đổi lịch <span className="text-red-500">*</span>
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (errors.reason) {
                  setErrors(prev => ({ ...prev, reason: undefined }));
                }
              }}
              rows={4}
              className={`w-full px-4 py-3 rounded-lg focus:outline-none transition-colors duration-200 box-border ${
                errors.reason 
                  ? 'border border-red-500 focus:border-red-500' 
                  : 'border border-transparent hover:border-gray-300 focus:border-[#0b6459]'
              }`}
              placeholder="Nhập lý do bạn muốn đổi lịch..."
            />
            {errors.reason && (
              <p className="mt-1 text-sm text-red-500">{errors.reason}</p>
            )}
          </div>

          {/* New DateTime Field */}
          <div>
            <label htmlFor="newDateTime" className="block text-sm font-medium text-gray-700 mb-2">
              Thời gian muốn đổi <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              id="newDateTime"
              value={newDateTime}
              onChange={(e) => {
                setNewDateTime(e.target.value);
                if (errors.newDateTime) {
                  setErrors(prev => ({ ...prev, newDateTime: undefined }));
                }
              }}
              min={new Date().toISOString().slice(0, 16)}
              className={`w-full px-4 py-3 rounded-lg focus:outline-none transition-colors duration-200 box-border ${
                errors.newDateTime 
                  ? 'border border-red-500 focus:border-red-500' 
                  : 'border border-transparent hover:border-gray-300 focus:border-[#0b6459]'
              }`}
            />
            {errors.newDateTime && (
              <p className="mt-1 text-sm text-red-500">{errors.newDateTime}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2.5 text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#0b6459] text-white font-semibold rounded-lg hover:bg-[#084c43] transition-colors"
            >
              Yêu cầu đổi lịch
            </button>
          </div>
        </form>
      </div>
    </ModalLayout>
  );
};

export default RescheduleModal;

