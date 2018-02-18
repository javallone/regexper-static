import Path from './path';

describe('Path', () => {
  [
    // moveTo
    [ 'moveTo', { x: 5, y: 1 }, 'M5,1' ],
    [ 'moveTo', { x: 5, y: 1, relative: true }, 'm5,1' ],
    // lineTo
    [ 'lineTo', { x: 5, y: 1 }, 'L5,1' ],
    [ 'lineTo', { x: 5, y: 0 }, 'H5'   ],
    [ 'lineTo', { x: 0, y: 1 }, 'V1'   ],
    [ 'lineTo', { x: 0, y: 0 }, ''     ],
    [ 'lineTo', { x: 5 }, 'H5' ],
    [ 'lineTo', { y: 1 }, 'V1' ],
    [ 'lineTo', {}, '' ],
    [ 'lineTo', { x: 5, y: 1, relative: true }, 'l5,1' ],
    [ 'lineTo', { x: 5, y: 0, relative: true }, 'h5'   ],
    [ 'lineTo', { x: 0, y: 1, relative: true }, 'v1'   ],
    [ 'lineTo', { x: 0, y: 0, relative: true }, ''     ],
    [ 'lineTo', { x: 5, relative: true }, 'h5' ],
    [ 'lineTo', { y: 1, relative: true }, 'v1' ],
    [ 'lineTo', { relative: true }, '' ],
    // cubicCurveTo
    [ 'cubicCurveTo', { cx1: 5, cy1: 6, cx2: 10, cy2: 11, x: 15, y: 16 }, 'C5,6 10,11 15,16' ],
    [ 'cubicCurveTo', { cx2: 10, cy2: 11, x: 15, y: 16 }, 'S10,11 15,16' ],
    [ 'cubicCurveTo', { cx1: 5, cy1: 6, cx2: 10, cy2: 11, x: 15, y: 16, relative: true }, 'c5,6 10,11 15,16' ],
    [ 'cubicCurveTo', { cx2: 10, cy2: 11, x: 15, y: 16, relative: true }, 's10,11 15,16' ]
  ].forEach(([ cmd, args, str ], i) => (
    test(`case #${ i }`, () => {
      const path = new Path();
      path[cmd](args);
      expect(path.toString()).toEqual(str);
    })
  ));

  test('path resetting with closePath', () => {
    const path = new Path()
      .moveTo({ x: 5, y: 5 })
      .lineTo({ x: 5, y: 5, relative: true })
      .closePath()
      .lineTo({ x: 5, y: 5 });
    expect(path.toString()).toEqual('M5,5l5,5Z'); // Last lineTo is ignored since it goes nowhere
  });
});
