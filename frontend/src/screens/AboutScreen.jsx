const AboutScreen = () => {
  return (
    <>
      <div className='font-bold text-2xl mt-10'>About Resell Rush</div>
      <div className='flex flex-col space-y-5 mt-6'>
        <div>
          <div className='font-semibold text-xl mb-2'>Our Origin</div>
          <div>
            Born from the vision of simplifying the sneaker and streetwear
            resale market, Resell Rush emerged as a pioneering force in the
            industry. Recognizing the challenges faced by both buyers and
            sellers in traditional platforms, we sought to create a transparent
            and streamlined experience.
          </div>
        </div>
        <div>
          <div className='font-semibold text-xl my-3'>
            How Resell Rush Works
          </div>
          <div className='flex flex-col space-y-3'>
            <div>
              <div className='font-medium text-lg mb-1.5'>
                Simplified Listings
              </div>
              <div>
                Sellers don't need to worry about photos or lengthy
                descriptions. Simply select the item you want to sell from our
                catalog and set your price.
              </div>
            </div>
            <div>
              <div className='font-medium text-lg mb-1.5'>
                Dynamic Pricing System
              </div>
              <div>
                We've revolutionized the buying and selling process. Buyers
                place bids, while sellers set asks. When a bid and ask meet, the
                sale is automatically executed, ensuring a seamless transaction
                and fair market value.
              </div>
            </div>
            <div>
              <div className='font-medium text-lg mb-1.5'>
                Authenticity First
              </div>
              <div>
                Every item sold on Resell Rush goes through a rigorous
                authentication process. Our team of experts ensures that only
                brand-new and genuine products reach the buyer, eliminating the
                risk of counterfeit items.
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className='font-semibold text-xl mt-4 mb-2'>Our Commitment</div>
          <div>
            We're dedicated to continuous improvement. As we grow, we pledge to
            introduce more features, enhance user experience, and ensure that
            Resell Rush remains the go-to platform for all your buying and
            selling needs.
          </div>
        </div>
        <div>
          <div className='font-semibold text-xl mb-2'>
            Be Part of the Resell Revolution
          </div>
          <div>
            Resell Rush is more than just a platform; it's a revolution in the
            resale industry. We invite you to join us, experience the
            difference, and be part of a community that values transparency,
            authenticity, and innovation.
          </div>
        </div>
      </div>
    </>
  );
};
export default AboutScreen;
