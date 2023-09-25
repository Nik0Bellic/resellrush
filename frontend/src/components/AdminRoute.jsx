import { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthModalActive } from '../slices/authSlice';

const AdminRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userInfo) {
      dispatch(setAuthModalActive(true));
    }
  }, [userInfo, dispatch]);

  if (userInfo && userInfo.isAdmin) {
    return <Outlet />;
  } else {
    return <Navigate to='/' replace />;
  }
};

export default AdminRoute;
