/** @type {import('jest').Config} */
export default {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  transform: {},
  setupFiles: ['dotenv/config', '<rootDir>/tests/jest.env.js'],
  verbose: true
}
