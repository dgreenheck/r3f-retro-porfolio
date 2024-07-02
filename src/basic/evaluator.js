export class BasicEvaluator {
  /**
   * @param {object} variables 
   */
  constructor(variables) {
    this.variables = variables;
  }

  evaluate(expression) {
    return this.parseExpression(expression);
  }

  parseExpression(expression) {
    const tokens = this.tokenize(expression);
    return this.parseTokens(tokens);
  }

  tokenize(expression) {
    const regex = /\s*([A-Za-z]+|\d+\.?\d*|".*?"|[-+*/<>=()])\s*/g;
    return expression.match(regex).map(token => token.trim());
  }

  parseTokens(tokens) {
    const outputQueue = [];
    const operatorStack = [];

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

    const isHigherPrecedence = (op1, op2) => precedence[op1] > precedence[op2];

    tokens.forEach(token => {
      if (!isNaN(token)) {
        outputQueue.push(parseFloat(token));
      } else if (/^".*"$/.test(token)) {
        outputQueue.push(token.slice(1, -1));
      } else if (/^[A-Za-z]+$/.test(token)) {
        outputQueue.push(this.variables[token] !== undefined ? this.variables[token] : 0);
      } else if (this.isOperator(token)) {
        while (operatorStack.length && this.isOperator(operatorStack[operatorStack.length - 1]) &&
          isHigherPrecedence(operatorStack[operatorStack.length - 1], token)) {
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
    });

    while (operatorStack.length) {
      outputQueue.push(operatorStack.pop());
    }

    return this.evaluateRPN(outputQueue);
  }

  evaluateRPN(queue) {
    const stack = [];

    queue.forEach(token => {
      if (this.isOperator(token)) {
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
    } else {
      const strA = a.toString();
      const strB = b.toString();
      switch (operator) {
        case '+': return strA + strB;
        case '=': return strA === strB ? 1 : 0;
        default: throw new Error(`Unsupported operator ${operator} for strings`);
      }
    }
  }

  isOperator = token => ['+', '-', '*', '/', '=', '<>', '<', '<=', '>', '>='].includes(token);
}

/*

// Example usage:
const evaluator = new BasicEvaluator();
evaluator.variables = {
  A: 5,
  B: 10,
  C: "Hello"
};

console.log(evaluator.evaluate('(A + 3) * 2 + B')); // 15
console.log(evaluator.evaluate('C + " World"')); // "Hello World"
console.log(evaluator.evaluate('A = B')); // 0
console.log(evaluator.evaluate('A < B')); // 1
console.log(evaluator.evaluate('(A + B) * 2')); // 30
*/