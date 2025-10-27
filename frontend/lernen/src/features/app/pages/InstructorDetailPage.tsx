import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../../components/ui/Layout';
import Breadcrumb from '../../../components/ui/Breadcrumb';

const InstructorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <Breadcrumb paths={[
          { name: 'Home', path: '/' },
          { name: 'Instructors', path: '/findCourses' },
          { name: `Instructor ${id}`, path: `/instructor-detail/${id}` }
        ]} />
        <div className="bg-white p-8 rounded-xl shadow-sm">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Instructor Detail Page</h1>
          <p className="text-gray-600">Instructor ID: <span className="font-semibold">{id}</span></p>
          <p className="text-gray-500 mt-4">This page is under development. Instructor details will be displayed here.</p>
        </div>
      </div>
    </Layout>
  );
};

export default InstructorDetailPage;