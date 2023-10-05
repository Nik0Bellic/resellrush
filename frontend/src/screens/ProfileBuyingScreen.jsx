import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Message from '../components/Message';
import PendingUserBidsTable from '../components/PendingUserBidsTable';
import CurrentUserBidsTable from '../components/CurrentUserBidsTable';
import HistoryUserBidsTable from '../components/HistoryUserBidsTable';

const Buying = () => {
  const [selectedSum, setSelectedSum] = useState(0);

  const navigate = useNavigate();

  const location = useLocation();
  const message = location.state?.message;

  const [buyingType, setBuyingType] = useState(
    location.state?.type || 'current'
  );

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        navigate('.', { state: {} });
      }, 10000);
    }
  }, [message, navigate]);

  return (
    <>
      {message && <Message variant='Success' text={message} />}

      <div className='my-8 lg:my-10 flex justify-between pb-4 border-b-2 border-black'>
        <Link
          to='/profile'
          className='cursor-pointer py-1 px-6 sm:px-8 md:px-10 lg:text-lg rounded-full border-2 border-black hover:border-strongYellow hover:scale-110 duration-100'
        >
          Profile
        </Link>
        <Link
          to='/profile/buying'
          className='cursor-pointer py-1 px-6 sm:px-8 md:px-10 lg:text-lg rounded-full border-2 border-strongYellow hover:scale-110 duration-100'
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

      <div className='grid grid-cols-12 gap-1 sm:gap-5'>
        <div className='col-span-7 xl:col-span-6 flex justify-between border-2 border-black rounded-full relative h-11 sm:h-12 md:h-[3.28rem] xl:h-14 w-full text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl'>
          <input
            type='radio'
            id='current'
            name='buyingType'
            onClick={() => setBuyingType('current')}
            className='peer hidden'
          />
          <label
            htmlFor='current'
            className={`cursor-pointer py-2.5 px-4 sm:px-6 md:px-8 lg:px-10 absolute ${
              buyingType === 'current' &&
              'border-2 border-black bg-strongYellow rounded-full -ml-0.5 -mt-0.5'
            }`}
          >
            Current
          </label>
          <input
            type='radio'
            id='pending'
            name='buyingType'
            onClick={() => setBuyingType('pending')}
            className='peer hidden'
          />
          <label
            htmlFor='pending'
            className={`cursor-pointer py-2.5 px-4 sm:px-6 md:px-8 lg:px-10 absolute left-1/2 transform -translate-x-1/2 ${
              buyingType === 'pending' &&
              'border-2 border-black bg-strongYellow rounded-full -mr-0.5 -mt-0.5'
            }`}
          >
            Pending
          </label>
          <input
            type='radio'
            id='history'
            name='buyingType'
            onClick={() => setBuyingType('history')}
            className='peer hidden'
          />
          <label
            htmlFor='history'
            className={`cursor-pointer py-2.5 px-4 sm:px-6 md:px-8 lg:px-10 absolute right-0 ${
              buyingType === 'history' &&
              'border-2 border-black bg-strongYellow rounded-full -mr-0.5 -mt-0.5'
            }`}
          >
            History
          </label>
        </div>
        {buyingType !== 'pending' && (
          <div className='col-span-5 xl:col-span-6 xl:justify-self-end flex items-center border-2 border-black rounded-full text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl'>
            <div className='px-1.5 sm:px-3 md:px-4 lg:px-5 py-3 lg:py-[0.63rem] whitespace-nowrap'>
              Sum of selected bids
            </div>
            <div className='flex justify-center pr-1 sm:pr-2 py-3 lg:py-[0.63rem] xl:px-5 text-md w-full border-l-2 border-black rounded-full rounded-l-none font-semibold'>
              ${selectedSum}
            </div>
          </div>
        )}
      </div>
      {buyingType === 'current' ? (
        <CurrentUserBidsTable setSelectedSum={setSelectedSum} />
      ) : buyingType === 'pending' ? (
        <PendingUserBidsTable />
      ) : (
        buyingType === 'history' && (
          <HistoryUserBidsTable setSelectedSum={setSelectedSum} />
        )
      )}
    </>
  );
};
export default Buying;
