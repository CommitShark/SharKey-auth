const User = {
  create: jest.fn(),
  findOne: jest.fn(),
  findByPk: jest.fn(),
  sync: jest.fn(),
  drop: jest.fn(),
};

export default User;
