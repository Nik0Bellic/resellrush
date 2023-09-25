import { Helmet } from 'react-helmet-async';

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keywords' content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: 'Welcome to ResellRush',
  description:
    'The stock-model marketplace for sneakers and apparel, where top deals and authenticity are guaranteed.',
  keywords: 'sneakers, apparel, stock, top offers',
};

export default Meta;
