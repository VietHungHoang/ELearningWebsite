import React, { useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PaymentSuccessPage from './PaymentSuccessPage';
import PaymentFailedPage from './PaymentFailedPage';

const PaymentResultPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Xác định trạng thái thanh toán từ params
  const paymentStatus = useMemo(() => {
    const resultCode = searchParams.get('resultCode') || searchParams.get('vnp_ResponseCode');
    const orderId = searchParams.get('orderId');

    // Kiểm tra params cơ bản
    if (!orderId) {
      // Nếu không có orderId, có thể là truy cập trực tiếp -> redirect về home
      // navigate('/', { replace: true }); // Cannot navigate in render, handled in useEffect or just default to fail/home
      return 'invalid';
    }

    // Logic xác định thành công
    // Momo: resultCode = '0'
    // VNPay: vnp_ResponseCode = '00'
    // SePay: thường confirm qua webhook, nhưng nếu redirect thì cần check quy ước. 
    // Tạm thời check '0' hoặc '00'
    const isSuccess = resultCode === '0' || resultCode === '00';

    return isSuccess ? 'success' : 'failed';
  }, [searchParams]);

  if (paymentStatus === 'invalid') {
    // Redirect về trang chủ nếu không hợp lệ
    // Dùng useEffect để navigate sau khi render
    React.useEffect(() => {
      navigate('/', { replace: true });
    }, [navigate]);
    return null;
  }

  // Render component tương ứng ngay lập tức
  // Các component này tự đọc params từ URL (searchParams) nên không cần truyền props phức tạp
  if (paymentStatus === 'success') {
    return <PaymentSuccessPage />;
  } else {
    return <PaymentFailedPage />;
  }
};

export default PaymentResultPage;
