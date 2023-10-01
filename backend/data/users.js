import bcrypt from 'bcryptjs';

const users = [
  {
    firstName: 'Admin User',
    lastName: 'Admin Last Name',
    email: 'admin@email.com',
    password: bcrypt.hashSync('123456', 10),
    isSeller: true,
    isAdmin: true,
  },
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@email.com',
    password: bcrypt.hashSync('123456', 10),
    isSeller: true,
    isAdmin: false,
  },
  {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@email.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
  },
];

export default users;
