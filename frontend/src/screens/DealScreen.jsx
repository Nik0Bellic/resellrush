import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import {
  useGetDealDetailsQuery,
  useUploadShippingImageMutation,
  useUpdateDealToSentBySellerMutation,
  useUpdateDealToVerificationInProgressMutation,
  useUpdateDealToVerifiedMutation,
  useUpdateDealToSentToBuyerMutation,
  useUpdateDealToShippedMutation,
} from '../slices/dealsApiSlice';
import Dropzone from 'react-dropzone';

const DealScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const { id: dealId } = useParams();

  const {
    data: deal,
    refetch,
    isLoading,
    error,
  } = useGetDealDetailsQuery(dealId);

  const [shippingImage, setShippingImage] = useState('');

  const [file, setFile] = useState(null);

  const [uploadShippingImage, { isLoading: loadingUpload }] =
    useUploadShippingImageMutation();
  const [imageUploaded, setImageUploaded] = useState(false);
  const [imageUploadError, setImageUploadError] = useState('');

  const [updateDealToSentBySeller, { isLoading: loadingBySeller }] =
    useUpdateDealToSentBySellerMutation();
  const [
    updateDealToVerificationInProgress,
    { isLoading: loadingVerification },
  ] = useUpdateDealToVerificationInProgressMutation();
  const [updateDealToVerified, { isLoading: loadingVerify }] =
    useUpdateDealToVerifiedMutation();
  const [updateDealToSentToBuyer, { isLoading: loadingToBuyer }] =
    useUpdateDealToSentToBuyerMutation();
  const [updateDealToShipped, { isLoading: loadingShipped }] =
    useUpdateDealToShippedMutation();

  useEffect(() => {
    return () => {
      if (shippingImage) {
        URL.revokeObjectURL(shippingImage);
      }
    };
  }, [shippingImage]);

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const fileType = file.type;

    if (/image\/jpe?g|image\/png|image\/webp/.test(fileType)) {
      setFile(file);
      setShippingImage(URL.createObjectURL(file));
      setImageUploadError('');
    } else {
      setImageUploadError(
        'Please upload a valid image file (jpg, jpeg, png, webp).'
      );
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setImageUploadError('Please select an image to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      await uploadShippingImage(formData);
      await updateDealToSentBySeller(deal.offerId);
      refetch();
      setImageUploaded(true);
    } catch (error) {
      setImageUploadError(error.message || 'Failed to upload image.');
    }
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant='Error' text={error?.data?.message || error.error} />
  ) : (
    <>
      {deal.status && (
        <Message variant='Success' text={`Mathed on ${deal.createdAt}`} />
      )}
      <>
        <div className='flex justify-between my-8 lg:my-12'>
          <div>
            <div className='text-xl font-semibold'>{deal.dealItem.name}</div>
            <div className='opacity-50'>{deal.dealItem.color}</div>
          </div>
          <div className='flex flex-col'>
            <div className='opacity-50 text-sm text-right'>Selected Size:</div>
            <div className='font-bold text-3xl md:text-4xl'>
              US M {deal.size}
            </div>
          </div>
        </div>
        <div className='mt-10 grid grid-cols-2 gap-5 sm:gap-7 lg:gap-20'>
          <div className='mt-3 max-w-md'>
            <img
              src={deal.dealItem.image}
              alt={deal.dealItem.name + ' ' + deal.dealItem.color}
            />
          </div>
          <div className='flex flex-col space-y-4 w-full max-w-md'>
            <div className='font-bold text-2xl'>Deal</div>
            <div className='-mt-3'>
              <strong>Deal ID: </strong>
              {deal.offerId}
            </div>
            {userInfo && <div>Deal Status: {deal.status}</div>}
            <div className='flex'>
              <strong>Deal Price:</strong>
              <div className='font-bold ml-2'>${deal.price}</div>
            </div>

            <div className='pt-8 lg:pt-10 flex flex-col space-y-3 lg:space-y-4 w-full'>
              {loadingUpload && <Loader />}
              {loadingBySeller && <Loader />}

              {userInfo && userInfo._id === deal.seller && (
                <>
                  {imageUploaded && (
                    <Message
                      variant='Success'
                      text='Shipping Ticket Uploaded Successfully'
                      small={true}
                    />
                  )}
                  {deal.status === 'Matched' && (
                    <>
                      <div className='font-semibold lg:text-lg'>
                        Upload Shipping Service Ticket
                      </div>
                      <Dropzone onDrop={handleDrop}>
                        {({ getRootProps, getInputProps }) => (
                          <section>
                            <div {...getRootProps()}>
                              <input {...getInputProps()} />
                              <p className='border-2 border-black rounded-lg py-16 text-center cursor-pointer'>
                                Drag Image or Click to Browse
                              </p>
                            </div>
                          </section>
                        )}
                      </Dropzone>
                    </>
                  )}
                  {deal.status === 'Matched' && shippingImage && (
                    <>
                      <img src={shippingImage} alt='Shipping Ticket' />
                      <button
                        className='border-2 border-black rounded-full px-5 py-2 hover:border-strongYellow hover:scale-105 duration-200 w-min whitespace-nowrap'
                        onClick={handleUpload}
                      >
                        Upload Shipping Ticket
                      </button>
                    </>
                  )}
                  {imageUploadError && (
                    <Message
                      variant='Error'
                      text={imageUploadError}
                      small={true}
                    />
                  )}
                </>
              )}

              {loadingVerification && <Loader />}

              {userInfo &&
                userInfo.isAdmin &&
                deal.status === 'Sent By Seller' && (
                  <button
                    type='button'
                    className='px-3 py-2 text-black
                  border-orange-600 border-2 rounded-lg hover:bg-strongYellow hover:border hover:scale-110 duration-200 w-full'
                    onClick={async () => {
                      await updateDealToVerificationInProgress(deal.offerId);
                      refetch();
                    }}
                  >
                    Update Deal Status To Verification In Progress
                  </button>
                )}

              {loadingVerify && <Loader />}

              {userInfo &&
                userInfo.isAdmin &&
                deal.status === 'Verification In Progress' && (
                  <button
                    type='button'
                    className='px-3 py-2 text-black
                  border-orange-600 border-2 rounded-lg hover:bg-strongYellow hover:border hover:scale-110 duration-200 w-full'
                    onClick={async () => {
                      await updateDealToVerified(deal.offerId);
                      refetch();
                    }}
                  >
                    Update Deal Status To Item Verified
                  </button>
                )}

              {loadingToBuyer && <Loader />}

              {userInfo &&
                userInfo.isAdmin &&
                deal.status === 'Item Verified' && (
                  <button
                    type='button'
                    className='px-3 py-2 text-black
                  border-orange-600 border-2 rounded-lg hover:bg-strongYellow hover:border hover:scale-110 duration-200 w-full'
                    onClick={async () => {
                      await updateDealToSentToBuyer(deal.offerId);
                      refetch();
                    }}
                  >
                    Update Deal Status To Sent To Buyer
                  </button>
                )}

              {loadingShipped && <Loader />}

              {userInfo &&
                userInfo.isAdmin &&
                deal.status === 'Sent To Buyer' && (
                  <button
                    type='button'
                    className='px-3 py-2 text-black
                  border-orange-600 border-2 rounded-lg hover:bg-strongYellow hover:border hover:scale-110 duration-200 w-full'
                    onClick={async () => {
                      await updateDealToShipped(deal.offerId);
                      refetch();
                    }}
                  >
                    Update Deal Status To Shipped
                  </button>
                )}
            </div>
          </div>
        </div>
      </>
    </>
  );
};
export default DealScreen;
