import { BASICInterpreter } from './interpreter.js';

// Example usage:
const program = `
LET X = 10
LET Y = 15

IF X > Y THEN GOSUB A
IF Y > X THEN GOSUB B

END

SUB A
PRINT "X is greater than Y"
RETURN

SUB B
PRINT "Y is greater than X"
RETURN`;

const interpreter = new BASICInterpreter();
interpreter.run(program);