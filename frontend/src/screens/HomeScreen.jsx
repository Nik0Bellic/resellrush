import products from '../products';
import Product from '../components/Product';

const HomeScreen = () => {
  return (
    <div className='container mx-auto px-4 lg:px-12 mt-24'>
      <div className='relative flex justify-between w-full border-b-2 border-black pb-2 text-xl lg:text-2xl font-medium'>
        <div>/</div>
        <div>Popular</div>
        <div className='flex'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-8 hover:text-strongYellow duration-100'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-8 hover:text-strongYellow duration-100'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
        </div>
      </div>

      <div className='absolute left-0 right-0 mt-5 overflow-x-auto'>
        <div className='flex'>
          {products.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default HomeScreen;
