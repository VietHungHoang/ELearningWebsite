import React from 'react';
import AuthLayout from '../components/AuthLayout';
import {LernenLogo} from '../../../components/LernenLogo';
import {HiCheckCircle} from 'react-icons/hi';

const TutorOnboardingCompletionPage: React.FC = () => {
    return (
        <>
            <div className="absolute top-0 left-0 px-4 sm:px-6 lg:px-8 py-4 z-10">
                <LernenLogo/>
            </div>

            <AuthLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="max-w-4xl w-full px-4 sm:px-6 lg:px-8 py-8">
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            {/* Success Banner */}
                            <div className="bg-gradient-to-r from-[#0b6459] to-[#084c43] px-8 py-12">
                                <div className="text-center">
                                    <div
                                        className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm mb-4">
                                        <HiCheckCircle className="w-10 h-10 text-white"/>
                                    </div>
                                    <h2 className="text-3xl font-bold text-white mb-2">Yêu cầu đã được gửi!</h2>
                                    <p className="text-white/90 text-lg">Cảm ơn bạn đã hoàn thành quá trình đăng ký</p>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="px-8 py-8">
                                <div className="max-w-2xl mx-auto space-y-6">
                                    {/* Main Message */}
                                    <div className="text-center">
                                        <p className="text-gray-700 text-lg leading-relaxed">
                                            Chúng tôi đã nhận được yêu cầu của bạn. Đội ngũ của chúng tôi sẽ xem xét và
                                            phản hồi lại trong vòng <span className="font-semibold text-[#0b6459]">48 giờ</span>.
                                        </p>
                                        <p className="text-gray-500 mt-3">
                                            Bạn sẽ nhận được thông báo qua email khi hồ sơ của bạn được duyệt.
                                        </p>
                                    </div>

                                    {/* Next Steps */}
                                    <div className="border-t border-gray-200 pt-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Các bước
                                            tiếp theo</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="text-center p-4">
                                                <div
                                                    className="w-10 h-10 bg-[#0b6459] rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <span className="text-white font-bold">1</span>
                                                </div>
                                                <h4 className="font-medium text-gray-900 mb-1">Xem xét hồ sơ</h4>
                                                <p className="text-sm text-gray-600">Đội ngũ sẽ kiểm tra thông tin của
                                                    bạn</p>
                                            </div>
                                            <div className="text-center p-4">
                                                <div
                                                    className="w-10 h-10 bg-[#0b6459] rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <span className="text-white font-bold">2</span>
                                                </div>
                                                <h4 className="font-medium text-gray-900 mb-1">Phê duyệt</h4>
                                                <p className="text-sm text-gray-600">Nhận email thông báo kết quả</p>
                                            </div>
                                            <div className="text-center p-4">
                                                <div
                                                    className="w-10 h-10 bg-[#0b6459] rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <span className="text-white font-bold">3</span>
                                                </div>
                                                <h4 className="font-medium text-gray-900 mb-1">Bắt đầu dạy</h4>
                                                <p className="text-sm text-gray-600">Bắt đầu nhận lớp và dạy học</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Support Info */}
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600">
                                            Nếu bạn có bất kì câu hỏi nào, vui lòng liên hệ với chúng tôi qua email <a
                                            href="mailto:support@lernen.com"
                                            className="text-[#0b6459] hover:underline">support@lernen.com</a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthLayout>
        </>
    );
};

export default TutorOnboardingCompletionPage;
