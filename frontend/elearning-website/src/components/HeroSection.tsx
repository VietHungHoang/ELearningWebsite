const HeroSection = () => {
  return (
    <div className="bg-blue-50">
      <div className="container mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
          Học theo cách của bạn.
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Khám phá hàng ngàn khóa học từ các chuyên gia hàng đầu. Bắt đầu hành trình kiến thức của bạn ngay hôm nay.
        </p>
        <button className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-transform duration-300">
          Bắt đầu học
        </button>
      </div>
    </div>
  );
};

export default HeroSection;