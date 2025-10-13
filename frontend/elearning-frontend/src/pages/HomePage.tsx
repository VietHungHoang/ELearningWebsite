import Layout from '../components/Layout';
import { Hero, Categories, Courses, About, Testimonial, Team, Newsletter } from '../components/home';

const HomePage = () => {
  return (
    <Layout>
      <Hero />
      <Categories />
      <Courses />
      <About />
      <Testimonial />
      <Team />
      <Newsletter />
      <div>
        {/* Additional home page sections will be added later */}
      </div>
    </Layout>
  );
};

export default HomePage;