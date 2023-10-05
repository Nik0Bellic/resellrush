import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SizesPopup from '../components/SizesPopup';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useGetProductDetailsQuery } from '../slices/productsApiSlice';
import { setAuthModalActive } from '../slices/authSlice';
import { createBid } from '../slices/bidSlice';
import { setSizesModalActive } from '../slices/sizeSlice';

const BuyScreen = () => {
  const [noSizeMessage, setNoSizeMessage] = useState(false);
  const [nonClickable, setNonClickable] = useState(false);

  const [noAsksForSize, setNoAsksForSize] = useState(false);
  const [noOffersMessage, setNoOffersMessage] = useState('');

  const [maxBidForSize, setMaxBidForSize] = useState(null);
  const [sizes, setSizes] = useState([]);
  const { selectedSize } = useSelector((state) => state.size);

  const [expOpen, setExpOpen] = useState(false);

  const [isBid, setIsBid] = useState(false);

  const [bidPrice, setBidPrice] = useState('');
  const [bidExpiration, setBidExpiration] = useState(30);
  const [invalidBidMessage, setInvalidBidMessage] = useState('');

  const [discountCode, setDiscountCode] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const queryParamsRef = useRef(null);

  const [purchasePrice, setPurchasePrice] = useState(null);

  const { productId } = useParams();

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsQuery(productId);

  const handleSizeChoice = useCallback(
    (value) => {
      const sizeObj = product.sizes[value];
      const lowestAskForSize = sizeObj?.asks[0]?.price;
      const highestBidForSize = sizeObj?.bids[0]?.price;

      setMaxBidForSize(highestBidForSize);

      if (!lowestAskForSize && !highestBidForSize) {
        setIsBid(true);
        setNoAsksForSize(true);
        setNoOffersMessage('No Asks Or Bids For This Size');
        setPurchasePrice(null);
      } else if (!lowestAskForSize) {
        setIsBid(true);
        setNoAsksForSize(true);
        setNoOffersMessage('No Asks For This Size');
        setPurchasePrice(null);
      } else if (!highestBidForSize) {
        setIsBid(false || queryParamsRef.current.get('defaultBid'));
        setNoAsksForSize(false);
        setNoOffersMessage('');
        setPurchasePrice(lowestAskForSize);
      } else {
        setIsBid(false || queryParamsRef.current.get('defaultBid'));
        setNoAsksForSize(false);
        setNoOffersMessage('');
        setPurchasePrice(lowestAskForSize);
      }
    },
    [product]
  );

  useEffect(() => {
    queryParamsRef.current = new URLSearchParams(location.search);
    if (!queryParamsRef.current.get('size')) {
      dispatch(setSizesModalActive(true));
      setNonClickable(true);
    } else {
      setNonClickable(false);
      if (queryParamsRef.current.get('defaultBid')) {
        setIsBid(true);
      } else {
        setIsBid(false);
      }
    }

    if (product) {
      setSizes(Object.entries(product.sizes));

      if (selectedSize) {
        handleSizeChoice(selectedSize);
      }
    }
  }, [product, location.search, selectedSize, handleSizeChoice, dispatch]);

  const { userInfo } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSize) {
      setNoSizeMessage(true);
      setTimeout(() => setNoSizeMessage(false), 10000);
    } else if (!userInfo) {
      dispatch(setAuthModalActive(true));
    } else {
      if (isBid) {
        if (bidPrice === '' || bidPrice < 25) {
          setInvalidBidMessage(
            'Bid price must be greater than or equal to $25'
          );
          setTimeout(() => setInvalidBidMessage(''), 10000);
        } else {
          dispatch(
            createBid({
              buyItem: product,
              size: selectedSize.replace(',', '.'),
              type: 'bid',
              expiration: bidExpiration,
              bidPrice,
            })
          );
          navigate(`/buy/${productId}/placeBid`);
        }
      } else {
        const seller = product.sizes[selectedSize].asks[0].user;
        const askId = product.sizes[selectedSize].asks[0].offerId;

        dispatch(
          createBid({
            buyItem: product,
            seller,
            askId,
            size: selectedSize.replace(',', '.'),
            type: 'purchase',
            bidPrice: purchasePrice,
          })
        );
        navigate(`/buy/${productId}/placeBid`);
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='Error' text={error?.data?.message || error.error} />
      ) : (
        <>
          <div className='flex justify-between my-8 lg:my-12'>
            <div>
              <div className='text-xl font-semibold'>{product.name}</div>
              <div className='opacity-50'>{product.color}</div>
            </div>
            <div className='flex flex-col'>
              <div className='opacity-50 text-sm text-right'>Last Sale:</div>
              <div className='font-bold text-3xl md:text-4xl'>
                ${product.productLastSale}
              </div>
            </div>
          </div>
          <div className='mt-10 grid grid-cols-2 gap-5 sm:gap-7 lg:gap-20'>
            <div className='mt-3 max-w-md'>
              <img
                src={product.image}
                alt={product.name + ' ' + product.color}
              />
            </div>
            <div className='flex justify-end'>
              <form
                onSubmit={(e) => handleSubmit(e)}
                className='flex flex-col space-y-4 w-full max-w-md'
              >
                <div className='relative md:max-w-md w-full'>
                  {noSizeMessage && (
                    <Message
                      variant='Warning'
                      text='Please Select Size'
                      small={true}
                      noLabel={true}
                    />
                  )}
                  <button
                    type='button'
                    onClick={() => dispatch(setSizesModalActive(true))}
                    className='w-full flex justify-between items-center border-2 border-black rounded-full py-2 px-4 sm:px-6 text-sm sm:text-base space-x-2 whitespace-nowrap'
                  >
                    <div>Size</div>
                    <div className='flex font-medium items-center space-x-2'>
                      {selectedSize && (
                        <>
                          <div>US&nbsp; M</div>
                          <div className='font-semibold'>
                            {selectedSize.replace(',', '.')}
                          </div>
                        </>
                      )}
                      <div>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          strokeWidth={2}
                          stroke='currentColor'
                          className='w-6 -mr-1'
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
                </div>
                <div className='flex flex-col justify-between mt-3 text-sm sm:text-base lg:text-lg'>
                  {isBid &&
                    (!maxBidForSize ||
                      (bidPrice &&
                        maxBidForSize &&
                        bidPrice > maxBidForSize)) && (
                      <div className='w-full text-center font-medium mb-4 text-strongYellow'>
                        You are about to be the highest bidder!
                      </div>
                    )}
                  {noOffersMessage && (
                    <Message
                      variant='info'
                      text={noOffersMessage}
                      small={true}
                      noLabel={true}
                    />
                  )}
                  <div className='flex justify-between'>
                    <input
                      type='radio'
                      id='purchase'
                      name='buyType'
                      onClick={() => setIsBid(false)}
                      className='peer hidden'
                      disabled={noAsksForSize}
                    />
                    <label
                      htmlFor='purchase'
                      className={`cursor-pointer border-2 border-black rounded-full py-2 px-2 sm:px-5 ${
                        !isBid
                          ? 'bg-strongYellow'
                          : !noAsksForSize &&
                            'hover:border-strongYellow hover:scale-105 duration-200'
                      } ${
                        noAsksForSize &&
                        'peer-disabled:border-gray-300 peer-disabled:text-gray-300 peer-disabled:cursor-default'
                      }`}
                    >
                      Buy Now{' '}
                      <span className={`${noAsksForSize && 'hidden'}`}>
                        ${purchasePrice}
                      </span>
                    </label>
                    <input
                      type='radio'
                      id='bid'
                      name='buyType'
                      onClick={() => setIsBid(true)}
                      className='peer hidden'
                    />
                    <label
                      htmlFor='bid'
                      className={`cursor-pointer border-2 border-black rounded-full py-2 px-2 sm:px-5 ${
                        isBid
                          ? 'bg-strongYellow'
                          : !noAsksForSize &&
                            'hover:border-strongYellow hover:scale-105 duration-200'
                      }`}
                    >
                      Place bid
                    </label>
                  </div>
                </div>
                {isBid ? (
                  <>
                    {invalidBidMessage && (
                      <Message
                        variant='Warning'
                        text={invalidBidMessage}
                        small={true}
                        noLabel={true}
                      />
                    )}
                    <div className='flex border-2 border-black rounded-full text-sm sm:text-base lg:text-lg'>
                      <div className='px-3 sm:px-5 py-2 whitespace-nowrap'>
                        Place Bid
                      </div>
                      <div className='pl-2 sm:pl-3 flex w-full items-center border-l-2 border-black rounded-full rounded-l-none'>
                        <span className='font-semibold text-lg'>$</span>
                        <input
                          type='number'
                          name='q'
                          placeholder='Enter Bid'
                          onChange={(e) => setBidPrice(Number(e.target.value))}
                          value={bidPrice}
                          className='w-full mr-5 pl-1.5 focus:outline-none'
                          required={true}
                        />
                      </div>
                    </div>
                    <div className='relative md:max-w-md w-full'>
                      <button
                        type='button'
                        onClick={() => setExpOpen((current) => !current)}
                        className='relative z-20 flex justify-between items-center border-2 border-black rounded-full py-2 px-3 sm:px-5 w-full text-sm sm:text-base lg:text-lg'
                      >
                        <div>Bid expiration</div>
                        <div className='flex font-semibold space-x-1 md:space-x-2 items-center'>
                          <div>{bidExpiration} Days</div>
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
                      {expOpen && (
                        <div className='absolute w-full right-0 max-w-md z-10 bg-white border-2 border-black border-t-0 rounded-xl rounded-t-none p-4 pt-10 -mt-5'>
                          <ul className='flex flex-wrap justify-left gap-2 md:gap-3'>
                            {[1, 3, 7, 14, 30, 60].map((exp) => {
                              return (
                                <li key={exp}>
                                  <input
                                    type='radio'
                                    id={`${exp}`}
                                    name='expiration'
                                    required={true}
                                    onClick={() => setBidExpiration(exp)}
                                    className='peer hidden'
                                  />
                                  <label
                                    htmlFor={`${exp}`}
                                    className={`inline-flex cursor-pointer text-sm md:text-base select-none items-center justify-center outline-none border-2 border-black rounded-full py-1.5 md:py-2 px-3 md:px-4 peer-hover:opacity-100 peer-hover:border-strongYellow peer-hover:scale-110 duration-200 ${
                                      bidExpiration && bidExpiration !== exp
                                        ? 'opacity-50'
                                        : bidExpiration === exp &&
                                          'bg-strongYellow'
                                    }`}
                                  >
                                    {exp} Days
                                  </label>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <input
                      type='text'
                      placeholder='Discount Code'
                      onChange={(e) => setDiscountCode(e.target.value)}
                      value={discountCode}
                      className='border-2 rounded-full border-black text-sm sm:text-base py-2 px-3 sm:px-5 w-full focus:outline-none'
                    />

                    <div className='flex justify-between items-center text-sm lg:text-lg border-b-2 border-black pb-1 mx-0.5'>
                      <div>Item Price:</div>
                      <div className='font-bold ml-2'>${purchasePrice}</div>
                    </div>
                  </>
                )}
                <div className='w-full flex justify-between lg:text-lg'>
                  <Link
                    to={`/${productId}`}
                    className='border-2 border-black text-center px-4 sm:px-5 py-1.5 sm:py-2 rounded-full hover:scale-110 hover:border-strongYellow active:bg-strongYellow active:border-black duration-200'
                  >
                    Cancel
                  </Link>
                  <button
                    type='submit'
                    className='border-2 text-center px-4 sm:px-5 py-1.5 sm:py-2 rounded-full hover:scale-110 border-strongYellow active:bg-strongYellow active:border-black duration-200'
                  >
                    Next
                  </button>
                </div>
              </form>
            </div>
          </div>
          <SizesPopup
            sizes={sizes}
            handleSizeChoice={handleSizeChoice}
            type='bid'
            nonClickable={nonClickable}
          />
        </>
      )}
    </>
  );
};
export default BuyScreen;
