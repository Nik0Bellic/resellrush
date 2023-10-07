import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import {
  useGetDealDetailsQuery,
  useUpdateDealToSentBySellerMutation,
  useUpdateDealToVerificationInProgressMutation,
  useUpdateDealToVerifiedMutation,
  useUpdateDealToSentToBuyerMutation,
  useUpdateDealToShippedMutation,
} from '../slices/dealsApiSlice';

const DealScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const { id: dealId } = useParams();

  const {
    data: deal,
    refetch,
    isLoading,
    error,
  } = useGetDealDetailsQuery(dealId);

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

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant='Error' text={error?.data?.message || error.error} />
  ) : (
    <>
      {deal.status && (
        <Message
          variant='Success'
          text={`Matched on ${new Date(deal.createdAt).toLocaleString()}`}
        />
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
            {userInfo && (
              <div>
                <strong>Deal Status: </strong>
                {deal.status}
              </div>
            )}
            <div className='flex'>
              <strong>Deal Price:</strong>
              <div className='font-bold ml-2'>${deal.price}</div>
            </div>

            <div className='pt-8 lg:pt-10 flex flex-col space-y-3 lg:space-y-4 w-full'>
              {userInfo && userInfo._id === deal.seller && (
                <div>
                  To verify that you've dispatched the item you must{' '}
                  <a
                    href={`mailto:resellrush@outlook.com?Subject=Ticket Receipt ${deal.offerId}`}
                    className='text-strongYellow'
                  >
                    send us
                  </a>{' '}
                  the shipping receipt within 48 hours of your ask being
                  matched. Ensure the receipt displays the Resell Rush
                  Verification address and matches the name in your Resell Rush
                  profile. <br />
                  <br />
                  The email containing the receipt must be sent from the email
                  address associated with your Resell Rush profile. Failure to
                  comply may result in penalty fees or account restrictions.
                  <br />
                  <br />
                  <span className='font-semibold'>
                    If you've received an email from us that your status has
                    changed, please log out and log back in to ensure your
                    account reflects the latest updates.
                  </span>
                </div>
              )}

              {loadingBySeller && <Loader />}

              {userInfo && userInfo.isAdmin && deal.status === 'Matched' && (
                <button
                  type='button'
                  className='px-3 py-2 text-black
                  border-orange-600 border-2 rounded-lg hover:bg-strongYellow hover:border hover:scale-110 duration-200 w-full'
                  onClick={async () => {
                    await updateDealToSentBySeller(deal.offerId);
                    refetch();
                  }}
                >
                  Update Deal Status To Sent By Seller
                </button>
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
