import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useProfileMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { FiEdit } from 'react-icons/fi';

const Profile = () => {
  const [changeEnabled, setChangeEnabled] = useState(false);

  const [variant, setVariant] = useState('');
  const [message, setMessage] = useState('');

  const [isChanged, setIsChanged] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const dispatch = useDispatch();

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    setIsChanged(false);
  }, [userInfo]);

  useEffect(() => {
    if (userInfo) {
      if (
        userInfo.firstName !== firstName ||
        userInfo.lastName !== lastName ||
        userInfo.email !== email
      ) {
        setIsChanged(true);
      } else {
        setIsChanged(false);
      }
    }
  }, [firstName, lastName, email, userInfo]);

  useEffect(() => {
    if (userInfo) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setEmail(userInfo.email);
    }
  }, [userInfo, userInfo.firstName, userInfo.lastName, userInfo.email]);

  const handleChange = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile({
        _id: userInfo._id,
        firstName,
        lastName,
        email,
      }).unwrap();
      dispatch(setCredentials(res));
      setChangeEnabled(false);
      setVariant('Success');
      setMessage('Profile updated successfully');
      setTimeout(() => {
        setVariant('');
        setMessage('');
      }, 10000);
    } catch (err) {
      setVariant('Error');
      setMessage(err?.data?.message || err.error);
      setTimeout(() => {
        setVariant('');
        setMessage('');
      }, 10000);
    }
  };

  return (
    <>
      <div className='-mx-6 lg:-mx-28 xl:-mx-6'>
        {message && <Message variant={variant} text={message} />}
      </div>

      <div className='flex justify-between items-center'>
        <div className='font-bold text-xl sm:text-2xl lg:text-3xl'>
          Personal Information
        </div>
        <button onClick={() => setChangeEnabled((cur) => !cur)}>
          <FiEdit
            className='text-xl sm:text-2xl lg:text-3xl'
            color={changeEnabled ? '#FFC700' : 'black'}
          />
        </button>
      </div>
      <div className='mt-5 grid gap-3 sm:gap-4 md:gap-5 grid-cols-2 xl:grid-cols-3'>
        <div>
          <div className='font-medium opacity-25 text-xs'>First Name</div>
          <input
            type='text'
            placeholder='First Name'
            required={true}
            disabled={!changeEnabled}
            onChange={(e) => setFirstName(e.target.value)}
            value={firstName}
            className={`text-sm sm:text-base lg:text-lg font-medium pb-1 w-full focus:outline-none disabled:bg-transparent ${
              changeEnabled && 'border-b-2 border-black font-normal'
            }`}
          />
        </div>
        <div>
          <div className='font-medium opacity-25 text-xs'>Last Name</div>
          <input
            type='text'
            placeholder='Last Name'
            required={true}
            disabled={!changeEnabled}
            onChange={(e) => setLastName(e.target.value)}
            value={lastName}
            className={`text-sm sm:text-base lg:text-lg font-medium pb-1 w-full focus:outline-none disabled:bg-transparent ${
              changeEnabled && 'border-b-2 border-black font-normal'
            }`}
          />
        </div>
        <div className={`${!changeEnabled && 'col-span-2'} xl:col-span-1`}>
          <div className='font-medium opacity-25 text-xs'>Email</div>
          <input
            type='text'
            placeholder='Email'
            required={true}
            disabled={!changeEnabled}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className={`text-sm sm:text-base lg:text-lg font-medium pb-1 w-full focus:outline-none disabled:bg-transparent ${
              changeEnabled && 'border-b-2 border-black font-normal'
            }`}
          />
        </div>
      </div>
      <button
        onClick={handleChange}
        className={`mt-7 border-2 border-black text-center px-4 lg:px-6 py-3 sm:py-2 rounded-full hover:scale-110 hover:border-strongYellow active:bg-strongYellow active:border-black duration-200 ${
          !isChanged ? 'hidden' : ''
        }`}
      >
        Save Changes
      </button>
      {loadingUpdateProfile && <Loader />}
    </>
  );
};
export default Profile;
