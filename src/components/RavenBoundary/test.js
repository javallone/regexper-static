import React from 'react';
import { shallow } from 'enzyme';

import RavenBoundary from 'components/RavenBoundary';

const testError = { error: 'test error' };
const testDetails = { details: 'test details' };

describe('RavenBoundary', () => {
  test('rendering', () => {
    const Child = () => <b>Child</b>;
    const component = shallow(
      <RavenBoundary>
        <Child/>
      </RavenBoundary>
    );
    expect(component).toMatchSnapshot();
  });

  test('rendering (with error)', () => {
    const Child = () => <b>Child</b>;
    const component = shallow(
      <RavenBoundary>
        <Child/>
      </RavenBoundary>
    );
    expect(component).toMatchSnapshot();
    component.instance().componentDidCatch(testError, testDetails);
    component.update();
    expect(component).toMatchSnapshot();
  });
});
