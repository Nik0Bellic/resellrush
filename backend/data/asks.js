import { v4 as uuidv4 } from 'uuid';

const asks = [
  {
    size: 8,
    price: 300,
    askId: uuidv4(),
  },
  {
    size: 9,
    price: 200,
    askId: uuidv4(),
  },
  {
    size: '10,5',
    price: 300,
    askId: uuidv4(),
  },
  {
    size: 11,
    price: 200,
    askId: uuidv4(),
  },
  {
    size: 7,
    price: 200,
    askId: uuidv4(),
  },
  {
    size: 7,
    price: 300,
    askId: uuidv4(),
  },
  {
    size: 7,
    price: 200,
    askId: uuidv4(),
  },
];

export default asks;
