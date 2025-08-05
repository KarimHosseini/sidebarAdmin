module.exports = {
  // Use jsdom for browser-like environment
  testEnvironment: "jsdom",

  // Only include our simplified test
  testMatch: ["<rootDir>/src/components/__tests__/TableOptimizations.test.jsx"],

  // Mock problematic modules
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__mocks__/fileMock.js",
    "\\.(css|less|scss|sass)$": "<rootDir>/__mocks__/styleMock.js",
    "mapbox-gl": "<rootDir>/__mocks__/moduleMock.js",
    "react-map-gl": "<rootDir>/__mocks__/moduleMock.js",
    jspdf: "<rootDir>/__mocks__/moduleMock.js",
  },

  // Transform files with babel
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },

  // Skip certain directories
  testPathIgnorePatterns: ["/node_modules/"],

  // Setup files
  setupFilesAfterEnv: ["<rootDir>/__mocks__/setupTests.js"],

  // We don't need coverage for this test
  collectCoverage: false,

  // Use CommonJS for the tests
  transformIgnorePatterns: ["/node_modules/(?!axios).+\\.js$"],
};
