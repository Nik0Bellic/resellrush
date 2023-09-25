import { useSelector } from 'react-redux';
import Product from '../components/Product';

const FavoritesScreen = () => {
  const { favoriteItems } = useSelector((state) => state.favorites);

  return (
    <div className='container mx-auto px-6 lg:px-28 my-7'>
      <h1 className='font-bold text-2xl mb-1'>Favorites</h1>
      {favoriteItems.length === 0 ? (
        <p>Add items to your favorites and they'll appear here</p>
      ) : (
        <>
          <p>
            {favoriteItems.length}{' '}
            {favoriteItems.length === 1 ? 'item' : 'items'}
          </p>
          <div className='my-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
            {favoriteItems.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
export default FavoritesScreen;
