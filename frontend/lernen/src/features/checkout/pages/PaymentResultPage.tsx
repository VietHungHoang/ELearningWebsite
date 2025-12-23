import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FiCheck, FiLoader } from 'react-icons/fi';
import paymentService from '../../../services/paymentService';

const PaymentResultPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      // Lấy params từ URL
      const partnerCode = searchParams.get('partnerCode');
      const orderId = searchParams.get('orderId');
      const orderInfo = searchParams.get('orderInfo');
      const orderType = searchParams.get('orderType');
      const resultCode = searchParams.get('resultCode');
      const message = searchParams.get('message');
      const payType = searchParams.get('payType');
      const responseTimeRaw = searchParams.get('responseTime');
      const signature = searchParams.get('signature');

      // Convert responseTime to ISO string
      const responseTime = responseTimeRaw ? new Date(parseInt(responseTimeRaw)).toISOString() : undefined;

      // Kiểm tra nếu thiếu params quan trọng
      if (!resultCode || !orderId) {
        navigate('/', { replace: true });
        return;
      }

      // Kiểm tra resultCode từ Momo
      if (resultCode !== '0') {
        setStatus('error');
        setMessage('Thanh toán thất bại từ Momo.');
        setDescription('Vui lòng kiểm tra thông tin thanh toán và thử lại. Nếu vấn đề tiếp tục, hãy liên hệ bộ phận hỗ trợ qua email: support@lernen.com hoặc hotline: 1800-xxxx.');
        return;
      }

      try {
        // Gọi API verify payment
        const verifyResponse = await paymentService.verifyPayment({
          orderId: orderId ?? undefined,
          partnerCode: partnerCode ?? undefined,
          orderInfo: orderInfo ?? undefined,
          orderType: orderType ?? undefined,
          resultCode: resultCode ?? undefined,
          message: message ?? undefined,
          payType: payType ?? undefined,
          responseTime,
          signature: signature ?? undefined,
        });

        if (verifyResponse.success) {
          setStatus('success');
          setMessage('Thanh toán thành công! Đang chuyển hướng...');
          // Chờ 2 giây rồi navigate
          setTimeout(() => navigate('/dashboard/my-bookings', { replace: true }), 2000);
        } else {
          setStatus('error');
          setMessage('Thanh toán thành công nhưng có lỗi lưu trữ dữ liệu.');
          setDescription('Đơn hàng của bạn đã được thanh toán thành công từ Momo, nhưng có lỗi khi lưu trữ thông tin. Vui lòng liên hệ bộ phận hỗ trợ qua email: support@lernen.com hoặc hotline: 1800-xxxx để được xử lý.');
        }
      } catch (error) {
        console.error('Lỗi xác nhận thanh toán:', error);
        setStatus('error');
        setMessage('Có lỗi xảy ra khi xác nhận thanh toán.');
        setDescription('Vui lòng thử lại sau hoặc liên hệ bộ phận hỗ trợ qua email: support@lernen.com hoặc hotline: 1800-xxxx.');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src="/images/logo-default.svg" alt="Lernen" className="h-8 w-auto" />
            </div>
          </div>
        </div>
      </header>
      <div className="flex-1 flex items-center justify-center bg-white">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
        {status === 'loading' && (
          <>
            <FiLoader className="animate-spin text-4xl text-[#0b6459] mx-auto" />
            <p className="mt-4 text-xl font-semibold text-gray-700">Đang xác nhận thanh toán...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <FiCheck className="text-4xl text-green-500 mx-auto" />
            <p className="mt-4 text-xl font-semibold text-gray-700">{message}</p>
          </>
        )}
        {status === 'error' && (
          <>
            <img src="/images/error.png" alt="Error" className="h-16 w-16 mx-auto" />
            <p className="mt-4 text-xl font-semibold text-gray-700">{message}</p>
            <p className="mt-2 text-sm text-gray-500">{description}</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-4 py-2 bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43]"
            >
              Quay lại trang chủ
            </button>
          </>
        )}
      </div>
    </div>
    </div>
  );
};

export default PaymentResultPage;