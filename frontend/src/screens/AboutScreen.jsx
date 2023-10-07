const AboutScreen = () => {
  return (
    <>
      <div className='font-extrabold text-2xl lg:text-3xl mt-10'>
        About Resell Rush
      </div>
      <div className='flex flex-col space-y-5 mt-6'>
        <div>
          <div className='font-bold text-xl lg:text-2xl mb-2'>Our Origin</div>
          <div>
            Born from the vision of simplifying the sneaker and streetwear
            resale market, Resell Rush emerged as a pioneering force in the
            industry. Recognizing the challenges faced by both buyers and
            sellers in traditional platforms, we sought to create a transparent
            and streamlined experience.
          </div>
        </div>
        <div>
          <div className='font-bold text-xl lg:text-2xl my-3'>
            How Resell Rush Works
          </div>
          <div className='flex flex-col space-y-5'>
            <div>
              <div className='font-semibold text-lg lg:text-xl mb-1.5'>
                Simplified Listings
              </div>
              <div>
                Sellers don't need to worry about photos or lengthy
                descriptions. Simply select the item you want to sell from our
                catalog and set your price.
              </div>
            </div>
            <div>
              <div className='font-semibold text-lg lg:text-xl mb-1.5'>
                Dynamic Pricing System
              </div>
              <div>
                At Resell Rush, we've transformed the traditional buying and
                selling experience. Here's how our system stands out:
                <ul className='list-disc list-inside my-4 space-y-3'>
                  <li>
                    <span className='font-medium'>Bids:</span> Buyers place bids
                    indicating their desired purchase price. If a seller's ask
                    matches this bid, the transaction is instantly executed.
                  </li>
                  <li>
                    <span className='font-medium'>Asks:</span> Sellers list
                    their items with an ask price. They can either wait for a
                    matching bid or sell immediately to an existing bid that
                    meets their price.
                  </li>
                  <li>
                    <span className='font-medium'>Transparent Pricing:</span>{' '}
                    With this system, the power is in the hands of the
                    community. Prices are determined by real-time demand and
                    supply, ensuring transparency and fair market value.
                  </li>
                </ul>
                This dynamic pricing model streamlines the transaction process,
                eliminating the need for negotiations and ensuring a seamless
                experience.
              </div>
            </div>
            <div>
              <div className='font-semibold text-lg lg:text-xl mb-1.5'>
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
          <div className='font-bold text-xl lg:text-2xl mt-4 mb-2'>
            Our Commitment
          </div>
          <div>
            We're dedicated to continuous improvement. As we grow, we pledge to
            introduce more features, enhance user experience, and ensure that
            Resell Rush remains the go-to platform for all your buying and
            selling needs.
          </div>
        </div>
        <div>
          <div className='font-bold text-xl lg:text-2xl mb-2'>
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
