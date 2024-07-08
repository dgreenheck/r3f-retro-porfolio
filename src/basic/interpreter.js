import { BASICDisplay } from './display.js';
import { BASICEvaluator } from './evaluator.js';
import { BASICOutput } from './output.js';

export class BASICInterpreter {
  constructor() {
    this.lines = [];
    this.errors = [];

    /**
     * @type {{ name: string, lineNumber: number }}
     */
    this.subroutines = {};
    this.variables = {};
    this.callStack = [];
    this.forStack = [];
    this.whileStack = [];

    this.haltProgram = false;

    this.evaluator = new BASICEvaluator(this.variables);
    this.display = new BASICDisplay(16, 16);
    this.output = new BASICOutput();
  }

  /**
   * @param {string} program 
   */
  run(program) {
    this.programCounter = 0;
    this.errors = [];

    // Break program into lines, throwing out whitespace
    this.lines = program
      .split('\n')
      .map(x => x.trim());

    // Identify all subroutines and keep record of the starting line number
    this.lines
      .forEach((line, lineNumber) => {
        if (!line) return;

        let match = line.match(/^SUB\s+([A-Z0-9_]+)\s*$/);

        if (!match) return;

        let name = match[1];
        // Subroutine names must be unique
        if (this.subroutines[name]) {
          this.errors.push({
            error: `Subroutine already exists with name ${name}`,
            lineNumber
          });
        } else {
          this.subroutines[name] = lineNumber;
        }
      });

    // Run program
    while (!this.haltProgram && this.programCounter < this.lines.length) {
      if (this.lines[this.programCounter]) {
        this.execute(this.lines[this.programCounter]);
      }
      this.programCounter++;
    }

    console.log(this.output.buffer);
  }

  /**
   * @param {string} code 
   * @returns 
   */
  execute(code) {
    // Match pattern: <COMMAND> <EXPRESSION>
    let [, command, args] = code.match(/^(\w+)\s*(.*)$/);
    args = args.trim();

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
      case 'GOSUB':
        this.handleGosub(args);
        break;
      case 'RETURN':
        this.handleReturn(args);
        break;
      case 'PRINT':
        this.handlePrint(args);
        break;
      case 'SETPX':
        this.handleSetPixel(args);
        break;
      case 'GETPX':
        this.handleGetPixel(args);
        break;
      case 'END':
        this.haltProgram = true;
        break;
      case 'REM':
      case 'SUB':
        break;
      default:
        this.errors.push({
          error: `Unknown command: ${command}`,
          lineNumber: this.programCounter
        });
        return;
    }
  }

  handleLet(args) {
    // Match Pattern: <VARIABLE> = <VALUE>
    const [, variable, value] = args.match(/^(\w+)\s*=\s*(.*)$/);
    this.variables[variable] = this.evaluate(value);
  }

  handleIf(args) {
    // Match Pattern: <CONDITION> THEN <CODE>
    const [, condition, code] = args.match(/^(.*)\s*THEN\s*(.*)$/);

    if (this.evaluate(condition)) {
      this.execute(code);
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

  handleGosub(args) {
    const [, subName] = args.match(/^([A-Z0-9_]+)$/);
    const subStartLine = this.subroutines[subName];

    if (!subStartLine) {
      this.errors.push({
        error: `Subroutine ${subName} does not exist`,
        lineNumber: this.programCounter
      })
    }

    this.callStack.push(this.programCounter);
    this.programCounter = subStartLine;
  }

  handleReturn() {
    this.programCounter = this.callStack.pop();
  }

  handlePrint(args) {
    const message = this.evaluate(args);
    this.output.writeLine(message);
  }

  handleSetPixel(args) {
    const [, x, y, color] = args.match(/^(\d+)\s*(\d+)\s*(\d+)$/);
    console.log(x, y, color);
  }

  handleGetPixel(args) {
    const [, x, y] = args.match(/^(\d+)\s*(\d+)$/);
    console.log(x, y);
  }

  evaluate(expression) {
    return this.evaluator.evaluate(expression);
  }
}