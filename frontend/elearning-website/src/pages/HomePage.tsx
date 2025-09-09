import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Footer from '../components/Footer';

const FeaturedCourses = () => {
  return (
    <div className="py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Các khóa học nổi bật
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Placeholder Cards */}
          <div className="bg-white rounded-lg shadow-md p-4">Khóa học 1</div>
          <div className="bg-white rounded-lg shadow-md p-4">Khóa học 2</div>
          <div className="bg-white rounded-lg shadow-md p-4">Khóa học 3</div>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturedCourses />
        {/* Các section khác có thể thêm vào đây */}
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;