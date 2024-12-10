import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Kanban board', () => {
  render(<App />);
  const todoColumn = screen.getByText(/To Do/i);
  const task1 = screen.getByText(/Task 1/i);
  const task2 = screen.getByText(/Task 2/i);

  expect(todoColumn).toBeInTheDocument();
  expect(task1).toBeInTheDocument();
  expect(task2).toBeInTheDocument();
});
