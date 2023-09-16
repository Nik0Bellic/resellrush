import { Outlet, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthModalActive } from '../slices/authSlice';

const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  if (userInfo) {
    return <Outlet />;
  } else {
    dispatch(setAuthModalActive(true));
    return <Navigate to='/' replace />;
  }
};

export default PrivateRoute;
