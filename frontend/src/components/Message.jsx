import { AiOutlineInfoCircle, AiOutlineCheck } from 'react-icons/ai';
import { VscError } from 'react-icons/vsc';
import { RiErrorWarningLine } from 'react-icons/ri';

const Message = ({ variant, text, small, noLabel }) => {
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
      icon = <RiErrorWarningLine />;
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
    <div
      className={`w-full relative py-3 md:py-4 lg:py-5 flex items-center rounded-md ${
        small ? 'px-2 text-sm mb-4' : 'px-5 my-7'
      }`}
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
      {!noLabel && (
        <div className='text-sm md:text-base mx-2 font-bold'>{variant}</div>
      )}
      <div className='md:text-lg ml-1'>{text}</div>
    </div>
  );
};

Message.defaultProps = {
  variant: 'Info',
  small: false,
  noLabel: false,
};

export default Message;
