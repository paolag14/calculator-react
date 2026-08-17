const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); 
app.use(express.json()); 

// POST endpoint for calculations
app.post('/api/calculate', (req, res) => {
  const { operand1, operand2, operation } = req.body;

  // 1. Strict Input Validation
  // Ensure we actually received numbers (and reject null, undefined, or strings)
  if (typeof operand1 !== 'number' || typeof operand2 !== 'number') {
    return res.status(400).json({ 
      error: 'Invalid input: operand1 and operand2 must be numbers.' 
    });
  }

  // Ensure the requested operation is whitelisted
  const validOperations = ['add', 'subtract', 'multiply', 'divide'];
  if (!validOperations.includes(operation)) {
    return res.status(400).json({ 
      error: `Invalid operation: '${operation}'. Allowed operations are add, subtract, multiply, and divide.` 
    });
  }

  // 2. Perform Math and Handle Edge Cases
  let result = 0;

  switch (operation) {
    case 'add':
      result = operand1 + operand2;
      break;
    case 'subtract':
      result = operand1 - operand2;
      break;
    case 'multiply':
      result = operand1 * operand2;
      break;
    case 'divide':
      // Explicitly catch division by zero before Node evaluates it to 'Infinity'
      if (operand2 === 0) {
        return res.status(400).json({ 
          error: 'Math Error: Cannot divide by zero.' 
        });
      }
      result = operand1 / operand2;
      break;
  }

  // 3. Fix the JavaScript Floating-Point Trap
  // Rounds results to 8 decimal places (e.g., turns 0.30000000000000004 into 0.3)
  const cleanResult = Math.round(result * 100000000) / 100000000;

  // 4. Return successful JSON response
  res.status(200).json({ 
    result: cleanResult 
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});