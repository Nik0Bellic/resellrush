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

const generateSequentialDate = (daysToAdd) => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 1);
  date.setDate(date.getDate() + daysToAdd);
  return date;
};

const lastSales = [];

for (let i = 0; i < 1000; i++) {
  lastSales.push({
    size: getRandomSize(),
    price: getRandomPrice(),
    createdAt: generateSequentialDate(i),
  });
}

// Sort the array in ascending order based on the createdAt field
lastSales.sort((a, b) => a.createdAt - b.createdAt);

export default lastSales;
