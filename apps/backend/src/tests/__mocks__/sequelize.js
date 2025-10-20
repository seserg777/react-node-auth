// Mock for Sequelize models
const mockUser = {
  id: 1,
  email: 'test@example.com',
  name: 'Test User',
  password: '$2a$10$hashedpassword',
  createdAt: new Date(),
  updatedAt: new Date()
};

const mockSequelize = {
  define: jest.fn(() => ({
    findOne: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  })),
  sync: jest.fn(),
  authenticate: jest.fn()
};

const mockUserModel = {
  findOne: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn()
};

module.exports = {
  sequelize: mockSequelize,
  User: mockUserModel,
  mockUser
};
