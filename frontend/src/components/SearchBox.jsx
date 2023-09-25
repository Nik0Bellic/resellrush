import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const SearchBox = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();
  const [keyword, setKeyword] = useState(urlKeyword || '');

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      setKeyword('');
      navigate(`/search/${keyword}`);
    } else {
      navigate('/');
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      className='flex border-2 border-black rounded-full'
    >
      <input
        type='text'
        name='q'
        placeholder='Search'
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        className='py-1 pl-5 rounded-full rounded-r-none border-r-2 border-black focus:outline-none'
      />
      <button
        type='submit'
        className='px-5 text-xl font-light rounded-full rounded-l-none bg-transparent border-none hover:text-strongYellow hover:scale-110 duration-100'
      >
        <FaSearch />
      </button>
    </form>
  );
};
export default SearchBox;
