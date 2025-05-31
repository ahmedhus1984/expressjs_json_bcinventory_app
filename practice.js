/*
User Input with std::io

1.
Fix the code to correctly parse and use user input from command line.

2.
then run it with a relevant command with parameters to get expected output
*/


//practice.js

// Simple CLI calculator
const args = process.argv.slice(2); // Get args from command line

const a = parseFloat(args[0]);
const operator = args[1];
const b = parseFloat(args[2]);

let result;
switch (operator) {
  case '+':
    result = a + b;
    break;
  case '-':
    result = a - b;
    break;
  case '*':
    result = a * b;
    break;
  case '/':
    result = b !== 0 ? a / b : 'Error: divide by zero';
    break;
  default:
    result = 'Invalid operator. Use +, -, *, or /.';
}

console.log(`Result: ${result}`);