import { useState } from 'react';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import Message from './Message';
import Loader from './Loader';
import OrderTable from './OrdersTable';

const Buying = () => {
  const [buyingType, setBuyingType] = useState('current');

  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  return (
    <>
      <div className='flex justify-between border-2 border-black rounded-full relative h-12 md:h-[3.28rem] w-full md:text-lg lg:text-xl'>
        <input
          type='radio'
          id='current'
          name='buyingType'
          onClick={() => setBuyingType('current')}
          className='peer hidden'
        />
        <label
          htmlFor='current'
          className={`cursor-pointer py-2.5 px-7 md:px-8 lg:px-10 absolute ${
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
          className={`cursor-pointer py-2.5 px-7 md:px-8 lg:px-10 absolute left-1/2 transform -translate-x-1/2 ${
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
          className={`cursor-pointer py-2.5 px-7 md:px-8 lg:px-10 absolute right-0 ${
            buyingType === 'history' &&
            'border-2 border-black bg-strongYellow rounded-full -mr-0.5 -mt-0.5'
          }`}
        >
          History
        </label>
      </div>
      {buyingType === 'pending' && (
        <>
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message
              varinat='Error'
              text={error?.data?.message || error.error}
            />
          ) : (
            <OrderTable orders={orders} />
          )}
        </>
      )}
    </>
  );
};
export default Buying;
