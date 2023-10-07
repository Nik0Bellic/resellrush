import { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
// import countries from 'i18n-iso-countries';
// import enLocate from 'i18n-iso-countries/langs/en.json';
import {
  useUpdateShippingInfoMutation,
  useUpdatePayMethodMutation,
} from '../slices/usersApiSlice';
import {
  usePlaceBidMutation,
  usePurchaseNowMutation,
  useGetPayPalClientIdQuery,
} from '../slices/productsApiSlice';
import { setCredentials } from '../slices/authSlice';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

const PlaceBidScreen = () => {
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const bid = useSelector((state) => state.bid);
  const {
    buyItem,
    seller,
    askId,
    size,
    type,
    expiration,
    bidPrice,
    processingFee,
    shippingFee,
    totalPrice,
  } = bid;

  const [updateShippingInfo] = useUpdateShippingInfoMutation();
  const [updatePayMethod] = useUpdatePayMethodMutation();

  // const [isPickup, setIsPickup] = useState(false);

  const [shippingService, setShippingService] = useState(
    userInfo.shippingInfo?.shippingService || ''
  );
  const [firstName, setFirstName] = useState(
    userInfo.shippingInfo?.firstName || ''
  );
  const [lastName, setLastName] = useState(
    userInfo.shippingInfo?.lastName || ''
  );
  const [country, setCountry] = useState(userInfo.shippingInfo?.country || '');
  const [city, setCity] = useState(userInfo.shippingInfo?.city || '');
  const [region, setRegion] = useState(userInfo.shippingInfo?.region || '');
  const [address, setAddress] = useState(userInfo.shippingInfo?.address || '');
  const [postalCode, setPostalCode] = useState(
    userInfo.shippingInfo?.postalCode || ''
  );
  const [bidComments, setBidComments] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(
    userInfo.payMethod || 'PayPal'
  );

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

  const [confirmed, setConfirmed] = useState(false);

  const [placeBid, { isLoading, error }] = usePlaceBidMutation();
  // const [purchaseNow, { isLoading: loadingPurchase, error: errorPurchase }] =
  //   usePurchaseNowMutation();
  const [purchaseNow] = usePurchaseNowMutation();
  const [placeBidError, setPlaceBidError] = useState('');

  const [showPayPalButton, setShowPayPalButton] = useState(false);

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPaypal,
  } = useGetPayPalClientIdQuery();

  const navigate = useNavigate();

  const handleCheckout = async (e) => {
    e.preventDefault();

    // Check for missing details
    if (!shippingService) {
      setNoShippingService(true);
      setTimeout(() => setNoShippingService(false), 10000);
      return;
    }
    if (!country) {
      setNoCountry(true);
      setTimeout(() => setNoCountry(false), 10000);
      return;
    }
    if (!paymentMethod) {
      setNoPaymentMethod(true);
      setTimeout(() => setNoPaymentMethod(false), 10000);
      return;
    }

    // Update user's shipping and payment details if they have changed
    const shippingInfo = {
      shippingService,
      firstName,
      lastName,
      country,
      city,
      region,
      address,
      postalCode,
    };

    if (
      shippingInfo !== userInfo.shippingInfo ||
      paymentMethod !== userInfo.payMethod
    ) {
      const updatedUserInfo = {
        _id: userInfo._id,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        email: userInfo.email,
        shippingInfo,
        payMethod: paymentMethod,
        isSeller: userInfo.isSeller,
        isAdmin: userInfo.isAdmin,
      };
      dispatch(setCredentials(updatedUserInfo));

      if (shippingInfo !== userInfo.shippingInfo) {
        updateShippingInfo(shippingInfo);
      }
      if (paymentMethod !== userInfo.payMethod) {
        updatePayMethod({ payMethod: paymentMethod });
      }
    }

    // If all checks pass, display the PayPal button
    // This can be done by setting a state variable to show/hide the PayPal button
    setConfirmed(true);
    setShowPayPalButton(true);
  };

  function onApprove(data, actions) {
    return actions.order
      .capture()
      .then(async function (details) {
        // Check if the payment capture was successful
        if (details && details.status === 'COMPLETED') {
          // Once payment is captured, place the bid
          try {
            const shippingInfo = {
              shippingService,
              firstName,
              lastName,
              country,
              city,
              region,
              address,
              postalCode,
            };

            // Pass the PayPal transaction ID to the placeBid function
            if (type === 'bid') {
              await placeBid({
                buyItem,
                buyer: userInfo,
                size: size.replace('.', ','),
                bidPrice,
                expiration,
                shippingInfo,
                paymentMethod,
                paypalTransactionId: details.id,
              });

              navigate('/profile/buying', {
                state: { message: 'Bid placed successfully!' },
              });
            } else if (type === 'purchase') {
              await purchaseNow({
                buyItem,
                buyer: userInfo,
                seller,
                askId,
                size: size.replace('.', ','),
                purchasePrice: bidPrice,
                shippingInfo,
                paymentMethod,
                paypalTransactionId: details.id,
              });
              navigate('/profile/buying', {
                state: {
                  message: 'Purchase made successfully!',
                  type: 'pending',
                },
              });
            }
          } catch (err) {
            setPlaceBidError(err?.data?.message || err.error);
            setTimeout(() => setPlaceBidError(false), 10000);
          }
        } else {
          // Handle the scenario where payment capture was not successful
          setPlaceBidError(
            'Payment capture was not successful. Please try again.'
          );
          setTimeout(() => setPlaceBidError(false), 10000);
        }
      })
      .catch((error) => {
        // Handle any errors from the actions.order.capture() method
        setPlaceBidError(error.message || 'Error capturing payment.');
        setTimeout(() => setPlaceBidError(false), 10000);
      });
  }

  function onError(err) {
    console.error(err);
    setPlaceBidError('Payment failed. Please try again.');
  }

  function createOrder(data, actions) {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: totalPrice, // Ensure this is the total price you want to charge
          },
        },
      ],
    });
  }

  useEffect(() => {
    if (!errorPaypal && !loadingPayPal && paypal.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': paypal.clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      if (!window.paypal) {
        loadPayPalScript();
      }
    }
  }, [paypal, paypalDispatch, loadingPayPal, errorPaypal]);

  return (
    <>
      {!size || !type ? (
        <Navigate to={`/buy/${buyItem.productIdentifier}`} replace />
      ) : (
        <>
          <div className='flex justify-between my-8 lg:my-12'>
            <div>
              <div className='text-xl font-semibold'>{buyItem.name}</div>
              <div className='opacity-50'>{buyItem.color}</div>
            </div>
            <div className='flex flex-col'>
              <div className='opacity-50 text-sm text-right'>
                Selected Size:
              </div>
              <div className='font-bold text-3xl md:text-4xl'>US M {size}</div>
            </div>
          </div>
          <div className='mt-10 grid grid-cols-2 gap-5 sm:gap-7 lg:gap-20'>
            <div className='mt-3 max-w-md'>
              <img
                src={buyItem.image}
                alt={buyItem.name + ' ' + buyItem.color}
              />
            </div>
            <div className='flex flex-col items-end w-full'>
              <form
                onSubmit={handleCheckout}
                className='flex flex-col space-y-4 w-full max-w-md'
              >
                {/* <div className='flex justify-between border-2 border-black rounded-full relative h-12 md:h-[3.28rem] w-[13.5rem] sm:w-full md:text-lg lg:text-xl max-w-xs sm:mb-4'>
                  <input
                    type='radio'
                    id='shipping'
                    name='shippingType'
                    onClick={() => setIsPickup(false)}
                    disabled={confirmed}
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
                    disabled={confirmed}
                    className='peer hidden'
                  />
                  <label
                    htmlFor='pickup'
                    className={`cursor-pointer py-2.5 px-5 sm:px-8 md:px-10 absolute right-0 ${
                      isPickup &&
                      'border-2 border-black bg-strongYellow rounded-full -mr-0.5 -mt-0.5'
                    }`}
                  >
                    In-Person
                  </label>
                </div> */}
                {/* {!isPickup ? ( */}
                <>
                  <div className='font-bold text-xl'>Shipping Info</div>
                  <div className='flex flex-col'>
                    {noShippingService && (
                      <Message
                        variant='Warning'
                        text='Please Select Service'
                        small={true}
                        noLabel={true}
                      />
                    )}
                    {!confirmed ? (
                      <div className='flex space-x-4 lg:space-x-6 lg:text-lg'>
                        <label className='inline-block relative cursor-pointer select-none peer pl-5 lg:pl-6'>
                          DHL
                          <input
                            type='radio'
                            name='service'
                            id='DHL'
                            checked={shippingService === 'DHL'}
                            disabled={confirmed}
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
                            disabled={confirmed}
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
                            disabled={confirmed}
                            onChange={(e) => setShippingService(e.target.id)}
                            className='absolute opacity-0 cursor-pointer h-0 w-0 peer'
                          />
                          <span className='absolute mt-1 top-0 left-0 h-4 w-4 lg:h-5 lg:w-5 border-2 border-black rounded-md peer-hover:border-strongYellow peer-checked:border-black peer-checked:bg-strongYellow'></span>
                        </label>
                      </div>
                    ) : (
                      <div className='col-span-2'>
                        <div className='font-medium opacity-25 text-xs'>
                          Shipping Service
                        </div>
                        <div
                          className={`border-b-2 border-black text-sm sm:text-base lg:text-lg pb-1 w-full focus:outline-none ${
                            confirmed && 'border-none bg-transparent'
                          }`}
                        >
                          {shippingService}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className='grid gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2'>
                    <div className='col-span-2 sm:col-span-1'>
                      {confirmed && (
                        <div className='font-medium opacity-25 text-xs'>
                          First Name
                        </div>
                      )}
                      <input
                        type='text'
                        placeholder='First Name'
                        required={true}
                        onChange={(e) => setFirstName(e.target.value)}
                        value={firstName}
                        disabled={confirmed}
                        className={`border-b-2 border-black text-sm sm:text-base lg:text-lg pb-1 w-full focus:outline-none ${
                          confirmed && 'border-none bg-transparent'
                        }`}
                      />
                    </div>
                    <div className='col-span-2 sm:col-span-1'>
                      {confirmed && (
                        <div className='font-medium opacity-25 text-xs'>
                          Last Name
                        </div>
                      )}
                      <input
                        type='text'
                        placeholder='Last Name'
                        required={true}
                        onChange={(e) => setLastName(e.target.value)}
                        value={lastName}
                        disabled={confirmed}
                        className={`col-span-2 sm:col-span-1 border-b-2 border-black text-sm sm:text-base lg:text-lg pb-1 w-full focus:outline-none ${
                          confirmed && 'border-none bg-transparent'
                        }`}
                      />
                    </div>
                    {!confirmed ? (
                      <div className='relative md:max-w-md w-full col-span-2'>
                        {noCountry && (
                          <Message
                            variant='Warning'
                            text='Please Select Country'
                            small={true}
                            noLabel={true}
                          />
                        )}
                        <button
                          type='button'
                          disabled={confirmed}
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
                                      onClick={() => {
                                        setCountry(label);
                                        setSelectOpen((current) => !current);
                                      }}
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
                    ) : (
                      <div className='col-span-2'>
                        <div className='font-medium opacity-25 text-xs'>
                          Country
                        </div>
                        <div
                          className={`border-b-2 border-black text-sm sm:text-base lg:text-lg pb-1 w-full focus:outline-none ${
                            confirmed && 'border-none bg-transparent'
                          }`}
                        >
                          {country}
                        </div>
                      </div>
                    )}
                    <div className='col-span-2 sm:col-span-1'>
                      {confirmed && (
                        <div className='font-medium opacity-25 text-xs'>
                          City
                        </div>
                      )}
                      <input
                        type='text'
                        placeholder='City'
                        required={true}
                        disabled={confirmed}
                        onChange={(e) => setCity(e.target.value)}
                        value={city}
                        className={`border-b-2 border-black text-sm sm:text-base lg:text-lg pb-1 w-full focus:outline-none ${
                          confirmed && 'border-none bg-transparent'
                        }`}
                      />
                    </div>
                    <div className='col-span-2 sm:col-span-1'>
                      {confirmed && (
                        <div className='font-medium opacity-25 text-xs'>
                          Region
                        </div>
                      )}
                      <input
                        type='text'
                        placeholder='Region'
                        required={true}
                        disabled={confirmed}
                        onChange={(e) => setRegion(e.target.value)}
                        value={region}
                        className={`border-b-2 border-black text-sm sm:text-base lg:text-lg pb-1 w-full focus:outline-none ${
                          confirmed && 'border-none bg-transparent'
                        }`}
                      />
                    </div>
                    <div className='col-span-2'>
                      {confirmed && (
                        <div className='font-medium opacity-25 text-xs'>
                          Address
                        </div>
                      )}
                      <input
                        type='text'
                        placeholder='Address'
                        required={true}
                        disabled={confirmed}
                        onChange={(e) => setAddress(e.target.value)}
                        value={address}
                        className={`col-span-2 border-b-2 border-black text-sm sm:text-base lg:text-lg pb-1 w-full focus:outline-none ${
                          confirmed && 'border-none bg-transparent'
                        }`}
                      />
                    </div>
                    <div className='col-span-2 sm:col-span-1'>
                      {confirmed && (
                        <div className='font-medium opacity-25 text-xs'>
                          Postal Code
                        </div>
                      )}
                      <input
                        type='text'
                        placeholder='Postal Code'
                        required={true}
                        disabled={confirmed}
                        onChange={(e) => setPostalCode(e.target.value)}
                        value={postalCode}
                        className={`border-b-2 border-black text-sm sm:text-base lg:text-lg pb-1 w-full focus:outline-none ${
                          confirmed && 'border-none bg-transparent'
                        }`}
                      />
                    </div>
                    <div className='col-span-2'>
                      {confirmed && (
                        <div className='font-medium opacity-25 text-xs mb-1'>
                          Comments
                        </div>
                      )}
                      <textarea
                        placeholder='Comments'
                        disabled={confirmed}
                        onChange={(e) => setBidComments(e.target.value)}
                        value={bidComments}
                        rows='3'
                        className='border-2 rounded-md border-black text-sm sm:text-base lg:text-lg w-full p-1.5 focus:outline-none'
                      />
                    </div>
                  </div>
                </>
                {/* ) : (
                  <></>
                )} */}

                <div className='pt-2 lg:pt-3 flex flex-col space-y-3 lg:space-y-4 w-full sm:w-60 lg:w-72'>
                  <div className='flex justify-between items-center text-sm lg:text-lg border-b-2 border-black pb-1 mx-0.5'>
                    <div>Your Purchase Price:</div>
                    <div className='font-bold ml-2'>${bidPrice.toFixed(2)}</div>
                  </div>
                  <div className='flex justify-between items-center text-sm lg:text-lg border-b-2 border-black pb-1 mx-0.5'>
                    <div>Processing Fee:</div>
                    <div className='font-bold ml-2'>${processingFee}</div>
                  </div>
                  <div className='flex justify-between items-center text-sm lg:text-lg border-b-2 border-black pb-1 mx-0.5'>
                    <div>Shipping:</div>
                    <div className='font-bold ml-2'>${shippingFee}</div>
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
                      noLabel={true}
                    />
                  )}
                  {!confirmed ? (
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
                  ) : (
                    <div className='col-span-2'>
                      <div className='font-medium opacity-25 text-xs'>
                        Payment Method
                      </div>
                      <div
                        className={`border-b-2 border-black text-sm sm:text-base lg:text-lg pb-1 w-full focus:outline-none ${
                          confirmed && 'border-none bg-transparent'
                        }`}
                      >
                        {paymentMethod}
                      </div>
                    </div>
                  )}
                </div>

                {error && (
                  <Message
                    variant='Error'
                    text={error?.data?.message || error.error}
                    small={true}
                  />
                )}

                {placeBidError && (
                  <Message variant='Error' text={placeBidError} small={true} />
                )}

                {/* {loadingPay && <Loader />} */}

                {isPending ? (
                  <Loader />
                ) : (
                  <>
                    {confirmed && type === 'bid' && (
                      <div className='text-center border-2 border-strongYellow rounded-lg font-bold p-3'>
                        Your bid will be placed after payment
                      </div>
                    )}
                    {confirmed && type === 'purchase' && (
                      <div className='text-center border-2 border-strongYellow rounded-lg font-bold p-3'>
                        Your order will be created after payment
                      </div>
                    )}
                    {showPayPalButton && (
                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                      ></PayPalButtons>
                    )}
                  </>
                )}

                <div
                  className={`w-full flex justify-between sm:text-lg lg:text-xl ${
                    !confirmed && 'pt-4 lg:pt-6'
                  }`}
                >
                  <Link
                    to={`/sell/${buyItem.productIdentifier}`}
                    className='border-2 border-black text-center px-3 sm:px-5 lg:px-8 xl:px-10 py-1.5 sm:py-2 xl:py-3 rounded-full hover:scale-110 hover:border-strongYellow active:bg-strongYellow active:border-black duration-200'
                  >
                    Go Back
                  </Link>
                  {!confirmed && (
                    <button
                      disabled={isLoading}
                      role='link'
                      type='submit'
                      className='border-2 text-center px-3 sm:px-5 lg:px-8 xl:px-10 py-1.5 sm:py-2 xl:py-3 rounded-full hover:scale-110 border-strongYellow active:bg-strongYellow active:border-black duration-200'
                    >
                      Confirm
                    </button>
                  )}
                  {confirmed && (
                    <button
                      type='button'
                      onClick={() => {
                        setShowPayPalButton(false);
                        setConfirmed(false);
                      }}
                      className='border-2 text-center px-3 sm:px-5 lg:px-8 xl:px-10 py-1.5 sm:py-2 xl:py-3 rounded-full hover:scale-110 border-strongYellow active:bg-strongYellow active:border-black duration-200'
                    >
                      Edit
                    </button>
                  )}
                </div>

                {isLoading && <Loader />}
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default PlaceBidScreen;
