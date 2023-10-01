import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthPopup from './components/AuthPopup';
import { logout } from './slices/authSlice';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const expirationTime = localStorage.getItem('expirationTime');
    if (expirationTime) {
      const currentTime = new Date().getTime();

      if (currentTime > expirationTime) {
        dispatch(logout());
      }
    }
  }, [dispatch]);

  return (
    <>
      <Header />
      <main className='pb-48 container mx-auto px-6 md:px-7 md:max-w-3xl lg:px-28 xl:px-6 lg:max-w-5xl xl:max-w-6xl'>
        <Outlet />
      </main>
      <Footer />
      <AuthPopup />
    </>
  );
};
export default App;
