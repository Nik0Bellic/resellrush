import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import {
  useGetOrderDetailsQuery,
  useGetPayPalClientIdQuery,
  usePayOrderMutation,
} from '../slices/ordersApiSlice';

const OrderScreen = () => {
  const [paymentMessage, setPaymentMessage] = useState('');

  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPaypal,
  } = useGetPayPalClientIdQuery();

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        setPaymentMessage('Payment successful');
      } catch (err) {
        setPaymentMessage(err?.data?.message || err.message);
      }
    });
  }

  async function onApproveTest() {
    await payOrder({ orderId, details: { payer: {} } });
    refetch();
    setPaymentMessage('Payment successful');
    setTimeout(() => setPaymentMessage(''), 10000);
  }

  function onError(err) {
    setPaymentMessage(err.message);
    setTimeout(() => setPaymentMessage(''), 10000);
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: order.totalPrice,
            },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  }

  useEffect(() => {
    if (!errorPaypal && !loadingPayPal && paypal.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': paypal.clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPayPalScript();
        }
      }
    }
  }, [order, paypal, paypalDispatch, loadingPayPal, errorPaypal]);

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant='Error' text={error?.data?.message || error.error} />
  ) : (
    <>
      {order.isPaid ? (
        <Message variant='Success' text={`Paid on ${order.paidAt}`} />
      ) : (
        <Message variant='Warning' text='Not Paid' />
      )}
      {order.isPaid &&
        (order.isDelivered ? (
          <Message
            variant='Success'
            text={`Delivered on ${order.deliveredAt}`}
          />
        ) : (
          <Message variant='Warning' text='Not Delivered' />
        ))}
      <div className='container mx-auto px-6 md:max-w-3xl lg:max-w-6xl lg:px-28 xl:px-6'>
        <div className='flex justify-between my-8 lg:my-12'>
          <div>
            <div className='text-xl font-semibold'>{order.orderItem.name}</div>
            <div className='opacity-50'>{order.orderItem.color}</div>
          </div>
          <div className='flex flex-col'>
            <div className='opacity-50 text-sm text-right'>Selected Size:</div>
            <div className='font-bold text-3xl md:text-4xl'>
              US M {order.orderItem.size}
            </div>
          </div>
        </div>
        <div className='mt-10 grid grid-cols-2 gap-5 sm:gap-7 lg:gap-20'>
          <div className='mt-3 max-w-md'>
            <img
              src={order.orderItem.image}
              alt={order.orderItem.name + ' ' + order.orderItem.color}
            />
          </div>
          <div className='flex flex-col space-y-4 w-full max-w-md'>
            <div className='font-bold text-xl mb-3'>Order</div>
            <p>
              <strong>Full Name: </strong> {order.shippingInfo.firstName}{' '}
              {order.shippingInfo.lastName}
            </p>
            <p>
              <strong>Email: </strong> {order.user.email}
            </p>
            <p>
              <strong>Address: </strong> {order.shippingInfo.address},{' '}
              {order.shippingInfo.city}, {order.shippingInfo.region},{' '}
              {order.shippingInfo.country} {order.shippingInfo.postalCode}
            </p>
            <p>
              <strong>Shipping: </strong> {order.shippingInfo.shippingService}
            </p>
            <p>
              <strong>Payment Method: </strong> {order.paymentMethod}
            </p>
            {order.shippingInfo.orderComments && (
              <div>
                <strong>Order Comments: </strong>
                <div className='break-words'>
                  {order.shippingInfo.orderComments}
                </div>
              </div>
            )}

            <div className='pt-2 lg:pt-3 flex flex-col space-y-3 lg:space-y-4 w-full sm:w-60 lg:w-72'>
              <div className='flex justify-between items-center text-sm lg:text-lg border-b-2 border-black pb-1 mx-0.5'>
                <div>Your Purchase Price:</div>
                <div className='font-bold ml-2'>${order.purchasePrice}</div>
              </div>
              <div className='flex justify-between items-center text-sm lg:text-lg border-b-2 border-black pb-1 mx-0.5'>
                <div>Processing Fee:</div>
                <div className='font-bold ml-2'>${order.processingFee}</div>
              </div>
              <div className='flex justify-between items-center text-sm lg:text-lg border-b-2 border-black pb-1 mx-0.5'>
                <div>Shipping:</div>
                <div className='font-bold ml-2'>${order.shippingPrice}</div>
              </div>
              <div className='flex justify-between items-center text-sm lg:text-lg border-b-2 border-black pb-1 mx-0.5'>
                <div>Total:</div>
                <div className='font-bold ml-2'>${order.totalPrice}</div>
              </div>
            </div>

            {!order.isPaid && (
              <>
                {loadingPay && <Loader />}

                {isPending ? (
                  <Loader />
                ) : (
                  <div>
                    {/* <button
                      className='px-6 py-2 my-5 border-2 border-black rounded-full hover:border-strongYellow'
                      onClick={onApproveTest}
                    >
                      Test Pay Order
                    </button> */}
                    <div>
                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                      ></PayPalButtons>
                    </div>
                  </div>
                )}
              </>
            )}
            {paymentMessage && (
              <Message
                variant={
                  paymentMessage === 'Payment successful' ? 'Success' : 'Error'
                }
                text={paymentMessage}
                small={true}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default OrderScreen;
