import { Link } from 'react-router-dom';

const Product = ({ product }) => {
  return (
    <div className='my-2 p-6'>
      <Link
        to={`/${(product.name + ' ' + product.color)
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]+/g, '')}`}
      >
        <img src={product.image} className='mb-3' alt={product.name} />
        <h3 className='font-medium text-sm opacity-75 line-clamp-2 h-10 w-44 mb-3'>
          {product.name} {product.color}
        </h3>
        <div className='flex justify-between'>
          <h2 className='font-bold text-2xl'>${product.lowestAsk}</h2>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.3}
            stroke='currentColor'
            className='w-10 -mt-1 hover:text-strongYellow hover:scale-110 duration-100'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z'
            />
          </svg>
        </div>
      </Link>
    </div>
  );
};
export default Product;
