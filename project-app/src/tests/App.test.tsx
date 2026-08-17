import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import App from '../App';

global.fetch = vi.fn();

describe('Calculator App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the initial state correctly', () => {
    render(<App />);
    
    expect(screen.getAllByText('0')).toHaveLength(2)
    expect(screen.getByText('AC')).toBeInTheDocument();
    expect(screen.getByText('=')).toBeInTheDocument();
  });

  it('updates the display when numbers are clicked', () => {
    render(<App />);
    
    fireEvent.click(screen.getByText('7'));
    fireEvent.click(screen.getByText('8'));
    
    expect(screen.getByText('78')).toBeInTheDocument();
  });

  it('clears the display when AC is clicked', () => {
    render(<App />);
    
    fireEvent.click(screen.getByText('9'));
    fireEvent.click(screen.getByText('AC'));
    
    expect(screen.getAllByText('0')).toHaveLength(2);
  });

  it('calls the backend API and displays the result on equals', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ result: 15 }),
    });

    render(<App />);
    
    fireEvent.click(screen.getByText('7'));
    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByText('8'));
    fireEvent.click(screen.getByText('='));

    await waitFor(() => {
      expect(screen.getByText('15')).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/calculate',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operand1: 7,
          operand2: 8,
          operation: 'add',
        }),
      })
    );
  });

  it('handles backend API errors gracefully', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Math Error: Cannot divide by zero.' }),
    });

    render(<App />);
    
    fireEvent.click(screen.getByText('5'));
    fireEvent.click(screen.getByText('÷'));
    fireEvent.click(screen.getAllByText('0')[1]);
    fireEvent.click(screen.getByText('='));

    await waitFor(() => {
      expect(screen.getByText('Math Error: Cannot divide by zero.')).toBeInTheDocument();
    });
  });
});