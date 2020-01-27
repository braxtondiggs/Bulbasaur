import { SkillPipe } from './skill.pipe';

describe('Pipe: Default', () => {
  let pipe: SkillPipe;

  beforeEach(() => {
    pipe = new SkillPipe();
  });

  it('providing a value less than 0 returns a magical number', () => {
    expect(pipe.transform(-5)).toBe(65);
  });
  it('providing a value less than 30 and greater than 0 returns a magical number', () => {
    expect(pipe.transform(13)).toBe(83);
  });
  it('providing a value over 30 returns 100', () => {
    expect(pipe.transform(59)).toBe(100);
  });
});
