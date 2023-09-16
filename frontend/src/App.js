import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthPopup from './components/AuthPopup';

const App = () => {
  return (
    <>
      <Header />
      <main className='pb-48'>
        <Outlet />
      </main>
      <Footer />
      <AuthPopup />
      <ToastContainer />
    </>
  );
};
export default App;
