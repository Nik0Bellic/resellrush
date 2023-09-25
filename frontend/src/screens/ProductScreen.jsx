import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import { useDispatch, useSelector } from 'react-redux';
import { useGetProductDetailsQuery } from '../slices/productsApiSlice';
import { toggleFavorite } from '../slices/favoritesSlice';

const ProductScreen = () => {
  const [open, setOpen] = useState(false);
  const [isReadMore, setIsReadMore] = useState(true);

  const [size, setSize] = useState(null);
  const [buyPrice, setBuyPrice] = useState(null);
  const [availableSizes, setAvailableSizes] = useState([]);

  const { productId } = useParams();

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsQuery(productId);

  const dispatch = useDispatch();
  const { favoriteItems } = useSelector((state) => state.favorites);

  const [favoriteItem, setFavoriteItem] = useState(undefined);

  useEffect(() => {
    if (product) {
      const foundItem = favoriteItems.find((item) => item._id === product._id);
      setFavoriteItem(foundItem);
      const availableSizes = product.availableSizes;
      setAvailableSizes(availableSizes);

      setBuyPrice(product.lowestAsk);
    }
  }, [product, favoriteItems]);

  const handleSizeChoice = (value) => {
    setSize(value);

    const lowestPriceForSize = availableSizes.find(
      (offer) => offer.size === value
    ).price;

    setBuyPrice(lowestPriceForSize);
  };

  const toggleFavoriteHandler = () => {
    dispatch(toggleFavorite(product));
    if (favoriteItem) {
      setFavoriteItem(false);
    } else {
      setFavoriteItem(true);
    }
  };

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='Error' text={error?.data?.message || error.error} />
      ) : (
        <>
          <Meta title={`${product.name} ${product.color}`} />
          <div className='container mx-auto px-6 lg:px-28 flex justify-between my-8 lg:my-12'>
            <div>
              <div className='text-xl font-semibold'>{product.name}</div>
              <div className='opacity-50'>{product.color}</div>
            </div>
            <div className='flex flex-col'>
              <div className='opacity-50 text-sm text-right'>Last Sale:</div>
              <div className='font-bold text-4xl'>${product.lastSale}</div>
            </div>
          </div>
          <div className='container mx-auto px-6 max-w-xl'>
            <img src={product.image} alt={product.name + ' ' + product.color} />
          </div>
          <div className='grid grid-cols-2 mt-16'>
            <div className='flex justify-center px-7 py-5 border-y-2 border-r border-black'>
              <div className='relative md:max-w-md w-full'>
                <button
                  onClick={() => setOpen((current) => !current)}
                  className='relative z-20 flex justify-between items-center border-2 border-black rounded-full py-2 px-6 w-full text-sm sm:text-base lg:text-lg'
                >
                  <div>Size</div>
                  <div className='flex font-medium space-x-2 items-center'>
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
                        className='w-6'
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
            </div>

            <div className='flex justify-center text-xs sm:text-sm md:text-base lg:text-lg py-5 px-2 md:px-7 border-y-2 border-l border-black font-medium space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-5 items-center'>
              <Link
                to={`/buy/${product.productIdentifier}?size=${size}`}
                className='border-2 text-center px-2 sm:px-4 lg:px-6 py-3 sm:py-2 rounded-full hover:scale-110 border-strongYellow active:bg-strongYellow active:border-black duration-200'
              >
                Buy for ${buyPrice}
              </Link>
              <Link
                to='/buy/:productId'
                className='border-2 border-black text-center px-2 sm:px-4 lg:px-6 py-3 sm:py-2 rounded-full hover:scale-110 hover:border-strongYellow active:bg-strongYellow active:border-black duration-200'
              >
                Place bid
              </Link>
              <button
                className='hover:text-strongYellow hover:scale-110 duration-100'
                onClick={toggleFavoriteHandler}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill={favoriteItem ? '#FFC700' : 'none'}
                  viewBox='0 0 24 24'
                  strokeWidth={1.3}
                  stroke='currentColor'
                  className={`w-10 md:w-11 text-black hover:text-strongYellow hover:scale-110 duration-100 ${
                    favoriteItem && 'border-black'
                  }
                  `}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z'
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className='grid grid-cols-2 mt-24 lg:mt-32'>
            <div className='flex flex-col border-y-2 border-r border-black font-semibold py-10 px-6 md:px-10 lg:px-20'>
              <div className='text-center mb-4 md:mb-6 text-lg'>
                Product Details
              </div>
              <div className='md:grid md:grid-cols-2 gap-3 text-sm md:text-base lg:text-lg'>
                {product.style && (
                  <>
                    <div className='opacity-25'>Style</div>
                    <div className='mb-3 md:mb-0'>{product.style}</div>
                  </>
                )}
                {product.colorway && (
                  <>
                    <div className='opacity-25'>Colorway</div>
                    <div className='mb-3 md:mb-0'>{product.colorway}</div>
                  </>
                )}
                {product.retailPrice && (
                  <>
                    <div className='opacity-25'>Retail Price</div>
                    <div className='mb-3 md:mb-0'>${product.retailPrice}</div>
                  </>
                )}
                {product.releaseData && (
                  <>
                    <div className='opacity-25'>Release Data</div>
                    <div className='mb-3 md:mb-0'>{product.releaseData}</div>
                  </>
                )}
              </div>
            </div>
            <div className='border-y-2 border-l border-black py-10 px-6 md:px-10 lg:px-20'>
              {product.description && (
                <>
                  <div className='text-center font-semibold text-lg mb-4 md:mb-6'>
                    Product Description
                  </div>
                  <div>
                    {isReadMore ? (
                      <span className='whitespace-pre-line opacity-50'>
                        {product.description.slice(0, 180)}...
                      </span>
                    ) : (
                      <span className='whitespace-pre-line opacity-50'>
                        {product.description}
                      </span>
                    )}
                    <div
                      onClick={toggleReadMore}
                      className='mt-2 cursor-pointer font-bold'
                    >
                      {isReadMore ? 'Read More' : 'Show Less'}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default ProductScreen;
