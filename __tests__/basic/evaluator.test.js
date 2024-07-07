import { describe, test, expect } from 'vitest'
import { BASICEvaluator } from '../../src/basic/evaluator';

describe('evaluating', () => {
  describe('constant', () => {
    test('integers', () => {
      expect(new BASICEvaluator().evaluate('123')).toBe(123);
    });

    test('small decimal numbers', () => {
      expect(new BASICEvaluator().evaluate('0.000000001')).toBe(1E-9);
    });

    test('large decimal numbers', () => {
      expect(new BASICEvaluator().evaluate('1000000000')).toBe(1E9);
    });

    test('strings', () => {
      expect(new BASICEvaluator().evaluate('"hello, world!"')).toBe('hello, world!');
    });
  });

  describe('arithmetic expression (single)', () => {
    test('adding two integers returns sum', () => {
      expect(new BASICEvaluator().evaluate('13 + 22')).toBe(35);
    });

    test('adding two decimal numbers returns sum', () => {
      expect(new BASICEvaluator().evaluate('13.5 + 22.3')).toBe(35.8);
    });

    test('subracting two integers returns difference', () => {
      expect(new BASICEvaluator().evaluate('49 - 12')).toBe(37);
    });

    test('subracting two decimal numbers returns difference', () => {
      expect(new BASICEvaluator().evaluate('49.8 - 12.4')).toBe(37.4);
    });

    test('multiplying two integers returns product', () => {
      expect(new BASICEvaluator().evaluate('8 * 9')).toBe(72);
    });

    test('multiplying two decimal numbers returns product', () => {
      expect(new BASICEvaluator().evaluate('10.5 * 8.5')).toBe(89.25);
    });

    test('dividing two integers with no remainder returns quotient', () => {
      expect(new BASICEvaluator().evaluate('49 / 7')).toBe(7);
    });

    test('dividing two integers with remainder returns exact quotient', () => {
      expect(new BASICEvaluator().evaluate('5 / 2')).toBe(2.5);
    });

    test('dividing two decimals numbers returns quotient', () => {
      expect(new BASICEvaluator().evaluate('12.8 / 3.2')).toBe(4);
    });
  });

  describe('logical operations (single)', () => {
    describe('>', () => {
      test('A > B returns 1 when A is larger than B', () => {
        expect(new BASICEvaluator().evaluate('5 > 3')).toBe(1);
      });

      test('A > B returns 0 when B is larger than A', () => {
        expect(new BASICEvaluator().evaluate('3 > 5')).toBe(0);
      });

      test('A > B returns 0 when A is equal to B', () => {
        expect(new BASICEvaluator().evaluate('3 > 3')).toBe(0);
      });
    });

    describe('<', () => {
      test('A < B returns 1 when A is larger than B', () => {
        expect(new BASICEvaluator().evaluate('3 < 5')).toBe(1);
      });

      test('A < B returns 0 when B is larger than A', () => {
        expect(new BASICEvaluator().evaluate('5 < 3')).toBe(0);
      });

      test('A < B returns 0 when A is equal to B', () => {
        expect(new BASICEvaluator().evaluate('3 < 3')).toBe(0);
      });
    });

    describe('>=', () => {
      test('A >= B returns 1 when A is larger than B', () => {
        expect(new BASICEvaluator().evaluate('5 >= 3')).toBe(1);
      });

      test('A >= B returns 0 when B is larger than A', () => {
        expect(new BASICEvaluator().evaluate('3 >= 5')).toBe(0);
      });

      test('A >= B returns 1 when A is equal to B', () => {
        expect(new BASICEvaluator().evaluate('3 >= 3')).toBe(1);
      });
    });

    describe('<=', () => {
      test('A <= B returns 1 when A is larger than B', () => {
        expect(new BASICEvaluator().evaluate('3 <= 5')).toBe(1);
      });

      test('A <= B returns 0 when B is larger than A', () => {
        expect(new BASICEvaluator().evaluate('5 <= 3')).toBe(0);
      });

      test('A <= B returns 1 when A is equal to B', () => {
        expect(new BASICEvaluator().evaluate('3 <= 3')).toBe(1);
      });
    });

    describe('=', () => {
      test('A = B returns 1 when A is equal to B', () => {
        expect(new BASICEvaluator().evaluate('123 = 123')).toBe(1);
      });

      test('A = B returns 0 when A is not equal to B', () => {
        expect(new BASICEvaluator().evaluate('123 = 122')).toBe(0);
      });
    });

    describe('<>', () => {
      test('A <> B returns 1 when A is not equal to B', () => {
        expect(new BASICEvaluator().evaluate('123 <> 121')).toBe(1);
      });

      test('A <> B returns 0 when A is equal to B', () => {
        expect(new BASICEvaluator().evaluate('123 <> 123')).toBe(0);
      });
    });
  });

  describe('string operations (single)', () => {
    test('concatenation', () => {
      expect(new BASICEvaluator().evaluate('"Hello" + " world!"')).toBe("Hello world!");
    });

    test('A = B returns 1 when A equals B', () => {
      expect(new BASICEvaluator().evaluate('"Test" = "Test"')).toBe(1);
    });

    test('A = B returns 1 when A is not equal to B', () => {
      expect(new BASICEvaluator().evaluate('"Test" = "Test1"')).toBe(0);
    });

    test('A <> B returns 1 when A is not equal to B', () => {
      expect(new BASICEvaluator().evaluate('"Test" <> "Test1"')).toBe(1);
    });

    test('A <> B returns 0 when A equals B', () => {
      expect(new BASICEvaluator().evaluate('"Test" <> "Test"')).toBe(0);
    });

  });

  describe('arithmetic expression (nested)', () => {
    test('group on LHS', () => {
      expect(new BASICEvaluator().evaluate('(1 + 5) * 8')).toBe(48);
    });

    test('group on RHS', () => {
      expect(new BASICEvaluator().evaluate('4 * (8 - 4)')).toBe(16);
    });

    test('three groups', () => {
      expect(new BASICEvaluator().evaluate('4 * (8 - 4) - 8')).toBe(8);
    });

    test('multiple nested groups (numeric only)', () => {
      expect(new BASICEvaluator().evaluate('5 * (8 - (4 + 3)) - 8')).toBe(-3);
    });

    test('multiple nested groups (numeric + string)', () => {
      expect(new BASICEvaluator().evaluate('5 + (" dude " + (4 + "hey")) + 8')).toBe("5 dude 4hey8");
    });
  });

  describe('logical + arithmetic expression (nested)', () => {
    test('+ is evaluated before >', () => {
      expect(new BASICEvaluator().evaluate('10 > 3 + 4')).toBe(1);
    });

    test('* is evaluated before <', () => {
      expect(new BASICEvaluator().evaluate('8 * 3 < 50')).toBe(1);
    });

    test('mega expression!', () => {
      expect(new BASICEvaluator().evaluate('8 * (30 + 4 - (2 * 10)) = 2 * (66 - (2 + 4 * 2))')).toBe(1);
    });
  });
});