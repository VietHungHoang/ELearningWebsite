import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './lib/store';
import router from './routes';
import WebSocketProvider from './components/providers/WebSocketProvider';

export type AuthPage = 'login' | 'signup' | 'forgotPassword' | 'otpVerification' | 'createNewPassword';
export type AppPage = 'home' | 'findTutors' | 'tutorDetail' | 'findCourses' | 'courseDetail' | 'profileSettings' | 'favorites' | 'quizResult' | 'quizTaking' | 'inbox' | 'tutorDashboard' | 'courseTaking';
export type UserRole = 'Student' | 'Tutor' | 'Admin';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <WebSocketProvider>
        <RouterProvider router={router} />
      </WebSocketProvider>
    </Provider>
  );
}

export default App;
