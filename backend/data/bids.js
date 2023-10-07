import { v4 as uuidv4 } from 'uuid';

const defaultSizes = [
  '3,5',
  '4',
  '4,5',
  '5',
  '5,5',
  '6',
  '6,5',
  '7',
  '7,5',
  '8',
  '8,5',
  '9',
  '9,5',
  '10',
  '10,5',
  '11',
  '11,5',
  '12',
  '12,5',
  '13',
  '14',
  '15',
  '16',
  '17',
];

const getRandomSize = () => {
  const randomIndex = Math.floor(Math.random() * defaultSizes.length);
  return defaultSizes[randomIndex];
};

const getRandomPrice = () => {
  return Math.floor(Math.random() * (300 - 100 + 1) + 100);
};

const bids = [];

for (let i = 0; i < 100; i++) {
  bids.push({
    size: getRandomSize(),
    price: getRandomPrice(),
    bidId: uuidv4(),
  });
}

export default bids;
