import { SkillPipe } from './skill.pipe';

describe('SkillPipe', () => {
  let pipe: SkillPipe;

  beforeEach(() => {
    pipe = new SkillPipe();
  });

  describe('Pipe Initialization', () => {
    it('should create', () => {
      expect(pipe).toBeTruthy();
    });

    it('should be a standalone pipe', () => {
      expect(SkillPipe).toBeDefined();
    });
  });

  describe('Transform Method', () => {
    describe('Zero and Negative Values', () => {
      it('should return 60 + wildcard for zero value', () => {
        expect(pipe.transform(0)).toBe(60); // 0 + wildcard 0
      });

      it('should return 60 + wildcard for negative values', () => {
        expect(pipe.transform(-5)).toBe(65); // 60 + wildcard 5
        expect(pipe.transform(-1)).toBe(61); // 60 + wildcard 1
        expect(pipe.transform(-9)).toBe(69); // 60 + wildcard 9
      });

      it('should handle string values that evaluate to zero or negative', () => {
        expect(pipe.transform('0')).toBe(60);
        expect(pipe.transform('-5')).toBe(65);
      });
    });

    describe('Values 1-30', () => {
      it('should calculate correctly for values 1-10', () => {
        // Math.ceil((1+1)/10) * 10 = Math.ceil(0.2) * 10 = 1 * 10 = 10
        expect(pipe.transform(1)).toBe(71); // 60 + 10 + wildcard 1
        // Math.ceil((5+1)/10) * 10 = Math.ceil(0.6) * 10 = 1 * 10 = 10
        expect(pipe.transform(5)).toBe(75); // 60 + 10 + wildcard 5
        // Math.ceil((10+1)/10) * 10 = Math.ceil(1.1) * 10 = 2 * 10 = 20
        expect(pipe.transform(10)).toBe(80); // 60 + 20 + wildcard 0
      });

      it('should calculate correctly for values 11-20', () => {
        // Math.ceil((11+1)/10) * 10 = Math.ceil(1.2) * 10 = 2 * 10 = 20
        expect(pipe.transform(11)).toBe(81); // 60 + 20 + wildcard 1
        // Math.ceil((15+1)/10) * 10 = Math.ceil(1.6) * 10 = 2 * 10 = 20
        expect(pipe.transform(15)).toBe(85); // 60 + 20 + wildcard 5
        // Math.ceil((20+1)/10) * 10 = Math.ceil(2.1) * 10 = 3 * 10 = 30
        expect(pipe.transform(20)).toBe(90); // 60 + 30 + wildcard 0
      });

      it('should calculate correctly for values 21-30', () => {
        // Math.ceil((21+1)/10) * 10 = Math.ceil(2.2) * 10 = 3 * 10 = 30
        expect(pipe.transform(21)).toBe(91); // 60 + 30 + wildcard 1
        // Math.ceil((25+1)/10) * 10 = Math.ceil(2.6) * 10 = 3 * 10 = 30
        expect(pipe.transform(25)).toBe(95); // 60 + 30 + wildcard 5
        // Math.ceil((30+1)/10) * 10 = Math.ceil(3.1) * 10 = 4 * 10 = 40
        expect(pipe.transform(30)).toBe(100); // 60 + 40 + wildcard 0
      });
    });

    describe('Values Above 30', () => {
      it('should return 100 for values greater than 30', () => {
        expect(pipe.transform(31)).toBe(100);
        expect(pipe.transform(50)).toBe(100);
        expect(pipe.transform(100)).toBe(100);
        expect(pipe.transform(1000)).toBe(100);
      });
    });

    describe('String Input Handling', () => {
      it('should handle string numbers correctly', () => {
        expect(pipe.transform('1')).toBe(71); // 60 + 10 + wildcard 1
        expect(pipe.transform('15')).toBe(85); // 60 + 20 + wildcard 5
        expect(pipe.transform('35')).toBe(100); // > 30, always 100
      });

      it('should handle non-numeric strings', () => {
        // 'abc' -> Number('abc') = NaN -> NaN <= 0 is false, NaN <= 30 is false, so returns 100
        expect(pipe.transform('abc')).toBe(100);
        // Empty string -> Number('') = 0 -> 0 <= 0 is true, so returns 60 + wildcard 0
        expect(pipe.transform('')).toBe(60);
      });
    });

    describe('Wildcard Calculation', () => {
      it('should use last digit as wildcard', () => {
        expect(pipe.transform(123)).toBe(100); // > 30, so always 100
        expect(pipe.transform(7)).toBe(77); // 60 + 10 + wildcard 7
        expect(pipe.transform(19)).toBe(89); // 60 + 20 + wildcard 9
      });

      it('should handle wildcard of 0 when last digit is 0', () => {
        expect(pipe.transform(10)).toBe(80); // 60 + 20 + wildcard 0
        expect(pipe.transform(20)).toBe(90); // 60 + 30 + wildcard 0
      });
    });

    describe('Edge Cases', () => {
      it('should handle null and undefined', () => {
        // null -> String(null) = 'null', wildcard = 'l' -> Number('l') = NaN -> 0
        // Number(null) = 0 -> 0 <= 0 is true -> 60 + 0
        expect(pipe.transform(null)).toBe(60);
        // undefined -> String(undefined) = 'undefined', wildcard = 'd' -> Number('d') = NaN -> 0
        // Number(undefined) = NaN -> NaN <= 0 is false, NaN <= 30 is false -> 100
        expect(pipe.transform(undefined)).toBe(100);
      });

      it('should handle boolean values', () => {
        // true -> String(true) = 'true', wildcard = 'e' -> Number('e') = NaN -> 0
        // Number(true) = 1 -> 1 <= 30 is true -> 60 + 10 + 0 = 70
        expect(pipe.transform(true)).toBe(70);
        // false -> String(false) = 'false', wildcard = 'e' -> Number('e') = NaN -> 0
        // Number(false) = 0 -> 0 <= 0 is true -> 60 + 0 = 60
        expect(pipe.transform(false)).toBe(60);
      });

      it('should handle decimal values', () => {
        // 1.5 -> String(1.5) = '1.5', wildcard = '5' -> Number('5') = 5
        // Number(1.5) = 1.5 -> 1.5 <= 30 is true -> 60 + 10 + 5 = 75
        expect(pipe.transform(1.5)).toBe(75);
        // 25.7 -> String(25.7) = '25.7', wildcard = '7' -> Number('7') = 7
        // Number(25.7) = 25.7 -> 25.7 <= 30 is true -> 60 + 30 + 7 = 97
        expect(pipe.transform(25.7)).toBe(97);
      });

      it('should handle very large numbers', () => {
        expect(pipe.transform(1000)).toBe(100); // > 30, always 100
        expect(pipe.transform(999999)).toBe(100); // > 30, always 100
      });

      it('should handle floating point edge cases', () => {
        // 0.1 -> String(0.1) = '0.1', wildcard = '1' -> Number('1') = 1
        // Number(0.1) = 0.1 -> 0.1 <= 30 is true -> 60 + 10 + 1 = 71
        expect(pipe.transform(0.1)).toBe(71);
        // 30.9 -> String(30.9) = '30.9', wildcard = '9' -> Number('9') = 9
        // Number(30.9) = 30.9 -> 30.9 <= 30 is false -> 100
        expect(pipe.transform(30.9)).toBe(100);
      });
    });

    describe('Mathematical Calculation Verification', () => {
      it('should calculate range 1-10 correctly', () => {
        // For values 1-10: Math.ceil((value + 1) / 10) * 10 = 10 for 1-9, 20 for 10
        for (let i = 1; i <= 9; i++) {
          const expected = 60 + 10 + (i % 10); // Math.ceil((i+1)/10) = 1, so 1*10 = 10
          expect(pipe.transform(i)).toBe(expected);
        }
        // Special case for 10: Math.ceil((10+1)/10) = Math.ceil(1.1) = 2, so 2*10 = 20
        expect(pipe.transform(10)).toBe(80); // 60 + 20 + 0
      });

      it('should calculate range 11-20 correctly', () => {
        // For values 11-19: Math.ceil((value + 1) / 10) * 10 = 20
        for (let i = 11; i <= 19; i++) {
          const expected = 60 + 20 + (i % 10); // Math.ceil((i+1)/10) = 2, so 2*10 = 20
          expect(pipe.transform(i)).toBe(expected);
        }
        // Special case for 20: Math.ceil((20+1)/10) = Math.ceil(2.1) = 3, so 3*10 = 30
        expect(pipe.transform(20)).toBe(90); // 60 + 30 + 0
      });

      it('should calculate range 21-30 correctly', () => {
        // For values 21-29: Math.ceil((value + 1) / 10) * 10 = 30
        for (let i = 21; i <= 29; i++) {
          const expected = 60 + 30 + (i % 10); // Math.ceil((i+1)/10) = 3, so 3*10 = 30
          expect(pipe.transform(i)).toBe(expected);
        }
        // Special case for 30: Math.ceil((30+1)/10) = Math.ceil(3.1) = 4, so 4*10 = 40
        expect(pipe.transform(30)).toBe(100); // 60 + 40 + 0
      });
    });
  });
});
