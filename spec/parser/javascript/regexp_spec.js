import javascript from 'src/js/parser/javascript/parser.js';
import util from 'src/js/util.js';
import _ from 'lodash';
import Snap from 'snapsvg';

describe('parser/javascript/regexp.js', function() {

  _.forIn({
    'test': {
      proxy: jasmine.objectContaining({ textValue: 'test' })
    },
    'part 1|part 2': {
      matches: [
        jasmine.objectContaining({ textValue: 'part 1' }),
        jasmine.objectContaining({ textValue: 'part 2' })
      ]
    }
  }, (content, str) => {
    it(`parses "${str}" as a Regexp`, function() {
      var parser = new javascript.Parser(str);
      expect(parser.__consume__regexp()).toEqual(jasmine.objectContaining(content));
    });
  });

  describe('#_render', function() {

    beforeEach(function() {
      var counter = 0;

      this.node = new javascript.Parser('a|b').__consume__regexp();

      this.node.container = jasmine.createSpyObj('container', [
        'addClass',
        'group',
        'prepend',
        'path'
      ]);

      this.group = jasmine.createSpyObj('group', [
        'addClass',
        'transform',
        'group',
        'prepend',
        'path',
        'getBBox'
      ]);
      this.node.container.group.and.returnValue(this.group);
      this.group.addClass.and.returnValue(this.group);
      this.group.transform.and.returnValue(this.group);
      this.group.getBBox.and.returnValue('group bbox');
      this.group.group.and.callFake(function() {
        return `group ${counter++}`;
      });

      this.node.matches = [
        jasmine.createSpyObj('match', ['render']),
        jasmine.createSpyObj('match', ['render']),
        jasmine.createSpyObj('match', ['render'])
      ];

      this.matchDeferred = [
        this.testablePromise(),
        this.testablePromise(),
        this.testablePromise()
      ];

      this.node.matches[0].render.and.returnValue(this.matchDeferred[0].promise);
      this.node.matches[1].render.and.returnValue(this.matchDeferred[1].promise);
      this.node.matches[2].render.and.returnValue(this.matchDeferred[2].promise);

      spyOn(this.node, 'getBBox').and.returnValue('container bbox');
      spyOn(this.node, 'makeCurve').and.returnValue('curve');
      spyOn(this.node, 'makeSide').and.returnValue('side');
      spyOn(this.node, 'makeConnector').and.returnValue('connector');

      spyOn(util, 'spaceVertically');
    });

    it('creates a container for the match nodes', function() {
      this.node._render();
      expect(this.node.container.group).toHaveBeenCalled();
      expect(this.group.addClass).toHaveBeenCalledWith('regexp-matches');
      expect(this.group.transform).toHaveBeenCalledWith(Snap.matrix()
        .translate(20, 0));
    });

    it('renders each match node', function() {
      this.node._render();
      expect(this.node.matches[0].render).toHaveBeenCalledWith('group 0');
      expect(this.node.matches[1].render).toHaveBeenCalledWith('group 1');
      expect(this.node.matches[2].render).toHaveBeenCalledWith('group 2');
    });

    describe('positioning of the match nodes', function() {

      beforeEach(function() {
        this.matchDeferred[0].resolve();
        this.matchDeferred[1].resolve();
        this.matchDeferred[2].resolve();
      });

      it('spaces the nodes vertically', function(done) {
        this.node._render()
          .then(() => {
            expect(util.spaceVertically).toHaveBeenCalledWith(this.node.matches, { padding: 5 });
            done();
          });
      });

      it('renders the sides and curves into the container', function(done) {
        this.node._render()
          .then(() => {
            expect(this.node.makeCurve).toHaveBeenCalledWith('container bbox', this.node.matches[0]);
            expect(this.node.makeCurve).toHaveBeenCalledWith('container bbox', this.node.matches[1]);
            expect(this.node.makeCurve).toHaveBeenCalledWith('container bbox', this.node.matches[2]);
            expect(this.node.makeSide).toHaveBeenCalledWith('container bbox', this.node.matches[0]);
            expect(this.node.makeSide).toHaveBeenCalledWith('container bbox', this.node.matches[2]);
            expect(this.node.container.path).toHaveBeenCalledWith('curvecurvecurvesideside');
            done();
          });
      });

      it('renders the connectors into the match container', function(done) {
        this.node._render()
          .then(() => {
            expect(this.node.makeConnector).toHaveBeenCalledWith('group bbox', this.node.matches[0]);
            expect(this.node.makeConnector).toHaveBeenCalledWith('group bbox', this.node.matches[1]);
            expect(this.node.makeConnector).toHaveBeenCalledWith('group bbox', this.node.matches[2]);
            expect(this.group.path).toHaveBeenCalledWith('connectorconnectorconnector');
            done();
          });
      });

    });

  });

  describe('#madeSide', function() {

    beforeEach(function() {
      this.node = new javascript.Parser('a|b').__consume__regexp();

      this.containerBox = {
        cy: 50,
        width: 30
      };
      this.matchBox = {
      };

      this.match = jasmine.createSpyObj('match', ['getBBox']);
      this.match.getBBox.and.returnValue(this.matchBox);
    });

    describe('when the match node is 15px or more from the centerline', function() {

      describe('when the match node is above the centerline', function() {

        beforeEach(function() {
          this.matchBox.ay = 22;
        });

        it('returns the vertical sideline to the match node', function() {
          expect(this.node.makeSide(this.containerBox, this.match)).toEqual([
            'M0,50q10,0 10,-10V32',
            'M70,50q-10,0 -10,-10V32'
          ]);
        });

      });

      describe('when the match node is below the centerline', function() {

        beforeEach(function() {
          this.matchBox.ay = 88;
        });

        it('returns the vertical sideline to the match node', function() {
          expect(this.node.makeSide(this.containerBox, this.match)).toEqual([
            'M0,50q10,0 10,10V78',
            'M70,50q-10,0 -10,10V78'
          ]);
        });

      });

    });

    describe('when the match node is less than 15px from the centerline', function() {

      beforeEach(function() {
        this.matchBox.ay = 44;
      });

      it('returns nothing', function() {
        expect(this.node.makeSide(this.containerBox, this.match)).toBeUndefined();
      });

    });

  });

  describe('#makeCurve', function() {

    beforeEach(function() {
      this.node = new javascript.Parser('a|b').__consume__regexp();

      this.containerBox = {
        cy: 50,
        width: 30
      };
      this.matchBox = {};

      this.match = jasmine.createSpyObj('match', ['getBBox']);
      this.match.getBBox.and.returnValue(this.matchBox);
    });

    describe('when the match node is 15px or more from the centerline', function() {

      describe('when the match node is above the centerline', function() {

        beforeEach(function() {
          this.matchBox.ay = 22;
        });

        it('returns the curve to the match node', function() {
          expect(this.node.makeCurve(this.containerBox, this.match)).toEqual([
            'M10,32q0,-10 10,-10',
            'M60,32q0,-10 -10,-10'
          ]);
        });

      });

      describe('when the match node is below the centerline', function() {

        beforeEach(function() {
          this.matchBox.ay = 88;
        });

        it('returns the curve to the match node', function() {
          expect(this.node.makeCurve(this.containerBox, this.match)).toEqual([
            'M10,78q0,10 10,10',
            'M60,78q0,10 -10,10'
          ]);
        });

      });

    });

    describe('when the match node is less than 15px from the centerline', function() {

      describe('when the match node is above the centerline', function() {

        beforeEach(function() {
          this.matchBox.ay = 44;
        });

        it('returns the curve to the match node', function() {
          expect(this.node.makeCurve(this.containerBox, this.match)).toEqual([
            'M0,50c10,0 10,-6 20,-6',
            'M70,50c-10,0 -10,-6 -20,-6'
          ]);
        });

      });

      describe('when the match node is below the centerline', function() {

        beforeEach(function() {
          this.matchBox.ay = 55;
        });

        it('returns the curve to the match node', function() {
          expect(this.node.makeCurve(this.containerBox, this.match)).toEqual([
            'M0,50c10,0 10,5 20,5',
            'M70,50c-10,0 -10,5 -20,5'
          ]);
        });

      });

    });

  });

  describe('#makeConnector', function() {

    beforeEach(function() {
      this.node = new javascript.Parser('a|b').__consume__regexp();

      this.containerBox = {
        width: 4
      };
      this.matchBox = {
        ay: 1,
        ax: 2,
        ax2: 3
      };

      this.match = jasmine.createSpyObj('match', ['getBBox']);
      this.match.getBBox.and.returnValue(this.matchBox);
    });

    it('returns a line from the curve to the match node', function() {
      expect(this.node.makeConnector(this.containerBox, this.match)).toEqual('M0,1h2M3,1H4');
    });

  });

});
