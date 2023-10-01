import { useDispatch, useSelector } from 'react-redux';
import { selectSize, setSizesModalActive } from '../slices/sizeSlice';

const SizesPopup = ({ sizes, handleSizeChoice, type, nonClickable }) => {
  const { sizesModalActive, selectedSize } = useSelector((state) => state.size);

  const dispatch = useDispatch();

  return (
    <div
      className={`w-[100vw] h-[100vh] bg-black bg-opacity-60 fixed top-0 left-0 flex justify-center items-center opacity-0 pointer-events-none duration-300 z-30 ${
        sizesModalActive && 'opacity-100 pointer-events-auto'
      }`}
      onClick={() => !nonClickable && dispatch(setSizesModalActive(false))}
    >
      <div
        className={`border-2 border-black rounded-2xl p-6 bg-white scale-0 duration-500 w-80 md:w-96 ${
          sizesModalActive && 'scale-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <ul className='grid grid-cols-3 gap-2 md:gap-3'>
          {sizes
            .sort((a, b) => {
              const sizeA = parseFloat(a[0].replace(',', '.'));
              const sizeB = parseFloat(b[0].replace(',', '.'));
              return sizeA - sizeB;
            })
            .map(([size, sizeData]) => {
              const offer =
                type === 'bid'
                  ? sizeData.asks && sizeData.asks[0]
                    ? sizeData.asks[0].price
                    : 'BID'
                  : sizeData.bids && sizeData.bids[0]
                  ? sizeData.bids[0].price
                  : 'ASK';
              return (
                <li key={size}>
                  <input
                    type='radio'
                    id={`${size}`}
                    name='size'
                    onClick={() => {
                      dispatch(selectSize(size));
                      dispatch(setSizesModalActive(false));
                      handleSizeChoice(size);
                    }}
                    className='peer hidden'
                    required={true}
                  />
                  <label
                    htmlFor={`${size}`}
                    className={`flex flex-col cursor-pointer text-sm md:text-base select-none items-center justify-center outline-none border-2 border-black rounded-xl py-1.5 md:py-2 px-1.5 md:px-2.5 peer-hover:opacity-100 peer-hover:border-strongYellow peer-hover:scale-110 duration-100 ${
                      selectedSize && selectedSize !== size
                        ? 'border-opacity-50'
                        : selectedSize === size && 'bg-strongYellow'
                    }`}
                  >
                    <div>US M {size.replace(',', '.')}</div>
                    <div
                      className={`font-semibold ${
                        offer === 'BID' || offer === 'ASK'
                          ? 'text-gray-700'
                          : selectedSize !== size && 'text-strongYellow'
                      }`}
                    >
                      <span
                        className={`${
                          (offer === 'BID' || offer === 'ASK') && 'hidden'
                        }`}
                      >
                        $
                      </span>
                      {offer}
                    </div>
                  </label>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

SizesPopup.defaultProps = {
  type: 'bid',
  nonClickable: false,
};

export default SizesPopup;
