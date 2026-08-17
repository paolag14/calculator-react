const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); 
app.use(express.json()); 

app.post('/api/calculate', (req, res) => {
  const { operand1, operand2, operation } = req.body;

  if (typeof operand1 !== 'number' || typeof operand2 !== 'number') {
    return res.status(400).json({ 
      error: 'Invalid input: operand1 and operand2 must be numbers.' 
    });
  }

  const validOperations = ['add', 'subtract', 'multiply', 'divide'];
  if (!validOperations.includes(operation)) {
    return res.status(400).json({ 
      error: `Invalid operation: '${operation}'. Allowed operations are add, subtract, multiply, and divide.` 
    });
  }

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
      if (operand2 === 0) {
        return res.status(400).json({ 
          error: 'Math Error: Cannot divide by zero.' 
        });
      }
      result = operand1 / operand2;
      break;
  }

  // Fix the JavaScript Floating-Point Trap
  const cleanResult = Math.round(result * 100000000) / 100000000;

  res.status(200).json({ 
    result: cleanResult 
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});