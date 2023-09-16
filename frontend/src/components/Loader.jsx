import spinner from '../assets/Spinner.gif';

function Loader() {
  return (
    <div>
      <img src={spinner} alt='loading...' width={250} className='mx-auto' />
    </div>
  );
}
export default Loader;
