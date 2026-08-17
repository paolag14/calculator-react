// app.test.js
const request = require('supertest');
const app = require('../setup');

describe('Calculator API Endpoints', () => {
  test('returns the sum of two numbers', async () => {
    const response = await request(app)
      .post('/api/calculate')
      .send({ 
        operand1: 5, 
        operand2: 3, 
        operation: 'add' 
      });
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ result: 8 });
  });

  test('returns the subtraction of two numbers', async () => {
    const response = await request(app)
      .post('/api/calculate')
      .send({ 
        operand1: 5, 
        operand2: 3, 
        operation: 'subtract' 
      });
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ result: 2 });
  });

  test('returns the multiplication of two numbers', async () => {
    const response = await request(app)
      .post('/api/calculate')
      .send({ 
        operand1: 5, 
        operand2: 3, 
        operation: 'multiply' 
      });
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ result: 15 });
  });

  test('returns the division of two numbers', async () => {
    const response = await request(app)
      .post('/api/calculate')
      .send({ 
        operand1: 10, 
        operand2: 2, 
        operation: 'divide' 
      });
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ result: 5 });
  });

  test('returns error when diving by 0', async () => {
    const response = await request(app)
      .post('/api/calculate')
      .send({ 
        operand1: 5, 
        operand2: 0, 
        operation: 'divide' 
      });
    
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ 
          'error': 'Math Error: Cannot divide by zero.' 
        });
  });

  test('returns error for invalid inputs', async () => {
    const response = await request(app)
      .post('/api/calculate')
      .send({ 
        operand1: 'a', 
        operand2: 3, 
        operation: 'substract' 
      });
    
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ 
      error: 'Invalid input: operand1 and operand2 must be numbers.' 
    });
  });

  test('returns error for invalid operation', async () => {
    const response = await request(app)
      .post('/api/calculate')
      .send({ 
        operand1: 5, 
        operand2: 3, 
        operation: 'squareroot' 
      });
    
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ 
      error: `Invalid operation: 'squareroot'. Allowed operations are add, subtract, multiply, and divide.` 
    });
  });
});