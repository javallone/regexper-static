import '../../style.css';
import { setupGA } from '../../analytics';
import { setupRaven } from '../../sentry';

setupRaven();
setupGA();
