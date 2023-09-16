import {
  AiOutlineInfoCircle,
  AiOutlineCheck,
  AiOutlineWarning,
} from 'react-icons/ai';
import { VscError } from 'react-icons/vsc';

const Message = ({ variant, text }) => {
  let color;
  let icon;
  switch (variant) {
    case 'Info':
      color = '#696cff';
      icon = <AiOutlineInfoCircle />;
      break;
    case 'Success':
      color = '#1ba97c';
      icon = <AiOutlineCheck />;
      break;
    case 'Warning':
      color = '#cb8925';
      icon = <AiOutlineWarning />;
      break;
    case 'Error':
      color = '#ff5757';
      icon = <VscError />;
      break;
    default:
      color = '#696cff';
      icon = <AiOutlineInfoCircle />;
  }

  return (
    <div className='container mx-auto px-6 lg:px-28 my-7'>
      <div
        className={`w-full relative py-3 md:py-4 lg:py-5 flex items-center pl-5 rounded-md`}
        style={{
          backgroundColor: `${color}20`,
          color: `${color}E6`,
        }}
      >
        <span
          className={`absolute w-2 top-0 left-0 bottom-0 bg-[${color}] rounded-l-md`}
          style={{
            backgroundColor: color,
          }}
        ></span>
        <div className='text-2xl md:text-3xl ml-2 md:ml-3'>{icon}</div>
        <div className='text-sm md:text-base ml-2 mr-3 font-bold'>
          {variant}
        </div>
        <div className='md:text-lg'>{text}</div>
      </div>
    </div>
  );
};

Message.defaultProps = {
  variant: 'Info',
};

export default Message;