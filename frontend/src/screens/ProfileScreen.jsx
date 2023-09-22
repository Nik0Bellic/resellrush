import { useSelector } from 'react-redux';

const ProfileScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return <div>{userInfo.email}</div>;
};
export default ProfileScreen;
