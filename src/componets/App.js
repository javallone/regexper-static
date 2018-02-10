import React from 'react';

import GithubIcon from 'feather-icons/dist/icons/github.svg';
import DownloadIcon from 'feather-icons/dist/icons/download.svg';
import LinkIcon from 'feather-icons/dist/icons/link.svg';
import ChevronsDownIcon from 'feather-icons/dist/icons/chevrons-down.svg';
import ErrorIcon from 'feather-icons/dist/icons/alert-octagon.svg';

const App = () => <React.Fragment>
  <h1>React App</h1>
  <ul>
    <li><GithubIcon/>GitHub</li>
    <li><DownloadIcon/>Download</li>
    <li><LinkIcon/>Permalink</li>
    <li><ChevronsDownIcon/>Open</li>
    <li><ErrorIcon/>Error</li>
  </ul>
</React.Fragment>;

export default App;
