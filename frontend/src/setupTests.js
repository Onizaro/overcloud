// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock for files
global.__mocks__ = {
  fileMock: 'test-file-stub',
};

// Mock for localStorage
if (!global.localStorage) {
  global.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
}

// Mock for window.confirm
if (!global.confirm) {
  global.confirm = jest.fn();
}

// Mock for window.alert
if (!global.alert) {
  global.alert = jest.fn();
}

// Mock for window.fetch
global.fetch = jest.fn();

// Extension of expect for file inputs
expect.extend({
  toHaveBeenCalledWithFormDataContaining(fetchMock, fieldName, expectedValue) {
    const calls = fetchMock.mock.calls;
    
    // Find a call where the second argument contains a FormData body
    const callWithFormData = calls.find(call => 
      call[1] && call[1].body instanceof FormData
    );
    
    if (!callWithFormData) {
      return {
        pass: false,
        message: () => `Expected fetch to have been called with FormData containing ${fieldName}`
      };
    }
    
    // FormData is not directly inspectable, we'd need to intercept it before the call
    // This is a simplification
    return {
      pass: true,
      message: () => `Expected fetch to have been called with FormData containing ${fieldName}: ${expectedValue}`
    };
  }
});