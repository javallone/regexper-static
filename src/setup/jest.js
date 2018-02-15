import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

const env = { ...process.env };

beforeEach(() => {
  process.env = {
    ...process.env
  };
});

afterEach(() => {
  process.env = env;
});
