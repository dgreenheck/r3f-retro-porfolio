import { BasicEvaluator } from './evaluator.js';

export class BasicInterpreter {
  constructor() {
    /**
     * Table of line numbers and corresponding lines
     * @type {Map<number, string}
     */
    this.lines = {};

    this.parseErrors = [];
    this.runtimeErrors = [];

    this.variables = {};
    this.programCounter = 0;
    this.callStack = [];
    this.forStack = [];
    this.whileStack = [];

    this.haltProgram = false;

    this.evaluator = new BasicEvaluator(this.variables);
  }

  /**
   * Parses a program
   * @param {string} program 
   */
  parse(program) {
    this.parseErrors = [];

    this.lines = new Map();
    const lines = program.split('\n');
    for (let line of lines) {
      // Match format
      // <LINE NUMBER> <EXPRESSION>
      const match = line.match(/^(\d+)\s*(.*)$/);
      if (match) {
        const lineNumber = parseInt(match[1]);

        if (isNaN(lineNumber)) {
          this.parseErrors.push({
            message: 'Parsing Error: Invalid line number',
            lineNumber: null,
            code: line
          });
        } else {
          const code = match[2].trim();
          this.lines.set(lineNumber, code);
        }
      }
    }

  }

  run() {
    // Get line numbers and sort from smallest to largest
    const lineNumbers = [...this.lines.keys()];
    lineNumbers.sort((a, b) => a - b);

    // Get the maximum line number so we know when to stop
    const maxLineNumber = lineNumbers[lineNumbers.length - 1];

    this.programCounter = 0;
    while (!this.haltProgram && this.programCounter <= maxLineNumber) {
      if (!this.lines.has(this.programCounter)) {
        this.programCounter++;
        continue;
      }

      const code = this.lines.get(this.programCounter);
      this.execute(code);
      this.programCounter++;
    }
  }

  /**
   * @param {string} code 
   * @returns 
   */
  execute(code) {
    // Match pattern: <COMMAND> <EXPRESSION>
    let [, command, args] = code.match(/^(\w+)\s*(.*)$/);
    args = args.trim();

    console.log(`Executing command ${command} with arguments '${args}'`)
    switch (command) {
      case 'LET':
        this.handleLet(args);
        break;
      case 'IF':
        this.handleIf(args);
        break;
      case 'FOR':
        this.handleFor(args);
        break;
      case 'NEXT':
        this.handleNext(args);
        break;
      case 'WHILE':
        this.handleWhile(args);
        break;
      case 'WEND':
        this.handleWend(args);
        break;
      case 'GOTO':
        this.handleGoto(args);
        break;
      case 'GOSUB':
        this.handleGosub(args);
        break;
      case 'RETURN':
        this.handleReturn(args);
        break;
      case 'PRINT':
        this.handlePrint(args);
        break;
      case 'END':
        this.haltProgram = true;
        break;
      case 'REM':
        // Comment, do nothing
        break;
      default:
        this.runtimeErrors.push({
          error: `Unknown command: ${command}`,
          lineNumber: this.programCounter,
          line: code
        });
        return;
    }
  }

  handleLet(args) {
    // Match Pattern: <VARIABLE> = <VALUE>
    const [, variable, value] = args.match(/^(\w+)\s*=\s*(.*)$/);
    console.log(` - VARIABLE: ${variable}`);
    console.log(` - VALUE: ${value}`);

    console.log(`Assigning ${value} to variable ${variable}`)
    this.variables[variable] = this.evaluate(value);
  }

  handleIf(args) {
    // Match Pattern: <CONDITION> THEN <TARGET_LINE>
    const [, condition, targetLine] = args.match(/^(.*)\s*THEN\s*(\d+)$/);
    console.log(` - CONDITION: ${condition}`);
    console.log(` - TARGET_LINE: ${targetLine}`);

    const result = this.evaluate(condition);


    if (this.evaluate(condition)) {
      console.log(`Condition evaluates to ${result} (true), jump to ${targetLine}`);
      this.programCounter = targetLine - 1;
    } else {
      console.log(`Condition evaluates to ${result} (false)`);
    }
  }

  handleFor(args) {
    const [, variable, startExp, stopExp] = args.match(/^(\w+)\s*=\s*(.+)\s+TO\s+(.+)$/);

    const start = this.evaluate(startExp);
    const stop = this.evaluate(stopExp);

    this.variables[variable] = start;

    const loop = {
      variable,
      lineNumber: this.programCounter,
      stop
    };

    console.log(`Starting FOR loop (${variable} = ${start} TO ${stop})`);

    this.forStack.push(loop);
  }

  handleNext(args) {
    const variable = args;
    const forLoop = this.forStack.pop();
    if (forLoop.variable !== variable) {
      throw new Error(`NEXT without FOR for variable ${variable}`);
    }

    this.variables[variable]++;
    if (this.variables[variable] <= forLoop.stop) {
      this.forStack.push(forLoop);
      this.programCounter = forLoop.lineNumber;
    }
  }

  handleWhile(args) {
    const condition = args;
    this.whileStack.push({
      condition,
      start: this.programCounter
    });
  }

  handleWend(args) {
    const whileLoop = this.whileStack.pop();
    if (this.evaluate(whileLoop.condition)) {
      this.whileStack.push(whileLoop);
      this.programCounter = whileLoop.start;
    }
  }

  handleGoto(args) {
    const targetLine = parseInt(args);
    this.programCounter = targetLine - 1;
  }

  handleGosub(args) {
    const targetLine = parseInt(args);
    this.callStack.push(this.programCounter);
    this.programCounter = targetLine - 1;
  }

  handleReturn() {
    this.programCounter = this.callStack.pop();
  }

  handlePrint(args) {
    const message = this.evaluate(args);
    console.log(message);
  }

  evaluate(expression) {
    return this.evaluator.evaluate(expression);
  }
}


// Example usage:
const program = `
10 LET X = 5
20 LET Z = 0
30 LET STOP = 10
50 FOR Y = 1 TO STOP
60   LET Z = Z + X
70   PRINT Z
80 NEXT Y
90 END
`;

const interpreter = new BasicInterpreter();
interpreter.parse(program);
interpreter.run();