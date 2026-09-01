// Sample users. Passwords are stored in plaintext here and hashed by the seed script.
// All sample users use the same password for demo: Password123!

export const users = [
  {
    _seedId: 'user-demo',
    name: 'Mustafa Demo',
    email: 'demo@mstours.com',
    password: 'Password123!',
    phone: '+91 9876543210',
    avatar: 'https://i.pravatar.cc/200?img=68',
    role: 'user',
    favorites: [], // will be filled with package _seedIds by the seeder
  },
  {
    _seedId: 'user-priya',
    name: 'Priya Mehta',
    email: 'priya@mstours.com',
    password: 'Password123!',
    phone: '+91 9123456780',
    avatar: 'https://i.pravatar.cc/200?img=32',
    role: 'user',
    favorites: [],
  },
  {
    _seedId: 'user-rahul',
    name: 'Rahul Verma',
    email: 'rahul@mstours.com',
    password: 'Password123!',
    phone: '+91 9988776655',
    avatar: 'https://i.pravatar.cc/200?img=12',
    role: 'user',
    favorites: [],
  },
  {
    _seedId: 'user-admin',
    name: 'Admin',
    email: 'admin@mstours.com',
    password: 'Admin@123',
    phone: '+91 9000000000',
    avatar: 'https://i.pravatar.cc/200?img=1',
    role: 'admin',
    favorites: [],
  },
];
