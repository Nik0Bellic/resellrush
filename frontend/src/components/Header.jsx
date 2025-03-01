import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SearchBox from './SearchBox';
import { FaSearch, FaInstagram, FaVk } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { setAuthModalActive } from '../slices/authSlice';
import { resetFavorites } from '../slices/favoritesSlice';

const Header = () => {
  const [isActive, setIsActive] = useState(false);
  const [mobileSearchShown, setMobileSearchShown] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const menuRef = useRef(null);

  const { userInfo } = useSelector((state) => state.auth);

  const { favoriteItems } = useSelector((state) => state.favorites);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { keyword: urlKeyword } = useParams();
  const [keyword, setKeyword] = useState(urlKeyword || '');

  const mobileSearchHandler = (e) => {
    e.preventDefault();
    if (keyword) {
      if (keyword.trim()) {
        setKeyword('');
        navigate(`/search/${keyword}`);
      } else {
        navigate('/');
      }
    }
  };

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      setIsActive(false);
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(resetFavorites());
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsActive(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className='border-b-2 border-black'>
      <nav className='container lg:max-w-6xl xl:container relative mx-auto p-6'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center'>
            {/* Logo */}
            <Link
              to='/'
              className='text-3xl font-sans -mt-1 font-semibold lg:mr-3 lgl:mr-4 xl:mr-5'
            >
              ResellRush
            </Link>
            {/* Left Menu */}
            <div className='hidden lg:flex lg:text-md space-x-2 lgm:space-x-3 lgm:text-lg lgl:space-x-5'>
              {/* <Link
                to='/sneakers'
                className='text-gray-400 px-2 py-1 xl:px-3 xl:py-2 hover:text-black
            outline-strongYellow rounded-full hover:outline hover:scale-110 duration-200'
              >
                Sneakers
              </Link>
              <Link
                to='/clothes'
                className='text-gray-400 px-2 py-1 xl:px-3 xl:py-2 hover:text-black
            outline-strongYellow rounded-full hover:outline hover:scale-110 duration-200'
              >
                Apparel
              </Link> */}
              <Link
                to='/about'
                className='text-gray-400 px-2 py-1 xl:px-3 xl:py-2 hover:text-black
            outline-strongYellow rounded-full hover:outline hover:scale-110 duration-200'
              >
                About us
              </Link>
              <Link
                to='/support'
                className='text-gray-400 px-2 py-1 xl:px-3 xl:py-2 hover:text-black
            outline-strongYellow rounded-full hover:outline hover:scale-110 duration-200'
              >
                Support
              </Link>
            </div>
          </div>

          {/* Right Button Menu */}
          <div className='hidden lg:flex items-center'>
            <SearchBox />
            <Link to='/favorites' className='relative'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.3}
                stroke='currentColor'
                className='w-12 mx-2 hover:text-strongYellow hover:scale-110 duration-100'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z'
                />
              </svg>
              {favoriteItems.length > 0 && (
                <div className='absolute border-2 border-white rounded-full bg-strongYellow text-white text-sm -mt-6 left-8 w-7 h-7 flex justify-center items-center'>
                  {favoriteItems.length}
                </div>
              )}
            </Link>
            {userInfo ? (
              <div
                className='relative inline-block text-left'
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <Link to='/profile'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.3}
                    stroke='currentColor'
                    className='w-10 hover:text-strongYellow hover:scale-110 duration-100'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'
                    />
                  </svg>
                </Link>

                {showDropdown && (
                  <div className='absolute z-30 right-0 w-48 xl:w-60 pt-3 rounded-md shadow-lg'>
                    <div className='border-2 border-black rounded-xl bg-white shadow-xs flex flex-col space-y-6 p-6 xl:p-10 xl:text-xl xl:space-y-8'>
                      <Link
                        to='/profile'
                        className='hover:px-3 hover:py-2 xl:hover:px-7 xl:hover:py-2.5 w-min
            outline-black rounded-full hover:bg-strongYellow hover:outline hover:scale-110 duration-200'
                      >
                        Profile
                      </Link>
                      {userInfo.isAdmin && (
                        <>
                          <Link
                            to='/admin/productList'
                            className='hover:px-3 hover:py-2 xl:hover:px-7 xl:hover:py-2.5 w-min text-orange-500
          outline-black rounded-full hover:bg-strongYellow hover:outline hover:scale-110 duration-200'
                          >
                            Products
                          </Link>
                          <Link
                            to='/admin/userList'
                            className='hover:px-3 hover:py-2 xl:hover:px-7 xl:hover:py-2.5 w-min text-orange-500
          outline-black rounded-full hover:bg-strongYellow hover:outline hover:scale-110 duration-200'
                          >
                            Users
                          </Link>
                          <Link
                            to='/admin/dealList'
                            className='hover:px-3 hover:py-2 xl:hover:px-7 xl:hover:py-2.5 w-min text-orange-500
            outline-black rounded-full hover:bg-strongYellow hover:outline hover:scale-110 duration-200'
                          >
                            Deals
                          </Link>
                        </>
                      )}
                      <button
                        onClick={logoutHandler}
                        className='hover:px-3 hover:py-2 xl:hover:px-7 xl:hover:py-2.5 w-min
            outline-black rounded-full hover:bg-strongYellow hover:outline hover:scale-110 duration-200 text-left'
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  className='px-4 py-1 text-lg text-black
                                outline outline-strongYellow rounded-full hover:scale-110 duration-200'
                  onClick={() => dispatch(setAuthModalActive(true))}
                >
                  Sign In
                </button>
              </>
            )}
          </div>

          {/* Mobile Search */}
          <form
            onSubmit={mobileSearchHandler}
            className='absolute -mt-1 -mr-3 right-20 lg:hidden flex w-full max-w-[19rem] pl-20 sm:max-w-sm md:max-w-md'
          >
            <input
              type='text'
              name='q'
              placeholder={`${mobileSearchShown ? 'Search' : ''}`}
              className={`flex-1 bg-transparent focus:outline-none duration-200 md:mr-1 ${
                mobileSearchShown && 'border-b-2 border-black duraion-100'
              }`}
              onChange={(e) => setKeyword(e.target.value)}
              value={keyword}
              disabled={!mobileSearchShown}
            />
            <button
              onClick={() => setMobileSearchShown((current) => !current)}
              type='submit'
              className='pr-5 pl-1 text-2xl font-light bg-transparent hover:text-strongYellow hover:scale-110 duration-100'
            >
              <FaSearch className='' />
            </button>
          </form>
          <Link
            className='absolute lg:hidden right-14 -mr-1.5 -mt-1.5 hover:text-strongYellow hover:scale-110 duration-100'
            to='/favorites'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.3}
              stroke='currentColor'
              className='w-8'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z'
              />
            </svg>
            {favoriteItems.length > 0 && (
              <div className='absolute border-2 border-white rounded-full bg-strongYellow text-white text-xs right-0 -mt-[1.2rem] w-5 flex justify-center items-center'>
                {favoriteItems.length}
              </div>
            )}
          </Link>

          {/* Mobile Menu */}
          <div
            ref={menuRef}
            className={`absolute top-3 right-1 flex flex-col items-end py-4 pr-4 duration-200 ${
              isActive && 'border-2 border-black rounded-3xl bg-white z-30'
            }`}
          >
            {/* Hamburger Button */}
            <button
              onClick={() => setIsActive((current) => !current)}
              className={`hamburger lg:hidden focus:outline-none ${
                isActive && 'open text-strongYellow'
              }`}
              type='button'
            >
              <span className='hamburger-top'></span>
              <span className='hamburger-middle'></span>
              <span className='hamburger-bottom'></span>
            </button>
            {/* Mobile Menu Items */}
            <div
              className={`pl-32 mt-8 ${
                isActive ? 'flex flex-col items-end duration-200' : 'hidden'
              }`}
            >
              <div className='flex flex-col items-end space-y-7 text-black text-2xl'>
                {/* <Link
                  to='/sneakers'
                  className='hover:px-3 hover:py-2
            outline-black rounded-full hover:bg-strongYellow hover:outline hover:scale-110 duration-200'
                >
                  Sneakers
                </Link>
                <Link
                  to='/clothes'
                  className='hover:px-3 hover:py-2
            outline-black rounded-full hover:bg-strongYellow hover:outline hover:scale-110 duration-200'
                >
                  Apparel
                </Link> */}
                <Link
                  to='/about'
                  onClick={() => setIsActive(false)}
                  className='hover:px-3 hover:py-2
            outline-black rounded-full hover:bg-strongYellow hover:outline hover:scale-110 duration-200'
                >
                  About us
                </Link>
                <Link
                  to='/support'
                  onClick={() => setIsActive(false)}
                  className='hover:px-3 hover:py-2 text-black
            outline-black rounded-full hover:bg-strongYellow hover:outline hover:scale-110 duration-200'
                >
                  Support
                </Link>
                {userInfo ? (
                  <>
                    <Link
                      to='/profile'
                      onClick={() => setIsActive(false)}
                      className='hover:px-3 hover:py-2 text-black
                    outline-black rounded-full hover:bg-strongYellow hover:outline hover:scale-110 duration-200'
                    >
                      My account
                    </Link>
                    {userInfo.isAdmin && (
                      <>
                        <Link
                          to='/admin/productList'
                          onClick={() => setIsActive(false)}
                          className='hover:px-3 hover:py-2 text-orange-500
                    outline-black rounded-full hover:bg-strongYellow hover:outline hover:scale-110 duration-200'
                        >
                          Products
                        </Link>
                        <Link
                          to='/admin/userList'
                          onClick={() => setIsActive(false)}
                          className='hover:px-3 hover:py-2 text-orange-500
                    outline-black rounded-full hover:bg-strongYellow hover:outline hover:scale-110 duration-200'
                        >
                          Users
                        </Link>
                        <Link
                          to='/admin/dealList'
                          onClick={() => setIsActive(false)}
                          className='hover:px-3 hover:py-2 text-orange-500
                    outline-black rounded-full hover:bg-strongYellow hover:outline hover:scale-110 duration-200'
                        >
                          Deals
                        </Link>
                      </>
                    )}
                    <button
                      onClick={logoutHandler}
                      className='hover:px-3 hover:py-2
            outline-black rounded-full hover:bg-strongYellow hover:outline hover:scale-110 duration-200'
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className='px-4 py-1 text-lg text-black
                                outline outline-strongYellow rounded-full hover:scale-110 duration-200'
                      onClick={() => dispatch(setAuthModalActive(true))}
                    >
                      Sign In
                    </button>
                  </>
                )}
              </div>
              <div className='flex space-x-2 mt-20 mb-4 text-3xl'>
                <FaInstagram />
                <FaVk />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
export default Header;
