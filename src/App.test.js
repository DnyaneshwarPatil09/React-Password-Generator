import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renders Password Generator heading', () => {
  render(<App />);
  const headingElement = screen.getByRole('heading', { name: /Password Generator/i });
  expect(headingElement).toBeInTheDocument();
});

test('allows toggling character options and generating a password', () => {
  render(<App />);
  const generateButton = screen.getByRole('button', { name: /Generate Password/i });
  expect(generateButton).toBeInTheDocument();

  fireEvent.click(generateButton);
  const passwordInput = screen.getByLabelText('Generated Password');
  expect(passwordInput.value).not.toBe('');
});
