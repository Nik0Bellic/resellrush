import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SizesPopup from '../components/SizesPopup';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import { useDispatch, useSelector } from 'react-redux';
import { useGetProductDetailsQuery } from '../slices/productsApiSlice';
import { toggleFavorite } from '../slices/favoritesSlice';
import { setSizesModalActive } from '../slices/sizeSlice';

const ProductScreen = () => {
  const [isReadMore, setIsReadMore] = useState(true);

  const [sizes, setSizes] = useState([]);
  const { selectedSize } = useSelector((state) => state.size);

  const [purchasePrice, setPurchasePrice] = useState(null);
  const [salePrice, setSalePrice] = useState(null);

  const { productId } = useParams();

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsQuery(productId);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { favoriteItems } = useSelector((state) => state.favorites);
  const [favoriteItem, setFavoriteItem] = useState(undefined);

  const handleSizeChoice = useCallback(
    (value) => {
      const sizeObj = product.sizes[value];
      const lowestAskForSize = sizeObj?.asks[0]?.price;
      const highestBidForSize = sizeObj?.bids[0]?.price;

      lowestAskForSize
        ? setPurchasePrice(lowestAskForSize)
        : setPurchasePrice(null);
      highestBidForSize ? setSalePrice(highestBidForSize) : setSalePrice(null);
    },
    [product]
  );

  useEffect(() => {
    if (product) {
      const foundItem = favoriteItems.find((item) => item._id === product._id);
      setFavoriteItem(foundItem);
      setSizes(Object.entries(product.sizes));

      if (selectedSize) {
        handleSizeChoice(selectedSize);
      } else {
        if (product.productLowestAsk) {
          setPurchasePrice(product.productLowestAsk);
        }
        if (product.productHighestBid) {
          setSalePrice(product.productHighestBid);
        }
      }
    }
  }, [product, selectedSize, favoriteItems, handleSizeChoice]);

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

  const handleBuy = ({ defaultBid }) => {
    if (selectedSize) {
      defaultBid
        ? navigate(`/buy/${productId}?size=${selectedSize}&defaultBid=true`)
        : navigate(`/buy/${productId}?size=${selectedSize}`);
    } else {
      dispatch(setSizesModalActive(true));
    }
  };

  const handleSell = () => {
    selectedSize
      ? navigate(`/sell/${productId}?size=${selectedSize}`)
      : dispatch(setSizesModalActive(true));
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
          <div className='flex justify-between my-8 lg:my-10'>
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

          <div className='mt-10 grid grid-cols-2 md:gap-7 lg:gap-20'>
            <div className='col-span-2 md:col-span-1 container mx-auto px-6 md:px-0 md:max-w-md md:mt-3'>
              <img
                src={product.image}
                alt={product.name + ' ' + product.color}
              />
            </div>

            <div className='md:flex md:justify-end col-span-2 md:col-span-1'>
              <div className='grid grid-cols-2 md:px-0 md:flex md:flex-col md:pb-10 lg:pb-20 md:w-full md:max-w-md'>
                <div className='fullWidthBorder md:hidden'></div>
                <div className='w-full flex justify-between border-r md:border-none border-black py-5 md:pt-0 space-x-2 md:space-x-3'>
                  <button
                    onClick={() => dispatch(setSizesModalActive(true))}
                    className='flex justify-between items-center border-2 border-black rounded-full py-2 px-4 sm:px-6 text-sm sm:text-base space-x-2 md:space-x-4 flex-1 whitespace-nowrap'
                  >
                    <div>Size</div>
                    <div className='flex font-medium items-center space-x-2'>
                      {selectedSize && (
                        <>
                          <div className='flex'>
                            <div className='mr-1 md:mr-2'>US</div> M
                          </div>
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
                      className={`w-10 md:w-11 text-black hover:text-strongYellow hover:scale-110 duration-100 mr-3 md:mr-0 ${
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

                <div className='border-l md:border-none border-black col-span-1 flex justify-between text-sm sm:text-base md:text-lg pl-4 md:pl-0 font-medium items-center space-x-2 md:space-x-4'>
                  {purchasePrice && (
                    <button
                      onClick={() => {
                        handleBuy({ defaultBid: false });
                      }}
                      className='border-2 flex-1 whitespace-nowrap text-center px-2 sm:px-4 md:px-3 lg:px-6 py-3 sm:py-2 rounded-full hover:scale-105 border-strongYellow active:bg-strongYellow active:border-black duration-200'
                    >
                      Buy for ${purchasePrice}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      handleBuy({ defaultBid: true });
                    }}
                    className={`border-2 border-black text-center rounded-full hover:scale-105 hover:border-strongYellow active:bg-strongYellow flex-1 whitespace-nowrap active:border-black duration-200 ${
                      !purchasePrice
                        ? 'text-base py-1.5 px-7 sm:text-lg sm:px-9 md:px-16 lg:py-2 lg:px-24'
                        : 'py-3 sm:py-2 px-2 sm:px-4 md:px-3 lg:px-6'
                    }`}
                  >
                    Place bid
                  </button>
                </div>
                <div className='col-span-2'>
                  <div className='fullWidthBorder md:hidden'></div>
                  <button
                    onClick={handleSell}
                    className='w-full font-medium text-lg sm:text-xl flex justify-center py-10 md:pt-6 md:pb-0 hover:scale-105 duration-200'
                  >
                    {salePrice ? (
                      <>
                        Sell for&nbsp;
                        <span className='text-strongYellow'>${salePrice}</span>
                        &nbsp;or Ask for More
                      </>
                    ) : (
                      <div className='text-strongYellow'>Place Ask</div>
                    )}
                  </button>
                  <div className='fullWidthBorder md:hidden'></div>
                </div>
                <div className='w-full col-span-2 container mx-auto grid grid-cols-2 gap-3 sm:gap-4 md:px-0 py-6 text-lg sm:text-xl md:text-lg'>
                  <div className='border-2 border-black px-2 py-1 sm:py-1.5 rounded-full flex justify-center items-center'>
                    View Asks
                  </div>
                  <div className='border-2 border-black px-2 py-1 sm:py-1.5 rounded-full flex justify-center items-center'>
                    View Bids
                  </div>
                  <div className='col-span-2 border-2 border-black px-2 py-1 sm:py-1.5 rounded-full flex justify-center items-center'>
                    View Sales
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-2'>
            <div className='fullWidthBorder'></div>
            <div className='flex flex-col border-r border-black font-semibold py-10 lg:pb-12 pr-6 md:pr-10 lg:pr-20'>
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
            <div className='border-l border-black py-10 pl-6 md:pl-8 lg:pl-12'>
              {product.description && (
                <>
                  <div className='text-center font-semibold text-lg lg:text-xl mb-4 md:mb-6'>
                    Product Description
                  </div>
                  <div className='lg:text-lg'>
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
          <div className='fullWidthBorder'></div>
          <SizesPopup sizes={sizes} handleSizeChoice={handleSizeChoice} />
        </>
      )}
    </>
  );
};
export default ProductScreen;
