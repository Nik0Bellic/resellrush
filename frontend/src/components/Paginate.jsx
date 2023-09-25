import { Link } from 'react-router-dom';

const Paginate = ({ pages, page, isAdmin, keyword = '' }) => {
  const renderPageNumber = (pageNumber) => (
    <Link
      key={pageNumber}
      to={
        !isAdmin
          ? keyword
            ? `/search/${keyword}/page/${pageNumber}`
            : `/page/${pageNumber}`
          : `/admin/productList/${pageNumber}`
      }
      className={`w-10 h-10 font-medium flex justify-center items-center mx-1 border-2 rounded-full ${
        pageNumber === page
          ? 'border-black text-black bg-strongYellow'
          : 'border-gray-300 text-gray-300'
      }`}
    >
      {pageNumber}
    </Link>
  );

  return (
    pages > 1 && (
      <div className='my-3 flex justify-center'>
        {page > 2 && renderPageNumber(1)}
        {page > 3 && <div className='w-10 h-10'>...</div>}
        {page > 1 && renderPageNumber(page - 1)}
        {renderPageNumber(page)}
        {page < pages && renderPageNumber(page + 1)}
        {page < pages - 2 && (
          <div className='flex items-end text-3xl mx-2 text-gray-300'>...</div>
        )}
        {page < pages - 1 && renderPageNumber(pages)}
      </div>
    )
  );
};

export default Paginate;
