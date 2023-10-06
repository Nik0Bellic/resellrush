const generateRandomPrice = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const generateSequentialDate = (daysToAdd) => {
  const date = new Date('2022-01-01'); // Starting date
  date.setDate(date.getDate() + daysToAdd); // Add days to the starting date
  return date;
};

const lastSales = Array.from({ length: 100 }, (_, index) => ({
  price: generateRandomPrice(100, 300),
  createdAt: generateSequentialDate(index), // This will generate dates sequentially starting from January 1, 2022.
}));

// Sort the array in ascending order based on the createdAt field
lastSales.sort((a, b) => a.createdAt - b.createdAt);

export default lastSales;
