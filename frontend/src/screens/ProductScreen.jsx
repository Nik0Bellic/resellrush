import { toast } from 'react-toastify';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import { useGetProductDetailsQuery } from '../slices/productsApiSlice';

const ProductScreen = () => {
  const [size, setSize] = useState(null);
  const [open, setOpen] = useState(false);
  const [isReadMore, setIsReadMore] = useState(true);

  const { productId } = useParams();

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsQuery(productId);

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        toast.error(error?.data?.message || error.error)
      ) : (
        <>
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
            <div className='relative flex justify-center px-7 py-5 border-y-2 border-r border-black'>
              <button
                onClick={() => setOpen((current) => !current)}
                className='relative md:max-w-md z-20 flex justify-between items-center border-2 border-black rounded-full py-2 px-6 w-full'
              >
                <div>Size</div>
                <div className='flex font-medium space-x-2 items-center'>
                  <div>US</div>
                  <div>M</div>
                  <div>{size}</div>
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
                <div className='absolute mr-7 z-10 bg-white border-2 border-black border-t-0 rounded-xl rounded-t-none p-4 pt-10 mt-7 md:mt-5 ml-7'>
                  <ul className='flex flex-wrap justify-left gap-2 md:gap-3'>
                    {Array.from({ length: 23 }, (_, index) => {
                      const value = 4 + index * 0.5;
                      return (
                        <li key={index}>
                          <input
                            type='radio'
                            id={`size-${value}`}
                            name='size'
                            onClick={() => setSize(value)}
                            className='peer hidden'
                          />
                          <label
                            htmlFor={`size-${value}`}
                            className={`inline-flex cursor-pointer text-sm md:text-base select-none items-center justify-center outline-none border-2 border-black rounded-full py-1.5 md:py-2 px-3 md:px-4 peer-hover:border-strongYellow peer-hover:scale-110 duration-200 ${
                              size && size !== value
                                ? 'opacity-50'
                                : size === value && 'bg-strongYellow'
                            }`}
                          >
                            {value}
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            <div className='flex justify-center text-sm md:text-base py-5 px-2 md:px-7 border-y-2 border-l border-black font-medium space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-5 items-center'>
              <Link
                to='/buy/:productId'
                className='border-2 border-black text-center px-2 sm:px-4 md:px-5 lg:px-6 py-2 rounded-full hover:scale-110 hover:border-strongYellow active:bg-strongYellow active:border-black duration-200'
              >
                Place Ask
              </Link>
              <Link
                to='/sell/:productId'
                className='border-2 border-black text-center px-2 sm:px-4 md:px-5 lg:px-6 py-2 rounded-full hover:scale-110 hover:border-strongYellow active:bg-strongYellow active:border-black duration-200'
              >
                Place Bid
              </Link>
              <button className='hover:text-strongYellow hover:scale-110 duration-100'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.3}
                  stroke='currentColor'
                  className='w-11'
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
