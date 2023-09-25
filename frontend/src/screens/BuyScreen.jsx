import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useGetProductDetailsQuery } from '../slices/productsApiSlice';
import { setAuthModalActive } from '../slices/authSlice';
import { addToOrder } from '../slices/orderSlice';

const BuyScreen = () => {
  const [noSizeMessage, setNoSizeMessage] = useState(false);

  const [open, setOpen] = useState(false);
  const [expOpen, setExpOpen] = useState(false);

  const [isBid, setIsBid] = useState(false);

  const [bidPrice, setBidPrice] = useState('');
  const [bidExpiration, setBidExpiration] = useState(30);
  const [invalidBidMessage, setInvalidBidMessage] = useState('');

  const [discountCode, setDiscountCode] = useState('');

  const location = useLocation();

  const [size, setSize] = useState('');
  const [purchasePrice, setPurchasePrice] = useState(null);
  const [availableSizes, setAvailableSizes] = useState([]);

  const { productId } = useParams();

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsQuery(productId);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (product) {
      const availableSizes = product.availableSizes;
      setAvailableSizes(availableSizes);

      const selectedSize =
        queryParams.get('size') &&
        availableSizes.some(
          (offer) => offer.size === Number(queryParams.get('size'))
        )
          ? Number(queryParams.get('size'))
          : '';
      setSize(selectedSize);

      if (selectedSize) {
        const lowestPriceForSize = availableSizes.find(
          (offer) => offer.size === selectedSize
        ).price;

        setPurchasePrice(lowestPriceForSize);
      } else {
        setPurchasePrice(product.lowestAsk);
      }
    }
  }, [product, location.search]);

  const handleSizeChoice = (value) => {
    setSize(value);

    const lowestPriceForSize = availableSizes.find(
      (offer) => offer.size === value
    ).price;

    setPurchasePrice(lowestPriceForSize);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!size) {
      setNoSizeMessage(true);
      setTimeout(() => setNoSizeMessage(false), 10000);
    } else if (!userInfo) {
      dispatch(setAuthModalActive(true));
    } else if (isBid) {
      if (bidPrice === '' || bidPrice < 25) {
        setInvalidBidMessage('Bid price must be greater than or equal to $25');
        setTimeout(() => setInvalidBidMessage(''), 10000);
      } else {
        dispatch(addToOrder({ ...product, size, purchasePrice: bidPrice }));
        navigate(`/buy/${productId}/shipping`);
      }
    } else {
      dispatch(addToOrder({ ...product, size, purchasePrice }));
      navigate(`/buy/${productId}/shipping`);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='Error' text={error?.data?.message || error.error} />
      ) : (
        <div className='container mx-auto px-6 md:max-w-3xl lg:max-w-6xl lg:px-28 xl:px-6'>
          <div className='flex justify-between my-8 lg:my-12'>
            <div>
              <div className='text-xl font-semibold'>{product.name}</div>
              <div className='opacity-50'>{product.color}</div>
            </div>
            <div className='flex flex-col'>
              <div className='opacity-50 text-sm text-right'>Last Sale:</div>
              <div className='font-bold text-3xl md:text-4xl'>
                ${product.lastSale}
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
                    />
                  )}
                  <button
                    type='button'
                    onClick={() => setOpen((current) => !current)}
                    className='relative z-20 flex justify-between items-center border-2 border-black rounded-full py-2 px-3 sm:px-5 w-full text-sm sm:text-base lg:text-lg'
                  >
                    <div>Size</div>
                    <div className='flex font-medium space-x-1 md:space-x-2 items-center'>
                      <div>US</div>
                      <div>M</div>
                      <div className='font-semibold'>{size}</div>
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
                  {open && (
                    <div className='absolute w-full right-0 max-w-md z-10 bg-white border-2 border-black border-t-0 rounded-xl rounded-t-none p-4 pt-10 -mt-5'>
                      <ul className='flex flex-wrap justify-left gap-2 md:gap-3'>
                        {availableSizes.map((obj) => {
                          return (
                            <li key={obj.size}>
                              <input
                                type='radio'
                                id={`${obj.size}`}
                                name='size'
                                onClick={() => handleSizeChoice(obj.size)}
                                className='peer hidden'
                                required={true}
                              />
                              <label
                                htmlFor={`${obj.size}`}
                                className={`inline-flex cursor-pointer text-sm md:text-base select-none items-center justify-center outline-none border-2 border-black rounded-full py-1.5 md:py-2 px-3 md:px-4 peer-hover:opacity-100 peer-hover:border-strongYellow peer-hover:scale-110 duration-200 ${
                                  size && size !== obj.size
                                    ? 'opacity-50'
                                    : size === obj.size && 'bg-strongYellow'
                                }`}
                              >
                                {obj.size}
                              </label>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
                <div className='flex justify-between mt-3 text-sm sm:text-base lg:text-lg'>
                  <input
                    type='radio'
                    id='buy'
                    name='buyType'
                    onClick={() => setIsBid(false)}
                    className='peer hidden'
                  />
                  <label
                    htmlFor='buy'
                    className={`cursor-pointer border-2 border-black rounded-full py-2 px-3 sm:px-5 ${
                      !isBid && 'bg-strongYellow'
                    }`}
                  >
                    Buy for ${purchasePrice}
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
                    className={`cursor-pointer border-2 border-black rounded-full py-2 px-3 sm:px-5 ${
                      isBid && 'bg-strongYellow'
                    }`}
                  >
                    Place bid
                  </label>
                </div>
                {isBid ? (
                  <>
                    {invalidBidMessage && (
                      <Message
                        variant='Warning'
                        text={invalidBidMessage}
                        small={true}
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
                          onChange={(e) => setBidPrice(e.target.value)}
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
        </div>
      )}
    </>
  );
};
export default BuyScreen;
