import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import {
  useUpdateUserMutation,
  useGetUserDetailsQuery,
  useDeleteUserMutation,
} from '../../slices/usersApiSlice';

const UserEditScreen = () => {
  const { id: userId } = useParams();

  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    data: user,
    isLoading,
    refetch,
    error,
  } = useGetUserDetailsQuery(userId);

  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

  const [deleteError, setDeleteError] = useState('');

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteUser(id);
        navigate('/admin/userList', {
          state: { message: 'User deleted' },
        });
      } catch (err) {
        setDeleteError(err?.data?.message || err.error);
        setTimeout(() => setDeleteError(''), 10000);
      }
    }
  };

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  const [editError, setEditError] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await updateUser({ userId, firstName, lastName, email, isAdmin });
      refetch();
      navigate('/admin/userList', {
        state: { message: 'User updated successfully' },
      });
    } catch (err) {
      setEditError(err?.data?.message || err.error);
      setTimeout(() => setEditError(''), 10000);
    }
  };

  return (
    <>
      <div className='mt-8 lg:mt-12'>
        <Link
          to='/admin/userList'
          className='border-2 border-black text-center px-4 sm:px-5 lg:px-8 xl:px-10 py-1.5 sm:py-2 xl:py-3 rounded-full hover:scale-110 hover:border-strongYellow active:bg-strongYellow active:border-black duration-200'
        >
          Go Back
        </Link>
      </div>
      <div className='mt-8 lg:mt-12 font-bold text-xl sm:text-2xl lg:text-3xl max-w-xl mx-auto'>
        Edit User
      </div>
      {loadingUpdate && <Loader />}
      {loadingDelete && <Loader />}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='Error' text={error?.data?.message || error.error} />
      ) : (
        <form
          onSubmit={submitHandler}
          className='mt-5 flex flex-col space-y-4 max-w-xl mx-auto'
        >
          <div>
            <div className='font-medium opacity-25 text-xs'>First Name</div>
            <input
              type='text'
              placeholder='First Name'
              required={true}
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName || ''}
              className='text-sm sm:text-base lg:text-lg pb-1 w-full focus:outline-none border-b-2 border-black'
            />
          </div>
          <div>
            <div className='font-medium opacity-25 text-xs'>Last Name</div>
            <input
              type='text'
              placeholder='Last Name'
              required={true}
              onChange={(e) => setLastName(e.target.value)}
              value={lastName || ''}
              className='text-sm sm:text-base lg:text-lg pb-1 w-full focus:outline-none border-b-2 border-black'
            />
          </div>
          <div>
            <div className='font-medium opacity-25 text-xs'>Email</div>
            <input
              type='email'
              placeholder='Email'
              required={true}
              onChange={(e) => setEmail(e.target.value)}
              value={email || ''}
              className='text-sm sm:text-base lg:text-lg pb-1 w-full focus:outline-none border-b-2 border-black'
            />
          </div>
          <label className='inline-block relative cursor-pointer select-none peer pl-5 lg:pl-6'>
            Is Admin
            <input
              type='checkbox'
              id='fedEx'
              checked={isAdmin}
              onChange={() => setIsAdmin((cur) => !cur)}
              className='absolute opacity-0 cursor-pointer h-0 w-0 peer'
            />
            <span className='absolute mt-1 top-0 left-0 h-4 w-4 lg:h-5 lg:w-5 border-2 border-black rounded-md peer-hover:border-strongYellow peer-checked:border-black peer-checked:bg-strongYellow'></span>
          </label>

          {editError && (
            <Message variant='Error' text={editError} small={true} />
          )}
          {deleteError && (
            <Message variant='Error' text={deleteError} small={true} />
          )}

          <div className='flex justify-between'>
            <button
              type='submit'
              className='mt-4 border-2 border-black text-center text-lg px-8 py-2 md:text-xl rounded-full hover:scale-110 hover:border-strongYellow active:bg-strongYellow active:border-black duration-200'
            >
              Update
            </button>
            <button
              type='button'
              onClick={() => deleteHandler(userId)}
              className='mt-4 px-8 py-2 text-red-600
              border-red-600 border-2 rounded-full hover:bg-strongYellow hover:border hover:scale-110 duration-200'
            >
              Delete
            </button>
          </div>
        </form>
      )}
    </>
  );
};
export default UserEditScreen;
