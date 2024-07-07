import { describe, test, expect } from 'vitest'
import { BASICInterpreter } from '../../src/basic/interpreter.js';

describe('BASICInterpreter', () => {
  describe('sample programs', () => {
    test('LET assignment', () => {
      const interpreter = new BASICInterpreter();

      const program = `
      10 LET X = 10
      20 PRINT X`;

      interpreter.run(program)

      expect(interpreter.output.buffer.length).toBe(1);
      expect(interpreter.output.buffer[0]).toBe('10');
    });

    test('FOR loop', () => {
      const interpreter = new BASICInterpreter();

      const program = `
      10 LET X = 10
      20 LET Y = 0
      30 FOR I = 1 TO 5
      40   LET Y = Y + X
      50 NEXT I
      60 PRINT Y`;

      interpreter.run(program)

      expect(interpreter.output.buffer.length).toBe(1);
      expect(interpreter.output.buffer[0]).toBe('50');
    });

    test('WHILE loop', () => {
      const interpreter = new BASICInterpreter();

      const program = `
      10 LET X = 10
      20 LET Y = 0
      30 WHILE Y < 50
      40   LET Y = Y + X
      50 WEND
      60 PRINT Y`;

      interpreter.run(program)

      expect(interpreter.output.buffer.length).toBe(1);
      expect(interpreter.output.buffer[0]).toBe('50');
    });
  });
});