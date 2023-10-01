import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Message from './Message';
import { useGetLatestProductsQuery } from '../slices/productsApiSlice';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetLatestProductsQuery();
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalId = useRef();

  const goToSlide = (index) => {
    setActiveIndex(index);
  };

  const nextSlide = useCallback(() => {
    setActiveIndex((prevIndex) =>
      prevIndex === products.length - 1 ? 0 : prevIndex + 1
    );
  }, [products]);

  const prevSlide = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? products - 1 : prevIndex - 1
    );
  };

  const [isMouseOver, setIsMouseOver] = useState(false);

  const handleMouseOver = () => {
    setIsMouseOver(true);
  };

  const handleMouseOut = () => {
    setIsMouseOver(false);
  };

  useEffect(() => {
    if (isMouseOver) {
      intervalId.current = setInterval(nextSlide, 5000);
    } else {
      intervalId.current = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % products.length);
      }, 3000);
    }

    return () => {
      clearInterval(intervalId.current);
    };
  }, [products, isMouseOver, nextSlide]);

  return isLoading ? null : error ? (
    <Message variant='Error' text={error?.data?.message || error.error} />
  ) : (
    <div
      className='relative h-64'
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <div className='absolute z-10 left-0 top-1/2 transform -translate-y-1/2 sm:top-3/4'>
        <button onClick={prevSlide}>
          <BsChevronLeft
            className='text-2xl hover:text-strongYellow'
            style={{ strokeWidth: '0.3' }}
          />
        </button>
      </div>
      {products.map((product, index) => (
        <div
          key={product._id}
          className={`absolute top-0 w-full h-full transition-opacity duration-300 ${
            index === activeIndex
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
          }`}
        >
          <Link
            to={`/${product.productIdentifier}`}
            className='w-full flex justify-center'
          >
            <img
              src={product.image}
              alt={`${product.name} ${product.color}`}
              className='object-cover w-full px-6 mt-14 max-w-xl'
            />
            <div className='absolute top-0 container mx-auto px-6 lg:px-28 flex justify-between'>
              <div>
                <div className='text-xl font-semibold'>{product.name}</div>
                <div className='opacity-50'>{product.color}</div>
              </div>
              <div className='flex flex-col'>
                <div className='opacity-50 text-sm text-right'>Last Sale:</div>
                <div className='font-bold text-4xl'>
                  ${product.productLastSale}
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
      <div className='absolute z-10 right-0 top-1/2 transform -translate-y-1/2 sm:top-3/4'>
        <button onClick={nextSlide}>
          <BsChevronRight
            className='text-2xl hover:text-strongYellow'
            style={{ strokeWidth: '0.3' }}
          />
        </button>
      </div>
      <div className='absolute bottom-[-8rem] sm:bottom-[-13rem] left-0 right-0 flex items-center justify-center space-x-4'>
        {products.map((_, index) => (
          <button
            key={index}
            className={`w-4 h-4 rounded-full border-2 border-black ${
              index === activeIndex ? 'bg-strongYellow' : 'bg-transparent'
            }`}
            onClick={() => goToSlide(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;
