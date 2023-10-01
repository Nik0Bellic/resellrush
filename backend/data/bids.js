import { v4 as uuidv4 } from 'uuid';

const bids = [
  {
    size: 7,
    price: 200,
    expiration: 1,
    bidId: uuidv4(),
  },
  {
    size: 10,
    price: 200,
    expiration: 3,
    bidId: uuidv4(),
  },
  {
    size: '10,5',
    price: 300,
    expiration: 7,
    bidId: uuidv4(),
  },
  {
    size: 12,
    price: 300,
    expiration: 14,
    bidId: uuidv4(),
  },
  {
    size: 6,
    price: 200,
    expiration: 30,
    bidId: uuidv4(),
  },
  {
    size: 7,
    price: 200,
    expiration: 60,
    bidId: uuidv4(),
  },
  {
    size: 7,
    price: 300,
    expiration: 30,
    bidId: uuidv4(),
  },
];

export default bids;
