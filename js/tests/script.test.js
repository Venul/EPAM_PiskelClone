import Script from '../script';

describe('first script', () => {
  it('should be function', () => {
    expect(Script.onChangeAnimationSpeed).toBeInstanceOf(function);
  });
});
