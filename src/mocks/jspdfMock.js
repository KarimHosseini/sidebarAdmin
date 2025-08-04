// Mock for jspdf
const jsPDF = jest.fn(() => ({
  addPage: jest.fn(),
  save: jest.fn(),
  text: jest.fn(),
  setFontSize: jest.fn(),
  setTextColor: jest.fn(),
  autoTable: jest.fn(),
  addImage: jest.fn(),
  output: jest.fn(() => "mocked-pdf-output"),
}));

// Export as CommonJS module
module.exports = { jsPDF };
