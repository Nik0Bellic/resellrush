import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import countries from 'i18n-iso-countries';
import enLocate from 'i18n-iso-countries/langs/en.json';
import { saveShippingInfo, savePaymentMethod } from '../slices/orderSlice';
import Loader from '../components/Loader';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';

const ShippingScreen = () => {
  const dispatch = useDispatch();

  const order = useSelector((state) => state.order);
  const {
    orderItem,
    shippingInfo,
    purchasePrice,
    processingFee,
    shippingPrice,
    totalPrice,
  } = order;

  const [isPickup, setIsPickup] = useState(false);

  const [shippingService, setShippingService] = useState(
    shippingInfo?.shippingService || ''
  );
  const [firstName, setFirstName] = useState(shippingInfo?.firstName || '');
  const [lastName, setLastName] = useState(shippingInfo?.lastName || '');
  const [country, setCountry] = useState(shippingInfo?.country || '');
  const [city, setCity] = useState(shippingInfo?.city || '');
  const [region, setRegion] = useState(shippingInfo?.region || '');
  const [address, setAddress] = useState(shippingInfo?.address || '');
  const [postalCode, setPostalCode] = useState(shippingInfo?.postalCode || '');
  const [orderComments, setOrderComments] = useState(
    shippingInfo?.orderComments || ''
  );
  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const [noShippingService, setNoShippingService] = useState(false);
  const [noCountry, setNoCountry] = useState(false);
  const [noPaymentMethod, setNoPaymentMethod] = useState(false);

  const [selectOpen, setSelectOpen] = useState(false);

  // NEED CHANGING IN UI
  // countries.registerLocale(enLocate);

  // const countryObj = countries.getNames('en', { select: 'official' });

  // const countryArr = Object.entries(countryObj).map(([key, value]) => {
  //   return {
  //     label: value,
  //     value: key,
  //   };
  // });

  const countryArr = [
    {
      label: 'USA',
      value: 'US',
    },
    {
      label: 'Canada',
      value: 'CA',
    },
    {
      label: 'UK',
      value: 'UK',
    },
    {
      label: 'Australia',
      value: 'AU',
    },
    {
      label: 'Mexico',
      value: 'MX',
    },
  ];

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const [orderErr, setOrderErr] = useState('');

  const navigate = useNavigate();

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!shippingService) {
      setNoShippingService(true);
      setTimeout(() => setNoShippingService(false), 10000);
    } else if (!country) {
      setNoCountry(true);
      setTimeout(() => setNoCountry(false), 10000);
    } else if (!paymentMethod) {
      setNoPaymentMethod(true);
      setTimeout(() => setNoPaymentMethod(false), 10000);
    } else {
      dispatch(
        saveShippingInfo({
          shippingService,
          firstName,
          lastName,
          country,
          city,
          region,
          address,
          postalCode,
          orderComments,
        })
      );
      dispatch(savePaymentMethod(paymentMethod));

      try {
        const res = await createOrder({
          orderItem: orderItem,
          shippingInfo: shippingInfo,
          paymentMethod: paymentMethod,
          purchasePrice: purchasePrice,
          processingFee: processingFee,
          shippingPrice: shippingPrice,
          totalPrice: totalPrice,
        }).unwrap();
        navigate(`/order/${res._id}`);
      } catch (err) {
        setOrderErr(err);
        setTimeout(() => setOrderErr(false), 10000);
      }
    }
  };

  return (
    <>
      {!orderItem.size ? (
        <Navigate to={`/buy/${orderItem.productIdentifier}`} replace />
      ) : (
        <div className='container mx-auto px-6 md:max-w-3xl lg:max-w-6xl lg:px-28 xl:px-6'>
          <div className='flex justify-between my-8 lg:my-12'>
            <div>
              <div className='text-xl font-semibold'>{orderItem.name}</div>
              <div className='opacity-50'>{orderItem.color}</div>
            </div>
            <div className='flex flex-col'>
              <div className='opacity-50 text-sm text-right'>
                Selected Size:
              </div>
              <div className='font-bold text-3xl md:text-4xl'>
                US M {orderItem.size}
              </div>
            </div>
          </div>
          <div className='mt-10 grid grid-cols-2 gap-5 sm:gap-7 lg:gap-20'>
            <div className='mt-3 max-w-md'>
              <img
                src={orderItem.image}
                alt={orderItem.name + ' ' + orderItem.color}
              />
            </div>
            <div className='flex flex-col items-end w-full'>
              <form
                onSubmit={handleCheckout}
                className='flex flex-col space-y-4 w-full max-w-md'
              >
                <div className='flex justify-between border-2 border-black rounded-full relative h-12 md:h-[3.28rem] w-[13.5rem] sm:w-full md:text-lg lg:text-xl max-w-xs sm:mb-4'>
                  <input
                    type='radio'
                    id='shipping'
                    name='shippingType'
                    onClick={() => setIsPickup(false)}
                    className='peer hidden'
                  />
                  <label
                    htmlFor='shipping'
                    className={`cursor-pointer py-2.5 px-5 sm:px-8 md:px-10 absolute ${
                      !isPickup &&
                      'border-2 border-black bg-strongYellow rounded-full -ml-0.5 -mt-0.5'
                    }`}
                  >
                    Shipping
                  </label>
                  <input
                    type='radio'
                    id='pickup'
                    name='shippingType'
                    onClick={() => setIsPickup(true)}
                    className='peer hidden'
                  />
                  <label
                    htmlFor='pickup'
                    className={`cursor-pointer py-2.5 px-5 sm:px-8 md:px-10 absolute right-0 ${
                      isPickup &&
                      'border-2 border-black bg-strongYellow rounded-full -mr-0.5 -mt-0.5'
                    }`}
                  >
                    Pickup
                  </label>
                </div>
                {!isPickup ? (
                  <>
                    <div className='font-bold text-xl'>Shipping Info</div>
                    <div className='flex flex-col'>
                      {noShippingService && (
                        <Message
                          variant='Warning'
                          text='Please Select Service'
                          small={true}
                        />
                      )}
                      <div className='flex space-x-4 lg:space-x-6 lg:text-lg'>
                        <label className='inline-block relative cursor-pointer select-none peer pl-5 lg:pl-6'>
                          DHL
                          <input
                            type='radio'
                            name='service'
                            id='DHL'
                            checked={shippingService === 'DHL'}
                            onChange={(e) => setShippingService(e.target.id)}
                            className='absolute opacity-0 cursor-pointer h-0 w-0 peer'
                          />
                          <span className='absolute mt-1 top-0 left-0 h-4 w-4 lg:h-5 lg:w-5 border-2 border-black rounded-md peer-hover:border-strongYellow peer-checked:border-black peer-checked:bg-strongYellow'></span>
                        </label>
                        <label className='inline-block relative cursor-pointer select-none peer pl-5 lg:pl-6'>
                          UPS
                          <input
                            type='radio'
                            name='service'
                            id='UPS'
                            checked={shippingService === 'UPS'}
                            onChange={(e) => setShippingService(e.target.id)}
                            className='absolute opacity-0 cursor-pointer h-0 w-0 mt-1 peer'
                          />
                          <span className='absolute mt-1 top-0 left-0 h-4 w-4 lg:h-5 lg:w-5 border-2 border-black rounded-md peer-hover:border-strongYellow peer-checked:border-black peer-checked:bg-strongYellow'></span>
                        </label>
                        <label className='inline-block relative cursor-pointer select-none peer pl-5 lg:pl-6'>
                          FedEx
                          <input
                            type='radio'
                            name='service'
                            id='fedEx'
                            checked={shippingService === 'fedEx'}
                            onChange={(e) => setShippingService(e.target.id)}
                            className='absolute opacity-0 cursor-pointer h-0 w-0 peer'
                          />
                          <span className='absolute mt-1 top-0 left-0 h-4 w-4 lg:h-5 lg:w-5 border-2 border-black rounded-md peer-hover:border-strongYellow peer-checked:border-black peer-checked:bg-strongYellow'></span>
                        </label>
                      </div>
                    </div>

                    <div className='grid gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2'>
                      <input
                        type='text'
                        placeholder='First Name'
                        required={true}
                        onChange={(e) => setFirstName(e.target.value)}
                        value={firstName}
                        className='col-span-2 sm:col-span-1 border-b-2 border-black text-sm sm:text-base lg:text-lg pb-1 w-full focus:outline-none'
                      />
                      <input
                        type='text'
                        placeholder='Last Name'
                        required={true}
                        onChange={(e) => setLastName(e.target.value)}
                        value={lastName}
                        className='col-span-2 sm:col-span-1 border-b-2 border-black text-sm sm:text-base lg:text-lg pb-1 w-full focus:outline-none'
                      />
                      <div className='relative md:max-w-md w-full col-span-2'>
                        {noCountry && (
                          <Message
                            variant='Warning'
                            text='Please Select Country'
                            small={true}
                          />
                        )}
                        <button
                          type='button'
                          onClick={() => setSelectOpen((current) => !current)}
                          className='relative z-20 flex justify-between bg-white items-center border-2 border-black rounded-full py-2 px-3 sm:px-5 w-full text-sm sm:text-base lg:text-lg'
                        >
                          <div>Country</div>
                          <div className='flex font-semibold space-x-1 md:space-x-2 items-center'>
                            <div>{country}</div>
                            <div>
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                strokeWidth={2}
                                stroke='currentColor'
                                className='w-5 sm:w-6'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  d='M19.5 8.25l-7.5 7.5-7.5-7.5'
                                />
                              </svg>
                            </div>
                          </div>
                        </button>
                        {selectOpen && (
                          <div className='absolute w-full right-0 max-w-md z-10 bg-white border-2 border-black border-t-0 rounded-xl rounded-t-none p-4 pt-10 -mt-5 overflow-y-auto max-h-64'>
                            <ul className='flex flex-wrap justify-left gap-2 md:gap-3'>
                              {countryArr.map(({ label, value }) => {
                                return (
                                  <li key={value}>
                                    <input
                                      type='radio'
                                      id={`${value}`}
                                      name='country'
                                      required={true}
                                      onClick={() => setCountry(label)}
                                      className='peer hidden'
                                    />
                                    <label
                                      htmlFor={`${value}`}
                                      className={`inline-flex cursor-pointer text-sm md:text-base select-none items-center justify-center outline-none border-2 border-black rounded-full py-1.5 md:py-2 px-3 md:px-4 peer-hover:opacity-100 peer-hover:border-strongYellow peer-hover:scale-110 duration-200 ${
                                        country && country !== label
                                          ? 'opacity-50'
                                          : country === label &&
                                            'bg-strongYellow'
                                      }`}
                                    >
                                      {label}
                                    </label>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        )}
                      </div>
                      <input
                        type='text'
                        placeholder='City'
                        required={true}
                        onChange={(e) => setCity(e.target.value)}
                        value={city}
                        className='col-span-2 sm:col-span-1 border-b-2 border-black text-sm sm:text-base lg:text-lg pb-1 w-full focus:outline-none'
                      />
                      <input
                        type='text'
                        placeholder='Region'
                        required={true}
                        onChange={(e) => setRegion(e.target.value)}
                        value={region}
                        className='col-span-2 sm:col-span-1 border-b-2 border-black text-sm sm:text-base lg:text-lg pb-1 w-full focus:outline-none'
                      />
                      <input
                        type='text'
                        placeholder='Address'
                        required={true}
                        onChange={(e) => setAddress(e.target.value)}
                        value={address}
                        className='col-span-2 border-b-2 border-black text-sm sm:text-base lg:text-lg pb-1 w-full focus:outline-none'
                      />
                      <input
                        type='text'
                        placeholder='Postal Code'
                        required={true}
                        onChange={(e) => setPostalCode(e.target.value)}
                        value={postalCode}
                        className='col-span-2 sm:col-span-1 border-b-2 border-black text-sm sm:text-base lg:text-lg pb-1 w-full focus:outline-none'
                      />
                      <textarea
                        placeholder='Order Comments'
                        onChange={(e) => setOrderComments(e.target.value)}
                        value={orderComments}
                        rows='3'
                        className='col-span-2 border-2 rounded-md border-black text-sm sm:text-base lg:text-lg w-full p-1.5 focus:outline-none'
                      />
                    </div>
                  </>
                ) : (
                  <></>
                )}

                <div className='pt-2 lg:pt-3 flex flex-col space-y-3 lg:space-y-4 w-full sm:w-60 lg:w-72'>
                  <div className='flex justify-between items-center text-sm lg:text-lg border-b-2 border-black pb-1 mx-0.5'>
                    <div>Your Purchase Price:</div>
                    <div className='font-bold ml-2'>${purchasePrice}</div>
                  </div>
                  <div className='flex justify-between items-center text-sm lg:text-lg border-b-2 border-black pb-1 mx-0.5'>
                    <div>Processing Fee:</div>
                    <div className='font-bold ml-2'>${processingFee}</div>
                  </div>
                  <div className='flex justify-between items-center text-sm lg:text-lg border-b-2 border-black pb-1 mx-0.5'>
                    <div>Shipping:</div>
                    <div className='font-bold ml-2'>${shippingPrice}</div>
                  </div>
                  <div className='flex justify-between items-center text-sm lg:text-lg border-b-2 border-black pb-1 mx-0.5'>
                    <div>Total:</div>
                    <div className='font-bold ml-2'>${totalPrice}</div>
                  </div>
                </div>

                <div className='font-bold text-xl sm:mt-4'>Payment Method</div>
                <div className='flex flex-col'>
                  {noPaymentMethod && (
                    <Message
                      variant='Warning'
                      text='Please Select Method'
                      small={true}
                    />
                  )}
                  <div className='flex space-x-4 lg:space-x-6 lg:text-lg'>
                    <label className='inline-block relative cursor-pointer select-none peer pl-5 lg:pl-6'>
                      PayPal (and Credit Card)
                      <input
                        type='radio'
                        name='payment'
                        id='PayPal'
                        checked
                        onChange={(e) => setPaymentMethod(e.target.id)}
                        className='absolute opacity-0 cursor-pointer h-0 w-0 peer'
                      />
                      <span className='absolute mt-1 top-0 left-0 h-4 w-4 lg:h-5 lg:w-5 border-2 border-black rounded-md peer-hover:border-strongYellow peer-checked:border-black peer-checked:bg-strongYellow'></span>
                    </label>
                  </div>
                </div>

                {error && <Message variant='Error' text={error} small={true} />}

                {orderErr && (
                  <Message
                    variant='Error'
                    text={orderErr?.data?.message || orderErr.error}
                    small={true}
                  />
                )}

                <div className='pt-4 lg:pt-6 w-full flex justify-between sm:text-lg lg:text-xl'>
                  <Link
                    to={`/buy/${orderItem.productIdentifier}`}
                    className='border-2 border-black text-center px-4 sm:px-5 lg:px-8 xl:px-10 py-1.5 sm:py-2 xl:py-3 rounded-full hover:scale-110 hover:border-strongYellow active:bg-strongYellow active:border-black duration-200'
                  >
                    Back
                  </Link>
                  <button
                    role='link'
                    type='submit'
                    className='border-2 text-center px-4 sm:px-5 lg:px-8 xl:px-10 py-1.5 sm:py-2 xl:py-3 rounded-full hover:scale-110 border-strongYellow active:bg-strongYellow active:border-black duration-200'
                  >
                    Checkout
                  </button>
                </div>

                {isLoading && <Loader />}
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default ShippingScreen;
