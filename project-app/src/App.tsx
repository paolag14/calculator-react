import { useState } from 'react';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import './App.css';

// Helper to translate UI symbols to API strings
const operatorMap: Record<string, string> = {
  '+': 'add',
  '-': 'subtract',
  '×': 'multiply',
  '÷': 'divide',
};

export default function App() {
  const [currentValue, setCurrentValue] = useState<string>('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleNumber = (num: string) => {
    if (error) setError(null); // Clear errors when typing a new number
    setCurrentValue((prev) => (prev === '0' ? num : prev + num));
  };

  const handleOperator = (op: string) => {
    if (error) setError(null);
    setOperator(op);
    setPreviousValue(currentValue);
    setCurrentValue('0');
  };

  const handleClear = () => {
    setCurrentValue('0');
    setPreviousValue(null);
    setOperator(null);
    setError(null);
  };

  const handleBackspace = () => {
    if (error) {
      handleClear();
      return;
    }
    setCurrentValue((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
  };

  const handleToggleSign = () => {
    setCurrentValue((prev) => {
      if (prev === '0') return prev;
      return prev.startsWith('-') ? prev.slice(1) : '-' + prev;
    });
  };

  // The connection to the backend API
  const calculate = async () => {
    if (!previousValue || !operator) return;
    
    const apiOperation = operatorMap[operator];
    const payload = {
      operand1: parseFloat(previousValue),
      operand2: parseFloat(currentValue),
      operation: apiOperation
    };

    try {
      const response = await fetch('http://localhost:3000/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle custom API errors (e.g., division by zero)
        setError(data.error || 'An error occurred');
        setCurrentValue('Error');
        setPreviousValue(null);
        setOperator(null);
      } else {
        // Handle success
        setCurrentValue(String(data.result));
        setPreviousValue(null);
        setOperator(null);
      }
    } catch (err) {
      // Handle network errors (e.g., backend is offline)
      setError('Server unreachable');
      setCurrentValue('Error');
    }
  };

  const renderButton = (
    label: string, 
    onClick: () => void,
    colorClass: string = ''
  ) => (
    <Button
      disableElevation
      className={`calc-btn ${colorClass}`}
      onClick={onClick}
    >
      {label}
    </Button>
  );

  return (
    <Container maxWidth={false} className="app-container">
      <Paper elevation={0} className="calculator-paper">
        
        {/* Calculator Display */}
        <Box className="calculator-display">
          <Typography variant="body2" className="display-previous">
            {error ? 'Error' : `${previousValue || ''} ${operator || ''}`}
          </Typography>
          <Typography 
            variant="h3" 
            component="div" 
            className="display-current"
            sx={{ color: error ? '#ff8a8a' : 'white', fontSize: error ? '1.5rem' : undefined }}
          >
            {error ? error : currentValue}
          </Typography>
        </Box>

        {/* Calculator Keypad */}
        <Box className="calculator-grid">
          {renderButton('⌫', handleBackspace)}
          {renderButton('AC', handleClear, 'btn-purple')}
          {renderButton('%', () => setCurrentValue(String(parseFloat(currentValue) / 100)), 'btn-blue-light')}
          {renderButton('÷', () => handleOperator('÷'), 'btn-blue-dark')}

          {renderButton('7', () => handleNumber('7'))}
          {renderButton('8', () => handleNumber('8'))}
          {renderButton('9', () => handleNumber('9'))}
          {renderButton('×', () => handleOperator('×'), 'btn-blue-dark')}

          {renderButton('4', () => handleNumber('4'))}
          {renderButton('5', () => handleNumber('5'))}
          {renderButton('6', () => handleNumber('6'))}
          {renderButton('-', () => handleOperator('-'), 'btn-blue-dark')}

          {renderButton('1', () => handleNumber('1'))}
          {renderButton('2', () => handleNumber('2'))}
          {renderButton('3', () => handleNumber('3'))}
          {renderButton('+', () => handleOperator('+'), 'btn-blue-dark')}

          {renderButton('+/-', handleToggleSign)}
          {renderButton('0', () => handleNumber('0'))}
          {renderButton('.', () => {
            if (!currentValue.includes('.')) handleNumber('.');
          })}
          {renderButton('=', calculate, 'btn-blue-dark')}
        </Box>
      </Paper>
    </Container>
  );
}