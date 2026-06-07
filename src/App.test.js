import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the user list screen', async () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: /list/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /add user/i })).toBeInTheDocument();
  expect(await screen.findByText(/indexeddb is not available/i)).toBeInTheDocument();
});
