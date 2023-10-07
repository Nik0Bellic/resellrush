const SupportScreen = () => {
  return (
    <>
      <div className='font-bold text-2xl mt-10 mb-2'>Resell Rush Support</div>
      <div>
        At Resell Rush, we're dedicated to ensuring that every user has a
        seamless experience on our platform. Whether you're a buyer, a seller,
        or just browsing, your satisfaction is paramount to us. If you encounter
        any issues or have questions, our dedicated support team is here to
        assist.
      </div>
      <div className='font-semibold text-xl mt-5 mb-2'>Contact Us</div>
      <div>
        For any inquiries, concerns, or feedback, please reach out to us
        directly:
      </div>
      <div className='flex space-x-2 my-1'>
        <div className='font-medium'>Email:</div>
        <a href={'mailto:resellrush@outlook.com'} className='text-strongYellow'>
          resellrush@outlook.com
        </a>
      </div>
      <div>
        Our support team aims to respond to all emails within 24 hours. To
        expedite the support process, please provide as much detail as possible
        in your email.
      </div>
      <div className='font-semibold text-xl mt-5 mb-2'>
        Tips for a Smooth Experience
      </div>
      <div className='flex flex-col space-y-3'>
        <div>
          <span className='font-medium mr-2'>Account Details:</span>
          Ensure your Resell Rush profile is up-to-date with accurate
          information. This helps us assist you more efficiently.
        </div>
        <div>
          <span className='font-medium mr-2'>Product Details:</span>
          If your query pertains to a specific product listing or a price you've
          set, please provide the product name or any other relevant details.
        </div>
        <div>
          <span className='font-medium mr-2'>Feedback:</span>
          We're always striving to enhance our platform. If you have suggestions
          or feedback, we'd love to hear from you.
        </div>
      </div>
      <div className='font-semibold text-xl mt-5 mb-2'>Stay Connected</div>
      <div>
        For the latest updates, news, and announcements, follow us on our social
        media channels and subscribe to our newsletter.
      </div>
    </>
  );
};
export default SupportScreen;
