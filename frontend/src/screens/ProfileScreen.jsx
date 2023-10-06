import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useProfileMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { FiEdit } from 'react-icons/fi';
import { AiOutlineCheck } from 'react-icons/ai';
import { VscError } from 'react-icons/vsc';

const ProfileScreen = () => {
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
        shippingInfo: userInfo.shippingInfo,
        payMethod: userInfo.payMethod,
        isSeller: userInfo.isSeller,
        isAdmin: userInfo.isAdmin,
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
      <div className='my-8 lg:my-10 flex justify-between pb-4 border-b-2 border-black'>
        <Link
          to='/profile'
          className='cursor-pointer py-1 px-6 sm:px-8 md:px-10 lg:text-lg rounded-full border-2 border-strongYellow hover:scale-110 duration-100'
        >
          Profile
        </Link>
        <Link
          to='/profile/buying'
          className='cursor-pointer py-1 px-6 sm:px-8 md:px-10 lg:text-lg rounded-full border-2 border-black hover:border-strongYellow hover:scale-110 duration-100'
        >
          Buying
        </Link>
        <Link
          to='/profile/selling'
          className='cursor-pointer py-1 px-6 sm:px-8 md:px-10 lg:text-lg rounded-full border-2 border-black hover:border-strongYellow hover:scale-110 duration-100'
        >
          Selling
        </Link>
      </div>

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
            type='email'
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
        {userInfo.isSeller ? (
          <div className='w-min mt-2 flex items-center border-2 border-[#1ba97c] rounded-full py-2 px-5 bg-[#1ba97c] bg-opacity-20 text-xl'>
            <AiOutlineCheck
              className='mr-2'
              color='#1ba97c'
              strokeWidth='150'
            />
            <div className='text-[#1ba97c] font-semibold'>Seller</div>
          </div>
        ) : (
          <div className='mt-10 flex space-x-5 col-span-2 md:col-span-3'>
            <div className='w-min h-min flex items-center border-2 border-[#ff5757] rounded-full py-2 px-5 bg-[#ff5757] bg-opacity-20 text-lg'>
              <VscError color='#ff5757' strokeWidth='0.4' className='mr-2' />
              <div className='text-[#ff5757] font-semibold whitespace-nowrap'>
                Not Seller
              </div>
            </div>
            <div>
              To activate selling on Resell Rush, please{' '}
              <a
                href={`mailto:resellrush@outlook.com?Subject=Seller Verification ${userInfo.firstName} ${userInfo.lastName}`}
                className='text-strongYellow'
              >
                send us
              </a>{' '}
              a photo of your passport, ensuring the name matches the one listed
              in your Resell Rush profile. Additionally, provide your card
              number for payouts. Ensure that the email is sent from the address
              associated with your Resell Rush account.
            </div>
          </div>
        )}
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
export default ProfileScreen;
