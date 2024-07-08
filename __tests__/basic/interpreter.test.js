import { describe, test, expect } from 'vitest'
import { BASICInterpreter } from '../../src/basic/interpreter.js';

describe('BASICInterpreter', () => {
  describe('sample programs', () => {
    test('LET assignment', () => {
      const interpreter = new BASICInterpreter();

      const program = `
      LET X = 10
      PRINT X`;

      interpreter.run(program)

      expect(interpreter.output.buffer.length).toBe(1);
      expect(interpreter.output.buffer[0]).toBe('10');
    });

    test('FOR loop', () => {
      const interpreter = new BASICInterpreter();

      const program = `
      LET X = 10
      LET Y = 0
      FOR I = 1 TO 5
        LET Y = Y + X
      NEXT I
      PRINT Y`;

      interpreter.run(program)

      expect(interpreter.output.buffer.length).toBe(1);
      expect(interpreter.output.buffer[0]).toBe('50');
    });

    test('WHILE loop', () => {
      const interpreter = new BASICInterpreter();

      const program = `
      LET X = 10
      LET Y = 0
      WHILE Y < 50
        LET Y = Y + X
      WEND
      PRINT Y`;

      interpreter.run(program)

      expect(interpreter.output.buffer.length).toBe(1);
      expect(interpreter.output.buffer[0]).toBe('50');
    });

    test('IF/THEN statement', () => {
      const interpreter = new BASICInterpreter();

      const program = `
      LET X = 10
      LET Y = 15
      LET STR1 = "Hello"
      LET STR2 = "Goodbye"

      IF X > Y THEN PRINT STR1
      IF Y > X THEN PRINT STR2`;

      interpreter.run(program)

      expect(interpreter.output.buffer.length).toBe(1);
      expect(interpreter.output.buffer[0]).toBe("Goodbye");
    });

    test('GOSUB', () => {
      const interpreter = new BASICInterpreter();

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

      interpreter.run(program)

      expect(interpreter.output.buffer.length).toBe(1);
      expect(interpreter.output.buffer[0]).toBe("Y is greater than X");
    });
  });
});