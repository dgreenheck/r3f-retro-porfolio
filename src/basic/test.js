import { BASICInterpreter } from './interpreter.js';

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

const interpreter = new BASICInterpreter();
interpreter.parse(program);
interpreter.run();