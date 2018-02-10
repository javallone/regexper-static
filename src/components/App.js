import React from 'react';

import Message from './Message';

import GithubIcon from 'feather-icons/dist/icons/github.svg';
import DownloadIcon from 'feather-icons/dist/icons/download.svg';
import LinkIcon from 'feather-icons/dist/icons/link.svg';
import ChevronsDownIcon from 'feather-icons/dist/icons/chevrons-down.svg';
import ErrorIcon from 'feather-icons/dist/icons/alert-octagon.svg';

const App = () => <Message icon={ ErrorIcon } heading="React App">
  <p>Placeholder app content</p>
</Message>;

export default App;
