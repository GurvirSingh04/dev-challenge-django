import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';

// Mock the components that use the problematic imports
jest.mock('./components/NavHeader', () => () => <div data-testid="mock-nav">Mock Nav</div>);
jest.mock('./components/layouts/Default', () => ({ children }) => (
  <div data-testid="mock-layout">{children}</div>
));

// Import App after the mocks
import App from './App';

test('renders the app without crashing', () => {
  render(
    <ChakraProvider>
      <App />
    </ChakraProvider>
  );
  
  // Test for a more general element that should exist in the app
  expect(screen.getByTestId('mock-layout')).toBeInTheDocument();
});
