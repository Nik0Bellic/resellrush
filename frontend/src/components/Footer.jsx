import { FaInstagram, FaVk } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className='mt-32 md:mt-48 lg:mt-64 xl:mt-72 font-mono'>
      <div className='grid grid-cols-2'>
        <div className='flex-1 p-7 sm:p-10  lg:p-14 xl:p-20 flex flex-col lg:items-center text-left lg:text-center border-t-2 border-r border-black w-full items-left'>
          <h2 className='font-bold text-md md:text-lg lg:text-2xl mb-1 uppercase'>
            Subscribe to our newsletter
          </h2>
          <p className='opacity-50 md:text-md lg:max-w-md text-sm lg:text-lg xl:text-xl'>
            Be the first to know about upcoming releases and new arrivals.
          </p>
          <form className='flex justify-between border-b-4 pb-1 border-black mt-5 max-w-[14rem] md:max-w-[18rem] sm:mt-7 lg:mt-8 text-md md:text-lg lg:text-xl lg:w-5/6 lg:max-w-5/6 -mr-1'>
            <input
              type='text'
              placeholder='EMAIL'
              className='focus:outline-none placeholder:text-black opacity-75 -mr-10'
            />
            <button type='submit' className='opacity-75'>
              OK
            </button>
          </form>
        </div>
        <div className='p-7 sm:p-10 lg:p-14 border-t-2 border-l border-black'>
          <div className='flex justify-between md:justify-start space-x-3 sm:space-x-7 md:space-x-11 lg:space-x-16 w-full'>
            <div className='flex flex-col'>
              <h3 className='text-sm md:text-base lg:text-xl mb-3 font-semibold'>
                Сatalog
              </h3>
              <div className='text-xs md:text-sm lg:text-base opacity-50 space-y-2'>
                <h4>Position 1</h4>
                <h4>Position 2</h4>
                <h4>Position 3</h4>
                <h4>Position 4</h4>
              </div>
            </div>
            <div className='flex flex-col'>
              <h3 className='text-sm md:text-base lg:text-xl mb-3 font-semibold'>
                About us
              </h3>
              <div className='text-xs md:text-sm lg:text-base opacity-50 space-y-2'>
                <h4>About us</h4>
                <h4>About us</h4>
                <h4>About us</h4>
                <h4>About us</h4>
              </div>
            </div>
            <div className='flex flex-col'>
              <h3 className='text-sm md:text-base lg:text-xl mb-3 font-semibold'>
                Help
              </h3>
              <div className='text-xs md:text-sm lg:text-base opacity-50 space-y-2'>
                <h4>Position 1</h4>
                <h4>Position 2</h4>
                <h4>Position 3</h4>
                <h4>Position 4</h4>
              </div>
            </div>
          </div>
          <div className='flex space-x-2 mt-5 sm:mt-7 md:mt-10 text-3xl lg:text-4xl'>
            <FaInstagram />
            <FaVk />
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
