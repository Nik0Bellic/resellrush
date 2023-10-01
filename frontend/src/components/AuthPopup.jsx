import spinner from '../assets/Spinner.gif';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation, useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials, setAuthModalActive } from '../slices/authSlice';
import Message from './Message';

const AuthPopup = () => {
  const { authModalActive } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div
      className={`w-[100vw] h-[100vh] bg-black bg-opacity-60 fixed top-0 left-0 flex justify-center items-center opacity-0 pointer-events-none duration-300 z-30 ${
        authModalActive && 'opacity-100 pointer-events-auto'
      }`}
      onClick={() => dispatch(setAuthModalActive(false))}
    >
      <div
        className={`border-2 border-black rounded-2xl p-6 bg-white scale-0 duration-500 w-72 md:w-80 lg:w-96 ${
          authModalActive && 'scale-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex justify-between border-2 border-black rounded-full relative h-12 md:h-[3.28rem] w-full md:text-lg lg:text-xl'>
          <input
            type='radio'
            id='signIn'
            name='auth'
            onClick={() => setIsSignUp(false)}
            className='peer hidden'
          />
          <label
            htmlFor='signIn'
            className={`cursor-pointer py-2.5 px-7 md:px-8 lg:px-10 absolute ${
              !isSignUp &&
              'border-2 border-black bg-strongYellow rounded-full -ml-0.5 -mt-0.5'
            }`}
          >
            Sign In
          </label>
          <input
            type='radio'
            id='signUp'
            name='auth'
            onClick={() => setIsSignUp(true)}
            className='peer hidden'
          />
          <label
            htmlFor='signUp'
            className={`cursor-pointer py-2.5 px-7 md:px-8 lg:px-10 absolute right-0 ${
              isSignUp &&
              'border-2 border-black bg-strongYellow rounded-full -mr-0.5 -mt-0.5'
            }`}
          >
            Sign Up
          </label>
        </div>

        <div className='md:text-lg lg:mt-7'>
          {isSignUp ? <SignUpForm /> : <SignInForm />}
        </div>
      </div>
    </div>
  );
};

const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const [loginError, setLoginError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      dispatch(setAuthModalActive(false));
    } catch (err) {
      setLoginError(err?.data?.message || err.error);
      setTimeout(() => setLoginError(''), 10000);
    }
  };

  return (
    <div className='mt-5'>
      {loginError && (
        <Message
          variant='Error'
          noLabel={true}
          text={loginError}
          small={true}
        />
      )}
      <form onSubmit={onSubmit} className='w-full'>
        <input
          type='email'
          placeholder='Email'
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          className='w-full border-b-2 border-black focus:outline-none placeholder:text-black pb-1'
        />
        <div className='flex justify-between border-b-2 border-black'>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder='Password'
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className='w-full focus:outline-none placeholder:text-black pb-1 mt-3 pr-1'
          />
          <button
            type='button'
            className='mt-1.5'
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-4'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88'
                />
              </svg>
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-4'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                />
              </svg>
            )}
          </button>
        </div>
        <div className='flex'>
          <Link
            className='text-xs md:text-sm text-right w-full mt-1.5'
            to='/forgot-password'
          >
            Forgot your password?
          </Link>
        </div>
        <button
          type='submit'
          className='mt-6 w-full border-2 border-black rounded-full py-2 hover:border-strongYellow hover:scale-105 active:bg-strongYellow active:border-black duration-100'
          disabled={isLoading}
        >
          {isLoading ? (
            <div>
              <img
                src={spinner}
                width={30}
                alt='loading...'
                className='mx-auto'
              />
            </div>
          ) : (
            'Sign In'
          )}
        </button>
        <div className='flex items-center my-4 opacity-25'>
          <div className='flex-1 border-t-2 border-black'></div>
          <span className='mx-2 text-lg md:text-xl -mt-1'>or</span>
          <div className='flex-1 border-t-2 border-black'></div>
        </div>
        <div className='flex flex-col space-y-2.5 text-xs md:text-sm'>
          <button className='flex justify-center items-center full border-2 border-black rounded-full py-2 md:py-2.5 hover:border-strongYellow hover:scale-105 active:bg-strongYellow active:border-black duration-100'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              x='0px'
              y='0px'
              width='18'
              height='18'
              viewBox='0 0 48 48'
              className='mr-2'
            >
              <path
                fill='#FFC107'
                d='M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z'
              ></path>
              <path
                fill='#FF3D00'
                d='M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z'
              ></path>
              <path
                fill='#4CAF50'
                d='M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z'
              ></path>
              <path
                fill='#1976D2'
                d='M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z'
              ></path>
            </svg>
            Continue With Google
          </button>
          <button className='flex justify-center items-center full border-2 border-black rounded-full py-2 md:py-2.5 hover:border-strongYellow hover:scale-105 active:bg-strongYellow active:border-black duration-100'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              x='0px'
              y='0px'
              width='18'
              height='18'
              viewBox='0 0 50 50'
              className='mr-1'
              fill='#4185f4'
            >
              <path d='M32,11h5c0.552,0,1-0.448,1-1V3.263c0-0.524-0.403-0.96-0.925-0.997C35.484,2.153,32.376,2,30.141,2C24,2,20,5.68,20,12.368 V19h-7c-0.552,0-1,0.448-1,1v7c0,0.552,0.448,1,1,1h7v19c0,0.552,0.448,1,1,1h7c0.552,0,1-0.448,1-1V28h7.222 c0.51,0,0.938-0.383,0.994-0.89l0.778-7C38.06,19.518,37.596,19,37,19h-8v-5C29,12.343,30.343,11,32,11z'></path>
            </svg>
            Continue With Facebook
          </button>
          <button className='flex justify-center items-center full border-2 border-black rounded-full py-2 md:py-2.5 hover:border-strongYellow hover:scale-105 active:bg-strongYellow active:border-black duration-100'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              x='0px'
              y='0px'
              width='18'
              height='18'
              viewBox='0 0 50 50'
              className='mr-1.5'
            >
              <path d='M 44.527344 34.75 C 43.449219 37.144531 42.929688 38.214844 41.542969 40.328125 C 39.601563 43.28125 36.863281 46.96875 33.480469 46.992188 C 30.46875 47.019531 29.691406 45.027344 25.601563 45.0625 C 21.515625 45.082031 20.664063 47.03125 17.648438 47 C 14.261719 46.96875 11.671875 43.648438 9.730469 40.699219 C 4.300781 32.429688 3.726563 22.734375 7.082031 17.578125 C 9.457031 13.921875 13.210938 11.773438 16.738281 11.773438 C 20.332031 11.773438 22.589844 13.746094 25.558594 13.746094 C 28.441406 13.746094 30.195313 11.769531 34.351563 11.769531 C 37.492188 11.769531 40.8125 13.480469 43.1875 16.433594 C 35.421875 20.691406 36.683594 31.78125 44.527344 34.75 Z M 31.195313 8.46875 C 32.707031 6.527344 33.855469 3.789063 33.4375 1 C 30.972656 1.167969 28.089844 2.742188 26.40625 4.78125 C 24.878906 6.640625 23.613281 9.398438 24.105469 12.066406 C 26.796875 12.152344 29.582031 10.546875 31.195313 8.46875 Z'></path>
            </svg>
            Continue With Apple
          </button>
          <button className='flex justify-center items-center full border-2 border-black rounded-full py-2 md:py-2.5 hover:border-strongYellow hover:scale-105 active:bg-strongYellow active:border-black duration-100'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              x='0px'
              y='0px'
              width='18'
              height='18'
              viewBox='0 0 50 50'
              className='mr-1.5'
            >
              <path d='M 6.9199219 6 L 21.136719 26.726562 L 6.2285156 44 L 9.40625 44 L 22.544922 28.777344 L 32.986328 44 L 43 44 L 28.123047 22.3125 L 42.203125 6 L 39.027344 6 L 26.716797 20.261719 L 16.933594 6 L 6.9199219 6 z'></path>
            </svg>
            Continue With Twitter
          </button>
        </div>
      </form>
    </div>
  );
};

const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const [register, { isLoading }] = useRegisterMutation();

  const [registerError, setRegisterError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await register({
        firstName,
        lastName,
        email,
        password,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      dispatch(setAuthModalActive(false));
    } catch (err) {
      setRegisterError(err?.data?.message || err.error);
      setTimeout(() => setRegisterError(''), 10000);
    }
  };

  return (
    <div className='mt-5'>
      {registerError && (
        <Message
          variant='Error'
          noLabel={true}
          text={registerError}
          small={true}
        />
      )}
      <form onSubmit={onSubmit} className='w-full'>
        <div className='flex flex-col space-y-3'>
          <input
            type='text'
            placeholder='First Name'
            onChange={(e) => setFirstName(e.target.value)}
            value={firstName}
            className='w-full border-b-2 border-black focus:outline-none placeholder:text-black pb-1'
          />
          <input
            type='text'
            placeholder='Last Name'
            onChange={(e) => setLastName(e.target.value)}
            value={lastName}
            className='w-full border-b-2 border-black focus:outline-none placeholder:text-black pb-1'
          />
          <input
            type='email'
            placeholder='Email'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className='w-full border-b-2 border-black focus:outline-none placeholder:text-black pb-1'
          />
        </div>
        <div className='flex justify-between border-b-2 border-black'>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder='Password'
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className='w-full focus:outline-none placeholder:text-black pb-1 mt-3 pr-1'
          />
          <button
            type='button'
            className='mt-1.5'
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-4'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88'
                />
              </svg>
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-4'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                />
              </svg>
            )}
          </button>
        </div>
        <button
          className='mt-6 w-full border-2 border-black rounded-full py-2 hover:border-strongYellow hover:scale-105 active:bg-strongYellow active:border-black duration-100'
          disabled={isLoading}
        >
          {isLoading ? (
            <div>
              <img
                src={spinner}
                width={30}
                alt='loading...'
                className='mx-auto'
              />
            </div>
          ) : (
            'Sign Up'
          )}
        </button>
        <div className='flex items-center my-4 opacity-25'>
          <div className='flex-1 border-t-2 border-black'></div>
          <span className='mx-2 text-lg md:text-xl -mt-1'>or</span>
          <div className='flex-1 border-t-2 border-black'></div>
        </div>
        <div className='flex flex-col space-y-2.5 text-xs md:text-sm'>
          <button className='flex justify-center items-center full border-2 border-black rounded-full py-2 md:py-2.5 hover:border-strongYellow hover:scale-105 active:bg-strongYellow active:border-black duration-100'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              x='0px'
              y='0px'
              width='18'
              height='18'
              viewBox='0 0 48 48'
              className='mr-2'
            >
              <path
                fill='#FFC107'
                d='M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z'
              ></path>
              <path
                fill='#FF3D00'
                d='M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z'
              ></path>
              <path
                fill='#4CAF50'
                d='M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z'
              ></path>
              <path
                fill='#1976D2'
                d='M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z'
              ></path>
            </svg>
            Continue With Google
          </button>
          <button className='flex justify-center items-center full border-2 border-black rounded-full py-2 md:py-2.5 hover:border-strongYellow hover:scale-105 active:bg-strongYellow active:border-black duration-100'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              x='0px'
              y='0px'
              width='18'
              height='18'
              viewBox='0 0 50 50'
              className='mr-1'
              fill='#4185f4'
            >
              <path d='M32,11h5c0.552,0,1-0.448,1-1V3.263c0-0.524-0.403-0.96-0.925-0.997C35.484,2.153,32.376,2,30.141,2C24,2,20,5.68,20,12.368 V19h-7c-0.552,0-1,0.448-1,1v7c0,0.552,0.448,1,1,1h7v19c0,0.552,0.448,1,1,1h7c0.552,0,1-0.448,1-1V28h7.222 c0.51,0,0.938-0.383,0.994-0.89l0.778-7C38.06,19.518,37.596,19,37,19h-8v-5C29,12.343,30.343,11,32,11z'></path>
            </svg>
            Continue With Facebook
          </button>
          <button className='flex justify-center items-center full border-2 border-black rounded-full py-2 md:py-2.5 hover:border-strongYellow hover:scale-105 active:bg-strongYellow active:border-black duration-100'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              x='0px'
              y='0px'
              width='18'
              height='18'
              viewBox='0 0 50 50'
              className='mr-1.5'
            >
              <path d='M 44.527344 34.75 C 43.449219 37.144531 42.929688 38.214844 41.542969 40.328125 C 39.601563 43.28125 36.863281 46.96875 33.480469 46.992188 C 30.46875 47.019531 29.691406 45.027344 25.601563 45.0625 C 21.515625 45.082031 20.664063 47.03125 17.648438 47 C 14.261719 46.96875 11.671875 43.648438 9.730469 40.699219 C 4.300781 32.429688 3.726563 22.734375 7.082031 17.578125 C 9.457031 13.921875 13.210938 11.773438 16.738281 11.773438 C 20.332031 11.773438 22.589844 13.746094 25.558594 13.746094 C 28.441406 13.746094 30.195313 11.769531 34.351563 11.769531 C 37.492188 11.769531 40.8125 13.480469 43.1875 16.433594 C 35.421875 20.691406 36.683594 31.78125 44.527344 34.75 Z M 31.195313 8.46875 C 32.707031 6.527344 33.855469 3.789063 33.4375 1 C 30.972656 1.167969 28.089844 2.742188 26.40625 4.78125 C 24.878906 6.640625 23.613281 9.398438 24.105469 12.066406 C 26.796875 12.152344 29.582031 10.546875 31.195313 8.46875 Z'></path>
            </svg>
            Continue With Apple
          </button>
          <button className='flex justify-center items-center full border-2 border-black rounded-full py-2 md:py-2.5 hover:border-strongYellow hover:scale-105 active:bg-strongYellow active:border-black duration-100'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              x='0px'
              y='0px'
              width='18'
              height='18'
              viewBox='0 0 50 50'
              className='mr-1.5'
            >
              <path d='M 6.9199219 6 L 21.136719 26.726562 L 6.2285156 44 L 9.40625 44 L 22.544922 28.777344 L 32.986328 44 L 43 44 L 28.123047 22.3125 L 42.203125 6 L 39.027344 6 L 26.716797 20.261719 L 16.933594 6 L 6.9199219 6 z'></path>
            </svg>
            Continue With Twitter
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthPopup;
