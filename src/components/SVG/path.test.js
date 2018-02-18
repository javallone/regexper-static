import Path from './path';

describe('Path', () => {
  [
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
  ].forEach(([ cmd, args, str ], i) => (
    test(`case #${ i }`, () => {
      const path = new Path();
      path[cmd](args);
      expect(path.toString()).toEqual(str);
    })
  ));
});
