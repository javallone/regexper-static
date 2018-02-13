import React from 'react';
import { shallow } from 'enzyme';

jest.mock('../../sentry');

import { RavenError } from './index';
import { Raven } from '../../sentry';

const testError = { error: 'test error' };
const testDetails = { details: 'test details' };
const translate = v => `translate(${ v })`;

describe('RavenError', () => {
  test('rendering', () => {
    const component = shallow(
      <RavenError
        error={ testError }
        details={ testDetails }
        t={ translate }/>
    );
    expect(component).toMatchSnapshot();
  });

  test('captures exception', () => {
    shallow(
      <RavenError
        error={ testError }
        details={ testDetails }
        t={ translate }/>
    );
    expect(Raven.captureException).toHaveBeenCalledWith(testError, testDetails);
  });

  test('error reporting', () => {
    Raven.lastEventId.mockReturnValue(1);
    const component = shallow(
      <RavenError
        error={ testError }
        details={ testDetails }
        t={ translate }/>
    );
    const eventObj = { preventDefault: jest.fn() };
    component.find('a').simulate('click', eventObj);

    expect(eventObj.preventDefault).toHaveBeenCalled();
    expect(Raven.showReportDialog).toHaveBeenCalled();
  });
});
