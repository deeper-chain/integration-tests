module.exports = async () => {
  return {
    verbose: true,
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-node',
    testTimeout: 60000,
  };
};
