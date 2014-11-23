import * as demo from '../src/js/demo';

describe('Demo', () => {

  it('returns 1 from test1', () => {
    expect(demo.test1()).toEqual(1);
  });

  it('returns "two" from test2', () => {
    expect(demo.test2()).toEqual('two');
  });

});
