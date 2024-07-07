// Higher precendence means that operation is evaluated first
const precedence = {
  '=': 1,
  '<>': 2,
  '<=': 2,
  '>=': 2,
  '<': 2,
  '>': 2,
  '+': 3,
  '-': 3,
  '*': 4,
  '/': 4
};

function isOperator(token) {
  return ['+', '-', '*', '/', '=', '<>', '<', '<=', '>', '>='].includes(token);
}

export class BASICEvaluator {
  /**
   * @param {object} variables 
   */
  constructor(variables = {}) {
    this.variables = variables;
  }

  /**
   * Evaluates a BASIC expression
   * @param {string} expression The BASIC expression to evaluate
   * @returns {any} Returns the result of the expression
   */
  evaluate(expression) {
    const tokens = this.tokenize(expression);
    return this.parseTokens(tokens);
  }

  /**
   * Breaks a BASIC expression into individual tokens
   * @param {string} expression The BASIC expression to tokenize
   * @returns {string[]} Returns an array of tokens
   */
  tokenize(expression) {
    // ([A-Za-z]+|\d+\.?\d*|".*?"|[-+*/<>=()]):  This part is a capturing
    //  group that matches one of the following alternatives:
    //   1) [A-Za-z]+: Matches one or more letters (uppercase or lowercase).
    //   2) \d+\.?\d*: Matches a number, which can be an integer or a decimal:
    //     a)  \d+ matches one or more digits.
    //     b)  \.? optionally matches a decimal point.
    //     c)  \d* matches zero or more digits following the decimal point.
    //   3) ".*?": Matches a string enclosed in double quotes:
    //     a) " matches a double quote.
    //     b) .*? matches any number of any characters, non-greedily
    //     c)  " matches the closing double quote.
    //   4) [-+*/<>=()]: Matches one or more character from the set -, +, *, /, <, >, =, (, and ).
    //   5) [()]: Matches one character from the set (, )
    const regex = /\s*([A-Za-z]+|\d+\.?\d*|".*?"|[-+*/<>=]+|[()])\s*/g;

    return expression
      .match(regex)
      .map(token => token.trim());
  }

  /**
   * Parses a tokenized expression, computing the result
   * @param {string[]} tokens The array of tokens to parse
   * @returns 
   */
  parseTokens(tokens) {
    const outputQueue = [];
    const operatorStack = [];

    while (tokens.length > 0) {
      const token = tokens.shift();
      if (!isNaN(token)) {
        outputQueue.push(parseFloat(token));
      } else if (/^".*"$/.test(token)) {
        outputQueue.push(token.slice(1, -1));
      } else if (/^[A-Za-z]+$/.test(token)) {
        outputQueue.push(this.variables[token] !== undefined ? this.variables[token] : 0);
      } else if (isOperator(token)) {
        const nextOperator = operatorStack[operatorStack.length - 1];
        while (operatorStack.length &&
          isOperator(nextOperator) &&
          precedence[nextOperator] > precedence[token]) {
          outputQueue.push(operatorStack.pop());
        }
        operatorStack.push(token);
      } else if (token === '(') {
        operatorStack.push(token);
      } else if (token === ')') {
        while (operatorStack.length && operatorStack[operatorStack.length - 1] !== '(') {
          outputQueue.push(operatorStack.pop());
        }
        operatorStack.pop();
      }
    };

    while (operatorStack.length) {
      outputQueue.push(operatorStack.pop());
    }

    return this.evaluateRPN(outputQueue);
  }

  /**
   * 
   * @param {*} queue 
   * @returns 
   */
  evaluateRPN(queue) {
    const stack = [];

    queue.forEach(token => {
      if (isOperator(token)) {
        const b = stack.pop();
        const a = stack.pop();
        stack.push(this.applyOperator(a, b, token));
      } else {
        stack.push(token);
      }
    });

    return stack[0];
  }

  applyOperator(a, b, operator) {
    // If both operands are numbers, perform numeric operations
    if (typeof a === 'number' && typeof b === 'number') {
      switch (operator) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return a / b;
        case '>': return a > b ? 1 : 0;
        case '<': return a < b ? 1 : 0;
        case '>=': return a >= b ? 1 : 0;
        case '<=': return a <= b ? 1 : 0;
        case '=': return a === b ? 1 : 0;
        case '<>': return a !== b ? 1 : 0;
      }
      // Otherwise, treat both operands as strings
    } else {
      const strA = a.toString();
      const strB = b.toString();
      switch (operator) {
        // Only concatenation and equality operators are supported for strings
        case '+': return strA + strB;
        case '=': return strA === strB ? 1 : 0;
        case '<>': return strA !== strB ? 1 : 0;
        default: throw new Error(`Unsupported operator ${operator} for strings`);
      }
    }
  }
}