import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from '../../slices/productsApiSlice';
import Dropzone from 'react-dropzone';

const ProductCreateScreen = () => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [modelLine, setModelLine] = useState('');
  const [series, setSeries] = useState('');
  const [height, setHeight] = useState('');
  const [style, setStyle] = useState('');
  const [colorway, setColorway] = useState('');
  const [retailPrice, setRetailPrice] = useState('');
  const [releaseData, setReleaseData] = useState('');
  const [description, setDescription] = useState('');

  const [file, setFile] = useState(null);

  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

  const [uploadProductImage] = useUploadProductImageMutation();

  const [createError, setCreateError] = useState('');
  const [imageUploadError, setImageUploadError] = useState('');
  const [noImageMessage, setNoImageMessage] = useState('');

  const navigate = useNavigate();

  const createProductHandler = async (e) => {
    e.preventDefault();

    let updatedImage = image;

    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      try {
        const res = await uploadProductImage(formData).unwrap();
        updatedImage = res.image;
      } catch (err) {
        setImageUploadError(err?.data?.message || err.error);
        setTimeout(() => setImageUploadError(''), 10000);
        return;
      }
    } else {
      setNoImageMessage('Please Upload Image');
      setTimeout(() => setNoImageMessage(''), 10000);
      return;
    }

    try {
      await createProduct({
        name,
        color,
        image: updatedImage,
        category,
        brand,
        modelLine,
        series,
        height,
        style,
        colorway,
        retailPrice,
        releaseData,
        description,
      });
      navigate('/admin/productList', {
        state: { message: 'Product created' },
      });
    } catch (err) {
      setCreateError(err?.data?.message || err.error);
      setTimeout(() => setCreateError(false), 10000);
    }
  };

  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const fileType = file.type;

    if (/image\/jpe?g|image\/png|image\/webp/.test(fileType)) {
      setFile(file);
      setImage(URL.createObjectURL(file));
      setImageUploadError('');
    } else {
      setImageUploadError(
        'Please upload a valid image file (jpg, jpeg, png, webp).'
      );
    }
  };

  return (
    <>
      <div className='mt-8 lg:mt-12'>
        <Link
          to='/admin/productList'
          className='border-2 border-black text-center px-4 sm:px-5 lg:px-8 xl:px-10 py-1.5 sm:py-2 xl:py-3 rounded-full hover:scale-110 hover:border-strongYellow active:bg-strongYellow active:border-black duration-200'
        >
          Go Back
        </Link>
      </div>

      <form
        onSubmit={createProductHandler}
        className='mt-8 lg:mt-12 flex flex-col space-y-4 max-w-xl mx-auto'
      >
        <div className='mb-3 font-bold text-xl sm:text-2xl lg:text-3xl'>
          Create Product
        </div>
        <input
          type='text'
          placeholder='Name'
          required={true}
          onChange={(e) => setName(e.target.value)}
          value={name}
          className='text-sm sm:text-base lg:text-lg pb-1 w-full focus:outline-none border-b-2 border-black'
        />
        <input
          type='text'
          placeholder='Color'
          required={true}
          onChange={(e) => setColor(e.target.value)}
          value={color}
          className='text-sm sm:text-base lg:text-lg pb-1 w-full focus:outline-none border-b-2 border-black'
        />
        {image && <img src={image} alt='Uploaded' />}
        <Dropzone onDrop={handleDrop}>
          {({ getRootProps, getInputProps }) => (
            <section>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p
                  className={`border-2 border-black rounded-lg py-16 text-center cursor-pointer ${
                    noImageMessage && 'border-[#cb8925]'
                  }`}
                >
                  Drag Image or Click to Browse
                </p>
              </div>
            </section>
          )}
        </Dropzone>
        {imageUploadError && (
          <Message variant='Error' text={imageUploadError} small={true} />
        )}
        <input
          type='text'
          placeholder='Category'
          required={true}
          onChange={(e) => setCategory(e.target.value)}
          value={category}
          className='text-sm sm:text-base lg:text-lg pb-1 w-full focus:outline-none border-b-2 border-black'
        />
        <input
          type='text'
          placeholder='Brand'
          onChange={(e) => setBrand(e.target.value)}
          value={brand}
          className='text-sm sm:text-base lg:text-lg pb-1 w-full focus:outline-none border-b-2 border-black'
        />
        <input
          type='text'
          placeholder='Model Line'
          onChange={(e) => setModelLine(e.target.value)}
          value={modelLine}
          className='text-sm sm:text-base lg:text-lg pb-1 w-full focus:outline-none border-b-2 border-black'
        />
        <input
          type='text'
          placeholder='Series'
          onChange={(e) => setSeries(e.target.value)}
          value={series}
          className='text-sm sm:text-base lg:text-lg pb-1 w-full focus:outline-none border-b-2 border-black'
        />
        <input
          type='text'
          placeholder='Height'
          onChange={(e) => setHeight(e.target.value)}
          value={height}
          className='text-sm sm:text-base lg:text-lg pb-1 w-full focus:outline-none border-b-2 border-black'
        />
        <input
          type='text'
          placeholder='Style'
          required={true}
          onChange={(e) => setStyle(e.target.value)}
          value={style}
          className='text-sm sm:text-base lg:text-lg pb-1 w-full focus:outline-none border-b-2 border-black'
        />
        <input
          type='text'
          placeholder='Colorway'
          required={true}
          onChange={(e) => setColorway(e.target.value)}
          value={colorway}
          className='text-sm sm:text-base lg:text-lg pb-1 w-full focus:outline-none border-b-2 border-black'
        />
        <input
          type='number'
          placeholder='Retail Price'
          onChange={(e) => setRetailPrice(e.target.value)}
          value={retailPrice}
          className='text-sm sm:text-base lg:text-lg pb-1 w-full focus:outline-none border-b-2 border-black'
        />
        <input
          type='text'
          placeholder='Release Data'
          onChange={(e) => setReleaseData(e.target.value)}
          value={releaseData}
          className='text-sm sm:text-base lg:text-lg pb-1 w-full focus:outline-none border-b-2 border-black'
        />
        <textarea
          placeholder='Description'
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          rows='10'
          className='border-2 rounded-md border-black text-sm sm:text-base lg:text-lg w-full p-1.5 focus:outline-none'
        />

        {createError && (
          <Message variant='Error' text={createError} small={true} />
        )}

        {noImageMessage && (
          <Message
            variant='Warning'
            text={noImageMessage}
            small={true}
            noLabel={true}
          />
        )}

        <div>
          <button
            type='submit'
            className='mt-4 border-2 border-black text-center text-lg px-8 py-2 md:text-xl rounded-full hover:scale-110 hover:border-strongYellow active:bg-strongYellow active:border-black duration-200'
          >
            Create
          </button>
        </div>

        {loadingCreate && <Loader />}
      </form>
    </>
  );
};
export default ProductCreateScreen;
