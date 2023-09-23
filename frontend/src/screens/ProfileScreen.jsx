import { useState } from 'react';
import Profile from '../components/Profile';
import Buying from '../components/Buying';
import Selling from '../components/Selling';

const ProfileScreen = () => {
  const [accountPage, setAccountPage] = useState('profile');

  return (
    <>
      <div className='container mx-auto px-6 md:max-w-3xl lg:max-w-6xl lg:px-28 xl:px-6'>
        <div className='my-8 flex justify-between pb-4 border-b-2 border-black'>
          <input
            type='radio'
            id='profile'
            name='account'
            onClick={() => setAccountPage('profile')}
            className='peer hidden'
          />
          <label
            htmlFor='profile'
            className={`cursor-pointer py-1 px-6 sm:px-8 md:px-10 lg:text-lg rounded-full hover:border-2 hover:border-strongYellow hover:scale-110 duration-100 active:border-black active:bg-strongYellow ${
              accountPage === 'profile' && 'border-2 border-strongYellow'
            }`}
          >
            Profile
          </label>
          <input
            type='radio'
            id='buying'
            name='account'
            onClick={() => setAccountPage('buying')}
            className='peer hidden'
          />
          <label
            htmlFor='buying'
            className={`cursor-pointer py-1 px-6 sm:px-8 md:px-10 lg:text-lg rounded-full hover:border-2 hover:border-strongYellow hover:scale-110 duration-100 active:border-black active:bg-strongYellow ${
              accountPage === 'buying' && 'border-2 border-strongYellow'
            }`}
          >
            Buying
          </label>
          <input
            type='radio'
            id='selling'
            name='account'
            onClick={() => setAccountPage('selling')}
            className='peer hidden'
          />
          <label
            htmlFor='selling'
            className={`cursor-pointer py-1 px-6 sm:px-8 md:px-10 lg:text-lg rounded-full hover:border-2 hover:border-strongYellow hover:scale-110 duration-100 active:border-black active:bg-strongYellow ${
              accountPage === 'selling' && 'border-2 border-strongYellow'
            }`}
          >
            Selling
          </label>
        </div>

        {accountPage === 'profile' && <Profile />}
        {accountPage === 'buying' && <Buying />}
        {accountPage === 'selling' && <Selling />}
      </div>
    </>
  );
};
export default ProfileScreen;
