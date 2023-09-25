import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import {
  useUpdateProductMutation,
  useGetProductDetailsQuery,
  useUploadProductImageMutation,
  useDeleteProductMutation,
} from '../../slices/productsApiSlice';
import Dropzone from 'react-dropzone';

const ProductEditScreen = () => {
  const { productId } = useParams();

  const navigate = useNavigate();

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

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  const [uploadProductImage] = useUploadProductImageMutation();

  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();

  const [deleteError, setDeleteError] = useState('');

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteProduct(id);
        navigate('/admin/productList', {
          state: { message: 'Product deleted' },
        });
      } catch (err) {
        setDeleteError(err?.data?.message || err.error);
        setTimeout(() => setDeleteError(''), 10000);
      }
    }
  };

  useEffect(() => {
    if (product) {
      setName(product.name);
      setColor(product.color);
      setImage(product.image);
      setCategory(product.category);
      setBrand(product.brand);
      setModelLine(product.modelLine);
      setSeries(product.series);
      setHeight(product.height);
      setStyle(product.style);
      setColorway(product.colorway);
      setRetailPrice(product.retailPrice);
      setReleaseData(product.releaseData);
      setDescription(product.description);
    }
  }, [product]);

  const [editError, setEditError] = useState('');
  const [imageUploadError, setImageUploadError] = useState('');

  const submitHandler = async (e) => {
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
    }

    const updatedProduct = {
      productId,
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
    };

    const result = await updateProduct(updatedProduct);
    refetch();
    if (result.error) {
      setEditError(result.error);
      setTimeout(() => setEditError(''), 10000);
    } else {
      navigate('/admin/productList', {
        state: { message: 'Product updated' },
      });
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
    setFile(acceptedFiles[0]);
    setImage(URL.createObjectURL(acceptedFiles[0]));
  };

  return (
    <div className='container mx-auto px-6 md:max-w-3xl lg:max-w-6xl lg:px-28 xl:px-6'>
      <div className='mt-8 lg:mt-12'>
        <Link
          to='/admin/productList'
          className='border-2 border-black text-center px-4 sm:px-5 lg:px-8 xl:px-10 py-1.5 sm:py-2 xl:py-3 rounded-full hover:scale-110 hover:border-strongYellow active:bg-strongYellow active:border-black duration-200'
        >
          Go Back
        </Link>
      </div>
      <div className='mt-8 lg:mt-12 font-bold text-xl sm:text-2xl lg:text-3xl max-w-xl mx-auto'>
        Edit Product
      </div>
      {loadingUpdate && <Loader />}
      {loadingDelete && <Loader />}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='Error' text={error} />
      ) : (
        <form
          onSubmit={submitHandler}
          className='mt-5 flex flex-col space-y-4 max-w-xl mx-auto'
        >
          <div>
            <div className='font-medium opacity-25 text-xs'>Name</div>
            <input
              type='text'
              placeholder='Name'
              required={true}
              onChange={(e) => setName(e.target.value)}
              value={name || ''}
              className='text-sm sm:text-base lg:text-lg pb-1 w-full focus:outline-none border-b-2 border-black'
            />
          </div>
          <div>
            <div className='font-medium opacity-25 text-xs'>Color</div>
            <input
              type='text'
              placeholder='Color'
              required={true}
              onChange={(e) => setColor(e.target.value)}
              value={color || ''}
              className='text-sm sm:text-base lg:text-lg pb-1 w-full focus:outline-none border-b-2 border-black'
            />
          </div>
          <div>
            <div className='font-medium opacity-25 text-xs'>Image</div>
            {image && <img src={image} alt='Uploaded' />}
            <Dropzone onDrop={handleDrop}>
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p className='border-2 border-black rounded-lg py-16 text-center cursor-pointer'>
                      Drag Files or Click to Browse
                    </p>
                  </div>
                </section>
              )}
            </Dropzone>
            {imageUploadError && (
              <Message variant='Error' text={imageUploadError} />
            )}
          </div>
          <div>
            <div className='font-medium opacity-25 text-xs'>Category</div>
            <input
              type='text'
              placeholder='Category'
              required={true}
              onChange={(e) => setCategory(e.target.value)}
              value={category || ''}
              className='text-sm sm:text-base lg:text-lg pb-1 w-full focus:outline-none border-b-2 border-black'
            />
          </div>
          <div>
            <div className='font-medium opacity-25 text-xs'>Brand</div>
            <input
              type='text'
              placeholder='Brand'
              onChange={(e) => setBrand(e.target.value)}
              value={brand || ''}
              className='text-sm sm:text-base lg:text-lg pb-1 w-full focus:outline-none border-b-2 border-black'
            />
          </div>
          <div>
            <div className='font-medium opacity-25 text-xs'>Model Line</div>
            <input
              type='text'
              placeholder='Model Line'
              onChange={(e) => setModelLine(e.target.value)}
              value={modelLine || ''}
              className='text-sm sm:text-base lg:text-lg pb-1 w-full focus:outline-none border-b-2 border-black'
            />
          </div>
          <div>
            <div className='font-medium opacity-25 text-xs'>Series</div>
            <input
              type='text'
              placeholder='Series'
              onChange={(e) => setSeries(e.target.value)}
              value={series || ''}
              className='text-sm sm:text-base lg:text-lg pb-1 w-full focus:outline-none border-b-2 border-black'
            />
          </div>
          <div>
            <div className='font-medium opacity-25 text-xs'>Height</div>
            <input
              type='text'
              placeholder='Height'
              onChange={(e) => setHeight(e.target.value)}
              value={height || ''}
              className='text-sm sm:text-base lg:text-lg pb-1 w-full focus:outline-none border-b-2 border-black'
            />
          </div>
          <div>
            <div className='font-medium opacity-25 text-xs'>Style</div>
            <input
              type='text'
              placeholder='Style'
              required={true}
              onChange={(e) => setStyle(e.target.value)}
              value={style || ''}
              className='text-sm sm:text-base lg:text-lg pb-1 w-full focus:outline-none border-b-2 border-black'
            />
          </div>
          <div>
            <div className='font-medium opacity-25 text-xs'>Colorway</div>
            <input
              type='text'
              placeholder='Colorway'
              required={true}
              onChange={(e) => setColorway(e.target.value)}
              value={colorway || ''}
              className='text-sm sm:text-base lg:text-lg pb-1 w-full focus:outline-none border-b-2 border-black'
            />
          </div>
          <div>
            <div className='font-medium opacity-25 text-xs'>Retail Price</div>
            <input
              type='number'
              placeholder='Retail Price'
              onChange={(e) => setRetailPrice(e.target.value)}
              value={retailPrice || ''}
              className='text-sm sm:text-base lg:text-lg pb-1 w-full focus:outline-none border-b-2 border-black'
            />
          </div>
          <div>
            <div className='font-medium opacity-25 text-xs'>Release Data</div>
            <input
              type='text'
              placeholder='Release Data'
              onChange={(e) => setReleaseData(e.target.value)}
              value={releaseData || ''}
              className='text-sm sm:text-base lg:text-lg pb-1 w-full focus:outline-none border-b-2 border-black'
            />
          </div>
          <div>
            <div className='font-medium opacity-25 text-xs'>Description</div>
            <textarea
              placeholder='Description'
              onChange={(e) => setDescription(e.target.value)}
              value={description || ''}
              rows='10'
              className='mt-1.5 border-2 rounded-md border-black text-sm sm:text-base lg:text-lg w-full p-1.5 focus:outline-none'
            />
          </div>

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
              onClick={() => deleteHandler(productId)}
              className='mt-4 px-8 py-2 text-red-600
              border-red-600 border-2 rounded-full hover:bg-strongYellow hover:border hover:scale-110 duration-200'
            >
              Delete
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
export default ProductEditScreen;
